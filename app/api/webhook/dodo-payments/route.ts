import { NextRequest } from "next/server";
import { Webhooks } from "@dodopayments/nextjs";

export const dynamic = "force-dynamic";

export const POST = (req: NextRequest) =>
  Webhooks({
    webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY!,
    onPayload: async (payload) => {
      // handle events and update credits in Neon DB
    },
  })(req);
