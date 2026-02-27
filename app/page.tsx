"use client";

import { EarlyAccessForm } from "@/components/early-access-form";
import { HeroDemo } from "@/components/hero-demo";
import { PricingSection } from "@/components/pricing-section";
import { ArrowRight, Globe, Lock, Wand2 } from "lucide-react";

export default function Home() {
  return (
    <div className="relative py-20 flex min-h-screen flex-col items-center overflow-hidden bg-[#fefaf6] selection:bg-orange-500 selection:text-white">
      {/* Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.1]"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <main className="relative z-10 flex w-full max-w-6xl flex-col items-center px-4 sm:px-8 pt-6 lg:pt-12">
        {/* 2-Column Hero Section */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 mb-16 mt-8">
          {/* Left Text Column */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 animate-fade-in-up">
            <h1 className="max-w-xl text-4xl font-extrabold tracking-tight text-black sm:text-5xl md:text-5xl leading-[1.15]">
              Job Applications, <br />
              <span className="text-orange-500 underline decoration-[3px] underline-offset-4 sm:decoration-[4px] sm:underline-offset-8 text-[1.05em]">
                100x Faster.
              </span>
            </h1>

            <p className="max-w-lg text-base font-semibold leading-relaxed text-zinc-700 sm:text-lg tracking-tight border-l-4 border-orange-500 pl-4">
              Lazee.dev is the browser extension that fills your job
              applications automatically with AI.
            </p>
          </div>

          {/* Right Demo Column */}
          <div className="flex-1 w-full max-w-md lg:max-w-full flex justify-center lg:justify-end animate-fade-in-up [animation-delay:200ms]">
            <HeroDemo />
          </div>
        </div>

        {/* Early Access Section */}
        <div className="flex flex-col items-center w-full max-w-[500px] mt-10 mb-20 animate-fade-in-up [animation-delay:400ms]">
          <div className="w-full mb-6 mt-4">
            <EarlyAccessForm />
          </div>

          <p className="text-sm sm:text-base font-bold text-zinc-700 tracking-tight text-center">
            Follow{" "}
            <a
              href="https://twitter.com/tusharsoni014"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline decoration-2 underline-offset-4"
            >
              @tusharsoni014
            </a>{" "}
            on Twitter for dev log updates.
          </p>
        </div>

        {/* Features Section */}
        <div className="flex flex-col items-center w-full max-w-[1400px] mx-auto animate-fade-in-up [animation-delay:600ms]">
          <div className="w-full mb-16 text-center max-w-4xl mx-auto">
            <div className="inline-block bg-[#ff80ab] border-[3px] border-black px-4 py-1 mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
              <h2 className="text-black text-lg font-bold uppercase tracking-wide">
                Why You Need This Tool
              </h2>
            </div>
            <h2 className="text-black text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-6 uppercase">
              Powerful Features
              <br />
              Zero Bullshit.
            </h2>
            <p className="text-black text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed border-l-4 border-black pl-6 text-left md:text-center md:border-none md:pl-0 bg-white/50 p-2 md:bg-transparent tracking-tight">
              Our extension is packed with tools designed to make your job
              application process faster, safer, and essentially automated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-20">
            {/* Feature 1 */}
            <div className="flex flex-col h-full bg-[#ff6b00] border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 group">
              <div className="flex justify-between items-start mb-6">
                <div className="size-16 bg-white border-[3px] border-black flex items-center justify-center rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none transition-all">
                  <Wand2 className="text-black w-8 h-8" />
                </div>
                <span className="text-5xl font-black text-black/10 select-none">
                  01
                </span>
              </div>
              <h3 className="text-black text-2xl font-black mb-4 uppercase">
                Smart Auto-fill
              </h3>
              <p className="text-black text-lg font-medium leading-snug flex-grow">
                Automatically detects and fills job application forms with your
                saved data using advanced AI algorithms. Say goodbye to
                repetitive typing.
              </p>
              <div className="mt-6 pt-4 border-t-[3px] border-black w-full">
                <a
                  className="inline-flex items-center gap-2 font-bold hover:underline decoration-2 text-black"
                  href="#"
                >
                  Learn more <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col h-full bg-[#ffeb3b] border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 group">
              <div className="flex justify-between items-start mb-6">
                <div className="size-16 bg-white border-[3px] border-black flex items-center justify-center rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none transition-all">
                  <Lock className="text-black w-8 h-8" />
                </div>
                <span className="text-5xl font-black text-black/10 select-none">
                  02
                </span>
              </div>
              <h3 className="text-black text-2xl font-black mb-4 uppercase">
                Privacy First
              </h3>
              <p className="text-black text-lg font-medium leading-snug flex-grow">
                Your data never leaves your device. We prioritize your privacy
                and security above everything else. Local storage only, always
                encrypted.
              </p>
              <div className="mt-6 pt-4 border-t-[3px] border-black w-full">
                <a
                  className="inline-flex items-center gap-2 font-bold hover:underline decoration-2 text-black"
                  href="#"
                >
                  Read security policy <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col h-full bg-[#00bcd4] border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 group">
              <div className="flex justify-between items-start mb-6">
                <div className="size-16 bg-white border-[3px] border-black flex items-center justify-center rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none transition-all">
                  <Globe className="text-black w-8 h-8" />
                </div>
                <span className="text-5xl font-black text-black/10 select-none">
                  03
                </span>
              </div>
              <h3 className="text-black text-2xl font-black mb-4 uppercase">
                Multi-site Support
              </h3>
              <p className="text-black text-lg font-medium leading-snug flex-grow">
                Works seamlessly across all major job boards and company career
                pages worldwide.
              </p>
              <div className="mt-4 mb-2 bg-white border-[3px] border-black p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                <p className="text-sm font-bold uppercase mb-2 border-b-2 border-black pb-1 text-black">
                  Supported on:
                </p>
                <div className="text-black text-xs font-bold text-center mt-1">
                  Chrome, Firefox, Safari
                </div>
              </div>
              <div className="mt-6 pt-4 border-t-[3px] border-black w-full">
                <a
                  className="inline-flex items-center gap-2 font-bold hover:underline decoration-2 text-black"
                  href="#"
                >
                  View supported sites <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <PricingSection />
      </main>

      <footer className="text-[10px] font-black tracking-[0.2em] uppercase pt-24 pb-8 text-black/40">
        <p>© 2026 Lazee.dev. *TERMS AND CONDITIONS APPLY.</p>
      </footer>
    </div>
  );
}
