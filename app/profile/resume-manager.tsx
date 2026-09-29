"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  uploadResumeDirect,
  deleteResume,
  getPresignedUrl,
  getResumes,
} from "./resume-actions";
import {
  FileText,
  Upload,
  Trash2,
  Eye,
  Loader2,
  FileWarning,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { motion, AnimatePresence } from "motion/react";
import { useResumeStore } from "@/store/useResumeStore";


export function ResumeManager({
  resumes: initialResumes,
  membership: initialMembership,
  onUpgrade,
}: {
  resumes: any[];
  membership: string;
  onUpgrade?: () => void;
}) {
  const queryClient = useQueryClient();
  const width = useWindowWidth();
  const isMobile = width < 768;

  const Modal = isMobile ? Sheet : Dialog;
  const ModalContent = isMobile ? SheetContent : DialogContent;
  const ModalHeader = isMobile ? SheetHeader : DialogHeader;
  const ModalTitle = isMobile ? SheetTitle : DialogTitle;
  const ModalDescription = isMobile ? SheetDescription : DialogDescription;
  const ModalFooter = isMobile ? SheetFooter : DialogFooter;

  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);

  // Fetch resumes query
  const {
    data: resumeData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      const result = await getResumes();
      if (!result.success) throw new Error(result.error);
      return {
        resumes: result.resumes || [],
        membership: result.membership || initialMembership,
      };
    },
    initialData: { resumes: initialResumes, membership: initialMembership },
  });

  const resumes = resumeData?.resumes || [];
  const membership = resumeData?.membership || initialMembership;

  const maxResumes = membership === "PRO" ? 10 : 1;
  const canUpload = resumes.length < maxResumes;

  useEffect(() => {
    if (resumeData) {
      useResumeStore.getState().setResumes(resumeData.resumes);
      window.postMessage({ type: "LAZEE_SYNC_AUTH" }, window.location.origin);
    }
  }, [resumeData]);

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => uploadResumeDirect(formData),
    onSuccess: async (result) => {
      if (result.success) {
        toast.success(
          result.inspected
            ? "Resume uploaded! PDF inspection logged to server console."
            : "Resume uploaded successfully!",
        );
        await queryClient.invalidateQueries({ queryKey: ["resumes"] });
      } else {
        toast.error(result.error || "Failed to upload resume.");
      }
      const input = document.getElementById(
        "resume-upload",
      ) as HTMLInputElement;
      if (input) input.value = "";
    },
    onError: () => {
      toast.error("Failed to upload resume.");
      const input = document.getElementById(
        "resume-upload",
      ) as HTMLInputElement;
      if (input) input.value = "";
    },
  });



  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteResume(id),
    onSuccess: async (result) => {
      if (result.success) {
        toast.success("Resume deleted!");
        await queryClient.invalidateQueries({ queryKey: ["resumes"] });
      } else {
        toast.error(result.error || "Failed to delete resume.");
      }
      setDeleteDialogId(null);
    },
    onError: () => {
      toast.error("Failed to delete resume.");
      setDeleteDialogId(null);
    },
  });

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    if (!canUpload) {
      toast.error(
        `Your ${membership} plan limits you to ${maxResumes} resume${maxResumes > 1 ? "s" : ""}.`,
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);


    uploadMutation.mutate(formData);
  }



  async function handlePreview(id: string, name: string) {
    const toastId = toast.loading("Generating preview link...");
    const result = await getPresignedUrl(id);

    if (result.success && result.url) {
      toast.dismiss(toastId);
      window.open(result.url, "_blank");
    } else {
      toast.error(result.error || "Failed to generate preview", {
        id: toastId,
      });
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 md:p-8 shadow-xs mt-8 transition-colors relative">
        <AnimatePresence mode="wait">
          {(isLoading || isFetching) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center"
            >
              <Loader2 className="size-6 animate-spin text-orange-600 dark:text-orange-400" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 shrink-0">
              <FileText className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-zinc-900 dark:text-white tracking-tight">
                Resume Vault
              </h2>
              <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {resumes.length} / {maxResumes} uploaded
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto flex flex-col sm:items-end gap-2.5">
            <input
              type="file"
              id="resume-upload"
              className="hidden"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              disabled={!canUpload || uploadMutation.isPending}
            />
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">

              <Button
                type="button"
                disabled={!canUpload || uploadMutation.isPending}
                onClick={() => document.getElementById("resume-upload")?.click()}
                className="h-9 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {uploadMutation.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Upload className="size-3.5" />
                )}
                <span>{uploadMutation.isPending ? "Uploading..." : "Upload Resume"}</span>
              </Button>
            </div>


          </div>
        </div>

        {!canUpload && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/5 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="size-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <FileWarning className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Resume Limit Reached
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {maxResumes} / {maxResumes} resumes uploaded on the {membership} plan.
                </p>
              </div>
            </div>

            {membership === "FREE" && (
              <Button
                type="button"
                onClick={onUpgrade}
                className="h-9 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Zap className="size-3.5 fill-orange-500 text-orange-500" />
                <span>Upgrade to Pro</span>
              </Button>
            )}
          </div>
        )}

        {resumes.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-col items-center justify-center">
            <FileText className="size-8 text-zinc-400 mb-2" />
            <p className="font-medium text-zinc-600 dark:text-zinc-300 text-sm">
              No resumes uploaded yet
            </p>
            <p className="text-xs text-zinc-400 mt-1">Upload a PDF up to 5MB to enable autofill</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume: any) => (
              <div
                key={resume.id}
                className="group flex flex-col md:flex-row items-start md:items-center justify-between p-3.5 sm:p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors gap-3"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="size-9 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 shrink-0">
                    v{resume.version}
                  </div>
                  <div className="min-w-0">
                    <h4
                      className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate max-w-[240px] sm:max-w-sm"
                      title={resume.name}
                    >
                      {resume.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(resume.id, resume.name)}
                    className="h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium"
                  >
                    <Eye className="size-3.5 mr-1.5" />
                    <span>Preview</span>
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteDialogId(resume.id)}
                    disabled={
                      deleteMutation.isPending && deleteDialogId === resume.id
                    }
                    className="h-8 w-8 p-0 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    title="Delete Resume"
                  >
                    {deleteMutation.isPending &&
                    deleteDialogId === resume.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={!!deleteDialogId}
        onOpenChange={(open) => !open && setDeleteDialogId(null)}
      >
        <ModalContent className={isMobile ? "p-4" : "sm:max-w-[360px] p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"}>
          <ModalHeader>
            <ModalTitle className="flex items-center gap-2 text-base font-heading font-semibold text-zinc-900 dark:text-white">
              <FileWarning className="size-4.5 text-red-500" />
              <span>Delete Resume</span>
            </ModalTitle>
            <ModalDescription className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
              Are you sure you want to delete this resume? This action cannot be undone.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogId(null)}
              disabled={deleteMutation.isPending}
              className="w-full sm:w-auto h-9 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() =>
                deleteDialogId && deleteMutation.mutate(deleteDialogId)
              }
              disabled={deleteMutation.isPending}
              className="w-full sm:w-auto h-9 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium shadow-xs"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete</span>
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
