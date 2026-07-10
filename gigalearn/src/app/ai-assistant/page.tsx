import type { Metadata } from "next";
import { MediaPageShell } from "@/components/media/section-header";
import { AiComingSoon } from "@/components/media/ai-coming-soon";

export const metadata: Metadata = {
  title: "GigaTrend AI — Coming Soon",
  description:
    "Intelligent news summaries, sports insights, multilingual explanations, and voice assistance are in development.",
};

export default function AiAssistantPage() {
  return (
    <MediaPageShell title="GigaTrend AI" subtitle="Africa's next-generation news intelligence — launching soon">
      <AiComingSoon />
    </MediaPageShell>
  );
}
