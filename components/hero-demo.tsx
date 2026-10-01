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
    { label: "Primary Repository", value: "github.com/devinzhao", tag: "Source" },
    { label: "Active Resume File", value: "Resume_Staff_Platform_2026.pdf", tag: "Matched" },
  ];

  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col font-sans transition-all">
      {/* Top Browser Bar */}
      <div className="h-11 border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 px-4 flex items-center justify-between shrink-0 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800/80 rounded-md px-3 py-1 text-[11px] text-zinc-600 dark:text-zinc-400 font-mono tracking-tight shadow-2xs max-w-[280px] w-full mx-2 justify-center">
          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
          <span className="truncate">boards.greenhouse.io/stripe/jobs/platform-lead</span>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 px-2 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>ATS Active</span>
        </div>
      </div>

      {/* Main Terminal / App Body */}
      <div className="flex flex-col sm:flex-row min-h-[380px] sm:h-[420px] bg-zinc-50/40 dark:bg-zinc-900/30">
        {/* Left Sub-Panel: ATS Application Form */}
        <div className="sm:w-[56%] p-4 sm:p-5 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-semibold">
                Application Schema
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                {step >= 2 ? "4 of 4 mapped" : step === 1 ? "Mapping fields..." : "Detected"}
              </span>
            </div>

            <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800/80 mb-3">
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Staff Platform Engineer
              </h4>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                Core Systems • San Francisco, CA (Hybrid)
              </p>
            </div>

            {/* Field Matrix */}
            <div className="space-y-2">
              {formFields.map((field, idx) => {
                const isFilled = step >= 2;
                return (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                        {field.label}
                      </span>
                      {isFilled && (
                        <span className="text-[9px] font-mono text-zinc-400">
                          {field.tag}
                        </span>
                      )}
                    </div>
                    <div className="h-7 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 px-2.5 flex items-center justify-between text-xs relative overflow-hidden">
                      <AnimatePresence>
                        {isFilled && (
                          <motion.span
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.08, duration: 0.2 }}
                            className="text-[11px] font-medium text-zinc-800 dark:text-zinc-200 truncate pr-2"
                          >
                            {field.value}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {isFilled && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: idx * 0.08 + 0.05,
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

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
            <span className="font-mono">ATS: Greenhouse API</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-500" /> Verified Match
            </span>
          </div>
        </div>

        {/* Right Sub-Panel: Lazee Autopilot Engine */}
        <div className="sm:w-[44%] p-4 sm:p-5 flex flex-col justify-between bg-zinc-50/80 dark:bg-zinc-900/60">
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
                v2.4
              </span>
            </div>

            {/* AI Synthesizer View */}
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-zinc-500 truncate">
                  Role Question Synthesis
                </span>
                <span className="text-[9px] font-mono text-orange-600 dark:text-orange-400 font-medium">
                  {step >= 3 ? "Generating" : "Waiting"}
                </span>
              </div>

              <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-700 dark:text-zinc-300 font-mono leading-relaxed min-h-[92px]">
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
                  <span className="text-zinc-400 italic">
                    Awaiting form trigger...
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[9px] text-zinc-400 font-mono pt-1">
                <span>Context Match: 99.4%</span>
                <span>Latency: 1.2s</span>
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="mt-3">
            <button
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                step >= 3
                  ? "bg-emerald-600 text-white shadow-emerald-500/20"
                  : "bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950"
              }`}
            >
              {step >= 4 ? (
                <>
                  <Check className="size-3.5" />
                  <span>Fields Dispatched</span>
                </>
              ) : step >= 3 ? (
                <>
                  <Cpu className="size-3.5 text-orange-500 animate-pulse" />
                  <span>Synthesizing Tailored Profile</span>
                </>
              ) : (
                <>
                  <Terminal className="size-3.5 text-zinc-400" />
                  <span>1-Click Autofill</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="h-7 border-t border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          <span>Ambient DOM Listener Active</span>
        </span>
        <span className="text-zinc-400">Zero data retention</span>
      </div>
    </div>
  );
}
