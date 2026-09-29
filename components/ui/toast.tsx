"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "loading";

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Simple event emitter for toasts
type ActionListener = (action: {
  type: "ADD" | "REMOVE";
  toast: ToastMessage;
}) => void;
const listeners = new Set<ActionListener>();

export const toast = (
  message: string,
  type: ToastType = "info",
  duration = 3000,
) => {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: ToastMessage = { id, message, type, duration };
  listeners.forEach((listener) => listener({ type: "ADD", toast: newToast }));
  return id;
};

toast.success = (message: string, duration?: number) =>
  toast(message, "success", duration);
toast.error = (message: string, duration?: number) =>
  toast(message, "error", duration);
toast.info = (message: string, duration?: number) =>
  toast(message, "info", duration);
toast.loading = (message: string) => toast(message, "loading", 999999);
toast.dismiss = (id: string) => {
  listeners.forEach((listener) =>
    listener({ type: "REMOVE", toast: { id, message: "", type: "info" } }),
  );
};

toast.promise = async <T,>(
  promise: Promise<T>,
  msgs: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  },
) => {
  const id = toast.loading(msgs.loading);
  try {
    const data = await promise;
    toast.dismiss(id);
    toast.success(
      typeof msgs.success === "function" ? msgs.success(data) : msgs.success,
    );
    return data;
  } catch (error) {
    toast.dismiss(id);
    toast.error(
      typeof msgs.error === "function" ? msgs.error(error) : msgs.error,
    );
    throw error;
  }
};

export function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleAction = (action: { type: string; toast: ToastMessage }) => {
      if (action.type === "ADD") {
        setToasts((prev) => [...prev, action.toast]);
        if (action.toast.duration) {
          setTimeout(() => {
            handleAction({ type: "REMOVE", toast: action.toast });
          }, action.toast.duration);
        }
      } else if (action.type === "REMOVE") {
        setToasts((prev) => prev.filter((t) => t.id !== action.toast.id));
      }
    };

    listeners.add(handleAction);
    return () => {
      listeners.delete(handleAction);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-2.5 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-md cursor-pointer transition-colors ${
              t.type === "success"
                ? "border-emerald-500/20 bg-white/95 dark:bg-zinc-900/95 text-emerald-800 dark:text-emerald-300 shadow-emerald-500/5"
                : t.type === "error"
                  ? "border-rose-500/20 bg-white/95 dark:bg-zinc-900/95 text-rose-800 dark:text-rose-300 shadow-rose-500/5"
                  : t.type === "loading"
                    ? "border-amber-500/20 bg-white/95 dark:bg-zinc-900/95 text-amber-800 dark:text-amber-300 shadow-amber-500/5"
                    : "border-zinc-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 text-zinc-900 dark:text-zinc-100"
            }`}
            onClick={() => toast.dismiss(t.id)}
          >
            {t.type === "loading" && (
              <Loader2 className="w-4 h-4 shrink-0 animate-spin text-amber-600 dark:text-amber-400" />
            )}
            {t.type === "success" && (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            )}
            {t.type === "error" && (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            {t.type === "info" && (
              <Info className="w-4 h-4 shrink-0 text-orange-600 dark:text-orange-400" />
            )}
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
