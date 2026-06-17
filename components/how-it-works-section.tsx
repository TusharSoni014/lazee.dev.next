"use client";

import { motion } from "motion/react";
import { Sparkles, User, ShieldAlert } from "lucide-react";
import { useBrowser } from "@/hooks/use-browser";

export function HowItWorksSection() {
  const browser = useBrowser();
  const isFirefox = browser === "firefox";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full mb-24 flex flex-col items-center"
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black uppercase tracking-tight text-black">
          How Lazee works
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full relative">
        {/* Dash connectors for desktop */}
        <div className="hidden lg:block absolute top-1/3 left-[28%] w-[12%] h-0.5 border-t-[3px] border-dashed border-orange-300 pointer-events-none" />
        <div className="hidden lg:block absolute top-1/3 left-[62%] w-[12%] h-0.5 border-t-[3px] border-dashed border-orange-300 pointer-events-none" />
 
        {/* Step 1 */}
        <div className="flex flex-col bg-white border-[3px] border-black rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative group hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 border-2 border-black text-white font-black text-sm">
              1
            </span>
            <h3 className="font-heading font-black text-lg sm:text-xl uppercase tracking-tight text-black">
              Create your profile
            </h3>
          </div>
          <p className="text-sm font-bold text-zinc-600 mb-6 leading-relaxed">
            Add your details, experience, skills and upload resumes once. We'll remember it.
          </p>
          
          {/* Step 1 Graphic */}
          <div className="mt-auto bg-[#fafafa] border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] flex flex-col gap-2 relative overflow-hidden h-36">
            <div className="flex items-center gap-3 border-b-2 border-zinc-100 pb-2 mb-1">
              <div className="w-8 h-8 bg-orange-50 border-2 border-black flex items-center justify-center text-orange-500">
                <User size={16} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-black leading-none">Developer Profile</span>
                <span className="text-[8px] font-bold text-zinc-400">lazee.dev/username</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border border-black bg-green-400 rounded-sm flex items-center justify-center text-[8px] font-bold text-black">✓</div>
                <div className="h-2 w-20 bg-zinc-200 rounded-sm" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border border-black bg-green-400 rounded-sm flex items-center justify-center text-[8px] font-bold text-black">✓</div>
                <div className="h-2 w-24 bg-zinc-200 rounded-sm" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border border-black bg-green-400 rounded-sm flex items-center justify-center text-[8px] font-bold text-black">✓</div>
                <div className="h-2 w-16 bg-zinc-200 rounded-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col bg-white border-[3px] border-black rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative group hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 border-2 border-black text-white font-black text-sm">
              2
            </span>
            <h3 className="font-heading font-black text-lg sm:text-xl uppercase tracking-tight text-black">
              Install the extension
            </h3>
          </div>
          <p className="text-sm font-bold text-zinc-600 mb-6 leading-relaxed">
            Add Lazee to {isFirefox ? "Firefox" : "Chrome"} with one click. Takes less than 30 seconds.
          </p>

          {/* Step 2 Graphic */}
          <div className="mt-auto bg-[#fafafa] border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center gap-2 relative overflow-hidden h-36">
            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 max-w-[200px]">
              <div className="w-8 h-8 bg-orange-500 border-2 border-black flex items-center justify-center text-white shrink-0 font-bold text-base italic uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                L
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] font-black uppercase text-black leading-none truncate">Lazee.dev</span>
                <span className="text-[8px] font-bold text-green-500 mt-0.5 flex items-center gap-0.5">Active ✨</span>
              </div>
            </div>
            <div className="h-2 w-28 bg-zinc-200 rounded-sm mt-1" />
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col bg-white border-[3px] border-black rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative group hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 border-2 border-black text-white font-black text-sm">
              3
            </span>
            <h3 className="font-heading font-black text-lg sm:text-xl uppercase tracking-tight text-black">
              Apply anywhere
            </h3>
          </div>
          <p className="text-sm font-bold text-zinc-600 mb-6 leading-relaxed">
            Click apply on any job. Lazee autofills everything and AI answers for you.
          </p>

          {/* Step 3 Graphic */}
          <div className="mt-auto bg-[#fafafa] border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] flex flex-col justify-between relative overflow-hidden h-36">
            <div className="flex justify-between items-center opacity-40">
              <div className="flex flex-col gap-1">
                <div className="h-1.5 w-12 bg-zinc-300 rounded" />
                <div className="h-3 w-24 bg-zinc-300 rounded border border-zinc-300" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="h-1.5 w-12 bg-zinc-300 rounded" />
                <div className="h-3 w-20 bg-zinc-300 rounded border border-zinc-300" />
              </div>
            </div>
            
            <div className="bg-orange-500 border-2 border-black p-2 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5 cursor-pointer max-w-[170px] mx-auto transform -rotate-1 relative z-10">
              <Sparkles size={12} className="fill-white" />
              <span className="text-[10px] font-black uppercase tracking-wider">Auto Fill with Lazee</span>
            </div>

            {/* Mock cursor clicking */}
            <div className="absolute right-8 bottom-3 z-20 pointer-events-none">
              <svg className="w-5 h-5 text-black fill-white drop-shadow" viewBox="0 0 24 24">
                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.42c.45 0 .67-.54.35-.85L6.35 3.32a.5.5 0 00-.85.35z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
