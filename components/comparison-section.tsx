"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { X, Check, ArrowRight } from "lucide-react";

export function ComparisonSection() {
  const painPoints = [
    "Fill basic details",
    "Re-upload resume",
    "Answer questions",
    "Write cover letters",
    "Repeat everything",
  ];

  const benefits = [
    "One click apply",
    "AI fills everything",
    "Smart answers",
    "Tailored responses",
    "Focus on what matters",
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full mb-24"
    >
      <div className="w-full bg-[#0d0d12] border-[3px] border-black rounded-3xl p-4 sm:p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <h2 className="text-3xl md:text-4xl font-heading font-black text-center uppercase tracking-tight mb-12">
          Save hours on every application
        </h2>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 relative z-10">
          {/* Without Lazee Card */}
          <div className="flex-1 w-full bg-white text-black border-[3px] border-black rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
            <div className="w-32 h-32 relative shrink-0">
              <Image
                src="/sad-dev.png"
                alt="Tired developer without Lazee"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 flex flex-col gap-4 w-full">
              <div className="flex items-center gap-2 border-b-2 border-zinc-100 pb-2">
                <span className="text-xs font-black uppercase bg-zinc-100 px-2.5 py-1 text-zinc-500 rounded-md">
                  Without Lazee
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-500">
                  Apply to 10 jobs
                </span>
                <span className="text-4xl font-black text-red-500 tracking-tight">
                  40 <span className="text-lg font-bold">minutes</span>
                </span>
              </div>
              <ul className="flex flex-col gap-2.5">
                {painPoints.map((point, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-md bg-red-50 border-2 border-red-200">
                      <X className="w-3.5 h-3.5 text-red-500" strokeWidth={3} />
                    </div>
                    <span className="font-bold text-sm text-zinc-600">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Central Arrow Separator */}
          <div className="flex shrink-0 items-center justify-center w-12 h-12 bg-orange-500 border-[3px] border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white transform rotate-90 lg:rotate-0 my-2 lg:my-0">
            <ArrowRight className="w-6 h-6 animate-pulse" strokeWidth={3} />
          </div>

          {/* With Lazee Card */}
          <div className="flex-1 w-full bg-white text-black border-[3px] border-black rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
            {/* Sparkles visual decoration */}
            <div className="w-32 h-32 relative shrink-0">
              <Image
                src="/happy-dev.png"
                alt="Excited developer with Lazee"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 flex flex-col gap-4 w-full">
              <div className="flex items-center gap-2 border-b-2 border-zinc-100 pb-2">
                <span className="text-xs font-black uppercase bg-orange-50 px-2.5 py-1 text-orange-500 rounded-md">
                  With Lazee
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-orange-500">
                  Apply to 10 jobs
                </span>
                <span className="text-4xl font-black text-orange-500 tracking-tight">
                  4 <span className="text-lg font-bold">minutes</span>
                </span>
              </div>
              <ul className="flex flex-col gap-2.5">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-md bg-green-50 border-2 border-green-200">
                      <Check
                        className="w-3.5 h-3.5 text-green-600"
                        strokeWidth={3}
                      />
                    </div>
                    <span className="font-bold text-sm text-zinc-700">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
