import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Read the terms and conditions governing the use of Lazee.dev.",
};

export default function TermsPage() {
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
            <span>Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal">
            Last Updated: February 2026
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-500/80">01</span>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Acceptance of Terms
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
              <p>
                By accessing or using Lazee.dev, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, you must discontinue using our services.
              </p>
              <p>
                We reserve the right to revise these terms to reflect feature updates, legal requirements, or platform modifications. Continued use after changes indicates acceptance.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-500/80">02</span>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                User Accounts &amp; Security
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
              <p>
                When creating an account on Lazee.dev, you are responsible for maintaining confidentiality of your credentials and all actions taken under your account:
              </p>
              <ul className="list-none space-y-2 pt-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>Keeping your authentication tokens and login passwords secure.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>Ensuring submitted information is truthful and accurately represents your experience.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>Notifying support immediately upon discovering any unauthorized account usage.</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-500/80">03</span>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Platform Integration &amp; Extension Usage
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
              <p>
                Our Chrome and Firefox browser extensions interact with supported ATS job boards (Workday, Greenhouse, Lever, Ashby, and others) on your behalf to assist with application form filling:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 p-4">
                  <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Permissions</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
                    The extension accesses web pages strictly within your active browser tabs to detect input fields and fill them with your saved profile data.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 p-4">
                  <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Updates</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
                    Browser extensions update automatically through official web stores to patch ATS layout shifts and guarantee system reliability.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-500/80">04</span>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Pro Subscription &amp; Credits
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
              <p>
                Certain AI capabilities and advanced multi-resume features require a Pro Subscription or individual credit packs:
              </p>
              <ul className="list-none space-y-2 pt-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span><strong>Billing:</strong> Subscriptions are processed securely via our merchant of record (Dodo Payments) and recur monthly or annually.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span><strong>Refunds:</strong> Credits and active billing cycles are generally non-refundable once consumed, except where mandated by local consumer regulations.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span><strong>Fair Use:</strong> Pro plans include generous limits designed for active job search workflows while preventing automated abuse.</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-500/80">05</span>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Termination &amp; Inquiries
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
              We may suspend accounts that engage in fraudulent activity or abuse API boundaries. You may terminate your account at any time by requesting deletion through support at <a href="mailto:support@lazee.dev" className="text-orange-600 dark:text-orange-400 hover:underline">support@lazee.dev</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
