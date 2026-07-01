"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink, Info, AlertTriangle, Clock } from "lucide-react";
import { FaChrome, FaFirefox } from "react-icons/fa";
import { useBrowser } from "@/hooks/use-browser";
import { CHROME_EXTENSION_URL, FIREFOX_ZIP_URL } from "@/lib/constants";

export default function DownloadPageContent() {
  const detectedBrowser = useBrowser();
  const [activeTab, setActiveTab] = useState<"chrome" | "firefox">("chrome");

  // Automatically switch tab based on detected browser on client load
  useEffect(() => {
    if (detectedBrowser === "firefox") {
      setActiveTab("firefox");
    } else {
      setActiveTab("chrome");
    }
  }, [detectedBrowser]);

  return (
    <div className="min-h-screen bg-[#fefaf6] text-black pb-20 selection:bg-orange-500 selection:text-white">
      {/* Decorative Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-8 md:pt-12">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase bg-white border-2 border-black px-4 py-1.5 hover:bg-[#f26c0d]/10 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
            href="/"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center md:text-left mb-10">
          <h1 className="text-4xl md:text-6xl font-black uppercase leading-none tracking-tighter italic mb-4">
            Install <span className="text-[#f26c0d]">Lazee.dev</span> Extension
          </h1>
          <p className="text-zinc-700 text-base md:text-lg font-bold max-w-2xl leading-relaxed">
            Our Chrome extension is now live on the Chrome Web Store! Install it directly from the store for the best experience. Firefox add-on is coming soon.
          </p>
        </div>

        {/* Download Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Chrome Card */}
          <div className="bg-white border-[3px] border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between relative overflow-hidden">
            {/* LIVE badge */}
            <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Live
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 text-amber-600 p-2.5 rounded-full border-2 border-black">
                  <FaChrome className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Chrome & Chromium</h3>
                  <p className="text-xs text-zinc-500 font-bold">Chrome, Brave, Edge, Opera, etc.</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 font-bold mb-6">
                Install directly from the Chrome Web Store. Works on all Chromium-based browsers including <strong className="text-black">Chrome, Edge, Brave, Opera</strong> and more.
              </p>
            </div>
            <a
              href={CHROME_EXTENSION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-full items-center justify-center border-2 border-black bg-black text-white hover:bg-zinc-900 text-sm font-black uppercase tracking-tight shadow-[3px_3px_0px_0px_rgba(249,115,22,1)] hover:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Install from Chrome Web Store
            </a>
          </div>

          {/* Firefox Card */}
          <div className="bg-white border-[3px] border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between relative overflow-hidden">
            {/* COMING SOON badge */}
            <div className="absolute top-3 right-3 bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Coming Soon
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 text-orange-600 p-2.5 rounded-full border-2 border-black">
                  <FaFirefox className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Firefox Browser</h3>
                  <p className="text-xs text-zinc-500 font-bold">Mozilla Firefox</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 font-bold mb-6">
                The Firefox add-on is coming soon! In the meantime, you can load it as a temporary add-on, or use a <strong className="text-black">Chrome / Edge / Brave</strong> browser to install from the Web Store.
              </p>
            </div>
            <a
              href={FIREFOX_ZIP_URL}
              download
              className="flex h-12 w-full items-center justify-center border-2 border-black bg-zinc-700 text-white hover:bg-zinc-600 text-sm font-black uppercase tracking-tight shadow-[3px_3px_0px_0px_rgba(249,115,22,1)] hover:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer gap-2"
            >
              <Download className="w-4 h-4" />
              Download Firefox ZIP (Temporary)
            </a>
          </div>
        </div>

        {/* Tab Header for Instructions */}
        <div className="border-b-[3px] border-black flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("chrome")}
            className={`flex-1 md:flex-none px-3 md:px-6 py-3 font-black uppercase text-sm md:text-base border-t-[3px] border-x-[3px] border-black translate-y-[3px] transition-all cursor-pointer flex items-center justify-center md:justify-start gap-2 whitespace-nowrap ${
              activeTab === "chrome"
                ? "bg-white border-b-[3px] border-b-white"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-50 hover:text-black"
            }`}
          >
            <FaChrome className="w-4 h-4 flex-shrink-0" />
            <span className="hidden md:inline">Chrome Instructions</span>
            <span className="md:hidden">Chrome</span>
          </button>
          <button
            onClick={() => setActiveTab("firefox")}
            className={`flex-1 md:flex-none px-3 md:px-6 py-3 font-black uppercase text-sm md:text-base border-t-[3px] border-x-[3px] border-black translate-y-[3px] transition-all cursor-pointer flex items-center justify-center md:justify-start gap-2 whitespace-nowrap ${
              activeTab === "firefox"
                ? "bg-white border-b-[3px] border-b-white"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-50 hover:text-black"
            }`}
          >
            <FaFirefox className="w-4 h-4 flex-shrink-0" />
            <span className="hidden md:inline">Firefox Instructions</span>
            <span className="md:hidden">Firefox</span>
          </button>
        </div>

        {/* Instructions Container */}
        <div className="bg-white border-[3px] border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          {activeTab === "chrome" ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">
                Install from <span className="text-[#f26c0d]">Chrome Web Store</span>
              </h2>

              {/* Steps */}
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-[#f26c0d] text-white w-8 h-8 flex items-center justify-center font-black border-2 border-black text-sm uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase text-zinc-900">Visit the Chrome Web Store</h4>
                    <p className="text-sm font-bold text-zinc-600 mt-1 leading-relaxed">
                      Click the <strong className="text-black">Install from Chrome Web Store</strong> button above, or visit the{" "}
                      <a
                        href={CHROME_EXTENSION_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f26c0d] underline underline-offset-2 hover:text-orange-700 transition-colors"
                      >
                        extension page
                      </a>{" "}
                      directly.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-[#f26c0d] text-white w-8 h-8 flex items-center justify-center font-black border-2 border-black text-sm uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase text-zinc-900">Click &quot;Add to Chrome&quot;</h4>
                    <p className="text-sm font-bold text-zinc-600 mt-1 leading-relaxed">
                      On the store page, click the <strong className="text-black">Add to Chrome</strong> button. A confirmation dialog will appear — click <strong className="text-black">Add extension</strong> to confirm.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-green-500 text-white w-8 h-8 flex items-center justify-center font-black border-2 border-black text-sm uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase text-green-600">Pin & Use</h4>
                    <p className="text-sm font-bold text-zinc-600 mt-1 leading-relaxed">
                      The Lazee.dev extension is now installed! Click the puzzle icon in your toolbar, find <strong className="text-black">Lazee.dev</strong>, and click the pin icon to make it easily accessible.
                    </p>
                  </div>
                </div>
              </div>

              {/* Info notice */}
              <div className="bg-green-50 border-2 border-green-500 p-4 mt-8 flex gap-3">
                <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-800 font-bold leading-relaxed">
                  NOTE: Installing from the Chrome Web Store ensures automatic updates and a seamless experience. This also works on <strong className="text-black">Edge, Brave, Opera</strong>, and other Chromium-based browsers.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">
                Firefox Add-on — <span className="text-[#f26c0d]">Coming Soon</span>
              </h2>

              <div className="bg-amber-50 border-2 border-amber-500 p-4 mb-6 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 font-bold leading-relaxed">
                  <p>The Firefox add-on is coming soon! In the meantime, you can load the extension temporarily using the steps below. For a permanent and seamless experience, we recommend using <strong className="text-black">Google Chrome, Microsoft Edge, or Brave</strong> to{" "}
                    <a
                      href={CHROME_EXTENSION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f26c0d] underline underline-offset-2 hover:text-orange-700 transition-colors"
                    >
                      install from the Chrome Web Store
                    </a>.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-black uppercase tracking-tight text-zinc-700">
                Temporary Install Instructions
              </h3>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-[#f26c0d] text-white w-8 h-8 flex items-center justify-center font-black border-2 border-black text-sm uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase text-zinc-900">Download ZIP & Extract</h4>
                    <p className="text-sm font-bold text-zinc-600 mt-1 leading-relaxed">
                      Click the <strong className="text-black">Download Firefox ZIP</strong> button above. Once downloaded, extract (unzip) the contents of the zip file into a folder on your computer.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-[#f26c0d] text-white w-8 h-8 flex items-center justify-center font-black border-2 border-black text-sm uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase text-zinc-900">Open Firefox Debugging</h4>
                    <p className="text-sm font-bold text-zinc-600 mt-1 leading-relaxed">
                      Open Firefox, and navigate to:
                    </p>
                    <code className="inline-block mt-2 bg-zinc-100 border-2 border-zinc-300 px-3 py-1 font-bold text-xs uppercase text-zinc-800">
                      about:debugging
                    </code>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-[#f26c0d] text-white w-8 h-8 flex items-center justify-center font-black border-2 border-black text-sm uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase text-zinc-900">Select This Firefox</h4>
                    <p className="text-sm font-bold text-zinc-600 mt-1 leading-relaxed">
                      Click on <strong className="text-black">This Firefox</strong> in the left sidebar menu.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-[#f26c0d] text-white w-8 h-8 flex items-center justify-center font-black border-2 border-black text-sm uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    4
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase text-zinc-900">Load Temporary Add-on</h4>
                    <p className="text-sm font-bold text-zinc-600 mt-1 leading-relaxed">
                      Click the <strong className="text-black">Load Temporary Add-on...</strong> button. Navigate to your extracted extension directory and select the <strong className="text-black">manifest.json</strong> file (or any file inside the directory).
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-green-500 text-white w-8 h-8 flex items-center justify-center font-black border-2 border-black text-sm uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase text-green-600">All Set!</h4>
                    <p className="text-sm font-bold text-zinc-600 mt-1 leading-relaxed">
                      The extension will appear in your Firefox toolbar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-amber-500 p-4 mt-8 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 font-bold leading-relaxed">
                  IMPORTANT: Firefox automatically removes temporary add-ons when the browser is closed. You will need to reload it each time you restart Firefox. For a permanent experience, use{" "}
                  <a
                    href={CHROME_EXTENSION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f26c0d] underline underline-offset-2 hover:text-orange-700 transition-colors font-black"
                  >
                    Chrome, Edge, or Brave
                  </a>{" "}
                  to install from the Web Store.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
