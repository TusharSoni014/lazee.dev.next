"use client";

import { useEffect, useState, useId } from "react";
import { useTheme } from "next-themes";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const maskId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const springConfig = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 280, damping: 22 };

  const rayTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 320, damping: 24 };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={
        !mounted
          ? "Toggle theme"
          : isDark
          ? "Switch to light theme"
          : "Switch to dark theme"
      }
      title={
        !mounted
          ? "Toggle theme"
          : isDark
          ? "Switch to light theme"
          : "Switch to dark theme"
      }
      onClick={toggleTheme}
      className={cn(
        "group relative flex size-9 items-center justify-center rounded-xl border",
        "border-zinc-200/80 dark:border-zinc-800",
        "bg-white/80 hover:bg-zinc-100 dark:bg-zinc-900/80 dark:hover:bg-zinc-800",
        "text-zinc-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400",
        "shadow-2xs transition-colors duration-200 cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 active:scale-95",
        className
      )}
    >
      <span className="sr-only">
        {isDark ? "Switch to light theme" : "Switch to dark theme"}
      </span>

      {!mounted ? (
        // Hydration-safe initial placeholder with identical footprint
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4.5 opacity-70"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4.5" fill="currentColor" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          className="size-4.5"
          initial={false}
          animate={{
            rotate: isDark ? -35 : 0,
          }}
          transition={springConfig}
          aria-hidden="true"
        >
          <defs>
            <mask id={maskId}>
              <rect x="0" y="0" width="24" height="24" fill="white" />
              {/* Crescent cutout circle that slides in to carve the moon */}
              <motion.circle
                initial={false}
                animate={{
                  cx: isDark ? 16.5 : 25,
                  cy: isDark ? 7.5 : 2,
                  r: isDark ? 7 : 0,
                }}
                fill="black"
                transition={springConfig}
              />
            </mask>
          </defs>

          {/* Center Orb (Sun core / Moon crescent) */}
          <motion.circle
            cx="12"
            cy="12"
            initial={false}
            animate={{
              r: isDark ? 8 : 4.5,
            }}
            fill="currentColor"
            mask={`url(#${maskId})`}
            transition={springConfig}
          />

          {/* Sun Rays radiating outwards */}
          <motion.g
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={false}
            animate={{
              scale: isDark ? 0 : 1,
              opacity: isDark ? 0 : 1,
              rotate: isDark ? 90 : 0,
            }}
            style={{ transformOrigin: "12px 12px" }}
            transition={rayTransition}
          >
            {/* Top / Bottom */}
            <line x1="12" y1="1.75" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22.25" />
            {/* Left / Right */}
            <line x1="1.75" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22.25" y2="12" />
            {/* Diagonals */}
            <line x1="4.75" y1="4.75" x2="6.35" y2="6.35" />
            <line x1="17.65" y1="17.65" x2="19.25" y2="19.25" />
            <line x1="4.75" y1="19.25" x2="6.35" y2="17.65" />
            <line x1="17.65" y1="6.35" x2="19.25" y2="4.75" />
          </motion.g>

          {/* Subtle celestial stars that fade in during dark mode */}
          <motion.g
            fill="currentColor"
            initial={false}
            animate={{
              opacity: isDark ? 1 : 0,
              scale: isDark ? 1 : 0,
            }}
            style={{ transformOrigin: "6px 8px" }}
            transition={{
              delay: isDark && !shouldReduceMotion ? 0.08 : 0,
              duration: shouldReduceMotion ? 0 : 0.25,
            }}
          >
            <circle cx="5.5" cy="7.5" r="0.8" className="text-orange-500/80" />
            <circle cx="8" cy="4.5" r="0.6" className="text-amber-400/70" />
          </motion.g>
        </motion.svg>
      )}
    </button>
  );
}
