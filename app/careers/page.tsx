import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Terminal,
  ShieldCheck,
  Zap,
  Target,
  Cpu,
  Sparkles,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  Code2,
} from "lucide-react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CareerJobListings } from "./CareerJobListings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers & Engineering Culture | Lazee.dev",
  description:
    "Explore career opportunities at Lazee.dev. We are building the deterministic browser automation layer for software engineers.",
};

export default async function CareersPage() {
  const session = await auth();

  // Strict Admin Verification
  let isAdmin = false;
  if (session?.user?.email?.toLowerCase() === "techandrow@gmail.com") {
    isAdmin = true;
  } else if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true, email: true },
    });
    isAdmin = Boolean(
      dbUser?.isAdmin || dbUser?.email?.toLowerCase() === "techandrow@gmail.com"
    );
  }

  // Fetch jobs: Admin sees all jobs; public visitors see only open jobs
  const jobs = await prisma.job.findMany({
    where: isAdmin ? undefined : { isOpen: true },
    orderBy: { createdAt: "desc" },
  });

  const serializedJobs = jobs.map((job) => ({
    ...job,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  }));

  const openCount = jobs.filter((j) => j.isOpen).length;

  return (
    <div className="min-h-[100dvh] w-full py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>lazee.dev // index</span>
          </Link>
        </div>

        {/* Hero Section: Left-aligned, high-agency engineering aesthetic */}
        <section className="border-b border-zinc-200/80 dark:border-zinc-800 pb-10 sm:pb-12 lg:pb-14">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono mb-4">
            <span className="px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-semibold tracking-wide">
              SYSTEM.CAREERS
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-zinc-900 dark:text-zinc-200">
                {openCount > 0 ? `${openCount} Open ${openCount === 1 ? "Role" : "Roles"}` : "Direct Open Pitch"}
              </span>
            </span>
            <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
            <span className="text-zinc-500 dark:text-zinc-400 hidden sm:inline">100% Remote &amp; Async</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.1] max-w-4xl">
            Build deterministic browser software for engineers who{" "}
            <span className="text-orange-600 dark:text-orange-500">hate grunt work.</span>
          </h1>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
            We are building the autonomous browser execution layer that eliminates repetitive ATS portal friction for software developers. We ship fast, operate lean, and favor high-agency builders over traditional credentials.
          </p>

          {/* Telemetry Grid Ribbon */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-3 sm:p-4 shadow-2xs">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Execution Model
              </span>
              <span className="mt-1 block text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                100% Async &amp; Remote
              </span>
            </div>

            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-3 sm:p-4 shadow-2xs">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Core Stack
              </span>
              <span className="mt-1 block text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Next.js / TS / DOM
              </span>
            </div>

            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-3 sm:p-4 shadow-2xs">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Reward
              </span>
              <span className="mt-1 block text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                Top Cash + Equity
              </span>
            </div>

            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-3 sm:p-4 shadow-2xs">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Engineering Cadence
              </span>
              <span className="mt-1 block text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Ship Daily • Zero Red Tape
              </span>
            </div>
          </div>
        </section>

        {/* 12-Column Responsive Layout: Left = Job Board (7/8 cols), Right = DNA & Pitch (5/4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start mt-8 sm:mt-12">
          {/* Main Column: Job Listings */}
          <main className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200/80 dark:border-zinc-800">
              <div>
                <h2 className="text-xl sm:text-2xl font-heading font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                  Open Opportunities
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Browse our active openings or propose your own custom role.
                </p>
              </div>

              {openCount > 0 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{openCount} {openCount === 1 ? "Role Available" : "Roles Available"}</span>
                </div>
              )}
            </div>

            {/* Career Listings Client Component */}
            <CareerJobListings initialJobs={serializedJobs} isAdmin={isAdmin} />
          </main>

          {/* Sidebar Column: Engineering DNA & Pitch Yourself (Sticky on desktop) */}
          <aside className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Section: Engineering DNA Manifesto */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-orange-600 dark:text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                    MANIFESTO
                  </span>
                  <h3 className="text-sm sm:text-base font-heading font-bold text-zinc-900 dark:text-zinc-100">
                    Our Engineering DNA
                  </h3>
                </div>
                <Code2 className="size-4 text-zinc-400" />
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
                When we expand or collaborate with builders, these are the non-negotiable traits we hold sacred:
              </p>

              <div className="space-y-3.5">
                {/* Trait 1 */}
                <div className="group rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/40 p-3 sm:p-3.5 transition-colors hover:border-zinc-200 dark:hover:border-zinc-700">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                      <Target className="size-3" />
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      01 / High Agency
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-7">
                    Absolute ownership over outcomes. If you notice friction or a broken DOM parser, you ship the fix without waiting for committee approval.
                  </p>
                </div>

                {/* Trait 2 */}
                <div className="group rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/40 p-3 sm:p-3.5 transition-colors hover:border-zinc-200 dark:hover:border-zinc-700">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                      <Cpu className="size-3" />
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      02 / Obsessive Automation
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-7">
                    A deep aversion to manual repetition. If you have to perform any developer action twice, you script or automate it away forever.
                  </p>
                </div>

                {/* Trait 3 */}
                <div className="group rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/40 p-3 sm:p-3.5 transition-colors hover:border-zinc-200 dark:hover:border-zinc-700">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="size-3" />
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      03 / Local-First Privacy
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-7">
                    We unconditionally protect user data. Profile keys, resumes, and sensitive form inputs execute on-device whenever possible.
                  </p>
                </div>

                {/* Trait 4 */}
                <div className="group rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/40 p-3 sm:p-3.5 transition-colors hover:border-zinc-200 dark:hover:border-zinc-700">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                      <Sparkles className="size-3" />
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      04 / Tactile Sub-30ms UX
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-7">
                    Developer tools must feel responsive, sharp, and physically weighted. Zero layout shifting, low CPU drag, and instant keyboard feel.
                  </p>
                </div>
              </div>
            </div>

            {/* Section: Pitch Yourself (Open Application) */}
            <div className="rounded-2xl border border-orange-500/30 dark:border-orange-500/25 bg-gradient-to-b from-orange-500/[0.04] to-transparent dark:from-orange-500/[0.06] p-5 sm:p-6 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between pb-3.5 border-b border-zinc-200/80 dark:border-zinc-800 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-orange-600 dark:text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                    WILDCARD
                  </span>
                  <h3 className="text-sm sm:text-base font-heading font-bold text-zinc-950 dark:text-zinc-50">
                    Pitch Your Own Role
                  </h3>
                </div>
                <Zap className="size-4 text-orange-500" />
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                <p>
                  Have you reverse-engineered Workday or Greenhouse DOMs, built viral Chrome extensions, or have a breakthrough feature idea that makes Lazee 10x faster?
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  We care about verified proof-of-work, open-source commits, and clean architecture over academic pedigrees.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <Button asChild size="default" className="w-full text-xs font-semibold gap-2 h-9">
                  <Link
                    href="https://x.com/tusharsoni014"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaXTwitter className="size-3.5" />
                    <span>DM Founder on X</span>
                    <ExternalLink className="size-3 opacity-70 ml-auto" />
                  </Link>
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold gap-1.5 h-9">
                    <Link
                      href="https://github.com/TusharSoni014/lazee.dev.next"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub className="size-3.5" />
                      <span>GitHub</span>
                    </Link>
                  </Button>

                  <Button asChild variant="secondary" size="sm" className="w-full text-xs font-semibold gap-1.5 h-9">
                    <Link href="/feedback">
                      <MessageSquare className="size-3.5" />
                      <span>Ideas</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Hiring Process Card */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 sm:p-5">
              <span className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                Hiring Velocity
              </span>
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>No LeetCode brain teasers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>30-minute founder architecture sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Paid trial sprint &amp; 48-hour decision</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
