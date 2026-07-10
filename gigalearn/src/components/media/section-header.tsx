import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function SectionHeader({
  title,
  subtitle,
  href,
  className,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex items-end justify-between gap-4", className)}>
      <div>
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-giga-muted">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-gtv-purple hover:underline shrink-0">
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export function MediaPageShell({
  title,
  subtitle,
  children,
  hero,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  hero?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      {hero ?? (
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold sm:text-4xl bg-gradient-to-r from-gtv-deep via-gtv-purple to-gtv-cyan bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-giga-muted max-w-2xl">{subtitle}</p>}
        </header>
      )}
      {children}
    </div>
  );
}
