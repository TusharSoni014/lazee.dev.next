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
      className="relative aspect-video w-full border-[3px] border-black bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden group"
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
      <button
        type="button"
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 flex items-center justify-center border-[2px] border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-orange-50 active:bg-orange-100 transition-all rounded-none cursor-pointer opacity-0 group-hover:opacity-100 duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 text-black" strokeWidth={2.5} />
      </button>

      {/* Next Button */}
      <button
        type="button"
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 flex items-center justify-center border-[2px] border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-orange-50 active:bg-orange-100 transition-all rounded-none cursor-pointer opacity-0 group-hover:opacity-100 duration-200"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 text-black" strokeWidth={2.5} />
      </button>

      {/* Index Badge */}
      <div className="absolute bottom-4 right-4 z-10 bg-yellow-300 text-black border-[2px] border-black px-2.5 py-0.5 font-black uppercase text-[10px] tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] select-none">
        {imageIndex + 1} / {screenshots.length}
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {screenshots.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              const newDirection = idx > imageIndex ? 1 : -1;
              setPage([page + (idx - imageIndex), newDirection]);
            }}
            className={`w-2.5 h-2.5 border-[2px] border-black transition-all rounded-none ${
              idx === imageIndex ? "bg-orange-500 scale-110 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" : "bg-white"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
