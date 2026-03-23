import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { auth } from "@/lib/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_FEEDBACK_DATABASE_ID;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // Rate limiting (use email or IP)
    const identifier = session?.user?.email || req.headers.get("x-forwarded-for") || "anonymous";
    const rateLimit = checkRateLimit(`feedback:${identifier}`, RATE_LIMITS.feedback);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many requests. Please try again in ${rateLimit.resetIn} seconds.` },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetIn) } },
      );
    }

    const data = await req.json();
    const { name, email, type, message } = data;

    if (!message || !type) {
      return NextResponse.json(
        { error: "Message and type are required" },
        { status: 400 }
      );
    }

    if (!process.env.NOTION_API_KEY || !DATABASE_ID) {
      console.error("Notion API configuration is missing");
      return NextResponse.json(
        { error: "Feedback system is not configured correctly" },
        { status: 500 }
      );
    }

    await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name || "Anonymous",
              },
            },
          ],
        },
        Email: {
          email: email || "anonymous@lazee.dev",
        },
        "Feedback Type": {
          select: {
            name: type,
          },
        },
        Description: {
          rich_text: [
            {
              text: {
                content: message,
              },
            },
          ],
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Notion API Error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback. Please try again later." },
      { status: 500 }
    );
  }
}
