"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Check, X, Loader2 } from "lucide-react";
import { InstallModal } from "@/components/install-modal";
import { useProfileStatus } from "@/hooks/useProfile";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

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
          Core profile autofill is free forever. Upgrade to Pro when you need
          high-volume AI answer synthesis, batch express fill, and recruiter
          outreach.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto items-stretch">
        {/* Free Plan */}
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-900">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Community
              </h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl sm:text-5xl font-heading font-bold text-zinc-900 dark:text-zinc-50">
                  $0
                </span>
                <span className="text-xs sm:text-sm font-medium text-zinc-500">
                  /month
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Everything required for steady, verified application velocity
                without cost.
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {/* Included in Free */}
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/80 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-normal">
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Unlimited profile data autofill
                  </strong>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {" "}
                    (Experience, education, projects &amp; CTC)
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/80 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-normal">
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Universal ATS support
                  </strong>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {" "}
                    (Greenhouse, Lever, Ashby, Workday &amp; 100+)
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/80 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-normal">
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Bring Your Own Key (BYOK)
                  </strong>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {" "}
                    (OpenAI, Claude, Gemini, Grok &amp; Ollama)
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/80 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-normal">
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    1 Resume PDF storage
                  </strong>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {" "}
                    with deterministic field matching
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/80 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-normal">
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    200 AI credits / month
                  </strong>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {" "}
                    (Refreshed automatically every 30 days)
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/80 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-normal">
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Single-question AI fill
                  </strong>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {" "}
                    with custom prompts &amp; guidance
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/80 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-normal">
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Saved Q&amp;A library
                  </strong>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {" "}
                    (Search &amp; 1-click insert repetitive answers)
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/80 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-normal">
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Public profile portfolio
                  </strong>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {" "}
                    (Shareable lazee.dev/u/ link)
                  </span>
                </span>
              </li>

              {/* Pro Exclusives - Crossed out in Free */}
              <li className="flex items-start gap-3 opacity-55">
                <div className="size-4 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-500 flex items-center justify-center shrink-0 mt-0.5 border border-zinc-200/80 dark:border-zinc-700/80">
                  <X className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-500 line-through leading-normal">
                  <strong className="font-semibold text-zinc-400 dark:text-zinc-500">
                    1-Click Express Batch Fill
                  </strong>
                  <span> (All questions simultaneously)</span>
                </span>
              </li>
              <li className="flex items-start gap-3 opacity-55">
                <div className="size-4 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-500 flex items-center justify-center shrink-0 mt-0.5 border border-zinc-200/80 dark:border-zinc-700/80">
                  <X className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-500 line-through leading-normal">
                  <strong className="font-semibold text-zinc-400 dark:text-zinc-500">
                    AI Cold DM &amp; Recruiter Outreach
                  </strong>
                  <span> (Gmail + Web scraper)</span>
                </span>
              </li>
            </ul>
          </div>

          <InstallModal>
            <Button
              variant="secondary"
              size="lg"
              className="w-full text-xs sm:text-sm font-semibold tracking-tight h-11"
            >
              Get Started for Free
            </Button>
          </InstallModal>
        </div>

        {/* Pro Plan */}
        <div className="rounded-2xl border border-orange-500/40 dark:border-orange-500/30 bg-gradient-to-b from-orange-500/[0.04] to-white dark:to-zinc-950 p-6 sm:p-8 flex flex-col justify-between shadow-md relative overflow-hidden ring-1 ring-orange-500/20">
          <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Professional
              </h3>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded-full shadow-2xs">
                Recommended
              </span>
            </div>

            <div className="mb-6 pb-6 border-b border-zinc-200/80 dark:border-zinc-800">
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl sm:text-5xl font-heading font-bold text-zinc-900 dark:text-zinc-50">
                  $9
                </span>
                <span className="text-xs sm:text-sm font-medium text-zinc-500">
                  /month
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                Designed for engineers in active interview search mode needing
                peak velocity.
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-normal">
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Unlimited profile data autofill
                  </strong>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {" "}
                    (Experience, education, projects &amp; CTC)
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-normal">
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Universal ATS support
                  </strong>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {" "}
                    across 100+ hiring portals
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5 border border-orange-300 dark:border-orange-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 leading-normal">
                  <strong className="font-bold text-orange-600 dark:text-orange-400">
                    1-Click Express Batch Fill
                  </strong>
                  <span className="text-zinc-600 dark:text-zinc-300">
                    {" "}
                    (Synthesizes all questions simultaneously)
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5 border border-orange-300 dark:border-orange-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 leading-normal">
                  <strong className="font-bold text-orange-600 dark:text-orange-400">
                    AI Cold DM &amp; Recruiter Outreach
                  </strong>
                  <span className="text-zinc-600 dark:text-zinc-300">
                    {" "}
                    (Gmail compose &amp; web scraper)
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5 border border-orange-300 dark:border-orange-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 leading-normal">
                  <strong className="font-bold text-orange-600 dark:text-orange-400">
                    Multi-Resume Matrix (Up to 10 versions)
                  </strong>
                  <span className="text-zinc-600 dark:text-zinc-300">
                    {" "}
                    with instant popup hot-swap
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5 border border-orange-300 dark:border-orange-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 leading-normal">
                  <strong className="font-bold text-orange-600 dark:text-orange-400">
                    10,000 AI credits / month
                  </strong>
                  <span className="text-zinc-600 dark:text-zinc-300">
                    {" "}
                    (50x higher monthly allowance)
                  </span>
                </span>
              </li>

              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-normal">
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Single-question AI fill
                  </strong>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {" "}
                    with custom prompts &amp; guidance
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-normal">
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Bring Your Own Key (BYOK)
                  </strong>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {" "}
                    with direct browser inference
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-normal">
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Saved Q&amp;A library
                  </strong>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {" "}
                    with instant search &amp; 1-click insert
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-normal">
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Public profile portfolio
                  </strong>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {" "}
                    (Shareable lazee.dev/u/ link)
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <Button
            size="lg"
            onClick={handleGoPro}
            disabled={isCheckingOut}
            className="w-full text-xs sm:text-sm font-semibold tracking-tight h-11 relative z-10"
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
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
