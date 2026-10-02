"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50/50 dark:bg-zinc-950 selection:bg-orange-500 selection:text-white flex items-center justify-center relative px-4 py-12">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-6 sm:p-8 shadow-xs text-center flex flex-col items-center">
        {/* Error Icon */}
        <div className="w-12 h-12 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mb-5">
          <AlertTriangle className="w-6 h-6" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono tracking-wide mb-3">
          Application Error
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
          An unexpected error occurred. Don&apos;t worry, you can retry the action or return to the home page.
        </p>

        {error.digest && (
          <div className="w-full mb-6 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 select-all overflow-x-auto text-left">
            Digest: {error.digest}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={reset}
            size="lg"
            className="flex-1"
          >
            <RefreshCw className="size-4" />
            Try Again
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex-1"
          >
            <Link href="/">
              <Home className="size-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
