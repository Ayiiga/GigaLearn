"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Clock, TrendingUp, X } from "lucide-react";
import { MediaPageShell } from "@/components/media/section-header";
import { globalSearch, getSearchSuggestions, TRENDING_SEARCHES } from "@/content/media";
import type { SearchFilter } from "@/content/media";
import { GlobalSearchBar, SEARCH_FILTERS } from "@/components/media/search-bar";
import { useMediaStore } from "@/stores/media-store";
import { cn } from "@/lib/utils";

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [filter, setFilter] = useState<SearchFilter>("all");
  const searchHistory = useMediaStore((s) => s.preferences.searchHistory ?? []);
  const clearSearchHistory = useMediaStore((s) => s.clearSearchHistory);
  const addSearchHistory = useMediaStore((s) => s.addSearchHistory);
  const results = q ? globalSearch(q, filter) : [];

  const handleSearch = (query: string) => {
    addSearchHistory(query);
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <MediaPageShell title="Search" subtitle="Find news, videos, TV, radio, sports, and trending topics">
      <GlobalSearchBar className="mb-6" autoFocus onSubmit={handleSearch} />

      {q && (
        <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Search category filters">
          {SEARCH_FILTERS.map(({ id, label }) => (
            <button
              key={id}
              role="tab"
              aria-selected={filter === id}
              onClick={() => setFilter(id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors min-h-[40px]",
                filter === id
                  ? "bg-gtv-purple text-white"
                  : "bg-gtv-purple/10 text-gtv-purple hover:bg-gtv-purple/20",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {!q && (
        <div className="grid gap-8 lg:grid-cols-2">
          {searchHistory.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-display font-bold">
                  <Clock className="h-5 w-5 text-gtv-purple" /> Search History
                </h2>
                <button
                  onClick={clearSearchHistory}
                  className="flex items-center gap-1 text-xs font-semibold text-giga-muted hover:text-gtv-red"
                >
                  <X className="h-3.5 w-3.5" /> Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((s) => (
                  <Link
                    key={s}
                    href={`/search?q=${encodeURIComponent(s)}`}
                    className="rounded-full border border-giga-border px-4 py-2 text-sm font-medium hover:border-gtv-purple hover:bg-gtv-purple/5"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-4 flex items-center gap-2 font-display font-bold">
              <TrendingUp className="h-5 w-5 text-gtv-gold" /> Trending Searches
            </h2>
            <div className="space-y-2">
              {TRENDING_SEARCHES.map((item, i) => (
                <Link
                  key={item.id}
                  href={`/search?q=${encodeURIComponent(item.label)}`}
                  className="flex items-center gap-3 rounded-xl border border-giga-border px-4 py-3 hover:border-gtv-purple hover:bg-gtv-purple/5"
                >
                  <span className="w-6 text-center font-bold text-giga-muted">{i + 1}</span>
                  <span className="font-medium">{item.label}</span>
                  {item.change === "new" && (
                    <span className="ml-auto rounded-full bg-gtv-gold/20 px-2 py-0.5 text-[10px] font-bold text-gtv-gold">NEW</span>
                  )}
                </Link>
              ))}
            </div>
          </section>

          <section className="lg:col-span-2">
            <h2 className="mb-4 font-display font-bold">Popular Topics</h2>
            <div className="flex flex-wrap gap-2">
              {getSearchSuggestions().map((s) => (
                <Link
                  key={s}
                  href={`/search?q=${encodeURIComponent(s)}`}
                  className="rounded-full bg-gtv-cyan/10 px-4 py-2 text-sm font-semibold text-gtv-cyan hover:bg-gtv-cyan/20"
                >
                  {s}
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      {q && (
        <div>
          <p className="mb-4 text-sm text-giga-muted">
            {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{q}&quot;
            {filter !== "all" && ` in ${SEARCH_FILTERS.find((f) => f.id === filter)?.label}`}
          </p>
          <div className="space-y-2">
            {results.length > 0 ? (
              results.map((r) => (
                <Link
                  key={`${r.type}-${r.id}`}
                  href={r.href}
                  className="flex items-center gap-3 rounded-2xl border border-giga-border p-4 hover:border-gtv-purple hover:bg-gtv-purple/5 transition-colors"
                >
                  <span className="rounded bg-gtv-purple/10 px-2 py-1 text-xs font-bold uppercase text-gtv-purple">{r.type}</span>
                  <div>
                    <p className="font-semibold">{r.title}</p>
                    {r.subtitle && <p className="text-sm text-giga-muted">{r.subtitle}</p>}
                  </div>
                </Link>
              ))
            ) : (
              <p className="py-12 text-center text-giga-muted">No results found for &quot;{q}&quot;</p>
            )}
          </div>
        </div>
      )}
    </MediaPageShell>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading search...</div>}>
      <SearchResults />
    </Suspense>
  );
}
