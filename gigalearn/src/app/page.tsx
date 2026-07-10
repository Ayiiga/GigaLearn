import { getHeroArticles } from "@/content/media";
import { HeroStatic } from "@/components/media/hero-static";
import { NewsDashboard } from "@/components/dashboard/news-dashboard";

export default function HomePage() {
  const heroArticle = getHeroArticles()[0];

  return (
    <div className="py-6 sm:py-8">
      {heroArticle && <HeroStatic article={heroArticle} />}
      <NewsDashboard />
    </div>
  );
}
