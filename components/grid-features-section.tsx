"use client";

import { motion } from "motion/react";
import { Sparkles, FileText, CheckCircle2, Globe, Laptop, ArrowRight } from "lucide-react";
import Image from "next/image";

export function GridFeaturesSection() {
  return (
    <section className="w-full mb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Card 1: AI-Powered Answers */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-[#f3e8ff] border-[3px] border-black rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[280px]"
        >
          <div>
            <span className="text-xs font-black uppercase text-purple-700 tracking-wider">AI-Powered Answers</span>
            <h4 className="text-xl sm:text-2xl font-heading font-black text-black uppercase mt-2 leading-tight">
              Smart, tailored answers for every question.
            </h4>
          </div>
          
          {/* Card 1 Graphic */}
          <div className="mt-6 bg-white border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] flex flex-col gap-2 relative overflow-hidden">
            <div className="flex items-center gap-1 text-purple-600 font-bold text-xs">
              <Sparkles size={14} className="fill-purple-600" />
              <span>AI Suggestion:</span>
            </div>
            <p className="text-[10px] font-bold text-zinc-700 leading-normal border-l-2 border-purple-400 pl-2">
              "Over my 4 years of experience as a Frontend Engineer, I have successfully designed, built, and optimized complex React applications, improving performance by 30%..."
            </p>
            <div className="flex justify-end mt-1">
              <span className="text-[8px] bg-purple-100 text-purple-600 border border-purple-200 px-2 py-0.5 font-bold uppercase rounded">
                Refine Answer
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Developer Profile */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#ffe4e6] border-[3px] border-black rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[280px]"
        >
          <div>
            <span className="text-xs font-black uppercase text-rose-700 tracking-wider">Developer Profile</span>
            <h4 className="text-xl sm:text-2xl font-heading font-black text-black uppercase mt-2 leading-tight">
              Get your public profile lazee.dev/username
            </h4>
          </div>

          {/* Card 2 Graphic */}
          <div className="mt-6 bg-white border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] flex items-center gap-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-full border border-black overflow-hidden relative shrink-0">
              <div className="w-full h-full bg-rose-500 text-white flex items-center justify-center font-black text-sm">
                T
              </div>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              <span className="text-[10px] font-black uppercase text-black leading-none">Tushar Soni</span>
              <span className="text-[8px] font-bold text-zinc-400 mt-0.5">Full Stack Developer</span>
              <div className="flex gap-1 mt-1.5 flex-wrap">
                <span className="text-[7px] font-bold border border-black bg-zinc-100 px-1 py-0.5">React</span>
                <span className="text-[7px] font-bold border border-black bg-zinc-100 px-1 py-0.5">Next.js</span>
                <span className="text-[7px] font-bold border border-black bg-zinc-100 px-1 py-0.5">TS</span>
              </div>
            </div>
            <div className="shrink-0">
              <ArrowRight size={16} className="text-rose-600" />
            </div>
          </div>
        </motion.div>

        {/* Card 3: Multiple Resumes */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-[#d1fae5] border-[3px] border-black rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[280px]"
        >
          <div>
            <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">Multiple Resumes</span>
            <h4 className="text-xl sm:text-2xl font-heading font-black text-black uppercase mt-2 leading-tight">
              Manage & switch between multiple resumes.
            </h4>
          </div>

          {/* Card 3 Graphic */}
          <div className="mt-6 flex flex-col gap-2 relative h-28 justify-center select-none">
            {/* Stacked Cards Mock */}
            <div className="bg-white border-2 border-black rounded-lg p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] flex justify-between items-center z-20">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-emerald-600 shrink-0" />
                <span className="text-[10px] font-black uppercase truncate max-w-[120px] sm:max-w-none">Resume_Frontend_2026.pdf</span>
              </div>
              <span className="text-[8px] font-black uppercase bg-emerald-500 text-white px-2 py-0.5 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                Active
              </span>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-1 right-1 h-10 bg-white/70 border border-black rounded-lg -z-10 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.05)] transform scale-[0.98] flex items-center px-2.5">
              <div className="flex items-center gap-2 opacity-60">
                <FileText size={14} className="text-zinc-600 shrink-0" />
                <span className="text-[10px] font-bold text-zinc-600">Resume_Fullstack.pdf</span>
              </div>
            </div>
            <div className="absolute top-2/3 -translate-y-1/2 left-2 right-2 h-10 bg-white/40 border border-black rounded-lg -z-20 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.05)] transform scale-[0.95]" />
          </div>
        </motion.div>

        {/* Card 4: Works Everywhere */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#fef9c3] border-[3px] border-black rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[280px]"
        >
          <div>
            <span className="text-xs font-black uppercase text-amber-700 tracking-wider">Works Everywhere</span>
            <h4 className="text-xl sm:text-2xl font-heading font-black text-black uppercase mt-2 leading-tight">
              Compatible with popular job boards.
            </h4>
          </div>

          {/* Card 4 Graphic */}
          <div className="mt-6 bg-white border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] flex items-center justify-center gap-3 relative overflow-hidden h-28">
            <div className="flex gap-2 items-center flex-wrap justify-center relative">
              {/* Floating tags representing ATS platforms */}
              <span className="text-[8px] font-black border border-black bg-[#fafafa] px-2 py-1 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] rotate-2">Workday</span>
              <span className="text-[8px] font-black border border-black bg-[#fafafa] px-2 py-1 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] -rotate-3">Greenhouse</span>
              <span className="text-[8px] font-black border border-black bg-[#fafafa] px-2 py-1 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] rotate-3">Lever</span>
              <span className="text-[8px] font-black border border-black bg-[#fafafa] px-2 py-1 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] -rotate-1">LinkedIn</span>
              <span className="text-[8px] font-black border border-black bg-[#fafafa] px-2 py-1 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] rotate-1">Indeed</span>
              <span className="text-[8px] font-black border border-black bg-[#fafafa] px-2 py-1 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] -rotate-2">Ashby</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
