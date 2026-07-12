import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { auth } from "@/lib/auth";
import { createTransport } from "nodemailer";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_FEEDBACK_DATABASE_ID;

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, type, message } = data;

    if (!message || !type) {
      return NextResponse.json(
        { error: "Message and type are required" },
        { status: 400 },
      );
    }

    if (!process.env.NOTION_API_KEY || !DATABASE_ID) {
      console.error("Notion API configuration is missing");
      return NextResponse.json(
        { error: "Feedback system is not configured correctly" },
        { status: 500 },
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

    // Send email copy to developer
    try {
      const host = process.env.EMAIL_SERVER_HOST;
      const port = parseInt(process.env.EMAIL_SERVER_PORT || "587");
      const user = process.env.EMAIL_SERVER_USER;
      const pass = process.env.EMAIL_SERVER_PASSWORD;
      const from = process.env.EMAIL_FROM || "Lazee.dev <no-reply@lazee.dev>";

      if (host && user && pass) {
        const transporter = createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        });

        await transporter.sendMail({
          from,
          to: "tusharsoni014@gmail.com",
          subject: `New Feedback: [${type}] from ${name || "Anonymous"}`,
          text: `
Name: ${name || "Anonymous"}
Email: ${email || "anonymous@lazee.dev"}
Feedback Type: ${type}

Description:
${message}
          `,
          html: `
<div style="font-family: sans-serif; padding: 20px; max-width: 600px; border: 1px solid #eee; border-radius: 5px;">
  <h2 style="color: #f26c0d; margin-top: 0;">New Feedback Received</h2>
  <table cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tr style="background: #f9f9f9;">
      <td style="font-weight: bold; width: 120px; border-bottom: 1px solid #eee;">Name:</td>
      <td style="border-bottom: 1px solid #eee;">${name || "Anonymous"}</td>
    </tr>
    <tr>
      <td style="font-weight: bold; border-bottom: 1px solid #eee;">Email:</td>
      <td style="border-bottom: 1px solid #eee;"><a href="mailto:${email || "anonymous@lazee.dev"}">${email || "anonymous@lazee.dev"}</a></td>
    </tr>
    <tr style="background: #f9f9f9;">
      <td style="font-weight: bold; border-bottom: 1px solid #eee;">Type:</td>
      <td style="border-bottom: 1px solid #eee;"><span style="background: #e2e8f0; padding: 2px 6px; border-radius: 3px; font-size: 12px; font-weight: bold;">${type}</span></td>
    </tr>
  </table>
  <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Description:</h3>
  <p style="white-space: pre-wrap; line-height: 1.5; background: #fdfdfd; padding: 15px; border: 1px solid #f0f0f0;">${message}</p>
</div>
          `,
        });
        console.log(
          `[FEEDBACK] Email copy successfully sent to tusharsoni014@gmail.com`,
        );
      } else {
        console.warn(
          "[FEEDBACK] SMTP credentials missing, skipped email copy.",
        );
      }
    } catch (emailError) {
      console.error("[FEEDBACK] Failed to send email copy:", emailError);
      // Fail gracefully so the Notion submit response still succeeds
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Notion API Error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback. Please try again later." },
      { status: 500 },
    );
  }
}
