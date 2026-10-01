"use client";

/**
 * Talks to the Lazee browser extension from the lazee.dev website.
 *
 * Transport: window.postMessage -> extension content script (lazee-auth) ->
 * extension background. API keys live ONLY inside the extension; the
 * background never returns them, only masked hints.
 */

import type {
  ByokProviderId,
  PublicAiSettings,
  ActiveProviderId,
} from "@/lib/byok";

type Action =
  | "getSettings"
  | "saveProvider"
  | "removeProvider"
  | "setActive"
  | "setModel"
  | "listModels"
  | "testProvider";

interface BridgeResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

/** The extension never answered (not installed, disabled, or an old build). */
export class ExtensionNotFoundError extends Error {
  constructor() {
    super("Lazee extension did not respond");
    this.name = "ExtensionNotFoundError";
  }
}

/**
 * True if an older Lazee extension build announced itself on this page
 * (it can sync login but doesn't know the AI bridge yet).
 */
export function extensionSeenOnPage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      !!(window as unknown as { LAZEE_EXTENSION_ID?: string }).LAZEE_EXTENSION_ID ||
      !!window.localStorage.getItem("lazeeExtensionId")
    );
  } catch {
    return false;
  }
}

let counter = 0;

function call<T>(
  action: Action,
  payload?: unknown,
  timeoutMs = 20_000,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const requestId = `ai-${Date.now()}-${++counter}`;

    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      clearTimeout(timer);
    };

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || data.type !== "LAZEE_AI_RESPONSE" || data.requestId !== requestId) {
        return;
      }
      cleanup();
      const response = data as BridgeResponse<T>;
      if (response.ok) resolve(response.data as T);
      else reject(new Error(response.error || "Something went wrong."));
    };

    const timer = setTimeout(() => {
      cleanup();
      reject(
        action === "getSettings"
          ? new ExtensionNotFoundError()
          : new Error("The extension took too long to respond."),
      );
    }, timeoutMs);

    window.addEventListener("message", onMessage);
    window.postMessage(
      { type: "LAZEE_AI_REQUEST", requestId, action, payload },
      window.location.origin,
    );
  });
}

export interface SaveProviderPayload {
  providerId: ByokProviderId;
  /** undefined = keep saved key, "" = remove it */
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  preset?: "ollama" | "lmstudio" | "other";
  activate?: boolean;
}

export const extensionAi = {
  /** Rejects with ExtensionNotFoundError when the extension isn't there. */
  getSettings: () => call<PublicAiSettings>("getSettings", undefined, 4_000),
  saveProvider: (payload: SaveProviderPayload) =>
    call<PublicAiSettings>("saveProvider", payload),
  removeProvider: (providerId: ByokProviderId) =>
    call<PublicAiSettings>("removeProvider", { providerId }),
  setActive: (active: ActiveProviderId, model?: string) =>
    call<PublicAiSettings>("setActive", { active, model }),
  setModel: (providerId: ByokProviderId, model: string) =>
    call<PublicAiSettings>("setModel", { providerId, model }),
  listModels: (payload: {
    providerId: ByokProviderId;
    apiKey?: string;
    baseUrl?: string;
    preset?: string;
  }) => call<{ models: string[] }>("listModels", payload, 30_000),
  testProvider: (payload: {
    providerId: ByokProviderId;
    apiKey?: string;
    baseUrl?: string;
    model?: string;
    preset?: string;
  }) =>
    call<{ provider: string; latencyMs: number; reply: string }>(
      "testProvider",
      payload,
      330_000, // local models can take minutes to load + answer
    ),
};
