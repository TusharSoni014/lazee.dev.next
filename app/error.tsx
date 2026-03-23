"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-[calc(100vh-4rem)] bg-[#fefaf6] selection:bg-orange-500 selection:text-white flex items-center justify-center relative">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4 py-12 max-w-lg mx-auto">
        {/* Error Icon */}
        <div className="mb-8 w-24 h-24 bg-red-500 border-[4px] border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-white" />
        </div>

        {/* Message */}
        <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 mb-8 w-full">
          <div className="inline-block bg-red-500 border-[3px] border-black px-4 py-1 mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-white text-sm font-black uppercase tracking-widest">
              Error
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-black mb-3 tracking-tight font-heading">
            Something Went Wrong
          </h2>
          <p className="text-base font-bold text-black/70 leading-relaxed">
            Don&apos;t worry, it&apos;s not you — our code just got a
            little too{" "}
            <span className="bg-[#00bcd4] px-2 py-0.5 text-black border-2 border-black inline-block transform rotate-1">
              lazee
            </span>
            .
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-3 bg-[#ff6b00] text-black border-[3px] border-black px-6 py-4 font-black uppercase text-sm tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-3 bg-white text-black border-[3px] border-black px-6 py-4 font-black uppercase text-sm tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
