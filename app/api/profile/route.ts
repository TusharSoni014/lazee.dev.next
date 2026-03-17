import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkAndRefreshCredits } from "@/lib/credits";

// CORS headers
// Helper to get CORS headers
function getCorsHeaders(origin: string | null) {
  // Allow extension, localhost, and production domain
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

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    // Passive credit refresh
    await checkAndRefreshCredits(session.user.email);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        resumes: {
          orderBy: {
            createdAt: "desc",
          },
        },
        experiences: {
          orderBy: {
            startDate: "desc",
          },
        },
        projects: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    // Construct full name if missing
    const fullName =
      user.name ||
      [user.firstName, user.middleName, user.lastName]
        .filter(Boolean)
        .join(" ");

    // Return all user details
    return NextResponse.json(
      {
        id: user.id,
        name: fullName,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        membership: user.membership,
        credits: user.credits,
        resumeUrl: user.resumeUrl,
        resumes: user.resumes,
        countryCode: user.countryCode,
        phoneNumber: user.phoneNumber,
        country: user.country,
        noticePeriod: user.noticePeriod,
        linkedin: user.linkedin,
        twitter: user.twitter,
        github: user.github,
        portfolio: user.portfolio,
        currency: user.currency,
        currentCtc: user.currentCtc,
        experiences: user.experiences,
        projects: user.projects,
        skills: user.skills,
        specificQuestionGuidance: user.specificQuestionGuidance,
        coverLetter: user.coverLetter,
        jobType: user.jobType,
        telegram: user.telegram,
        other: user.other,
        image: user.image,
      },
      { headers: getCorsHeaders(request.headers.get("origin")) },
    );
  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: getCorsHeaders(request.headers.get("origin")) },
    );
  }
}
