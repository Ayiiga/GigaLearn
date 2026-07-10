import { NEWS_ARTICLES, getArticleBySlug, getArticlesByCategory, getBreakingNews, getAfricaNews } from "./articles";
import { RADIO_STATIONS, RADIO_COUNTRIES, getRadioByCountry } from "./radio";
import { SPORTS_FIXTURES, SPORTS_LEAGUES, LEAGUE_STANDINGS, getFixturesByLeague } from "./sports";
import { TV_STATIONS, TV_CATEGORIES, getTvByCategory } from "./tv";
import {
  TRENDING_HASHTAGS,
  TRENDING_SEARCHES,
  TRENDING_STORIES,
  TRENDING_VIDEOS,
  VIRAL_PEOPLE,
  VIRAL_TOPICS,
} from "./trending";
import { VIDEO_NEWS, getTrendingVideos } from "./videos";

export {
  NEWS_ARTICLES,
  getArticleBySlug,
  getArticlesByCategory,
  getBreakingNews,
  getAfricaNews,
  RADIO_STATIONS,
  getRadioByCountry,
  RADIO_COUNTRIES,
  SPORTS_FIXTURES,
  SPORTS_LEAGUES,
  LEAGUE_STANDINGS,
  getFixturesByLeague,
  TV_STATIONS,
  TV_CATEGORIES,
  getTvByCategory,
  TRENDING_HASHTAGS,
  TRENDING_SEARCHES,
  TRENDING_STORIES,
  TRENDING_VIDEOS,
  VIRAL_PEOPLE,
  VIRAL_TOPICS,
  VIDEO_NEWS,
  getTrendingVideos,
};

export interface SearchResult {
  id: string;
  type: "article" | "video" | "tv" | "radio" | "team" | "topic";
  title: string;
  subtitle?: string;
  href: string;
}

export function globalSearch(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const article of NEWS_ARTICLES) {
    if (
      article.title.toLowerCase().includes(q) ||
      article.summary.toLowerCase().includes(q) ||
      article.tags.some((t) => t.toLowerCase().includes(q))
    ) {
      results.push({
        id: article.id,
        type: "article",
        title: article.title,
        subtitle: article.category,
        href: `/news/${article.slug}`,
      });
    }
  }

  for (const video of VIDEO_NEWS) {
    if (video.title.toLowerCase().includes(q)) {
      results.push({
        id: video.id,
        type: "video",
        title: video.title,
        subtitle: video.duration,
        href: `/videos#${video.slug}`,
      });
    }
  }

  for (const station of TV_STATIONS) {
    if (station.name.toLowerCase().includes(q) || station.country.toLowerCase().includes(q)) {
      results.push({
        id: station.id,
        type: "tv",
        title: station.name,
        subtitle: station.country,
        href: `/live-tv#${station.id}`,
      });
    }
  }

  for (const radio of RADIO_STATIONS) {
    if (radio.name.toLowerCase().includes(q)) {
      results.push({
        id: radio.id,
        type: "radio",
        title: radio.name,
        subtitle: radio.country,
        href: `/live-radio#${radio.id}`,
      });
    }
  }

  for (const fixture of SPORTS_FIXTURES) {
    if (fixture.homeTeam.toLowerCase().includes(q) || fixture.awayTeam.toLowerCase().includes(q)) {
      results.push({
        id: fixture.id,
        type: "team",
        title: `${fixture.homeTeam} vs ${fixture.awayTeam}`,
        subtitle: fixture.league,
        href: "/sports",
      });
    }
  }

  return results.slice(0, 12);
}

export function getSearchSuggestions(): string[] {
  return TRENDING_SEARCHES.map((s) => s.label);
}
