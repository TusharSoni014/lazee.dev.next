import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { buildSystemPrompt } from "@/lib/prompt";
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

    const { messages, userProfile, jobDescription } = await request.json();

    const hasJd =
      typeof jobDescription === "string" && jobDescription.trim().length > 0;
    const requiredCredits = hasJd ? 8 : 2; // Extra 6 credits when job description is used

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
        educations: {
          orderBy: { startDate: "desc" },
        },
      },
    });

    if (!user || user.credits < requiredCredits) {
      return NextResponse.json(
        {
          error: hasJd
            ? `Insufficient credits. Answering with a job description requires ${requiredCredits} credits (2 base + 6 JD). You have ${user?.credits ?? 0} credits.`
            : "Insufficient credits. Please upgrade or purchase more credits.",
        },
        { status: 403, headers: corsHeaders },
      );
    }

    let systemContent = buildSystemPrompt(
      user,
      hasJd ? jobDescription : undefined,
    );

    // Inject dynamic user profile fields if sent from client as a fallback
    if (userProfile && !user.name) {
      systemContent += `\n\nCURRENT USER CONTEXT:\nName: ${userProfile.name || "Unknown"}\nEmail: ${userProfile.email || "Unknown"}\n`;
    }

    let responseText: string;
    try {
      responseText = await lazeeChat({
        messages: [{ role: "system", content: systemContent }, ...messages],
        temperature: 1,
        top_p: 0.5,
        top_k: 15,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error generating AI response";
      console.error("OpenRouter API Error:", message);
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
          decrement: requiredCredits,
        },
      },
    });

    return NextResponse.json(
      { text: responseText, systemContent },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: "Error generating AI response" },
      { status: 500, headers: corsHeaders },
    );
  }
}
