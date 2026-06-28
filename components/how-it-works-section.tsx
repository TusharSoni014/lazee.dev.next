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
        <div className="flex flex-col bg-white border-[3px] border-black rounded-none p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative group hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-none bg-orange-500 border-2 border-black text-white font-black text-sm">
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
          <div className="mt-auto bg-[#fafafa] border-2 border-black rounded-none p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] flex flex-col gap-2 relative overflow-hidden h-36">
            <div className="flex items-center gap-3 border-b-2 border-zinc-100 pb-2 mb-1">
              <div className="w-8 h-8 bg-orange-50 border-2 border-black flex items-center justify-center text-orange-500 rounded-none">
                <User size={16} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-black leading-none">Developer Profile</span>
                <span className="text-[8px] font-bold text-zinc-400">lazee.dev/username</span>
              </div>
            </div>
            <div className="space-y-1.5">
              {[20, 24, 16].map((width, index) => (
                <div key={index} className="flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, index * 0.15 + 0.1, index * 0.15 + 0.22, 0.8, 0.9, 1]
                    }}
                    className="w-3.5 h-3.5 border border-black bg-green-400 rounded-none flex items-center justify-center text-[8px] font-bold text-black shrink-0"
                  >
                    ✓
                  </motion.div>
                  <motion.div
                    animate={{ scaleX: [0, 0, 1, 1, 0, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, index * 0.15 + 0.1, index * 0.15 + 0.22, 0.8, 0.9, 1]
                    }}
                    className="h-2 bg-zinc-200 rounded-none"
                    style={{
                      width: width === 20 ? "80px" : width === 24 ? "96px" : "64px",
                      originX: 0,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col bg-white border-[3px] border-black rounded-none p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative group hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-none bg-orange-500 border-2 border-black text-white font-black text-sm">
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
          <div className="mt-auto bg-[#fafafa] border-2 border-black rounded-none p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center gap-2 relative overflow-hidden h-36">
            <motion.div
              animate={{
                scale: [0, 1, 1, 0],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "loop",
                times: [0, 0.15, 0.85, 1],
                ease: "easeInOut",
              }}
              className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 max-w-[200px] rounded-none"
            >
              <div className="w-8 h-8 bg-orange-500 border-2 border-black flex items-center justify-center text-white shrink-0 font-bold text-base italic uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] rounded-none">
                L
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] font-black uppercase text-black leading-none truncate">Lazee.dev</span>
                <span className="text-[8px] font-bold text-green-500 mt-0.5 flex items-center gap-0.5">Active ✨</span>
              </div>
            </motion.div>
            <div className="h-2 w-28 bg-zinc-200 rounded-none mt-1" />
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col bg-white border-[3px] border-black rounded-none p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative group hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-none bg-orange-500 border-2 border-black text-white font-black text-sm">
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
          <div className="mt-auto bg-[#fafafa] border-2 border-black rounded-none p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] flex flex-col justify-between relative overflow-hidden h-36">
            <motion.div
              animate={{
                opacity: [0.4, 0.4, 1, 1, 0.4, 0.4],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                times: [0, 0.52, 0.58, 0.85, 0.9, 1],
                ease: "easeInOut",
              }}
              className="flex justify-between items-center w-full"
            >
              <div className="flex flex-col gap-1 flex-1 max-w-[46%]">
                <div className="h-1.5 w-12 bg-zinc-300 rounded-none" />
                <motion.div
                  animate={{
                    backgroundColor: ["#f4f4f5", "#f4f4f5", "#fff7ed", "#fff7ed", "#f4f4f5", "#f4f4f5"],
                    borderColor: ["#e4e4e7", "#e4e4e7", "#fdba74", "#fdba74", "#e4e4e7", "#e4e4e7"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    times: [0, 0.52, 0.56, 0.85, 0.9, 1],
                    ease: "easeInOut",
                  }}
                  className="h-3 w-full bg-zinc-100 rounded-none border border-zinc-200 relative overflow-hidden"
                >
                  <motion.div
                    animate={{
                      width: ["0%", "0%", "80%", "80%", "0%", "0%"]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      times: [0, 0.52, 0.58, 0.85, 0.9, 1],
                      ease: "easeInOut",
                    }}
                    className="h-full bg-orange-500"
                  />
                </motion.div>
              </div>
              <div className="flex flex-col gap-1 flex-1 max-w-[46%]">
                <div className="h-1.5 w-12 bg-zinc-300 rounded-none" />
                <motion.div
                  animate={{
                    backgroundColor: ["#f4f4f5", "#f4f4f5", "#fff7ed", "#fff7ed", "#f4f4f5", "#f4f4f5"],
                    borderColor: ["#e4e4e7", "#e4e4e7", "#fdba74", "#fdba74", "#e4e4e7", "#e4e4e7"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    times: [0, 0.56, 0.6, 0.85, 0.9, 1],
                    ease: "easeInOut",
                  }}
                  className="h-3 w-full bg-zinc-100 rounded-none border border-zinc-200 relative overflow-hidden"
                >
                  <motion.div
                    animate={{
                      width: ["0%", "0%", "70%", "70%", "0%", "0%"]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      times: [0, 0.56, 0.62, 0.85, 0.9, 1],
                      ease: "easeInOut",
                    }}
                    className="h-full bg-orange-500"
                  />
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              animate={{
                scale: [1, 1, 0.95, 1, 1],
                y: [0, 0, 2, 0, 0],
                boxShadow: [
                  "2px 2px 0px 0px rgba(0,0,0,1)",
                  "2px 2px 0px 0px rgba(0,0,0,1)",
                  "0px 0px 0px 0px rgba(0,0,0,1)",
                  "2px 2px 0px 0px rgba(0,0,0,1)",
                  "2px 2px 0px 0px rgba(0,0,0,1)",
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                times: [0, 0.45, 0.5, 0.55, 1],
                ease: "easeInOut",
              }}
              className="bg-orange-500 border-2 border-black p-2 text-white flex items-center justify-center gap-1.5 cursor-pointer max-w-[170px] mx-auto transform -rotate-1 relative z-10 rounded-none"
            >
              <Sparkles size={12} className="fill-white" />
              <span className="text-[10px] font-black uppercase tracking-wider">Auto Fill with Lazee</span>
            </motion.div>

            {/* Mock cursor clicking */}
            <motion.div
              animate={{
                left: ["80%", "50%", "50%", "80%"],
                top: ["85%", "65%", "65%", "85%"],
                scale: [1, 1, 0.8, 1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                times: [0, 0.45, 0.55, 0.65, 1],
                ease: "easeInOut",
              }}
              className="absolute z-20 pointer-events-none -ml-2 -mt-1"
            >
              <svg className="w-5 h-5 text-black fill-white drop-shadow" viewBox="0 0 24 24">
                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.42c.45 0 .67-.54.35-.85L6.35 3.32a.5.5 0 00-.85.35z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
