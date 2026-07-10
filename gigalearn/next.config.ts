import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/learn", destination: "/", permanent: false },
      { source: "/learn/:path*", destination: "/", permanent: false },
      { source: "/gigaphonics", destination: "/breaking", permanent: false },
      { source: "/gigamath", destination: "/sports", permanent: false },
      { source: "/ai-tutor", destination: "/ai-assistant", permanent: false },
      { source: "/quests", destination: "/trending", permanent: false },
      { source: "/progress", destination: "/profile", permanent: false },
      { source: "/achievements", destination: "/profile", permanent: false },
      { source: "/games", destination: "/entertainment", permanent: false },
      { source: "/stories", destination: "/videos", permanent: false },
      { source: "/vocabulary", destination: "/", permanent: false },
      { source: "/grammar", destination: "/", permanent: false },
      { source: "/parents", destination: "/about", permanent: false },
      { source: "/teachers", destination: "/about", permanent: false },
      { source: "/ecosystems/:path*", destination: "/", permanent: false },
      { source: "/dashboard/:path*", destination: "/profile", permanent: false },
    ];
  },
  ...(isGithubPages
    ? {
        output: "export",
        trailingSlash: true,
        basePath: basePath || undefined,
        assetPrefix: basePath || undefined,
      }
    : {}),
  images: {
    unoptimized: isGithubPages,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
    },
  },
};

const withPwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development" || isGithubPages,
  register: true,
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "supabase-api",
          expiration: { maxEntries: 64, maxAgeSeconds: 24 * 60 * 60 },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-images",
          expiration: { maxEntries: 128, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
      {
        urlPattern: /\.(?:js|css)$/i,
        handler: "StaleWhileRevalidate",
        options: { cacheName: "static-assets" },
      },
    ],
  },
});

const config = isGithubPages ? nextConfig : withPwaConfig(nextConfig);

if (!isGithubPages && process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

export default config;
