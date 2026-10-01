import type { ByokProviderId } from "@/lib/byok";

export interface ProviderMeta {
  name: string;
  /** Short product name shown in badges. */
  short: string;
  description: string;
  needsKey: boolean;
  keyLabel: string;
  keyPlaceholder: string;
  keyHelpUrl?: string;
  modelPlaceholder: string;
}

export const PROVIDER_META: Record<ByokProviderId, ProviderMeta> = {
  openai: {
    name: "ChatGPT (OpenAI)",
    short: "OpenAI",
    description: "Use your OpenAI API key with GPT models.",
    needsKey: true,
    keyLabel: "OpenAI API key",
    keyPlaceholder: "sk-...",
    keyHelpUrl: "https://platform.openai.com/api-keys",
    modelPlaceholder: "e.g. gpt-4o-mini",
  },
  anthropic: {
    name: "Claude (Anthropic)",
    short: "Claude",
    description: "Use your Anthropic API key with Claude models.",
    needsKey: true,
    keyLabel: "Anthropic API key",
    keyPlaceholder: "sk-ant-...",
    keyHelpUrl: "https://console.anthropic.com/settings/keys",
    modelPlaceholder: "e.g. claude-sonnet-4-5",
  },
  gemini: {
    name: "Gemini (Google)",
    short: "Gemini",
    description: "Use a Google AI Studio API key with Gemini models.",
    needsKey: true,
    keyLabel: "Gemini API key",
    keyPlaceholder: "AIza...",
    keyHelpUrl: "https://aistudio.google.com/apikey",
    modelPlaceholder: "e.g. gemini-2.5-flash",
  },
  xai: {
    name: "Grok (xAI)",
    short: "Grok",
    description: "Use your xAI API key with Grok models.",
    needsKey: true,
    keyLabel: "xAI API key",
    keyPlaceholder: "xai-...",
    keyHelpUrl: "https://console.x.ai",
    modelPlaceholder: "e.g. grok-4",
  },
  custom: {
    name: "Custom / Local model",
    short: "Custom",
    description:
      "Run models on your own machine with Ollama or LM Studio, or connect any OpenAI-compatible endpoint.",
    needsKey: false,
    keyLabel: "API key (optional)",
    keyPlaceholder: "Only if your endpoint requires one",
    modelPlaceholder: "e.g. llama3.2",
  },
};

export type CustomPresetId = "ollama" | "lmstudio" | "other";

export const CUSTOM_PRESETS: Record<
  CustomPresetId,
  { label: string; baseUrl: string; help: string }
> = {
  ollama: {
    label: "Ollama",
    baseUrl: "http://localhost:11434/v1",
    help: "Start Ollama and pull a model (e.g. `ollama pull llama3.2`). The server runs on port 11434 by default.",
  },
  lmstudio: {
    label: "LM Studio",
    baseUrl: "http://localhost:1234/v1",
    help: "In LM Studio open the Developer tab, load a model and start the local server (port 1234 by default).",
  },
  other: {
    label: "Other (OpenAI-compatible)",
    baseUrl: "",
    help: "Any server exposing /v1/chat/completions: llama.cpp, vLLM, OpenRouter, Groq, Together, a LAN machine, etc.",
  },
};
