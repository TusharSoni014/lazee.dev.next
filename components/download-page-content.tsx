"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Info, AlertTriangle } from "lucide-react";
import { FaChrome, FaFirefox } from "react-icons/fa";
import { useBrowser } from "@/hooks/use-browser";
import { CHROME_ZIP_URL, FIREFOX_ZIP_URL } from "@/lib/constants";

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
            Our extension is currently undergoing store review. Follow the quick steps below to load it manually in less than 30 seconds.
          </p>
        </div>

        {/* Download Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Chrome Card */}
          <div className="bg-white border-[3px] border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
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
                Download the ZIP bundle to load the extension via Developer Mode on any Chromium-based browser.
              </p>
            </div>
            <a
              href={CHROME_ZIP_URL}
              download
              className="flex h-12 w-full items-center justify-center border-2 border-black bg-black text-white hover:bg-zinc-900 text-sm font-black uppercase tracking-tight shadow-[3px_3px_0px_0px_rgba(249,115,22,1)] hover:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer gap-2"
            >
              <Download className="w-4 h-4" />
              Download Chrome ZIP
            </a>
          </div>

          {/* Firefox Card */}
          <div className="bg-white border-[3px] border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
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
                Download the ZIP bundle to load the extension temporarily. We recommend using <strong className="text-black">Google Chrome</strong> for a better, permanent experience.
              </p>
            </div>
            <a
              href={FIREFOX_ZIP_URL}
              download
              className="flex h-12 w-full items-center justify-center border-2 border-black bg-black text-white hover:bg-zinc-900 text-sm font-black uppercase tracking-tight shadow-[3px_3px_0px_0px_rgba(249,115,22,1)] hover:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer gap-2"
            >
              <Download className="w-4 h-4" />
              Download Firefox ZIP
            </a>
          </div>
        </div>

        {/* Tab Header for Instructions */}
        <div className="border-b-[3px] border-black flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("chrome")}
            className={`px-6 py-3 font-black uppercase text-sm md:text-base border-t-[3px] border-x-[3px] border-black translate-y-[3px] transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "chrome"
                ? "bg-white border-b-[3px] border-b-white"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-50 hover:text-black"
            }`}
          >
            <FaChrome className="w-4 h-4" />
            Chrome Instructions
          </button>
          <button
            onClick={() => setActiveTab("firefox")}
            className={`px-6 py-3 font-black uppercase text-sm md:text-base border-t-[3px] border-x-[3px] border-black translate-y-[3px] transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "firefox"
                ? "bg-white border-b-[3px] border-b-white"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-50 hover:text-black"
            }`}
          >
            <FaFirefox className="w-4 h-4" />
            Firefox Instructions
          </button>
        </div>

        {/* Instructions Container */}
        <div className="bg-white border-[3px] border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          {activeTab === "chrome" ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 mb-4">
                Manual Installation for <span className="text-[#f26c0d]">Chrome / Chromium</span>
              </h2>

              {/* Steps */}
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-[#f26c0d] text-white w-8 h-8 flex items-center justify-center font-black border-2 border-black text-sm uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase text-zinc-900">Download & Extract</h4>
                    <p className="text-sm font-bold text-zinc-600 mt-1 leading-relaxed">
                      Click the <strong className="text-black">Download Chrome ZIP</strong> button above. Once downloaded, extract (unzip) the contents of the zip file into a folder on your computer (e.g. into your Documents or a folder dedicated to extension utilities).
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-[#f26c0d] text-white w-8 h-8 flex items-center justify-center font-black border-2 border-black text-sm uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase text-zinc-900">Open Extensions Tab</h4>
                    <p className="text-sm font-bold text-zinc-600 mt-1 leading-relaxed">
                      In Chrome, Brave, or Edge, open a new tab and navigate to:
                    </p>
                    <code className="inline-block mt-2 bg-zinc-100 border-2 border-zinc-300 px-3 py-1 font-bold text-xs uppercase text-zinc-800">
                      chrome://extensions/
                    </code>
                    <p className="text-xs font-semibold text-zinc-500 mt-1">
                      (Or, click the puzzle icon in the top right and select &quot;Manage Extensions&quot;)
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-[#f26c0d] text-white w-8 h-8 flex items-center justify-center font-black border-2 border-black text-sm uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase text-zinc-900">Enable Developer Mode</h4>
                    <p className="text-sm font-bold text-zinc-600 mt-1 leading-relaxed">
                      In the top-right corner of the extensions page, toggle the <strong className="text-black">Developer mode</strong> switch to <strong className="text-black">ON</strong>.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-[#f26c0d] text-white w-8 h-8 flex items-center justify-center font-black border-2 border-black text-sm uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    4
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase text-zinc-900">Load Unpacked</h4>
                    <p className="text-sm font-bold text-zinc-600 mt-1 leading-relaxed">
                      Click the <strong className="text-black">Load unpacked</strong> button that appears in the top-left corner. Select the directory/folder where you extracted the zip files (ensure you select the folder containing <code className="text-xs bg-zinc-100 px-1 border font-mono">manifest.json</code>).
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
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

              {/* Developer notice */}
              <div className="bg-amber-50 border-2 border-amber-500 p-4 mt-8 flex gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 font-bold leading-relaxed">
                  NOTE: Keep the extracted folder in its location. If you delete or move the folder, Chrome will not be able to load the extension.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 mb-4">
                Manual Installation for <span className="text-[#f26c0d]">Firefox</span>
              </h2>

              <div className="bg-amber-50 border-2 border-amber-500 p-4 mb-6 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 font-bold leading-relaxed">
                  <p>Firefox requires self-signed or store-approved files for permanent installation. For now, we suggest loading the extension temporarily, or using <strong className="text-black">Google Chrome</strong> for a better experience.</p>
                </div>
              </div>

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
                  IMPORTANT: Firefox automatically removes temporary add-ons when the browser is closed. You will need to reload it when you restart Firefox, or switch to <strong className="text-black">Google Chrome</strong> for a permanent experience.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
