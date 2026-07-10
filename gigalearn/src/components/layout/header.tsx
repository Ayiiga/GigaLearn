"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Zap,
  Trophy,
  Tv,
  Radio,
  Play,
  TrendingUp,
  Briefcase,
  Cpu,
  Film,
  Globe,
  MapPin,
  Users,
  User,
  Menu,
  X,
  Wifi,
  WifiOff,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useOnlineStatus } from "@/components/providers/app-providers";
import { UserMenu } from "@/components/auth/user-menu";
import { BRAND } from "@/lib/brand";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/breaking", label: "Breaking", icon: Zap },
  { href: "/sports", label: "Sports", icon: Trophy },
  { href: "/world-cup-2026", label: "World Cup", icon: Trophy },
  { href: "/live-tv", label: "Live TV", icon: Tv },
  { href: "/live-radio", label: "Live Radio", icon: Radio },
  { href: "/videos", label: "Videos", icon: Play },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/business", label: "Business", icon: Briefcase },
  { href: "/technology", label: "Tech", icon: Cpu },
  { href: "/entertainment", label: "Entertainment", icon: Film },
  { href: "/africa", label: "Africa", icon: MapPin },
  { href: "/world", label: "World", icon: Globe },
  { href: "/community", label: "Community", icon: Users },
  { href: "/profile", label: "Profile", icon: User },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-50 border-b border-giga-border bg-white/90 backdrop-blur-lg dark:bg-giga-surface/90 dark:border-giga-border-dark">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gtv-purple to-gtv-cyan text-sm font-bold text-white">
            GT
          </span>
          <div>
            <span className="font-display text-lg font-bold text-gradient sm:text-xl">{BRAND.name}</span>
            <p className="hidden text-[10px] text-giga-muted sm:block leading-tight max-w-[180px]">{BRAND.tagline}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex overflow-x-auto" aria-label="Main navigation">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-semibold transition-colors min-h-[40px] whitespace-nowrap",
                pathname === href || (href !== "/" && pathname.startsWith(href))
                  ? "bg-gtv-purple/10 text-gtv-purple"
                  : "text-giga-muted hover:bg-gtv-purple/5 hover:text-gtv-purple",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <UserMenu />

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="touch-target flex items-center justify-center rounded-xl p-2 text-giga-muted hover:bg-gtv-purple/10"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="hidden sm:flex items-center gap-1 rounded-full px-2 py-1 text-xs" aria-label={isOnline ? "Online" : "Offline mode"}>
            {isOnline ? <Wifi className="h-4 w-4 text-gtv-green" /> : <WifiOff className="h-4 w-4 text-gtv-orange" />}
          </div>

          <button
            className="touch-target flex items-center justify-center rounded-xl p-2 xl:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-giga-border bg-white px-4 py-4 xl:hidden dark:bg-giga-surface max-h-[70vh] overflow-y-auto"
          aria-label="Mobile navigation"
        >
          <div className="grid grid-cols-2 gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold min-h-[48px]",
                  pathname === href ? "bg-gtv-purple/10 text-gtv-purple" : "text-giga-muted",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </motion.nav>
      )}
    </header>
  );
}
