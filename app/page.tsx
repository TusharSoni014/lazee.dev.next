import { HeroSection } from "@/components/hero-section";
import { VideoSection } from "@/components/video-section";
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
    <div className="relative min-h-[100dvh] flex flex-col items-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 selection:bg-orange-500/20 selection:text-orange-950 dark:selection:text-orange-200">
      {/* Subtle Ambient Illumination */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-orange-500/[0.07] via-orange-500/[0.02] to-transparent blur-3xl rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.2]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #d4d4d8 1px, transparent 0)`,
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 30%, #000 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 30%, #000 40%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex w-full max-w-7xl flex-col items-center px-4 sm:px-6 lg:px-8">
        <HeroSection />
        <VideoSection />
        <LogoCarousel />
        <ComparisonSection />
        <HowItWorksSection />
        <DashboardPreviewSection />
        <GridFeaturesSection />
        <StatsSection />
        <PricingSection />
        <FaqSection />
        <FooterCtaSection />
      </div>
    </div>
  );
}
