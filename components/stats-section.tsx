"use client";

import { motion } from "motion/react";

export function StatsSection() {
  const stats = [
    { value: "2,000+", label: "Developers" },
    { value: "500K+", label: "Fields Autofilled" },
    { value: "10K+", label: "Applications Submitted" },
    { value: "97%", label: "Time Saved" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="w-full mb-24"
    >
      <div className="w-full bg-[#0d0d12] border-[3px] border-black rounded-2xl p-8 sm:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col gap-1.5 justify-center items-center"
            >
              <span className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm font-black uppercase text-zinc-400 tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
