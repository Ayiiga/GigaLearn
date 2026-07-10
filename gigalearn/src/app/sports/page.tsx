import type { Metadata } from "next";
import { MediaPageShell, SectionHeader } from "@/components/media/section-header";
import { NewsCard } from "@/components/media/news-card";
import { FixtureCard, StandingsTable } from "@/components/media/sports-panel";
import { SPORTS_LEAGUES, SPORTS_FIXTURES, LEAGUE_STANDINGS } from "@/content/media";
import { getArticlesByCategory } from "@/content/media/articles";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sports Center",
  description: "Fixtures, results, standings, and sports news across Africa and the world.",
};

export default function SportsPage() {
  const sportsNews = getArticlesByCategory("sports");

  return (
    <MediaPageShell title="Sports Center" subtitle="Fixtures, results, standings, and match analysis">
      <div className="mb-8 flex flex-wrap gap-2">
        {SPORTS_LEAGUES.map((league) => (
          <Link
            key={league.id}
            href={league.id === "world-cup-2026" ? "/world-cup-2026" : `/sports#${league.id}`}
            className="rounded-full border border-giga-border px-4 py-2 text-sm font-semibold hover:border-gtv-purple hover:bg-gtv-purple/5"
          >
            {league.icon} {league.name}
          </Link>
        ))}
      </div>

      <SectionHeader title="Live & Recent Fixtures" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {SPORTS_FIXTURES.map((f) => (
          <FixtureCard key={f.id} fixture={f} />
        ))}
      </div>

      <SectionHeader title="Standings" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        <StandingsTable standings={LEAGUE_STANDINGS["premier-league"]} title="Premier League" />
        <StandingsTable standings={LEAGUE_STANDINGS["champions-league"]} title="Champions League" />
        <StandingsTable standings={LEAGUE_STANDINGS["ghana-premier-league"]} title="Ghana Premier League" />
      </div>

      <SectionHeader title="Sports News" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sportsNews.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </MediaPageShell>
  );
}
