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
              console.log("[Lazee.dev] Auth synced with extension");
              lastSyncedRef.current = sessionKey;
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
      const urlParams = new URLSearchParams(window.location.search);
      const extensionId = urlParams.get("extensionId");

      if (extensionId && window.chrome?.runtime?.sendMessage) {
        try {
          window.chrome.runtime.sendMessage(
            extensionId,
            { type: "LAZEE_AUTH_LOGOUT" },
            () => {
              lastSyncedRef.current = null;
            },
          );
        } catch {
          console.log("Failed to log out");
        }
      }
    }
  }, [status]);
  return null;
}
