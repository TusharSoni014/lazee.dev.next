import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { buildColdDmPrompt } from "@/lib/prompt";
import { checkAndRefreshCredits } from "@/lib/credits";
import { getCorsHeaders } from "@/lib/cors";
import { lazeeChat } from "@/lib/lazee-model";

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return NextResponse.json({}, { headers: getCorsHeaders(origin) });
}

export async function POST(request: NextRequest) {
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

    // Passive credit refresh
    await checkAndRefreshCredits(session.user.email);

    const {
      recipientInfo,
      companyOrFounder,
      messageType,
      tone,
      additionalInstructions,
    } = await request.json();

    // Check credits and fetch profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        experiences: {
          orderBy: { startDate: "desc" },
        },
        projects: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user || user.credits < 2) {
      return NextResponse.json(
        {
          error:
            "Insufficient credits. Please upgrade or purchase more credits.",
        },
        { status: 403, headers: corsHeaders },
      );
    }

    if (user.membership !== "PRO") {
      return NextResponse.json(
        {
          error: "Cold DM generation is only available for PRO users.",
        },
        { status: 403, headers: corsHeaders },
      );
    }

    const systemContent = buildColdDmPrompt(
      user,
      recipientInfo,
      companyOrFounder,
      messageType,
      tone,
      additionalInstructions
    );

    let responseText: string;
    try {
      responseText = await lazeeChat({
        messages: [
          {
            role: "system",
            content:
              "You are an expert at writing personalized, highly effective cold outreach messages that get responses. Your style is engaging, natural, and custom-tailored to the constraints provided.",
          },
          { role: "user", content: systemContent },
        ],
        temperature: 0.7,
        top_p: 0.9,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error generating cold DM response";
      console.error("OpenRouter API Error (Cold DM):", message);
      return NextResponse.json(
        { error: message },
        { status: 502, headers: corsHeaders },
      );
    }

    // Deduct credits
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        credits: {
          decrement: 2,
        },
      },
    });

    return NextResponse.json(
      { text: responseText, systemContent },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("Cold DM Route Error:", error);
    return NextResponse.json(
      { error: "Error generating cold DM response" },
      { status: 500, headers: corsHeaders },
    );
  }
}
