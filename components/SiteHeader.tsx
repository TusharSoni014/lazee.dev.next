"use client";

import Link from "next/link";
import AuthButton from "./AuthButton";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fefaf6]/80 backdrop-blur-md shadow-[0_4px_0_0_#000000]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl sm:text-2xl font-black tracking-tighter text-black font-heading italic uppercase mr-2 sm:mr-4"
          >
            LAZEE.DEV
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/#features" active={false}>
              Features
            </NavLink>
            <NavLink href="/#pricing" active={false}>
              Pricing
            </NavLink>
            <NavLink href="/#faq" active={false}>
              FAQ
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <AuthButton />
        </div>
      </div>
    </header>
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
      className={cn(
        "text-sm font-bold uppercase tracking-wider transition-colors hover:text-orange-500",
        active ? "text-orange-500" : "text-black",
      )}
    >
      {children}
    </Link>
  );
}
