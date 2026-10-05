"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface JobDeleteDialogProps {
  isOpen: boolean;
  jobTitle: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function JobDeleteDialog({
  isOpen,
  jobTitle,
  isDeleting,
  onConfirm,
  onClose,
}: JobDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isDeleting && onClose()}>
      <DialogContent className="max-w-md w-[92vw] sm:w-full p-5 sm:p-6 rounded-2xl">
        <DialogHeader className="space-y-2 text-left">
          <div className="size-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20">
            <AlertTriangle className="size-5" />
          </div>
          <DialogTitle className="text-lg font-heading font-bold text-zinc-950 dark:text-zinc-50">
            Delete Job Opening
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Are you sure you want to permanently delete <span className="font-semibold text-zinc-900 dark:text-zinc-200">&ldquo;{jobTitle}&rdquo;</span>? This will remove the listing and cannot be reversed.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:w-auto text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto text-xs font-semibold gap-1.5"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>Delete Role</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
