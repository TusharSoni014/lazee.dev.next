"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base layout & dimensions
        "peer group relative size-4 shrink-0 rounded-[5px] border cursor-pointer select-none",
        // Smooth transitions for colors and tactile active state
        "transition-all duration-200 ease-out active:scale-90",
        // Unchecked state (light & dark mode)
        "bg-white dark:bg-zinc-900/90 border-zinc-300 dark:border-zinc-700 shadow-2xs hover:border-orange-500/70 dark:hover:border-orange-500/70",
        // Checked state: brand vibrant orange with crisp border & subtle shadow
        "data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600 data-[state=checked]:text-white dark:data-[state=checked]:bg-orange-500 dark:data-[state=checked]:border-orange-500 shadow-xs",
        // Indeterminate state
        "data-[state=indeterminate]:bg-orange-600 data-[state=indeterminate]:border-orange-600 data-[state=indeterminate]:text-white dark:data-[state=indeterminate]:bg-orange-500 dark:data-[state=indeterminate]:border-orange-500",
        // Focus & accessible keyboard navigation
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:border-orange-500 dark:focus-visible:ring-orange-500/50",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-300 dark:disabled:hover:border-zinc-700",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-white size-full pointer-events-none select-none"
      >
        <motion.svg
          className="size-2.5 sm:size-3 stroke-white stroke-[3.5] fill-none overflow-visible group-data-[state=indeterminate]:hidden"
          viewBox="0 0 24 24"
          initial={{ scale: 0.35, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 550,
            damping: 28,
          }}
        >
          <motion.path
            d="M4 12.5L9.5 18L20 6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: {
                type: "spring",
                stiffness: 450,
                damping: 30,
                duration: 0.22,
              },
              opacity: { duration: 0.05 },
            }}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
        <motion.div
          className="hidden group-data-[state=indeterminate]:block w-2 h-0.5 bg-white rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.15 }}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
