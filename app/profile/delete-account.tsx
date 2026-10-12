"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { deleteAccount } from "./actions";
import { cn } from "@/lib/utils";

const CONFIRMATION_PHRASE = "DELETE MY ACCOUNT";

export function DeleteAccount() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isMatched = confirmInput.trim() === CONFIRMATION_PHRASE;

  const handleDelete = async () => {
    if (!isMatched || isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await deleteAccount();
      if (res?.error) {
        toast.error(res.error);
        setIsDeleting(false);
        return;
      }

      // Notify chrome extension if installed
      try {
        if (
          typeof window !== "undefined" &&
          (window as any).chrome?.runtime?.sendMessage
        ) {
          const extensionId = localStorage.getItem("lazeeExtensionId");
          if (extensionId) {
            (window as any).chrome.runtime.sendMessage(
              extensionId,
              { type: "LAZEE_AUTH_LOGOUT" },
              () => {
                localStorage.removeItem("lazeeExtensionId");
              }
            );
          }
        }
      } catch (extErr) {
        console.debug("Failed to notify extension on account delete:", extErr);
      }

      toast.success("Your account has been deleted.");
      await signOut({ callbackUrl: "/" });
    } catch (err: any) {
      console.error("Account deletion failed:", err);
      toast.error("Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (isDeleting) return;
    setIsOpen(open);
    if (!open) {
      setConfirmInput("");
    }
  };

  return (
    <>
      <div className="pt-8 border-t border-zinc-200/80 dark:border-zinc-800">
        <div>
          <h3 className="text-base font-semibold text-rose-600 dark:text-rose-500">
            Delete Account
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center justify-center rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/20 px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300 dark:hover:bg-rose-950/40 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-md w-full rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl gap-0"
        >
          {/* Warning Icon */}
          <div className="flex justify-center mb-5">
            <svg
              className="w-16 h-16 drop-shadow-xs"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32 7.5C33.2 7.5 34.3 8.1 34.9 9.2L58.1 48.7C59.3 50.8 57.8 53.5 55.2 53.5H8.8C6.2 53.5 4.7 50.8 5.9 48.7L29.1 9.2C29.7 8.1 30.8 7.5 32 7.5Z"
                fill="#F6B846"
              />
              <path
                d="M32 21C30.9 21 30.1 21.9 30.2 23L30.9 35.8C31 36.6 31.7 37.2 32.5 37.2C33.3 37.2 34 36.6 34.1 35.8L34.8 23C34.9 21.9 34.1 21 33 21H32Z"
                fill="#262626"
              />
              <circle cx="32.5" cy="43.5" r="2.75" fill="#262626" />
            </svg>
          </div>

          {/* Dialog Title */}
          <DialogTitle className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight text-center leading-snug">
            Are you absolutely sure?
          </DialogTitle>

          {/* Explanatory Warning Text */}
          <div className="mt-4 space-y-3.5 text-center text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            <p>
              This will permanently delete your profile, job applications,
              resumes, and all other data. There is no way to recover it.
            </p>
            <p>
              If you have a Premium subscription it is cancelled immediately and
              nothing more is charged. Any unused purchased top-up credits are
              forfeited and are not refunded.
            </p>
          </div>

          {/* Confirmation Prompt */}
          <div className="mt-6 space-y-2">
            <label
              htmlFor="confirm-delete-input"
              className="block text-xs sm:text-sm text-zinc-600 dark:text-zinc-400"
            >
              Type{" "}
              <strong className="font-bold text-zinc-900 dark:text-zinc-100">
                {CONFIRMATION_PHRASE}
              </strong>{" "}
              to confirm:
            </label>
            <Input
              id="confirm-delete-input"
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="Type here..."
              disabled={isDeleting}
              className="h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-rose-500/20 focus-visible:border-rose-500 shadow-2xs"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setConfirmInput("");
              }}
              disabled={isDeleting}
              className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleDelete}
              disabled={!isMatched || isDeleting}
              className={cn(
                "h-11 rounded-xl font-medium transition-all",
                isMatched && !isDeleting
                  ? "bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer active:scale-[0.98]"
                  : "bg-rose-50/70 dark:bg-rose-950/20 text-rose-300 dark:text-rose-800/60 border border-rose-100 dark:border-rose-900/30 cursor-not-allowed hover:bg-rose-50/70 dark:hover:bg-rose-950/20"
              )}
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  Deleting...
                </span>
              ) : (
                "Permanently Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
