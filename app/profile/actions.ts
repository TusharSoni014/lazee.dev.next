"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: any) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Not authenticated" };
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        resumeUrl: data.resumeUrl,
        countryCode: data.countryCode,
        phoneNumber: data.phoneNumber,
        country: data.country,
        noticePeriod: data.noticePeriod ? parseInt(data.noticePeriod) : null,
        linkedin: data.linkedin,
        twitter: data.twitter,
        github: data.github,
        portfolio: data.portfolio,
        currency: data.currency,
        currentCtc: data.currentCtc ? parseFloat(data.currentCtc) : null,
        skills: data.skills || [],
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update profile", error);
    return { error: error.message || "Failed to update profile" };
  }
}

export async function updateExperiences(experiences: any[]) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Not authenticated" };
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        experiences: {
          deleteMany: {},
          create: experiences.map((exp: any) => ({
            companyName: exp.companyName,
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
    console.error("Failed to update experiences", error);
    return { error: "Failed to update experiences" };
  }
}

export async function updateProjects(projects: any[]) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Not authenticated" };
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        projects: {
          deleteMany: {},
          create: projects.map((proj: any) => ({
            name: proj.name,
            activeLink: proj.activeLink || null,
            githubLink: proj.githubLink || null,
            logoUrl: proj.logoUrl || null,
            videoUrl: proj.videoUrl || null,
            stacks: proj.stacks || [],
            description: proj.description || null,
          })),
        },
      },
    });
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update projects", error);
    return { error: "Failed to update projects" };
  }
}
