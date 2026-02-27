"use server";

import prisma from "@/lib/prisma";

export async function requestEarlyAccess(formData: FormData) {
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    return { error: "Invalid email" };
  }

  try {
    await prisma.earlyAccess.create({
      data: { email },
    });
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "Email already exists" };
    }
    return { error: "Something went wrong" };
  }
}
