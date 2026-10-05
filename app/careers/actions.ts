"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function checkIsAdmin() {
  const session = await auth();
  if (!session?.user?.email) {
    return false;
  }

  const email = session.user.email.toLowerCase();
  if (email === "techandrow@gmail.com") {
    return true;
  }

  if (session.user.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true, email: true },
    });
    return Boolean(
      dbUser?.isAdmin || dbUser?.email?.toLowerCase() === "techandrow@gmail.com"
    );
  }

  return false;
}

export type JobInput = {
  title: string;
  department?: string;
  location: string;
  type?: string;
  workplaceType?: string;
  compensation?: string;
  experience?: string;
  description: string;
  requirements?: string;
  isOpen?: boolean;
};

export async function createJobAction(data: JobInput) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { error: "Unauthorized: Only administrators can create job postings." };
  }

  if (!data.title?.trim()) {
    return { error: "Job title is required." };
  }
  if (!data.location?.trim()) {
    return { error: "Job location is required." };
  }
  if (!data.description?.trim()) {
    return { error: "Job description is required." };
  }

  try {
    const job = await prisma.job.create({
      data: {
        title: data.title.trim(),
        department: data.department?.trim() || "Engineering",
        location: data.location.trim(),
        type: data.type?.trim() || "Full-time",
        workplaceType: data.workplaceType?.trim() || "Remote",
        compensation: data.compensation?.trim() || null,
        experience: data.experience?.trim() || null,
        description: data.description.trim(),
        requirements: data.requirements?.trim() || null,
        isOpen: data.isOpen !== undefined ? data.isOpen : true,
        applyEmail: "careers@lazee.dev",
      },
    });

    revalidatePath("/careers");
    return { success: true, job };
  } catch (error: any) {
    console.error("Failed to create job:", error);
    return { error: error.message || "Failed to create job posting." };
  }
}

export async function updateJobAction(id: string, data: Partial<JobInput>) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { error: "Unauthorized: Only administrators can update job postings." };
  }

  try {
    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) {
      return { error: "Job posting not found." };
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.department !== undefined) updateData.department = data.department.trim();
    if (data.location !== undefined) updateData.location = data.location.trim();
    if (data.type !== undefined) updateData.type = data.type.trim();
    if (data.workplaceType !== undefined) updateData.workplaceType = data.workplaceType.trim();
    if (data.compensation !== undefined) updateData.compensation = data.compensation.trim() || null;
    if (data.experience !== undefined) updateData.experience = data.experience.trim() || null;
    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.requirements !== undefined) updateData.requirements = data.requirements.trim() || null;
    if (data.isOpen !== undefined) updateData.isOpen = data.isOpen;

    const job = await prisma.job.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/careers");
    return { success: true, job };
  } catch (error: any) {
    console.error("Failed to update job:", error);
    return { error: error.message || "Failed to update job posting." };
  }
}

export async function deleteJobAction(id: string) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { error: "Unauthorized: Only administrators can delete job postings." };
  }

  try {
    await prisma.job.delete({ where: { id } });
    revalidatePath("/careers");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete job:", error);
    return { error: error.message || "Failed to delete job posting." };
  }
}

export async function toggleJobStatusAction(id: string) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { error: "Unauthorized: Only administrators can toggle job status." };
  }

  try {
    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) {
      return { error: "Job posting not found." };
    }

    const updated = await prisma.job.update({
      where: { id },
      data: { isOpen: !existing.isOpen },
    });

    revalidatePath("/careers");
    return { success: true, isOpen: updated.isOpen };
  } catch (error: any) {
    console.error("Failed to toggle job status:", error);
    return { error: error.message || "Failed to toggle job status." };
  }
}
