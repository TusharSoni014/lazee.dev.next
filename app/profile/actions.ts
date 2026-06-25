"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getS3Client } from "@/lib/s3";
import { getR2KeyFromUrl } from "@/lib/utils";

export async function updateProfile(data: any) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const updateData: any = {};

  if (data.firstName !== undefined) updateData.firstName = data.firstName;
  if (data.middleName !== undefined) updateData.middleName = data.middleName;
  if (data.lastName !== undefined) updateData.lastName = data.lastName;
  if (data.resumeUrl !== undefined) updateData.resumeUrl = data.resumeUrl;
  if (data.countryCode !== undefined) updateData.countryCode = data.countryCode;
  if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
  if (data.country !== undefined) updateData.country = data.country;
  if (data.jobType !== undefined) updateData.jobType = data.jobType;
  if (data.linkedin !== undefined) updateData.linkedin = data.linkedin;
  if (data.twitter !== undefined) updateData.twitter = data.twitter;
  if (data.github !== undefined) updateData.github = data.github;
  if (data.portfolio !== undefined) updateData.portfolio = data.portfolio;
  if (data.telegram !== undefined) updateData.telegram = data.telegram;
  if (data.other !== undefined) updateData.other = data.other;
  if (data.currency !== undefined) updateData.currency = data.currency;
  if (data.specificQuestionGuidance !== undefined) updateData.specificQuestionGuidance = data.specificQuestionGuidance;
  if (data.coverLetter !== undefined) updateData.coverLetter = data.coverLetter;

  if (data.city !== undefined) updateData.city = data.city;
  if (data.collegeName !== undefined) updateData.collegeName = data.collegeName;
  if (data.introVideo !== undefined) updateData.introVideo = data.introVideo;

  if (data.gender !== undefined) updateData.gender = data.gender;
  if (data.veteranStatus !== undefined) updateData.veteranStatus = data.veteranStatus;
  if (data.disabilityStatus !== undefined) updateData.disabilityStatus = data.disabilityStatus;

  if (data.noticePeriod !== undefined) {
    updateData.noticePeriod = data.noticePeriod ? parseInt(data.noticePeriod) : null;
  }
  if (data.currentCtc !== undefined) {
    updateData.currentCtc = data.currentCtc ? parseFloat(data.currentCtc) : null;
  }
  if (data.skills !== undefined) {
    updateData.skills = data.skills || [];
  }
  if (data.contactEmail !== undefined) {
    updateData.contactEmail = data.contactEmail ? data.contactEmail.trim() : null;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { username: true }
    });

    revalidatePath("/profile");
    if (updatedUser.username) {
      revalidatePath(`/profile/${updatedUser.username}`);
    }
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update profile:", error);
    return { error: error.message || "Failed to update profile" };
  }
}

export async function checkUsernameAvailability(username: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const normalizedUsername = username.toLowerCase().trim();

  if (normalizedUsername.length < 3) {
    return { error: "Username must be at least 3 characters" };
  }

  if (!/^[a-z0-9-]+$/.test(normalizedUsername)) {
    return { error: "Username can only contain letters, numbers, and hyphens" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username: normalizedUsername },
    });

    return { 
      available: !existingUser || existingUser.id === session.user.id, 
      normalizedUsername 
    };
  } catch (error) {
    console.error("Error checking username availability:", error);
    return { error: "Failed to check availability" };
  }
}

export async function updateUsername(username: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const normalizedUsername = username.toLowerCase().trim();

  if (normalizedUsername.length < 3) {
    return { error: "Username must be at least 3 characters" };
  }

  if (!/^[a-z0-9-]+$/.test(normalizedUsername)) {
    return { error: "Username can only contain letters, numbers, and hyphens" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username: normalizedUsername },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return { error: "Username already taken" };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { username: normalizedUsername },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update username:", error);
    return { error: error.message || "Failed to update username" };
  }
}

export async function updateExperiences(experiences: any[]) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        experiences: {
          deleteMany: {},
          create: experiences.map((exp: any) => ({
            companyName: exp.companyName,
            role: exp.role || null,
            location: exp.location || null,
            companyWebsite: exp.companyWebsite || null,
            startDate: exp.startDate ? new Date(exp.startDate) : null,
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            isCurrent: Boolean(exp.isCurrent),
            description: exp.description || null,
          })),
        },
      },
    });
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update experiences:", error);
    return { error: "Failed to update experiences" };
  }
}

export async function updateProjects(projects: any[]) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        projects: {
          deleteMany: {},
          create: projects.map((proj: any) => ({
            name: proj.name,
            role: proj.role || null,
            contribution: proj.contribution || null,
            duration: proj.duration || null,
            activeLink: proj.activeLink || null,
            githubLink: proj.githubLink || null,
            logoUrl: proj.logoUrl || null,
            screenshots: proj.screenshots || [],
            stacks: proj.stacks || [],
            description: proj.description || null,
            isTopProject: Boolean(proj.isTopProject),
          })),
        },
      },
    });
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update projects:", error);
    return { error: "Failed to update projects" };
  }
}

