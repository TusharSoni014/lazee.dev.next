"use client";

import { motion } from "motion/react";
import { InstallModal } from "./install-modal";
import { useBrowser } from "@/hooks/use-browser";
import { FaChrome, FaFirefox } from "react-icons/fa";

export function FooterCtaSection() {
  const browser = useBrowser();
  const isFirefox = browser === "firefox";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full my-12 sm:my-20"
    >
      <div className="w-full rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
        {/* Ambient Warm Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Content (Left) */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-4 relative z-10">
          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
            Start in 30 Seconds
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-white leading-[1.12]">
            Reclaim your focus. <br className="hidden sm:inline" />
            Stop retyping the same resume 50 times.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl">
            Join 2,400+ software engineers automating tedious ATS form reentry. Native schema mapping, contextual answer synthesis, and 100% candidate control.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 w-full sm:w-auto">
            <InstallModal>
              <button className="h-12 w-full sm:w-auto min-w-[240px] px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_16px_-4px_rgba(234,88,12,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer">
                {isFirefox ? (
                  <FaFirefox className="size-4 shrink-0" />
                ) : (
                  <FaChrome className="size-4 shrink-0" />
                )}
                <span>Add to {isFirefox ? "Firefox" : "Chrome"} — It&apos;s Free</span>
              </button>
            </InstallModal>

            <span className="text-xs text-zinc-500 font-mono sm:ml-2">
              No credit card required
            </span>
          </div>
        </div>

        {/* Right Status Card */}
        <div className="w-full md:w-72 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shrink-0 z-10 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="text-zinc-400">Extension Engine</span>
            <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          </div>
          <div className="space-y-2 text-zinc-300 text-[11px]">
            <div className="flex justify-between">
              <span className="text-zinc-500">Greenhouse:</span>
              <span className="text-emerald-400">Supported</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Lever / Ashby:</span>
              <span className="text-emerald-400">Supported</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Workday ATS:</span>
              <span className="text-emerald-400">Supported</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Free Credits:</span>
              <span className="text-orange-400 font-semibold">200 / Month</span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
