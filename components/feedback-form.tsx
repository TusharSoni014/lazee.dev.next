"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import {
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  Download,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { CHROME_EXTENSION_URL } from "@/lib/constants";

export interface FeedbackTypeOption {
  value: string;
  label: string;
}

export const DEFAULT_FEEDBACK_TYPES: FeedbackTypeOption[] = [
  { value: "feature", label: "Feature Request" },
  { value: "bug", label: "Bug Report" },
  { value: "add_ats", label: "Add ATS Support" },
  { value: "appreciation", label: "Appreciation" },
  { value: "other", label: "Other" },
];

export const UNINSTALL_FEEDBACK_TYPES: FeedbackTypeOption[] = [
  { value: "sites_not_working", label: "Didn't work on the job sites I use" },
  { value: "incorrect_autofill", label: "Filled form inputs incorrectly" },
  { value: "missing_features", label: "Missing features I needed" },
  { value: "hard_to_use", label: "Too complicated / hard to use" },
  { value: "no_longer_needed", label: "Found a job / no longer applying" },
  { value: "privacy_concerns", label: "Privacy or permission concerns" },
  { value: "found_alternative", label: "Switched to another tool" },
  { value: "other", label: "Other reason" },
];

export interface FeedbackFormProps {
  /** Initial selected feedback type value */
  defaultType?: string;
  /** Custom feedback types array */
  types?: FeedbackTypeOption[];
  /** Card header title */
  title?: string;
  /** Card header subtitle */
  subtitle?: string;
  /** Custom icon for the header */
  icon?: React.ReactNode;
  /** Label for the message field */
  messageLabel?: string;
  /** Placeholder for the message textarea */
  messagePlaceholder?: string;
  /** Submit button text */
  submitButtonText?: string;
  /** Custom success message */
  successMessage?: string;
  /** Source tag passed to /api/feedback (e.g., "uninstalled_page", "feedback_page") */
  source?: string;
  /** Whether the context is an uninstalled extension flow */
  isUninstall?: boolean;
  /** Hide the card container if embedded inside another card */
  embedded?: boolean;
  /** Callback fired after successful submission */
  onSuccess?: () => void;
  /** Additional custom class names for the outer card */
  className?: string;
}

export function FeedbackForm({
  defaultType,
  types,
  title,
  subtitle,
  icon,
  messageLabel,
  messagePlaceholder,
  submitButtonText,
  successMessage,
  source,
  isUninstall = false,
  embedded = false,
  onSuccess,
  className = "",
}: FeedbackFormProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const availableTypes =
    types || (isUninstall ? UNINSTALL_FEEDBACK_TYPES : DEFAULT_FEEDBACK_TYPES);
  const initialType =
    defaultType ||
    (isUninstall ? "sites_not_working" : availableTypes[0]?.value || "feature");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: initialType,
    message: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || session.user?.name || "",
        email: prev.email || session.user?.email || "",
      }));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      toast.error("Please enter a message before submitting.");
      return;
    }

    setLoading(true);

    try {
      // Find the label for human-readable Notion/email logging
      const selectedOption = availableTypes.find(
        (t) => t.value === formData.type,
      );
      const formattedType = isUninstall
        ? `Uninstall - ${selectedOption?.label || formData.type}`
        : selectedOption?.value || formData.type;

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        type: formattedType,
        message: formData.message.trim(),
        source: source || (isUninstall ? "uninstalled_page" : "feedback_page"),
      };

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          successMessage ||
            (isUninstall
              ? "Thank you for your valuable feedback! We hope to see you again soon."
              : "Feedback submitted successfully! Thank you."),
        );
        setSubmitted(true);
        if (onSuccess) onSuccess();
      } else {
        toast.error(data.error || "Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      type: initialType,
      message: "",
    });
    setSubmitted(false);
  };

  const cardContent = (
    <>
      {/* Header section (if title or subtitle or icon provided) */}
      {(title || subtitle || icon || !embedded) && (
        <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="size-11 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center shrink-0 shadow-2xs">
            {icon || <MessageSquare className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {title || (isUninstall ? "Why did you uninstall?" : "Share Feedback")}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal mt-0.5">
              {subtitle ||
                (isUninstall
                  ? "Sharing your valuable feedback might help us improve Lazee.dev"
                  : "Help us improve Lazee.dev for thousands of job seekers")}
            </p>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="py-8 text-center space-y-5"
          >
            <div className="size-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Thank you for your feedback!
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isUninstall
                  ? "We're sorry to see you go and appreciate your honesty. Your feedback directly shapes our future updates. We truly hope we'll see you soon!"
                  : "We've received your note and our team will review it shortly. Thanks for helping us make Lazee.dev better."}
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              {isUninstall && (
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a
                    href={CHROME_EXTENSION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4" />
                    Reinstall Extension
                  </a>
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full sm:w-auto rounded-xl border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Submit Another Note
              </Button>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Return to Home
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="feedback-name"
                  className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Your Name <span className="text-zinc-400 font-normal">(optional)</span>
                </Label>
                <Input
                  id="feedback-name"
                  placeholder="Alex Morgan"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 focus:border-orange-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="feedback-email"
                  className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Email Address <span className="text-zinc-400 font-normal">(optional)</span>
                </Label>
                <Input
                  id="feedback-email"
                  type="email"
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="feedback-type"
                className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                {isUninstall ? "Primary Reason for Uninstalling" : "Feedback Type"}
              </Label>
              <Select
                value={formData.type}
                onValueChange={(val) => setFormData({ ...formData, type: val })}
              >
                <SelectTrigger id="feedback-type" className="rounded-xl">
                  <SelectValue placeholder="Select a reason / category" />
                </SelectTrigger>
                <SelectContent>
                  {availableTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="feedback-message"
                className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                {messageLabel ||
                  (isUninstall
                    ? "What could we have done better?"
                    : "Your Message")}
              </Label>
              <Textarea
                id="feedback-message"
                required
                placeholder={
                  messagePlaceholder ||
                  (isUninstall
                    ? "Please tell us what went wrong, which website didn't work, or what features you were looking for..."
                    : "What can we improve, add, or fix? Be as specific as you like...")
                }
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="min-h-[160px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 p-3.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-2xs transition-colors"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending feedback...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {submitButtonText ||
                      (isUninstall ? "Submit Feedback" : "Submit Feedback")}
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </>
  );

  if (embedded) {
    return <div className={`w-full ${className}`}>{cardContent}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-10 shadow-xs backdrop-blur-xs ${className}`}
    >
      {cardContent}
    </motion.div>
  );
}
