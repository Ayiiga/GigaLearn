"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Mic, MicOff, X } from "lucide-react";
import { globalSearch, getSearchSuggestions } from "@/content/media";
import { cn } from "@/lib/utils";
import { SpeechRecognizer } from "@/lib/speech";

export function GlobalSearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const suggestions = getSearchSuggestions();
  const results = query.trim() ? globalSearch(query) : [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleVoice = useCallback(() => {
    const recognizer = new SpeechRecognizer();
    setListening(true);
    recognizer.start(
      (transcript) => {
        setQuery(transcript);
        setOpen(true);
        setListening(false);
      },
      () => setListening(false),
    );
  }, []);

  const submit = (q: string) => {
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-giga-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => e.key === "Enter" && query.trim() && submit(query)}
            placeholder="Search news, videos, TV, radio, teams..."
            className="w-full rounded-2xl border border-giga-border bg-white/80 py-3 pl-12 pr-4 text-sm font-medium backdrop-blur-sm focus:border-gtv-purple focus:outline-none focus:ring-2 focus:ring-gtv-purple/20 dark:bg-giga-surface/80 min-h-[48px]"
            aria-label="Global search"
          />
        </div>
        <button
          onClick={handleVoice}
          className={cn(
            "touch-target flex items-center justify-center rounded-2xl border px-4 min-h-[48px]",
            listening ? "border-gtv-red bg-gtv-red/10 text-gtv-red" : "border-giga-border hover:border-gtv-purple",
          )}
          aria-label={listening ? "Listening" : "Voice search"}
        >
          {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div
          id="search-results"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-giga-border bg-white shadow-2xl dark:bg-giga-surface"
          role="listbox"
        >
          {query.trim() ? (
            results.length > 0 ? (
              results.map((r) => (
                <button
                  key={`${r.type}-${r.id}`}
                  onClick={() => submit(r.title)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-gtv-purple/5 min-h-[48px]"
                >
                  <span className="rounded bg-gtv-purple/10 px-2 py-0.5 text-xs font-bold uppercase text-gtv-purple">{r.type}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{r.title}</p>
                    {r.subtitle && <p className="text-xs text-giga-muted">{r.subtitle}</p>}
                  </div>
                </button>
              ))
            ) : (
              <p className="px-4 py-6 text-center text-sm text-giga-muted">No results found</p>
            )
          ) : (
            <div className="p-3">
              <p className="px-2 py-1 text-xs font-semibold uppercase text-giga-muted">Trending searches</p>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => { setQuery(s); submit(s); }}
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-gtv-purple/5"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {query && (
            <button
              onClick={() => submit(query)}
              className="w-full border-t border-giga-border px-4 py-3 text-sm font-semibold text-gtv-purple hover:bg-gtv-purple/5"
            >
              Search for &quot;{query}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function FloatingAiAssistant() {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const prompts = [
    "Who scored today?",
    "Latest World Cup news",
    "What's trending in Ghana?",
    "Summarize today's politics",
    "Explain this news simply",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {expanded && (
        <div className="mb-3 w-80 rounded-2xl border border-giga-border bg-white p-4 shadow-2xl dark:bg-giga-surface">
          <div className="flex items-center justify-between">
            <p className="font-display font-bold">Ask GigaTrend AI</p>
            <button onClick={() => setExpanded(false)} aria-label="Close"><X className="h-4 w-4" /></button>
          </div>
          <p className="mt-1 text-sm text-giga-muted">Voice-enabled news assistant with multi-language support.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {prompts.map((p) => (
              <button
                key={p}
                onClick={() => router.push(`/ai-assistant?q=${encodeURIComponent(p)}`)}
                className="rounded-full bg-gtv-purple/10 px-3 py-1.5 text-xs font-medium text-gtv-purple hover:bg-gtv-purple/20"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gtv-purple to-gtv-cyan text-white shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Ask GigaTrend AI"
      >
        <span className="text-xl">✨</span>
      </button>
    </div>
  );
}
