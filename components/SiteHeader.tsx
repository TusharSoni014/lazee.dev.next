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
      className="fixed top-0 left-0 right-0 z-50 border-b-[3px] border-black bg-white/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-2xl font-black tracking-tighter text-black font-heading italic uppercase"
        >
          LAZEE.DEV
        </Link>

        <div className="flex items-center gap-6">
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
