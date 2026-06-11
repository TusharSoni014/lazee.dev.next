import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Briefcase, Sparkles, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description: "Explore career opportunities at Lazee.dev. We are currently keeping our operations lean and automated.",
};

export default function CareersPage() {
  return (
    <div className="flex flex-1 justify-center py-12 px-6">
      <div className="max-w-[800px] flex-1">
        {/* Back Link */}
        <Link
          className="inline-flex items-center gap-2 text-[#f26c0d] font-bold uppercase text-sm mb-8 group"
          href="/"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Title Section */}
        <div className="mb-12">
          <div className="inline-block bg-[#f26c0d] px-4 py-1 border-2 border-black shadow-[4px_4px_0px_0px_#000000] mb-4">
            <p className="text-white text-xs font-black uppercase tracking-widest">
              Join the Team
            </p>
          </div>
          <h1 className="text-6xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-4 italic text-slate-900 dark:text-slate-100">
            Careers <br />
            <span className="text-[#f26c0d]">at Lazee.dev</span>
          </h1>
          <div className="flex items-center gap-4 border-t-2 border-black pt-4">
            <Briefcase className="w-6 h-6 text-[#f26c0d]" />
            <p className="font-bold text-slate-600 dark:text-slate-400 uppercase text-sm">
              Current Status: Keeping it Lean & Automated
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Section 1: Hiring Status */}
          <section className="border-2 border-black bg-white dark:bg-slate-900 p-8 shadow-[4px_4px_0px_0px_#000000]">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl font-black text-[#f26c0d]/30">01</span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
                Current Openings
              </h2>
            </div>
            <div className="space-y-4 text-lg leading-relaxed font-bold text-slate-900 dark:text-slate-100">
              <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-500 p-4 mb-4">
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-base text-amber-900 dark:text-amber-200">
                  We aren't looking for job roles right now.
                </p>
              </div>
              <p>
                Since Lazee.dev is built to help developers automate repetitive job applications and save valuable hours, we practice exactly what we preach: keeping our operations highly automated, extremely focused, and run by a tight-knit core group.
              </p>
            </div>
          </section>

          {/* Section 2: Core Values */}
          <section className="border-2 border-black bg-white dark:bg-slate-900 p-8 shadow-[4px_4px_0px_0px_#000000]">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl font-black text-[#f26c0d]/30">02</span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
                Our Engineering DNA
              </h2>
            </div>
            <div className="space-y-4 text-lg leading-relaxed font-bold text-slate-900 dark:text-slate-100">
              <p>
                When we do expand the team, these are the traits we value above all else:
              </p>
              <ul className="list-none space-y-3">
                <li className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-[#f26c0d] shrink-0" />
                  <span><strong>High agency:</strong> Absolute ownership over outcomes, not just output.</span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-[#f26c0d] shrink-0" />
                  <span><strong>Obsessive automation:</strong> A deep-seated aversion to doing the same manual task twice.</span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-[#f26c0d] shrink-0" />
                  <span><strong>Developer empathy:</strong> A passion for crafting beautiful, responsive, and reliable tools.</span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
