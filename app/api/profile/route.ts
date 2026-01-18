import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401, headers: corsHeaders },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    // Return all user details
    return NextResponse.json(
      {
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        membership: user.membership,
        credits: user.credits,
        resumeUrl: user.resumeUrl,
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
        image: user.image || "/placeholder.jpg",
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders },
    );
  }
}
