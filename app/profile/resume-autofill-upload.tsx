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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-4 sm:p-5 shadow-xs transition-colors">
      <div className="flex items-center gap-3.5 min-w-0 h-16">
        <FaFilePdf className="size-10" />
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-heading font-semibold text-zinc-900 dark:text-white tracking-tight leading-tight flex items-center gap-2">
            Autofill profile from resume
            <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20">
              Beta
            </span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Parses your PDF locally and fills empty profile fields — zero AI
            credits consumed.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Checkbox
              id="overwrite-fields"
              checked={overwrite}
              onCheckedChange={(checked) => setOverwrite(checked === true)}
              className="size-3.5"
            />
            <label
              htmlFor="overwrite-fields"
              className="text-xs text-zinc-600 dark:text-zinc-300 cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Overwrite existing fields
            </label>
          </div>
        </div>
      </div>

      <div className="shrink-0 w-full sm:w-auto">
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
          disabled={autofillMutation.isPending}
          onClick={() => inputRef.current?.click()}
          className="w-full sm:w-auto h-9 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
