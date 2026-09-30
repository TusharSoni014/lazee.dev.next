"use client";

import { motion } from "motion/react";
import { Cpu, CheckCircle2, Database } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Establish Your Candidate Record",
      badge: "Single Source of Truth",
      description:
        "Input your work history, skills, links, and multiple resume variants once in profile.",
      icon: Database,
      preview: (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 p-3.5 space-y-2 font-mono text-[11px]">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-400">
            <span>profile_schema.json</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Valid
            </span>
          </div>
          <div className="space-y-1 text-zinc-600 dark:text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-400">ident:</span>
              <span className="text-zinc-800 dark:text-zinc-200">
                Marcus Vance
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">role:</span>
              <span>Staff Distributed Systems</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">resumes:</span>
              <span className="text-orange-600 font-medium">
                3 variants loaded
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      step: "02",
      title: "Ambient ATS Schema Detection",
      badge: "Universal DOM Engine",
      description:
        "Open any career portal. Lazee inspects the page DOM and deterministically maps Greenhouse, Lever, Ashby, or Workday forms.",
      icon: Cpu,
      preview: (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 p-3.5 space-y-2 font-mono text-[11px]">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-400">
            <span>ats_scanner</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Ashby Detected
            </span>
          </div>
          <div className="space-y-1 text-zinc-600 dark:text-zinc-300">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">input#name:</span>
              <span className="text-emerald-600 text-[10px]">100% Match</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">input#resume:</span>
              <span className="text-emerald-600 text-[10px]">
                Auto-attached
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">textarea#open:</span>
              <span className="text-orange-600 text-[10px]">Context Ready</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      step: "03",
      title: "1-Click Verify & Dispatch",
      badge: "Candidate In Control",
      description:
        "Review pre-filled fields in milliseconds, let AI draft tailored answers from real career accomplishments, and submit.",
      icon: CheckCircle2,
      preview: (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 p-3.5 space-y-2 font-mono text-[11px]">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-400">
            <span>submission_pipeline</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Verified
            </span>
          </div>
          <div className="space-y-1.5 text-zinc-600 dark:text-zinc-300">
            <div className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded p-1.5 text-emerald-700 dark:text-emerald-400 flex items-center justify-between text-[10px]">
              <span>Form Fields Populated</span>
              <span>18/18</span>
            </div>
            <div className="flex justify-between text-[10px] text-zinc-400 pt-0.5">
              <span>Time saved: 21m 40s</span>
              <span className="text-orange-600 font-semibold">
                Ready to Submit
              </span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <motion.section
      id="workflow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full my-12 sm:my-20"
    >
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-mono font-medium mb-3">
          <span>Execution Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          How Lazee Dispatches Applications
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
          A deterministic 3-stage process built for engineering workflows. No
          background bots spamming generic applications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 flex flex-col justify-between shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                    {item.step}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {item.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Icon className="size-4 text-orange-600 dark:text-orange-500 shrink-0" />
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="mt-auto pt-2">{item.preview}</div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
