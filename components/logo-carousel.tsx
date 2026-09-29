"use client";

import Image from "next/image";
import { motion } from "motion/react";

const logos = [
  { name: "Airtable", src: "airtable.jpg" },
  { name: "ClanX", src: "clanx.png" },
  { name: "Glassdoor", src: "glassdoor.png" },
  { name: "Google Forms", src: "google-form.png" },
  { name: "Lever", src: "lever.png" },
  { name: "Notion", src: "notion.png" },
  { name: "Superteam", src: "superteam.png" },
  { name: "Wellfound", src: "wellfound.png" },
];

// Combine logos to ensure infinite scroll
const duplicatedLogos = [...logos, ...logos];

export function LogoCarousel() {
  const baseUrl = "https://pub-889628534b094cf89bcd7cd93528323d.r2.dev/assets/";

  return (
    <section id="platforms" className="w-full py-12 sm:py-16 border-y border-zinc-200/80 dark:border-zinc-800/80 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase font-mono tracking-wider font-semibold text-zinc-400 dark:text-zinc-500">
            Native DOM Integration Across Modern ATS & Job Portals
          </p>
        </div>

        <div className="relative overflow-hidden">
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
                  duration: 28,
                  ease: "linear",
                },
              }}
              className="flex whitespace-nowrap items-center py-2"
            >
              {duplicatedLogos.map((logo, index) => (
                <div
                  key={`${logo.name}-${index}`}
                  className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-200 px-6 sm:px-10"
                >
                  <div className="relative h-8 w-24 sm:h-9 sm:w-28 flex items-center justify-center">
                    <Image
                      src={`${baseUrl}${logo.src}`}
                      alt={logo.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
