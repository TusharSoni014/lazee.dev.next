"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Brain, FileText, Mail, Layers, Check } from "lucide-react";

function TypewriterSynthesizer() {
  const fullText =
    "Led migration of central data pipeline to distributed Apache Kafka architecture, reducing event ingestion latency by 42% while scaling throughput to 180k msgs/sec...";
  const [text, setText] = useState("");

  useEffect(() => {
    let active = true;
    const run = async () => {
      while (active) {
        setText("");
        await new Promise((r) => setTimeout(r, 1200));
        if (!active) break;

        for (let i = 0; i <= fullText.length; i += 2) {
          if (!active) break;
          setText(fullText.substring(0, i));
          await new Promise((r) => setTimeout(r, 22));
        }
        await new Promise((r) => setTimeout(r, 4500));
      }
    };
    run();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="relative font-mono text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed min-h-[96px] sm:min-h-[58px]">
      {/* Invisible ghost sizer reserving exact full text height across all screen widths */}
      <div
        className="invisible select-none pointer-events-none"
        aria-hidden="true"
      >
        <span>{fullText}</span>
        <span className="inline-block w-1 h-3 ml-0.5 align-middle" />
      </div>

      {/* Streaming typewriter text positioned over the pre-sized container */}
      <div className="absolute inset-0">
        <span>{text}</span>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
          className="inline-block w-1 h-3 bg-orange-600 ml-0.5 align-middle"
        />
      </div>
    </div>
  );
}

function ResumeSwitcher() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const resumes = [
    {
      title: "Resume_Staff_Platform.pdf",
      meta: "Go • K8s • Distributed Systems",
      badge: "Systems",
      size: "142 KB",
    },
    {
      title: "Resume_Fullstack_Lead.pdf",
      meta: "React • Next.js • Architecture",
      badge: "Fullstack",
      size: "128 KB",
    },
    {
      title: "Resume_Founding_Eng.pdf",
      meta: "Product Velocity • 0 to 1 • Node",
      badge: "Generalist",
      size: "135 KB",
    },
  ];

  return (
    <div className="space-y-2 select-none">
      {resumes.map((item, idx) => {
        const isActive = activeIndex === idx;
        return (
          <div
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`group relative rounded-xl border p-2.5 sm:p-3 flex items-center justify-between transition-all duration-300 cursor-pointer ${
              isActive
                ? "border-orange-500/50 bg-orange-50/90 dark:bg-orange-950/30 shadow-xs ring-1 ring-orange-500/20"
                : "border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/60"
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div
                className={`size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isActive
                    ? "bg-orange-600 text-white shadow-2xs"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                }`}
              >
                <FileText className="size-4" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate tracking-tight">
                    {item.title}
                  </p>
                  <span
                    className={`hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      isActive
                        ? "bg-orange-200/70 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 font-medium"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-normal"
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>
                <p
                  className={`text-[11px] font-mono truncate mt-0.5 ${
                    isActive
                      ? "text-orange-950/70 dark:text-orange-200/70"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {item.meta}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="hidden sm:inline text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                {item.size}
              </span>
              {isActive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-medium text-orange-700 dark:text-orange-300 bg-orange-100/90 dark:bg-orange-950/70 border border-orange-300/60 dark:border-orange-800/60 shadow-2xs">
                  <span className="size-1.5 rounded-full bg-orange-600 dark:bg-orange-500 animate-pulse" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 group-hover:border-zinc-300 dark:group-hover:border-zinc-600 transition-colors">
                  Ready
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ExpressFillBatchRunner() {
  const [checkedState, setCheckedState] = useState([true, false, false]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      while (active) {
        setCheckedState([false, false, false]);
        await new Promise((r) => setTimeout(r, 1000));
        if (!active) break;

        setCheckedState([true, false, false]);
        await new Promise((r) => setTimeout(r, 900));
        if (!active) break;

        setCheckedState([true, true, false]);
        await new Promise((r) => setTimeout(r, 900));
        if (!active) break;

        setCheckedState([true, true, true]);
        await new Promise((r) => setTimeout(r, 2600));
      }
    };
    run();
    return () => {
      active = false;
    };
  }, []);

  const items = [
    { label: "Technical challenge summary", status: "Generated" },
    { label: "Architecture decision record", status: "Synthesized" },
    { label: "Preferred compensation range", status: "Extracted" },
  ];

  return (
    <div className="space-y-2 font-mono text-xs">
      {items.map((item, idx) => {
        const isDone = checkedState[idx];
        return (
          <div
            key={idx}
            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
              isDone
                ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-zinc-900 dark:text-zinc-100"
                : "border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/60 text-zinc-500"
            }`}
          >
            <div className="flex items-center gap-2.5 truncate pr-2">
              <div
                className={`size-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isDone
                    ? "bg-emerald-500 text-white shadow-2xs"
                    : "border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-transparent"
                }`}
              >
                <Check className="size-2.5" strokeWidth={3} />
              </div>
              <span className={isDone ? "text-zinc-800 dark:text-zinc-200 font-medium truncate text-[11px]" : "text-zinc-500 dark:text-zinc-400 truncate text-[11px]"}>
                {item.label}
              </span>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                isDone
                  ? "text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/50 font-medium"
                  : "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800"
              }`}
            >
              {isDone ? item.status : "Waiting"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function GridFeaturesSection() {
  return (
    <section id="features" className="w-full my-12 sm:my-20">
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-mono font-medium mb-3">
          <span>Engine Capabilities</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Engineered for Application Velocity
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
          Beyond basic form-fillers. Lazee leverages deep DOM extraction and targeted context models to automate the entire candidate submission loop.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto">
        {/* Row 1 - Card 1: Contextual AI Synthesis (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-900 mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1.5">
                <Brain className="size-3.5" />
                Contextual AI Synthesis
              </span>
              <span className="text-[10px] font-mono text-zinc-400">Deterministic</span>
            </div>

            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Drafts verified answers from your production accomplishments.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              Instead of generic AI hallucinations, Lazee references your verified engineering record to provide tailored, quantitative answers for subjective ATS prompts.
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-500 font-mono pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
              <span className="text-zinc-700 dark:text-zinc-300 font-medium truncate">
                Prompt: System Scalability &amp; Optimization
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium shrink-0">
                99.4% Match
              </span>
            </div>
            <TypewriterSynthesizer />
          </div>
        </div>

        {/* Row 1 - Card 2: Multi-Resume Matrix (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-900 mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1.5">
                <FileText className="size-3.5" />
                Multi-Resume Matrix
              </span>
              <span className="text-[10px] font-mono text-zinc-400">Hot-Swap</span>
            </div>

            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Switch role-targeted PDF copies instantly.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              Store tailored resume versions for Platform, Full-Stack, or Tech Lead tracks and toggle the active file straight from the extension popup.
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">Target Profiles (3)</span>
              <span className="text-orange-600 dark:text-orange-400 flex items-center gap-1.5 font-medium">
                <span className="size-1.5 rounded-full bg-orange-500 animate-pulse" />
                Hot-Swap Active
              </span>
            </div>
            <ResumeSwitcher />
          </div>
        </div>

        {/* Row 2 - Card 3: Express Batch Fill (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-900 mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1.5">
                <Layers className="size-3.5" />
                1-Click Express Fill
              </span>
              <span className="text-[10px] font-mono text-zinc-400">Pro Feature</span>
            </div>

            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Batch-populate multi-question forms.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              Scans all detected open-ended textareas across long career pages and synthesizes tailored responses simultaneously.
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">Batch Form Scanner</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">3 Detected</span>
            </div>
            <ExpressFillBatchRunner />
          </div>
        </div>

        {/* Row 2 - Card 4: Recruiter Outreach Engine (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-900 mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1.5">
                <Mail className="size-3.5" />
                Recruiter Outreach
              </span>
              <span className="text-[10px] font-mono text-zinc-400">Gmail Integration</span>
            </div>

            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Synthesize high-converting outreach in Gmail compose.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              Extract company and role context directly from active tabs to craft crisp, non-fluff cold emails and referral notes directly inside Gmail.
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 p-3.5 space-y-2 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-zinc-200/60 dark:border-zinc-800 text-[11px] text-zinc-500">
              <span className="text-zinc-800 dark:text-zinc-200 font-medium truncate">To: hiring-team@stripe.com</span>
              <span className="text-orange-600 dark:text-orange-400 font-medium shrink-0">Staff Platform Candidate</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-300 text-[11px] leading-relaxed">
              &quot;Hi Alex, saw your opening for Staff Platform Engineer. In my current role I scaled our Raft consensus cluster to 180k req/sec with P99 &lt; 14ms. Would love to connect regarding infrastructure scaling.&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
