"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User, Download, LogOut, Loader2 } from "lucide-react";
import { useBrowser, type BrowserType } from "@/hooks/use-browser";
import { useState } from "react";

const DOWNLOAD_LINKS: Record<BrowserType, string> = {
  chrome: "https://chromewebstore.google.com/",
  edge: "https://microsoftedge.microsoft.com/addons/",
  firefox: "https://addons.mozilla.org/",
  safari: "https://apps.apple.com/",
  other: "https://chromewebstore.google.com/",
};

export default function AuthButton() {
  const { data: session, status } = useSession();
  const browser = useBrowser();
  const [isSignOutLoading, setIsSignOutLoading] = useState(false);

  const handleSignOut = async () => {
    setIsSignOutLoading(true);
    try {
      if (
        typeof window !== "undefined" &&
        window.chrome?.runtime?.sendMessage
      ) {
        const extensionId = localStorage.getItem("lazeeExtensionId");
        if (extensionId) {
          window.chrome.runtime.sendMessage(
            extensionId,
            { type: "LAZEE_AUTH_LOGOUT" },
            () => {
              localStorage.removeItem("lazeeExtensionId");
            },
          );
        }
      }
    } catch (e) {
      console.debug("Failed to notify extension on sign out", e);
    }
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="h-9 w-9 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
    );
  }

  if (session) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button className="relative h-9 w-9 overflow-hidden rounded-full border-[3px] border-black transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-orange-500 text-xs font-black text-white">
                {session.user?.email?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-64 p-2 rounded-none border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
        >
          <div className="flex flex-col gap-1">
            <div className="px-3 py-2 border-b-[3px] border-black mb-1">
              <p className="text-xs font-black uppercase text-zinc-500 truncate">
                {session.user?.email}
              </p>
            </div>

            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-black uppercase hover:bg-orange-50 transition-colors"
            >
              <User className="size-4" />
              Profile Settings
            </Link>

            <a
              href={DOWNLOAD_LINKS[browser]}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-black uppercase hover:bg-blue-50 transition-colors"
            >
              <Download className="size-4" />
              Get {browser === "other" ? "" : browser} Ext
            </a>

            <button
              onClick={handleSignOut}
              disabled={isSignOutLoading}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-black uppercase hover:bg-red-50 text-red-600 transition-colors w-full text-left cursor-pointer border-t-[3px] border-black border-dashed mt-1"
            >
              {isSignOutLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}
              Sign Out
            </button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Button asChild variant="default">
      <Link href="/login">LOG IN</Link>
    </Button>
  );
}
