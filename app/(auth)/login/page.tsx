import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Lazee.dev to sync your profile and browser extension.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 w-full min-h-[calc(100dvh-4rem)] bg-zinc-50 dark:bg-zinc-950">
      {/* Left Column: Clean & Minimal Value Proposition (Desktop Only) */}
      <div className="hidden lg:flex flex-col w-1/2 bg-zinc-950 text-white p-12 xl:p-20 relative overflow-hidden border-r border-zinc-200/80 dark:border-zinc-800/80 justify-between">
        {/* Very subtle ambient corner glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(234,88,12,0.06),transparent_50%)] pointer-events-none" />

        {/* Content Block */}
        <div className="relative z-10 max-w-lg">
          <div className="text-xs font-mono uppercase tracking-wider text-orange-500 font-semibold">
            Job Applications, 100x Faster
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl xl:text-5xl font-heading font-bold tracking-tight text-zinc-100 leading-[1.15]">
            Fill applications in seconds,{" "}
            <span className="text-orange-500">not hours.</span>
          </h1>

          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
            Sync your profile once. Lazee automatically maps your engineering background, custom resumes, and project metrics across Greenhouse, Lever, Ashby, and Workday.
          </p>

          <div className="mt-8 space-y-3.5">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="size-5 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                <Check className="size-3" />
              </div>
              <span>1-click autofill across 10+ major hiring platforms</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="size-5 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                <Check className="size-3" />
              </div>
              <span>Multiple tailored resumes and project answers</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="size-5 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                <Check className="size-3" />
              </div>
              <span>Encrypted profile vault with local client-side storage</span>
            </div>
          </div>
        </div>

        {/* Quiet Testimonial */}
        <div className="relative z-10 pt-8 border-t border-zinc-800/80 max-w-lg">
          <p className="text-sm text-zinc-300 leading-relaxed italic">
            &ldquo;Lazee cut down my application time from 25 minutes per job to literally 10 seconds. Landed 4 interviews in my first week.&rdquo;
          </p>
          <div className="mt-3 text-xs text-zinc-400">
            <span className="font-medium text-zinc-200">Alex Chen</span>
            <span className="text-zinc-600 mx-2">•</span>
            <span>Senior Software Engineer</span>
          </div>
        </div>
      </div>

      {/* Right Column: Centered Modern Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-12 px-4 sm:px-8 md:px-12 xl:px-16 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,88,12,0.03),transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
