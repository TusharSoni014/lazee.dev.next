import prisma from "@/lib/prisma";

/**
 * Lazee AI runs on OpenRouter's free models, and those slugs get removed
 * without notice. This keeps the active model on a model that is still in
 * the free text-generation list, and moves to the next one when OpenRouter
 * says the current one is no longer free.
 */

const MODELS_URL = "https://openrouter.ai/api/v1/models";
const CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";
const SETTING_KEY = "openrouter_model";
const MODELS_TTL_MS = 10 * 60 * 1000;

export interface FreeTextModel {
  id: string;
  name: string;
  /** `text->text`, not a preview that also takes image, audio, or video. */
  textOnly: boolean;
}

interface OpenRouterModel {
  id?: string;
  name?: string;
  pricing?: { prompt?: string; completion?: string };
  architecture?: {
    modality?: string;
    output_modalities?: string[];
  };
}

let modelsCache: { at: number; models: FreeTextModel[] } | null = null;
let activeModel: string | null = null;
/** Slugs OpenRouter rejected during this process. */
const retired = new Set<string>();
let switching: Promise<string> | null = null;

export function isFreeTextModel(model: OpenRouterModel): boolean {
  const id = model.id ?? "";
  if (!id) return false;
  const prompt = Number(model.pricing?.prompt);
  const completion = Number(model.pricing?.completion);
  const free =
    id.endsWith(":free") ||
    (prompt === 0 && completion === 0 && !Number.isNaN(prompt));
  if (!free) return false;
  const outputs = model.architecture?.output_modalities ?? [];
  if (outputs.length > 0 && !outputs.includes("text")) return false;
  const modality = model.architecture?.modality ?? "";
  if (modality.includes("->image") || modality.includes("->audio")) return false;
  return true;
}

/** OpenRouter puts this in the HTTP error, and sometimes in the answer text. */
export function isModelGoneError(message: string): boolean {
  return /unavailable for free|no longer available|not a valid model|no endpoints found|model not found/i.test(
    message,
  );
}

export async function listFreeTextModels(): Promise<FreeTextModel[]> {
  if (modelsCache && Date.now() - modelsCache.at < MODELS_TTL_MS) {
    return modelsCache.models;
  }
  const response = await fetch(MODELS_URL, { cache: "no-store" });
  if (!response.ok) {
    if (modelsCache) return modelsCache.models;
    throw new Error("Could not load OpenRouter's model list.");
  }
  const body = (await response.json()) as { data?: OpenRouterModel[] };
  const models = (body.data ?? [])
    .filter(isFreeTextModel)
    .map((model) => ({
      id: model.id as string,
      name: model.name || (model.id as string),
      textOnly: model.architecture?.modality === "text->text",
    }));
  modelsCache = { at: Date.now(), models };
  return models;
}

async function readSavedModel(): Promise<string | null> {
  try {
    const row = await prisma.appSetting.findUnique({
      where: { key: SETTING_KEY },
    });
    return row?.value || null;
  } catch {
    return null;
  }
}

async function saveModel(id: string): Promise<void> {
  activeModel = id;
  try {
    await prisma.appSetting.upsert({
      where: { key: SETTING_KEY },
      create: { key: SETTING_KEY, value: id },
      update: { value: id },
    });
  } catch (error) {
    console.error("[Lazee AI] Could not save the active model:", error);
  }
}

/**
 * The model Lazee AI should call. A saved choice wins while it is still a
 * free text model; otherwise the env default, otherwise the first live one.
 * A model that is no longer free is replaced and saved.
 */
export async function getActiveLazeeModel(): Promise<string> {
  const models = await listFreeTextModels().catch(() => [] as FreeTextModel[]);
  const live = new Set(models.map((model) => model.id));
  const usable = (id: string | null | undefined) =>
    !!id && !retired.has(id) && (live.size === 0 || live.has(id));

  if (usable(activeModel)) return activeModel as string;

  const saved = await readSavedModel();
  const envModel = process.env.AI_MODEL || null;
  // Used only when nothing valid is saved. A manual choice is kept as-is.
  const fresh = models.find(
    (model) =>
      !retired.has(model.id) &&
      model.textOnly &&
      model.id.endsWith(":free") &&
      !model.id.startsWith("stealth/"),
  );
  const chosen =
    [saved, envModel].find((id) => usable(id)) ||
    fresh?.id ||
    models.find((model) => !retired.has(model.id))?.id ||
    envModel ||
    "nvidia/nemotron-3-nano-30b-a3b:free";

  if (chosen !== saved) await saveModel(chosen);
  else activeModel = chosen;
  return chosen;
}

/** Saves a model from the free text list. The next failure moves off it. */
export async function setActiveLazeeModel(id: string): Promise<string> {
  const models = await listFreeTextModels();
  if (!models.some((model) => model.id === id)) {
    throw new Error("That model is not in the free text list.");
  }
  retired.delete(id);
  await saveModel(id);
  return id;
}

async function retireAndSwitch(failed: string): Promise<string> {
  if (switching) return switching;
  switching = (async () => {
    retired.add(failed);
    if (activeModel === failed) activeModel = null;
    modelsCache = null;
    const models = await listFreeTextModels().catch(() => [] as FreeTextModel[]);
    const start = models.findIndex((model) => model.id === failed);
    const ordered =
      start >= 0
        ? [...models.slice(start + 1), ...models.slice(0, start)]
        : models;
    const next = ordered.find((model) => !retired.has(model.id));
    if (!next) {
      throw new Error("No free text model is available on OpenRouter right now.");
    }
    await saveModel(next.id);
    console.log(`[Lazee AI] ${failed} is no longer free. Switched to ${next.id}.`);
    return next.id;
  })().finally(() => {
    switching = null;
  });
  return switching;
}

export async function lazeeChat(options: {
  messages: { role: string; content: string }[];
  temperature?: number;
  top_p?: number;
  top_k?: number;
}): Promise<string> {
  let lastError = "Error generating AI response";

  for (let attempt = 0; attempt < 3; attempt++) {
    const model = await getActiveLazeeModel();
    let response: Response;
    try {
      response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://lazee.dev",
          "X-Title": "Lazee Dev",
        },
        body: JSON.stringify({
          model,
          messages: options.messages,
          temperature: options.temperature,
          top_p: options.top_p,
          top_k: options.top_k,
          stream: false,
        }),
      });
    } catch {
      lastError = "Could not reach OpenRouter.";
      await retireAndSwitch(model);
      continue;
    }

    const data = (await response.json().catch(() => ({}))) as {
      error?: { message?: string };
      choices?: { message?: { content?: unknown } }[];
    };
    const errorMessage = data.error?.message || "";
    if (!response.ok || (errorMessage && isModelGoneError(errorMessage))) {
      lastError = errorMessage || `OpenRouter returned ${response.status}`;
      // A bad key or a rate limit is not this model's fault.
      if (response.status === 401 || response.status === 403 || response.status === 429) {
        throw new Error(lastError);
      }
      await retireAndSwitch(model);
      continue;
    }

    const content = data.choices?.[0]?.message?.content;
    const text =
      typeof content === "string"
        ? content
        : Array.isArray(content)
          ? content
              .map((part) =>
                part && typeof part === "object" && "text" in part
                  ? String((part as { text?: string }).text ?? "")
                  : "",
              )
              .join("")
          : "";

    if (!text.trim()) {
      lastError = "No response from AI model";
      await retireAndSwitch(model);
      continue;
    }
    if (isModelGoneError(text)) {
      lastError = text.trim();
      await retireAndSwitch(model);
      continue;
    }
    return text;
  }

  throw new Error(lastError);
}
