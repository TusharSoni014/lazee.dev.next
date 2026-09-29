"use client";

import { motion } from "motion/react";

export function StatsSection() {
  const stats = [
    { value: "2,400+", label: "Active Engineers", note: "Across 40+ countries" },
    { value: "540K+", label: "Fields Auto-Mapped", note: "Greenhouse, Lever, Ashby, Workday" },
    { value: "97.4%", label: "DOM Detection Rate", note: "Deterministic field binding" },
    { value: "18.5 hrs", label: "Avg. Monthly Time Saved", note: "Per active job search" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full my-12 sm:my-20"
    >
      <div className="w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-sm p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-zinc-200/80 dark:divide-zinc-800">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center px-4"
            >
              <span className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-zinc-900 dark:text-zinc-50 tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-2">
                {stat.label}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono mt-0.5">
                {stat.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
