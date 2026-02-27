"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

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
    <div className="fixed bottom-8 right-8 z-100 flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, scale: 0.5, y: 50, rotateX: 45 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 100, rotateX: -45 }}
            whileHover={{ scale: 1.05, rotate: t.type === "error" ? -2 : 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`pointer-events-auto flex items-center gap-3 border-[3px] border-black px-6 py-4 text-black font-black uppercase tracking-tight shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer drop-shadow-md ${
              t.type === "success"
                ? "bg-green-400"
                : t.type === "error"
                  ? "bg-red-400"
                  : t.type === "loading"
                    ? "bg-yellow-400"
                    : "bg-white"
            }`}
            onClick={() => toast.dismiss(t.id)}
          >
            {t.type === "loading" && (
              <svg
                className="w-5 h-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {t.type === "success" && (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {t.type === "error" && (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
