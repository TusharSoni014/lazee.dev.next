"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstallModal } from "@/components/install-modal";

export function PricingSection() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  async function handleGoPro() {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_cart: [
            { product_id: "pdt_0NayYkMQdxcLwDxT4hxDk", quantity: 1 },
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
    <motion.div
      id="pricing"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center w-full max-w-[1400px] mx-auto mb-20 px-4 md:px-8"
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4">
            Simple Pricing
          </div>
          <h2 className="mb-4 text-4xl font-black uppercase leading-none md:text-6xl text-black">
            Stop Wasting Time <br />
            <span className="bg-[#ff6b00] px-2 text-black">Applying</span>
          </h2>
          <p className="mx-auto max-w-xl text-lg font-medium text-slate-600">
            Choose the plan that fits your job hunting speed. No hidden fees,
            cancel anytime.
          </p>
        </div>

        {/* Pricing Cards Container */}
        <div className="grid gap-8 md:grid-cols-2 md:items-stretch max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="group relative flex h-full flex-col rounded-none border-4 border-black bg-white p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-black uppercase tracking-wider text-slate-500">
                For Job Hunters
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter text-black">
                  Free
                </span>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-600">
                Perfect for casually browsing and applying to a few select
                roles.
              </p>
            </div>
            <ul className="mb-8 flex flex-col gap-4 flex-1">
              <li className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-none border-2 border-black bg-green-400">
                  <Check
                    className="w-4 h-4 text-black font-bold"
                    strokeWidth={3}
                  />
                </div>
                <span className="font-bold text-black text-base">
                  200 credits per month free
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-none border-2 border-black bg-green-400">
                  <Check
                    className="w-4 h-4 text-black font-bold"
                    strokeWidth={3}
                  />
                </div>
                <span className="font-bold text-black text-base">
                  Unlimited profile data fill basic
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-none border-2 border-black bg-green-400">
                  <Check
                    className="w-4 h-4 text-black font-bold"
                    strokeWidth={3}
                  />
                </div>
                <span className="font-bold text-black text-base">
                  Basic AI suggestions
                </span>
              </li>
              <li className="flex items-center gap-3 opacity-40">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-none border-2 border-slate-300 bg-slate-100">
                  <X
                    className="w-4 h-4 text-slate-400 font-bold"
                    strokeWidth={3}
                  />
                </div>
                <span className="font-medium text-slate-400 line-through text-base">
                  Bulk Apply Mode
                </span>
              </li>
            </ul>
            <div className="mt-auto">
              <InstallModal>
                <Button
                  variant="outline"
                  className="w-full h-12 tracking-wider"
                >
                  Get Started Free
                </Button>
              </InstallModal>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative flex h-full flex-col rounded-none border-4 border-black bg-[#ff6b00] p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {/* Badge */}
            <div className="absolute -right-2 -top-6 rotate-3 border-2 border-black bg-white px-4 py-1 font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black text-sm">
              Best Value
            </div>
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-black uppercase tracking-wider text-black/70">
                For Power Users
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter text-black">
                  $9
                </span>
                <span className="text-xl font-bold text-black/70">/mo</span>
              </div>
              <p className="mt-4 text-sm font-bold text-black/80">
                Supercharge your job search with unlimited power and automation.
              </p>
            </div>
            <ul className="mb-8 flex flex-col gap-4 flex-1">
              <li className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-none border-2 border-black bg-white">
                  <Check
                    className="w-4 h-4 text-black font-bold"
                    strokeWidth={3}
                  />
                </div>
                <span className="font-bold text-black text-base">
                  10k credits per month
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-none border-2 border-black bg-white">
                  <Check
                    className="w-4 h-4 text-black font-bold"
                    strokeWidth={3}
                  />
                </div>
                <span className="font-bold text-black text-base">
                  Access to beta features
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-none border-2 border-black bg-white">
                  <Check
                    className="w-4 h-4 text-black font-bold"
                    strokeWidth={3}
                  />
                </div>
                <span className="font-bold text-black text-base">
                  Bulk Apply Mode
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-none border-2 border-black bg-white">
                  <Check
                    className="w-4 h-4 text-black font-bold"
                    strokeWidth={3}
                  />
                </div>
                <span className="font-bold text-black text-base">
                  Priority Support
                </span>
              </li>
            </ul>
            <div className="mt-auto">
              <Button
                variant="black"
                onClick={handleGoPro}
                disabled={isCheckingOut}
                className="w-full py-3 h-auto shadow-[4px_4px_0px_0px_white] hover:shadow-[6px_6px_0px_0px_white] disabled:opacity-70"
              >
                {isCheckingOut ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redirecting...
                  </span>
                ) : (
                  "Go Pro Now"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
