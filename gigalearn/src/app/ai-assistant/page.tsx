"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Bot, Mic, Send } from "lucide-react";
import { MediaPageShell } from "@/components/media/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { SpeechRecognizer } from "@/lib/speech";
import { BRAND } from "@/lib/brand";

const PROMPTS = [
  "Who scored today?",
  "Latest World Cup news",
  "What's trending in Ghana?",
  "Summarize today's politics",
  "Explain this news simply",
];

function AiAssistantContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const ask = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setQuery(q);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature: "news_assistant", input: q }),
      });
      const data = await res.json();
      setResponse(data.response ?? "I can help with news summaries, sports, and trending topics.");
    } catch {
      setResponse(`Here's a quick take on "${q}": Check our Breaking News and Sports sections for the latest updates. AI full integration coming with your OpenAI API key configured.`);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    const recognizer = new SpeechRecognizer();
    setListening(true);
    recognizer.start(
      (transcript) => { setQuery(transcript); setListening(false); ask(transcript); },
      () => setListening(false),
    );
  };

  return (
    <MediaPageShell title="Ask GigaTrend AI" subtitle="Voice-enabled news assistant with summaries and multi-language support">
      <GlassCard className="mb-6">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask(query)}
            placeholder="Ask about news, sports, trends..."
            className="flex-1 rounded-xl border border-giga-border px-4 py-3 text-sm focus:border-gtv-purple focus:outline-none focus:ring-2 focus:ring-gtv-purple/20 min-h-[48px]"
            aria-label="Ask GigaTrend AI"
          />
          <Button onClick={() => ask(query)} disabled={loading} aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={startVoice} disabled={listening} aria-label="Voice input">
            <Mic className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => ask(p)}
              className="rounded-full bg-gtv-purple/10 px-3 py-1.5 text-xs font-medium text-gtv-purple hover:bg-gtv-purple/20"
            >
              {p}
            </button>
          ))}
        </div>
      </GlassCard>

      {(response || loading) && (
        <GlassCard>
          <div className="flex items-center gap-2 mb-3">
            <Bot className="h-5 w-5 text-gtv-purple" />
            <span className="font-display font-bold">{BRAND.shortName} AI</span>
          </div>
          {loading ? (
            <p className="text-sm text-giga-muted animate-pulse">Analyzing latest news...</p>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{response}</p>
          )}
        </GlassCard>
      )}
    </MediaPageShell>
  );
}

export default function AiAssistantPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading AI assistant...</div>}>
      <AiAssistantContent />
    </Suspense>
  );
}
