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
import { User, Download } from "lucide-react";
import { useBrowser, type BrowserType } from "@/hooks/use-browser";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useProfileStatus } from "@/hooks/useProfile";
import { CHROME_EXTENSION_URL, FIREFOX_EXTENSION_URL } from "@/lib/constants";

const DOWNLOAD_LINKS: Record<BrowserType, string> = {
  chrome: CHROME_EXTENSION_URL,
  edge: "https://microsoftedge.microsoft.com/addons/",
  firefox: FIREFOX_EXTENSION_URL,
  safari: "https://apps.apple.com/",
  other: CHROME_EXTENSION_URL,
};

export default function AuthButton() {
  const { data: session, status } = useSession();
  const browser = useBrowser();
  const [isOpen, setIsOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="h-9 w-9 animate-pulse rounded-full bg-zinc-200" />
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <CreditsDisplay />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button className="relative h-9 w-9 cursor-pointer group focus:outline-none">
              <div className="relative h-full w-full overflow-hidden rounded-full transition-all duration-200 group-hover:scale-110 group-active:scale-95">
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
              </div>
            </button>
          </PopoverTrigger>
          <AnimatePresence>
            {isOpen && (
              <PopoverContent
                forceMount
                align="end"
                className="w-64 p-0 rounded-none border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white data-[state=open]:animate-none data-[state=closed]:animate-none"
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
                  <div className="px-3 py-2 border-b-[3px] border-black mb-1">
                    <p className="text-xs font-black uppercase text-zinc-500 truncate">
                      {session.user?.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-black uppercase hover:bg-orange-50 transition-colors"
                  >
                    <User className="size-4" />
                    Profile Settings
                  </Link>

                  <a
                    href={DOWNLOAD_LINKS[browser]}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-black uppercase hover:bg-blue-50 transition-colors"
                  >
                    <Download className="size-4" />
                    Get {browser === "other" ? "" : browser} Ext
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
    <Button asChild>
      <Link href="/login">LOG IN</Link>
    </Button>
  );
}

function CreditsDisplay() {
  const { data: session } = useSession();
  const { data: status, isLoading } = useProfileStatus(undefined, {
    enabled: !!session,
  });

  if (isLoading || !status) {
    return (
      <div className="h-4 w-12 animate-pulse bg-zinc-200 rounded" />
    );
  }

  return (
    <Link
      href="/profile"
      className="text-sm font-bold uppercase tracking-wider text-zinc-700 hover:text-orange-500 transition-colors flex items-center gap-1 select-none mr-1"
    >
      <span>{Intl.NumberFormat("en-US").format(status.credits)}</span>
      <span className="text-orange-500">⚡</span>
    </Link>
  );
}
