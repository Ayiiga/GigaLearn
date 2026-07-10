import Image from "next/image";
import Link from "next/link";
import { Play, Eye } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import type { VideoItem } from "@/types/media";
import { formatDistanceToNow } from "date-fns";

export function VideoCard({ video }: { video: VideoItem }) {
  return (
    <GlassCard hover className="overflow-hidden p-0">
      <Link href={`/videos#${video.slug}`} className="group block">
        <div className="relative h-40 overflow-hidden">
          <Image src={video.thumbnailUrl} alt="" fill className="object-cover transition-transform group-hover:scale-105" sizes="320px" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
            <Play className="h-12 w-12 text-white" fill="white" />
          </div>
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs font-bold text-white">
            {video.duration}
          </span>
          {video.isTrending && (
            <span className="absolute top-2 left-2 rounded-full bg-gtv-gold px-2 py-0.5 text-[10px] font-bold text-gtv-deep">
              Trending
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-gtv-purple">{video.title}</h3>
          <div className="mt-2 flex items-center gap-3 text-xs text-giga-muted">
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{(video.views / 1000).toFixed(0)}k</span>
            <span>{formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}</span>
          </div>
        </div>
      </Link>
    </GlassCard>
  );
}
