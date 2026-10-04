"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ShieldCheck, Cpu, Terminal } from "lucide-react";

export function HeroDemo() {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState("");
  const fullText =
    "Architected high-throughput ingestion pipeline handling 140k req/sec with P99 < 14ms across multi-region Kubernetes clusters...";

  useEffect(() => {
    let active = true;
    const runAnimation = async () => {
      while (active) {
        // Step 0: Initial ATS page detected
        setStep(0);
        setTypedText("");
        await new Promise((r) => setTimeout(r, 1200));
        if (!active) break;

        // Step 1: Mapping schema fields
        setStep(1);
        await new Promise((r) => setTimeout(r, 1000));
        if (!active) break;

        // Step 2: Auto-filling core identity & resume
        setStep(2);
        await new Promise((r) => setTimeout(r, 1400));
        if (!active) break;

        // Step 3: Context-aware AI synthesis (Typewriter)
        setStep(3);
        let currentText = "";
        for (let i = 0; i < fullText.length; i += 2) {
          if (!active) break;
          currentText += fullText.slice(i, i + 2);
          setTypedText(currentText);
          await new Promise((r) => setTimeout(r, 18));
        }
        await new Promise((r) => setTimeout(r, 800));
        if (!active) break;

        // Step 4: Verification complete
        setStep(4);
        await new Promise((r) => setTimeout(r, 3800));
      }
    };
    runAnimation();
    return () => {
      active = false;
    };
  }, []);

  const formFields = [
    { label: "Full Name", value: "Devin Zhao", tag: "Profile Record" },
    { label: "Email Address", value: "devin@alumni.cmu.edu", tag: "Verified" },
    {
      label: "Primary Repository",
      value: "github.com/devinzhao",
      tag: "Source",
    },
    {
      label: "Active Resume File",
      value: "Resume_Staff_Platform_2026.pdf",
      tag: "Matched",
    },
  ];

  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.14)] dark:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] ring-1 ring-zinc-900/5 dark:ring-white/5 overflow-hidden flex flex-col font-sans select-none">
      {/* Top Browser Bar (Mac Window Style) */}
      <div className="h-10 border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 px-3.5 sm:px-4 flex items-center justify-between shrink-0 backdrop-blur-sm">
        {/* Mac Traffic Light Dots */}
        <div className="flex items-center gap-1.5 sm:gap-2 w-12 sm:w-14 shrink-0">
          <div className="size-2.5 sm:size-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50 shadow-2xs" />
          <div className="size-2.5 sm:size-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50 shadow-2xs" />
          <div className="size-2.5 sm:size-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50 shadow-2xs" />
        </div>

        {/* Centered URL Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-md px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] text-zinc-600 dark:text-zinc-400 font-mono tracking-tight shadow-2xs max-w-[280px] sm:max-w-[320px] w-full mx-2 justify-center min-w-0">
          <ShieldCheck className="size-3 sm:size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="truncate">
            boards.greenhouse.io/stripe/jobs/platform-lead
          </span>
        </div>

        {/* Right Balance Spacer */}
        <div className="w-12 sm:w-14 shrink-0 flex items-center justify-end">
          <span className="text-[9px] sm:text-[10px] font-mono font-medium text-zinc-400 dark:text-zinc-500 tracking-wider">
            SSL
          </span>
        </div>
      </div>

      {/* Main App Body */}
      <div className="flex flex-col sm:flex-row sm:h-[400px] bg-zinc-50/40 dark:bg-zinc-900/30">
        {/* Left Sub-Panel: ATS Application Form */}
        <div className="sm:w-[57%] shrink-0 min-w-0 p-4 sm:p-5 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold">
                Application Schema
              </span>
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-medium">
                {step >= 2
                  ? "4 of 4 mapped"
                  : step === 1
                    ? "Mapping fields..."
                    : "Detected"}
              </span>
            </div>

            <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800/80 mb-3">
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Staff Platform Engineer
              </h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Core Systems • San Francisco, CA (Hybrid)
              </p>
            </div>

            {/* Field Matrix */}
            <div className="space-y-2">
              {formFields.map((field, idx) => {
                const isFilled = step >= 2;
                return (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between h-3.5">
                      <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                        {field.label}
                      </span>
                      <span
                        className={`text-[9px] font-mono transition-opacity duration-200 ${
                          isFilled
                            ? "text-zinc-400 dark:text-zinc-500 opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        {field.tag}
                      </span>
                    </div>
                    <div className="h-7.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 px-2.5 flex items-center justify-between text-xs relative overflow-hidden min-w-0">
                      <div className="flex-1 min-w-0 pr-2">
                        <AnimatePresence mode="wait">
                          {isFilled && (
                            <motion.span
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ delay: idx * 0.06, duration: 0.18 }}
                              className="text-[11px] font-medium text-zinc-800 dark:text-zinc-200 block truncate"
                            >
                              {field.value}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      <AnimatePresence>
                        {isFilled && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{
                              delay: idx * 0.06 + 0.04,
                              type: "spring",
                              stiffness: 400,
                              damping: 20,
                            }}
                            className="size-3.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30"
                          >
                            <Check className="size-2.5" strokeWidth={2.5} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500 mt-3 sm:mt-0">
            <span className="font-mono">ATS: Greenhouse API</span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Verified Match</span>
            </span>
          </div>
        </div>

        {/* Right Sub-Panel: Lazee Autopilot Engine */}
        <div className="sm:w-[43%] shrink-0 min-w-0 p-4 sm:p-5 flex flex-col justify-between bg-zinc-50/70 dark:bg-zinc-900/50">
          <div>
            {/* Header pill */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800 mb-3">
              <div className="flex items-center gap-1.5">
                <div className="size-5 rounded-md bg-orange-600/10 border border-orange-500/30 flex items-center justify-center text-orange-600">
                  <Cpu className="size-3" />
                </div>
                <span className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100">
                  Lazee Engine
                </span>
              </div>
              <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                v2.2.2
              </span>
            </div>

            {/* AI Synthesizer View */}
            <div className="rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 shadow-2xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 truncate">
                  Role Question Synthesis
                </span>
                <span className="text-[9px] font-mono text-orange-600 dark:text-orange-400 font-medium flex items-center gap-1">
                  {step >= 3 && (
                    <span className="size-1.5 rounded-full bg-orange-500 animate-pulse" />
                  )}
                  {step >= 3 ? "Generating" : "Waiting"}
                </span>
              </div>

              {/* Locked height text box - zero shifting */}
              <div className="p-2.5 rounded-md bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200/60 dark:border-zinc-800/80 text-[10px] text-zinc-700 dark:text-zinc-300 font-mono leading-[16px] h-24 overflow-hidden">
                {step >= 3 ? (
                  <>
                    <span>{typedText}</span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      className="inline-block w-1 h-2.5 bg-orange-600 ml-0.5 align-middle"
                    />
                  </>
                ) : (
                  <span className="text-zinc-400 dark:text-zinc-500 italic block">
                    Awaiting form trigger...
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[9px] text-zinc-400 dark:text-zinc-500 font-mono pt-0.5">
                <span>Context: 99.4%</span>
                <span>Latency: 1.2s</span>
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="mt-3">
            <button
              type="button"
              className={`w-full h-9 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs overflow-hidden ${
                step >= 3
                  ? "bg-emerald-600 text-white shadow-emerald-500/20"
                  : "bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950"
              }`}
            >
              {step >= 4 ? (
                <>
                  <Check className="size-3.5 shrink-0" strokeWidth={2.5} />
                  <span className="truncate">Application Ready</span>
                </>
              ) : step >= 3 ? (
                <>
                  <Cpu className="size-3.5 shrink-0 text-orange-400 animate-pulse" />
                  <span className="truncate">Synthesizing Profile</span>
                </>
              ) : (
                <>
                  <Terminal className="size-3.5 shrink-0 text-zinc-400" />
                  <span className="truncate">Autofill Application</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
