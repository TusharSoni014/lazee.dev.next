"use client";

import { motion } from "motion/react";
import { X, Check, AlertTriangle, Zap } from "lucide-react";

export function ComparisonSection() {
  const manualFrictions = [
    "Retyping employment history that ATS parsers constantly mangle",
    "Manually re-entering phone, links, notice period, and compensation numbers",
    "Drafting repetitive 'Why our company?' answers from an empty text box",
    "Switching between folder tabs to locate the correct tailored resume PDF",
    "Application fatigue reducing submissions to under 2 per day",
  ];

  const automatedBenefits = [
    "Deterministic DOM schema mapping across Greenhouse, Lever, Ashby & Workday",
    "1-click verification of contact details, links, and employment record",
    "Context-aware AI synthesis for open-ended questions using your real experience",
    "Instant resume version switching directly inside the browser popup",
    "Sub-30-second completion enabling consistent, high-volume pipeline execution",
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full my-12 sm:my-20"
    >
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-mono font-medium mb-3">
          <span>Workflow Telemetry</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          The Engineering Application Benchmark
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
          Comparing the cognitive drag of repetitive portal reentry against verified, automated schema dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
        {/* Left Column: Manual Portal Tax */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="size-3.5" />
                  Manual Portal Friction
                </span>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
                  Repetitive Form Grunt Work
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-rose-600 dark:text-rose-500">
                  ~22m
                </span>
                <span className="block text-[11px] text-zinc-400 font-mono">per application</span>
              </div>
            </div>

            <ul className="space-y-3.5">
              {manualFrictions.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="size-4 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-200 dark:border-rose-900">
                    <X className="size-2.5" strokeWidth={3} />
                  </div>
                  <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-normal">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>Result: Candidate fatigue & slow pipeline</span>
            <span className="text-rose-600 font-semibold">1-3 jobs/day</span>
          </div>
        </div>

        {/* Right Column: With Lazee */}
        <div className="rounded-2xl border border-orange-500/30 dark:border-orange-500/20 bg-gradient-to-b from-orange-500/[0.03] to-transparent dark:from-orange-500/[0.04] p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200/80 dark:border-zinc-800 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1.5">
                  <Zap className="size-3.5" />
                  Lazee Engine
                </span>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
                  Deterministic Schema Automation
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  &lt;30s
                </span>
                <span className="block text-[11px] text-zinc-400 font-mono">verify & submit</span>
              </div>
            </div>

            <ul className="space-y-3.5">
              {automatedBenefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="size-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                    <Check className="size-2.5" strokeWidth={3} />
                  </div>
                  <span className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-medium leading-normal">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 font-mono relative z-10">
            <span>Result: Effortless job hunt velocity</span>
            <span className="text-emerald-600 font-semibold">15-30 jobs/day</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
