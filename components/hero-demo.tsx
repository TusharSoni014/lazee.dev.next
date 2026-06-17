"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Check, CheckCircle2 } from "lucide-react";

export function HeroDemo() {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState("");
  const fullText = "I am excited about this opportunity because it aligns perfectly with my passion for building scalable web applications and solving real-world problems...";

  useEffect(() => {
    let active = true;
    const runAnimation = async () => {
      while (active) {
        // Step 0: Idle/Empty
        setStep(0);
        setTypedText("");
        await new Promise((r) => setTimeout(r, 1000));
        if (!active) break;

        // Step 1: Mouse cursor moves in and hovers/clicks "Fill with AI"
        setStep(1);
        await new Promise((r) => setTimeout(r, 1200));
        if (!active) break;

        // Step 2: Generating AI response (Typewriter effect)
        setStep(2);
        let currentText = "";
        for (let i = 0; i < fullText.length; i += 2) {
          if (!active) break;
          currentText += fullText.slice(i, i + 2);
          setTypedText(currentText);
          await new Promise((r) => setTimeout(r, 15));
        }
        await new Promise((r) => setTimeout(r, 500));
        if (!active) break;

        // Step 3: Stagger filling the left-side fields
        setStep(3);
        await new Promise((r) => setTimeout(r, 2000));
        if (!active) break;

        // Step 4: Done state (Hold)
        setStep(4);
        await new Promise((r) => setTimeout(r, 3500));
      }
    };
    runAnimation();
    return () => {
      active = false;
    };
  }, []);

  const formFields = [
    { label: "Personal Information", value: "Tushar Soni" },
    { label: "Email", value: "tushar@lazee.dev" },
    { label: "Phone", value: "+1 (555) 019-2834" },
    { label: "LinkedIn", value: "linkedin.com/in/tushar" },
    { label: "Resume", value: "Resume_Tushar_Soni.pdf" },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-[1.15] bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl overflow-hidden flex flex-col z-10">
      {/* Browser Bar */}
      <div className="h-10 border-b-[3px] border-black bg-zinc-100 flex items-center px-4 gap-2 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 bg-red-400 rounded-full border border-red-500" />
          <div className="w-3 h-3 bg-yellow-400 rounded-full border border-yellow-500" />
          <div className="w-3 h-3 bg-green-400 rounded-full border border-green-500" />
        </div>
        <div className="ml-4 bg-white border-[2px] border-black rounded-md h-6 flex-1 px-3 flex items-center">
          <span className="text-[10px] font-black text-zinc-500">
            workday.com/careers/apply
          </span>
        </div>
      </div>

      {/* Browser Content Area */}
      <div className="flex-1 flex flex-row overflow-hidden relative bg-[#fafafa]">
        {/* Left Side: Job Form */}
        <div className="w-[52%] border-r-[3px] border-black p-4 flex flex-col gap-3 overflow-hidden bg-white">
          {/* Form Header */}
          <div className="flex flex-col gap-1 border-b border-zinc-100 pb-2">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider leading-none">Job Application</span>
            <h4 className="text-xs font-black text-black leading-tight">Senior Frontend Developer</h4>
            {/* Mock Step Indicators */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-zinc-100 border border-black/10 rounded-full overflow-hidden">
                <motion.div 
                  animate={step >= 3 ? { width: "100%" } : { width: "40%" }}
                  className="h-full bg-purple-600" 
                />
              </div>
              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest shrink-0 leading-none">Step 2 of 6</span>
            </div>
          </div>

          {/* Form Fields Stack */}
          <div className="flex flex-col gap-2">
            {formFields.map((field, idx) => {
              const isFilled = step >= 3;
              return (
                <div key={idx} className="flex flex-col gap-1 relative">
                  <span className="text-[8px] font-black uppercase text-zinc-500 leading-none">
                    {field.label}
                  </span>
                  <div className="h-7 border-2 border-black rounded-lg bg-zinc-50 flex items-center justify-between px-2.5 relative overflow-hidden">
                    <AnimatePresence>
                      {isFilled && (
                        <motion.span
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.15, duration: 0.2 }}
                          className="font-bold text-[9px] text-zinc-950 truncate max-w-[85%]"
                        >
                          {field.value}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Staggered green tick marks */}
                    <AnimatePresence>
                      {isFilled && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.15 + 0.1, type: "spring", stiffness: 300 }}
                          className="w-3.5 h-3.5 bg-green-500 rounded-full border border-black flex items-center justify-center shrink-0"
                        >
                          <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Filling flash effect */}
                    <AnimatePresence>
                      {step === 3 && (
                        <motion.div
                          initial={{ x: "-100%", opacity: 0.4 }}
                          animate={{ x: "100%", opacity: 0 }}
                          transition={{
                            delay: idx * 0.15,
                            duration: 0.4,
                            ease: "easeOut",
                          }}
                          className="absolute inset-0 bg-yellow-300 pointer-events-none"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: AI Assistant Side Panel */}
        <div className="flex-1 p-3.5 bg-purple-50/50 flex flex-col justify-between overflow-hidden relative">
          {/* AI Panel Header */}
          <div className="bg-white border-2 border-black rounded-xl p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 shrink-0">
            <div className="size-6 bg-purple-600 border border-black flex items-center justify-center text-white rounded-lg">
              <Sparkles size={12} className="fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-black leading-none">AI Assistant</span>
              <span className="text-[8px] font-bold text-purple-600 mt-0.5 leading-none">Writing answer...</span>
            </div>
          </div>

          {/* AI Answer Editor Card */}
          <div className="flex-1 my-3 bg-white border-2 border-black rounded-xl p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-1.5 overflow-hidden">
            <span className="text-[8px] font-black uppercase text-zinc-400 leading-none">Why do you want this role?</span>
            <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded p-2 text-[8px] font-bold text-zinc-600 leading-relaxed overflow-y-auto font-sans relative">
              {typedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="inline-block w-1 h-3 bg-purple-600 ml-0.5"
              />
            </div>

            {/* Live Progress loading bar */}
            <div className="shrink-0 flex items-center justify-between text-[8px] font-bold text-zinc-400 mt-1">
              <span>{step === 2 ? "Generating suggestion..." : step > 2 ? "Generated!" : "Ready"}</span>
              {step === 2 && (
                <div className="w-16 h-1 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
                  <motion.div
                    animate={{ width: ["0%", "100%"] }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="h-full bg-purple-600"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Fill with AI Button */}
          <div className="shrink-0 w-full">
            <button
              className={`w-full py-2.5 border-2 border-black text-white text-[10px] font-black uppercase tracking-wider shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                step >= 2
                  ? "bg-purple-700 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] translate-x-[1.5px] translate-y-[1.5px]"
                  : "bg-purple-600 hover:bg-purple-700 hover:-translate-y-0.5 hover:shadow-[3.5px_3.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none"
              }`}
            >
              <Sparkles size={11} className="fill-white" />
              <span>Fill with AI</span>
            </button>
          </div>
        </div>

        {/* Animated Hand Cursor */}
        <motion.div
          animate={
            step === 0
              ? { x: 230, y: 220, opacity: 0, scale: 0.9 }
              : step === 1
                ? { x: 175, y: 195, opacity: 1, scale: 1 } // Moving over "Fill with AI"
                : step === 2
                  ? { x: 175, y: 198, opacity: 1, scale: 0.92 } // Click press down
                  : { x: 230, y: 220, opacity: 0, scale: 0.9 } // Return home offscreen
          }
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            mass: 0.5,
          }}
          className="absolute z-50 pointer-events-none"
          style={{ left: 0, top: 0 }}
        >
          <svg
            className="w-6 h-6 text-black fill-white drop-shadow-md"
            viewBox="0 0 24 24"
          >
            <path
              d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.42c.45 0 .67-.54.35-.85L6.35 3.32a.5.5 0 00-.85.35z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </motion.div>
      </div>

      {/* Decorative arrow helper below the mock browser */}
      <div className="absolute -bottom-8 right-12 text-zinc-500 font-heading text-xs font-black italic transform rotate-6 select-none flex items-center gap-1.5 hidden md:flex pointer-events-none">
        <svg
          className="w-8 h-8 text-zinc-400 rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h10a4 4 0 014 4v1m0 0l-3-3m3 3l3-3"
          />
        </svg>
        <span>AI fills everything for you ✨</span>
      </div>
    </div>
  );
}
