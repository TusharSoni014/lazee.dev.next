"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  Mail,
  Gift,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const urlParams = new URLSearchParams(window.location.search);
      const extensionId = urlParams.get("extensionId");
      if (extensionId) {
        router.replace(`/?extensionId=${extensionId}&logged_in=true`);
        return;
      }
      const callbackUrl = urlParams.get("callbackUrl");
      if (callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) {
        router.replace(callbackUrl);
        return;
      }
      router.replace("/profile");
    }
  }, [status, session, router]);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsEmailLoading(true);

    const urlParams = new URLSearchParams(window.location.search);
    const extensionId = urlParams.get("extensionId");
    const callbackUrl = extensionId
      ? `/?extensionId=${extensionId}&logged_in=true`
      : "/?logged_in=true";

    try {
      const result = await signIn("nodemailer", {
        email,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        setIsSent(true);
        toast.success("Magic link sent!");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const extensionId = urlParams.get("extensionId");
    const callbackUrl = extensionId
      ? `/?extensionId=${extensionId}&logged_in=true`
      : "/?logged_in=true";
    try {
      await signIn("google", { callbackUrl });
    } catch {
      toast.error("Failed to sign in with Google");
      setIsGoogleLoading(false);
    }
  };

  if (status === "authenticated") {
    return (
      <div className="w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xl shadow-zinc-950/5 dark:shadow-black/20 p-8 flex flex-col items-center justify-center min-h-[280px]">
        <Loader2 className="size-6 animate-spin text-orange-600 mb-3" />
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Already signed in. Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xl shadow-zinc-950/5 dark:shadow-black/20 p-6 sm:p-8 backdrop-blur-sm">
      {/* Top Header */}
      <div className="flex flex-col mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-5 group w-fit"
        >
          <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to home</span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white">
          Welcome back
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 font-sans">
          Sign in to sync your profile and browser extension.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSent ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5"
          >
            {/* Google OAuth Button */}
            <Button
              id="google-login-btn"
              type="button"
              variant="outline"
              size="lg"
              onClick={handleGoogleLogin}
              disabled={isEmailLoading || isGoogleLoading}
              className="w-full h-11 sm:h-12 gap-3"
            >
              {isGoogleLoading ? (
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <Loader2 className="size-4 animate-spin" />
                  <span>Connecting to Google...</span>
                </div>
              ) : (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </Button>

            {/* Hairline Divider */}
            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-zinc-200 dark:border-zinc-800" />
              <span className="shrink-0 mx-3 text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                or continue with email
              </span>
              <div className="grow border-t border-zinc-200 dark:border-zinc-800" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 font-mono"
                >
                  Magic Link Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Mail className="size-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    disabled={isEmailLoading || isGoogleLoading}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 bg-zinc-50/60 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 text-sm font-medium transition-all focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                {email &&
                  isEmailValid &&
                  !email.toLowerCase().endsWith("@gmail.com") && (
                    <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-700 dark:text-orange-400 text-xs">
                      <Gift className="size-3.5 shrink-0 mt-0.5" />
                      <span>
                        Note: Only @gmail.com accounts are eligible for free
                        signup credits.
                      </span>
                    </div>
                  )}
              </div>

              {/* Submit Button */}
              <Button
                id="send-magic-link-btn"
                type="submit"
                size="lg"
                disabled={isEmailLoading || isGoogleLoading || !isEmailValid}
                className="group w-full"
              >
                {isEmailLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin text-white" />
                    <span>Sending magic link...</span>
                  </div>
                ) : (
                  <>
                    <span>Send Magic Link</span>
                    <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Terms and Privacy Policy Note */}
            <div className="text-center pt-2">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                By logging in, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-zinc-700 dark:text-zinc-300 underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-zinc-700 dark:text-zinc-300 underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center text-center py-2"
          >
            <div className="flex items-center justify-center size-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 mb-4">
              <Mail className="size-6" />
            </div>
            <h3 className="text-xl font-heading font-bold text-zinc-900 dark:text-white">
              Check your inbox
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed max-w-xs font-sans">
              We sent a temporary magic link to:
            </p>
            <div className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 break-all">
              {email}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 max-w-xs font-sans">
              Click the link in the email to log in instantly. It expires in 10
              minutes.
            </p>

            <button
              type="button"
              onClick={() => {
                setIsSent(false);
                setEmail("");
              }}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4 cursor-pointer transition-colors"
            >
              <ArrowLeft className="size-3" />
              <span>Use a different email</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Guarantee Note */}
      <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
        <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>Client-side encrypted profile</span>
      </div>
    </div>
  );
}
