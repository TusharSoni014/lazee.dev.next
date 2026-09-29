"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

interface ProjectCarouselProps {
  screenshots: string[];
}

export function ProjectCarousel({ screenshots }: ProjectCarouselProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isHovered, setIsHovered] = useState(false);

  const imageIndex = Math.abs(page % screenshots.length);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 4000);
    return () => clearInterval(interval);
  }, [page, isHovered]);

  return (
    <div
      className="relative aspect-video w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 overflow-hidden shadow-xs group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={page}
          src={screenshots[imageIndex]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0 w-full h-full object-cover select-none cursor-pointer"
          onClick={() => window.open(screenshots[imageIndex], "_blank")}
          title="Click to open image in new tab"
        />
      </AnimatePresence>

      {/* Prev Button */}
      {screenshots.length > 1 && (
        <button
          type="button"
          onClick={() => paginate(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Next Button */}
      {screenshots.length > 1 && (
        <button
          type="button"
          onClick={() => paginate(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Index Badge */}
      {screenshots.length > 1 && (
        <div className="absolute bottom-3 right-3 z-10 bg-black/60 backdrop-blur-md text-white border border-white/10 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-medium tracking-tight select-none">
          {imageIndex + 1} / {screenshots.length}
        </div>
      )}

      {/* Dot Indicators */}
      {screenshots.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
          {screenshots.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const newDirection = idx > imageIndex ? 1 : -1;
                setPage([page + (idx - imageIndex), newDirection]);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === imageIndex ? "bg-white w-4" : "bg-white/40 hover:bg-white/70 w-1.5"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
