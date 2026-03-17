"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Search, Zap } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fefaf6] selection:bg-orange-500 selection:text-white overflow-hidden flex items-center justify-center relative">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating decorative elements */}
      <div className="absolute top-[10%] left-[5%] w-16 h-16 bg-[#ffeb3b] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-12 hidden md:block" />
      <div className="absolute top-[20%] right-[8%] w-12 h-12 bg-[#00bcd4] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-6 hidden md:block" />
      <div className="absolute bottom-[15%] left-[10%] w-10 h-10 bg-[#ff80ab] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-45 hidden md:block" />
      <div className="absolute bottom-[25%] right-[5%] w-14 h-14 bg-[#ff6b00] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-12 hidden md:block" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 py-12 max-w-2xl mx-auto">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[10rem] sm:text-[14rem] md:text-[18rem] font-black leading-none text-black uppercase font-heading tracking-tighter select-none">
            4
            <span className="inline-block relative">
              <span className="relative z-10">0</span>
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 bg-[#ff6b00] border-[4px] border-black rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                  <Search className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-black" />
                </div>
              </div>
            </span>
            4
          </h1>
        </div>

        {/* Message Card */}
        <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 mb-8 transform -rotate-1 w-full max-w-lg">
          <div className="inline-block bg-[#ffeb3b] border-[3px] border-black px-4 py-1 mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform rotate-2">
            <span className="text-black text-sm font-black uppercase tracking-widest">
              Oops!
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-black mb-3 tracking-tight font-heading">
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg font-bold text-black/70 leading-relaxed">
            Looks like this page got a little too{" "}
            <span className="bg-[#00bcd4] px-2 py-0.5 text-black border-2 border-black inline-block transform rotate-1">
              lazee
            </span>{" "}
            and disappeared.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-3 bg-[#ff6b00] text-black border-[3px] border-black px-6 py-4 font-black uppercase text-sm tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => router.back()}
            className="flex-1 flex items-center justify-center gap-3 bg-white text-black border-[3px] border-black px-6 py-4 font-black uppercase text-sm tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Lazee branding footer */}
        <div className="mt-12 flex items-center gap-2 opacity-60">
          <div className="size-5 bg-black flex items-center justify-center">
            <Zap className="text-white w-3 h-3 fill-white" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-black">
            Lazee.dev
          </span>
        </div>
      </div>
    </div>
  );
}
