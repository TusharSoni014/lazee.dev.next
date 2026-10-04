"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface LazyVideoEmbedProps {
  url: string;
  title?: string;
  thumbnailUrl?: string;
  className?: string;
  aspectRatio?: string;
}

function getYoutubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getLoomId(url: string): string | null {
  const regExp = /loom\.com\/(share|embed)\/([a-zA-Z0-9]+)/;
  const match = url.match(regExp);
  return match ? match[2] : null;
}

export function LazyVideoEmbed({
  url,
  title = "Video player",
  thumbnailUrl,
  className = "",
  aspectRatio = "aspect-video",
}: LazyVideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  const ytId = getYoutubeId(url);
  const lId = getLoomId(url);

  // If YouTube
  if (ytId) {
    const embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`;
    const resolvedThumb =
      thumbnailUrl ||
      (thumbnailFailed
        ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
        : `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`);

    if (isPlaying) {
      return (
        <div
          className={cn(
            "relative w-full rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 shadow-xs",
            aspectRatio,
            className
          )}
        >
          <iframe
            src={embedUrl}
            title={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      );
    }

    return (
      <div
        onClick={() => setIsPlaying(true)}
        className={cn(
          "group relative w-full rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 shadow-xs cursor-pointer select-none",
          aspectRatio,
          className
        )}
        role="button"
        tabIndex={0}
        aria-label={`Play ${title}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsPlaying(true);
          }
        }}
      >
        {/* Thumbnail Background */}
        <img
          src={resolvedThumb}
          alt={title}
          onError={() => setThumbnailFailed(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10 transition-opacity duration-300 group-hover:opacity-80" />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Pulsing subtle glow */}
            <div className="absolute -inset-3 rounded-full bg-orange-500/20 blur-lg transition-transform duration-300 group-hover:scale-125" />
            
            <div className="relative size-16 sm:size-20 rounded-2xl bg-white/95 dark:bg-zinc-900/95 text-orange-600 dark:text-orange-500 flex items-center justify-center shadow-2xl border border-zinc-200/80 dark:border-zinc-700/80 transition-all duration-300 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-500 active:scale-95">
              <Play className="size-7 sm:size-8 fill-current ml-1" />
            </div>
          </div>
        </div>

        {/* Bottom Badge */}
        <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white/90 text-xs font-medium drop-shadow-md">
          <span className="truncate max-w-[80%] font-heading">{title}</span>
          <span className="shrink-0 font-mono text-[11px] px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs border border-white/10">
            Play Video
          </span>
        </div>
      </div>
    );
  }

  // If Loom
  if (lId) {
    const embedUrl = `https://www.loom.com/embed/${lId}`;
    return (
      <div
        className={cn(
          "relative w-full rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 shadow-xs",
          aspectRatio,
          className
        )}
      >
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // Fallback for direct iframe / embed URL
  return (
    <div
      className={cn(
        "relative w-full rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 shadow-xs",
        aspectRatio,
        className
      )}
    >
      <iframe
        src={url}
        title={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full"
        allowFullScreen
      />
    </div>
  );
}
