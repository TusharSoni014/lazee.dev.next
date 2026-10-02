import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@firecrawl/pdf-inspector",
    "@firecrawl/pdf-inspector-win32-x64-msvc",
    "@firecrawl/pdf-inspector-linux-x64-gnu",
    "@firecrawl/pdf-inspector-darwin-arm64",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
    dangerouslyAllowSVG: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/jobs",
        destination: "/careers",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
