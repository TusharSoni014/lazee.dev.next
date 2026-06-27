"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Download, Laptop } from "lucide-react";
import { useBrowser, type BrowserType } from "@/hooks/use-browser";
import { toast } from "@/components/ui/toast";
import { CHROME_EXTENSION_URL, FIREFOX_EXTENSION_URL } from "@/lib/constants";

const DOWNLOAD_LINKS: Record<BrowserType, string> = {
  chrome: CHROME_EXTENSION_URL,
  edge: "https://microsoftedge.microsoft.com/addons/",
  firefox: FIREFOX_EXTENSION_URL,
  safari: "https://apps.apple.com/",
  other: CHROME_EXTENSION_URL,
};

export function LoginSuccessModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const searchParams = useSearchParams();
  const browser = useBrowser();

  useEffect(() => {
    // Check if modal should open
    if (searchParams.get("logged_in") === "true") {
      setIsOpen(true);
      
      // Check if extension is likely installed
      const extensionId = searchParams.get("extensionId") || localStorage.getItem("lazeeExtensionId");
      if (extensionId) {
        setIsInstalled(true);
      }

      // Cleanup URL
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("logged_in");
      const queryString = newParams.toString();
      const newUrl = window.location.pathname + (queryString ? `?${queryString}` : "");
      window.history.replaceState(null, "", newUrl);
    }
  }, [searchParams]);

  const extensionId = searchParams.get("extensionId") || (typeof window !== 'undefined' ? localStorage.getItem("lazeeExtensionId") : null);

  const handleAction = () => {
    if (isInstalled) {
      // We can't actually open the popup from web, but we can show them how
      setIsOpen(false);
      toast("Success! Now click the Lazee icon in your toolbar", "success");
    } else {
      window.open(DOWNLOAD_LINKS[browser], "_blank");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-0">
        <div className="bg-[#ff6b00] p-6 border-b-4 border-black flex items-center gap-4">
          <div className="bg-white border-[3px] border-black p-2 shadow-[4px_4px_0px_0px_#000000]">
            {isInstalled ? (
              <Sparkles className="w-8 h-8 text-[#ff6b00]" strokeWidth={3} />
            ) : (
              <Download className="w-8 h-8 text-[#ff6b00]" strokeWidth={3} />
            )}
          </div>
          <div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-black italic leading-none">
              Login Successful!
            </DialogTitle>
            <DialogDescription className="text-black font-bold uppercase text-[10px] tracking-widest mt-1 opacity-80">
              You are now signed in to Lazee.dev
            </DialogDescription>
          </div>
        </div>

        <div className="p-8 flex flex-col items-center text-center gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-black uppercase tracking-tight text-black">
              {isInstalled ? "Final Step!" : "Get Started with Lazee"}
            </h3>
            <p className="text-zinc-600 font-bold leading-relaxed max-w-xs">
              {isInstalled ? (
                <>
                  Click the <span className="text-[#ff6b00] underline decoration-2 underline-offset-4 font-black">Lazee icon</span> in your browser toolbar to complete your login and start applying!
                </>
              ) : (
                <>
                  You'll need the <span className="text-[#ff6b00] underline decoration-2 underline-offset-4 font-black">Lazee browser extension</span> to start filling job applications 100x faster.
                </>
              )}
            </p>
          </div>

          <div className="w-full space-y-3 pt-2">
            <Button 
              onClick={handleAction}
              className="w-full py-8 bg-black text-white hover:bg-zinc-800 border-[3px] border-black shadow-[6px_6px_0px_0px_#ff6b00] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[4px_4px_0px_0px_#ff6b00] transition-all rounded-none"
            >
              <span className="text-xl font-black uppercase tracking-tighter">
                {isInstalled ? "I'll open it now" : "Download Extension"}
              </span>
              {isInstalled ? (
                <ArrowRight className="w-6 h-6 ml-2" strokeWidth={3} />
              ) : (
                <Download className="w-6 h-6 ml-2" strokeWidth={3} />
              )}
            </Button>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors px-4 py-2 cursor-pointer"
            >
              Maybe Later
            </button>
          </div>
        </div>

        <div className="bg-zinc-50 border-t-[3px] border-black p-4 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-zinc-400" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Desktop browser recommended
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
