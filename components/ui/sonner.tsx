"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white dark:group-[.toaster]:bg-zinc-900 group-[.toaster]:text-zinc-900 dark:group-[.toaster]:text-zinc-100 group-[.toaster]:border group-[.toaster]:border-zinc-200/80 dark:group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:font-medium group-[.toaster]:text-sm group-[.toaster]:p-4 group-[.toaster]:flex group-[.toaster]:gap-3",
          description:
            "group-[.toast]:text-zinc-500 dark:group-[.toast]:text-zinc-400 font-normal text-xs pt-0.5",
          actionButton:
            "group-[.toast]:bg-orange-600 group-[.toast]:text-white group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-lg",
          cancelButton:
            "group-[.toast]:bg-zinc-100 dark:group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-700 dark:group-[.toast]:text-zinc-300 group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-lg",
          success:
            "group-[.toaster]:border-emerald-500/20 group-[.toaster]:text-emerald-800 dark:group-[.toaster]:text-emerald-300",
          error:
            "group-[.toaster]:border-rose-500/20 group-[.toaster]:text-rose-800 dark:group-[.toaster]:text-rose-300",
          warning:
            "group-[.toaster]:border-amber-500/20 group-[.toaster]:text-amber-800 dark:group-[.toaster]:text-amber-300",
          info:
            "group-[.toaster]:border-blue-500/20 group-[.toaster]:text-blue-800 dark:group-[.toaster]:text-blue-300",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-600 dark:text-emerald-400" />,
        info: <InfoIcon className="size-4 text-blue-600 dark:text-blue-400" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-600 dark:text-amber-400" />,
        error: <OctagonXIcon className="size-4 text-rose-600 dark:text-rose-400" />,
        loading: <Loader2Icon className="size-4 animate-spin text-orange-600" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
