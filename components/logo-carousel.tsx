"use client";

import Image from "next/image";
import { motion } from "motion/react";

interface LogoItem {
  name: string;
  src: string;
  darkSrc?: string;
  className?: string;
  containerClassName?: string;
}

const logos: LogoItem[] = [
  {
    name: "Ashby",
    src: "/ashby.svg",
  },
  {
    name: "Lever",
    src: "/lever.svg",
    className: "invert dark:invert-0",
  },
  {
    name: "Y Combinator",
    src: "/ycombinator.svg",
    darkSrc: "/ycombinator-dark.svg",
    containerClassName: "h-9 w-40 sm:h-10 sm:w-44",
  },
  {
    name: "Glassdoor",
    src: "/glassdoor.svg",
  },
  {
    name: "Wellfound",
    src: "/wellfound.svg",
    darkSrc: "/wellfound-dark.svg",
    containerClassName: "h-8 w-36 sm:h-9 sm:w-48",
  },
  {
    name: "Notion",
    src: "/notion.svg",
    className: "dark:invert",
  },
  {
    name: "Airtable",
    src: "/airtable.svg",
    darkSrc: "/airtable-dark.svg",
  },
  {
    name: "ClanX",
    src: "/clanx.svg",
    darkSrc: "/clanx-dark.svg",
  },
  {
    name: "Google & Gmail",
    src: "/google.svg",
  },
  {
    name: "Superteam",
    src: "/superteam.svg",
    className: "invert dark:invert-0",
    containerClassName: "h-10 w-24 sm:h-12 sm:w-28",
  },
];

// Combine logos to ensure infinite scroll
const duplicatedLogos = [...logos, ...logos];

export function LogoCarousel() {
  return (
    <section
      id="platforms"
      aria-label="Supported ATS and job application portals"
      className="w-full py-12 sm:py-16 border-y border-zinc-200/80 dark:border-zinc-800/80 my-8 relative overflow-hidden scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase font-mono tracking-wider font-semibold text-zinc-400 dark:text-zinc-500">
            Native DOM Integration Across Modern ATS &amp; Job Portals
          </p>
        </div>

        <div className="relative overflow-hidden group">
          {/* Subtle Side Fades */}
          <div className="absolute top-0 left-0 w-20 sm:w-32 h-full bg-gradient-to-r from-zinc-50 dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-20 sm:w-32 h-full bg-gradient-to-l from-zinc-50 dark:from-zinc-950 to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-hidden">
            <motion.div
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
              className="flex whitespace-nowrap items-center py-2"
            >
              {duplicatedLogos.map((logo, index) => (
                <div
                  key={`${logo.name}-${index}`}
                  className="flex items-center justify-center px-6 sm:px-10"
                >
                  <div
                    className={`relative flex items-center justify-center ${
                      logo.containerClassName || "h-8 w-24 sm:h-9 sm:w-28"
                    }`}
                  >
                    {logo.darkSrc ? (
                      <>
                        <Image
                          src={logo.src}
                          alt={logo.name}
                          fill
                          className={`object-contain dark:hidden ${logo.className || ""}`}
                          unoptimized
                        />
                        <Image
                          src={logo.darkSrc}
                          alt={logo.name}
                          fill
                          className={`object-contain hidden dark:block ${logo.className || ""}`}
                          unoptimized
                        />
                      </>
                    ) : (
                      <Image
                        src={logo.src}
                        alt={logo.name}
                        fill
                        className={`object-contain ${logo.className || ""}`}
                        unoptimized
                      />
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Callout: Also Supports 100+ More */}
        <div className="mt-8 flex flex-col items-center justify-center gap-2 text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-2xs text-xs font-mono text-zinc-700 dark:text-zinc-300">
            <span>
              also supports{" "}
              <strong className="font-semibold text-orange-600 dark:text-orange-400">
                100+ more!
              </strong>
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            Seamless auto-detection on Greenhouse, Workday, Taleo, BambooHR
            &amp; custom forms.
          </p>
        </div>
      </div>
    </section>
  );
}
