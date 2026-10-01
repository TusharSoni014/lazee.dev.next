"use client";

import { motion } from "motion/react";
import { FileText, Globe, Wand2, Layers, Check } from "lucide-react";

export function FeaturesSection() {
  return (
    <motion.div
      id="features"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center w-full max-w-[1280px] mx-auto px-4 sm:px-6"
    >
      <div className="w-full mb-16 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium mb-4">
          <Layers className="w-3.5 h-3.5" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight mb-4">
          Powerful features. Zero friction.
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Engineered to make your job application workflow faster, reliable, and intelligent.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-20">
        {/* Feature 1 */}
        <div className="relative flex flex-col h-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 sm:p-8 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 group">
          <div className="flex justify-between items-start mb-6">
            <div className="size-12 rounded-xl border border-orange-500/20 bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform">
              <Wand2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">
              01
            </span>
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
            Smart Auto-fill
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed grow">
            Automatically detects and populates job application forms with your verified profile data using fast, accurate context matching.
          </p>
          <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
            <Check className="w-3.5 h-3.5" />
            <span>Instant field mapping</span>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="relative flex flex-col h-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 sm:p-8 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 group">
          <div className="flex justify-between items-start mb-6">
            <div className="size-12 rounded-xl border border-orange-500/20 bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">
              02
            </span>
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
            Single Source of Truth
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed grow">
            Maintain standard personal details, work history, portfolios, and multiple targeted resumes from one centralized profile dashboard.
          </p>
          <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
            <Check className="w-3.5 h-3.5" />
            <span>Free standard autofill forever</span>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="relative flex flex-col h-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 sm:p-8 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 group">
          <div className="flex justify-between items-start mb-6">
            <div className="size-12 rounded-xl border border-orange-500/20 bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">
              03
            </span>
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
            Multi-Platform Support
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed grow">
            Works across Greenhouse, Lever, Ashby, Workday, LinkedIn, and thousands of company career portals without friction.
          </p>
          <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Supported browsers</span>
            <span className="font-mono text-[11px]">Chrome · Edge · Firefox</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
