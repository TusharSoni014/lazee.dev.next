"use client";

import Link from "next/link";
import AuthButton from "./AuthButton";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { LOGO_URL } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-zinc-900 dark:text-white font-heading group"
          >
            <div className="relative w-7 h-7 flex-shrink-0 transition-transform group-hover:scale-105">
              <Image
                src={LOGO_URL}
                alt="Lazee.dev Logo"
                fill
                className="object-contain"
                sizes="28px"
                priority
              />
            </div>
            <span className="font-semibold tracking-tight">
              lazee<span className="text-orange-600 dark:text-orange-500">.dev</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/#features">Features</NavLink>
            <NavLink href="/#platforms">Platforms</NavLink>
            <NavLink href="/#workflow">Workflow</NavLink>
            <NavLink href="/#pricing">Pricing</NavLink>
            <NavLink href="/#faq">FAQ</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-md hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 transition-colors"
      )}
    >
      {children}
    </Link>
  );
}
