import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Briefcase, Target, Cpu, Heart, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description: "Explore career opportunities at Lazee.dev. We are currently keeping our operations lean and automated.",
};

export default function CareersPage() {
  return (
    <div className="flex flex-1 justify-center py-12 px-4 sm:px-6">
      <div className="max-w-3xl flex-1">
        {/* Back Link */}
        <Link
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-8"
          href="/"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>

        {/* Title Section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 mb-4 shadow-2xs">
            <span>Join the Team</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Careers at Lazee.dev
          </h1>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal">
            <Briefcase className="w-4 h-4 text-orange-500 shrink-0" />
            <span>Current Status: Keeping operations lean and automated</span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Section 1: Hiring Status */}
          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-500/80">01</span>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Current Openings
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 dark:bg-amber-500/15 p-4 text-amber-900 dark:text-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm">
                  We are not actively hiring for open roles right now.
                </p>
              </div>
              <p>
                Since Lazee.dev is built to help developers automate repetitive job applications and save valuable hours, we practice what we preach: keeping our core product highly automated, focused, and run by a small, high-agency team.
              </p>
            </div>
          </section>

          {/* Section 2: Core Values */}
          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-500/80">02</span>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Our Engineering DNA
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
              <p>
                When we do expand the team, these are the traits we value above all else:
              </p>
              <ul className="list-none space-y-3 pt-1">
                <li className="flex items-start gap-3">
                  <div className="size-6 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Target className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">High agency:</strong> Absolute ownership over outcomes, not just task completion.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="size-6 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">Obsessive automation:</strong> A deep-seated aversion to performing repetitive manual workflows.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="size-6 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Heart className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">Developer empathy:</strong> A passion for crafting beautiful, responsive, and tactile software tools.
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
