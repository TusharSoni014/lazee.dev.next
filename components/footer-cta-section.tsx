"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Chrome } from "lucide-react";
import { InstallModal } from "./install-modal";
import { useBrowser } from "@/hooks/use-browser";
import { FirefoxIcon } from "./firefox-icon";

export function FooterCtaSection() {
  const browser = useBrowser();
  const isFirefox = browser === "firefox";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full mb-12"
    >
      <div className="w-full bg-[#1c0f08] bg-gradient-to-br from-[#170a04] via-[#2c1305] to-[#0e0501] border-[3px] border-black rounded-3xl p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Glow decoration */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Content (Left) */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black uppercase tracking-tight leading-none">
            Ready to stop <br className="hidden sm:inline" />
            filling forms?
          </h2>
          <p className="text-zinc-300 text-base sm:text-lg font-bold leading-relaxed max-w-md">
            Join 2,000+ developers saving hours every week. Let AI do the grinding.
          </p>
          <div className="flex flex-col items-center md:items-start gap-2 mt-4 w-full">
            <InstallModal>
              <button className="flex h-14 w-full max-w-[320px] items-center justify-center border-2 border-black bg-[#ff6b00] hover:bg-[#ff8533] px-6 text-sm sm:text-base font-black uppercase text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer gap-2">
                {isFirefox ? (
                  <FirefoxIcon size={18} className="text-white fill-current shrink-0" />
                ) : (
                  <Chrome size={18} className="fill-white text-[#ff6b00] shrink-0" />
                )}
                <span>Add to {isFirefox ? "Firefox" : "Chrome"} — It's Free</span>
              </button>
            </InstallModal>
            <span className="text-[10px] sm:text-xs font-bold text-zinc-400 tracking-wider">
              No credit card required
            </span>
          </div>
        </div>

        {/* Mascot (Right) */}
        <div className="w-48 h-48 sm:w-60 sm:h-60 relative shrink-0 z-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-2xl -z-10" />
          <Image
            src="/ready-to-stop.png"
            alt="Relaxed developer mascot"
            fill
            className="object-contain transform scale-110"
          />
        </div>
      </div>
    </motion.section>
  );
}

