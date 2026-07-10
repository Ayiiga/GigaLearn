import type { Metadata } from "next";
import { MediaPageShell } from "@/components/media/section-header";
import { NewsCard } from "@/components/media/news-card";
import { getArticlesByCategory } from "@/content/media/articles";

export const metadata: Metadata = {
  title: "Business",
  description: "Stock markets, cryptocurrency, African markets, companies, and startups.",
};

export default function BusinessPage() {
  const articles = getArticlesByCategory("business");

  return (
    <MediaPageShell title="Business" subtitle="Markets, crypto, African economies, companies, and startups">
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {["Stock Market", "Cryptocurrency", "African Markets", "Companies", "Startups"].map((topic) => (
          <div key={topic} className="rounded-2xl border border-giga-border p-4 text-center font-semibold hover:border-gtv-gold hover:bg-gtv-gold/5 transition-colors">
            {topic}
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </MediaPageShell>
  );
}
