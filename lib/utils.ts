import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPublicImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  const privatePrefix = "https://a0597f9fc5b865c8086918a23f47f44b.r2.cloudflarestorage.com/lazee-dev";
  const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-889628534b094cf89bcd7cd93528323d.r2.dev";
  
  if (url.startsWith(privatePrefix)) {
    return url.replace(privatePrefix, publicBase);
  }
  return url;
}

export function getR2KeyFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    
    if (pathname.startsWith("/lazee-dev/")) {
      return pathname.slice("/lazee-dev/".length);
    }
    return pathname.startsWith("/") ? pathname.slice(1) : pathname;
  } catch (e) {
    return null;
  }
}


