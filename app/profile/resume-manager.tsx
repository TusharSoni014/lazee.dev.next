"use client";

import { useState } from "react";
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
  Trash,
  Eye,
  Loader2,
  FileWarning,
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

export function ResumeManager({
  resumes: initialResumes,
  membership: initialMembership,
}: {
  resumes: any[];
  membership: string;
}) {
  const queryClient = useQueryClient();
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

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => uploadResumeDirect(formData),
    onSuccess: async (result) => {
      if (result.success) {
        toast.success("Resume uploaded successfully!");
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
      <div className="border-[3px] border-black bg-white p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-10 relative">
        {(isLoading || isFetching) && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
          </div>
        )}

        <div className="flex items-center justify-between mb-8 border-b-[3px] border-black pb-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-none border-[3px] border-black bg-orange-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <FileText className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-black font-heading">
                Resumes
              </h2>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mt-1">
                {resumes.length} / {maxResumes} UPLOADED
              </p>
            </div>
          </div>

          <div>
            <input
              type="file"
              id="resume-upload"
              className="hidden"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              disabled={!canUpload || uploadMutation.isPending}
            />
            <Button
              type="button"
              disabled={!canUpload || uploadMutation.isPending}
              onClick={() => document.getElementById("resume-upload")?.click()}
              className="bg-black text-white hover:bg-zinc-800 tracking-widest uppercase font-bold px-4 py-2 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all h-[42px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {uploadMutation.isPending ? "Uploading..." : "Upload Resume"}
            </Button>
          </div>
        </div>

        {!canUpload && (
          <div className="mb-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 p-4 md:p-6 border-[3px] border-black bg-[#FFD700] hover:bg-[#ffe135] transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 group">
            <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto flex-col sm:flex-row text-center sm:text-left">
              <div className="w-14 h-14 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0 -rotate-6 group-hover:rotate-12 transition-transform duration-500">
                <FileWarning className="w-8 h-8 text-black animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black uppercase text-black font-heading tracking-tighter">
                  Limit Reached
                </h3>
                <p className="font-bold text-black/80 text-sm tracking-widest uppercase">
                  {maxResumes} / {maxResumes} RESUMES ON {membership} PLAN
                </p>
              </div>
            </div>

            {membership === "FREE" && (
              <Button
                type="button"
                className="w-full sm:w-auto bg-white text-black hover:bg-zinc-100 tracking-widest uppercase font-black px-8 py-6 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[2px] transition-all relative overflow-hidden text-lg"
              >
                <span className="relative z-10 flex items-center">
                  UPGRADE{" "}
                  <span className="mx-2 text-2xl animate-bounce">⚡</span> PRO
                </span>
              </Button>
            )}
          </div>
        )}

        {resumes.length === 0 ? (
          <div className="text-center py-12 border-[3px] border-dashed border-zinc-300 bg-zinc-50 flex flex-col items-center justify-center">
            <FileText className="w-12 h-12 text-zinc-300 mb-4" />
            <p className="font-bold text-zinc-500 uppercase tracking-widest text-sm">
              No resumes uploaded yet
            </p>
            <p className="text-xs text-zinc-400 mt-2">Upload a PDF (max 5MB)</p>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume: any) => (
              <div
                key={resume.id}
                className="group flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-[3px] border-black bg-zinc-50 hover:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-10 h-10 bg-white border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black">
                    V{resume.version}
                  </div>
                  <div>
                    <h4
                      className="font-black text-black break-all max-w-[200px] sm:max-w-[300px] truncate"
                      title={resume.name}
                    >
                      {resume.name}
                    </h4>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto w-full md:w-auto justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(resume.id, resume.name)}
                    className="border-[3px] border-black bg-white hover:bg-zinc-100 font-black tracking-widest uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] h-9"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setDeleteDialogId(resume.id)}
                    disabled={
                      deleteMutation.isPending && deleteDialogId === resume.id
                    }
                    className="border-[3px] border-black bg-red-500 text-white hover:bg-red-600 font-black tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] h-9 px-3"
                    title="Delete Resume"
                  >
                    {deleteMutation.isPending &&
                    deleteDialogId === resume.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={!!deleteDialogId}
        onOpenChange={(open) => !open && setDeleteDialogId(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-black uppercase tracking-tighter text-black font-heading">
              <FileWarning className="w-6 h-6 text-red-500" />
              Delete Resume
            </DialogTitle>
            <DialogDescription className="font-bold text-zinc-700 mt-2">
              Are you sure you want to delete this resume? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-4 sm:space-x-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogId(null)}
              disabled={deleteMutation.isPending}
              className="flex-1 border-[3px] border-black bg-white hover:bg-zinc-100 font-black tracking-widest uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all h-[42px]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() =>
                deleteDialogId && deleteMutation.mutate(deleteDialogId)
              }
              disabled={deleteMutation.isPending}
              className="flex-1 border-[3px] border-black bg-red-500 text-white hover:bg-red-600 font-black tracking-widest uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all h-[42px]"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
