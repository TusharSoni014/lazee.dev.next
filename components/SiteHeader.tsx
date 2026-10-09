"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import AuthButton from "./AuthButton";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Menu } from "lucide-react";
import { LOGO_URL } from "@/lib/constants";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { scrollToHash, scrollToTop } from "./HashScrollHandler";

const NAV_LINKS = [
  { href: "/#pricing", label: "Pricing" },
  { href: "/#features", label: "Features" },
  { href: "/careers", label: "Careers" },
  {
    href: "https://github.com/TusharSoni014/lazee.dev.next",
    label: "GitHub",
    external: true,
  },
];

export function SiteHeader() {
  const pathname = usePathname();

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      scrollToTop(true);
      if (window.location.hash) {
        window.history.pushState(null, "", "/");
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_4px_20px_-2px_rgba(249,115,22,0.14)] dark:shadow-[0_6px_30px_-3px_rgba(249,115,22,0.3)] transition-all">
      {/* Subtle Orange Glow Edge Line */}
      <div className="absolute -bottom-[1px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 dark:via-orange-500/70 to-transparent pointer-events-none" />
      {/* Soft Ambient Under-Glow */}
      <div className="absolute -bottom-3 left-1/6 right-1/6 h-5 bg-orange-500/15 dark:bg-orange-500/25 blur-xl pointer-events-none -z-10" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-zinc-900 dark:text-white font-heading"
          >
            <div className="relative w-7 h-7 flex-shrink-0">
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
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <AuthButton />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  target,
  rel,
}: {
  href: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}) {
  const pathname = usePathname();
  const isNavigatingRef = useRef(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If external or target=_blank or modified click, allow default
    if (
      target === "_blank" ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      href.startsWith("http")
    ) {
      return;
    }

    const hashIndex = href.indexOf("#");
    if (hashIndex !== -1) {
      const targetPath = href.slice(0, hashIndex) || "/";
      const rawHash = href.slice(hashIndex + 1);
      const cleanHash = rawHash.replace(/^#+/, "").split("#")[0]?.trim();

      const isCurrentPage =
        pathname === targetPath || (pathname === "/" && targetPath === "/");

      if (isCurrentPage) {
        e.preventDefault();
        if (cleanHash) {
          scrollToHash(cleanHash, true);
          const cleanUrl = `${targetPath === "/" ? "" : targetPath}#${cleanHash}` || `/#${cleanHash}`;
          if (window.location.hash !== `#${cleanHash}`) {
            window.history.pushState(null, "", cleanUrl);
          } else {
            window.history.replaceState(null, "", cleanUrl);
          }
        }
      } else {
        // Prevent rapid double clicks during cross-page transitions
        if (isNavigatingRef.current) {
          e.preventDefault();
          return;
        }
        isNavigatingRef.current = true;
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 800);
      }
    }
  };

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      prefetch={false}
      onClick={handleClick}
      className={cn(
        "px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-md hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 transition-colors"
      )}
    >
      {children}
    </Link>
  );
}

function MobileNav() {
  // Controlled so links can close the sheet: HashScrollHandler's capture-phase
  // listener calls preventDefault on same-page hash links, which makes Radix
  // skip SheetClose's own close handler.
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="md:hidden flex size-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 hover:bg-zinc-100/90 dark:bg-zinc-900/80 dark:hover:bg-zinc-800/90 text-zinc-600 dark:text-zinc-300 shadow-2xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 active:scale-95"
        >
          <Menu className="size-4.5" />
        </button>
      </SheetTrigger>
      <SheetContent aria-describedby={undefined}>
        <SheetTitle className="text-base">Menu</SheetTitle>
        <nav className="mt-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              prefetch={false}
              onClick={() => setOpen(false)}
              className="px-3 py-3 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
