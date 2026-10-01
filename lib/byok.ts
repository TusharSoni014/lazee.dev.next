/**
 * "Bring Your Own AI" (BYOK) settings shared by the server.
 *
 * With BYOK the user's own provider key (or local model) pays for inference, so
 * no Lazee credits are used and the model call never touches this server.
 */

/**
 * When a user runs the extension on their own AI provider, should the
 * PRO-only AI features (Cold DM, Express Fill) be available on the FREE plan?
 *
 * They are PRO-only today because they cost us inference money; with BYOK they
 * don't. Flip this to `false` to keep them PRO-only even for BYOK users.
 */
export const BYOK_UNLOCKS_PRO_FEATURES = true;

export const BYOK_PROVIDERS = [
  "openai",
  "anthropic",
  "gemini",
  "xai",
  "custom",
] as const;

export type ByokProviderId = (typeof BYOK_PROVIDERS)[number];
export type ActiveProviderId = ByokProviderId | "lazee";

export interface PublicProviderState {
  configured: boolean;
  hasKey: boolean;
  keyHint: string | null;
  baseUrl: string | null;
  model: string | null;
  preset: "ollama" | "lmstudio" | "other" | null;
}

export interface PublicAiSettings {
  active: ActiveProviderId;
  providers: Record<ByokProviderId, PublicProviderState>;
}
