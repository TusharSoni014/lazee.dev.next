import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { buildSystemPrompt } from "@/lib/prompt";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401, headers: corsHeaders },
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

    console.log("--- BULK FILL SYSTEM PROMPT ---");
    console.log(systemContent);
    console.log("-------------------------------");

    const prompt = `Based on my background, please provide concise, professional answers for the following form fields. 
Return the result as a strictly valid JSON object where keys are the EXACT IDs provided and values are the generated answers.

Fields to fill:
${fields.map((f: any) => `- ID: ${f.id} | Label: ${f.label}`).join("\n")}

Format:
{
  "responses": {
    "field_id": "Generated response for this field..."
  }
}`;

    const requestBody = {
      model: process.env.AI_MODEL || "nvidia/nemotron-3-nano-30b-a3b:free",
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
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
      return NextResponse.json(
        { error: errorData.error?.message || "Error generating AI response" },
        { status: response.status, headers: corsHeaders },
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the JSON response from AI
    let parsedResponses;
    try {
      // Find JSON block if AI wrapped it in markdown
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsedResponses = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", content);
      return NextResponse.json(
        { error: "AI failed to generate a valid JSON response" },
        { status: 500, headers: corsHeaders },
      );
    }

    console.log("--- BULK FILL Parsed Response ---");
    console.log(JSON.stringify(parsedResponses, null, 2));

    let finalResponses = parsedResponses.responses || parsedResponses;
    if (typeof finalResponses !== 'object' || finalResponses === null) {
      finalResponses = {};
    }

    // Deduct credits
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        credits: {
          decrement: creditCost,
        },
      },
    });

    return NextResponse.json({ responses: finalResponses }, { headers: corsHeaders });
  } catch (error) {
    console.error("Bulk Fill Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders },
    );
  }
}
