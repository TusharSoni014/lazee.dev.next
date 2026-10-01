"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronDown,
  Download,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  PlugZap,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { useBrowser, type BrowserType } from "@/hooks/use-browser";
import { useProfileStatus } from "@/hooks/useProfile";
import { CHROME_EXTENSION_URL, FIREFOX_EXTENSION_URL } from "@/lib/constants";
import {
  BYOK_PROVIDERS,
  BYOK_UNLOCKS_PRO_FEATURES,
  type ByokProviderId,
  type PublicAiSettings,
  type PublicProviderState,
} from "@/lib/byok";
import {
  CUSTOM_PRESETS,
  PROVIDER_META,
  type CustomPresetId,
} from "@/lib/ai-provider-meta";
import {
  ExtensionNotFoundError,
  ExtensionOutdatedError,
  extensionAi,
  extensionSeenOnPage,
} from "@/lib/extension-bridge";

const DOWNLOAD_LINKS: Record<BrowserType, string> = {
  chrome: CHROME_EXTENSION_URL,
  edge: CHROME_EXTENSION_URL,
  firefox: FIREFOX_EXTENSION_URL,
  safari: CHROME_EXTENSION_URL,
  other: CHROME_EXTENSION_URL,
};

type ExtensionState = "checking" | "missing" | "outdated" | "error" | "ready";

const errorMessage = (err: unknown) =>
  err instanceof Error ? err.message : "Something went wrong.";

const labelClass =
  "block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5";