export async function savePublicProfileSettings(data: {
  username: string;
  contactEmail: string;
  primaryResumeId: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const normalizedUsername = data.username.toLowerCase().trim();

  if (normalizedUsername.length < 3) {
    return { error: "Username must be at least 3 characters" };
  }

  if (!/^[a-z0-9-]+$/.test(normalizedUsername)) {
    return { error: "Username can only contain letters, numbers, and hyphens" };
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.contactEmail)) {
    return { error: "Please enter a valid contact email address" };
  }

  try {
    // Check username availability
    const existingUser = await prisma.user.findUnique({
      where: { username: normalizedUsername },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return { error: "Username already taken" };
    }

    // Verify the resume belongs to the user
    const resume = await prisma.resume.findUnique({
      where: { id: data.primaryResumeId },
    });

    if (!resume || resume.userId !== session.user.id) {
      return { error: "Selected resume not found or unauthorized" };
    }

    // Perform database updates in a transaction
    await prisma.$transaction([
      // Update username and contact email on user
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          username: normalizedUsername,
          contactEmail: data.contactEmail.trim(),
        },
      }),
      // Set all of user's resumes to not primary
      prisma.resume.updateMany({
        where: { userId: session.user.id },
        data: { isPrimary: false },
      }),
      // Set selected resume to primary
      prisma.resume.update({
        where: { id: data.primaryResumeId },
        data: { isPrimary: true },
      }),
    ]);

    revalidatePath("/profile");
    revalidatePath(`/profile/${normalizedUsername}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save public profile settings:", error);
    return { error: error.message || "Failed to save settings" };
  }
}

export async function disablePublicSharing() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { username: true }
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: { username: null },
    });

    revalidatePath("/profile");
    if (user?.username) {
      revalidatePath(`/profile/${user.username}`);
    }
    return { success: true };
  } catch (error: any) {
    console.error("Failed to disable public sharing:", error);
    return { error: error.message || "Failed to disable sharing" };
  }
}

export async function uploadProjectScreenshot(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return { error: "User not found" };

  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };
  if (!file.type.startsWith("image/")) {
    return { error: "Only image formats (PNG, JPG, WEBP, etc.) are allowed" };
  }
  if (file.size > 2 * 1024 * 1024) {
    return { error: "File size exceeds 2MB limit" };
  }

  const { s3, bucketName } = getS3Client();
  const fileExtension = file.name.split(".").pop();
  const uniqueId = uuidv4();
  const key = `screenshots/${user.id}/${uniqueId}.${fileExtension}`;

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

    const publicUrlBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-889628534b094cf89bcd7cd93528323d.r2.dev";
    const publicUrl = `${publicUrlBase}/${key}`;
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Failed to upload screenshot to S3:", error);
    return { error: "Failed to upload screenshot" };
  }
}

export async function uploadProjectLogo(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return { error: "User not found" };

  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };
  if (!file.type.startsWith("image/")) {
    return { error: "Only image formats (PNG, JPG, WEBP, etc.) are allowed" };
  }
  if (file.size > 1 * 1024 * 1024) {
    return { error: "File size exceeds 1MB limit" };
  }

  const { s3, bucketName } = getS3Client();
  const fileExtension = file.name.split(".").pop();
  const uniqueId = uuidv4();
  const key = `logos/${user.id}/${uniqueId}.${fileExtension}`;

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

    const publicUrlBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-889628534b094cf89bcd7cd93528323d.r2.dev";
    const publicUrl = `${publicUrlBase}/${key}`;
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Failed to upload logo to S3:", error);
    return { error: "Failed to upload logo" };
  }
}

export async function deleteProjectFile(url: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const key = getR2KeyFromUrl(url);
  if (!key) return { error: "Invalid file URL" };

  // Verify that the file belongs to the authenticated user
  const parts = key.split("/");
  const userIdInKey = parts[1];
  if (userIdInKey !== session.user.id) {
    return { error: "Unauthorized file deletion" };
  }

  const { s3, bucketName } = getS3Client();
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );
    return { success: true };
  } catch (error) {
    console.error("Failed to delete file from S3:", error);
    return { error: "Failed to delete file from server" };
  }
}

export async function updateEducation(educations: any[]) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        educations: {
          deleteMany: {},
          create: educations.map((edu: any) => ({
            schoolName: edu.schoolName,
            degree: edu.degree || null,
            fieldOfStudy: edu.fieldOfStudy || null,
            startDate: edu.startDate ? new Date(edu.startDate) : null,
            endDate: edu.endDate ? new Date(edu.endDate) : null,
            isCurrent: Boolean(edu.isCurrent),
            description: edu.description || null,
          })),
        },
      },
      select: { username: true }
    });
    revalidatePath("/profile");
    if (user.username) {
      revalidatePath(`/profile/${user.username}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to update education:", error);
    return { error: "Failed to update education" };
  }
}





