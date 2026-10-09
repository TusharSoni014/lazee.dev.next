"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Check,
  User,
  FileText,
  Sliders,
  Settings,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export function DashboardPreviewSection() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "profile" | "resumes" | "ai-notes" | "settings"
  >("profile");
  const [selectedResume, setSelectedResume] = useState<
    "platform" | "fullstack"
  >("platform");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "resumes", label: "Resumes", icon: FileText },
    { id: "ai-notes", label: "Directives", icon: Sliders },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  const bulletPoints = [
    "Multi-variant resume storage with instant active switching",
    "Comprehensive work history, tech stack, and verified metrics",
    "Custom AI directives to guide specific answer styles and tone",
    "Shareable engineer profile link (lazee.dev/u/yourname)",
    "Strict client-side isolation with zero training on your data",
  ];

  const handleAction = () => {
    if (session) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  };

  return (
    <motion.section
      id="vault"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full my-12 sm:my-20 scroll-mt-20"
    >
      <div className="w-full rounded-2xl sm:rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-900 text-white p-5 sm:p-8 lg:p-12 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-stretch lg:items-center gap-8 sm:gap-10 lg:gap-14">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content (Candidate Record Vault Header & Bullets) */}
        {/* On mobile: order-1 (ABOVE the mockup). On desktop: order-2 (right side) */}
        <div className="flex-1 flex flex-col items-start gap-4 sm:gap-5 order-1 lg:order-2 w-full">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-mono font-medium">
            <span className="size-1.5 rounded-full bg-orange-500" />
            <span>Candidate Record</span>
          </div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold leading-[1.15] text-white tracking-tight">
            All your career credentials. <br className="hidden sm:inline" />
            <span className="text-orange-500">In one unified record.</span>
          </h3>
          <p className="text-zinc-400 text-xs sm:text-sm sm:leading-relaxed max-w-lg">
            No more fragmented documents or copying between multiple text files.
            Store your verified work history, custom resumes, and prompt
            instructions once in your profile.
          </p>

          <ul className="space-y-2.5 sm:space-y-3 w-full mt-1 sm:mt-2">
            {bulletPoints.map((bullet, index) => (
              <li key={index} className="flex items-center gap-2.5 sm:gap-3">
                <div className="size-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
                  <Check className="size-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-300 font-medium">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Profile Mockup (Console Container) */}
        {/* On mobile: order-2 (BELOW the heading). On desktop: order-1 (left side) */}
        <div className="flex-1 w-full rounded-2xl border border-zinc-700/60 bg-zinc-950 shadow-2xl flex flex-col sm:flex-row overflow-hidden min-h-[400px] sm:min-h-[420px] select-none order-2 lg:order-1">
          {/* Mobile Console Top Header (< sm) */}
          <div className="sm:hidden flex items-center justify-between px-3.5 py-2.5 bg-zinc-950 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-xs font-bold font-mono tracking-tight text-white">
                Profile Console
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
              <ShieldCheck className="size-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Encrypted</span>
            </div>
          </div>

          {/* Mobile Horizontal Tabs (< sm) */}
          <div className="sm:hidden grid grid-cols-4 gap-1 p-1.5 bg-zinc-900/90 border-b border-zinc-800/80">
            {tabs.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as typeof activeTab)}
                  className={`flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-zinc-800 text-orange-400 font-semibold shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Icon size={14} className="shrink-0" />
                  <span className="truncate max-w-full text-[10px]">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Desktop/Tablet Sidebar (sm:flex) */}
          <div className="hidden sm:flex w-[140px] bg-zinc-950 border-r border-zinc-800/80 p-3 sm:p-4 flex-col justify-between shrink-0">
            <div>
              <div className="flex items-center gap-1.5 mb-5 pb-3 border-b border-zinc-800/60">
                <span className="size-2 rounded-full bg-orange-500" />
                <span className="text-[11px] font-bold tracking-tight text-white">
                  Profile Details
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {tabs.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as typeof activeTab)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                        isActive
                          ? "bg-zinc-800 text-orange-400 font-semibold shadow-xs"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                      }`}
                    >
                      <Icon size={14} className="shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
              <ShieldCheck className="size-3 text-emerald-500" />
              <span>Encrypted</span>
            </div>
          </div>

          {/* Mock Main Content Area */}
          <div className="flex-1 bg-zinc-900/60 p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
            <div>
              {/* Header row */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
                <div className="min-w-0 pr-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                    {activeTab === "profile" && "Candidate Identity Record"}
                    {activeTab === "resumes" && "Active Resume Variants"}
                    {activeTab === "ai-notes" && "LLM Reasoning Directives"}
                    {activeTab === "settings" && "Public Portfolio & Settings"}
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                    {activeTab === "profile" &&
                      "Deterministic fields mapped to ATS inputs."}
                    {activeTab === "resumes" &&
                      "Manage role-targeted PDF copies."}
                    {activeTab === "ai-notes" &&
                      "Fine-tune tone and emphasis for open prompts."}
                    {activeTab === "settings" &&
                      "Custom URL and privacy configuration."}
                  </p>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 shrink-0">
                  Live
                </span>
              </div>

              {/* Dynamic Content */}
              <div className="space-y-3">
                {activeTab === "profile" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-400">
                        Full Name
                      </span>
                      <div className="rounded-md border border-zinc-700/60 bg-zinc-950 px-2.5 py-1.5 text-xs text-white">
                        Devin Zhao
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1 min-w-0">
                        <span className="text-[10px] font-mono text-zinc-400 truncate block">
                          Notice Period
                        </span>
                        <div className="rounded-md border border-zinc-700/60 bg-zinc-950 px-2.5 py-1.5 text-xs text-white truncate">
                          Immediate / 2 Wks
                        </div>
                      </div>
                      <div className="space-y-1 min-w-0">
                        <span className="text-[10px] font-mono text-zinc-400 truncate block">
                          Target Role
                        </span>
                        <div className="rounded-md border border-zinc-700/60 bg-zinc-950 px-2.5 py-1.5 text-xs text-white truncate">
                          Staff Platform Engineer
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-400">
                        Active Resume Attachment
                      </span>
                      <div className="rounded-md border border-zinc-700/60 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200 flex items-center justify-between gap-2">
                        <span className="truncate text-xs">
                          Resume_Staff_Platform_2026.pdf
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.5 rounded shrink-0">
                          Selected
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "resumes" && (
                  <div className="space-y-2">
                    <div
                      onClick={() => setSelectedResume("platform")}
                      className={`rounded-lg border p-2.5 flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        selectedResume === "platform"
                          ? "border-emerald-800/80 bg-emerald-950/20"
                          : "border-zinc-800 bg-zinc-950/40 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden min-w-0">
                        <FileText
                          className={`size-4 shrink-0 ${
                            selectedResume === "platform"
                              ? "text-emerald-400"
                              : "text-zinc-400"
                          }`}
                        />
                        <div className="truncate min-w-0">
                          <p className="text-xs font-medium text-white truncate">
                            Resume_Staff_Platform.pdf
                          </p>
                          <p className="text-[9px] text-zinc-400 truncate">
                            Default for Systems/Platform roles
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] font-mono font-medium px-2 py-0.5 rounded shrink-0 ${
                          selectedResume === "platform"
                            ? "text-emerald-400 bg-emerald-900/40"
                            : "text-zinc-400 bg-zinc-800 hover:text-white"
                        }`}
                      >
                        {selectedResume === "platform" ? "Active" : "Select"}
                      </span>
                    </div>

                    <div
                      onClick={() => setSelectedResume("fullstack")}
                      className={`rounded-lg border p-2.5 flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        selectedResume === "fullstack"
                          ? "border-emerald-800/80 bg-emerald-950/20"
                          : "border-zinc-800 bg-zinc-950/40 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden min-w-0">
                        <FileText
                          className={`size-4 shrink-0 ${
                            selectedResume === "fullstack"
                              ? "text-emerald-400"
                              : "text-zinc-400"
                          }`}
                        />
                        <div className="truncate min-w-0">
                          <p className="text-xs font-medium text-white truncate">
                            Resume_FullStack_Lead.pdf
                          </p>
                          <p className="text-[9px] text-zinc-400 truncate">
                            Targeted for React/Next.js leadership
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] font-mono font-medium px-2 py-0.5 rounded shrink-0 ${
                          selectedResume === "fullstack"
                            ? "text-emerald-400 bg-emerald-900/40"
                            : "text-zinc-400 bg-zinc-800 hover:text-white"
                        }`}
                      >
                        {selectedResume === "fullstack" ? "Active" : "Select"}
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === "ai-notes" && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-zinc-400">
                      Custom Directive Context
                    </span>
                    <div className="rounded-lg border border-zinc-700/60 bg-zinc-950 p-2.5 text-xs text-zinc-300 font-mono leading-relaxed">
                      &quot;Prioritize quantitative impact: highlight 140k
                      req/sec distributed ingestion pipeline, zero-downtime
                      database sharding, and P99 latency reductions.&quot;
                    </div>
                    <p className="text-[10px] text-zinc-500">
                      Injected into open-ended questions when applying via
                      browser extension.
                    </p>
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-400">
                        Public Engineering Profile
                      </span>
                      <div className="rounded-md border border-zinc-700/60 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200 flex items-center justify-between gap-2">
                        <span className="text-orange-400 font-mono truncate">
                          lazee.dev/u/devin
                        </span>
                        <ExternalLink
                          size={12}
                          className="text-zinc-500 shrink-0"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-400">
                        Account Tier
                      </span>
                      <div className="rounded-md border border-zinc-700/60 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-300 flex items-center justify-between gap-2">
                        <span>Pro Plan Member</span>
                        <span className="text-emerald-400 text-[10px] font-mono shrink-0">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer row */}
            <div className="pt-3 mt-4 border-t border-zinc-800/80 flex items-center justify-between gap-2">
              <span className="text-[10px] text-zinc-400 font-mono truncate">
                Changes persist automatically
              </span>
              <button
                onClick={handleAction}
                className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white text-xs font-medium transition-all shadow-xs cursor-pointer shrink-0"
              >
                Visit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
