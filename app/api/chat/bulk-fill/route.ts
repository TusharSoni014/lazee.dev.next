import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { buildSystemPrompt } from "@/lib/prompt";
import { getCorsHeaders } from "@/lib/cors";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

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

    // Rate limiting
    const rateLimit = checkRateLimit(
      `bulk-fill:${session.user.email}`,
      RATE_LIMITS.bulkFill,
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

    const { fields, userProfile } = await request.json();

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return NextResponse.json(
        { error: "No fields provided" },
        { status: 400, headers: corsHeaders },
      );
    }

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

    const creditCost = fields.length * 2; // 2 credits per field

    if (!user || user.credits < creditCost) {
      return NextResponse.json(
        {
          error: `Insufficient credits. This action requires ${creditCost} credits.`,
        },
        { status: 403, headers: corsHeaders },
      );
    }

    if (user.membership !== "PRO") {
      return NextResponse.json(
        {
          error: "Bulk fill is only available for PRO users.",
        },
        { status: 403, headers: corsHeaders },
      );
    }

    let systemContent = buildSystemPrompt(user);

    // Inject dynamic user profile fields if sent from client as a fallback
    if (userProfile && !user.name) {
      systemContent += `\n\nCURRENT USER CONTEXT:\nName: ${userProfile.name || "Unknown"}\nEmail: ${userProfile.email || "Unknown"}\n`;
    }

    const generateFieldResponse = async (field: any) => {
      const context = `Answering a form field labeled "${field.label}"`;
      let prompt = `Question to answer: "${field.label}"`;
      if (field.placeholder) {
        prompt += `\nContext/Placeholder: "${field.placeholder}"`;
      }

      const requestBody = {
        model: process.env.AI_MODEL || "nvidia/nemotron-3-nano-30b-a3b:free",
        messages: [
          { role: "system", content: systemContent },
          {
            role: "user",
            content: `Context: ${context}\n\nQuestion/Prompt: ${prompt}`,
          },
        ],
        temperature: 1,
        top_p: 0.5,
        top_k: 15,
        stream: false,
      };

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://lazee.dev",
            "X-Title": "Lazee Dev",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || `Error generating AI response for field ${field.label}`
        );
      }

      const data = await response.json();
      if (!data.choices || data.choices.length === 0) {
        throw new Error(`No response from AI model for field ${field.label}`);
      }

      return data.choices[0].message.content.trim();
    };

    const responses: Record<string, string> = {};

    // Generate responses in parallel
    const generationPromises = fields.map(async (field: any) => {
      try {
        const answer = await generateFieldResponse(field);
        responses[field.id] = answer;
      } catch (err) {
        console.error(`Error generating bulk fill for field ${field.id}:`, err);
        responses[field.id] = "NA";
      }
    });

    await Promise.all(generationPromises);

    // Deduct credits
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        credits: {
          decrement: creditCost,
        },
      },
    });

    return NextResponse.json(
      { responses },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("Bulk Fill Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders },
    );
  }
}
