"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, CheckCircle2 } from "lucide-react";

export function HeroDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const cycle = async () => {
      while (true) {
        setStep(0); // Initial
        await new Promise((r) => setTimeout(r, 500));
        setStep(1); // Mouse moving in
        await new Promise((r) => setTimeout(r, 800));
        setStep(2); // AI analyzing (button clicked)
        await new Promise((r) => setTimeout(r, 1200));
        setStep(3); // Filling fields
        await new Promise((r) => setTimeout(r, 2000));
        setStep(4); // Done
        await new Promise((r) => setTimeout(r, 3000));
      }
    };
    cycle();
  }, []);

  const formFields = [
    { label: "First Name", id: "fname", value: "Tushar" },
    { label: "Last Name", id: "lname", value: "Soni" },
    { label: "Email", id: "email", value: "tushar@lazee.dev" },
    { label: "LinkedIn", id: "linkedin", value: "linkedin.com/in/tusharsoni" },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col z-10">
      {/* Browser Bar */}
      <div className="h-10 border-b-[3px] border-black bg-zinc-100 flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 bg-red-400 rounded-full" />
          <div className="w-3 h-3 bg-yellow-400 rounded-full" />
          <div className="w-3 h-3 bg-green-400 rounded-full" />
        </div>
        <div className="ml-4 bg-white border-2 border-black h-6 flex-1 px-3 flex items-center">
          <span className="text-[10px] font-bold text-zinc-500">
            workday.com/jobs/apply
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6 flex-1 flex flex-col gap-4 relative">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-heading font-black text-xl uppercase tracking-tight">
            Apply Now
          </h3>
          <AnimatePresence mode="wait">
            {step <= 1 && (
              <motion.div
                key="autofill"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-orange-500 border-2 border-black p-1.5 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 cursor-pointer"
              >
                <Sparkles size={16} />
                <span className="text-xs font-bold uppercase">Auto-fill</span>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-blue-500 border-2 border-black p-1.5 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Sparkles size={16} />
                </motion.div>
                <span className="text-xs font-bold uppercase">
                  Analyzing...
                </span>
              </motion.div>
            )}
            {step >= 3 && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-green-500 border-2 border-black p-1.5 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1"
              >
                <CheckCircle2 size={16} />
                <span className="text-xs font-bold uppercase">Done</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[formFields[0], formFields[1]].map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-1 z-10 w-full relative"
            >
              <label className="text-xs font-bold uppercase text-zinc-600">
                {field.label}
              </label>
              <div className="h-10 border-2 border-black bg-zinc-50 flex items-center px-3 relative overflow-hidden w-full">
                <AnimatePresence>
                  {step >= 3 && (
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.1 } }}
                      transition={{
                        delay: index * 0.1, // Stagger effect
                        duration: 0.3,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="font-bold text-sm tracking-tight pt-1 w-full truncate"
                    >
                      {field.value}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Highlight flash animation */}
                <AnimatePresence>
                  {step === 3 && (
                    <motion.div
                      initial={{ x: "-100%", opacity: 0.5 }}
                      animate={{ x: "100%", opacity: 0 }}
                      transition={{
                        delay: index * 0.1 + 0.1,
                        duration: 0.6,
                        ease: "easeOut",
                      }}
                      className="absolute inset-0 bg-yellow-300 pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>

        {[formFields[2], formFields[3]].map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col gap-1 z-10 w-full relative"
          >
            <label className="text-xs font-bold uppercase text-zinc-600">
              {field.label}
            </label>
            <div className="h-10 border-2 border-black bg-zinc-50 flex items-center px-3 relative overflow-hidden w-full">
              <AnimatePresence>
                {step >= 3 && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    transition={{
                      delay: (index + 2) * 0.1, // Stagger effect after first row
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="font-bold text-sm tracking-tight pt-1 w-full truncate"
                  >
                    {field.value}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Highlight flash animation */}
              <AnimatePresence>
                {step === 3 && (
                  <motion.div
                    initial={{ x: "-100%", opacity: 0.5 }}
                    animate={{ x: "100%", opacity: 0 }}
                    transition={{
                      delay: (index + 2) * 0.1 + 0.1,
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                    className="absolute inset-0 bg-yellow-300 pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}

        <div className="mt-auto z-10 w-full">
          <button className="w-full bg-black text-white font-black uppercase py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(249,115,22,1)] transition-all">
            Submit Application
          </button>
        </div>

        {/* AI Magic Overlay effect */}
        <AnimatePresence>
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
            >
              <div className="absolute inset-0 bg-orange-100/30 backdrop-blur-[1px]" />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className="w-32 h-32 bg-orange-400/20 rounded-full blur-2xl"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating cursor */}
        <motion.div
          animate={
            step === 0
              ? { x: 150, y: 250, opacity: 0, scale: 0.8 }
              : step === 1
                ? { x: -55, y: 30, opacity: 1, scale: 1 } // Moved exact to over the center of the Action button
                : step === 2
                  ? { x: -55, y: 35, opacity: 1, scale: 0.9 } // Press down
                  : { x: 150, y: 250, opacity: 0, scale: 0.8 }
          }
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 20,
            mass: 0.5,
          }}
          className="absolute right-0 top-0 z-50 pointer-events-none"
        >
          <svg
            className="w-8 h-8 text-black fill-white drop-shadow-md"
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
    </div>
  );
}
