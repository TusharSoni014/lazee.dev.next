"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Laptop } from "lucide-react";
import { useBrowser, type BrowserType } from "@/hooks/use-browser";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { toast } from "@/components/ui/toast";
import { CHROME_EXTENSION_URL, FIREFOX_EXTENSION_URL } from "@/lib/constants";

const DOWNLOAD_LINKS: Record<BrowserType, string> = {
  chrome: CHROME_EXTENSION_URL,
  edge: CHROME_EXTENSION_URL,
  firefox: FIREFOX_EXTENSION_URL,
  safari: CHROME_EXTENSION_URL,
  other: CHROME_EXTENSION_URL,
};

const DISMISS_KEY_PREFIX = "lazee_extension_prompt_dismissed_";

function ExtensionOnboardingContent({
  isInstalled,
  onAction,
  onDismiss,
}: {
  isInstalled: boolean;
  onAction: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="flex flex-col">
      <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex items-center gap-3.5">
        <div className="size-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
          {isInstalled ? (
            <img src="/logo.png" alt="Lazee.dev" className="size-full object-cover select-none" />
          ) : (
            <div className="size-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
          )}
        </div>
        <div className="min-w-0 text-left">
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            Welcome to Lazee
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal mt-0.5">
            Your account is ready — complete setup
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col items-center text-center gap-4">
        <div className="space-y-1.5 w-full">
          <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {isInstalled ? "Final Step" : "Install the Browser Extension"}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-sm mx-auto text-xs sm:text-sm px-1">
            {isInstalled ? (
              <>
                Click the{" "}
                <span className="text-orange-600 dark:text-orange-400 font-medium">
                  Lazee icon
                </span>{" "}
                in your browser toolbar to complete your login and start applying.
              </>
            ) : (
              <>
                You need the{" "}
                <span className="text-orange-600 dark:text-orange-400 font-medium">
                  Lazee extension
                </span>{" "}
                to auto-fill job applications across Workday, Greenhouse, Lever, and Ashby.
              </>
            )}
          </p>
        </div>

        <div className="w-full space-y-2 pt-1">
          <Button
            onClick={onAction}
            className="w-full h-10 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white font-medium text-xs sm:text-sm shadow-xs shadow-orange-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{isInstalled ? "I'll open it now" : "Download Extension"}</span>
            {isInstalled ? (
              <ArrowRight className="w-4 h-4 ml-1" />
            ) : (
              <Download className="w-4 h-4 ml-1" />
            )}
          </Button>

          <button
            onClick={onDismiss}
            className="w-full text-xs font-medium text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors py-1 cursor-pointer"
          >
            Maybe Later
          </button>
        </div>
      </div>

      <div className="bg-zinc-50/50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800 py-2.5 px-4 flex items-center justify-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
        <Laptop className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        <span>Desktop browser recommended for job applications</span>
      </div>
    </div>
  );
}

export function LoginSuccessModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [pendingOnboarding, setPendingOnboarding] = useState(false);
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();
  const browser = useBrowser();
  const width = useWindowWidth();
  const isMobile = width < 768;

  useEffect(() => {
    if (searchParams.get("logged_in") === "true") {
      setPendingOnboarding(true);

      const extensionId =
        searchParams.get("extensionId") ||
        localStorage.getItem("lazeeExtensionId");
      if (extensionId) {
        setIsInstalled(true);
      }

      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("logged_in");
      const queryString = newParams.toString();
      const newUrl =
        window.location.pathname + (queryString ? `?${queryString}` : "");
      window.history.replaceState(null, "", newUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!pendingOnboarding) return;
    if (sessionStatus === "loading") return;
    if (sessionStatus !== "authenticated" || !session?.user?.id) return;

    async function checkNewUserOnboarding() {
      try {
        const res = await fetch("/api/user/onboarding-status");
        if (!res.ok) return;

        const data = await res.json();
        if (!data.showExtensionPrompt) {
          setPendingOnboarding(false);
          return;
        }

        const resolvedUserId = data.userId || session?.user?.id;
        if (!resolvedUserId) return;

        const dismissKey = `${DISMISS_KEY_PREFIX}${resolvedUserId}`;
        if (localStorage.getItem(dismissKey) === "true") {
          await fetch("/api/user/onboarding-status", { method: "POST" });
          setPendingOnboarding(false);
          return;
        }

        setUserId(resolvedUserId);
        setIsOpen(true);
        setPendingOnboarding(false);
      } catch {
        setPendingOnboarding(false);
      }
    }

    checkNewUserOnboarding();
  }, [pendingOnboarding, sessionStatus, session?.user?.id]);

  const dismissOnboarding = async () => {
    if (userId) {
      localStorage.setItem(`${DISMISS_KEY_PREFIX}${userId}`, "true");
    }
    try {
      await fetch("/api/user/onboarding-status", { method: "POST" });
    } catch {
      // Ignore dismiss failures
    }
    setIsOpen(false);
  };

  const handleAction = () => {
    if (isInstalled) {
      dismissOnboarding();
      toast.success("Success! Click the Lazee icon in your toolbar to activate.");
    } else {
      window.open(DOWNLOAD_LINKS[browser], "_blank");
      dismissOnboarding();
    }
  };

  const content = (
    <ExtensionOnboardingContent
      isInstalled={isInstalled}
      onAction={handleAction}
      onDismiss={dismissOnboarding}
    />
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          className="p-0 gap-0 border-t border-zinc-200 dark:border-zinc-800 max-h-[90dvh]"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Welcome to Lazee</SheetTitle>
          <SheetDescription className="sr-only">
            Download the Lazee browser extension to get started
          </SheetDescription>
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Welcome to Lazee</DialogTitle>
        <DialogDescription className="sr-only">
          Download the Lazee browser extension to get started
        </DialogDescription>
        {content}
      </DialogContent>
    </Dialog>
  );
}
