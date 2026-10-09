"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Check, X, Loader2, ArrowUpRight } from "lucide-react";
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
      className="w-full my-12 sm:my-20 scroll-mt-20"
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
        <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Community
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
              Everything required for steady, verified application velocity
              without cost.
            </p>

            <div className="h-px bg-zinc-200/80 dark:bg-zinc-800 my-6 w-full" />

            <div className="flex items-center gap-3.5 my-6">
              <span className="text-4xl sm:text-5xl font-heading font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                $0
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  per month
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  free forever
                </span>
              </div>
            </div>

            <InstallModal>
              <Button
                variant="secondary"
                size="lg"
                className="w-full h-11 sm:h-12 text-sm font-semibold tracking-tight rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Get Started for Free
              </Button>
            </InstallModal>

            <ul className="space-y-3.5 mt-7 sm:mt-8">
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
        </div>

        {/* Pro Plan */}
        <div className="rounded-3xl border border-zinc-800 dark:border-orange-500 bg-zinc-950 dark:bg-orange-600 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative text-white transition-colors duration-200">
          <div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight">
                Pro Plan
              </h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-600 dark:bg-zinc-950 text-white text-xs font-semibold tracking-wide border border-orange-500/40 dark:border-zinc-800 shadow-xs select-none">
                Most Popular
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 dark:text-orange-100/90 mt-1.5 leading-relaxed">
              Designed for engineers in active interview search mode needing
              peak velocity.
            </p>

              <div className="h-px bg-zinc-800/80 dark:bg-white/20 my-6 w-full" />

              <div className="flex items-center gap-3.5 my-6">
                <span className="text-4xl sm:text-5xl font-heading font-bold text-white tracking-tight">
                  $9
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-200 dark:text-white">
                    per month
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-orange-100/80">
                    plus local taxes
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleGoPro}
                disabled={isCheckingOut}
                className="w-full h-11 sm:h-12 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white dark:bg-zinc-950 dark:hover:bg-black dark:text-white dark:border dark:border-zinc-800 font-semibold rounded-xl text-sm gap-2 shadow-sm transition-colors cursor-pointer"
              >
                {isCheckingOut ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Connecting checkout...
                  </span>
                ) : isPro ? (
                  "Manage Subscription"
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    Upgrade to Pro <ArrowUpRight className="size-4" />
                  </span>
                )}
              </Button>

              <ul className="space-y-3.5 mt-7 sm:mt-8">
                <li className="flex items-start gap-3">
                  <Check
                    className="size-4 text-orange-500 dark:text-white shrink-0 mt-0.5"
                    strokeWidth={2.5}
                  />
                  <span className="text-xs sm:text-sm text-zinc-200 dark:text-white leading-normal">
                    <strong className="font-semibold text-white">
                      Unlimited profile data autofill
                    </strong>
                    <span className="text-zinc-400 dark:text-orange-100/85">
                      {" "}
                      (Experience, education, projects &amp; CTC)
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check
                    className="size-4 text-orange-500 dark:text-white shrink-0 mt-0.5"
                    strokeWidth={2.5}
                  />
                  <span className="text-xs sm:text-sm text-zinc-200 dark:text-white leading-normal">
                    <strong className="font-semibold text-white">
                      Universal ATS support
                    </strong>
                    <span className="text-zinc-400 dark:text-orange-100/85">
                      {" "}
                      across 100+ hiring portals
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check
                    className="size-4 text-orange-500 dark:text-white shrink-0 mt-0.5"
                    strokeWidth={2.5}
                  />
                  <span className="text-xs sm:text-sm text-zinc-200 dark:text-white leading-normal">
                    <strong className="font-semibold text-orange-400 dark:text-white">
                      1-Click Express Batch Fill
                    </strong>
                    <span className="text-zinc-400 dark:text-orange-100/85">
                      {" "}
                      (Synthesizes all questions simultaneously)
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check
                    className="size-4 text-orange-500 dark:text-white shrink-0 mt-0.5"
                    strokeWidth={2.5}
                  />
                  <span className="text-xs sm:text-sm text-zinc-200 dark:text-white leading-normal">
                    <strong className="font-semibold text-orange-400 dark:text-white">
                      AI Cold DM &amp; Recruiter Outreach
                    </strong>
                    <span className="text-zinc-400 dark:text-orange-100/85">
                      {" "}
                      (Gmail compose &amp; web scraper)
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check
                    className="size-4 text-orange-500 dark:text-white shrink-0 mt-0.5"
                    strokeWidth={2.5}
                  />
                  <span className="text-xs sm:text-sm text-zinc-200 dark:text-white leading-normal">
                    <strong className="font-semibold text-orange-400 dark:text-white">
                      Multi-Resume Matrix (Up to 10 versions)
                    </strong>
                    <span className="text-zinc-400 dark:text-orange-100/85">
                      {" "}
                      with instant popup hot-swap
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check
                    className="size-4 text-orange-500 dark:text-white shrink-0 mt-0.5"
                    strokeWidth={2.5}
                  />
                  <span className="text-xs sm:text-sm text-zinc-200 dark:text-white leading-normal">
                    <strong className="font-semibold text-orange-400 dark:text-white">
                      10,000 AI credits / month
                    </strong>
                    <span className="text-zinc-400 dark:text-orange-100/85">
                      {" "}
                      (50x higher monthly allowance)
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check
                    className="size-4 text-orange-500 dark:text-white shrink-0 mt-0.5"
                    strokeWidth={2.5}
                  />
                  <span className="text-xs sm:text-sm text-zinc-200 dark:text-white leading-normal">
                    <strong className="font-semibold text-white">
                      Single-question AI fill
                    </strong>
                    <span className="text-zinc-400 dark:text-orange-100/85">
                      {" "}
                      with custom prompts &amp; guidance
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check
                    className="size-4 text-orange-500 dark:text-white shrink-0 mt-0.5"
                    strokeWidth={2.5}
                  />
                  <span className="text-xs sm:text-sm text-zinc-200 dark:text-white leading-normal">
                    <strong className="font-semibold text-white">
                      Bring Your Own Key (BYOK)
                    </strong>
                    <span className="text-zinc-400 dark:text-orange-100/85">
                      {" "}
                      with direct browser inference
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check
                    className="size-4 text-orange-500 dark:text-white shrink-0 mt-0.5"
                    strokeWidth={2.5}
                  />
                  <span className="text-xs sm:text-sm text-zinc-200 dark:text-white leading-normal">
                    <strong className="font-semibold text-white">
                      Saved Q&amp;A library
                    </strong>
                    <span className="text-zinc-400 dark:text-orange-100/85">
                      {" "}
                      with instant search &amp; 1-click insert
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check
                    className="size-4 text-orange-500 dark:text-white shrink-0 mt-0.5"
                    strokeWidth={2.5}
                  />
                  <span className="text-xs sm:text-sm text-zinc-200 dark:text-white leading-normal">
                    <strong className="font-semibold text-white">
                      Public profile portfolio
                    </strong>
                    <span className="text-zinc-400 dark:text-orange-100/85">
                      {" "}
                      (Shareable lazee.dev/u/ link)
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>
  );
}
