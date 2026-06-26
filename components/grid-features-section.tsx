"use client";

import { motion } from "motion/react";
import { Sparkles, FileText, Globe, ArrowRight, Mail, Layers, Laptop } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
} as const;

export function GridFeaturesSection() {
  return (
    <section className="w-full mb-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
      >
        {/* Card 1: AI-Powered Answers */}
        <motion.div
          variants={cardVariants}
          className="flex w-full"
        >
          <div className="bg-white border-2 border-black rounded-none p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-[transform,box-shadow] duration-200 ease-out flex flex-col justify-between min-h-[310px] w-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block border border-orange-200 bg-orange-50 text-orange-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-none">
                  AI Autofill
                </span>
                <Sparkles size={18} className="text-orange-500 fill-orange-100" />
              </div>
              <h4 className="text-lg sm:text-xl font-heading font-black text-black uppercase leading-tight">
                Smart, tailored answers for every question.
              </h4>
              <p className="text-xs font-bold text-zinc-500 mt-2 leading-relaxed">
                Lazee analyzes the question and draws context directly from your profile details to generate professional, context-rich answers.
              </p>
            </div>
            
            <div className="mt-6 bg-zinc-50 border-2 border-black rounded-none p-4 flex flex-col gap-2 relative overflow-hidden">
              <div className="flex items-center gap-1 text-orange-600 font-black text-[10px]">
                <Sparkles size={12} className="fill-orange-600" />
                <span>AI SUGGESTION:</span>
              </div>
              <p className="text-[9px] font-bold text-zinc-700 leading-normal border-l-2 border-orange-400 pl-2">
                "Over my 4 years of experience as a Frontend Engineer, I have successfully designed, built, and optimized complex React applications..."
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Developer Profile */}
        <motion.div
          variants={cardVariants}
          className="flex w-full"
        >
          <div className="bg-white border-2 border-black rounded-none p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-[transform,box-shadow] duration-200 ease-out flex flex-col justify-between min-h-[310px] w-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block border border-rose-200 bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-none">
                  Developer Profile
                </span>
                <Laptop size={18} className="text-rose-500" />
              </div>
              <h4 className="text-lg sm:text-xl font-heading font-black text-black uppercase leading-tight">
                Get your public profile lazee.dev/username
              </h4>
              <p className="text-xs font-bold text-zinc-500 mt-2 leading-relaxed">
                Create a modern, shareable link showcasing your expertise, projects, and contact info, double-hatting as a quick recruiter portal.
              </p>
            </div>

            <div className="mt-6 bg-zinc-50 border-2 border-black rounded-none p-3 flex items-center gap-3 relative overflow-hidden">
              <div className="w-8 h-8 rounded-none border border-black overflow-hidden relative shrink-0">
                <div className="w-full h-full bg-rose-500 text-white flex items-center justify-center font-black text-xs rounded-none">
                  T
                </div>
              </div>
              <div className="flex-1 flex flex-col overflow-hidden">
                <span className="text-[9px] font-black uppercase text-black leading-none">Tushar Soni</span>
                <span className="text-[8px] font-bold text-zinc-400 mt-0.5">Full Stack Developer</span>
              </div>
              <div className="shrink-0">
                <ArrowRight size={14} className="text-rose-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Multiple Resumes */}
        <motion.div
          variants={cardVariants}
          className="flex w-full"
        >
          <div className="bg-white border-2 border-black rounded-none p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-[transform,box-shadow] duration-200 ease-out flex flex-col justify-between min-h-[310px] w-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-none">
                  Resumes
                </span>
                <FileText size={18} className="text-emerald-500" />
              </div>
              <h4 className="text-lg sm:text-xl font-heading font-black text-black uppercase leading-tight">
                Manage & switch between multiple resumes.
              </h4>
              <p className="text-xs font-bold text-zinc-500 mt-2 leading-relaxed">
                Upload tailored resume copies (e.g. Frontend, Fullstack, PM) and switch active copies instantly directly from the browser popup.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2 relative h-16 justify-center select-none">
              <div className="bg-white border-2 border-black rounded-none p-2 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                  <FileText size={12} className="text-emerald-600 shrink-0" />
                  <span className="text-[9px] font-black uppercase truncate max-w-[120px]">Resume_Frontend_2026.pdf</span>
                </div>
                <span className="text-[8px] font-black uppercase bg-emerald-500 text-white px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] scale-90 rounded-none">
                  Active
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Works Everywhere */}
        <motion.div
          variants={cardVariants}
          className="flex w-full"
        >
          <div className="bg-white border-2 border-black rounded-none p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-[transform,box-shadow] duration-200 ease-out flex flex-col justify-between min-h-[310px] w-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-none">
                  Compatibility
                </span>
                <Globe size={18} className="text-amber-500" />
              </div>
              <h4 className="text-lg sm:text-xl font-heading font-black text-black uppercase leading-tight">
                Compatible with 100+ job boards.
              </h4>
              <p className="text-xs font-bold text-zinc-500 mt-2 leading-relaxed">
                Officially supporting Greenhouse, Lever, SmartRecruiters, Y Combinator, Wellfound, Glassdoor, Google Forms, Notion, Airtable, Tally, and Gmail, with new ones added daily.
              </p>
              <p className="text-[11px] font-bold text-zinc-700 mt-2">
                Want to support another ATS?{" "}
                <Link href="/feedback" className="text-orange-500 font-black hover:underline">
                  Request it here
                </Link>.
              </p>
            </div>

            <div className="mt-6 bg-zinc-50 border-2 border-black rounded-none p-2.5 flex items-center justify-center gap-1.5 relative overflow-hidden flex-wrap">
              <span className="text-[8px] font-black border border-black bg-white px-1.5 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] rotate-2 rounded-none">Greenhouse</span>
              <span className="text-[8px] font-black border border-black bg-white px-1.5 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] -rotate-3 rounded-none">Lever</span>
              <span className="text-[8px] font-black border border-black bg-white px-1.5 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] rotate-3 rounded-none">Y Combinator</span>
              <span className="text-[8px] font-black border border-black bg-white px-1.5 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] -rotate-1 rounded-none">Workday</span>
            </div>
          </div>
        </motion.div>

        {/* Card 5: AI Cold DM Generator */}
        <motion.div
          variants={cardVariants}
          className="flex w-full"
        >
          <div className="bg-white border-2 border-black rounded-none p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-[transform,box-shadow] duration-200 ease-out flex flex-col justify-between min-h-[310px] w-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block border border-blue-200 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-none">
                  Outreach
                </span>
                <Mail size={18} className="text-blue-500" />
              </div>
              <h4 className="text-lg sm:text-xl font-heading font-black text-black uppercase leading-tight">
                Draft recruiter cold DMs instantly.
              </h4>
              <p className="text-xs font-bold text-zinc-500 mt-2 leading-relaxed">
                Draft professional, personalized cold emails directly inside Gmail. Lazee utilizes target job details and your background to write high-converting outreach text.
              </p>
            </div>

            <div className="mt-6 bg-zinc-50 border-2 border-black rounded-none p-3 flex flex-col gap-1.5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-1">
                <span className="text-[8px] font-black text-black">New Outreach Message</span>
                <span className="text-[7px] font-bold text-zinc-400">Gmail Compose</span>
              </div>
              <p className="text-[8px] font-bold text-zinc-700 leading-tight italic border-l-2 border-blue-400 pl-1.5">
                "Hi recruiter, I noticed your post for Frontend Engineer..."
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card 6: Bulk AI Fill */}
        <motion.div
          variants={cardVariants}
          className="flex w-full"
        >
          <div className="bg-white border-2 border-black rounded-none p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-[transform,box-shadow] duration-200 ease-out flex flex-col justify-between min-h-[310px] w-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block border border-purple-200 bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-none">
                  Pro Feature
                </span>
                <Layers size={18} className="text-purple-500" />
              </div>
              <h4 className="text-lg sm:text-xl font-heading font-black text-black uppercase leading-tight">
                Autofill entire forms with Bulk AI Fill.
              </h4>
              <p className="text-xs font-bold text-zinc-500 mt-2 leading-relaxed">
                Review all open-ended questions detected on a career page and generate high-quality AI responses for all of them simultaneously.
              </p>
            </div>

            <div className="mt-6 bg-zinc-50 border-2 border-black rounded-none p-3 flex flex-col gap-1 relative overflow-hidden">
              <div className="flex items-center gap-1.5">
                <input type="checkbox" checked readOnly className="accent-purple-600 size-2.5 border border-black cursor-default" />
                <span className="text-[8px] font-black text-zinc-700 truncate">Why do you want to join?</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input type="checkbox" checked readOnly className="accent-purple-600 size-2.5 border border-black cursor-default" />
                <span className="text-[8px] font-black text-zinc-700 truncate">Describe a challenging project...</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
