"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { CheckSquare, User, FileText, Sparkles, Settings } from "lucide-react";

export function DashboardPreviewSection() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "resumes" | "ai-notes" | "settings">("profile");

  const bulletPoints = [
    "Store multiple resume versions",
    "Save social & portfolio links",
    "Add custom AI instructions",
    "Basic details & work history",
    "Secure, simple, and clean",
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full mb-24"
    >
      <div className="w-full bg-[#0d0d12] border-[3px] border-black rounded-3xl p-4 sm:p-10 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Profile Mockup (Left Column) */}
        <div className="flex-1 w-full bg-white text-black border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] flex flex-row overflow-hidden aspect-[4/3] min-h-[300px] sm:min-h-[360px] md:min-h-[400px]">
          {/* Mock Sidebar */}
          <div className="w-[70px] sm:w-[110px] md:w-[130px] bg-zinc-950 border-r-[3px] border-black p-2 sm:p-4 flex flex-col gap-5 shrink-0 text-white select-none">
            <span className="text-[10px] sm:text-xs font-black tracking-tighter text-white font-heading italic uppercase truncate">
              LAZEE.DEV
            </span>
            <div className="flex flex-col gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 rounded-md text-[9px] sm:text-xs font-bold transition-colors w-full cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-orange-600/20 text-orange-500 border border-orange-600/30"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <User size={14} className="shrink-0" />
                <span className="hidden sm:inline">Profile</span>
              </button>
              <button
                onClick={() => setActiveTab("resumes")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 rounded-md text-[9px] sm:text-xs font-bold transition-colors w-full cursor-pointer ${
                  activeTab === "resumes"
                    ? "bg-orange-600/20 text-orange-500 border border-orange-600/30"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <FileText size={14} className="shrink-0" />
                <span className="hidden sm:inline">Resumes</span>
              </button>
              <button
                onClick={() => setActiveTab("ai-notes")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 rounded-md text-[9px] sm:text-xs font-bold transition-colors w-full cursor-pointer ${
                  activeTab === "ai-notes"
                    ? "bg-orange-600/20 text-orange-500 border border-orange-600/30"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Sparkles size={14} className="shrink-0" />
                <span className="hidden sm:inline">AI Notes</span>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 rounded-md text-[9px] sm:text-xs font-bold transition-colors w-full cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-orange-600/20 text-orange-500 border border-orange-600/30"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Settings size={14} className="shrink-0" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>

          {/* Mock Main Content */}
          <div className="flex-1 bg-zinc-50 p-4 sm:p-5 flex flex-col gap-4 overflow-hidden text-black select-none">
            {/* Header row */}
            <div className="flex flex-col border-b-2 border-zinc-200 pb-2">
              <h4 className="text-xs sm:text-sm font-black text-black flex items-center gap-1.5 leading-none">
                {activeTab === "profile" && "Personal Profile"}
                {activeTab === "resumes" && "Resume Manager"}
                {activeTab === "ai-notes" && "Custom AI Guidance"}
                {activeTab === "settings" && "Account Settings"}
              </h4>
              <span className="text-[8px] sm:text-[9px] font-bold text-zinc-500 mt-1 truncate">
                {activeTab === "profile" && "Your autofill details are securely saved here."}
                {activeTab === "resumes" && "Upload and manage different resume versions."}
                {activeTab === "ai-notes" && "Provide custom instructions for AI answers."}
                {activeTab === "settings" && "Manage your account options & public link."}
              </span>
            </div>

            {/* Profile fields mockup */}
            <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto pr-1">
              {activeTab === "profile" && (
                <>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] font-black uppercase text-zinc-500">Full Name</span>
                    <div className="w-full bg-white border border-zinc-300 rounded px-2 py-1 text-[9px] sm:text-[10px] font-bold text-black">
                      Tushar Soni
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-black uppercase text-zinc-500">Notice Period</span>
                      <div className="w-full bg-white border border-zinc-300 rounded px-2 py-1 text-[9px] sm:text-[10px] font-bold text-black truncate">
                        Immediate
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-black uppercase text-zinc-500">Job Type</span>
                      <div className="w-full bg-white border border-zinc-300 rounded px-2 py-1 text-[9px] sm:text-[10px] font-bold text-black truncate">
                        Full-time Remote
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] font-black uppercase text-zinc-500">Active Resume</span>
                    <div className="w-full bg-white border border-zinc-300 rounded px-2 py-1 text-[9px] sm:text-[10px] font-bold text-black flex items-center gap-1.5">
                      <FileText size={10} className="text-orange-500 shrink-0" />
                      <span className="truncate">Resume_Frontend_Developer.pdf</span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "resumes" && (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black uppercase text-zinc-500">Uploaded Resumes</span>
                    <div className="w-full bg-white border border-zinc-300 rounded px-2 py-1.5 text-[9px] sm:text-[10px] font-bold text-black flex items-center justify-between">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <FileText size={10} className="text-emerald-500 shrink-0" />
                        <span className="truncate">Resume_Frontend_Developer.pdf</span>
                      </div>
                      <span className="text-[7px] font-black uppercase bg-emerald-500 text-white px-1.5 py-0.5 border border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] shrink-0 leading-none">
                        Active
                      </span>
                    </div>
                    <div className="w-full bg-white border border-zinc-300 rounded px-2 py-1.5 text-[9px] sm:text-[10px] font-bold text-zinc-400 flex items-center gap-1.5 opacity-60">
                      <FileText size={10} className="shrink-0" />
                      <span className="truncate">Resume_Fullstack.pdf</span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "ai-notes" && (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black uppercase text-zinc-500">Custom AI Guidance</span>
                    <div className="w-full bg-white border border-zinc-300 rounded p-2 text-[8px] sm:text-[9px] font-medium text-zinc-650 leading-normal min-h-[45px]">
                      "Highlight my 4+ years of React experience. Emphasize performance tuning and design systems."
                    </div>
                  </div>
                </>
              )}

              {activeTab === "settings" && (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black uppercase text-zinc-500">Email Address</span>
                    <div className="w-full bg-zinc-100 border border-zinc-300 rounded px-2 py-1 text-[9px] sm:text-[10px] font-bold text-zinc-500">
                      tushar@lazee.dev
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black uppercase text-zinc-500">Public Profile</span>
                    <div className="w-full bg-white border border-zinc-300 rounded px-2 py-1 text-[9px] sm:text-[10px] font-bold text-black flex items-center justify-between">
                      <span className="truncate text-zinc-400">lazee.dev/u/tushar</span>
                      <span className="text-[7px] font-black uppercase bg-zinc-100 border border-black px-1.5 py-0.5 rounded cursor-pointer hover:bg-zinc-200">Copy</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Action Button */}
            <div className="pt-2 border-t border-zinc-200 flex justify-end">
              <button
                onClick={handleAction}
                className="bg-orange-500 hover:bg-orange-650 text-white border-2 border-black px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all tracking-wider cursor-pointer"
              >
                {activeTab === "profile" && "Save Profile"}
                {activeTab === "resumes" && "Update Resume"}
                {activeTab === "ai-notes" && "Save AI Notes"}
                {activeTab === "settings" && "Save Settings"}
              </button>
            </div>
          </div>
        </div>

        {/* Content (Right Column) */}
        <div className="flex-1 flex flex-col items-start gap-5 lg:pl-4">
          <span className="text-xs font-black uppercase bg-orange-500/10 text-orange-500 px-3 py-1.5 rounded-full border border-orange-500/20 tracking-wider">
            YOUR PROFILE CENTER
          </span>
          <h3 className="text-3xl sm:text-4xl font-heading font-black leading-tight uppercase">
            All your application data. <br />
            <span className="text-orange-500">In one simple profile.</span>
          </h3>
          <p className="text-zinc-400 text-base font-bold leading-relaxed max-w-md">
            No more messy spreadsheets or copying-pasting details. Store your resumes, personal details, social profiles, and custom AI notes in one secure place.
          </p>
          <ul className="flex flex-col gap-3.5 w-full mt-2">
            {bulletPoints.map((bullet, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="flex size-5 shrink-0 items-center justify-center rounded bg-orange-500/10 border border-orange-500/30">
                  <CheckSquare className="w-3.5 h-3.5 text-orange-500" strokeWidth={3} />
                </div>
                <span className="font-bold text-base text-zinc-300">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.section>
  );
}
