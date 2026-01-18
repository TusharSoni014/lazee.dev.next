"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="mt-8 flex w-full items-center justify-center rounded-lg border border-red-500/10 bg-red-500/5 px-8 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 hover:text-red-500 dark:border-red-400/10 dark:bg-red-400/5 dark:text-red-400 dark:hover:bg-red-400/10"
    >
      Sign Out
    </button>
  );
}
