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
import { inspectPdfBuffer } from "@/lib/pdf-inspector";
import {
  parseResumeFromInspection,
  summarizeParsedResume,
  type ParsedResumeProfile,
} from "@/lib/resume-parser";
import {
  updateProfile,
  updateExperiences,
  updateEducation,
  updateProjects,
} from "./actions";

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
    const shouldInspect = formData.get("inspectPdf") === "true";

    if (shouldInspect) {
      inspectPdfBuffer(buffer);
    }

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

    if (user.username) {
      revalidatePath(`/u/${user.username}`);
    }
    return { success: true, inspected: shouldInspect };
  } catch (error) {
    console.error("Failed to upload resume to S3:", error);
    return { error: "Failed to upload resume" };
  }
}

function buildProfilePatch(
  parsed: ParsedResumeProfile,
  user: {
    firstName: string | null;
    lastName: string | null;
    middleName: string | null;
    contactEmail: string | null;
    phoneNumber: string | null;
    countryCode: string | null;
    linkedin: string | null;
    github: string | null;
    twitter: string | null;
    portfolio: string | null;
    jobType: string | null;
    skills: string[];
  },
  mode: "empty-only" | "overwrite",
) {
  const patch: Record<string, unknown> = {};
  const shouldSet = (current: string | null | undefined, next?: string) => {
    if (!next?.trim()) return false;
    return mode === "overwrite" || !current?.trim();
  };

  if (shouldSet(user.firstName, parsed.firstName?.value)) {
    patch.firstName = parsed.firstName!.value;
  }
  if (shouldSet(user.middleName, parsed.middleName?.value)) {
    patch.middleName = parsed.middleName!.value;
  }
  if (shouldSet(user.lastName, parsed.lastName?.value)) {
    patch.lastName = parsed.lastName!.value;
  }
  if (shouldSet(user.contactEmail, parsed.contactEmail?.value)) {
    patch.contactEmail = parsed.contactEmail!.value;
  }
  if (shouldSet(user.phoneNumber, parsed.phoneNumber?.value)) {
    patch.phoneNumber = parsed.phoneNumber!.value;
  }
  if (shouldSet(user.countryCode, parsed.countryCode?.value)) {
    patch.countryCode = parsed.countryCode!.value;
  }
  if (shouldSet(user.linkedin, parsed.linkedin?.value)) {
    patch.linkedin = parsed.linkedin!.value;
  }
  if (shouldSet(user.github, parsed.github?.value)) {
    patch.github = parsed.github!.value;
  }
  if (shouldSet(user.twitter, parsed.twitter?.value)) {
    patch.twitter = parsed.twitter!.value;
  }
  if (shouldSet(user.portfolio, parsed.portfolio?.value)) {
    patch.portfolio = parsed.portfolio!.value;
  }
  if (shouldSet(user.jobType, parsed.jobType?.value)) {
    patch.jobType = parsed.jobType!.value;
  }

  if (parsed.skills?.value?.length) {
    if (mode === "overwrite" || user.skills.length === 0) {
      patch.skills = parsed.skills.value;
    } else {
      patch.skills = [...new Set([...user.skills, ...parsed.skills.value])];
    }
  }

  return patch;
}

export async function applyResumeAutofillFromPdf(
  formData: FormData,
  options?: { mode?: "empty-only" | "overwrite" },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };
  if (file.type !== "application/pdf")
    return { error: "Only PDF format is strongly recommended/allowed" };
  if (file.size > 5 * 1024 * 1024)
    return { error: "File size exceeds 5MB limit" };

  const mode = options?.mode ?? "empty-only";

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        experiences: true,
        educations: true,
        projects: true,
      },
    });

    if (!user) return { error: "User not found" };

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const inspection = inspectPdfBuffer(buffer);
    const parsed = parseResumeFromInspection(inspection);
    const summary = summarizeParsedResume(parsed);

    const profilePatch = buildProfilePatch(parsed, user, mode);
    if (Object.keys(profilePatch).length > 0) {
      const profileResult = await updateProfile(profilePatch);
      if (profileResult.error) return { error: profileResult.error };
    }

    if (
      parsed.experiences?.value?.length &&
      (mode === "overwrite" || user.experiences.length === 0)
    ) {
      const experienceResult = await updateExperiences(parsed.experiences.value);
      if (experienceResult.error) return { error: experienceResult.error };
    }

    if (
      parsed.educations?.value?.length &&
      (mode === "overwrite" || user.educations.length === 0)
    ) {
      const educationResult = await updateEducation(parsed.educations.value);
      if (educationResult.error) return { error: educationResult.error };
    }

    if (
      parsed.projects?.value?.length &&
      (mode === "overwrite" || user.projects.length === 0)
    ) {
      const projectResult = await updateProjects(
        parsed.projects.value.map((project) => ({
          name: project.name,
          role: project.role || null,
          contribution: null,
          duration: null,
          activeLink: project.activeLink || null,
          githubLink: null,
          logoUrl: null,
          screenshots: [],
          stacks: project.stacks || [],
          description: project.description || null,
          isTopProject: false,
        })),
      );
      if (projectResult.error) return { error: projectResult.error };
    }

    if (user.username) {
      revalidatePath(`/u/${user.username}`);
    }

    return {
      success: true,
      summary,
      parsed,
    };
  } catch (error) {
    console.error("Failed to autofill from resume:", error);
    return { error: "Failed to autofill profile from resume" };
  }
}

export async function inspectResumePdf(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };
  if (file.type !== "application/pdf")
    return { error: "Only PDF format is strongly recommended/allowed" };
  if (file.size > 5 * 1024 * 1024)
    return { error: "File size exceeds 5MB limit" };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const inspection = inspectPdfBuffer(buffer);
    const parsed = parseResumeFromInspection(inspection);
    const summary = summarizeParsedResume(parsed);

    return {
      success: true,
      parsed,
      summary,
      inspection: {
        classification: inspection.classification,
        detection: {
          pdfType: inspection.detection.pdfType,
          pageCount: inspection.detection.pageCount,
          processingTimeMs: inspection.detection.processingTimeMs,
          pagesNeedingOcr: inspection.detection.pagesNeedingOcr,
          ocrReasonsByPage: inspection.detection.ocrReasonsByPage,
          title: inspection.detection.title,
          confidence: inspection.detection.confidence,
          isComplexLayout: inspection.detection.isComplexLayout,
          pagesWithTables: inspection.detection.pagesWithTables,
          pagesWithColumns: inspection.detection.pagesWithColumns,
          hasEncodingIssues: inspection.detection.hasEncodingIssues,
          markdownLength: inspection.detection.markdown?.length ?? 0,
        },
        plainTextLength: inspection.plainText.length,
        textItemCount: inspection.textWithPositions.length,
        pagesMarkdown: inspection.pagesMarkdown,
        processed: {
          pdfType: inspection.processed.pdfType,
          pageCount: inspection.processed.pageCount,
          processingTimeMs: inspection.processed.processingTimeMs,
          pagesNeedingOcr: inspection.processed.pagesNeedingOcr,
          confidence: inspection.processed.confidence,
          isComplexLayout: inspection.processed.isComplexLayout,
          markdownLength: inspection.processed.markdown?.length ?? 0,
        },
      },
    };
  } catch (error) {
    console.error("Failed to inspect PDF:", error);
    return { error: "Failed to inspect PDF" };
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

    if (user.username) {
      revalidatePath(`/u/${user.username}`);
    }
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
