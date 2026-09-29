"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Search, Zap } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50/50 dark:bg-zinc-950 selection:bg-orange-500 selection:text-white overflow-hidden flex items-center justify-center relative px-4 py-12">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full mx-auto">
        <div className="w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-6 sm:p-8 shadow-xs flex flex-col items-center">
          {/* Search Icon Badge */}
          <div className="w-12 h-12 rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-5">
            <Search className="w-6 h-6" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 text-xs font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            Error 404
          </div>

          {/* Heading & Subtitle */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
            Page not found
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
            The page you&apos;re looking for doesn&apos;t exist, was moved, or is temporarily unavailable.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              href="/"
              className="flex-1 h-11 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_16px_-4px_rgba(234,88,12,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <button
              onClick={() => router.back()}
              className="flex-1 h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 font-medium text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="mt-8 flex items-center gap-2 text-zinc-400 dark:text-zinc-600 text-xs font-mono">
          <Zap className="w-3.5 h-3.5 text-orange-500" />
          <span>lazee.dev</span>
        </div>
      </div>
    </div>
  );
}
