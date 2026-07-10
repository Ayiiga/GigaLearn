import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import type { NewsArticle } from "@/types/media";

/** Server-rendered hero for fast LCP — no client JS required for first paint */
export function HeroStatic({ article }: { article: NewsArticle }) {
  return (
    <section
      className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl px-4 sm:px-6"
      aria-label="Breaking news hero"
    >
      <div className="relative h-[320px] sm:h-[420px] lg:h-[480px]">
        <Image
          src={article.imageUrl}
          alt=""
          fill
          priority
          fetchPriority="high"
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1200px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gtv-deep/95 via-gtv-deep/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
          <div className="max-w-2xl">
            <div className="flex flex-wrap gap-2">
              {article.isBreaking && (
                <span className="rounded-full bg-gtv-red px-3 py-1 text-xs font-bold text-white">Breaking</span>
              )}
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white capitalize">
                {article.category}
              </span>
            </div>
            <h1 className="font-display mt-4 text-2xl font-bold text-white sm:text-4xl lg:text-5xl leading-tight">
              {article.title}
            </h1>
            <p className="mt-3 text-sm text-white/90 sm:text-base line-clamp-2">{article.summary}</p>
            <p className="mt-2 text-xs text-white/70">
              {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })} · {article.author}
            </p>
            <div className="mt-6">
              <Link href={`/news/${article.slug}`} aria-label={`Read full story: ${article.title}`}>
                <Button size="lg" className="bg-white text-gtv-deep hover:bg-white/90">
                  Read Full Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
