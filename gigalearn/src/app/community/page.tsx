"use client";

import Link from "next/link";
import { Heart, MessageCircle, Share2, Bookmark, Bell } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { MediaPageShell } from "@/components/media/section-header";
import { NewsCardCompact } from "@/components/media/news-card";
import { useMediaStore } from "@/stores/media-store";
import { useAuth } from "@/hooks/use-auth";
import { NEWS_ARTICLES } from "@/content/media";
import { TRENDING_HASHTAGS } from "@/content/media/trending";

export default function CommunityPage() {
  const { isAuthenticated } = useAuth();
  const followedTopics = useMediaStore((s) => s.preferences.followedTopics);
  const toggleFollowTopic = useMediaStore((s) => s.toggleFollowTopic);
  const savedCount = useMediaStore((s) => s.preferences.savedArticles.length);

  return (
    <MediaPageShell
      title="Community"
      subtitle="Like, comment, share, bookmark, and follow topics across GigaTrend TV"
    >
      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        {[
          { icon: Heart, label: "Like & React", desc: "Engage with stories" },
          { icon: MessageCircle, label: "Comment", desc: "Join discussions" },
          { icon: Share2, label: "Share", desc: "Spread the news" },
          { icon: Bookmark, label: "Bookmark", desc: `${savedCount} saved` },
        ].map(({ icon: Icon, label, desc }) => (
          <GlassCard key={label} className="text-center">
            <Icon className="mx-auto h-8 w-8 text-gtv-purple" />
            <p className="mt-2 font-bold">{label}</p>
            <p className="text-xs text-giga-muted">{desc}</p>
          </GlassCard>
        ))}
      </div>

      <h2 className="font-display text-xl font-bold mb-4">Follow Topics</h2>
      <div className="flex flex-wrap gap-2 mb-8">
        {TRENDING_HASHTAGS.map((tag) => {
          const followed = followedTopics.includes(tag.label);
          return (
            <button
              key={tag.id}
              onClick={() => toggleFollowTopic(tag.label)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                followed ? "bg-gtv-purple text-white" : "border border-giga-border hover:border-gtv-purple"
              }`}
            >
              {followed ? "✓ " : ""}{tag.label}
            </button>
          );
        })}
      </div>

      <h2 className="font-display text-xl font-bold mb-4">Trending Discussions</h2>
      <div className="space-y-2 mb-8">
        {NEWS_ARTICLES.slice(0, 5).map((article) => {
          const likes = 80 + Number(article.id) * 37;
          const comments = 8 + Number(article.id) * 5;
          return (
          <GlassCard key={article.id} className="!p-3">
            <NewsCardCompact article={article} />
            <div className="mt-2 flex gap-4 text-xs text-giga-muted pl-2">
              <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {likes}</span>
              <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {comments}</span>
              <span className="flex items-center gap-1"><Share2 className="h-3.5 w-3.5" /> Share</span>
            </div>
          </GlassCard>
          );
        })}
      </div>

      {!isAuthenticated && (
        <GlassCard className="text-center bg-gtv-purple/5">
          <Bell className="mx-auto h-8 w-8 text-gtv-purple" />
          <p className="mt-2 font-bold">Get notifications for topics you follow</p>
          <p className="text-sm text-giga-muted mt-1">Sign in to receive breaking news and trending alerts.</p>
          <Link href="/login" className="mt-4 inline-block text-sm font-bold text-gtv-purple hover:underline">
            Sign in →
          </Link>
        </GlassCard>
      )}
    </MediaPageShell>
  );
}
