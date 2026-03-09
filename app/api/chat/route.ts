import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

function buildSystemPrompt(user: any) {
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.name ||
    "New User";
  const firstName = user.firstName || fullName.split(" ")[0] || "I";

  let prompt = `You are ${fullName}. Your task is to assist in filling out job application forms and answering recruitment questions on your behalf.`;
  if (user.jobType) {
    prompt += ` You are looking for roles in: ${user.jobType}.\n\n`;
  } else {
    prompt += ` You are open to roles that align with your experience and technical capabilities.\n\n`;
  }

  prompt += `CRITICAL RULES:
1. ALWAYS answer in the FIRST PERSON ("I", "my", "me"). Never refer to yourself as an AI, bot, or "${firstName}" in the third person.
2. Be professional, concise, and confident.
3. If asked a question where the answer is not provided in your background, say "NA" or provide a polite, brief explanation if appropriate.
4. Do not repeat the question in your response. Just provide the answer.

CORE BACKGROUND:\n`;

  if (user.skills && user.skills.length > 0) {
    prompt += `- Skills: ${user.skills.join(", ")}\n`;
  } else {
    prompt += `- Skills: I am constantly learning and adapting to new technologies, currently exploring modern development tools and frameworks.\n`;
  }

  if (user.experiences && user.experiences.length > 0) {
    prompt += `- Experience: \n`;
    user.experiences.forEach((exp: any) => {
      prompt += `  - Company: ${exp.companyName}\n`;
      const start = exp.startDate
        ? new Date(exp.startDate).toLocaleDateString()
        : "NA";
      const end = exp.isCurrent
        ? "Present"
        : exp.endDate
          ? new Date(exp.endDate).toLocaleDateString()
          : "NA";
      prompt += `    Date: ${start} - ${end}\n`;
      if (exp.companyWebsite) prompt += `    Website: ${exp.companyWebsite}\n`;
      if (exp.description) prompt += `    Description: ${exp.description}\n`;
    });
  } else {
    prompt += `- Experience: I am focusing on building my foundational skills, working on hands-on projects, and eager to bring my enthusiastic learning approach to a professional role.\n`;
  }

  prompt += `\nSPECIFIC QUESTION GUIDANCE:\n`;

  if (user.projects && user.projects.length > 0) {
    const proj =
      user.projects.find((p: any) => p.isTopProject) || user.projects[0];
    prompt += `- "Tell us about a project you’re proud of": 
  Talk about ${proj.name}${proj.activeLink ? ` (${proj.activeLink})` : ""}. 
  Description: ${proj.description || "A significant project I built to solve real-world problems."}\n`;
  } else {
    prompt += `- "Tell us about a project you’re proud of": 
  I am currently focusing on learning and building new things one by one, and I'm excited to apply my growing skills to real-world applications soon.\n`;
  }

  prompt += `
- "Current job offers": Respond with "NA".
- "Where did you find this job?": Respond with "LinkedIn" unless specified otherwise.
- "Referral details": Respond with "NA".
`;

  let aboutMe =
    "I am a dedicated and passionate professional eager to learn, grow, and contribute to meaningful projects.";
  if (user.experiences?.length > 0 || user.projects?.length > 0) {
    aboutMe =
      "I am a developer who enjoys building production-ready applications and tackling real-world problems.";
  }
  prompt += `\n- "Tell me about yourself": Focus on the following key points: ${aboutMe}\n`;

  if (user.specificQuestionGuidance) {
    prompt += `\nADDITIONAL GUIDANCE / INFO:\n${user.specificQuestionGuidance}\n`;
  }

  if (user.email) {
    prompt += `\nDIRECT CONTACT (If asked for email): ${user.email}\n`;
  }

  if (user.portfolio) {
    prompt += `\nPORTFOLIO LINK (If asked for portfolio or personal website): ${user.portfolio}\n`;
  }

  return prompt;
}

// CORS headers
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

    const { messages, userProfile } = await request.json();

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

    let systemContent = buildSystemPrompt(user);

    console.log("-----------------------------");
    console.log(systemContent);
    console.log("-----------------------------");

    // Inject dynamic user profile fields if sent from client as a fallback
    if (userProfile && !user.name) {
      systemContent += `\n\nCURRENT USER CONTEXT:\nName: ${userProfile.name || "Unknown"}\nEmail: ${userProfile.email || "Unknown"}\n`;
    }

    const requestBody = {
      model: process.env.AI_MODEL || "nvidia/nemotron-3-nano-30b-a3b:free",
      messages: [{ role: "system", content: systemContent }, ...messages],
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
      console.error("OpenRouter API Error:", errorData);
      return NextResponse.json(
        { error: errorData.error?.message || "Error generating AI response" },
        { status: response.status, headers: corsHeaders },
      );
    }
    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
      return NextResponse.json(
        { error: "No response from AI model" },
        { status: 500, headers: corsHeaders },
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

    const responseText = data.choices[0].message.content;
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
