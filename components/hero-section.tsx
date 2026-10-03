"use client";

import { motion } from "motion/react";
import { HeroDemo } from "@/components/hero-demo";
import { ShieldCheck, Check, Star } from "lucide-react";
import { InstallModal } from "./install-modal";
import { useBrowser } from "@/hooks/use-browser";
import { FaChrome, FaFirefox, FaGithub } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const browser = useBrowser();
  const isFirefox = browser === "firefox";

  return (
    <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-16 pt-8 pb-16 sm:py-20 lg:py-24">
      {/* Left Column (Content) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left"
      >
        {/* Release / Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-700 dark:text-orange-400 text-xs font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <span className="font-mono text-[11px]">v2.2.1</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span>Now with Custom Providers & Web Scraping</span>
        </div>

        {/* Title */}
        <h1 className="max-w-2xl text-4xl sm:text-5xl lg:text-6xl font-heading font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.08]">
          Job applications.
          <br />
          <span className="font-serif italic text-[1.05em] text-orange-600 dark:text-orange-500">
            Apply in seconds,
          </span>
          <br />
          not hours.
        </h1>

        {/* Subtitle / Paragraph */}
        <p className="max-w-xl text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed mt-5">
          lazee.dev is a browser extension that autofills repetitive job forms
          from your unified profile data-saving you hours of tedious
          copy-pasting.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-8">
          <InstallModal>
            <Button
              size="lg"
              className="h-12 w-full sm:w-auto min-w-[220px] px-6 text-sm gap-2.5"
            >
              {isFirefox ? (
                <FaFirefox className="size-4 shrink-0" />
              ) : (
                <FaChrome className="size-4 shrink-0" />
              )}
              <span>Add to {isFirefox ? "Firefox" : "Chrome"} — Free</span>
            </Button>
          </InstallModal>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 w-full sm:w-auto px-6 text-sm gap-2.5"
          >
            <Link
              href="https://github.com/TusharSoni014/lazee.dev.next"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="size-4 shrink-0" />
              <span>GitHub Code</span>
            </Link>
          </Button>
        </div>

        {/* Micro reassurance notes */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-4 mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            200 free monthly AI credits
          </span>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">
            •
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            Works on 100+ career portals
          </span>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">
            •
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            Local-first privacy
          </span>
        </div>

        {/* Engineer Social Proof Bar */}
        <div className="mt-10 pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 w-full flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex -space-x-1.5 shrink-0">
              {[
                {
                  src: "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix",
                  alt: "Software engineer using Lazee",
                },
                {
                  src: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka",
                  alt: "Frontend developer using Lazee",
                },
                {
                  src: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aiden",
                  alt: "Backend developer using Lazee",
                },
                {
                  src: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sophia",
                  alt: "Full-stack engineer using Lazee",
                },
              ].map((avatar) => (
                <Image
                  key={avatar.src}
                  src={avatar.src}
                  alt={avatar.alt}
                  width={28}
                  height={28}
                  unoptimized
                  className="inline-block size-7 rounded-full object-cover ring-2 ring-white dark:ring-zinc-950 bg-zinc-100 dark:bg-zinc-800 shrink-0"
                />
              ))}
            </div>
            <div className="flex items-center gap-0.5 text-amber-500 ml-1 shrink-0">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className="fill-amber-500 text-amber-500 shrink-0"
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-normal text-center sm:text-left">
            Trusted by{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              2,400+ software engineers
            </span>{" "}
            saving an average of 18 hours per search.
          </p>
        </div>
      </motion.div>

      {/* Right Column (Interactive Simulator) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 w-full max-w-xl lg:max-w-none flex items-start justify-center lg:justify-end lg:self-start"
      >
        <HeroDemo />
      </motion.div>
    </div>
  );
}
