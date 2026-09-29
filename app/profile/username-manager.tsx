"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  Settings,
  Check,
  X,
  Loader2,
  ExternalLink,
  Copy,
  Link as LinkIcon,
  ShieldCheck,
  Upload,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { toast } from "@/components/ui/toast";
import {
  checkUsernameAvailability,
  savePublicProfileSettings,
  disablePublicSharing,
} from "./actions";
import { uploadResumeDirect } from "./resume-actions";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useResumeStore } from "@/store/useResumeStore";

interface UsernameManagerProps {
  currentUsername: string | null;
  resumes: any[];
  contactEmail: string | null;
  currentEmail: string | null;
}

export function UsernameManager({
  currentUsername,
  resumes,
  contactEmail,
  currentEmail,
}: UsernameManagerProps) {
  const queryClient = useQueryClient();
  const width = useWindowWidth();
  const isMobile = width < 768;

  const Modal = isMobile ? Sheet : Dialog;
  const ModalContent = isMobile ? SheetContent : DialogContent;
  const ModalHeader = isMobile ? SheetHeader : DialogHeader;
  const ModalTitle = isMobile ? SheetTitle : DialogTitle;
  const ModalDescription = isMobile ? SheetDescription : DialogDescription;
  const ModalFooter = isMobile ? SheetFooter : DialogFooter;

  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(currentUsername || "");
  const [email, setEmail] = useState(contactEmail || currentEmail || "");
  const [emailError, setEmailError] = useState("");
  const isInitialized = useResumeStore((state) => state.isInitialized);
  const storeResumes = useResumeStore((state) => state.resumes);
  const activeResumes = isInitialized ? storeResumes : resumes;

  const [selectedResumeId, setSelectedResumeId] = useState(
    () => (activeResumes.find((r: any) => r.isPrimary) || activeResumes[0])?.id || "",
  );
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [availability, setAvailability] = useState<{
    available: boolean;
    error?: string;
  } | null>(null);
  const [isDisableConfirmOpen, setIsDisableConfirmOpen] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);

  const handleOpen = () => {
    setUsername(currentUsername || "");
    setEmail(contactEmail || currentEmail || "");
    setEmailError("");
    const primary = activeResumes.find((r) => r.isPrimary) || activeResumes[0];
    setSelectedResumeId(primary?.id || "");
    setAvailability(null);
    setIsOpen(true);
  };

  const handleUsernameChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setUsername(value);

    const trimmed = value.toLowerCase().trim();
    if (trimmed.length >= 3 && /^[a-z0-9-]+$/.test(trimmed)) {
      setIsChecking(true);
      const result = await checkUsernameAvailability(trimmed);
      setAvailability(result as { available: boolean; error?: string });
      setIsChecking(false);
    } else {
      setAvailability(null);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError("Invalid email address format");
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("Contact email is required");
    }
  };

  const handleModalFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

    setIsUploadingResume(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadResumeDirect(formData);
    setIsUploadingResume(false);

    if (result.success) {
      toast.success("Resume uploaded successfully!");
      await queryClient.invalidateQueries({ queryKey: ["resumes"] });
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    } else {
      toast.error(result.error || "Failed to upload resume.");
    }

    const input = document.getElementById(
      "modal-resume-upload",
    ) as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleSave = async () => {
    if (!username || username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    const normalizedUsername = username.toLowerCase().trim();
    if (!/^[a-z0-9-]+$/.test(normalizedUsername)) {
      toast.error("Username can only contain letters, numbers, and hyphens");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      toast.error("Please enter a valid contact email address");
      return;
    }

    if (!selectedResumeId) {
      toast.error(
        "At least one resume is required to make your profile public",
      );
      return;
    }

    setIsSaving(true);
    const result = await savePublicProfileSettings({
      username: normalizedUsername,
      contactEmail: email,
      primaryResumeId: selectedResumeId,
    });
    setIsSaving(false);

    if (result.success) {
      toast.success("Public profile sharing settings updated!");
      setIsOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      await queryClient.invalidateQueries({ queryKey: ["resumes"] });
    } else {
      toast.error(result.error || "Failed to update sharing settings");
    }
  };

  const copyLink = () => {
    if (!currentUsername) return;
    const url = `${window.location.origin}/u/${currentUsername}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleDisableSharing = async () => {
    setIsDisabling(true);
    const result = await disablePublicSharing();
    setIsDisabling(false);

    if (result.success) {
      toast.success("Public profile sharing disabled!");
      setIsDisableConfirmOpen(false);
      setIsOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    } else {
      toast.error(result.error || "Failed to disable sharing");
    }
  };

  const isUsernameUnchanged =
    username.toLowerCase().trim() ===
    (currentUsername || "").toLowerCase().trim();
  const isUsernameValid =
    username.length >= 3 && /^[a-zA-Z0-9-]+$/.test(username.trim());
  const canSaveUsername = isUsernameUnchanged || availability?.available;

  return (
    <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 shrink-0">
          <Globe className="size-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-heading font-semibold text-zinc-900 dark:text-white tracking-tight">
            Public Profile Page
          </h3>
          {currentUsername ? (
            <div className="flex items-center gap-2 mt-1">
              <span
                className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 max-w-[200px] xs:max-w-[260px] sm:max-w-none truncate"
                title={`/u/${currentUsername}`}
              >
                /u/{currentUsername}
              </span>
              <a
                href={`/u/${currentUsername}`}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 p-1 shrink-0 transition-colors"
                title="View Public Profile"
              >
                <ExternalLink className="size-4" />
              </a>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Public profile sharing is currently disabled.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
        {currentUsername ? (
          <>
            <Button
              type="button"
              onClick={copyLink}
              variant="outline"
              className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <Copy className="size-3.5" />
              <span>Copy Link</span>
            </Button>
            <Button
              type="button"
              onClick={handleOpen}
              className="h-10 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <Settings className="size-3.5" />
              <span>Settings</span>
            </Button>
          </>
        ) : (
          <Button
            type="button"
            onClick={handleOpen}
            className="h-10 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
          >
            <ShieldCheck className="size-4" />
            <span>Enable Public Profile</span>
          </Button>
        )}
      </div>

      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <ModalContent
          className={
            isMobile
              ? "p-0 flex flex-col max-h-[90dvh]"
              : "sm:max-w-md p-0 sm:p-0 gap-0 max-h-[85dvh] flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
          }
        >
          <div className="px-4 py-3 sm:py-3.5 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
            <ModalTitle className="text-xl font-heading font-bold text-zinc-900 dark:text-white tracking-tight">
              {currentUsername
                ? "Public Sharing Settings"
                : "Claim Your Username"}
            </ModalTitle>
            <ModalDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Configure your public profile handle and active resume.
            </ModalDescription>
          </div>

          <div className="px-4 py-3.5 sm:py-4 space-y-3.5 flex-1 overflow-y-auto">
            {/* Username input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Username Alias
              </label>
              <div className="relative">
                <Input
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="your-name"
                  className="h-11 w-full bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <p className="text-[10px] text-zinc-500 font-mono">
                  Min 3 chars • letters, numbers, hyphens
                </p>
                {username.length >= 3 && !isUsernameUnchanged && (
                  <div className="flex items-center gap-1.5">
                    {isChecking ? (
                      <>
                        <Loader2 className="size-3 animate-spin text-orange-500" />
                        <span className="text-[11px] font-medium text-orange-500">
                          Checking...
                        </span>
                      </>
                    ) : availability?.available ? (
                      <>
                        <Check className="size-3 text-emerald-500" />
                        <span className="text-[11px] font-medium text-emerald-500">
                          Available
                        </span>
                      </>
                    ) : availability ? (
                      <>
                        <X className="size-3 text-red-500" />
                        <span className="text-[11px] font-medium text-red-500">
                          Taken
                        </span>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Email input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Contact Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="your-email@example.com"
                className="h-11 w-full bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
              {emailError && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {emailError}
                </p>
              )}
            </div>

            {/* Resume selector / upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Select Resume to Display
              </label>
              {activeResumes.length === 0 ? (
                <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 mb-3">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>
                      At least one resume is required to make profile public.
                    </span>
                  </div>
                  <input
                    type="file"
                    id="modal-resume-upload"
                    className="hidden"
                    accept=".pdf,application/pdf"
                    onChange={handleModalFileUpload}
                    disabled={isUploadingResume}
                  />
                  <Button
                    type="button"
                    disabled={isUploadingResume}
                    onClick={() =>
                      document.getElementById("modal-resume-upload")?.click()
                    }
                    className="h-9 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs shadow-xs"
                  >
                    {isUploadingResume ? (
                      <>
                        <Loader2 className="size-3.5 mr-2 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="size-3.5 mr-2" />
                        <span>Upload Resume</span>
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {activeResumes.map((r) => (
                    <label
                      key={r.id}
                      className={clsx(
                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                        selectedResumeId === r.id
                          ? "bg-orange-500/10 border-orange-500/40 text-zinc-900 dark:text-white"
                          : "bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
                      )}
                    >
                      <input
                        type="radio"
                        name="modal-resume"
                        value={r.id}
                        checked={selectedResumeId === r.id}
                        onChange={() => setSelectedResumeId(r.id)}
                        className="size-4 accent-orange-600 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-semibold truncate text-zinc-900 dark:text-zinc-100"
                          title={r.name}
                        >
                          {r.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                          v{r.version} •{" "}
                          {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Link Preview box */}
            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/60 p-3.5 flex gap-3 items-center min-w-0">
              <div className="size-8 rounded-lg shrink-0 flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                <LinkIcon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-mono">
                  Public URL
                </p>
                <p className="text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 truncate mt-0.5">
                  lazee.dev/u/{username.toLowerCase().trim() || "username"}
                </p>
              </div>
            </div>
          </div>

          <ModalFooter className="bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 px-4 py-2.5 sm:py-2.5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 shrink-0">
            {currentUsername ? (
              <Button
                type="button"
                onClick={() => setIsDisableConfirmOpen(true)}
                disabled={isSaving || isChecking || isUploadingResume}
                variant="ghost"
                className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-medium h-9 px-3 rounded-lg justify-center"
              >
                Disable Sharing
              </Button>
            ) : (
              <div className="hidden sm:block" />
            )}
            <div className="flex flex-col-reverse sm:flex-row items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="w-full sm:w-auto h-9 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium"
              >
                Cancel
              </Button>
              <Button
                disabled={
                  isSaving ||
                  isChecking ||
                  isUploadingResume ||
                  activeResumes.length === 0 ||
                  !!emailError ||
                  !isUsernameValid ||
                  !canSaveUsername
                }
                onClick={handleSave}
                className="w-full sm:w-auto h-9 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs shadow-xs active:scale-[0.98]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1.5" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Settings</span>
                )}
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal open={isDisableConfirmOpen} onOpenChange={setIsDisableConfirmOpen}>
        <ModalContent
          className={
            isMobile
              ? "p-4"
              : "sm:max-w-sm p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
          }
        >
          <ModalHeader className="mb-2">
            <ModalTitle className="text-lg font-heading font-semibold text-zinc-900 dark:text-white">
              Disable Public Sharing?
            </ModalTitle>
            <ModalDescription className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
              This will deactivate your public handle and make your profile URL
              (/u/{currentUsername}) inaccessible to recruiters.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDisableConfirmOpen(false)}
              disabled={isDisabling}
              className="w-full sm:w-auto h-9 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDisableSharing}
              disabled={isDisabling}
              className="w-full sm:w-auto h-9 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium shadow-xs"
            >
              {isDisabling ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  <span>Disabling...</span>
                </>
              ) : (
                <span>Disable Sharing</span>
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
