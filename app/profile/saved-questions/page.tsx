import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Lock } from "lucide-react";
import { SavedQuestionsClient } from "./saved-questions-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Saved Questions",
  description:
    "Manage and reuse your custom screening questions & answers across job applications.",
};

export default async function SavedQuestionsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-8 text-center shadow-xl shadow-zinc-950/5">
          <div className="mx-auto size-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4">
            <Lock className="size-6" />
          </div>
          <h1 className="text-2xl font-heading font-bold tracking-tight">
            Sign In Required
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            Sign in to view and manage your saved questions vault.
          </p>
          <Link
            href="/login"
            className="mt-6 w-full h-11 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In or Create Account</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      savedAnswers: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) redirect("/");

  return <SavedQuestionsClient initialSavedAnswers={user.savedAnswers} />;
}
