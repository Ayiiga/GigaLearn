import type { VideoItem } from "@/types/media";

const thumb = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=640&q=80`;

export const VIDEO_NEWS: VideoItem[] = [
  {
    id: "vid1",
    slug: "world-cup-squad-announcement",
    title: "Ghana Announces Final World Cup 2026 Squad",
    summary: "Coach reveals 26-man squad with mix of experience and emerging talent.",
    category: "sports",
    thumbnailUrl: thumb("photo-1574629810360-7efbbe195018"),
    duration: "12:34",
    publishedAt: "2026-07-10T11:00:00Z",
    views: 89000,
    isTrending: true,
  },
  {
    id: "vid2",
    slug: "parliament-debate-highlights",
    title: "Parliament Debate: Economic Reform Bill Highlights",
    summary: "Key moments from today's parliamentary session on fiscal reforms.",
    category: "politics",
    thumbnailUrl: thumb("photo-1529107386315-d8490765596f"),
    duration: "8:45",
    publishedAt: "2026-07-10T09:30:00Z",
    views: 45000,
    isTrending: true,
  },
  {
    id: "vid3",
    slug: "tech-summit-keynote",
    title: "Africa Tech Summit 2026: Opening Keynote",
    summary: "Industry leaders discuss AI, fintech, and digital infrastructure.",
    category: "technology",
    thumbnailUrl: thumb("photo-1551288049-bebda4e38f71"),
    duration: "24:10",
    publishedAt: "2026-07-09T15:00:00Z",
    views: 32000,
  },
  {
    id: "vid4",
    slug: "caf-press-conference",
    title: "CAF Press Conference: AFCON 2027 Updates",
    summary: "Official updates on host cities and tournament preparations.",
    category: "sports",
    thumbnailUrl: thumb("photo-1431324155629-1a6deb1dec8d"),
    duration: "18:22",
    publishedAt: "2026-07-09T12:00:00Z",
    views: 28000,
    isTrending: true,
  },
  {
    id: "vid5",
    slug: "renewable-energy-documentary",
    title: "Kenya's Green Revolution: A Documentary",
    summary: "How Kenya achieved 90% renewable electricity generation.",
    category: "science",
    thumbnailUrl: thumb("photo-1509391366360-2e959784a276"),
    duration: "32:00",
    publishedAt: "2026-07-08T10:00:00Z",
    views: 51000,
  },
  {
    id: "vid6",
    slug: "nollywood-premiere",
    title: "Nollywood Premiere: Red Carpet Interviews",
    summary: "Stars and directors discuss the future of African cinema.",
    category: "entertainment",
    thumbnailUrl: thumb("photo-1489599849927-2ee91cede3ba"),
    duration: "15:50",
    publishedAt: "2026-07-08T18:00:00Z",
    views: 67000,
  },
];

export function getTrendingVideos(): VideoItem[] {
  return VIDEO_NEWS.filter((v) => v.isTrending);
}
