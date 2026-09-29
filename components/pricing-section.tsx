"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Check, X, Loader2 } from "lucide-react";
import { InstallModal } from "@/components/install-modal";
import { useProfileStatus } from "@/hooks/useProfile";
import { toast } from "@/components/ui/toast";

export function PricingSection() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { data: status } = useProfileStatus(undefined, {
    enabled: !!session,
  });

  const isPro = status?.membership === "PRO";

  async function handleGoPro() {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (isPro) {
      if (!status?.dodoCustomerId) {
        toast.error("No subscription found.");
        return;
      }
      window.location.href = `/api/customer-portal?customer_id=${status.dodoCustomerId}`;
      return;
    }

    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_cart: [
            {
              product_id:
                process.env.NEXT_PUBLIC_DODO_PAYMENTS_PRODUCT_ID ||
                "pdt_0NayYkMQdxcLwDxT4hxDk",
              quantity: 1,
            },
          ],
          customer: {
            email: session.user.email,
            name: session.user.name ?? session.user.email,
          },
          return_url: `${window.location.origin}/profile?payment=success`,
        }),
      });
      if (!res.ok) throw new Error("Failed to create checkout");
      const { checkout_url } = await res.json();
      window.location.href = checkout_url;
    } catch {
      setIsCheckingOut(false);
    }
  }

  return (
    <motion.section
      id="pricing"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full my-12 sm:my-20"
    >
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-mono font-medium mb-3">
          <span>Predictable Investment</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Transparent, Fair Pricing
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
          Core profile autofill is free forever. Upgrade to Pro when you need high-volume AI answer synthesis and batch express fill.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto items-stretch">
        {/* Free Plan */}
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-900">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                Community
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl sm:text-5xl font-heading font-bold text-zinc-900 dark:text-zinc-50">
                  $0
                </span>
                <span className="text-xs sm:text-sm font-medium text-zinc-500">/month</span>
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                Everything required for steady, verified application velocity.
              </p>
            </div>

            <ul className="space-y-3.5 mb-8">
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                  Unlimited profile data autofill
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                  Universal support across 100+ ATS platforms
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                  Recruiter Outreach Generator (Gmail)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                  200 AI credits / month refreshed automatically
                </span>
              </li>
              <li className="flex items-start gap-3 opacity-40">
                <div className="size-4 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-400 line-through">
                  1-Click Express Batch Fill
                </span>
              </li>
              <li className="flex items-start gap-3 opacity-40">
                <div className="size-4 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-400 line-through">
                  Priority AI reasoning & custom prompt memory
                </span>
              </li>
            </ul>
          </div>

          <InstallModal>
            <button className="w-full h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 text-zinc-900 dark:text-zinc-100 font-medium text-xs tracking-tight transition-all cursor-pointer">
              Get Started for Free
            </button>
          </InstallModal>
        </div>

        {/* Pro Plan */}
        <div className="rounded-2xl border border-orange-500/40 dark:border-orange-500/30 bg-gradient-to-b from-orange-500/[0.04] to-white dark:to-zinc-950 p-6 sm:p-8 flex flex-col justify-between shadow-md relative overflow-hidden ring-1 ring-orange-500/20">
          <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Professional
              </span>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded-full shadow-2xs">
                Recommended
              </span>
            </div>

            <div className="mb-6 pb-6 border-b border-zinc-200/80 dark:border-zinc-800">
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl sm:text-5xl font-heading font-bold text-zinc-900 dark:text-zinc-50">
                  $9
                </span>
                <span className="text-xs sm:text-sm font-medium text-zinc-500">/month</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
                Designed for engineers in active interview search mode.
              </p>
            </div>

            <ul className="space-y-3.5 mb-8">
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                  Unlimited profile data autofill
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                  Universal support across 100+ ATS platforms
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                  Recruiter Outreach Generator (Gmail)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 font-bold">
                  10,000 AI credits / month
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                  1-Click Express Batch Fill (All questions simultaneously)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                  Advanced reasoning models & priority dispatch
                </span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleGoPro}
            disabled={isCheckingOut}
            className="w-full h-11 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs tracking-tight shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_16px_-4px_rgba(234,88,12,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center relative z-10"
          >
            {isCheckingOut ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-3.5 animate-spin" />
                Connecting checkout...
              </span>
            ) : isPro ? (
              "Manage Subscription"
            ) : (
              "Upgrade to Pro ($9/mo)"
            )}
          </button>
        </div>
      </div>
    </motion.section>
  );
}
