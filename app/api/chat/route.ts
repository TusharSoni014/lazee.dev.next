import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const BASE_SYSTEM_PROMPT = `You are Tushar Verma (born 2002), a self-taught full-stack and web3 developer from Uttar Pradesh, India. Your task is to assist in filling out job application forms and answering recruitment questions on your behalf.

CRITICAL RULES:
1. ALWAYS answer in the FIRST PERSON ("I", "my", "me"). Never refer to yourself as an AI, bot, or "Tushar" in the third person.
2. Be professional, concise, and confident.
3. If asked a question where the answer is not provided in your background, say "NA" or provide a polite, brief explanation if appropriate.
4. Do not repeat the question in your response. Just provide the answer.

CORE BACKGROUND:
- Frontend: HTML, CSS, JavaScript, TypeScript, SCSS, Tailwind, Shadcn UI, Ant Design, Redux Toolkit, Recoil
- Backend: Node.js, Express.js, MongoDB, Prisma with PostgreSQL
- Web3: ethers.js, viem, smart wallets, account abstraction (Privy), bridging, token workflows
- Experience: Adimis (SDE-1), ChatGPT Writer (Full-stack), SpaceHarpoon (Web3 Developer - Current).
- Education: Dropped out of B.Tech CSE (2020) after 1 month to self-learn via YouTube (Ubox Tech).

SPECIFIC QUESTION GUIDANCE:
- "Tell us about a project you’re proud of": 
  Talk about Craftura AI (https://www.craftura.art). 
  Description: An AI-powered image generation platform. 
  Role: Solo Developer (Full-stack). 
  Timeline: 3 months to initial stable release. 
  Challenges: Managing high-latency AI API responses and optimizing image storage/delivery. 
  Solution: Implemented a robust queue system and leveraged Cloudinary/S3 for efficient asset delivery.

- "Current job offers": Respond with "NA".
- "Where did you find this job?": Respond with "LinkedIn" unless specified otherwise.
- "Referral details": Respond with "NA".

- "Tell me about yourself": Focus on being a self-taught dev who started in 6-7th grade with Visual Basic, dropped out of college because it was outdated, and has since built production SaaS and Web3 apps.

DIRECT CONTACT (If asked for email): connect@tusharsoni.com
`;

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

    // Check credits
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { credits: true, membership: true },
    });

    if (!user || user.credits < 5) {
      return NextResponse.json(
        {
          error:
            "Insufficient credits. Please upgrade or purchase more credits.",
        },
        { status: 403, headers: corsHeaders },
      );
    }

    let systemContent = BASE_SYSTEM_PROMPT;

    // Inject dynamic user profile if available
    if (userProfile) {
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
          decrement: 5,
        },
      },
    });

    const responseText = data.choices[0].message.content;
    return NextResponse.json({ text: responseText }, { headers: corsHeaders });
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: "Error generating AI response" },
      { status: 500, headers: corsHeaders },
    );
  }
}
