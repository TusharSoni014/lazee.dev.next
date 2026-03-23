import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { ExtensionAuthSync } from "@/components/ExtensionAuthSync";
import { LoginSuccessModal } from "@/components/LoginSuccessModal";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toast";
import { Footer } from "@/components/footer";
import { Providers as QueryProvider } from "@/components/providers/query-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lazee.dev"),
  title: {
    default: "Lazee.dev — Job Applications, 100x Faster",
    template: "%s | Lazee.dev",
  },
  description:
    "The AI-powered browser extension that auto-fills job applications using your profile. Save hours on repetitive forms and apply to jobs 100x faster.",
  keywords: [
    "job application autofill",
    "AI job apply",
    "browser extension",
    "job hunting automation",
    "auto fill forms",
    "lazee.dev",
  ],
  authors: [{ name: "Lazee.dev" }],
  creator: "Lazee.dev",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lazee.dev",
    siteName: "Lazee.dev",
    title: "Lazee.dev — Job Applications, 100x Faster",
    description:
      "The AI-powered browser extension that auto-fills job applications using your profile. Apply to jobs 100x faster.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Lazee.dev Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lazee.dev — Job Applications, 100x Faster",
    description:
      "The AI-powered browser extension that auto-fills job applications using your profile.",
    images: ["/logo.png"],
    creator: "@tusharsoni014",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SessionProvider>
            <QueryProvider>
              <SiteHeader />
              <main className="pt-16 grow bg-[#fefaf6] text-black transition-colors">
                {children}
              </main>
              <Footer />
              <ExtensionAuthSync />
              <Suspense fallback={null}>
                <LoginSuccessModal />
              </Suspense>
            </QueryProvider>
          </SessionProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
