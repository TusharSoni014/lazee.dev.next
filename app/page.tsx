"use client";

import { PricingSection } from "@/components/pricing-section";
import { FaqSection } from "@/components/faq-section";
import { HeroSection } from "@/components/hero-section";
import { EarlyAccessSection } from "@/components/early-access-section";
import { FeaturesSection } from "@/components/features-section";

export default function Home() {
  return (
    <div className="relative py-20 flex min-h-screen flex-col items-center overflow-hidden bg-[#fefaf6] selection:bg-orange-500 selection:text-white">
      <div
        className="absolute inset-0 z-0 opacity-[0.1]"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <main className="relative z-10 flex w-full max-w-6xl flex-col items-center px-4 sm:px-8 pt-6 lg:pt-12">
        <HeroSection />
        <EarlyAccessSection />
        <FeaturesSection />
        <PricingSection />
        <FaqSection />
      </main>
    </div>
  );
}
