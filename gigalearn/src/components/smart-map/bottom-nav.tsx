"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Navigation, Shield, LayoutDashboard, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAi40Enabled, useAiExpansionEnabled, usePublicSafetyEnabled } from "@/lib/features/use-feature-flag";

export function BottomNav() {
  const pathname = usePathname();
  const publicSafety = usePublicSafetyEnabled();
  const aiExpansion = useAiExpansionEnabled();
  const ai40 = useAi40Enabled();

  const items = [
    { href: "/", label: "Map", icon: Home, show: true },
    { href: "/search", label: "Search", icon: Search, show: true },
    { href: "/navigate", label: "Navigate", icon: Navigation, show: true },
    { href: "/smart-safety", label: "AI 4.0", icon: Sparkles, show: ai40 },
    { href: "/safety", label: "Safety", icon: Shield, show: publicSafety },
    { href: "/ai-assistant", label: "AI", icon: Bot, show: aiExpansion && !ai40 },
    { href: "/dashboard", label: "Hub", icon: LayoutDashboard, show: true },
    { href: "/profile", label: "Profile", icon: User, show: !publicSafety && !aiExpansion },
  ].filter((item) => item.show);

  return (
    <nav
      className="pointer-events-auto fixed inset-x-0 bottom-0 z-40 border-t border-white/20 bg-white/80 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl dark:border-white/10 dark:bg-[#0B3A63]/85"
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-0.5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-2xl px-1 text-[11px] font-semibold transition-colors",
                  active
                    ? "bg-sm-primary/10 text-sm-primary dark:bg-white/10 dark:text-white"
                    : "text-slate-500 hover:text-sm-primary dark:text-slate-300",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
