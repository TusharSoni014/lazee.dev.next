import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// CORS headers for extension requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // In production, restrict to your extension origin
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      {
        id: (session.user as { id?: string }).id || null,
        name: session.user.name || null,
        email: session.user.email || null,
        image: session.user.image || null,
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500, headers: corsHeaders },
    );
  }
}
