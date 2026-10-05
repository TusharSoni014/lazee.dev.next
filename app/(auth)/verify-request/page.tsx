import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Check Your Inbox — Verify Email",
  description: "A magic sign-in link has been sent to your email address.",
};

interface VerifyRequestPageProps {
  searchParams?: Promise<{
    email?: string;
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function VerifyRequestPage({
  searchParams,
}: VerifyRequestPageProps) {
  const params = await searchParams;
  const email = typeof params?.email === "string" ? params.email : undefined;

  return (
    <div className="flex flex-1 w-full h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Left Column: Warm Mesh Gradient Card (Desktop Only - Matching Login) */}
      <div className="hidden lg:flex flex-col w-1/2 p-3 lg:p-4 xl:p-6 h-full justify-center">
        <div className="relative w-full h-full rounded-3xl overflow-hidden p-8 lg:p-12 xl:p-16 flex flex-col justify-center border border-orange-200/50 dark:border-orange-500/20 shadow-xl shadow-orange-500/5">
          {/* Base Warm Mesh Gradient Layers */}
          <div
            className="absolute inset-0 pointer-events-none select-none"
            style={{
              backgroundColor: "#fff6f0",
              backgroundImage: `
                radial-gradient(circle at 55% 72%, #f97316 0%, #fb923c 24%, #fdba74 46%, rgba(254, 215, 170, 0.45) 68%, transparent 88%),
                radial-gradient(circle at 85% 25%, rgba(253, 186, 116, 0.5) 0%, rgba(254, 215, 170, 0.25) 40%, transparent 70%),
                radial-gradient(circle at 15% 15%, #ffffff 0%, rgba(255, 247, 237, 0.85) 50%, transparent 85%),
                linear-gradient(165deg, #fffaf7 0%, #fff1e6 32%, #fedfcb 68%, #fed3b7 100%)
              `,
            }}
          />

          {/* Diffused Glow Blobs for Soft Depth */}
          <div className="absolute -bottom-16 left-[18%] w-[420px] h-[420px] rounded-full bg-[#f97316] opacity-85 blur-[90px] pointer-events-none" />
          <div className="absolute bottom-[20%] -right-12 w-[340px] h-[340px] rounded-full bg-[#fb923c] opacity-65 blur-[80px] pointer-events-none" />
          <div className="absolute -top-12 -left-12 w-[320px] h-[320px] rounded-full bg-white opacity-95 blur-[65px] pointer-events-none" />
          <div className="absolute top-[28%] right-[15%] w-[260px] h-[260px] rounded-full bg-[#fda472] opacity-40 blur-[75px] pointer-events-none" />

          {/* Clean Minimal Content */}
          <div className="relative z-10 max-w-lg">
            <p className="text-xs sm:text-sm font-mono font-medium uppercase tracking-widest text-orange-950/70 mb-3">
              One profile • Zero busywork
            </p>
            <h1 className="text-3xl sm:text-4xl xl:text-[44px] font-heading font-bold tracking-tight text-zinc-950 leading-[1.14] mb-4">
              Apply in seconds,{" "}
              <span className="font-serif italic font-normal text-orange-900">
                not hours.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-800/80 leading-relaxed font-sans max-w-md">
              Sync your profile, custom answers, and resume to autofill repetitive job applications with zero copy-pasting.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Centered Modern Verification Card */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 h-full overflow-y-auto lg:overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,88,12,0.03),transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-md relative z-10 my-auto">
          <div className="w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xl shadow-zinc-950/5 dark:shadow-black/20 p-6 sm:p-8 backdrop-blur-sm">
            {/* Top Navigation Back Link */}
            <div className="flex flex-col mb-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-5 group w-fit"
              >
                <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to sign in</span>
              </Link>

              {/* Status Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center size-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400">
                  <Mail className="size-6" />
                </div>
                <div>
                  <span className="inline-block text-[11px] font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-semibold">
                    Authentication Sent
                  </span>
                  <h2 className="text-2xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white">
                    Check your inbox
                  </h2>
                </div>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                A passwordless magic link has been sent to your email. Click the
                link inside the message to sign in immediately.
              </p>

              {email && (
                <div className="mt-3 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 break-all w-fit">
                  {email}
                </div>
              )}
            </div>

            {/* Checklist Card */}
            <div className="p-4 rounded-xl bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/70 dark:border-zinc-800/80 mb-6 flex flex-col gap-2.5">
              <div className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                <CheckCircle2 className="size-4 text-orange-600 dark:text-orange-500 shrink-0 mt-0.5" />
                <span>Open the verification email sent from <strong>Lazee.dev</strong></span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                <Clock className="size-4 text-orange-600 dark:text-orange-500 shrink-0 mt-0.5" />
                <span>The link is valid for <strong>24 hours</strong> and expires after first use</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero password required &bull; Keeps your account completely safe</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button asChild size="lg" className="w-full">
                <Link href="/login">
                  <span>Open Sign In Page</span>
                </Link>
              </Button>

              <p className="text-[11px] text-center text-zinc-500 dark:text-zinc-400">
                Can&apos;t find the email? Check your Spam or Promotions tab.
              </p>
            </div>

            {/* Security Guarantee Note */}
            <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
              <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Client-side encrypted profile &bull; Protected session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
