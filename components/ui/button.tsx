import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "relative overflow-hidden bg-orange-600 hover:bg-orange-500 text-white shadow-xs shadow-orange-600/20 hover:shadow-md hover:shadow-orange-600/30 hover:brightness-105 before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-transform before:duration-700 before:ease-out before:-skew-x-12",
        primary:
          "relative overflow-hidden bg-orange-600 hover:bg-orange-500 text-white shadow-xs shadow-orange-600/20 hover:shadow-md hover:shadow-orange-600/30 hover:brightness-105 before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-transform before:duration-700 before:ease-out before:-skew-x-12",
        destructive:
          "bg-rose-600 hover:bg-rose-500 text-white shadow-xs shadow-rose-600/20",
        outline:
          "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-2xs",
        secondary:
          "border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200/90 dark:hover:bg-zinc-700/90 text-zinc-900 dark:text-zinc-100 shadow-2xs hover:shadow-xs",
        tertiary:
          "border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100/90 dark:hover:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 shadow-2xs",
        black:
          "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white shadow-xs",
        ghost:
          "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100",
        link:
          "text-orange-600 dark:text-orange-400 underline-offset-4 hover:underline p-0 h-auto active:scale-100",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-11 rounded-xl px-6 text-sm has-[>svg]:px-4",
        icon: "size-9 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
