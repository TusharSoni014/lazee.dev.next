"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function scrollToHash(rawHash: string, smooth = true): boolean {
  if (typeof window === "undefined") return false;

  // Clean hash: strip leading '#', extract single token, trim
  const cleanId = rawHash.replace(/^#+/, "").split("#")[0]?.trim();
  if (!cleanId) return false;

  const element = document.getElementById(cleanId);
  if (!element) return false;

  const headerOffset = 80; // 64px header + 16px buffer
  const elementPosition = element.getBoundingClientRect().top;
  const targetY = Math.max(0, elementPosition + window.pageYOffset - headerOffset);

  if (!smooth) {
    window.scrollTo(0, targetY);
    return true;
  }

  const startY = window.pageYOffset;
  const diff = targetY - startY;
  if (Math.abs(diff) < 2) return true;

  const duration = Math.min(800, Math.max(300, Math.abs(diff) * 0.08));
  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Smooth easeInOutCubic
    const ease =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, startY + diff * ease);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      // Re-verify after layout settling
      const finalRect = element?.getBoundingClientRect();
      if (finalRect && Math.abs(finalRect.top - headerOffset) > 4) {
        const adjustedY = Math.max(0, finalRect.top + window.pageYOffset - headerOffset);
        window.scrollTo(0, adjustedY);
      }
    }
  }

  requestAnimationFrame(step);
  return true;
}

export function scrollToTop(smooth = true) {
  if (typeof window === "undefined") return;
  const startY = window.pageYOffset;
  if (startY <= 0) return;

  if (!smooth) {
    window.scrollTo(0, 0);
    return;
  }

  const duration = Math.min(800, Math.max(300, startY * 0.08));
  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, startY * (1 - ease));

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      window.scrollTo(0, 0);
    }
  }

  requestAnimationFrame(step);
}

export function HashScrollHandler() {
  const pathname = usePathname();
  const lastScrolledHashRef = useRef<string | null>(null);

  // 1. Sanitize any stacked or duplicate hashes in window.location.hash
  const sanitizeHash = () => {
    if (typeof window === "undefined") return null;
    const currentHash = window.location.hash;
    if (!currentHash) return null;

    // Check if hash has multiple '#' like '#pricing#pricing' or '##'
    const parts = currentHash.split("#").filter(Boolean);
    if (parts.length > 0) {
      const singleHash = parts[0];
      if (currentHash !== `#${singleHash}`) {
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}#${singleHash}`
        );
      }
      return singleHash;
    }
    return null;
  };

  // 2. Handle hash navigation on route change / page load
  useEffect(() => {
    const cleanHash = sanitizeHash();
    if (!cleanHash) {
      lastScrolledHashRef.current = null;
      return;
    }

    lastScrolledHashRef.current = cleanHash;

    // Initial scroll attempt
    scrollToHash(cleanHash, true);

    // Follow-up scroll checks to accommodate layout shifts (motion animations, dynamic images, etc.)
    const timer1 = setTimeout(() => scrollToHash(cleanHash, true), 150);
    const timer2 = setTimeout(() => scrollToHash(cleanHash, true), 400);
    const timer3 = setTimeout(() => scrollToHash(cleanHash, true), 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname]);

  // 3. Listen to browser hashchange events
  useEffect(() => {
    const handleHashChange = () => {
      const cleanHash = sanitizeHash();
      if (cleanHash) {
        scrollToHash(cleanHash, true);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // 4. Capture-phase click interceptor for same-page hash links across the entire app
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external, target=_blank, and modified clicks
      if (
        anchor.target === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      const targetPath = href.slice(0, hashIndex) || "/";
      const rawHash = href.slice(hashIndex + 1);
      const cleanHash = rawHash.replace(/^#+/, "").split("#")[0]?.trim();
      if (!cleanHash) return;

      const currentPath = window.location.pathname;
      const isCurrentPage =
        currentPath === targetPath || (currentPath === "/" && targetPath === "/");

      if (isCurrentPage) {
        // Prevent default and stop Next.js router from triggering a transition or stacking hashes
        e.preventDefault();

        // Smooth scroll to the target element
        scrollToHash(cleanHash, true);

        // Clean URL update without stacking
        const cleanUrl = `${targetPath === "/" ? "" : targetPath}#${cleanHash}` || `/#${cleanHash}`;
        if (window.location.hash !== `#${cleanHash}`) {
          window.history.pushState(null, "", cleanUrl);
        } else {
          window.history.replaceState(null, "", cleanUrl);
        }
      }
    };

    // Use capture phase to intercept before Next.js Link handlers
    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
    };
  }, []);

  return null;
}
