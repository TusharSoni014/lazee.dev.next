"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="relative py-20 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white font-sans selection:bg-purple-500 selection:text-white dark:bg-black">
      <main className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6 text-center sm:px-16">
        <div className="mb-8 flex items-center justify-center animate-fade-in-down">
          <div className="relative h-24 w-24 overflow-hidden rounded-2xl shadow-xl shadow-purple-500/10 transition-transform hover:scale-105">
            <Image
              src="/logo.png"
              alt="Lazee.dev logo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 animate-fade-in-up">
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl dark:text-white">
            Job Applications,{" "}
            <span className="bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              100x Faster.
            </span>
          </h1>

          <p className="max-w-2xl text-lg font-medium leading-relaxed text-slate-600 sm:text-xl dark:text-slate-400">
            Lazee.dev is the browser extension that fills your job applications
            automatically with AI.
            <br className="hidden sm:block" />
            Stop copying and pasting. Start applying. It&apos;s free*.
          </p>

          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row">
            <button className="group relative rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-700 hover:shadow-lg dark:bg-white dark:text-black dark:hover:bg-slate-200">
              <span className="relative z-10">Add to Chrome</span>
              <div className="absolute inset-0 -z-10 rounded-full bg-linear-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity blur-md group-hover:opacity-50" />
            </button>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-6 sm:grid-cols-3 w-full animate-fade-in-up [animation-delay:500ms]">
          <div className="group rounded-3xl border border-slate-200 bg-white/50 p-8 text-left backdrop-blur-sm transition-all hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 dark:border-slate-800 dark:bg-white/5 dark:hover:border-purple-400/50">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
              Lightning Fast
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Fill complex forms in seconds. Lazee.dev detects fields and
              autofills them intelligently.
            </p>
          </div>

          <div className="group rounded-3xl border border-slate-200 bg-white/50 p-8 text-left backdrop-blur-sm transition-all hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/10 dark:border-slate-800 dark:bg-white/5 dark:hover:border-pink-400/50">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
              AI Powered
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Generates custom cover letters and answers specific questions
              based on your resume.
            </p>
          </div>

          <div className="group rounded-3xl border border-slate-200 bg-white/50 p-8 text-left backdrop-blur-sm transition-all hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 dark:border-slate-800 dark:bg-white/5 dark:hover:border-blue-400/50">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
              One Membership
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              One resume details for all your job forms. Stop repetitive data
              entry forever.
            </p>
          </div>
        </div>
      </main>

      <footer className="text-sm pt-20 text-slate-400 dark:text-slate-600">
        <p>© 2026 Lazee.dev. *Terms and conditions apply.</p>
      </footer>
    </div>
  );
}
