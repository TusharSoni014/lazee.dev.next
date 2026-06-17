"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        <div className="mb-16 text-center">
          <div className="inline-block border-2 border-black bg-white px-3.5 py-1.5 text-xs font-black uppercase tracking-widest shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] mb-4">
            Simple Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black uppercase leading-tight text-black">
            Simple pricing. <br className="sm:hidden" />
            <span className="text-purple-600">No bullshit.</span>
          </h2>
        </div>

        {/* Pricing Cards Container */}
        <div className="grid gap-8 md:grid-cols-2 md:items-stretch max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="group relative flex h-full flex-col rounded-2xl border-[3px] border-black bg-white p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-6">
              <h3 className="mb-1.5 text-xs font-black uppercase tracking-widest text-zinc-400">
                Free
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-heading font-black tracking-tight text-black">
                  $0
                </span>
                <span className="text-sm font-bold text-zinc-500">/month</span>
              </div>
            </div>
            
            <ul className="mb-8 flex flex-col gap-4 flex-1">
              <li className="flex items-center gap-3">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-md bg-green-50 border border-green-200">
                  <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                </div>
                <span className="font-bold text-sm text-zinc-700">
                  200 AI credits / month
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-md bg-green-50 border border-green-200">
                  <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                </div>
                <span className="font-bold text-sm text-zinc-700">
                  Unlimited basic auto-fill
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-md bg-green-50 border border-green-200">
                  <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                </div>
                <span className="font-bold text-sm text-zinc-700">
                  Basic AI answers
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-md bg-green-50 border border-green-200">
                  <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                </div>
                <span className="font-bold text-sm text-zinc-700">
                  Works on popular sites
                </span>
              </li>
            </ul>

            <div className="mt-auto">
              <InstallModal>
                <button className="w-full h-12 border-2 border-black bg-white hover:bg-zinc-50 font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer">
                  Start for Free
                </button>
              </InstallModal>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative flex h-full flex-col rounded-2xl border-[3px] border-purple-600 bg-white p-8 shadow-[6px_6px_0px_0px_rgba(147,51,234,1)]">
            {/* Badge */}
            <div className="absolute -right-2 -top-5 rotate-3 border-2 border-black bg-[#ff6b00] text-white px-3.5 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] tracking-widest">
              Most Popular
            </div>
            
            <div className="mb-6">
              <h3 className="mb-1.5 text-xs font-black uppercase tracking-widest text-purple-600">
                Pro
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-heading font-black tracking-tight text-black">
                  $9
                </span>
                <span className="text-sm font-bold text-zinc-500">/month</span>
              </div>
            </div>

            <ul className="mb-8 flex flex-col gap-4 flex-1">
              <li className="flex items-center gap-3">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-md bg-purple-50 border border-purple-200">
                  <Check className="w-3.5 h-3.5 text-purple-600" strokeWidth={3} />
                </div>
                <span className="font-bold text-sm text-zinc-700">
                  10,000 AI credits / month
                </span>
              </li>

              <li className="flex items-center gap-3">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-md bg-purple-50 border border-purple-200">
                  <Check className="w-3.5 h-3.5 text-purple-600" strokeWidth={3} />
                </div>
                <span className="font-bold text-sm text-zinc-700">
                  Advanced AI answers
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-md bg-purple-50 border border-purple-200">
                  <Check className="w-3.5 h-3.5 text-purple-600" strokeWidth={3} />
                </div>
                <span className="font-bold text-sm text-zinc-700">
                  Priority support
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-md bg-purple-50 border border-purple-200">
                  <Check className="w-3.5 h-3.5 text-purple-600" strokeWidth={3} />
                </div>
                <span className="font-bold text-sm text-zinc-700">
                  Early access to new features
                </span>
              </li>
            </ul>

            <div className="mt-auto">
              <button
                onClick={handleGoPro}
                disabled={isCheckingOut}
                className="w-full h-12 border-2 border-black bg-purple-600 hover:bg-purple-700 text-white font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isCheckingOut ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Redirecting...
                  </span>
                ) : isPro ? (
                  "Manage Subscription"
                ) : (
                  "Get Pro"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
