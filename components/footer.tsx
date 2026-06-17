"use client";

import Link from "next/link";
import { Zap, Heart, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <footer className="w-full bg-white dark:bg-zinc-900 border-t-4 border-black mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <div className="size-6 bg-black flex items-center justify-center">
                <Zap className="text-white w-4 h-4 fill-white" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white">
                Lazee.dev
              </h2>
            </div>
            <p className="text-base font-medium leading-relaxed text-slate-700 dark:text-slate-300 max-w-xs border-l-4 border-primary pl-4">
              Empowering developers to do less and achieve more. We build the
              tools that build the future, minus the burnout.
            </p>
          </div>

          {/* Column 2: Product */}
          <div className="lg:col-span-3 lg:pl-8 flex flex-col gap-4">
            <h3 className="text-lg font-black uppercase border-b-2 border-black dark:border-white pb-2 mb-2 w-fit text-black dark:text-white">
              Product
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  className="group flex items-center gap-2 text-base font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                  href="/#features"
                >
                  <span className="w-2 h-2 bg-black dark:bg-white group-hover:bg-primary transition-colors"></span>
                  Features
                </Link>
              </li>
              <li>
                <Link
                  className="group flex items-center gap-2 text-base font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                  href="/#features"
                >
                  <span className="w-2 h-2 bg-black dark:bg-white group-hover:bg-primary transition-colors"></span>
                  Browser Support
                </Link>
              </li>
              <li>
                <Link
                  className="group flex items-center gap-2 text-base font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                  href="/#pricing"
                >
                  <span className="w-2 h-2 bg-black dark:bg-white group-hover:bg-primary transition-colors"></span>
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h3 className="text-lg font-black uppercase border-b-2 border-black dark:border-white pb-2 mb-2 w-fit text-black dark:text-white">
              Support
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  className="group flex items-center gap-2 text-base font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                  href="/#faq"
                >
                  <span className="w-2 h-2 bg-black dark:bg-white group-hover:bg-primary transition-colors"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  className="group flex items-center gap-2 text-base font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                  href="/feedback"
                >
                  <span className="w-2 h-2 bg-black dark:bg-white group-hover:bg-primary transition-colors"></span>
                  Feedback
                </Link>
              </li>
              <li>
                <Link
                  className="group flex items-center gap-2 text-base font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                  href="/careers"
                >
                  <span className="w-2 h-2 bg-black dark:bg-white group-hover:bg-primary transition-colors"></span>
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  className="group flex items-center gap-2 text-base font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                  href="/privacy"
                >
                  <span className="w-2 h-2 bg-black dark:bg-white group-hover:bg-primary transition-colors"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="group flex items-center gap-2 text-base font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                  href="/terms"
                >
                  <span className="w-2 h-2 bg-black dark:bg-white group-hover:bg-primary transition-colors"></span>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-lg font-black uppercase border-b-2 border-black dark:border-white pb-2 mb-2 w-fit text-black dark:text-white">
              Connect
            </h3>
            <div className="flex flex-col gap-3">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-3 group"
              >
                <Link target="_blank" href="https://x.com/tusharsoni014">
                  <span className="w-6 h-6 flex items-center justify-center text-black dark:text-white group-hover:text-primary">
                    {/* X Logo */}
                    <svg
                      fill="currentColor"
                      height="20"
                      viewBox="0 0 24 24"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                  </span>
                  <span className="font-bold text-sm text-black dark:text-white group-hover:text-primary">
                    Follow on X
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-3 group"
              >
                <Link
                  target="_blank"
                  href="https://www.linkedin.com/in/tushar-verma-developer"
                >
                  <span className="w-6 h-6 flex items-center justify-center text-black dark:text-white group-hover:text-primary">
                    <svg
                      fill="currentColor"
                      height="20"
                      viewBox="0 0 24 24"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                    </svg>
                  </span>
                  <span className="font-bold text-sm text-black dark:text-white group-hover:text-primary">
                    LinkedIn
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-3 group"
              >
                <Link target="_blank" href="https://github.com/tusharsoni014">
                  <span className="w-6 h-6 flex items-center justify-center text-black dark:text-white group-hover:text-primary">
                    <svg
                      fill="currentColor"
                      height="20"
                      viewBox="0 0 24 24"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                    </svg>
                  </span>
                  <span className="font-bold text-sm text-black dark:text-white group-hover:text-primary">
                    GitHub
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t-2 border-black flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} Lazee.dev. All rights reserved.
          </p>
          <div className="flex items-center gap-2 px-4 py-1 bg-primary/10 border-2 border-primary">
            <Heart className="text-primary w-4 h-4 fill-primary" />
            <p className="text-sm font-bold text-primary">
              Built with love on the weekends
            </p>
            <Coffee className="text-primary w-4 h-4" />
          </div>
        </div>
      </div>
    </footer>
  );
}
