"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-10 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {session.user?.email}
        </span>
        <button
          onClick={() => signOut()}
          className="flex h-10 items-center justify-center rounded-full bg-zinc-100 px-6 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="flex h-12 items-center justify-center gap-2 rounded-full bg-black px-8 text-sm font-semibold text-white transition-all hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-zinc-200"
    >
      Sign In with Google
    </button>
  );
}
