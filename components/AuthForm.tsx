"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn("nodemailer", {
        email,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        setIsSent(true);
        toast.success("Magic link sent!");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      toast.error("Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full font-heading">
      <div className="flex flex-col gap-2">
        <h2 className="text-[#1c130d] dark:text-white text-4xl font-black tracking-tight uppercase lg:hidden">
          Welcome Back
        </h2>
        <h2 className="text-[#1c130d] dark:text-white text-3xl font-black tracking-tight hidden lg:block uppercase font-heading">
          Log in to your account
        </h2>
        <p className="text-slate-600 dark:text-slate-400 font-medium font-sans">
          Enter your details to access your dashboard.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSent ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 bg-white dark:bg-slate-800 text-[#1c130d] dark:text-white h-16 px-6 border-[3px] border-black hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-[5px_5px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[3px_3px_0px_0px_#000000]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
              <span className="text-lg font-black uppercase tracking-tight">
                Login with Google
              </span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="grow h-[3px] bg-black dark:bg-slate-700"></div>
              <span className="shrink-0 mx-4 text-black dark:text-white font-black text-sm uppercase tracking-widest">
                Or with email
              </span>
              <div className="grow h-[3px] bg-black dark:bg-slate-700"></div>
            </div>

            <form onSubmit={handleEmailLogin} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-[#1c130d] dark:text-slate-200 text-sm font-black uppercase tracking-wide"
                >
                  Magic Link Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 px-4 bg-white dark:bg-slate-800 text-[#1c130d] dark:text-white border-[3px] border-black focus:outline-none focus:border-black placeholder:text-slate-400 text-lg font-medium transition-all rounded-none shadow-[4px_4px_0px_0px_#000000] focus:shadow-[6px_6px_0px_0px_#f26c0d]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group flex items-center justify-center gap-2 w-full h-16 bg-[#f26c0d] text-[#1c130d] transition-all cursor-pointer border-[3px] border-black shadow-[5px_5px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[3px_3px_0px_0px_#000000] disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-black" />
                ) : (
                  <>
                    <span className="text-xl font-black uppercase tracking-tight">
                      Send Magic Link
                    </span>
                    <ArrowRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform font-bold" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium font-sans">
                By logging in, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-[#1c130d] dark:text-white underline decoration-2 decoration-[#f26c0d] underline-offset-4 hover:bg-[#f26c0d] hover:text-black hover:no-underline px-1 transition-all font-bold"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-[#1c130d] dark:text-white underline decoration-2 decoration-[#f26c0d] underline-offset-4 hover:bg-[#f26c0d] hover:text-black hover:no-underline px-1 transition-all font-bold"
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 flex flex-col items-center"
          >
            <div className="w-full p-6 border-[3px] border-black shadow-[5px_5px_0px_0px_#000000] bg-blue-50 text-black font-black text-lg leading-relaxed uppercase tracking-tight">
              Check your inbox.
              <br />
              We sent a magic link.
              <br />
              Click it to log in.
            </div>
            <button
              className="text-black font-black uppercase text-sm tracking-widest hover:text-[#f26c0d] transition-colors border-b-2 border-black hover:border-[#f26c0d]"
              onClick={() => {
                setIsSent(false);
                setEmail("");
              }}
            >
              ← USE DIFFERENT EMAIL
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
