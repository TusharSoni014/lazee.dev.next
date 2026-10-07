import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  HardDrive,
  KeyRound,
  Lock,
  Mail,
  UserCheck,
  Shield,
  Computer,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Lazee.dev collects, protects, and handles your personal data, including our local-first BYOK privacy architecture.",
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
            <span>Last Updated: October 2026</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            At Lazee.dev, privacy is a fundamental architecture requirement, not
            an afterthought. This Privacy Policy explains how our web
            application and browser extensions collect, process, and safeguard
            your data, including our strict local-first model for Bring Your Own
            Key (BYOK) AI integrations.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-500/80">
                01
              </span>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Information We Collect
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
              <p>
                To provide deterministic form autofill, resume management, and
                application workflows, we collect only the data you explicitly
                provide:
              </p>
              <ul className="list-none space-y-2.5 pt-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-900 dark:text-zinc-200">
                      Account &amp; Profile Data:
                    </strong>{" "}
                    Your name, contact email, phone number, location, work
                    history, education credentials, skills, projects,
                    CTC/compensation preferences, and notice period.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-900 dark:text-zinc-200">
                      Resume &amp; Career Assets:
                    </strong>{" "}
                    PDF resumes uploaded to your account for ATS file-upload
                    matching and automatic profile parsing.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-900 dark:text-zinc-200">
                      Saved Questions &amp; Answers:
                    </strong>{" "}
                    Custom prompt templates and recurring answers you save to
                    your personal Q&amp;A library.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-900 dark:text-zinc-200">
                      Authentication &amp; Session Tokens:
                    </strong>{" "}
                    Cryptographically signed session tokens used solely to
                    synchronize your profile securely between the web platform
                    and your browser extension.
                  </span>
                </li>
              </ul>

              <div className="mt-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50 p-4">
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 flex items-center gap-2">
                  <Computer className="w-4 h-4 text-orange-500" />
                  What We Never Collect or Monitor
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  We never monitor or store your general web browsing history,
                  search engine queries, or non-hiring tab activity. Our
                  extension activates exclusively on supported job boards and
                  forms you choose to interact with.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 - BYOK Architecture (Key highlight) */}
          <section className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent dark:from-orange-500/10 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-600 dark:text-orange-400">
                02
              </span>
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Bring Your Own Key (BYOK) &amp; AI Privacy
                </h2>
              </div>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
              <p>
                Lazee.dev supports Bring Your Own Key (BYOK), enabling you to
                connect your own API keys from providers including{" "}
                <strong className="text-zinc-900 dark:text-zinc-200">
                  OpenAI, Anthropic (Claude), Google Gemini, xAI (Grok)
                </strong>
                , or local OpenAI-compatible models running on your machine (
                <strong className="text-zinc-900 dark:text-zinc-200">
                  Ollama, LM Studio
                </strong>
                ).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                <div className="rounded-xl border border-orange-500/20 bg-white/80 dark:bg-zinc-900/80 p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <HardDrive className="w-4 h-4 text-orange-500" />
                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      Zero Server Key Storage
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    <strong className="text-zinc-800 dark:text-zinc-200">
                      We do not store your API keys on our servers.
                    </strong>{" "}
                    Your keys and custom endpoint URLs reside exclusively in
                    your browser&apos;s sandboxed local extension storage (
                    <code>browser.storage.local</code>). They are never
                    transmitted to, proxied through, or logged by Lazee.dev
                    infrastructure.
                  </p>
                </div>

                <div className="rounded-xl border border-orange-500/20 bg-white/80 dark:bg-zinc-900/80 p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Lock className="w-4 h-4 text-orange-500" />
                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      Direct Browser Inference
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    When you generate answers with BYOK enabled, requests are
                    dispatched directly from your browser extension background
                    service worker to your provider&apos;s API endpoint. Your
                    prompts, resume details, and answers bypass our servers
                    completely.
                  </p>
                </div>

                <div className="rounded-xl border border-orange-500/20 bg-white/80 dark:bg-zinc-900/80 p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Computer className="w-4 h-4 text-orange-500" />
                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      100% Private Local Models
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    When using local endpoints (such as Ollama on{" "}
                    <code>localhost:11434</code> or LM Studio on{" "}
                    <code>localhost:1234</code>), all model inference executes
                    entirely on your hardware. Zero data leaves your computer.
                  </p>
                </div>

                <div className="rounded-xl border border-orange-500/20 bg-white/80 dark:bg-zinc-900/80 p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Shield className="w-4 h-4 text-orange-500" />
                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      Masked Client-Side Bridge
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    When managing providers via the web settings interface, the
                    browser extension only returns masked hints (e.g.,{" "}
                    <code>sk-...1234</code>) to confirm connection status. Your
                    raw secret key is never exposed to the web DOM or backend.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 - Target Job Description Caching */}
          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-500/80">
                03
              </span>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Job Description (JD) Intelligence &amp; Local Storage
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
              <p>
                When you paste a target job posting into the extension modal to
                align AI answers or Cold DMs, the extension preserves context
                using URL-keyed local caching:
              </p>
              <ul className="list-none space-y-2.5 pt-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-900 dark:text-zinc-200">
                      Tracking Parameter Stripping:
                    </strong>{" "}
                    Tracking query parameters (such as UTM parameters, Google
                    Click IDs, and referral tags) are stripped before
                    associating the posting with the canonical job URL.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-900 dark:text-zinc-200">
                      Local Cache Retention:
                    </strong>{" "}
                    Job descriptions are cached strictly within your
                    browser&apos;s local extension storage (retaining up to 100
                    recent postings) so you do not have to re-paste them across
                    multi-page forms.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-900 dark:text-zinc-200">
                      Zero Commercial Harvesting:
                    </strong>{" "}
                    Job descriptions you analyze are never shared with
                    recruiters, employers, or third-party datasets.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-500/80">
                04
              </span>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                How We Use Data
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
              <p>
                We use your stored profile information strictly to fulfill your
                requested actions:
              </p>
              <ul className="list-none space-y-2.5 pt-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-900 dark:text-zinc-200">
                      Form Autofill Automation:
                    </strong>{" "}
                    Mapping your career data (contact details, CTC, experience,
                    education, links) to detected input fields.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-900 dark:text-zinc-200">
                      Lazee AI Answer Synthesis:
                    </strong>{" "}
                    When using default credit-based Lazee AI, relevant profile
                    details and prompt context are sent to our secure enterprise
                    AI inference pipeline to generate tailored application
                    responses. Your data is never used to train foundational AI
                    models.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-900 dark:text-zinc-200">
                      No Data Selling:
                    </strong>{" "}
                    Your personal information is never sold, rented, or licensed
                    to third-party advertisers, recruiters, or data brokers
                    under any circumstances.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5 - Public Profiles */}
          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-500/80">
                05
              </span>
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Public Developer Profiles &amp; Resume Visibility
                </h2>
              </div>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
              <p>
                Lazee.dev offers an optional public developer portfolio feature
                (<code>lazee.dev/u/[username]</code>):
              </p>
              <ul className="list-none space-y-2.5 pt-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-900 dark:text-zinc-200">
                      Opt-in Public Showcase:
                    </strong>{" "}
                    Claiming a username makes only your designated public
                    portfolio items visible (bio, target role, social links,
                    featured projects, and primary resume download).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-900 dark:text-zinc-200">
                      Strictly Private Fields:
                    </strong>{" "}
                    Sensitive details including phone numbers, demographic/equal
                    opportunity data, custom AI notes, and compensation
                    expectations (current/expected CTC) are always kept private
                    and never rendered on public routes.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-900 dark:text-zinc-200">
                      Cloud Resume Delivery:
                    </strong>{" "}
                    Resume PDFs are hosted in secure Cloudflare R2 object
                    storage. Authenticated download links and public portfolio
                    downloads are generated using secure, time-limited presigned
                    URLs.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6 - Security */}
          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-500/80">
                06
              </span>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Data Protection &amp; Security Standards
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
              <p>
                We apply comprehensive technical safeguards across our platform
                and extension:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 p-4">
                  <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    Encryption Standards
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    All data in transit is encrypted using TLS 1.3. Profile
                    records, database backups, and stored assets are protected
                    with AES-256 encryption at rest.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 p-4">
                  <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    Extension Isolation &amp; Controls
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    The extension includes an automatic non-job board blocklist
                    and a manual per-domain toggle switch, allowing you to
                    disable extension triggers on any domain at will.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7 - Third-Party Subprocessors */}
          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-500/80">
                07
              </span>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Third-Party Services &amp; Subprocessors
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
              <p>
                We partner with reputable infrastructure providers to deliver
                our services:
              </p>
              <ul className="list-none space-y-2 pt-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Authentication:</strong> Google OAuth and
                    NextAuth.js for secure single sign-on authentication.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Cloud Hosting &amp; Storage:</strong> Vercel (web
                    hosting), PostgreSQL (managed database), and Cloudflare R2
                    (S3-compatible resume storage).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Billing &amp; Payments:</strong> Dodo Payments
                    processes subscription checkouts as Merchant of Record.
                    Lazee.dev does not store your credit card or banking
                    details.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>AI Model Providers:</strong> When using Lazee AI
                    credits, requests are processed under zero-data-retention
                    agreements. When using BYOK, your requests are governed
                    directly by your agreement with your chosen AI provider.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 8 - User Rights & Data Deletion */}
          <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-500/80">
                08
              </span>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Your Rights &amp; Data Control
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
              <p>You retain complete ownership of your personal information:</p>
              <ul className="list-none space-y-2 pt-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Edit or Export:</strong> Update your profile data,
                    delete resumes, or modify saved questions anytime on your
                    dashboard.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Purge BYOK Keys:</strong> Remove any configured AI
                    provider key directly in your extension or web AI settings
                    to instantly delete it from local device storage.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Account Deletion:</strong> Request permanent
                    deletion of your account, resumes, and associated records by
                    contacting privacy support.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 9 - Contact */}
          <section className="rounded-2xl border border-orange-500/20 bg-orange-500/5 dark:bg-orange-500/10 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-mono font-semibold text-orange-600 dark:text-orange-400">
                09
              </span>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Contact Legal &amp; Privacy Team
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal mb-6">
              If you have any questions regarding this Privacy Policy, our BYOK
              architecture, or wish to request data deletion, contact our
              privacy team anytime:
            </p>
            <a
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium shadow-xs shadow-orange-600/20 transition-all active:scale-[0.98]"
              href="mailto:privacy@lazee.dev"
            >
              <Mail className="w-3.5 h-3.5" />
              dm@tusharsoni.com
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
