import type { Metadata } from "next";
import { SpaceCamExplorer } from "@/components/smart-map/spacecam-explorer";

export const metadata: Metadata = {
  title: "SpaceCam",
  description: "Explore visual scale from your device camera to Smart Map and conceptual space views.",
};

export default function SpaceCamPage() {
  return <SpaceCamExplorer />;
}
