import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";
import { SignOutButton } from "@/components/SignOutButton";
import { Button } from "@/components/ui/button";
import {
  Lock,
  FileText,
  Bot,
  Globe,
  ArrowRight,
  UserCheck,
  KeyRound,
  Bookmark,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Candidate Profile",
  description:
    "Manage your credentials, resumes, and extension sync settings on Lazee.dev.",
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string; status?: string }>;
}) {
  const params = await searchParams;
  // Detect success from our own ?payment=success OR from Dodo's appended ?status=active
  const paymentSuccess =
    params.payment === "success" || params.status === "active";
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-16 md:py-24 px-4 flex items-center justify-center relative overflow-hidden transition-colors">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,88,12,0.05),transparent_60%)] pointer-events-none" />

        <div className="relative z-10 w-full max-w-xl">
          {/* Main Card */}
          <div className="w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-8 sm:p-10 shadow-xl shadow-zinc-950/5 dark:shadow-black/20 backdrop-blur-sm">
            <div className="flex flex-col items-center text-center">
              {/* Lock Icon Badge */}
              <div className="size-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-5">
                <Lock className="size-6" />
              </div>

              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white">
                  Sign In Required
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-sans">
                  Sign in to access and manage your candidate profile vault.
                </p>
              </div>

              {/* Informative Value List */}
              <div className="w-full mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-left space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono text-center">
                  What you can do with a Lazee profile
                </p>

                <div className="grid gap-2.5">
                  <div className="flex items-start gap-3 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50">
                    <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5">
                      <UserCheck className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        Personal Details & Experience
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                        Securely store your contact info, employment history,
                        and education for 1-click autofill.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50">
                    <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5">
                      <FileText className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        Resume Vault
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                        Upload and manage multiple tailored resumes. Choose the
                        active one during autofills.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50">
                    <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5">
                      <Globe className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        Shareable Public Profile
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                        Claim a custom{" "}
                        <span className="font-mono text-orange-600 dark:text-orange-400">
                          /u/username
                        </span>{" "}
                        link to showcase your portfolio to hiring managers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50">
                    <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5">
                      <Bot className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        Custom AI Guidance
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                        Define personal directives on how AI answers open-ended
                        screening questions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Login CTA Button */}
              <div className="w-full mt-6">
                <Button
                  asChild
                  size="lg"
                  className="w-full h-11 text-sm font-medium gap-2 cursor-pointer"
                >
                  <Link href="/login">
                    <span>Sign In or Create Account</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  let user = null;
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          resumes: { orderBy: { version: "desc" } },
          experiences: { orderBy: { startDate: "desc" } },
          projects: { orderBy: { createdAt: "desc" } },
          savedAnswers: { orderBy: { createdAt: "desc" } },
        },
      });
      break; // Success, exit retry loop
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      const isTransient =
        code === "ECONNRESET" || code === "ETIMEDOUT" || code === "EPIPE";
      if (isTransient && attempt < maxRetries) {
        console.warn(
          `Profile DB query failed (attempt ${attempt}/${maxRetries}): ${code}. Retrying...`,
        );
        await new Promise((r) => setTimeout(r, 500 * attempt));
        continue;
      }
      throw err; // Non-transient or exhausted retries
    }
  }

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-24 transition-colors relative overflow-hidden">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,88,12,0.04),transparent_50%)] pointer-events-none" />

      <div className="relative z-10 container mx-auto max-w-5xl px-4 py-8 md:py-12">
        {/* Workspace Title & Description */}
        <div className="mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-700 dark:text-orange-400 text-xs font-medium mb-3">
            <span>Candidate Workspace</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span>Profile</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white">
            Profile &amp; Preferences
          </h1>
          <p className="mt-2 max-w-xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            Manage your credentials, master resumes, work experience, and
            extension synchronization settings.
          </p>
        </div>

        {/* Profile Quick Links: AI Providers & Saved Questions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <Link
            href="/profile/ai-providers"
            className="group flex items-center gap-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-4 sm:p-5 shadow-xs transition-colors hover:border-orange-500/40"
          >
            <div className="size-10 shrink-0 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <KeyRound className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                AI Providers
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                Bring your own ChatGPT, Claude, Gemini or Grok key, or run a
                local model with Ollama / LM Studio.
              </p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-zinc-400 group-hover:text-orange-600 transition-colors" />
          </Link>

          <Link
            href="/profile/saved-questions"
            className="group flex items-center gap-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-4 sm:p-5 shadow-xs transition-colors hover:border-orange-500/40"
          >
            <div className="size-10 shrink-0 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Bookmark className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Saved Questions
                </p>
                {user.savedAnswers && user.savedAnswers.length > 0 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-mono">
                    {user.savedAnswers.length}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                Manage and reuse custom screening questions &amp; answers across
                job applications.
              </p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-zinc-400 group-hover:text-orange-600 transition-colors" />
          </Link>
        </div>

        <ProfileForm user={user} paymentSuccess={paymentSuccess} />

        {/* Account Actions / Sign Out */}
        <div className="mt-16 pt-8 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-col items-center">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
            Session &amp; Account Actions
          </h2>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
