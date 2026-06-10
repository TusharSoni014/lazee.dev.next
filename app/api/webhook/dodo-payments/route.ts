import { NextRequest } from "next/server";
import { Webhooks } from "@dodopayments/nextjs";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const POST = (req: NextRequest) =>
  Webhooks({
    webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY!,

    onSubscriptionActive: async (payload) => {
      const data = payload.data as any;
      const email: string | undefined = data?.customer?.email;
      const customerId: string | undefined = data?.customer?.customer_id;
      if (!email) return;
      await prisma.user.update({
        where: { email },
        data: {
          membership: "PRO",
          credits: 10000,
          ...(customerId ? { dodoCustomerId: customerId } : {}),
        },
      });
    },

    onSubscriptionRenewed: async (payload) => {
      const data = payload.data as any;
      const email: string | undefined = data?.customer?.email;
      const customerId: string | undefined = data?.customer?.customer_id;
      if (!email) return;
      await prisma.user.update({
        where: { email },
        data: {
          membership: "PRO",
          credits: 10000,
          ...(customerId ? { dodoCustomerId: customerId } : {}),
        },
      });
    },

    onSubscriptionCancelled: async (payload) => {
      const data = payload.data as any;
      const email: string | undefined = data?.customer?.email;
      if (!email) return;
      await prisma.user.update({
        where: { email },
        data: { membership: "FREE" },
      });
    },

    onSubscriptionExpired: async (payload) => {
      const data = payload.data as any;
      const email: string | undefined = data?.customer?.email;
      if (!email) return;
      await prisma.user.update({
        where: { email },
        data: { membership: "FREE" },
      });
    },

    onSubscriptionFailed: async (payload) => {
      const data = payload.data as any;
      const email: string | undefined = data?.customer?.email;
      if (!email) return;
      await prisma.user.update({
        where: { email },
        data: { membership: "FREE" },
      });
    },
  })(req);
