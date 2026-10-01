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

const EXTENSION_IDS: string[] = ["hkompooiicoamiambpjhbbmimjefgiii"];

/**
 * Tells the extension's content script who is logged in. The content script
 * only pushes the login token when the extension doesn't already have it, so
 * these messages are cheap. Nothing here may be sent in response to a sync
 * request, or the page and the content script ping-pong forever.
 */
export function ExtensionAuthSync() {
  const { data: session, status } = useSession();
  const lastSyncedRef = useRef<string | null>(null);
  const email = session?.user?.email ?? null;

  // Latest auth state for the message listener (which is registered once).
  const authRef = useRef({ status, email });
  useEffect(() => {
    authRef.current = { status, email };
  }, [status, email]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      localStorage.setItem("lazee_logged_in", "true");
    } else if (status === "unauthenticated") {
      localStorage.setItem("lazee_logged_in", "false");
    }
  }, [session, status]);

  // One announcement per auth state change.
  useEffect(() => {
    if (status === "loading") return;
    window.postMessage(
      status === "authenticated"
        ? { type: "LAZEE_SYNC_AUTH", session: true, email }
        : { type: "LAZEE_SYNC_AUTH", session: false },
      window.location.origin,
    );
  }, [status, email]);

  // Direct channel to the store build (Chrome externally_connectable).
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

    const injectedId = (window as { LAZEE_EXTENSION_ID?: string })
      .LAZEE_EXTENSION_ID;
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

  // Handshake: the content script may load before or after this component.
  // Ask it to announce once, and answer each announcement (one per extension
  // id) with a single sync hint.
  useEffect(() => {
    const answered = new Set<string>();

    const answer = (extensionId: string) => {
      (window as { LAZEE_EXTENSION_ID?: string }).LAZEE_EXTENSION_ID =
        extensionId;
      if (answered.has(extensionId)) return;
      answered.add(extensionId);
      const { status: s, email: e } = authRef.current;
      if (s === "loading") return;
      window.postMessage(
        s === "authenticated"
          ? { type: "LAZEE_SYNC_AUTH", session: true, email: e }
          : { type: "LAZEE_SYNC_AUTH", session: false },
        window.location.origin,
      );
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (
        event.data?.type === "LAZEE_EXTENSION_READY" &&
        typeof event.data.extensionId === "string"
      ) {
        answer(event.data.extensionId);
      } else if (event.data?.type === "LAZEE_REQUEST_AUTH_SYNC") {
        lastSyncedRef.current = null;
        window.postMessage({ type: "LAZEE_SYNC_AUTH" }, window.location.origin);
      }
    };

    const handleIdReady = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (typeof id === "string") {
        (window as { LAZEE_EXTENSION_ID?: string }).LAZEE_EXTENSION_ID = id;
      }
    };

    window.addEventListener("message", handleMessage);
    window.addEventListener("LAZEE_ID_READY", handleIdReady);
    window.postMessage({ type: "LAZEE_PING" }, window.location.origin);

    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("LAZEE_ID_READY", handleIdReady);
    };
  }, []);

  return null;
}
