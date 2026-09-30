import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FeedbackForm } from "@/components/feedback-form";

export const metadata: Metadata = {
  title: "Share Feedback",
  description:
    "Help us improve Lazee.dev. Share your ideas, feature requests, bug reports, and thoughts with our team.",
};

export default function FeedbackPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>
      </div>

      <FeedbackForm />
    </div>
  );
}