export function AiProvidersClient({
  initialMembership,
  initialCredits,
}: {
  initialMembership: string;
  initialCredits: number;
}) {
  const browser = useBrowser();
  const { data: status } = useProfileStatus({
    membership: initialMembership,
    credits: initialCredits,
  });
  const membership = status?.membership ?? initialMembership;
  const credits = status?.credits ?? initialCredits;

  const [ext, setExt] = useState<ExtensionState>("checking");
  const [settings, setSettings] = useState<PublicAiSettings | null>(null);
  const [switching, setSwitching] = useState(false);

  const [extError, setExtError] = useState("");
  const [foundInfo, setFoundInfo] = useState<{
    extensionId?: string;
    version?: string;
  } | null>(null);
  const [staleHint, setStaleHint] = useState(false);
  const [lazeeModels, setLazeeModels] = useState<{
    active: string;
    models: { id: string; name: string }[];
  } | null>(null);
  const [savingModel, setSavingModel] = useState<string | null>(null);

  const selectLazeeModel = async (id: string) => {
    if (!lazeeModels || id === lazeeModels.active || savingModel) return;
    setSavingModel(id);
    try {
      const res = await fetch("/api/ai/lazee-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.active) {
        throw new Error(data?.error || "Could not switch model.");
      }
      setLazeeModels(data);
      toast.success("Lazee AI model updated");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSavingModel(null);
    }
  };

  useEffect(() => {
    let cancel = false;
    fetch("/api/ai/lazee-model")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancel && data?.models) setLazeeModels(data);
      })
      .catch(() => {});
    return () => {
      cancel = true;
    };
  }, []);

  const connecting = useRef(false);
  const connect = useCallback(async () => {
    if (connecting.current) return;
    connecting.current = true;
    setExt("checking");
    try {
      setSettings(await extensionAi.getSettings());
      setExt("ready");
    } catch (err) {
      if (err instanceof ExtensionOutdatedError) {
        setFoundInfo({ extensionId: err.extensionId, version: err.version });
        setExt("outdated");
      } else if (err instanceof ExtensionNotFoundError) {
        // An old build may have announced before we mounted; the site's own
        // listener records that for this page load only.
        const liveId = (window as unknown as { LAZEE_EXTENSION_ID?: string })
          .LAZEE_EXTENSION_ID;
        if (liveId) {
          setFoundInfo({ extensionId: liveId });
          setExt("outdated");
        } else {
          setStaleHint(extensionSeenOnPage());
          setExt("missing");
        }
      } else {
        setExtError(errorMessage(err));
        setExt("error");
      }
    } finally {
      connecting.current = false;
    }
  }, []);

  useEffect(() => {
    connect();
  }, [connect]);

  // If an up-to-date extension shows up later (installed / reloaded while
  // this tab is open), connect straight away.
  const extRef = useRef(ext);
  useEffect(() => {
    extRef.current = ext;
  }, [ext]);
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (
        event.data?.type === "LAZEE_EXTENSION_READY" &&
        event.data.aiBridge &&
        extRef.current !== "ready" &&
        extRef.current !== "checking"
      ) {
        connect();
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [connect]);

  const activate = async (active: "lazee" | ByokProviderId) => {
    setSwitching(true);
    try {
      setSettings(await extensionAi.setActive(active));
      toast.success(
        active === "lazee"
          ? "Now using Lazee AI"
          : `Now using ${PROVIDER_META[active].name}`,
      );
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSwitching(false);
    }
  };

  const active = settings?.active ?? "lazee";
  const activeState = active !== "lazee" ? settings?.providers[active] : null;

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-24 transition-colors relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,88,12,0.04),transparent_50%)] pointer-events-none" />

      <div className="relative z-10 container mx-auto max-w-3xl px-4 py-8 md:py-12">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400 transition-colors mb-5"
        >
          <ArrowLeft className="size-3.5" />
          Back to profile
        </Link>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-700 dark:text-orange-400 text-xs font-medium mb-3">
            <span>Candidate Workspace</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span>AI Providers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white">
            AI Providers
          </h1>
          <p className="mt-2 max-w-xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            Power the extension with your own ChatGPT, Claude, Gemini or Grok
            key, or a local model from Ollama / LM Studio. Available on every
            plan.
          </p>
        </div>

        {/* Privacy / credits explainer */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <InfoTile
            icon={<ShieldCheck className="size-4" />}
            title="Keys stay on your device"
            body="API keys are stored only in your browser's extension storage. Requests go from the extension straight to your provider, never through Lazee servers."
          />
          <InfoTile
            icon={<Zap className="size-4" />}
            title="Your own AI uses 0 credits"
            body={
              BYOK_UNLOCKS_PRO_FEATURES
                ? "Lazee credits are only spent on Lazee AI. With your own provider, Cold DM and Express Fill are unlocked on every plan."
                : "Lazee credits are only spent on Lazee AI. Your own provider never touches your credit balance."
            }
          />
        </div>

        {ext === "checking" && (
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-8 flex items-center justify-center gap-3 text-sm text-zinc-500">
            <Loader2 className="size-4 animate-spin text-orange-500" />
            Connecting to the Lazee extension...
          </div>
        )}

        {ext === "missing" && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 md:p-8">
            <div className="flex items-start gap-3">
              <div className="size-9 shrink-0 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <PlugZap className="size-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Lazee extension not detected
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  AI providers are configured inside the extension so your keys
                  never leave your browser. Install or enable the extension,
                  keep this tab open, then retry.
                </p>
                {staleHint && (
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    This browser has used Lazee before, but no running extension
                    answered just now. If you&apos;re developing locally, the dev
                    build may not have loaded in this browser — see{" "}
                    <code>.output/chrome-mv3-dev</code> /{" "}
                    <code>.output/firefox-mv2-dev</code> and load it from the
                    extensions page, then refresh.
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <a
                      href={DOWNLOAD_LINKS[browser]}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Download className="size-3.5" />
                      Get the extension
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" onClick={connect}>
                    <RefreshCw className="size-3.5" />
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {ext === "outdated" && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 md:p-8">
            <div className="flex items-start gap-3">
              <div className="size-9 shrink-0 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <RefreshCw className="size-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Extension found, but it needs an update
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Your Lazee extension is connected to your account, but this
                  version doesn&apos;t support AI providers yet. Update it from
                  the store (or reload it from your browser&apos;s extensions
                  page if you&apos;re running a local build), then refresh this
                  page.
                </p>
                {foundInfo?.extensionId && (
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed break-all">
                    Detected: <code>{foundInfo.extensionId}</code>
                    {foundInfo.version ? ` (v${foundInfo.version})` : " (old build)"}
                    . Running <code>wxt dev</code>? This is a different,
                    already-installed copy — the dev build isn&apos;t the one
                    answering. In Chrome, load <code>.output/chrome-mv3-dev</code>{" "}
                    via chrome://extensions → Load unpacked (and disable the
                    installed copy); in Firefox, remove the installed add-on and
                    use about:debugging → Load Temporary Add-on.
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <a
                      href={DOWNLOAD_LINKS[browser]}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Download className="size-3.5" />
                      Get the latest version
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" onClick={connect}>
                    <RefreshCw className="size-3.5" />
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {ext === "error" && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6 md:p-8">
            <div className="flex items-start gap-3">
              <div className="size-9 shrink-0 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
                <AlertCircle className="size-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  The extension reported a problem
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed break-words">
                  {extError}
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" onClick={connect}>
                    <RefreshCw className="size-3.5" />
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {ext === "ready" && settings && (
          <div className="space-y-4">
            {/* Currently active */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Currently using
                </p>
                <p className="mt-0.5 text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {active === "lazee"
                    ? "Lazee AI"
                    : PROVIDER_META[active].name}
                  {activeState?.model && (
                    <span className="ml-2 font-mono text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {activeState.model}
                    </span>
                  )}
                </p>
              </div>
              <span
                className={clsx(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border",
                  active === "lazee"
                    ? "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20"
                    : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
                )}
              >
                {active === "lazee" ? (
                  <>
                    <Zap className="size-3.5" />
                    {Intl.NumberFormat("en-US").format(credits)} credits
                  </>
                ) : (
                  <>
                    <KeyRound className="size-3.5" />
                    Your own key • 0 credits used
                  </>
                )}
              </span>
            </div>

            {/* Lazee AI */}
            <div
              className={clsx(
                "rounded-2xl border bg-white dark:bg-zinc-900/90 p-5 shadow-xs flex flex-col gap-4 transition-colors",
                active === "lazee"
                  ? "border-orange-500/40"
                  : "border-zinc-200/80 dark:border-zinc-800",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="size-10 shrink-0 rounded-xl overflow-hidden shadow-xs flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="Lazee AI"
                    className="size-full object-cover select-none"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Lazee AI
                    </h3>
                    {membership === "PRO" && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        Pro
                      </span>
                    )}
                    {active === "lazee" && <ActiveBadge />}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Our hosted models, tuned for applications. Uses your Lazee
                    credits.
                  </p>
                </div>
              </div>
              {active !== "lazee" && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={switching}
                  onClick={() => activate("lazee")}
                >
                  Use Lazee AI
                </Button>
              )}
              </div>
              {lazeeModels && lazeeModels.models.length > 0 && (
                <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/40 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Free text models
                  </p>
                  <ul className="mt-2 max-h-40 overflow-y-auto space-y-1">
                    {lazeeModels.models.map((model) => {
                      const selected = model.id === lazeeModels.active;
                      return (
                        <li key={model.id}>
                          <button
                            type="button"
                            disabled={selected || savingModel !== null}
                            onClick={() => selectLazeeModel(model.id)}
                            className={clsx(
                              "flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1 text-left text-xs transition-colors",
                              selected
                                ? "bg-orange-500/10 text-orange-700 dark:text-orange-300"
                                : "text-zinc-600 hover:bg-zinc-100 disabled:hover:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800/80",
                            )}
                          >
                            <span className="min-w-0 truncate">{model.name}</span>
                            <span className="shrink-0 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                              {savingModel === model.id
                                ? "saving"
                                : selected
                                  ? "active"
                                  : "use"}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-2 text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
                    Click a model to use it. Lazee AI is on{" "}
                    <span className="font-mono">{lazeeModels.active}</span>. If
                    that model stops answering, the next free text model is
                    selected and saved automatically.
                  </p>
                </div>
              )}
            </div>

            <p className="pt-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Bring your own
            </p>

            {BYOK_PROVIDERS.map((id) => (
              <ProviderCard
                key={id}
                id={id}
                state={settings.providers[id]}
                isActive={active === id}
                onSettings={setSettings}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoTile({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 p-4 flex gap-3">
      <div className="size-8 shrink-0 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {body}
        </p>
      </div>
    </div>
  );
}

function ActiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
      <Check className="size-3" />
      Active
    </span>
  );
}

const AVATAR: Record<
  ByokProviderId,
  { className: string; icon: React.ReactNode }
> = {
  openai: {
    className: "bg-[#10a37f]",
    icon: (
      <img
        src="/openai.svg"
        alt="OpenAI"
        className="size-5.5 brightness-0 invert select-none"
      />
    ),
  },
  anthropic: {
    className: "bg-[#d97757]",
    icon: (
      <img
        src="/claude.svg"
        alt="Claude"
        className="size-5.5 brightness-0 invert select-none"
      />
    ),
  },
  gemini: {
    className: "bg-white border border-zinc-200/80 shadow-xs",
    icon: (
      <img
        src="/gemini.svg"
        alt="Gemini"
        className="size-6 select-none object-contain block m-auto"
      />
    ),
  },
  xai: {
    className: "bg-black dark:bg-zinc-950 border border-zinc-800",
    icon: (
      <img
        src="/grok.svg"
        alt="Grok"
        className="size-5 brightness-0 invert select-none"
      />
    ),
  },
  custom: {
    className: "bg-violet-600 text-white font-mono text-xs font-bold",
    icon: "</>",
  },
};

function ProviderCard({
  id,
  state,
  isActive,
  onSettings,
}: {
  id: ByokProviderId;
  state: PublicProviderState;
  isActive: boolean;
  onSettings: (s: PublicAiSettings) => void;
}) {
  const meta = PROVIDER_META[id];
  const isCustom = id === "custom";

  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [preset, setPreset] = useState<CustomPresetId>(state.preset ?? "ollama");
  const [baseUrl, setBaseUrl] = useState(
    state.baseUrl ?? CUSTOM_PRESETS.ollama.baseUrl,
  );
  const [model, setModel] = useState(state.model ?? "");
  const [models, setModels] = useState<string[]>([]);
  const [manualModel, setManualModel] = useState(false);
  const [busy, setBusy] = useState<
    null | "models" | "test" | "save" | "remove"
  >(null);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  // Keep in sync when the model is changed elsewhere (e.g. from the popup).
  useEffect(() => {
    setModel(state.model ?? "");
  }, [state.model]);

  const hasCredentials = isCustom ? !!baseUrl.trim() : !!apiKey || state.hasKey;
  const canSave = hasCredentials && !!model.trim();

  const fetchModels = useCallback(
    async (silent = false) => {
      if (!hasCredentials) {
        if (!silent) {
          setResult({
            ok: false,
            message: isCustom
              ? "Enter the endpoint URL first."
              : `Enter your ${meta.short} API key first.`,
          });
        }
        return;
      }
      setBusy("models");
      if (!silent) setResult(null);
      try {
        const { models: list } = await extensionAi.listModels({
          providerId: id,
          apiKey: apiKey || undefined,
          baseUrl: isCustom ? baseUrl : undefined,
          preset: isCustom ? preset : undefined,
        });
        setModels(list);
        setManualModel(false);
        if (list.length === 0) {
          if (!silent) {
            setResult({
              ok: false,
              message:
                "Connected, but no models were returned. Type a model id manually.",
            });
          }
          setManualModel(true);
        } else if (!model) {
          setModel(list[0]);
        }
      } catch (err) {
        if (!silent) setResult({ ok: false, message: errorMessage(err) });
      } finally {
        setBusy(null);
      }
    },
    [hasCredentials, id, apiKey, baseUrl, preset, isCustom, meta.short, model],
  );

  // First time a configured card is opened, load its models in the background.
  useEffect(() => {
    if (open && state.configured && models.length === 0) fetchModels(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const save = async (activate: boolean) => {
    setBusy("save");
    setResult(null);
    try {
      const next = await extensionAi.saveProvider({
        providerId: id,
        apiKey: apiKey || undefined,
        baseUrl: isCustom ? baseUrl : undefined,
        preset: isCustom ? preset : undefined,
        model,
        activate,
      });
      onSettings(next);
      setApiKey("");
      toast.success(
        activate ? `${meta.name} saved and active` : `${meta.name} saved`,
      );
    } catch (err) {
      setResult({ ok: false, message: errorMessage(err) });
    } finally {
      setBusy(null);
    }
  };

  const test = async () => {
    setBusy("test");
    setResult(null);
    try {
      const res = await extensionAi.testProvider({
        providerId: id,
        apiKey: apiKey || undefined,
        baseUrl: isCustom ? baseUrl : undefined,
        preset: isCustom ? preset : undefined,
        model,
      });
      setResult({
        ok: true,
        message: `Working! ${meta.short} replied in ${(res.latencyMs / 1000).toFixed(1)}s.`,
      });
    } catch (err) {
      setResult({ ok: false, message: errorMessage(err) });
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    if (
      !window.confirm(
        `Remove ${meta.name}? Its saved key and settings will be deleted from this browser.`,
      )
    ) {
      return;
    }
    setBusy("remove");
    try {
      onSettings(await extensionAi.removeProvider(id));
      setApiKey("");
      setModels([]);
      setModel("");
      setResult(null);
      toast.success(`${meta.name} removed`);
    } catch (err) {
      setResult({ ok: false, message: errorMessage(err) });
    } finally {
      setBusy(null);
    }
  };

  const avatar = AVATAR[id];
  const modelOptions = model && !models.includes(model) ? [model, ...models] : models;

  return (
    <div
      className={clsx(
        "rounded-2xl border bg-white dark:bg-zinc-900/90 shadow-xs transition-colors overflow-hidden",
        isActive
          ? "border-emerald-500/40"
          : "border-zinc-200/80 dark:border-zinc-800",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full p-5 flex items-center gap-3.5 text-left cursor-pointer"
        aria-expanded={open}
      >
        <div
          className={clsx(
            "size-10 shrink-0 rounded-xl flex items-center justify-center shadow-xs overflow-hidden",
            avatar.className,
          )}
        >
          {avatar.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {meta.name}
            </h3>
            {isActive ? (
              <ActiveBadge />
            ) : state.configured ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                Connected
              </span>
            ) : null}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
            {state.configured && state.model ? (
              <>
                <span className="font-mono">{state.model}</span>
                {state.keyHint && <> • key {state.keyHint}</>}
              </>
            ) : (
              meta.description
            )}
          </p>
        </div>
        <ChevronDown
          className={clsx(
            "size-4 text-zinc-400 shrink-0 transition-transform duration-300 ease-out",
            open && "rotate-180 text-zinc-600 dark:text-zinc-200",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 space-y-4 border-t border-zinc-100 dark:border-zinc-800/80">
          {isCustom && (
            <div className="pt-4 space-y-3">
              <div>
                <label className={labelClass}>Server type</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(CUSTOM_PRESETS) as CustomPresetId[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPreset(p);
                        if (CUSTOM_PRESETS[p].baseUrl) {
                          setBaseUrl(CUSTOM_PRESETS[p].baseUrl);
                        } else if (preset !== "other") {
                          setBaseUrl("");
                        }
                        setModels([]);
                        setResult(null);
                      }}
                      className={clsx(
                        "px-3 h-8 rounded-lg border text-xs font-medium transition-colors cursor-pointer",
                        preset === p
                          ? "border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400"
                          : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60",
                      )}
                    >
                      {CUSTOM_PRESETS[p].label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {CUSTOM_PRESETS[preset].help}
                </p>
              </div>
              <div>
                <label className={labelClass}>Endpoint URL</label>
                <Input
                  value={baseUrl}
                  onChange={(e) => {
                    setBaseUrl(e.target.value);
                    setModels([]);
                  }}
                  placeholder="http://localhost:11434/v1"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>
          )}

          <div className={clsx(!isCustom && "pt-4")}>
            <div className="flex items-center justify-between">
              <label className={labelClass}>{meta.keyLabel}</label>
              {meta.keyHelpUrl && (
                <a
                  href={meta.keyHelpUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline mb-1.5"
                >
                  Get a key
                </a>
              )}
            </div>
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  state.hasKey
                    ? `Saved (${state.keyHint}). Enter a new key to replace it`
                    : meta.keyPlaceholder
                }
                autoComplete="off"
                spellCheck={false}
                className="pr-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                aria-label={showKey ? "Hide key" : "Show key"}
              >
                {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className={labelClass}>Model</label>
              <div className="flex items-center gap-3 mb-1.5">
                {models.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setManualModel((v) => !v)}
                    className="text-[11px] text-zinc-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400 cursor-pointer"
                  >
                    {manualModel ? "Pick from list" : "Type model id"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => fetchModels(false)}
                  disabled={busy !== null}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-orange-600 dark:text-orange-400 hover:underline disabled:opacity-50 cursor-pointer"
                >
                  {busy === "models" ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <RefreshCw className="size-3" />
                  )}
                  {models.length > 0 ? "Refresh models" : "Load models"}
                </button>
              </div>
            </div>
            {models.length > 0 && !manualModel ? (
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {modelOptions.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder={meta.modelPlaceholder}
                spellCheck={false}
                autoComplete="off"
                className="font-mono"
              />
            )}
          </div>

          {result && (
            <div
              className={clsx(
                "flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs leading-relaxed",
                result.ok
                  ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                  : "border-rose-500/20 bg-rose-500/5 text-rose-700 dark:text-rose-400",
              )}
            >
              {result.ok ? (
                <Check className="size-4 shrink-0 mt-px" />
              ) : (
                <AlertCircle className="size-4 shrink-0 mt-px" />
              )}
              <span className="break-words min-w-0">{result.message}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              size="sm"
              disabled={!canSave || busy !== null}
              onClick={() => save(true)}
            >
              {busy === "save" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Check className="size-3.5" />
              )}
              {isActive ? "Save" : "Save & use"}
            </Button>
            {!isActive && state.configured && (
              <Button
                variant="outline"
                size="sm"
                disabled={busy !== null}
                onClick={async () => {
                  setBusy("save");
                  try {
                    onSettings(await extensionAi.setActive(id));
                    toast.success(`Now using ${meta.name}`);
                  } catch (err) {
                    setResult({ ok: false, message: errorMessage(err) });
                  } finally {
                    setBusy(null);
                  }
                }}
              >
                Use this provider
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              disabled={!canSave || busy !== null}
              onClick={test}
            >
              {busy === "test" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <PlugZap className="size-3.5" />
              )}
              Test connection
            </Button>
            {(state.hasKey || state.configured) && (
              <Button
                variant="ghost"
                size="sm"
                disabled={busy !== null}
                onClick={remove}
                className="ml-auto text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                {busy === "remove" ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
                Remove
              </Button>
            )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  );
}
