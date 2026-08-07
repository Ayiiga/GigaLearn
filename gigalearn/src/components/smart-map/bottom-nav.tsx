"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Search, Navigation, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Map", icon: Map, match: (p: string) => p === "/" },
  { href: "/search", label: "Search", icon: Search, match: (p: string) => p.startsWith("/search") },
  { href: "/navigate", label: "Navigate", icon: Navigation, match: (p: string) => p.startsWith("/navigate") },
  { href: "/safety", label: "Safety", icon: Shield, match: (p: string) => p.startsWith("/safety") || p.startsWith("/smart-safety") },
  { href: "/profile", label: "Profile", icon: User, match: (p: string) => p.startsWith("/profile") || p.startsWith("/settings") },
] as const;

export function BottomNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      className="pointer-events-auto fixed inset-x-0 bottom-0 z-40 border-t border-white/20 bg-white/90 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-xl dark:border-white/10 dark:bg-[#0B1220]/95"
      aria-label="Primary navigation"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between">
        {NAV_ITEMS.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href} className="flex-1 min-w-0">
              <Link
                href={href}
                className={cn(
                  "flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 text-[10px] font-semibold transition-colors sm:text-[11px]",
                  active
                    ? "bg-[#0F5B8D]/10 text-[#0F5B8D] dark:bg-white/10 dark:text-white"
                    : "text-slate-500 hover:text-[#0F5B8D] dark:text-slate-400",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.5 : 2} />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
