"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import clsx from "clsx";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import {
  BookmarkCheck,
  Check,
  ChevronDown,
  Files,
  KeyRound,
  Loader2,
  PlugZap,
  Send,
  ShieldCheck,
  BrainCircuit,
  UserRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { BYOK_PROVIDERS, type ByokProviderId } from "@/lib/byok";
import { PROVIDER_META } from "@/lib/ai-provider-meta";

/* -------------------------------------------------------------------------- */
/*  Shared bits                                                               */
/* -------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1] as const;

function ScreenshotFrame({
  src,
  alt,
  width,
  height,
  maxWidth,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  maxWidth: string;
}) {
  return (
    <div className={clsx("relative mx-auto w-full", maxWidth)}>
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-orange-500/15 via-orange-500/5 to-transparent blur-2xl" />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative rounded-[14px] shadow-xl shadow-zinc-900/10 dark:shadow-black/40 overflow-hidden"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 1024px) 440px, 90vw"
          className="h-auto w-full block select-none"
          draggable={false}
        />
        {/* One-time light sweep */}
        <motion.div
          aria-hidden
          initial={{ x: "-130%" }}
          whileInView={{ x: "230%" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, delay: 0.5, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-orange-300/25 to-transparent"
        />
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  BYOK demo (replica of the AI Providers page, static data)                 */
/* -------------------------------------------------------------------------- */

const AVATAR: Record<ByokProviderId, { className: string; icon: ReactNode }> = {
  openai: {
    className: "bg-[#10a37f]",
    icon: (
      <img
        src="/openai.svg"
        alt=""
        className="size-5 brightness-0 invert select-none"
      />
    ),
  },
  anthropic: {
    className: "bg-[#d97757]",
    icon: (
      <img
        src="/claude.svg"
        alt=""
        className="size-5 brightness-0 invert select-none"
      />
    ),
  },
  gemini: {
    className: "bg-white border border-zinc-200/80 shadow-xs",
    icon: (
      <img
        src="/gemini.svg"
        alt=""
        className="size-5 select-none object-contain block m-auto"
      />
    ),
  },
  xai: {
    className: "bg-black dark:bg-zinc-950 border border-zinc-800",
    icon: (
      <img
        src="/grok.svg"
        alt=""
        className="size-4 brightness-0 invert select-none"
      />
    ),
  },
  custom: {
    className: "bg-violet-600 text-white font-mono text-xs font-bold",
    icon: "</>",
  },
};

const DEMO: Record<
  ByokProviderId,
  { model: string; hint: string; latency: string; typed: string }
> = {
  openai: {
    model: "gpt-4o-mini",
    hint: "sk-…4f2a",
    latency: "0.8s",
    typed: "sk-proj-8f3k2d9a",
  },
  anthropic: {
    model: "claude-sonnet-4-5",
    hint: "sk-ant-…91c0",
    latency: "1.1s",
    typed: "sk-ant-api03-x7Qz",
  },
  gemini: {
    model: "gemini-2.5-flash",
    hint: "AIza…c7d1",
    latency: "0.7s",
    typed: "AIzaSyD4m2P9kQx",
  },
  xai: {
    model: "grok-4",
    hint: "xai-…b3e8",
    latency: "0.9s",
    typed: "xai-Kd82mQp1Lz7",
  },
  custom: {
    model: "google/gemma-4-12b-qat",
    hint: "",
    latency: "1.4s",
    typed: "http://localhost:1234/v1",
  },
};

type Phase = "typing" | "model" | "testing" | "ok";
interface DemoState {
  id: ByokProviderId | null;
  phase: Phase;
  typed: number;
}

const IDLE: DemoState = { id: null, phase: "typing", typed: 0 };

function FakeField({
  label,
  value,
  placeholder,
  mono = true,
  caret = false,
}: {
  label: string;
  value: string;
  placeholder: string;
  mono?: boolean;
  caret?: boolean;
}) {
  return (
    <div>
      <p className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
        {label}
      </p>
      <div
        className={clsx(
          "flex h-9 items-center rounded-lg border bg-white dark:bg-zinc-950 px-3 text-xs overflow-hidden transition-colors",
          caret
            ? "border-orange-500/60 ring-2 ring-orange-500/15"
            : "border-zinc-200 dark:border-zinc-800",
          mono && "font-mono",
        )}
      >
        {value ? (
          <span className="truncate text-zinc-900 dark:text-zinc-100">
            {value}
          </span>
        ) : (
          <span className="truncate text-zinc-400 dark:text-zinc-600">
            {placeholder}
          </span>
        )}
        {caret && (
          <span className="ml-0.5 inline-block h-3.5 w-px shrink-0 animate-pulse bg-orange-500" />
        )}
      </div>
    </div>
  );
}

function ProviderDemoCard({
  id,
  open,
  isActive,
  isConnected,
  demo,
  onToggle,
}: {
  id: ByokProviderId;
  open: boolean;
  isActive: boolean;
  isConnected: boolean;
  demo: DemoState;
  onToggle: () => void;
}) {
  const meta = PROVIDER_META[id];
  const script = DEMO[id];
  const avatar = AVATAR[id];
  const isCustom = id === "custom";
  const running = demo.id === id;
  const configured = isActive || isConnected;

  const typedText = script.typed.slice(0, demo.typed);
  const firstValue = running
    ? isCustom
      ? typedText
      : "•".repeat(typedText.length)
    : configured && !isCustom
      ? `Saved (${script.hint})`
      : isCustom && configured
        ? script.typed
        : "";
  const showModel = configured || (running && demo.phase !== "typing");

  return (
    <div
      className={clsx(
        "rounded-2xl border bg-white dark:bg-zinc-900/90 shadow-xs transition-colors overflow-hidden",
        isActive
          ? "border-emerald-500/40"
          : open
            ? "border-orange-500/30"
            : "border-zinc-200/80 dark:border-zinc-800",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full p-3.5 sm:p-4 flex items-center gap-3 text-left cursor-pointer"
      >
        <div
          className={clsx(
            "size-9 shrink-0 rounded-xl flex items-center justify-center shadow-xs overflow-hidden",
            avatar.className,
          )}
        >
          {avatar.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
              {meta.name}
            </h4>
            <AnimatePresence mode="wait" initial={false}>
              {isActive ? (
                <motion.span
                  key="active"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                >
                  <Check className="size-3" />
                  Active
                </motion.span>
              ) : isConnected ? (
                <motion.span
                  key="connected"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                >
                  Connected
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
            {configured ? (
              <>
                <span className="font-mono">{script.model}</span>
                {script.hint && <> • key {script.hint}</>}
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

      {/* CSS grid-rows transition instead of Motion's height: "auto", which
          measures layout and restores scroll position, cancelling in-progress
          smooth scrolls (e.g. nav links to #pricing) while this demo autoplays. */}
      <div
        aria-hidden={!open}
        className={clsx(
          "grid transition-[grid-template-rows,opacity] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="px-3.5 sm:px-4 pb-4 pt-3 space-y-3 border-t border-zinc-100 dark:border-zinc-800/80">
            <FakeField
              label={isCustom ? "Endpoint URL" : meta.keyLabel}
              value={firstValue}
              placeholder={
                isCustom ? "http://localhost:11434/v1" : meta.keyPlaceholder
              }
              caret={running && demo.phase === "typing"}
            />
            <FakeField
              label="Model"
              value={showModel ? script.model : ""}
              placeholder={meta.modelPlaceholder}
              caret={running && demo.phase === "model"}
            />

            <AnimatePresence>
              {running && demo.phase === "ok" && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400"
                >
                  <Check className="size-4 shrink-0 mt-px" />
                  <span>
                    Working! {meta.short} replied in {script.latency}.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={clsx(
                  "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors",
                  running && demo.phase === "ok"
                    ? "bg-orange-600 text-white"
                    : "bg-orange-600/90 text-white",
                )}
              >
                <Check className="size-3.5" />
                Save &amp; use
              </span>
              <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {running && demo.phase === "testing" ? (
                  <Loader2 className="size-3.5 animate-spin text-orange-500" />
                ) : (
                  <PlugZap className="size-3.5" />
                )}
                Test connection
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ByokDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-80px" });
  const reduced = useReducedMotion();

  const [demo, setDemo] = useState<DemoState>(IDLE);
  const [active, setActive] = useState<ByokProviderId | null>(null);
  const [connected, setConnected] = useState<ByokProviderId[]>([]);
  const [manualOpen, setManualOpen] = useState<
    ByokProviderId | null | undefined
  >(undefined);

  const pausedRef = useRef(false);

  // Reduced motion: render the end state statically.
  const staticEnd = !!reduced;

  useEffect(() => {
    if (!inView || staticEnd) return;
    let cancelled = false;

    const wait = async (ms: number) => {
      let elapsed = 0;
      while (elapsed < ms && !cancelled) {
        await new Promise((r) => setTimeout(r, 50));
        if (!pausedRef.current) elapsed += 50;
      }
    };

    const run = async () => {
      let prevActive: ByokProviderId | null = null;
      let done: ByokProviderId[] = [];
      while (!cancelled) {
        for (const id of BYOK_PROVIDERS) {
          if (cancelled) return;
          const script = DEMO[id];
          setDemo({ id, phase: "typing", typed: 0 });
          await wait(700);
          for (let n = 1; n <= script.typed.length; n++) {
            if (cancelled) return;
            setDemo({ id, phase: "typing", typed: n });
            await wait(id === "custom" ? 35 : 55);
          }
          await wait(250);
          setDemo({ id, phase: "model", typed: script.typed.length });
          await wait(800);
          setDemo({ id, phase: "testing", typed: script.typed.length });
          await wait(1100);
          setDemo({ id, phase: "ok", typed: script.typed.length });
          await wait(1100);
          if (prevActive) done = [...done, prevActive];
          prevActive = id;
          setConnected(done);
          setActive(id);
          setDemo(IDLE);
          await wait(900);
        }
        await wait(3500);
        prevActive = null;
        done = [];
        setActive(null);
        setConnected([]);
        await wait(600);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [inView, staticEnd]);

  const viewActive = staticEnd ? "custom" : active;
  const viewConnected = staticEnd
    ? (["openai", "anthropic", "gemini", "xai"] as ByokProviderId[])
    : connected;

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="Animated preview of the AI Providers page: ChatGPT, Claude, Gemini, Grok and a custom local model being connected with your own key."
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
        setManualOpen(undefined);
      }}
      className="relative w-full max-w-md mx-auto"
    >
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-orange-500/15 via-orange-500/5 to-transparent blur-2xl" />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: EASE }}
        className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3 sm:p-4 shadow-xl shadow-zinc-900/10 dark:shadow-black/40 space-y-2.5"
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 p-2.5 flex gap-2">
            <div className="size-6 shrink-0 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center">
              <ShieldCheck className="size-3.5" />
            </div>
            <p className="text-[10px] leading-snug text-zinc-500 dark:text-zinc-400">
              <span className="block font-semibold text-zinc-900 dark:text-zinc-100">
                Keys stay on device
              </span>
              Never sent to Lazee servers.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 p-2.5 flex gap-2">
            <div className="size-6 shrink-0 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center">
              <Zap className="size-3.5" />
            </div>
            <p className="text-[10px] leading-snug text-zinc-500 dark:text-zinc-400">
              <span className="block font-semibold text-zinc-900 dark:text-zinc-100">
                0 credits used
              </span>
              With your own AI.
            </p>
          </div>
        </div>

        <p className="pt-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Bring your own
        </p>

        {BYOK_PROVIDERS.map((id) => {
          // Keep one card open between demo steps so the section height stays
          // stable instead of jumping while people scroll past it.
          const open =
            manualOpen !== undefined
              ? manualOpen === id
              : (demo.id ?? viewActive ?? BYOK_PROVIDERS[0]) === id;
          return (
            <ProviderDemoCard
              key={id}
              id={id}
              open={open}
              isActive={viewActive === id}
              isConnected={viewConnected.includes(id)}
              demo={demo}
              onToggle={() => {
                pausedRef.current = true;
                setManualOpen(open ? null : id);
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Feature data                                                              */
/* -------------------------------------------------------------------------- */

interface Feature {
  tag: string;
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
  media: ReactNode;
}

const features: Feature[] = [
  {
    tag: "AI Fill",
    icon: BrainCircuit,
    title: "Answers that follow the exact format the form asks for.",
    description:
      'Lazee reads the question, adds your own instructions and writes an answer you can submit. Tell it "My prev package was 20LPA all cash" and get the Fixed / Variable / ESOPs breakdown the form wants with auto translation to required currency.',
    bullets: [
      "Handles format-specific questions like CTC, projects, experience, education, etc",
      "Optional instructions let you steer every answer",
      "Edit it, use it, or save it for next time",
    ],
    media: (
      <ScreenshotFrame
        src="https://pub-889628534b094cf89bcd7cd93528323d.r2.dev/assets/ai-fill.png"
        alt="Lazee AI Fill window turning a CTC question and a short instruction into a formatted answer"
        width={850}
        height={920}
        maxWidth="max-w-[400px]"
      />
    ),
  },
  {
    tag: "Express AI Fill",
    icon: Zap,
    title: "Fill every open question on the page in seconds.",
    description:
      "Long application forms are mostly the same few boxes. Express AI Fill finds every field, lets you tick the ones you want, and writes all the answers in one go.",
    bullets: [
      "Detects each field and shows its type (text, number, textarea)",
      "Choose exactly which fields the AI should fill",
      "See the credit cost up front, or use your own AI key for free",
    ],
    media: (
      <ScreenshotFrame
        src="https://pub-889628534b094cf89bcd7cd93528323d.r2.dev/assets/express-fill.png"
        alt="Express AI Fill window with four detected form fields selected and a Generate Responses button"
        width={948}
        height={949}
        maxWidth="max-w-[440px]"
      />
    ),
  },
  {
    tag: "Saved Q&A",
    icon: BookmarkCheck,
    title: "Write it once. Reuse it on every application.",
    description:
      '"What is the hardest problem you solved?" shows up everywhere. Save your best answers and drop them into any field with a single click.',
    bullets: [
      "Save any question and answer straight from the AI Fill window",
      "Search your library by question or answer text",
      "Click to insert into the active field, or copy it",
    ],
    media: (
      <ScreenshotFrame
        src="https://pub-889628534b094cf89bcd7cd93528323d.r2.dev/assets/saved-qa.png"
        alt="Lazee Saved Q&A tab listing saved questions and answers with a search bar"
        width={895}
        height={1020}
        maxWidth="max-w-[400px]"
      />
    ),
  },
  {
    tag: "Profile Data",
    icon: UserRound,
    title: "Your whole profile, one click away.",
    description:
      "Name, email, phone, city and every link you paste into forms live in one place. Click an item to fill the field, or Shift+click to copy it.",
    bullets: [
      "Quick-access buttons for email, phone, LinkedIn, GitHub and more",
      "Click to fill, Shift+click to copy",
      "Edit everything once on your dashboard",
    ],
    media: (
      <ScreenshotFrame
        src="https://pub-889628534b094cf89bcd7cd93528323d.r2.dev/assets/profile-data.png"
        alt="Lazee Profile Data tab with quick-access icons and a list of profile fields"
        width={893}
        height={1020}
        maxWidth="max-w-[400px]"
      />
    ),
  },
  {
    tag: "Resume Versions",
    icon: Files,
    title: "The right resume for every role.",
    description:
      "Keep a separate PDF for each kind of job. When an application asks for a resume, pick the one that fits and Lazee uploads it for you.",
    bullets: [
      "Maintain as many resume versions as you need*",
      "Pick one and it is attached to the form",
      "Reload to pick up new uploads from your dashboard",
    ],
    media: (
      <ScreenshotFrame
        src="https://pub-889628534b094cf89bcd7cd93528323d.r2.dev/assets/resumes.png"
        alt="Select Resume window listing three uploaded resume PDFs"
        width={948}
        height={763}
        maxWidth="max-w-[440px]"
      />
    ),
  },
  {
    tag: "Cold DM Generator",
    icon: Send,
    title: "Outreach that sounds like a person, not a template.",
    description:
      "Describe who you are writing to and where they work. Lazee drafts a cold email or DM that fits the person, the company and the tone you want.",
    bullets: [
      "Paste a short bio of the person and the company",
      "Let Lazee Scrape the job information for you, and craft personalized DMs in one click",
      "Pick the message type, like a job inquiry",
      "Four tones: Professional, Casual, Friendly and Gen Z",
    ],
    media: (
      <ScreenshotFrame
        src="https://pub-889628534b094cf89bcd7cd93528323d.r2.dev/assets/cold-dm.png"
        alt="AI Cold DM Generator with recipient details, message type and four tone options"
        width={800}
        height={1020}
        maxWidth="max-w-[380px]"
      />
    ),
  },
  {
    tag: "Bring Your Own AI",
    icon: KeyRound,
    title: "Use ChatGPT, Claude, Gemini, Grok or a model on your own machine.",
    description:
      "Plug in your own API key, or point Lazee at a local model running in Ollama or LM Studio. Switch providers whenever you like.",
    bullets: [
      "Keys live in your browser's extension storage, never on Lazee servers",
      "Your own AI uses 0 Lazee credits",
      "Form field answering and custom AI prompts use 0 Lazee credits",
    ],
    media: <ByokDemo />,
  },
];

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export function HowItWorksSection() {
  return (
    <motion.section
      id="workflow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: EASE }}
      className="w-full my-12 sm:my-20"
    >
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-mono font-medium mb-3">
          <span>Inside the extension</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Everything Lazee does, right inside the form
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
          Seven tools that take the typing out of job hunting, from instant
          profile fill to AI answers and cold outreach.
        </p>
      </div>

      <div className="flex flex-col gap-16 sm:gap-24 max-w-5xl mx-auto">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          const flip = idx % 2 === 0;
          return (
            <div
              key={feature.tag}
              className="grid grid-cols-1 lg:grid-cols-2 items-start gap-10 lg:gap-16"
            >
              <motion.div
                initial={{ opacity: 0, x: flip ? 24 : -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease: EASE }}
                className={clsx(
                  "order-1 flex flex-col items-start",
                  flip ? "lg:order-2" : "lg:order-1",
                )}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-semibold">
                    <Icon className="size-3.5" />
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.15]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="mt-5 space-y-2.5 w-full">
                  {feature.bullets.map((bullet, i) => (
                    <motion.li
                      key={bullet}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{
                        duration: 0.4,
                        delay: 0.25 + i * 0.12,
                        ease: EASE,
                      }}
                      className="flex items-start gap-2.5"
                    >
                      <span className="mt-0.5 size-4 shrink-0 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 flex items-center justify-center">
                        <Check className="size-2.5" strokeWidth={3} />
                      </span>
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        {bullet}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <div
                className={clsx(
                  "order-2 w-full",
                  flip ? "lg:order-1" : "lg:order-2",
                )}
              >
                {feature.media}
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
