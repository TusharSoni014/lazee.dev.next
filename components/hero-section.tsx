"use client";

import { motion } from "motion/react";
import { HeroDemo } from "@/components/hero-demo";

export function HeroSection() {
  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 mb-16 mt-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:gap-8"
      >
        <div className="inline-block bg-[#ffeb3b] border-[3px] border-black px-4 py-2 mt-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 hover:rotate-0 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <span className="text-black text-sm sm:text-base font-black uppercase tracking-widest">
            Stop Typing. Start Applying.
          </span>
        </div>

        <h1 className="max-w-xl text-4xl font-black tracking-tight text-black sm:text-5xl md:text-6xl leading-[1.1] uppercase mt-2 mb-2">
          Apply Jobs, <br />
          <span className="inline-block bg-[#ff6b00] text-white px-3 py-1 sm:px-4 sm:py-2 mt-4 sm:mt-6 border-[3px] sm:border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:-rotate-1 hover:scale-105 transition-all">
            100x Faster.
          </span>
        </h1>

        <p className="max-w-lg text-base font-bold leading-relaxed text-black sm:text-lg tracking-tight bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6 mt-4 md:mt-6 transform -rotate-1">
          Lazee.dev is the browser extension that fills your job applications
          automatically with AI.{" "}
          <span className="bg-[#00bcd4] px-2 py-0.5 text-black border-2 border-black inline-block transform rotate-2">
            Zero hassle
          </span>
          , just results.
        </p>
      </motion.div>

      {/* Right Demo Column */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex-1 w-full max-w-md lg:max-w-full flex justify-center lg:justify-end"
      >
        <HeroDemo />
      </motion.div>
    </div>
  );
}
