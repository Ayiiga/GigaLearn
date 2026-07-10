import type { TvStation } from "@/types/media";

/** Official broadcaster links only — embed or redirect to authorized sources. */
export const TV_STATIONS: TvStation[] = [
  { id: "gtv", name: "GTV Ghana", country: "Ghana", category: "Ghana TV", logo: "📺", streamUrl: "https://www.gbcghana.com/gtv-live", isLive: true, officialSource: "Ghana Broadcasting Corporation" },
  { id: "tv3", name: "TV3 Ghana", country: "Ghana", category: "Ghana TV", logo: "📡", streamUrl: "https://www.tv3network.com/live", isLive: true, officialSource: "Media General Ghana" },
  { id: "nta", name: "NTA Nigeria", country: "Nigeria", category: "Nigeria TV", logo: "🇳🇬", streamUrl: "https://www.nta.ng/live", isLive: true, officialSource: "Nigerian Television Authority" },
  { id: "channels", name: "Channels TV", country: "Nigeria", category: "Nigeria TV", logo: "📺", streamUrl: "https://www.channelstv.com/live", isLive: true, officialSource: "Channels Media Group" },
  { id: "citizen", name: "Citizen TV", country: "Kenya", category: "Kenya TV", logo: "🇰🇪", streamUrl: "https://www.citizentv.co.ke/live", isLive: true, officialSource: "Royal Media Services" },
  { id: "sabc", name: "SABC News", country: "South Africa", category: "South Africa TV", logo: "🇿🇦", streamUrl: "https://www.sabcnews.com/sabcnews/live", isLive: true, officialSource: "South African Broadcasting Corporation" },
  { id: "bbc", name: "BBC News", country: "UK", category: "International News", logo: "🌐", streamUrl: "https://www.bbc.com/news/live", isLive: true, officialSource: "BBC" },
  { id: "cnn", name: "CNN International", country: "USA", category: "International News", logo: "🌍", streamUrl: "https://edition.cnn.com/videos/live", isLive: true, officialSource: "CNN" },
  { id: "supersport", name: "SuperSport", country: "South Africa", category: "Sports", logo: "⚽", streamUrl: "https://www.supersport.com", isLive: true, officialSource: "SuperSport" },
  { id: "mtvbase", name: "MTV Base Africa", country: "Pan-Africa", category: "Entertainment", logo: "🎵", streamUrl: "https://www.mtvbase.com", isLive: false, officialSource: "ViacomCBS Africa" },
  { id: "cnbcafrica", name: "CNBC Africa", country: "Pan-Africa", category: "Business", logo: "💼", streamUrl: "https://www.cnbcafrica.com/live", isLive: true, officialSource: "CNBC Africa" },
];

export const TV_CATEGORIES = [
  "Ghana TV",
  "Nigeria TV",
  "Kenya TV",
  "South Africa TV",
  "International News",
  "Sports",
  "Entertainment",
  "Business",
] as const;

export function getTvByCategory(category: string): TvStation[] {
  return TV_STATIONS.filter((s) => s.category === category);
}
