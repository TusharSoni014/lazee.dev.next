"use client";

import { motion } from "motion/react";
import { HeroDemo } from "@/components/hero-demo";
import { Chrome, Sparkles, Zap, Globe } from "lucide-react";
import { InstallModal } from "./install-modal";
import Image from "next/image";
import { useBrowser } from "@/hooks/use-browser";
import { FirefoxIcon } from "./firefox-icon";

export function HeroSection() {
  const browser = useBrowser();
  const isFirefox = browser === "firefox";

  const features = [
    {
      icon: <Zap size={14} className="text-orange-500 fill-orange-100" />,
      text: "Unlimited Autofill",
    },
    {
      icon: <Sparkles size={14} className="text-orange-500 fill-orange-100" />,
      text: "AI Powered Answers",
    },
    {
      icon: <Globe size={14} className="text-orange-500 fill-orange-100" />,
      text: "Works on Popular Sites",
    },
  ];

  const developerAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
  ];

  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 mb-24">
      {/* Left Column (Content) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 md:gap-7"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-100 border-2 border-orange-200 px-3.5 py-1.5 rounded-full shadow-[2px_2px_0px_0px_rgba(249,115,22,0.1)]">
          <Sparkles size={14} className="text-orange-500 fill-orange-500/20" />
          <span className="text-orange-900 text-xs sm:text-sm font-black uppercase tracking-wider">
            Stop Typing. Start Applying.
          </span>
        </div>

        {/* Title */}
        <h1 className="max-w-xl text-4xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight text-zinc-950 leading-[1.08] uppercase">
          Apply to jobs <br />
          <span className="text-orange-500">100x faster</span> <br />
          with AI.
        </h1>

        {/* Paragraph */}
        <p className="max-w-lg text-base sm:text-lg font-bold leading-relaxed text-zinc-700 tracking-tight">
          Lazee.dev is the browser extension that{" "}
          <span className="text-zinc-950 font-black">autofills</span> job
          applications for you.{" "}
          <span className="text-orange-500 bg-orange-50 border border-orange-200/50 px-1.5 py-0.5 rounded inline-block font-black transform rotate-1">
            Zero hassle.
          </span>{" "}
          Just results.
        </p>

        {/* Call to Action Row */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-start mt-2">
          <InstallModal>
            <motion.button
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ y: 1, scale: 0.98 }}
              className="flex h-14 w-full sm:w-auto min-w-[240px] items-center justify-center border-2 border-black bg-black text-white hover:bg-zinc-900 px-6 text-base font-black uppercase tracking-tight shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] hover:shadow-[5px_5px_0px_0px_rgba(249,115,22,1)] active:shadow-none transition-all cursor-pointer gap-2"
            >
              {isFirefox ? (
                <FirefoxIcon
                  size={18}
                  className="text-white fill-current shrink-0"
                />
              ) : (
                <Chrome size={18} className="fill-white text-black shrink-0" />
              )}
              <span>Add to {isFirefox ? "Firefox" : "Chrome"}</span>
            </motion.button>
          </InstallModal>

          {/* Handdrawn It's free visual pointer */}
          <div className="flex items-center gap-1.5">
            <svg
              className="w-12 h-6 text-zinc-400 transform scale-x-[-1] rotate-12 hidden sm:block"
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
            <span className="text-sm font-bold font-heading italic text-zinc-500 transform -rotate-3 select-none">
              It's free
            </span>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 w-full justify-center lg:justify-start mt-4 border-t border-zinc-100 pt-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2, scale: 1.03 }}
              className="flex items-center gap-2 justify-center lg:justify-start"
            >
              <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-orange-50 border border-orange-200">
                {feature.icon}
              </div>
              <span className="font-bold text-xs sm:text-sm text-zinc-600">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* User Stats Avatars */}
        <div className="flex items-center gap-3 mt-2 justify-center lg:justify-start">
          <div className="flex -space-x-2.5 overflow-hidden">
            {developerAvatars.map((url, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -3, zIndex: 10 }}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-[#fefaf6] relative overflow-hidden"
              >
                <Image
                  src={url}
                  alt="Developer avatar"
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col items-start leading-none text-left">
            <span className="text-yellow-500 text-xs sm:text-sm font-bold">
              ★★★★★
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-zinc-500 mt-0.5">
              <span className="text-zinc-900 font-black">
                2,000+ developers
              </span>{" "}
              are already using Lazee
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 w-full max-w-md lg:max-w-full flex justify-center lg:justify-end self-start"
      >
        <HeroDemo />
      </motion.div>
    </div>
  );
}
