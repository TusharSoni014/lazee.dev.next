import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkAndRefreshCredits } from "@/lib/credits";
import { getCorsHeaders } from "@/lib/cors";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return NextResponse.json({}, { headers: getCorsHeaders(origin) });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401, headers: corsHeaders },
      );
    }

    // Rate limiting
    const rateLimit = checkRateLimit(
      `profile:${session.user.email}`,
      RATE_LIMITS.profile,
    );
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Too many requests. Please try again in ${rateLimit.resetIn} seconds.`,
        },
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Retry-After": String(rateLimit.resetIn),
          },
        },
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
        educations: {
          orderBy: {
            startDate: "desc",
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: corsHeaders },
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
        username: user.username,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        membership: user.membership,
        credits: user.credits,
        dodoCustomerId: user.dodoCustomerId,
        resumeUrl: user.resumeUrl,
        resumes: user.resumes,
        countryCode: user.countryCode,
        phoneNumber: user.phoneNumber,
        country: user.country,
        city: user.city,
        collegeName: user.collegeName,
        educations: user.educations,
        introVideo: user.introVideo,
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
        contactEmail: user.contactEmail,
        gender: user.gender,
        veteranStatus: user.veteranStatus,
        disabilityStatus: user.disabilityStatus,
        postalCode: user.postalCode,
      },
      {
        headers: {
          ...corsHeaders,
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders },
    );
  }
}
