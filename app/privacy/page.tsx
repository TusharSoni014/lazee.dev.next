import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, CheckCircle2, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Lazee.dev collects, protects, and handles your personal data.",
};

export default function PrivacyPage() {
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
            <span>Legal Document</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Privacy Policy
          </h1>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal">
            <CalendarDays className="w-4 h-4 text-orange-500 shrink-0" />
            <span>Last Updated: February 28, 2026</span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-500/80">01</span>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Information We Collect
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
              <p>
                To provide our automation services, we collect information you provide directly to us:
              </p>
              <ul className="list-none space-y-2.5 pt-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>Account profile data (Name, contact email, phone number, and professional details).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>Resumes and portfolios uploaded to enable tailored question answering.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>Extension session identifiers for secure autofill sync.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-500/80">02</span>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                How We Use Data
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
              We utilize collected profile data strictly to automate repetitive job application fields, match questions to your experience, and provide context to our AI autofill engine. Your information is never sold to third parties or used for external advertising.
            </p>
          </section>

          {/* Section 3 */}
          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-500/80">03</span>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Data Protection &amp; Security
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
              Security is foundational to our architecture. We implement industry-standard encryption protocols (AES-256) for stored data and TLS 1.3 for all data in transit. Resumes stored in S3 are protected with time-limited signed URLs that expire automatically.
            </p>
          </section>

          {/* Section 4 */}
          <section className="rounded-2xl border border-orange-500/20 bg-orange-500/5 dark:bg-orange-500/10 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-600 dark:text-orange-400">04</span>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Contact Legal
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal mb-6">
              If you have any questions regarding this Privacy Policy or wish to request data deletion, contact our privacy team anytime:
            </p>
            <a
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium shadow-xs shadow-orange-600/20 transition-all active:scale-[0.98]"
              href="mailto:privacy@lazee.dev"
            >
              <Mail className="w-3.5 h-3.5" />
              privacy@lazee.dev
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
