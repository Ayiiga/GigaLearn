"use client";

import Link from "next/link";
import { useState } from "react";
import { TrendingUp, Flame, Hash } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import type { TrendingItem } from "@/types/media";
import { cn } from "@/lib/utils";

type TrendingPeriod = "today" | "week" | "month";

const PERIOD_LABELS: Record<TrendingPeriod, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
};

function filterByPeriod(items: TrendingItem[], period: TrendingPeriod): TrendingItem[] {
  if (period === "today") return items;
  if (period === "week") return [...items].sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
  return [...items].reverse();
}

function TrendingList({ title, items, icon }: { title: string; items: TrendingItem[]; icon: React.ReactNode }) {
  return (
    <GlassCard className="h-full">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h3 className="font-display font-bold">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={item.id}>
            <Link
              href={`/search?q=${encodeURIComponent(item.label)}`}
              className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors hover:bg-gtv-purple/5"
            >
              <span className="w-5 text-center font-bold text-giga-muted">{i + 1}</span>
              <span className="flex-1 font-medium">{item.label}</span>
              {item.change === "new" && (
                <span className="rounded-full bg-gtv-gold/20 px-2 py-0.5 text-[10px] font-bold text-gtv-gold">NEW</span>
              )}
              {item.change === "up" && <TrendingUp className="h-3.5 w-3.5 text-gtv-green" aria-label="Trending up" />}
              {item.count && (
                <span className="text-xs text-giga-muted">{(item.count / 1000).toFixed(1)}k</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

export function TrendingPanel({
  stories,
  videos,
  hashtags,
  searches,
  topics,
  people,
  showPeriodFilter = false,
}: {
  stories: TrendingItem[];
  videos: TrendingItem[];
  hashtags: TrendingItem[];
  searches: TrendingItem[];
  topics: TrendingItem[];
  people: TrendingItem[];
  showPeriodFilter?: boolean;
}) {
  const [period, setPeriod] = useState<TrendingPeriod>("today");

  const filteredStories = filterByPeriod(stories, period);
  const filteredVideos = filterByPeriod(videos, period);
  const filteredHashtags = filterByPeriod(hashtags, period);
  const filteredSearches = filterByPeriod(searches, period);
  const filteredTopics = filterByPeriod(topics, period);
  const filteredPeople = filterByPeriod(people, period);

  return (
    <div>
      {showPeriodFilter && (
        <div className="mb-6 flex gap-2" role="tablist" aria-label="Trending period">
          {(Object.keys(PERIOD_LABELS) as TrendingPeriod[]).map((p) => (
            <button
              key={p}
              role="tab"
              aria-selected={period === p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors min-h-[40px]",
                period === p
                  ? "bg-gtv-purple text-white"
                  : "bg-gtv-purple/10 text-gtv-purple hover:bg-gtv-purple/20",
              )}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TrendingList title="Trending Stories" items={filteredStories} icon={<Flame className="h-5 w-5 text-gtv-red" />} />
        <TrendingList title="Trending Videos" items={filteredVideos} icon={<TrendingUp className="h-5 w-5 text-gtv-cyan" />} />
        <TrendingList title="Trending Hashtags" items={filteredHashtags} icon={<Hash className="h-5 w-5 text-gtv-purple" />} />
        <TrendingList title="Trending Searches" items={filteredSearches} icon={<TrendingUp className="h-5 w-5 text-gtv-gold" />} />
        <TrendingList title="Trending Topics" items={filteredTopics} icon={<Flame className="h-5 w-5 text-gtv-orange" />} />
        <TrendingList title="Popular People" items={filteredPeople} icon={<TrendingUp className="h-5 w-5 text-gtv-purple" />} />
      </div>
    </div>
  );
}

export function LiveIndicator({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-gtv-red/10 px-2.5 py-0.5 text-xs font-bold text-gtv-red", className)}>
      <span className="h-2 w-2 animate-pulse rounded-full bg-gtv-red" aria-hidden />
      LIVE
    </span>
  );
}
