"use client";

import { useState } from "react";
import { 
  Globe, 
  Settings, 
  Check, 
  X, 
  Loader2, 
  ExternalLink,
  Copy,
  Link as LinkIcon,
  ShieldCheck
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
import { checkUsernameAvailability, updateUsername } from "./actions";
import clsx from "clsx";

interface UsernameManagerProps {
  currentUsername: string | null;
}

export function UsernameManager({ currentUsername }: UsernameManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(currentUsername || "");
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [availability, setAvailability] = useState<{ available: boolean; error?: string } | null>(null);

  const handleOpen = () => {
    setUsername(currentUsername || "");
    setAvailability(null);
    setIsOpen(true);
  };

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").trim();
    
    setUsername(value);
    
    if (value.length >= 3) { 
      setIsChecking(true);
      const result = await checkUsernameAvailability(value);
      setAvailability(result as any);
      setIsChecking(false);
    } else {
      setAvailability(null);
    }
  };

  const handleSave = async () => {
    if (!username || username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    setIsSaving(true);
    const result = await updateUsername(username);
    setIsSaving(false);

    if (result.success) {
      toast.success("Public profile link updated!");
      setIsOpen(false);
      // Wait a bit then refresh to show the new username in the UI
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      toast.error(result.error || "Failed to update profile link");
    }
  };

  const copyLink = () => {
    if (!currentUsername) return;
    const url = `${window.location.origin}/profile/${currentUsername}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

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
              Change Alias
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
              {currentUsername ? "Change Your Alias" : "Claim Your Username"}
            </DialogTitle>
            <DialogDescription className="text-black font-bold uppercase text-[10px] tracking-widest mt-1 opacity-80">
              Pick a unique handle for your public profile link.
            </DialogDescription>
          </div>

          <div className="p-8 space-y-6">
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
                {username.length >= 3 && (
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

            <div className="bg-zinc-100 border-[3px] border-black p-4 flex gap-4 items-start">
              <div className="h-8 w-8 shrink-0 flex items-center justify-center bg-black rounded-none border-[2px] border-black">
                <LinkIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-black italic leading-none">Your Link:</p>
                <p className="text-xs font-bold text-zinc-700 mt-1 truncate max-w-[240px]">
                  lazee.dev/profile/{username || "..."}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="bg-zinc-50 border-t-4 border-black p-6 sm:justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="rounded-none border-[3px] border-black bg-white text-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all h-12 px-6"
            >
              Cancel
            </Button>
            <Button
              disabled={!availability?.available || isSaving || isChecking}
              onClick={handleSave}
              className="rounded-none border-[3px] border-black bg-orange-500 text-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 h-12 px-8 min-w-[140px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Alias"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
