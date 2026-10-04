"use client";

import { motion } from "motion/react";
import { LazyVideoEmbed } from "@/components/LazyVideoEmbed";

export function VideoSection() {
  return (
    <section className="w-full max-w-5xl mx-auto my-12 sm:my-16 px-4 sm:px-6">
      <div className="text-center mb-8">
        <span className="text-xs font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-semibold bg-orange-500/10 px-2.5 py-1 rounded">
          Product Walkthrough
        </span>
        <h3 className="text-xl sm:text-2xl font-heading font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mt-2">
          Watch the Lazee.dev Launch Video 2026
        </h3>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] ring-1 ring-zinc-900/5 dark:ring-white/10 rounded-2xl"
      >
        <LazyVideoEmbed
          url="https://www.youtube.com/watch?v=5B3ib4ydzwA"
          thumbnailUrl="/og.jpg"
          title="Watch the Lazee.dev Launch Video 2026"
        />
      </motion.div>
    </section>
  );
}
