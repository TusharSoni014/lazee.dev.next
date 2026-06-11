"use client";

import React, { useState, useEffect } from "react";

const LOADING_MESSAGES = [
  "Generating lazy magic...",
  "Brewing fresh coffee...",
  "Simulating hard work...",
  "Optimizing laziness...",
  "Reading your resume...",
  "Tuning the application engines...",
  "Preparing 100x speedup...",
];

interface LoadingProps {
  message?: string;
  className?: string;
  fullPage?: boolean;
}

export default function Loading({ message, className = "", fullPage = true }: LoadingProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const content = (
    <div className={`flex flex-col items-center gap-8 p-8 text-center ${className}`}>
      {/* Visual Loader Card Container */}
      <div className="relative">
        {/* Shadow block */}
        <div className="absolute inset-0 bg-[#ff6b00] border-4 border-black translate-x-3 translate-y-3" />
        
        {/* Card Body */}
        <div className="relative bg-white border-4 border-black p-6 flex flex-col items-center justify-center min-w-[220px]">
          {/* Mini progress line indicator */}
          <div className="w-36 h-3 bg-white border-[3px] border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute top-0 bottom-0 left-0 bg-[#00bcd4] border-r-[2px] border-black animate-[loading-bar_2s_infinite_ease-in-out]" style={{ width: '40%' }} />
          </div>
        </div>
      </div>

      {/* Message Box */}
      <div className="border-[3px] border-black bg-white px-6 py-3 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] max-w-sm transition-all duration-300">
        <p className="text-sm font-black uppercase tracking-wider text-black">
          {message || LOADING_MESSAGES[msgIndex]}
        </p>
      </div>

      {/* Embedded CSS style for the custom loading-bar animation */}
      <style jsx global>{`
        @keyframes loading-bar {
          0% {
            left: -50%;
          }
          50% {
            left: 110%;
          }
          100% {
            left: -50%;
          }
        }
      `}</style>
    </div>
  );

  if (!fullPage) {
    return content;
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-[#fefaf6] flex items-center justify-center overflow-hidden">
      {/* Neobrutalist radial dots background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 2px, transparent 2px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10">
        {content}
      </div>
    </div>
  );
}
