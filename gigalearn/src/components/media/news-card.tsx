"use client";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Bot, Bookmark, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "@/types/media";

export function NewsCard({
  article,
  featured = false,
  showAiButton = true,
}: {
  article: NewsArticle;
  featured?: boolean;
  showAiButton?: boolean;
}) {
  return (
    <GlassCard hover className={cn("overflow-hidden p-0", featured && "sm:col-span-2")}>
      <Link href={`/news/${article.slug}`} className="group block">
        <div className={cn("relative overflow-hidden", featured ? "h-56 sm:h-72" : "h-44")}>
          <Image
            src={article.imageUrl}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <span className="inline-block rounded-full bg-gtv-cyan/90 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide">
              {article.category}
            </span>
            {article.isBreaking && (
              <span className="ml-2 inline-block rounded-full bg-gtv-red px-2.5 py-0.5 text-xs font-bold">
                Breaking
              </span>
            )}
            <h3 className={cn("font-display mt-2 font-bold leading-snug", featured ? "text-xl sm:text-2xl" : "text-base")}>
              {article.title}
            </h3>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-giga-muted line-clamp-2">{article.summary}</p>
          <div className="mt-3 flex items-center justify-between text-xs text-giga-muted">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
            </span>
            <span>{article.readMinutes} min read</span>
          </div>
          {showAiButton && (
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-gtv-purple/10 px-3 py-1.5 text-xs font-semibold text-gtv-purple">
              <Bot className="h-3.5 w-3.5" /> AI Summary
            </span>
          )}
        </div>
      </Link>
    </GlassCard>
  );
}

export function NewsCardCompact({ article }: { article: NewsArticle }) {
  return (
    <Link href={`/news/${article.slug}`} className="group flex gap-3 rounded-2xl p-2 transition-colors hover:bg-gtv-purple/5">
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl">
        <Image src={article.imageUrl} alt="" fill className="object-cover" sizes="96px" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase text-gtv-cyan">{article.category}</p>
        <h4 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-gtv-purple">{article.title}</h4>
        <p className="mt-0.5 text-xs text-giga-muted">
          {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
        </p>
      </div>
      <Bookmark className="h-4 w-4 shrink-0 text-giga-muted opacity-0 group-hover:opacity-100" aria-hidden />
    </Link>
  );
}
