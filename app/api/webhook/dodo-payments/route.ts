import { NextRequest, NextResponse } from "next/server";
import { Webhooks } from "@dodopayments/nextjs";
import { Subscription } from "@dodopayments/core";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ─── Shared helpers ────────────────────────────────────────────────────────────

async function grantPro(email: string, customerId?: string) {
  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });

  if (!user) {
    console.error(`[webhook-prod] User not found for email: ${email}`);
    throw new Error(`User not found for email: ${email}`);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      membership: "PRO",
      credits: 10000,
      ...(customerId ? { dodoCustomerId: customerId } : {}),
    },
  }); 
}

async function revokePro(email: string) {
  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
    include: {
      accounts: {
        select: {
          provider: true,
        },
      },
    },
  });

  if (!user) {
    console.error(`[webhook-prod] User not found for email: ${email}`);
    throw new Error(`User not found for email: ${email}`);
  }

  const isGmail = email.toLowerCase().endsWith("@gmail.com");
  const hasGoogleAccount = user.accounts.some((acc) => acc.provider === "google");
  const defaultFreeCredits = (isGmail || hasGoogleAccount) ? 200 : 0;

  await prisma.user.update({
    where: { id: user.id },
    // Reset to free tier and restart the monthly free-credit cycle from now
    // (lib/credits.ts uses lastCreditReset for the 30-day FREE refresh).
    data: { 
      membership: "FREE", 
      credits: defaultFreeCredits, 
      lastCreditReset: new Date() 
    },
  });
}

// ─── Dev handler (no signature verification) ───────────────────────────────────
// dodo wh listen / dodo wh trigger don't use the dashboard webhook secret,
// so we skip verification in development only.

interface RawWebhookCustomer {
  email?: string;
  customer_id?: string;
}

interface RawWebhookData {
  customer?: RawWebhookCustomer;
}

async function handleDevPayload(type: string, data: unknown) {
  const d = (data ?? {}) as RawWebhookData;
  const email = d.customer?.email;
  const customerId = d.customer?.customer_id;

  console.log(`[webhook-dev] ${type}`, email ?? "(no email)");

  if (!email) return;

  switch (type) {
    // ── Grant PRO ────────────────────────────────────────────────────────────
    case "subscription.active":
    case "subscription.renewed":
      await grantPro(email, customerId);
      break;

    // ── User cancelled but still paid until period ends → keep PRO ───────────
    // subscription.expired will fire when the period actually ends
    case "subscription.cancelled":
      console.log("[webhook-dev] cancelled – keeping PRO until expiry");
      break;

    // ── Subscription actually ended / payment failed / paused → revoke ────────
    case "subscription.expired":
    case "subscription.failed":
    case "subscription.on_hold":
    case "subscription.paused":
      await revokePro(email);
      break;

    default:
      break;
  }
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    try {
      const body = (await req.json()) as { type?: string; data?: unknown };
      await handleDevPayload(body?.type ?? "", body?.data);
    } catch (err) {
      console.error("[webhook-dev] error:", err);
    }
    return NextResponse.json({ received: true });
  }

  const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
  if (!webhookKey) {
    console.error("[webhook-prod] Error: DODO_PAYMENTS_WEBHOOK_KEY environment variable is not configured.");
    return NextResponse.json(
      { error: "Webhook secret key is missing from server environment configuration." },
      { status: 500 }
    );
  }

  try {
    const handler = Webhooks({
      webhookKey,

      // ── Grant PRO ──────────────────────────────────────────────────────────
      onSubscriptionActive: async (payload) => {
        const sub: Subscription = payload.data;
        await grantPro(sub.customer.email, sub.customer.customer_id);
      },

      onSubscriptionRenewed: async (payload) => {
        const sub: Subscription = payload.data;
        await grantPro(sub.customer.email, sub.customer.customer_id);
      },

      // ── Cancelled: user keeps PRO until the billing period ends ────────────
      // Do NOT revoke here — subscription.expired will fire when access ends
      onSubscriptionCancelled: async (payload) => {
        console.log(
          "[webhook-prod] subscription.cancelled — keeping PRO until expiry:",
          payload.data.customer.email,
        );
      },

      // ── Access actually ended → revoke PRO and reset credits to 200 ────────
      onSubscriptionExpired: async (payload) => {
        await revokePro(payload.data.customer.email);
      },

      onSubscriptionFailed: async (payload) => {
        await revokePro(payload.data.customer.email);
      },

      onSubscriptionOnHold: async (payload) => {
        await revokePro(payload.data.customer.email);
      },

      onSubscriptionPaused: async (payload) => {
        await revokePro(payload.data.customer.email);
      },
    });

    const res = await handler(req);

    if (res.status >= 400) {
      const clonedRes = res.clone();
      const text = await clonedRes.text();
      console.error(`[webhook-prod] Verification failed with status ${res.status}:`, text);
    }

    return res;
  } catch (err: any) {
    console.error("[webhook-prod] Exception caught in route handler:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error inside webhook handler" },
      { status: 500 }
    );
  }
}
