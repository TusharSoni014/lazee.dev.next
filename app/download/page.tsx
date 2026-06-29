import type { Metadata } from "next";
import DownloadPageContent from "@/components/download-page-content";

export const metadata: Metadata = {
  title: "Download & Install Extension",
  description: "Download and manually install the Lazee.dev browser extension for Chrome and Firefox in under 30 seconds.",
};

export default function DownloadPage() {
  return <DownloadPageContent />;
}
