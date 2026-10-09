"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LOGO_URL } from "@/lib/constants";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <footer className="w-full bg-white dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-800 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative size-7 flex-shrink-0">
                <Image
                  src={LOGO_URL}
                  alt="Lazee.dev Logo"
                  fill
                  className="object-contain"
                  sizes="28px"
                />
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white font-heading">
                lazee<span className="text-orange-600 dark:text-orange-500">.dev</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              The ambient job application engine for software engineers. Automate tedious ATS forms, map multiple resume variants, and focus on interview preparation.
            </p>
          </div>

          {/* Column 2: Product */}
          <div className="lg:col-span-3 lg:pl-8 flex flex-col gap-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Product
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  prefetch={false}
                  className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                  href="/#features"
                >
                  Features & Capabilities
                </Link>
              </li>
              <li>
                <Link
                  prefetch={false}
                  className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                  href="/#platforms"
                >
                  Supported ATS Platforms
                </Link>
              </li>
              <li>
                <Link
                  prefetch={false}
                  className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                  href="/#workflow"
                >
                  Execution Architecture
                </Link>
              </li>
              <li>
                <Link
                  prefetch={false}
                  className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                  href="/#pricing"
                >
                  Pricing & Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources & Legal */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Company
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  prefetch={false}
                  className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                  href="/#faq"
                >
                  FAQ & Support
                </Link>
              </li>
              <li>
                <Link
                  className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                  href="/careers"
                >
                  Jobs &amp; Careers
                </Link>
              </li>
              <li>
                <Link
                  className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                  href="/feedback"
                >
                  Share Feedback
                </Link>
              </li>
              <li>
                <Link
                  className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                  href="/privacy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                  href="/terms"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Community
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                target="_blank"
                href="https://x.com/tusharsoni014"
                className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white flex items-center gap-2 transition-colors"
              >
                <span>Follow on X</span>
              </Link>
              <Link
                target="_blank"
                href="https://github.com/tusharsoni014"
                className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white flex items-center gap-2 transition-colors"
              >
                <span>GitHub Repository</span>
              </Link>
              <Link
                target="_blank"
                href="https://www.linkedin.com/in/tushar-verma-developer"
                className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white flex items-center gap-2 transition-colors"
              >
                <span>LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Lazee.dev. All rights reserved.</p>
          <div className="flex items-center gap-2 text-zinc-500">
            <span>Built for developers with high standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
