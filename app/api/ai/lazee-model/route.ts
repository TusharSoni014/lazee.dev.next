import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getActiveLazeeModel,
  listFreeTextModels,
  setActiveLazeeModel,
} from "@/lib/lazee-model";

/** Free OpenRouter text models, and the one Lazee AI is using right now. */
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const [models, active] = await Promise.all([
      listFreeTextModels(),
      getActiveLazeeModel(),
    ]);
    return NextResponse.json({ active, models });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not load models.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

/** Manually select one of the free text models. */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { id?: unknown } | null;
  if (!body || typeof body.id !== "string" || !body.id.trim()) {
    return NextResponse.json({ error: "Missing model id." }, { status: 400 });
  }

  try {
    const active = await setActiveLazeeModel(body.id.trim());
    const models = await listFreeTextModels();
    return NextResponse.json({ active, models });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not switch model.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
