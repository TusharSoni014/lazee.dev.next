"use client";

import { motion } from "motion/react";
import { EarlyAccessForm } from "@/components/early-access-form";

export function EarlyAccessSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center w-full max-w-[500px] mt-10 mb-20"
    >
      <div className="w-full mb-6 mt-4">
        <EarlyAccessForm />
      </div>

      <p className="text-sm sm:text-base font-bold text-zinc-700 tracking-tight text-center">
        Follow{" "}
        <a
          href="https://twitter.com/tusharsoni014"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 underline decoration-2 underline-offset-4"
        >
          @tusharsoni014
        </a>{" "}
        on Twitter for dev log updates.
      </p>
    </motion.div>
  );
}
