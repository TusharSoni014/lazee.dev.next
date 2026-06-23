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
    <div className="w-full py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="mb-12 text-center">
          <h2 className="inline-block bg-[#00bcd4] text-black text-xl sm:text-2xl font-black uppercase tracking-tight px-6 py-2 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
            Supported Sites
          </h2>
        </div>

        <div className="relative bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] py-12 overflow-hidden">
          {/* Enhanced Fade Effect */}
          <div className="absolute top-0 left-0 w-24 sm:w-48 h-full bg-linear-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-24 sm:w-48 h-full bg-linear-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-hidden">
            <motion.div
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 25,
                  ease: "linear",
                },
              }}
              className="flex whitespace-nowrap items-center"
            >
              {duplicatedLogos.map((logo, index) => (
                <div
                  key={`${logo.name}-${index}`}
                  className="flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 px-6 sm:px-12"
                >
                  <div className="relative h-10 w-28 sm:h-12 sm:w-36 flex items-center justify-center">
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
    </div>
  );
}
