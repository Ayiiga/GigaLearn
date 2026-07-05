"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  Sparkles,
  Gamepad2,
  BarChart3,
  Trophy,
  Settings,
  Menu,
  X,
  Wifi,
  WifiOff,
  Moon,
  Sun,
  Calculator,
  Target,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useOnlineStatus } from "@/components/providers/app-providers";
import { UserMenu } from "@/components/auth/user-menu";
import { useGamification } from "@/stores/app-store";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/gigaphonics", label: "GigaPhonics", icon: Sparkles },
  { href: "/gigamath", label: "GigaMath", icon: Calculator },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/quests", label: "Quests", icon: Target },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isOnline = useOnlineStatus();
  const gamification = useGamification();

  return (
    <header className="sticky top-0 z-50 border-b border-giga-border bg-white/90 backdrop-blur-lg dark:bg-giga-surface/90 dark:border-giga-border-dark safe-bottom">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <div>
            <span className="font-display text-xl font-bold text-gradient">GigaLearn</span>
            <p className="hidden text-xs text-giga-muted sm:block">Learn, Read, Speak, and Grow Smarter</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors min-h-[44px]",
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-giga-purple/10 text-giga-purple"
                  : "text-giga-muted hover:bg-giga-purple/5 hover:text-giga-purple",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <UserMenu />

          <div className="hidden items-center gap-2 rounded-full bg-giga-yellow/20 px-3 py-1.5 sm:flex">
            <span className="text-sm">⭐ {gamification.xp} XP</span>
            <span className="text-sm">🪙 {gamification.coins}</span>
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="touch-target flex items-center justify-center rounded-xl p-2 text-giga-muted hover:bg-giga-purple/10"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-1 rounded-full px-2 py-1 text-xs" aria-label={isOnline ? "Online" : "Offline mode"}>
            {isOnline ? (
              <Wifi className="h-4 w-4 text-giga-green" />
            ) : (
              <WifiOff className="h-4 w-4 text-giga-orange" />
            )}
          </div>

          <button
            className="touch-target flex items-center justify-center rounded-xl p-2 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-giga-border bg-white px-4 py-4 lg:hidden dark:bg-giga-surface dark:border-giga-border-dark"
        >
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 font-semibold min-h-[48px]",
                  pathname === href ? "bg-giga-purple/10 text-giga-purple" : "text-giga-muted",
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </div>
        </motion.nav>
      )}
    </header>
  );
}
