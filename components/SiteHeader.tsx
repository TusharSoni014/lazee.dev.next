"use client";

import { useState } from "react";
import Link from "next/link";
import AuthButton from "./AuthButton";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fefaf6]/80 backdrop-blur-md shadow-[0_4px_0_0_#000000]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter text-black font-heading italic uppercase mr-4"
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

        <div className="flex items-center gap-4">
          <AuthButton />

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 border-[3px] border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-black" />
            ) : (
              <Menu className="w-5 h-5 text-black" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-[3px] border-black bg-[#fefaf6] shadow-[0_4px_0_0_#000000]">
          <nav className="flex flex-col px-6 py-4 gap-1">
            <MobileNavLink
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </MobileNavLink>
            <MobileNavLink
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </MobileNavLink>
            <MobileNavLink
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </MobileNavLink>

          </nav>
        </div>
      )}
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

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-base font-black uppercase tracking-wider text-black hover:text-orange-500 hover:bg-orange-50 px-4 py-3 transition-colors border-b border-black/5"
    >
      {children}
    </Link>
  );
}
