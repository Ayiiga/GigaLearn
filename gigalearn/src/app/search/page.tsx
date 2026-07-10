"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { MediaPageShell } from "@/components/media/section-header";
import { globalSearch } from "@/content/media";
import { GlobalSearchBar } from "@/components/media/search-bar";

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const results = globalSearch(q);

  return (
    <MediaPageShell title="Search" subtitle={q ? `Results for "${q}"` : "Search news, videos, TV, radio, and more"}>
      <GlobalSearchBar className="mb-8" />
      {q && (
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
            <p className="text-center text-giga-muted py-12">No results found for &quot;{q}&quot;</p>
          )}
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
