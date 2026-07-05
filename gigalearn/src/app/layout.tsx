import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Nunito, Fredoka } from "next/font/google";
import { ThemeProvider, OnlineStatusProvider } from "@/components/providers/app-providers";
import { AuthOfflineBridge } from "@/components/providers/auth-offline-bridge";
import { MonitoringProvider } from "@/components/providers/monitoring-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GigaLearn — Learn, Read, Speak, and Grow Smarter",
    template: "%s | GigaLearn",
  },
  description:
    "The most engaging English learning platform for toddlers, kindergarten, and primary learners. Featuring GigaPhonics, interactive stories, AI tutor, and offline-first PWA.",
  keywords: ["English learning", "phonics", "GigaPhonics", "children education", "PWA", "offline learning"],
  authors: [{ name: "GigaLearn" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GigaLearn",
  },
  openGraph: {
    title: "GigaLearn",
    description: "Learn, Read, Speak, and Grow Smarter Every Day.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6c5ce7" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} ${fredoka.variable} antialiased min-h-screen flex flex-col`}>
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
