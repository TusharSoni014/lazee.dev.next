import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fefaf6] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-[4px] border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-[#ff6b00] animate-spin" />
          </div>
        </div>
        <div className="inline-block border-[3px] border-black bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-black uppercase tracking-widest text-black">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
}
