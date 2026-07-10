import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Inter, Outfit } from "next/font/google";
import { ThemeProvider, OnlineStatusProvider } from "@/components/providers/app-providers";
import { AuthOfflineBridge } from "@/components/providers/auth-offline-bridge";
import { MonitoringProvider } from "@/components/providers/monitoring-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  keywords: [
    "African news",
    "live TV",
    "sports",
    "World Cup 2026",
    "breaking news",
    "GigaTrend TV",
    "PWA",
    "AI news summaries",
  ],
  authors: [{ name: BRAND.name }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: BRAND.shortName,
  },
  openGraph: {
    title: BRAND.name,
    description: BRAND.tagline,
    type: "website",
    siteName: BRAND.name,
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.name,
    description: BRAND.tagline,
    creator: BRAND.twitter,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1628" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <OnlineStatusProvider>
            <AuthOfflineBridge />
            <MonitoringProvider />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Analytics />
          </OnlineStatusProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
