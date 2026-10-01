"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { LOGO_URL } from "@/lib/constants";

const LOADING_MESSAGES = [
  "Synchronizing workspace...",
  "Reading candidate profile...",
  "Calibrating ATS mapping engines...",
  "Preparing tailored credentials...",
  "Connecting extension bridge...",
];

interface LoadingProps {
  message?: string;
  className?: string;
  fullPage?: boolean;
}

export default function Loading({
  message,
  className = "",
  fullPage = true,
}: LoadingProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const content = (
    <div
      className={`w-full max-w-[340px] sm:max-w-sm rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-xl shadow-zinc-950/5 dark:shadow-black/20 px-5 py-6 sm:p-8 flex flex-col items-center gap-5 sm:gap-6 text-center ${className}`}
    >
      {/* Brand Icon & Typography matching SiteHeader */}
      <div className="relative flex flex-col items-center gap-3">
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-2 rounded-2xl bg-orange-500/10 dark:bg-orange-500/15 blur-md animate-pulse pointer-events-none" />
          <div className="relative size-14 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center shadow-xs">
            <div className="relative size-8 flex-shrink-0">
              <Image
                src={LOGO_URL}
                alt="Lazee.dev Logo"
                fill
                className="object-contain"
                sizes="32px"
                priority
              />
            </div>
          </div>
        </div>

        <div className="flex items-center text-lg font-bold tracking-tight text-zinc-900 dark:text-white font-heading">
          <span>lazee</span>
          <span className="text-orange-600 dark:text-orange-500">.dev</span>
        </div>
      </div>

      {/* Modern Shimmer Progress Indicator */}
      <div className="w-40 sm:w-48 h-1.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-full overflow-hidden relative border border-zinc-200/60 dark:border-zinc-700/60">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 dark:from-orange-500 dark:via-amber-400 dark:to-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.35)]"
          animate={{
            x: ["-110%", "275%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{ width: "40%" }}
        />
      </div>

      {/* Monospace Animated Status Pill */}
      <div className="min-h-[2.25rem] w-full flex items-center justify-center px-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={message || msgIndex}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.2 }}
            className="inline-flex max-w-full items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100/90 dark:bg-zinc-800/90 border border-zinc-200/70 dark:border-zinc-700/70 shadow-2xs"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[11.5px] sm:text-xs font-mono font-medium text-zinc-600 dark:text-zinc-300 tracking-tight text-center leading-normal truncate">
              {message || LOADING_MESSAGES[msgIndex]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  if (!fullPage) {
    return content;
  }

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] w-full bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden transition-colors">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.04),transparent_65%)] pointer-events-none" />
      <div className="relative z-10 w-full flex items-center justify-center">
        {content}
      </div>
    </div>
  );
}
