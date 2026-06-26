import { ReactNode } from "react";
import { useBrowser } from "@/hooks/use-browser";
import { CHROME_EXTENSION_URL, FIREFOX_EXTENSION_URL } from "@/lib/constants";

interface InstallModalProps {
  children: ReactNode;
}

export function InstallModal({ children }: InstallModalProps) {
  const browser = useBrowser();
  const link = browser === "firefox" ? FIREFOX_EXTENSION_URL : CHROME_EXTENSION_URL;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full block"
    >
      {children}
    </a>
  );
}
