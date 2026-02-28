import { ArrowRight, FileText, Globe, Wand2 } from "lucide-react";

export function FeaturesSection() {
  return (
    <div
      id="features"
      className="flex flex-col items-center w-full max-w-[1400px] mx-auto animate-fade-in-up [animation-delay:600ms]"
    >
      <div className="w-full mb-16 text-center max-w-4xl mx-auto">
        <div className="inline-block bg-[#ff80ab] border-[3px] border-black px-4 py-1 mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
          <h2 className="text-black text-lg font-bold uppercase tracking-wide">
            Why You Need This Tool
          </h2>
        </div>
        <h2 className="text-black text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-6 uppercase">
          Powerful Features
          <br />
          Zero Bullshit.
        </h2>
        <p className="text-black text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed border-l-4 border-black pl-6 text-left md:text-center md:border-none md:pl-0 bg-white/50 p-2 md:bg-transparent tracking-tight">
          Our extension is packed with tools designed to make your job
          application process faster, safer, and essentially automated.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-20">
        {/* Feature 1 */}
        <div className="flex flex-col h-full bg-[#ff6b00] border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 group">
          <div className="flex justify-between items-start mb-6">
            <div className="size-16 bg-white border-[3px] border-black flex items-center justify-center rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none transition-all">
              <Wand2 className="text-black w-8 h-8" />
            </div>
            <span className="text-5xl font-black text-black/10 select-none">
              01
            </span>
          </div>
          <h3 className="text-black text-2xl font-black mb-4 uppercase">
            Smart Auto-fill
          </h3>
          <p className="text-black text-lg font-medium leading-snug grow">
            Automatically detects and fills job application forms with your
            saved data using advanced AI algorithms. Say goodbye to repetitive
            typing.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col h-full bg-[#ffeb3b] border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 group">
          <div className="flex justify-between items-start mb-6">
            <div className="size-16 bg-white border-[3px] border-black flex items-center justify-center rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none transition-all">
              <FileText className="text-black w-8 h-8" />
            </div>
            <span className="text-5xl font-black text-black/10 select-none">
              02
            </span>
          </div>
          <h3 className="text-black text-2xl font-black mb-4 uppercase">
            One Ultimate Source
          </h3>
          <p className="text-black text-lg font-medium leading-snug grow">
            Manage standard fields like emails, socials, and multiple resumes
            from a single profile. Best of all? Non-AI autofill is completely
            free forever.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col h-full bg-[#00bcd4] border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 group">
          <div className="flex justify-between items-start mb-6">
            <div className="size-16 bg-white border-[3px] border-black flex items-center justify-center rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none transition-all">
              <Globe className="text-black w-8 h-8" />
            </div>
            <span className="text-5xl font-black text-black/10 select-none">
              03
            </span>
          </div>
          <h3 className="text-black text-2xl font-black mb-4 uppercase">
            Multi-site Support
          </h3>
          <p className="text-black text-lg font-medium leading-snug grow">
            Works seamlessly across all major job boards and company career
            pages worldwide.
          </p>
          <div className="mt-4 mb-2 bg-white border-[3px] border-black p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
            <p className="text-sm font-bold uppercase mb-2 border-b-2 border-black pb-1 text-black">
              Supported on:
            </p>
            <div className="text-black text-xs font-bold text-center mt-1">
              Chrome, Firefox, Safari
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
