"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    chrome?: {
      runtime?: {
        sendMessage: (
          extensionId: string,
          message: unknown,
          callback?: (response: unknown) => void,
        ) => void;
      };
    };
  }
}

const EXTENSION_IDS: string[] = [];

export function ExtensionAuthSync() {
  const { data: session, status } = useSession();
  const lastSyncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) {
      return;
    }

    const sessionKey = session.user.email || session.user.name || "user";
    if (lastSyncedRef.current === sessionKey) {
      return;
    }

    // Also notify via postMessage for the content script to pick up
    // This doesn't require knowing the extension ID
    const broadcastSync = () => {
      window.postMessage({ type: "LAZEE_SYNC_AUTH", session: !!session }, window.location.origin);
    };

    // Broadcast immediately
    broadcastSync();
    
    // Also broadcast after a short delay to catch the content script if it's still loading
    setTimeout(broadcastSync, 1000);
    setTimeout(broadcastSync, 3000);

    if (!window.chrome?.runtime?.sendMessage) {
      return;
    }

    const authData = {
      token: "session",
      user: {
        id: (session.user as { id?: string }).id || "",
        name: session.user.name || null,
        email: session.user.email || null,
        image: session.user.image || null,
      },
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };

    const tryExtensionIds = [...EXTENSION_IDS];

    const urlParams = new URLSearchParams(window.location.search);
    const extensionIdFromUrl = urlParams.get("extensionId");
    if (extensionIdFromUrl) {
      tryExtensionIds.unshift(extensionIdFromUrl);
    }
    
    const injectedId = (window as any).LAZEE_EXTENSION_ID;
    if (injectedId && !tryExtensionIds.includes(injectedId)) {
      tryExtensionIds.unshift(injectedId);
    }

    for (const extensionId of tryExtensionIds) {
      if (!extensionId) continue;

      try {
        window.chrome.runtime.sendMessage(
          extensionId,
          { type: "LAZEE_AUTH_TOKEN", payload: authData },
          (response) => {
            if (
              response &&
              typeof response === "object" &&
              "success" in response &&
              response.success
            ) {
              // Auth synced with extension
              lastSyncedRef.current = sessionKey;
              localStorage.setItem("lazeeExtensionId", extensionId);
              
              if (urlParams.get("extensionId")) {
                window.location.href = `chrome-extension://${extensionId}/popup.html`;
              }
            }
          },
        );
      } catch (error) {
        console.debug("[Lazee.dev] Could not sync with extension:", error);
      }
    }
  }, [session, status]);

  useEffect(() => {
    if (status === "unauthenticated" && lastSyncedRef.current) {
      // Notify extension via postMessage
      window.postMessage({ type: "LAZEE_SYNC_AUTH" }, window.location.origin);

      const urlParams = new URLSearchParams(window.location.search);
      const extensionId =
        urlParams.get("extensionId") ||
        localStorage.getItem("lazeeExtensionId");

      if (extensionId && window.chrome?.runtime?.sendMessage) {
        try {
          window.chrome.runtime.sendMessage(
            extensionId,
            { type: "LAZEE_AUTH_LOGOUT" },
            () => {
              lastSyncedRef.current = null;
              localStorage.removeItem("lazeeExtensionId");
            },
          );
        } catch {
          // Failed to log out
        }
      }
    }
  }, [status]);
  useEffect(() => {
    const handleIdReady = () => {
      // Re-trigger the sync effect by touching session or status if needed
      // Actually, since the main effect depends on status, 
      // we just need to ensure it runs again.
      // For now, simple re-eval is enough if status is already authenticated.
      lastSyncedRef.current = null; // Reset to force re-sync
    };
    window.addEventListener("LAZEE_ID_READY" as any, handleIdReady);
    return () => window.removeEventListener("LAZEE_ID_READY" as any, handleIdReady);
  }, []);

  return null;
}
