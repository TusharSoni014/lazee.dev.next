import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getS3Client } from "@/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getCorsHeaders } from "@/lib/cors";

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return NextResponse.json({}, { headers: getCorsHeaders(origin) });
}

export async function DELETE(request: NextRequest) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401, headers: corsHeaders }
      );
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Clean up S3 resumes
    try {
      const resumes = await prisma.resume.findMany({
        where: { userId },
        select: { key: true },
      });

      if (resumes.length > 0) {
        const { s3, bucketName } = getS3Client();
        await Promise.allSettled(
          resumes.map((r) =>
            s3.send(
              new DeleteObjectCommand({
                Bucket: bucketName,
                Key: r.key,
              })
            )
          )
        );
      }
    } catch (s3Error) {
      console.warn("Failed to delete S3 resumes during account deletion:", s3Error);
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Error deleting user account:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete account" },
      { status: 500, headers: corsHeaders }
    );
  }
}
