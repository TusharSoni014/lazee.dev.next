"use client";

import { motion } from "motion/react";
import { HeroDemo } from "@/components/hero-demo";
import { ShieldCheck, Check, ArrowRight, Star } from "lucide-react";
import { InstallModal } from "./install-modal";
import { useBrowser } from "@/hooks/use-browser";
import { FaChrome, FaFirefox } from "react-icons/fa";
import Link from "next/link";

export function HeroSection() {
  const browser = useBrowser();
  const isFirefox = browser === "firefox";

  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 pt-8 pb-16 sm:py-20 lg:py-24">
      {/* Left Column (Content) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left"
      >
        {/* Release / Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-700 dark:text-orange-400 text-xs font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <span className="font-mono text-[11px]">v2.4 Released</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span>Now with Ashby & Workday auto-mapping</span>
        </div>

        {/* Title */}
        <h1 className="max-w-2xl text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.08]">
          Eliminate repetitive job applications.{" "}
          <span className="text-orange-600 dark:text-orange-500">Apply in seconds,</span> not hours.
        </h1>

        {/* Subtitle / Paragraph */}
        <p className="max-w-xl text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed mt-5">
          Lazee is the developer-focused browser extension that deterministically maps your engineering record, multiple tailored resumes, and project metrics into any hiring portal.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-8">
          <InstallModal>
            <button className="h-12 w-full sm:w-auto min-w-[220px] px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_16px_-4px_rgba(234,88,12,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer">
              {isFirefox ? (
                <FaFirefox className="size-4 shrink-0" />
              ) : (
                <FaChrome className="size-4 shrink-0" />
              )}
              <span>Add to {isFirefox ? "Firefox" : "Chrome"} — Free</span>
            </button>
          </InstallModal>

          <Link
            href="#features"
            className="h-12 w-full sm:w-auto px-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 font-medium text-sm transition-all flex items-center justify-center gap-2"
          >
            <span>See Architecture</span>
            <ArrowRight className="size-3.5 text-zinc-400" />
          </Link>
        </div>

        {/* Micro reassurance notes */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-4 mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            200 free monthly AI credits
          </span>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
          <span className="flex items-center gap-1.5">
            <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            Works on 100+ career portals
          </span>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            Local-first privacy
          </span>
        </div>

        {/* Engineer Social Proof Bar */}
        <div className="mt-10 pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 w-full flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5 overflow-hidden">
              {["MV", "ER", "DZ", "SK"].map((initials, i) => (
                <div
                  key={i}
                  className="inline-flex items-center justify-center size-7 rounded-full ring-2 ring-white dark:ring-zinc-950 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  {initials}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-0.5 text-amber-500 ml-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-amber-500 text-amber-500" />
              ))}
            </div>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-normal text-center sm:text-left">
            Trusted by <span className="font-semibold text-zinc-900 dark:text-zinc-100">2,400+ software engineers</span> saving an average of 18 hours per search.
          </p>
        </div>
      </motion.div>

      {/* Right Column (Interactive Simulator) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 w-full max-w-xl lg:max-w-none flex justify-center lg:justify-end"
      >
        <HeroDemo />
      </motion.div>
    </div>
  );
}
