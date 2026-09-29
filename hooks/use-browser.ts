"use client";

import { useSyncExternalStore } from "react";

export type BrowserType = "chrome" | "firefox" | "edge" | "safari" | "other";

function getClientBrowser(): BrowserType {
  if (typeof window === "undefined" || typeof navigator === "undefined") return "chrome";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("edg/")) return "edge";
  if (ua.includes("chrome") && !ua.includes("edg/")) return "chrome";
  if (ua.includes("firefox")) return "firefox";
  if (ua.includes("safari") && !ua.includes("chrome")) return "safari";
  return "other";
}

const emptySubscribe = () => () => {};

export function useBrowser(): BrowserType {
  return useSyncExternalStore(
    emptySubscribe,
    getClientBrowser,
    () => "chrome"
  );
}
