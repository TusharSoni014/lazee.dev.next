"use client";

import { useState, useEffect } from "react";

export type BrowserType = "chrome" | "firefox" | "edge" | "safari" | "other";

export function useBrowser() {
  const [browser, setBrowser] = useState<BrowserType>("chrome");

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("edg/")) {
      setBrowser("edge");
    } else if (ua.includes("chrome") && !ua.includes("edg/")) {
      setBrowser("chrome");
    } else if (ua.includes("firefox")) {
      setBrowser("firefox");
    } else if (ua.includes("safari") && !ua.includes("chrome")) {
      setBrowser("safari");
    } else {
      setBrowser("other");
    }
  }, []);

  return browser;
}
