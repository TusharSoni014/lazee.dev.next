"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { getS3Client } from "@/lib/s3";

export async function getResumes() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { resumes: { orderBy: { version: "desc" } } },
  });

  if (!user) return { error: "User not found" };

  return { success: true, resumes: user.resumes, membership: user.membership };
}

export async function uploadResumeDirect(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { resumes: true },
  });

  if (!user) return { error: "User not found" };

  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };
  if (file.type !== "application/pdf")
    return { error: "Only PDF format is strongly recommended/allowed" };
  if (file.size > 5 * 1024 * 1024)
    return { error: "File size exceeds 5MB limit" };

  // Check limits
  const maxResumes = user.membership === "PRO" ? 10 : 1;
  if (user.resumes.length >= maxResumes) {
    return {
      error: `Your ${user.membership} plan allows a maximum of ${maxResumes} resume${maxResumes > 1 ? "s" : ""}. Please delete an existing resume to upload a new one.`,
    };
  }

  const { s3, bucketName } = getS3Client();
  const fileExtension = file.name.split(".").pop();
  const uniqueId = uuidv4();
  const key = `resumes/${user.id}/${uniqueId}.${fileExtension}`;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    const version = user.resumes.length + 1;
    // URL or presigned url. Cloudflare R2 files aren't public unless custom domain configured.
    // We will just store the key and generate presigned URLs on demand or standard public url if available.
    // Using the same environment variable for URL format:
    const publicUrl = `${process.env.CLOUDFLARE_S3_BUCKET}/${key}`;

    await prisma.resume.create({
      data: {
        userId: user.id,
        key: key,
        url: publicUrl,
        name: file.name,
        version: version,
        isPrimary: user.resumes.length === 0,
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to upload resume to S3:", error);
    return { error: "Failed to upload resume" };
  }
}

export async function deleteResume(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return { error: "User not found" };

  const resume = await prisma.resume.findUnique({
    where: { id },
  });

  if (!resume || resume.userId !== user.id) {
    return { error: "Resume not found or unauthorized" };
  }

  try {
    const { s3, bucketName } = getS3Client();
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: resume.key,
      }),
    );

    await prisma.resume.delete({
      where: { id },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete resume:", error);
    return { error: "Failed to delete resume" };
  }
}

export async function getPresignedUrl(resumeId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return { error: "User not found" };

  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
  });

  if (!resume || resume.userId !== user.id) {
    return { error: "Resume not found or unauthorized" };
  }

  try {
    const { s3, bucketName } = getS3Client();
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: resume.key,
    });

    // Expires in 1 hour
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return { success: true, url: presignedUrl };
  } catch (error) {
    console.error("Failed to generate presigned URL:", error);
    return { error: "Failed to load resume" };
  }
}
