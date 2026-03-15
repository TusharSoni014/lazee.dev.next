"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: any) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        resumeUrl: data.resumeUrl,
        countryCode: data.countryCode,
        phoneNumber: data.phoneNumber,
        country: data.country,
        noticePeriod: data.noticePeriod ? parseInt(data.noticePeriod) : null,
        jobType: data.jobType,
        linkedin: data.linkedin,
        twitter: data.twitter,
        github: data.github,
        portfolio: data.portfolio,
        telegram: data.telegram,
        other: data.other,
        currency: data.currency,
        currentCtc: data.currentCtc ? parseFloat(data.currentCtc) : null,
        skills: data.skills || [],
        specificQuestionGuidance: data.specificQuestionGuidance,
      },
    });

    revalidatePath("/profile");
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
            videoUrl: proj.videoUrl || null,
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
