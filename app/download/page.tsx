import type { Metadata } from "next";
import DownloadPageContent from "@/components/download-page-content";

export const metadata: Metadata = {
  title: "Download & Install Extension",
  description: "Install the Lazee.dev browser extension from the Chrome Web Store. Firefox add-on coming soon.",
};

export default function DownloadPage() {
  return <DownloadPageContent />;
}
