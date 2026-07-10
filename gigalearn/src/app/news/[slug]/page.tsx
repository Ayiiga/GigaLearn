import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { formatDistanceToNow } from "date-fns";
import { Bot, Clock } from "lucide-react";
import { getArticleBySlug } from "@/content/media";
import { GlassCard } from "@/components/ui/glass-card";
import { ArticleActions } from "@/components/media/article-actions";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.summary,
    openGraph: { images: [article.imageUrl] },
  };
}

import { NEWS_ARTICLES } from "@/content/media/articles";

export function generateStaticParams() {
  return NEWS_ARTICLES.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="relative mb-8 h-64 sm:h-96 overflow-hidden rounded-3xl">
        <Image src={article.imageUrl} alt="" fill className="object-cover" priority sizes="(max-width: 896px) 100vw, 896px" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="rounded-full bg-gtv-cyan/10 px-3 py-1 text-xs font-bold uppercase text-gtv-cyan">{article.category}</span>
        {article.isBreaking && <span className="rounded-full bg-gtv-red/10 px-3 py-1 text-xs font-bold text-gtv-red">Breaking</span>}
        {article.country && <span className="rounded-full bg-gtv-gold/10 px-3 py-1 text-xs font-bold text-gtv-gold capitalize">{article.country}</span>}
      </div>

      <h1 className="font-display text-3xl font-bold sm:text-4xl leading-tight">{article.title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-giga-muted">
        <span>{article.author}</span>
        <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
        <span>{article.readMinutes} min read</span>
      </div>

      <ArticleActions slug={article.slug} title={article.title} />

      <p className="mt-6 text-lg leading-relaxed text-giga-muted">{article.summary}</p>

      <section id="ai-summary" className="mt-10 space-y-4">
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Bot className="h-6 w-6 text-gtv-purple" /> AI News Summaries
        </h2>
        <GlassCard>
          <h3 className="font-semibold text-gtv-purple">30-Second Summary</h3>
          <p className="mt-2 text-sm">{article.aiSummary30s}</p>
        </GlassCard>
        <GlassCard>
          <h3 className="font-semibold text-gtv-purple">2-Minute Summary</h3>
          <p className="mt-2 text-sm leading-relaxed">{article.aiSummary2m}</p>
        </GlassCard>
        <GlassCard>
          <h3 className="font-semibold text-gtv-purple">Full Summary</h3>
          <p className="mt-2 text-sm leading-relaxed">{article.aiSummaryFull}</p>
        </GlassCard>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold mb-4">Key Points</h2>
        <ul className="space-y-2">
          {article.keyPoints.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gtv-cyan" />
              {point}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold mb-4">Timeline</h2>
        <div className="space-y-3">
          {article.timeline.map((event) => (
            <div key={event.time} className="flex gap-4 text-sm">
              <span className="font-mono font-bold text-gtv-purple w-14 shrink-0">{event.time}</span>
              <span>{event.event}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 rounded-2xl border border-dashed border-gtv-purple/30 bg-gtv-purple/5 p-6 text-center text-sm text-giga-muted">
        Audio narration and multi-language translation available with GigaTrend AI Premium.
      </div>
    </article>
  );
}
