import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  HeartHandshake,
  Download,
  Mail,
  HelpCircle,
} from "lucide-react";
import { FeedbackForm } from "@/components/feedback-form";
import { CHROME_EXTENSION_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "We Hope to See You Soon | Lazee.dev",
  description:
    "We're sad to see you go. Why did you uninstall our extension? Sharing your valuable feedback might help us improve Lazee.dev.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UninstalledPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Top navigation */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Lazee.dev
        </Link>
      </div>

      {/* Hero Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-medium">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>We&apos;re sorry to see you go</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-outfit">
          I hope we will see you soon
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
          Why did you uninstall our extension? Sharing your valuable feedback
          might help us improve Lazee.dev for you and future job seekers.
        </p>
      </div>

      {/* Reusable Feedback Form Component configured for uninstallation */}
      <FeedbackForm
        isUninstall={true}
        source="uninstalled_page"
        title="Why did you uninstall?"
        subtitle="Sharing your valuable feedback might help us understand what went wrong and build a better tool."
        messageLabel="What could we have done better?"
        messagePlaceholder="Tell us which job board didn't work, what features were missing, or what made you decide to remove the extension..."
        submitButtonText="Send Uninstall Feedback"
        successMessage="Thank you for sharing your valuable feedback! We truly hope to see you again soon."
      />

      {/* Helpful links & reinstallation section */}
      <div className="mt-10 pt-8 border-t border-zinc-200/80 dark:border-zinc-800 grid gap-4 sm:grid-cols-2 text-xs">
        <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/40 p-4 space-y-2">
          <div className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
            <Download className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span>Uninstalled by accident?</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 leading-normal">
            You can reinstall the Lazee.dev extension anytime from the Chrome
            Web Store with one click.
          </p>
          <a
            href={CHROME_EXTENSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-medium hover:underline pt-1"
          >
            Reinstall Extension &rarr;
          </a>
        </div>

        <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/40 p-4 space-y-2">
          <div className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
            <Mail className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span>Need personal assistance?</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 leading-normal">
            Facing account or resume issues? Reach out directly to our team and
            we&apos;ll be glad to help.
          </p>
          <a
            href="mailto:contact@lazee.dev"
            className="inline-flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-medium hover:underline pt-1"
          >
            Contact Support &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
