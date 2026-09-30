"use client";

import { motion } from "motion/react";

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
        className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] ring-1 ring-zinc-900/5 dark:ring-white/10"
      >
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/5B3ib4ydzwA?si=5s76zkrLsRL_oOy6"
          title="Lazee Product Walkthrough"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </motion.div>
    </section>
  );
}
