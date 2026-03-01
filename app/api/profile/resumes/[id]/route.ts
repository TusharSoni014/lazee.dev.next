import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getS3Client() {
  const cloudflareBucketUrl = process.env.CLOUDFLARE_S3_BUCKET || "";
  let endpointUrl = "https://example.r2.cloudflarestorage.com";
  let bucketName = "lazee-dev";

  try {
    if (cloudflareBucketUrl) {
      const url = new URL(cloudflareBucketUrl);
      endpointUrl = `${url.protocol}//${url.host}`;
      bucketName = url.pathname.slice(1);
    }
  } catch (e) {
    console.error("Failed to parse CLOUDFLARE_S3_BUCKET", e);
  }

  const s3 = new S3Client({
    region: "auto",
    endpoint: endpointUrl,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "mock-access-key",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "mock-secret-key",
    },
  });

  return { s3, bucketName };
}

function getCorsHeaders(origin: string | null) {
  const isValidOrigin =
    origin &&
    (origin.startsWith("chrome-extension://") ||
      origin.includes("localhost") ||
      origin.includes("lazee.dev"));

  return {
    "Access-Control-Allow-Origin": isValidOrigin ? origin : "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return NextResponse.json({}, { headers: getCorsHeaders(origin) });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    const paramsResolved = await params;
    const resumeId = paramsResolved.id;

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume || resume.userId !== user.id) {
      return NextResponse.json(
        { error: "Resume not found or unauthorized" },
        { status: 404, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    const { s3, bucketName } = getS3Client();
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: resume.key,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return NextResponse.json(
      { success: true, url: presignedUrl },
      { headers: getCorsHeaders(request.headers.get("origin")) },
    );
  } catch (error) {
    console.error("Resume Presigned URL Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: getCorsHeaders(request.headers.get("origin")) },
    );
  }
}
