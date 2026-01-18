"use client";

import Link from "next/link";
import AuthButton from "./AuthButton";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useSession } from "next-auth/react";

export function SiteHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-white"
        >
          lazee.dev
        </Link>

        <div className="flex items-center gap-4">
          <AuthButton />
        </div>
      </div>
    </motion.header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "text-sm font-medium transition-colors hover:text-white",
        active ? "text-white" : "text-zinc-400",
      )}
    >
      {children}
    </Link>
  );
}
