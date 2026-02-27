"use client";

import { EarlyAccessForm } from "@/components/early-access-form";
import { HeroDemo } from "@/components/hero-demo";

export default function Home() {
  return (
    <div className="relative py-20 flex min-h-screen flex-col items-center overflow-hidden bg-[#fefaf6] selection:bg-orange-500 selection:text-white">
      {/* Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.1]"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <main className="relative z-10 flex w-full max-w-6xl flex-col items-center px-4 sm:px-8 pt-6 lg:pt-12">
        {/* 2-Column Hero Section */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 mb-16 mt-8">
          {/* Left Text Column */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 animate-fade-in-up">
            <h1 className="max-w-xl text-4xl font-extrabold tracking-tight text-black sm:text-5xl md:text-5xl leading-[1.15]">
              Job Applications, <br />
              <span className="text-orange-500 underline decoration-[3px] underline-offset-4 sm:decoration-[4px] sm:underline-offset-8 text-[1.05em]">
                100x Faster.
              </span>
            </h1>

            <p className="max-w-lg text-base font-semibold leading-relaxed text-zinc-700 sm:text-lg tracking-tight">
              Lazee.dev is the browser extension that fills your job
              applications automatically with AI.
            </p>
          </div>

          {/* Right Demo Column */}
          <div className="flex-1 w-full max-w-md lg:max-w-full flex justify-center lg:justify-end animate-fade-in-up [animation-delay:200ms]">
            <HeroDemo />
          </div>
        </div>

        {/* Early Access Section */}
        <div className="flex flex-col items-center gap-6 w-full max-w-md mt-10 mb-16 animate-fade-in-up [animation-delay:400ms]">
          <div className="flex flex-col items-center text-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-black uppercase tracking-widest bg-yellow-300 px-4 py-1 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-2">
              Coming soon
            </span>
            <p className="text-sm sm:text-base font-bold text-zinc-700 tracking-tight mt-2">
              Follow{" "}
              <a
                href="https://twitter.com/tusharsoni014"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 underline decoration-2 underline-offset-4"
              >
                @tusharsoni014
              </a>{" "}
              on Twitter for dev log updates.
            </p>
          </div>

          <EarlyAccessForm />
        </div>

        {/* Features Section */}
        <div className="w-full grid grid-cols-1 gap-6 animate-fade-in-up [animation-delay:600ms] md:grid-cols-3 md:gap-8">
          {[
            {
              title: "LIGHTNING FAST",
              desc: "Fill complex forms in seconds. Lazee.dev detects fields and autofills them intelligently.",
              bg: "bg-blue-400",
              icon: (
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              ),
            },
            {
              title: "AI POWERED",
              desc: "Generates custom cover letters and answers specific questions based on your resume.",
              bg: "bg-yellow-400",
              icon: (
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
            {
              title: "ONE MEMBERSHIP",
              desc: "One resume details for all your job forms. Stop repetitive data entry forever.",
              bg: "bg-pink-400",
              icon: (
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              ),
            },
          ].map((feature, i) => (
            <div
              key={i}
              className={`group relative flex flex-col items-center text-center h-full border-[3px] border-black ${feature.bg} p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:scale-[1.02] sm:p-8 sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]`}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-lg font-black text-black font-heading leading-none sm:text-xl uppercase tracking-tighter w-full break-words">
                {feature.title}
              </h3>
              <p className="text-black font-bold text-xs leading-relaxed tracking-tight sm:text-sm max-w-[250px]">
                {feature.desc}
              </p>

              <div className="mt-auto pt-6 opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-[10px] font-black tracking-[0.2em] uppercase pt-24 pb-8 text-black/40">
        <p>© 2026 Lazee.dev. *TERMS AND CONDITIONS APPLY.</p>
      </footer>
    </div>
  );
}
