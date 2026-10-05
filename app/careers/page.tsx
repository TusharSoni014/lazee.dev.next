import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Terminal,
  ShieldCheck,
  Target,
  Cpu,
  Activity,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  Code2,
  FileText,
} from "lucide-react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CareerJobListings } from "./CareerJobListings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers & Engineering | Lazee.dev",
  description:
    "Explore career opportunities at Lazee.dev. We build deterministic browser automation tooling for software engineers.",
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
      dbUser?.isAdmin ||
      dbUser?.email?.toLowerCase() === "techandrow@gmail.com",
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
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Hero Section: Authoritative, calm, professional engineering aesthetic */}
        <section className="border-b border-zinc-200/80 dark:border-zinc-800 pb-10 sm:pb-12 lg:pb-14">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono mb-4">
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
              Careers at Lazee
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-zinc-900 dark:text-zinc-200">
                {openCount > 0
                  ? `${openCount} Open ${openCount === 1 ? "Position" : "Positions"}`
                  : "Open to General Applications"}
              </span>
            </span>
            <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">
              •
            </span>
            <span className="text-zinc-500 dark:text-zinc-400 hidden sm:inline">
              Remote-first &amp; Async
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.1] max-w-4xl">
            Engineering deterministic browser software for{" "}
            <span className="text-orange-600 dark:text-orange-500">
              software developers.
            </span>
          </h1>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
            We build the autonomous client-side execution layer that eliminates
            repetitive ATS portal workflows for engineers. We operate lean, ship
            with high conviction, and prioritize technical craft over corporate
            bureaucracy.
          </p>

          {/* Telemetry Grid Ribbon */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-3.5 sm:p-4 shadow-2xs">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Workplace Model
              </span>
              <span className="mt-1 block text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Remote-first (Async default)
              </span>
            </div>

            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-3.5 sm:p-4 shadow-2xs">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Primary Stack
              </span>
              <span className="mt-1 block text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                TypeScript / Next.js / DOM APIs
              </span>
            </div>

            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-3.5 sm:p-4 shadow-2xs">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Compensation
              </span>
              <span className="mt-1 block text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                Competitive Cash + Equity
              </span>
            </div>

            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-3.5 sm:p-4 shadow-2xs">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Engineering Cadence
              </span>
              <span className="mt-1 block text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Daily Ship Cycles • Direct Ownership
              </span>
            </div>
          </div>
        </section>

        {/* 12-Column Responsive Layout: Left = Job Board (7/8 cols), Right = Principles & Contact (5/4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start mt-8 sm:mt-12">
          {/* Main Column: Job Listings */}
          <main className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200/80 dark:border-zinc-800">
              <div>
                <h2 className="text-xl sm:text-2xl font-heading font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                  Open Positions
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Explore active engineering and product roles, or submit a
                  general inquiry.
                </p>
              </div>

              {openCount > 0 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <span>
                    {openCount}{" "}
                    {openCount === 1 ? "Role Available" : "Roles Available"}
                  </span>
                </div>
              )}
            </div>

            {/* Career Listings Client Component */}
            <CareerJobListings initialJobs={serializedJobs} isAdmin={isAdmin} />
          </main>

          {/* Sidebar Column: Engineering Principles & General Application */}
          <aside className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Section: Engineering Principles */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                    How We Build
                  </span>
                </div>
                <Code2 className="size-4 text-zinc-400" />
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
                When evaluating candidates and teammates, we look for these core
                engineering traits:
              </p>

              <div className="space-y-3.5">
                {/* Trait 1 */}
                <div className="group rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/40 p-3 sm:p-3.5 transition-colors hover:border-zinc-200 dark:hover:border-zinc-700">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
                      <Target className="size-3" />
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      01 / High Agency
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-7">
                    Complete end-to-end outcome ownership. When you spot
                    friction or an ATS DOM inconsistency, you prototype the
                    solution and ship the fix.
                  </p>
                </div>

                {/* Trait 2 */}
                <div className="group rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/40 p-3 sm:p-3.5 transition-colors hover:border-zinc-200 dark:hover:border-zinc-700">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
                      <Cpu className="size-3" />
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      02 / Radical Automation
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-7">
                    An aversion to repetitive developer tasks. If a manual
                    process happens twice, we write a script, CLI, or test
                    harness to eliminate it permanently.
                  </p>
                </div>

                {/* Trait 3 */}
                <div className="group rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/40 p-3 sm:p-3.5 transition-colors hover:border-zinc-200 dark:hover:border-zinc-700">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
                      <ShieldCheck className="size-3" />
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      03 / Local-First Privacy
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-7">
                    We architect systems with user privacy as a foundational
                    principle. Sensitive credentials and resume fields stay
                    securely on the user&apos;s machine.
                  </p>
                </div>

                {/* Trait 4 */}
                <div className="group rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/40 p-3 sm:p-3.5 transition-colors hover:border-zinc-200 dark:hover:border-zinc-700">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
                      <Activity className="size-3" />
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      04 / Performance &amp; Stability
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-7">
                    Developer tools must feel instantaneous and reliable. We
                    engineer for sub-30ms interactions, zero layout jank, and
                    minimal memory footprint.
                  </p>
                </div>
              </div>
            </div>

            {/* Section: General Application */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                    GENERAL INQUIRY
                  </span>
                </div>
                <FileText className="size-4 text-zinc-400" />
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                <p>
                  Don&apos;t see an exact opening that matches your background?
                  If you have deep experience reverse-engineering complex web
                  DOMs, building browser extensions, or architecting client-side
                  systems, we want to hear from you.
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  We value verified proof of work, open-source repositories, and
                  demonstrable code craft.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <Button
                  asChild
                  size="default"
                  className="w-full text-xs font-semibold gap-2 h-9"
                >
                  <Link
                    href="https://x.com/tusharsoni014"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaXTwitter className="size-3.5" />
                    <span>Contact Founder on X</span>
                    <ExternalLink className="size-3 opacity-70 ml-auto" />
                  </Link>
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-semibold gap-1.5 h-9"
                  >
                    <Link
                      href="https://github.com/TusharSoni014/lazee.dev.next"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub className="size-3.5" />
                      <span>GitHub</span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs font-semibold gap-1.5 h-9"
                  >
                    <Link href="/feedback">
                      <MessageSquare className="size-3.5" />
                      <span>Feedback</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Hiring Process Card */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 sm:p-5">
              <span className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                Hiring Process
              </span>
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Direct review of code &amp; proof of work</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>30-minute technical architecture conversation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Paid trial sprint with rapid feedback</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
