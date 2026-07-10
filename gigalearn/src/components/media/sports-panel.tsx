"use client";

import type { SportsFixture } from "@/types/media";
import { GlassCard } from "@/components/ui/glass-card";
import { LiveIndicator } from "@/components/media/trending-panel";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function FixtureCard({ fixture }: { fixture: SportsFixture }) {
  return (
    <GlassCard className="text-center">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="font-bold">{fixture.homeTeam}</p>
          {fixture.homeScore !== undefined && (
            <p className="font-display text-2xl font-bold text-gtv-purple">{fixture.homeScore}</p>
          )}
        </div>
        <div className="shrink-0">
          {fixture.status === "live" ? (
            <LiveIndicator />
          ) : fixture.status === "finished" ? (
            <span className="text-xs font-semibold text-giga-muted">FT</span>
          ) : (
            <span className="text-xs font-semibold text-giga-muted">
              {format(new Date(fixture.kickoff), "MMM d · HH:mm")}
            </span>
          )}
          {fixture.status !== "scheduled" && fixture.homeScore !== undefined && (
            <p className="mt-1 font-display text-lg font-bold">vs</p>
          )}
        </div>
        <div className="flex-1">
          <p className="font-bold">{fixture.awayTeam}</p>
          {fixture.awayScore !== undefined && (
            <p className="font-display text-2xl font-bold text-gtv-purple">{fixture.awayScore}</p>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-giga-muted">{fixture.venue}</p>
    </GlassCard>
  );
}

export function StandingsTable({
  standings,
  title,
}: {
  standings: { team: string; played: number; points: number }[];
  title: string;
}) {
  return (
    <GlassCard>
      <h3 className="font-display mb-3 font-bold">{title}</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-giga-border text-left text-giga-muted">
            <th className="pb-2 font-semibold">#</th>
            <th className="pb-2 font-semibold">Team</th>
            <th className="pb-2 font-semibold text-center">P</th>
            <th className="pb-2 font-semibold text-right">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => (
            <tr key={row.team} className={cn("border-b border-giga-border/50", i < 3 && "font-semibold")}>
              <td className="py-2">{i + 1}</td>
              <td className="py-2">{row.team}</td>
              <td className="py-2 text-center">{row.played}</td>
              <td className="py-2 text-right text-gtv-purple">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  );
}
