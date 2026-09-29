import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const cookieStore = await cookies();
  const isNewUser = cookieStore.get("lazee_new_user")?.value === "1";

  if (!isNewUser) {
    return NextResponse.json({ showExtensionPrompt: false });
  }

  return NextResponse.json({
    showExtensionPrompt: true,
    userId: session?.user?.id ?? null,
  });
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.delete("lazee_new_user");

  return NextResponse.json({ success: true });
}
