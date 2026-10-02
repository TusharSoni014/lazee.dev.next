"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyResumeAutofillFromPdf } from "./resume-actions";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FaFilePdf } from "react-icons/fa";

export function ResumeAutofillUpload() {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [overwrite, setOverwrite] = useState(false);

  const autofillMutation = useMutation({
    mutationFn: (formData: FormData) =>
      applyResumeAutofillFromPdf(formData, {
        mode: overwrite ? "overwrite" : "empty-only",
      }),
    onSuccess: async (result) => {
      if (result.success) {
        const filled = result.summary?.filled ?? [];
        if (filled.length > 0) {
          toast.success(
            `Profile updated from resume: ${filled.slice(0, 4).join(", ")}${
              filled.length > 4 ? ` +${filled.length - 4} more` : ""
            }`,
          );
        } else {
          toast.message(
            "Resume parsed, but no new profile fields were filled.",
          );
        }

        await queryClient.invalidateQueries({ queryKey: ["profile"] });
        setSelectedFile(null);
      } else {
        toast.error(result.error || "Failed to autofill from resume.");
      }
      if (inputRef.current) inputRef.current.value = "";
    },
    onError: () => {
      toast.error("Failed to autofill from resume.");
      if (inputRef.current) inputRef.current.value = "";
    },
  });

  function validateAndAutofill(file: File) {
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("Please upload a PDF file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    setSelectedFile(file);
    const formData = new FormData();
    formData.append("file", file);
    autofillMutation.mutate(formData);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) validateAndAutofill(file);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-4 sm:p-5 shadow-xs transition-colors">
      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
        <div className="size-10 sm:size-11 shrink-0 rounded-xl bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <FaFilePdf className="size-5 sm:size-5.5 shrink-0" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm sm:text-base font-heading font-semibold text-zinc-900 dark:text-white tracking-tight leading-snug">
              Autofill profile from resume
            </h2>
            <span className="inline-flex items-center rounded-full bg-orange-500/10 dark:bg-orange-500/20 px-2 py-0.5 text-[10px] font-semibold text-orange-700 dark:text-orange-400 border border-orange-500/20 font-mono uppercase tracking-wider">
              Beta
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
            Parses your PDF locally and fills empty profile fields — zero AI
            credits consumed.
          </p>
          <label
            htmlFor="overwrite-fields"
            className="group inline-flex items-center gap-2 mt-2.5 sm:mt-2 cursor-pointer select-none py-0.5"
          >
            <Checkbox
              id="overwrite-fields"
              checked={overwrite}
              onCheckedChange={(checked) => setOverwrite(checked === true)}
              className="size-4 rounded-md border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
            />
            <span className="text-xs text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
              Overwrite existing fields
            </span>
          </label>
        </div>
      </div>

      <div className="shrink-0 w-full sm:w-auto pt-1 sm:pt-0">
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          disabled={autofillMutation.isPending}
        />
        <Button
          type="button"
          variant="default"
          disabled={autofillMutation.isPending}
          onClick={() => inputRef.current?.click()}
          className="w-full sm:w-auto h-10 sm:h-9 px-4.5 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {autofillMutation.isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>{selectedFile ? "Parsing PDF..." : "Parsing..."}</span>
            </>
          ) : (
            <>
              <Upload className="size-3.5" />
              <span>Upload PDF</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
