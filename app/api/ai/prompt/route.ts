import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { buildColdDmPrompt, buildSystemPrompt } from "@/lib/prompt";
import { getCorsHeaders } from "@/lib/cors";
import { BYOK_UNLOCKS_PRO_FEATURES } from "@/lib/byok";

export const dynamic = "force-dynamic";

/**
 * "Bring Your Own AI" prompt builder.
 *
 * The extension calls this when the user has selected their OWN AI provider
 * (OpenAI, Claude, Gemini, Grok, Ollama, LM Studio, ...). We only assemble the
 * profile-aware prompt here. The extension then sends it straight to the
 * user's provider, so:
 *   - no model call happens on this server,
 *   - no Lazee credits are checked or deducted,
 *   - the user's API key never reaches us.
 */

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

interface PromptRequest {
  id: string;
  messages: ChatMessage[];
  temperature?: number;
}

const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 20_000;
const MAX_FIELDS = 100;

const str = (v: unknown, max = 4_000): string =>
  typeof v === "string" ? v.slice(0, max) : "";

/** Same fallback the credit-based routes use when the DB profile has no name. */
const userContextSuffix = (profile: unknown): string => {
  const p = (profile && typeof profile === "object" ? profile : {}) as {
    name?: unknown;
    email?: unknown;
  };
  return `\n\nCURRENT USER CONTEXT:\nName: ${str(p.name, 200) || "Unknown"}\nEmail: ${str(p.email, 200) || "Unknown"}\n`;
};

interface IncomingMessage {
  role?: unknown;
  content?: unknown;
}
interface IncomingField {
  id?: unknown;
  label?: unknown;
  placeholder?: unknown;
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return NextResponse.json({}, { headers: getCorsHeaders(origin) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  const fail = (error: string, status: number) =>
    NextResponse.json({ error }, { status, headers: corsHeaders });

  try {
    const session = await auth();
    if (!session?.user?.email) return fail("Not authenticated", 401);

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return fail("Invalid request body", 400);
    }

    const kind = body?.kind;
    if (kind !== "chat" && kind !== "cold-dm" && kind !== "express-fill") {
      return fail("Unknown prompt kind", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        experiences: { orderBy: { startDate: "desc" } },
        projects: { orderBy: { createdAt: "desc" } },
        educations: { orderBy: { startDate: "desc" } },
      },
    });
    if (!user) return fail("User not found", 404);

    // PRO-only features stay PRO-only unless BYOK unlocks them.
    if (
      !BYOK_UNLOCKS_PRO_FEATURES &&
      user.membership !== "PRO" &&
      (kind === "cold-dm" || kind === "express-fill")
    ) {
      return fail(
        kind === "cold-dm"
          ? "Cold DM generation is only available for PRO users."
          : "Express Fill is only available for PRO users.",
        403,
      );
    }

    const requests: PromptRequest[] = [];

    if (kind === "chat") {
      const incoming: IncomingMessage[] = Array.isArray(body.messages)
        ? body.messages
        : [];
      const messages: ChatMessage[] = [];
      for (const m of incoming.slice(0, MAX_MESSAGES)) {
        if (
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
        ) {
          messages.push({
            role: m.role,
            content: m.content.slice(0, MAX_MESSAGE_CHARS),
          });
        }
      }
      if (messages.length === 0) return fail("No messages provided", 400);

      let systemContent = buildSystemPrompt(user);
      const userProfile = body.userProfile;
      if (userProfile && !user.name) {
        systemContent += userContextSuffix(userProfile);
      }

      requests.push({
        id: "chat",
        messages: [{ role: "system", content: systemContent }, ...messages],
        temperature: 1,
      });
    }

    if (kind === "cold-dm") {
      const userPrompt = buildColdDmPrompt(
        user,
        str(body.recipientInfo),
        str(body.companyOrFounder, 300),
        str(body.messageType, 100),
        str(body.tone, 100),
        str(body.additionalInstructions),
      );
      requests.push({
        id: "cold-dm",
        messages: [
          {
            role: "system",
            content:
              "You are an expert at writing personalized, highly effective cold outreach messages that get responses. Your style is engaging, natural, and custom-tailored to the constraints provided.",
          },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      });
    }

    if (kind === "express-fill") {
      const fields: IncomingField[] = Array.isArray(body.fields)
        ? body.fields
        : [];
      if (fields.length === 0) return fail("No fields provided", 400);
      if (fields.length > MAX_FIELDS) {
        return fail(`Too many fields (max ${MAX_FIELDS}).`, 400);
      }

      let systemContent = buildSystemPrompt(user);
      const userProfile = body.userProfile;
      if (userProfile && !user.name) {
        systemContent += userContextSuffix(userProfile);
      }

      for (const field of fields) {
        const id = str(field?.id, 300);
        const label = str(field?.label, 500);
        if (!id) continue;

        let prompt = `Question to answer: "${label}"`;
        const placeholder = str(field?.placeholder, 500);
        if (placeholder) prompt += `\nContext/Placeholder: "${placeholder}"`;

        requests.push({
          id,
          messages: [
            { role: "system", content: systemContent },
            {
              role: "user",
              content: `Context: Answering a form field labeled "${label}"\n\nQuestion/Prompt: ${prompt}`,
            },
          ],
          temperature: 1,
        });
      }
      if (requests.length === 0) return fail("No valid fields provided", 400);
    }

    return NextResponse.json(
      { requests },
      {
        headers: {
          ...corsHeaders,
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("AI Prompt Route Error:", error);
    return fail("Error preparing AI prompt", 500);
  }
}
