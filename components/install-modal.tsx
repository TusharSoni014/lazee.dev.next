import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, Rss } from "lucide-react";
import { ReactNode } from "react";

interface InstallModalProps {
  children: ReactNode;
}

export function InstallModal({ children }: InstallModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 bg-orange-500 border-[3px] border-black p-4 inline-block">
            <Rocket
              className="w-10 h-10 md:w-12 md:h-12 text-black"
              strokeWidth={2.5}
            />
          </div>

          <h2 className="text-4xl md:text-5xl font-black uppercase leading-none mb-4 text-black tracking-tighter">
            Extension <br />{" "}
            <span className="bg-orange-500 px-2 mt-2 inline-block">
              Releasing Soon!
            </span>
          </h2>

          <p className="text-lg font-medium text-black mb-8 max-w-xs md:max-w-sm">
            Follow the developer for the latest dev logs and updates:
          </p>

          <a
            className="w-full"
            href="https://x.com/TusharSoni014"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full py-8">
              <Rss className="w-6 h-6 font-bold" strokeWidth={2.5} />
              <span className="text-lg md:text-xl font-black uppercase">
                Follow @tusharsoni014
              </span>
            </Button>
          </a>

          <button className="mt-8 text-black font-bold underline decoration-[3px] decoration-orange-500 underline-offset-8 hover:bg-orange-500/10 transition-colors px-2 py-1 cursor-pointer">
            Join the waitlist for early access
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
