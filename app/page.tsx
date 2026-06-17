import { HeroSection } from "@/components/hero-section";
import { LogoCarousel } from "@/components/logo-carousel";
import { ComparisonSection } from "@/components/comparison-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { DashboardPreviewSection } from "@/components/dashboard-preview-section";
import { GridFeaturesSection } from "@/components/grid-features-section";
import { StatsSection } from "@/components/stats-section";
import { PricingSection } from "@/components/pricing-section";
import { FaqSection } from "@/components/faq-section";
import { FooterCtaSection } from "@/components/footer-cta-section";

export default function Home() {
  return (
    <div className="relative py-20 flex min-h-screen flex-col items-center overflow-hidden bg-[#fefaf6] selection:bg-orange-500 selection:text-white">
      <div
        className="absolute inset-0 z-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <main className="relative z-10 flex w-full max-w-6xl flex-col items-center px-4 sm:px-8 overflow-visible">
        <HeroSection />
        <LogoCarousel />
        <ComparisonSection />
        <HowItWorksSection />
        <DashboardPreviewSection />
        <GridFeaturesSection />
        <StatsSection />
        <PricingSection />
        <FaqSection />
        <FooterCtaSection />
      </main>
    </div>
  );
}
