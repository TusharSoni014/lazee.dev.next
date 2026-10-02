import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Target,
  Cpu,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Terminal,
} from "lucide-react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Careers & Jobs | Lazee.dev",
  description:
    "Explore career opportunities at Lazee.dev. Learn about our engineering DNA, radical automation culture, and how we build.",
};

export default function CareersPage() {
  return (
    <div className="flex flex-1 justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-8 group"
        >
          <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Title Section */}
        <div className="mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-mono font-medium mb-4 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            <span>Opportunities &amp; Culture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4 leading-tight">
            Careers at <span className="text-orange-600 dark:text-orange-500">lazee.dev</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            We build deterministic browser software that helps software engineers eliminate repetitive ATS form-filling. We operate lean, autonomous, and obsessively automated.
          </p>

          <div className="mt-5 inline-flex flex-wrap items-center gap-2.5 px-3 py-1.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-xs font-mono text-zinc-600 dark:text-zinc-400 shadow-2xs">
            <Terminal className="size-3.5 text-orange-600 dark:text-orange-500 shrink-0" />
            <span>Team Status: Keeping operations lean &amp; automated</span>
            <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% Focused</span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Section 1: Hiring Status */}
          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-900 mb-6">
              <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                01
              </span>
              <h2 className="text-lg sm:text-xl font-heading font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Current Openings
              </h2>
            </div>

            <div className="space-y-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.08] dark:bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
                <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-xs sm:text-sm text-amber-900 dark:text-amber-100">
                    We are not actively hiring for open full-time roles right now.
                  </p>
                  <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-normal">
                    We prioritize extreme operational leverage and autonomy over headcount growth.
                  </p>
                </div>
              </div>

              <p>
                Since Lazee.dev exists to help software engineers eliminate tedious application busywork, we practice what we preach: keeping our core product highly automated, focused, and run by a small, high-agency team.
              </p>

              <p>
                Our infrastructure, DOM matching algorithms, and automated pipeline scripts are engineered so a lean team can serve thousands of active engineers effortlessly without corporate bloat.
              </p>
            </div>
          </section>

          {/* Section 2: Engineering DNA */}
          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-900 mb-6">
              <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                02
              </span>
              <h2 className="text-lg sm:text-xl font-heading font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Our Engineering DNA
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              When we expand or collaborate with external contributors, these are the traits we hold sacred:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Value 1 */}
              <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-zinc-900/50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                  <div className="size-7 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center shrink-0">
                    <Target className="size-3.5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold">High Agency</h3>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Absolute ownership over outcomes, not just task completion. You see a bug or UX friction, you ship the fix.
                </p>
              </div>

              {/* Value 2 */}
              <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-zinc-900/50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                  <div className="size-7 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center shrink-0">
                    <Cpu className="size-3.5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold">Obsessive Automation</h3>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  A deep-seated aversion to manual, repetitive workflows. If you do it twice, you write a script for it.
                </p>
              </div>

              {/* Value 3 */}
              <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-zinc-900/50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                  <div className="size-7 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="size-3.5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold">Local-First Security</h3>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  We respect user privacy unconditionally. Keys and sensitive user inputs stay on client devices whenever possible.
                </p>
              </div>

              {/* Value 4 */}
              <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-zinc-900/50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                  <div className="size-7 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center shrink-0">
                    <Sparkles className="size-3.5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold">Tactile Craft</h3>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Developer tools should feel sharp, responsive, and tactile. Micro-interactions and sub-30ms performance matter.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Open Pitch / Pitch Yourself */}
          <section className="rounded-2xl border border-orange-500/30 dark:border-orange-500/20 bg-gradient-to-b from-orange-500/[0.03] to-white dark:to-zinc-950 p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-200/80 dark:border-zinc-800 mb-6">
                <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                  03
                </span>
                <h2 className="text-lg sm:text-xl font-heading font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Pitch Yourself
                </h2>
              </div>

              <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
                <p>
                  Are you an exceptional engineer who has reverse-engineered an ATS portal, built high-performance browser extensions, or have a breakthrough idea that would make Lazee 10x better?
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  We always make time for builders who show proof of work over credentials.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="default" className="text-xs font-semibold gap-2 h-10 px-4">
                  <Link
                    href="https://x.com/tusharsoni014"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaXTwitter className="size-3.5" />
                    <span>DM on X</span>
                    <ExternalLink className="size-3 opacity-70" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="default" className="text-xs font-semibold gap-2 h-10 px-4">
                  <Link
                    href="https://github.com/TusharSoni014/lazee.dev.next"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="size-3.5" />
                    <span>View GitHub</span>
                    <ExternalLink className="size-3 opacity-70" />
                  </Link>
                </Button>

                <Button asChild variant="secondary" size="default" className="text-xs font-semibold gap-2 h-10 px-4">
                  <Link href="/feedback">
                    <MessageSquare className="size-3.5" />
                    <span>Submit Feature Idea</span>
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
