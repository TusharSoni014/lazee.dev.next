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
  Mail,
  FileText
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
import { toast } from "@/components/ui/toast";
import { checkUsernameAvailability, savePublicProfileSettings, disablePublicSharing } from "./actions";
import { uploadResumeDirect } from "./resume-actions";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";

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
  currentEmail 
}: UsernameManagerProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(currentUsername || "");
  const [email, setEmail] = useState(contactEmail || currentEmail || "");
  const [emailError, setEmailError] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [availability, setAvailability] = useState<{ available: boolean; error?: string } | null>(null);
  const [isDisableConfirmOpen, setIsDisableConfirmOpen] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);

  // Sync selected resume if resumes list changes or state is empty
  useEffect(() => {
    if (resumes.length > 0 && !selectedResumeId) {
      const primary = resumes.find(r => r.isPrimary) || resumes[0];
      setSelectedResumeId(primary?.id || "");
    }
  }, [resumes, selectedResumeId]);

  const handleOpen = () => {
    setUsername(currentUsername || "");
    setEmail(contactEmail || currentEmail || "");
    setEmailError("");
    const primary = resumes.find(r => r.isPrimary) || resumes[0];
    setSelectedResumeId(primary?.id || "");
    setAvailability(null);
    setIsOpen(true);
  };

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    
    const trimmed = value.toLowerCase().trim();
    if (trimmed.length >= 3 && /^[a-z0-9-]+$/.test(trimmed)) { 
      setIsChecking(true);
      const result = await checkUsernameAvailability(trimmed);
      setAvailability(result as any);
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

  const handleModalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      // Invalidate queries so resumes are updated
      await queryClient.invalidateQueries({ queryKey: ["resumes"] });
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    } else {
      toast.error(result.error || "Failed to upload resume.");
    }

    // Reset input
    const input = document.getElementById("modal-resume-upload") as HTMLInputElement;
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
      toast.error("At least one resume is required to make your profile public");
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
      // Invalidate queries so that the main UI updates immediately
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      await queryClient.invalidateQueries({ queryKey: ["resumes"] });
    } else {
      toast.error(result.error || "Failed to update sharing settings");
    }
  };

  const copyLink = () => {
    if (!currentUsername) return;
    const url = `${window.location.origin}/profile/${currentUsername}`;
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

  const isUsernameUnchanged = username.toLowerCase().trim() === (currentUsername || "").toLowerCase().trim();
  const isUsernameValid = username.length >= 3 && /^[a-zA-Z0-9-]+$/.test(username.trim());
  const canSaveUsername = isUsernameUnchanged || availability?.available;

  return (
    <div className="border-[3px] border-black bg-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-none border-[3px] border-black bg-orange-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <Globe className="w-6 h-6 text-black" />
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter text-black font-heading italic">
            Public Profile Page
          </h3>
          {currentUsername ? (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 border-[2px] border-black uppercase tracking-widest flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                /profile/{currentUsername}
              </span>
              <a 
                href={`/profile/${currentUsername}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-orange-500 hover:text-orange-600 p-1"
                title="View Public Profile"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
              Public profile sharing is currently disabled.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {currentUsername ? (
          <>
            <Button
              type="button"
              onClick={copyLink}
              variant="outline"
              className="rounded-none border-[3px] border-black bg-white text-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 h-12 px-6"
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </Button>
            <Button
              type="button"
              onClick={handleOpen}
              className="rounded-none border-[3px] border-black bg-black text-white font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 h-12 px-6"
            >
              <Settings className="w-4 h-4" />
              Edit sharing settings
            </Button>
          </>
        ) : (
          <Button
            type="button"
            onClick={handleOpen}
            className="rounded-none border-[3px] border-black bg-orange-500 text-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 h-12 px-8 text-lg"
          >
            <ShieldCheck className="w-5 h-5" />
            Enable Public Sharing
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md p-0">
          <div className="bg-orange-500 border-b-4 border-black p-6">
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-black italic">
              {currentUsername ? "Public Sharing Settings" : "Claim Your Username"}
            </DialogTitle>
            <DialogDescription className="text-black font-bold uppercase text-[10px] tracking-widest mt-1 opacity-80">
              Configure your public profile handle and credentials.
            </DialogDescription>
          </div>

          <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Username input */}
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-black uppercase tracking-widest pl-1">
                Username Alias
              </label>
              <div className="relative group">
                <Input
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="your-name"
                  className="h-14 w-full bg-zinc-100 border-[3px] border-black rounded-none font-bold text-black focus:bg-orange-50 focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
              <div className="flex items-center justify-between px-1">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter">
                  MIN 3 CHARACTERS • LETTERS, NUMBERS, HYPHENS ONLY
                </p>
                {username.length >= 3 && !isUsernameUnchanged && (
                  <div className="flex items-center gap-2">
                    {isChecking ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin text-orange-500" />
                        <span className="text-[10px] font-black text-orange-500 uppercase italic">Checking...</span>
                      </>
                    ) : availability?.available ? (
                      <>
                        <Check className="h-3 w-3 text-green-600" />
                        <span className="text-[10px] font-black text-green-600 uppercase italic">Available</span>
                      </>
                    ) : availability ? (
                      <>
                        <X className="h-3 w-3 text-red-500" />
                        <span className="text-[10px] font-black text-red-500 uppercase italic">Taken</span>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Email input */}
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-black uppercase tracking-widest pl-1">
                Contact Email
              </label>
              <div className="relative group">
                <Input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="your-email@example.com"
                  className="h-14 w-full bg-zinc-100 border-[3px] border-black rounded-none font-bold text-black focus:bg-orange-50 focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
              {emailError && (
                <p className="text-[10px] font-black text-red-500 uppercase pl-1 mt-1">
                  {emailError}
                </p>
              )}
            </div>

            {/* Resume selector / upload */}
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-black uppercase tracking-widest pl-1">
                Select Resume to Display
              </label>
              {resumes.length === 0 ? (
                <div className="border-[3px] border-dashed border-red-400 bg-red-50 p-4 text-center">
                  <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-3">
                    ⚠️ At least one resume is required to make your profile public.
                  </p>
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
                    onClick={() => document.getElementById("modal-resume-upload")?.click()}
                    className="bg-black text-white hover:bg-zinc-800 tracking-widest uppercase font-bold px-4 py-2 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all h-[42px]"
                  >
                    {isUploadingResume ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin animate-pulse" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    {isUploadingResume ? "Uploading..." : "Upload Resume"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 border-[3px] border-black p-2 bg-zinc-50">
                  {resumes.map((r) => (
                    <label
                      key={r.id}
                      className={clsx(
                        "flex items-center gap-3 p-3 border-[2px] cursor-pointer transition-all",
                        selectedResumeId === r.id
                          ? "bg-orange-100 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-white border-zinc-300 hover:border-black"
                      )}
                    >
                      <input
                        type="radio"
                        name="modal-resume"
                        value={r.id}
                        checked={selectedResumeId === r.id}
                        onChange={() => setSelectedResumeId(r.id)}
                        className="h-4 w-4 accent-orange-500 cursor-pointer border-black"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-black truncate" title={r.name}>
                          {r.name}
                        </p>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                          Version {r.version} • {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Link Preview box */}
            <div className="bg-zinc-100 border-[3px] border-black p-4 flex gap-4 items-start">
              <div className="h-8 w-8 shrink-0 flex items-center justify-center bg-black rounded-none border-[2px] border-black">
                <LinkIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-black italic leading-none">Your Link:</p>
                <p className="text-xs font-bold text-zinc-700 mt-1 truncate max-w-[240px]">
                  lazee.dev/profile/{username.toLowerCase().trim() || "..."}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="bg-zinc-50 border-t-4 border-black p-6 sm:justify-end gap-3 flex-wrap">
            {currentUsername && (
              <Button
                type="button"
                onClick={() => setIsDisableConfirmOpen(true)}
                disabled={isSaving || isChecking || isUploadingResume}
                className="mr-auto rounded-none border-[3px] border-black bg-red-500 text-white font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all h-12 px-4"
              >
                Disable Sharing
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="rounded-none border-[3px] border-black bg-white text-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all h-12 px-6"
            >
              Cancel
            </Button>
            <Button
              disabled={isSaving || isChecking || isUploadingResume || resumes.length === 0 || !!emailError || !isUsernameValid || !canSaveUsername}
              onClick={handleSave}
              className="rounded-none border-[3px] border-black bg-orange-500 text-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 h-12 px-8 min-w-[140px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Sharing"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDisableConfirmOpen} onOpenChange={setIsDisableConfirmOpen}>
        <DialogContent className="max-w-md p-8">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-black font-heading italic">
              Disable Sharing?
            </DialogTitle>
            <DialogDescription className="font-bold text-zinc-700 mt-2">
              Are you sure you want to disable public profile sharing? This will delete your public handle and make your profile page link (/profile/{currentUsername}) inactive.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDisableConfirmOpen(false)}
              disabled={isDisabling}
              className="rounded-none border-[3px] border-black bg-white text-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all h-12 px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDisableSharing}
              disabled={isDisabling}
              className="rounded-none border-[3px] border-black bg-red-500 text-white font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 h-12 px-6 min-w-[120px]"
            >
              {isDisabling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Disabling...
                </>
              ) : (
                "Disable Sharing"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
