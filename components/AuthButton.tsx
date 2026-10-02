"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User, Download, Zap, KeyRound } from "lucide-react";
import { useBrowser, type BrowserType } from "@/hooks/use-browser";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useProfileStatus } from "@/hooks/useProfile";
import { CHROME_EXTENSION_URL, FIREFOX_EXTENSION_URL } from "@/lib/constants";
import { ThemeToggle } from "./ThemeToggle";

const DOWNLOAD_LINKS: Record<BrowserType, string> = {
  chrome: CHROME_EXTENSION_URL,
  edge: CHROME_EXTENSION_URL,
  firefox: FIREFOX_EXTENSION_URL,
  safari: CHROME_EXTENSION_URL,
  other: CHROME_EXTENSION_URL,
};

export default function AuthButton() {
  const { data: session, status } = useSession();
  const browser = useBrowser();
  const [isOpen, setIsOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        <ThemeToggle />
        <div className="size-9 animate-pulse rounded-full bg-zinc-200/80 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60 shrink-0" />
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        <CreditsDisplay />
        <ThemeToggle />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              aria-label="User profile menu"
              className="relative size-9 shrink-0 cursor-pointer rounded-full border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/90 overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40"
            >
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User profile"}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-orange-600 text-xs font-semibold text-white">
                  {session.user?.email?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </button>
          </PopoverTrigger>
          <AnimatePresence>
            {isOpen && (
              <PopoverContent
                forceMount
                align="end"
                className="w-64 p-0 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 data-[state=open]:animate-none data-[state=closed]:animate-none overflow-hidden"
              >
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 380,
                  }}
                  className="p-2 flex flex-col gap-1"
                >
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                    <p className="text-xs font-medium text-zinc-500 truncate">
                      {session.user?.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <User className="size-4 text-zinc-400" />
                    Profile &amp; Credentials
                  </Link>

                  <Link
                    href="/profile/ai-providers"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <KeyRound className="size-4 text-zinc-400" />
                    AI Providers
                  </Link>

                  <a
                    href={DOWNLOAD_LINKS[browser]}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors"
                  >
                    <Download className="size-4" />
                    Download Extension
                  </a>
                </motion.div>
              </PopoverContent>
            )}
          </AnimatePresence>
        </Popover>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2.5">
      <ThemeToggle />
      <Button
        asChild
        variant="black"
        className="h-9 px-3.5 sm:px-4 rounded-xl font-semibold text-xs shadow-xs transition-colors cursor-pointer"
      >
        <Link href="/login">Sign In</Link>
      </Button>
    </div>
  );
}

function CreditsDisplay() {
  const { data: session } = useSession();
  const { data: status, isLoading } = useProfileStatus(undefined, {
    enabled: !!session,
  });

  if (isLoading || !status) {
    return (
      <div className="h-9 w-16 animate-pulse bg-zinc-200/60 dark:bg-zinc-800/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 shrink-0" />
    );
  }

  return (
    <Link
      href="/profile"
      title="View credits & profile"
      className="h-9 px-2.5 sm:px-3 text-xs font-semibold font-mono tabular-nums text-zinc-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/80 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs active:scale-[0.98] shrink-0"
    >
      <span>{Intl.NumberFormat("en-US").format(status.credits)}</span>
      <Zap className="size-3.5 text-orange-500 fill-orange-500 shrink-0" />
    </Link>
  );
}
