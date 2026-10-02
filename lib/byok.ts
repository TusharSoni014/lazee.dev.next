/**
 * "Bring Your Own AI" (BYOK) settings shared by the server.
 *
 * With BYOK the user's own provider key (or local model) pays for inference, so
 * no Lazee credits are used and the model call never touches this server.
 */

/**
 * Cold DM and Express Fill are strictly PRO-only features across all providers
 * (including BYOK and local models). Free users cannot access them under any condition.
 */
export const BYOK_UNLOCKS_PRO_FEATURES = false;

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
