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
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border-[3px] group-[.toaster]:border-black group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-[.toaster]:rounded-none group-[.toaster]:font-bold group-[.toaster]:tracking-tight group-[.toaster]:p-4 group-[.toaster]:flex group-[.toaster]:gap-3 group-[.toaster]:animate-in group-[.toaster]:fade-in-0 group-[.toaster]:slide-in-from-bottom-5 group-[.toaster]:zoom-in-95 group-[.toaster]:duration-300",
          description:
            "group-[.toast]:text-zinc-600 font-medium text-xs uppercase pt-1 tracking-wider",
          actionButton:
            "group-[.toast]:bg-orange-500 group-[.toast]:text-black group-[.toast]:text-xs group-[.toast]:font-black group-[.toast]:uppercase group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:border-2 group-[.toast]:border-black",
          cancelButton:
            "group-[.toast]:bg-zinc-100 group-[.toast]:text-black group-[.toast]:text-xs group-[.toast]:font-black group-[.toast]:uppercase group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:border-2 group-[.toast]:border-black",
          success:
            "group-[.toaster]:bg-green-300 group-[.toaster]:text-black group-[.toaster]:border-black group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
          error:
            "group-[.toaster]:bg-red-400 group-[.toaster]:text-black group-[.toaster]:border-black group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
          warning:
            "group-[.toaster]:bg-yellow-400 group-[.toaster]:text-black group-[.toaster]:border-black group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
          info: "group-[.toaster]:bg-blue-300 group-[.toaster]:text-black group-[.toaster]:border-black group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-black" />,
        info: <InfoIcon className="size-5 text-black" />,
        warning: <TriangleAlertIcon className="size-5 text-black" />,
        error: <OctagonXIcon className="size-5 text-black" />,
        loading: <Loader2Icon className="size-5 animate-spin text-black" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
