"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Shield } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useGamification, useAppStore } from "@/stores/app-store";
import { useAuth } from "@/hooks/use-auth";
import {
  WEEKLY_CHALLENGES,
  buildClassroomLeaderboard,
  getWeeklyChallengeProgress,
} from "@/lib/community";

export default function CommunityPage() {
  const gamification = useGamification();
  const setGamification = useAppStore((s) => s.hydrateGamification);
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name?.split(" ")[0] ?? "Learner";
  const leaderboard = buildClassroomLeaderboard(gamification, userName, gamification.leaderboard_opt_in);

  const toggleOptIn = () => {
    setGamification({ leaderboard_opt_in: !gamification.leaderboard_opt_in });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-giga-purple hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <h1 className="font-display text-3xl font-bold">Community Learning</h1>
      <p className="mt-2 text-giga-muted">Leaderboards, weekly challenges, and achievement sharing — all optional and privacy-aware</p>

      <GlassCard className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <Shield className="h-8 w-8 text-giga-purple shrink-0" />
        <div className="flex-1">
          <p className="font-bold">Privacy Control</p>
          <p className="text-sm text-giga-muted">Choose whether to appear on classroom leaderboards. You can opt out anytime.</p>
        </div>
        <Button variant={gamification.leaderboard_opt_in ? "primary" : "outline"} onClick={toggleOptIn}>
          {gamification.leaderboard_opt_in ? "Opted In" : "Opted Out"}
        </Button>
      </GlassCard>

      <h2 className="font-display text-2xl font-bold mt-10 mb-4">Weekly Challenges</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {WEEKLY_CHALLENGES.map((challenge, i) => {
          const progress = getWeeklyChallengeProgress(challenge, gamification);
          const done = gamification.completed_weekly_challenges.includes(challenge.id);
          const pct = Math.min((progress / challenge.target) * 100, 100);
          return (
            <motion.div key={challenge.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard className={done ? "border-giga-green/40 bg-giga-green/10" : undefined}>
                <span className="text-3xl">{challenge.icon}</span>
                <p className="font-bold mt-2">{challenge.title}</p>
                <p className="text-sm text-giga-muted">{challenge.description}</p>
                <div className="mt-3 h-2 rounded-full bg-giga-border overflow-hidden">
                  <div className="h-full bg-giga-purple transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-2 text-xs text-giga-muted">
                  {done ? "Completed!" : `${Math.min(progress, challenge.target)}/${challenge.target}`} · +{challenge.xpReward} XP
                </p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <h2 className="font-display text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
        <Trophy className="h-6 w-6 text-giga-yellow" /> School Leaderboard
      </h2>
      {gamification.leaderboard_opt_in ? (
        <GlassCard>
          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <div
                key={`${entry.rank}-${entry.name}`}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${entry.isUser ? "bg-giga-purple/10 font-bold" : ""}`}
              >
                <span className="w-6 text-center text-giga-muted">#{entry.rank}</span>
                <span>{entry.avatar}</span>
                <span className="flex-1">{entry.name}</span>
                <span className="text-giga-muted">{entry.xp} XP</span>
              </div>
            ))}
          </div>
        </GlassCard>
      ) : (
        <p className="text-giga-muted text-sm">You are hidden from leaderboards. Opt in above to participate.</p>
      )}

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/certificates"><Button variant="outline">Digital Certificates</Button></Link>
        <Link href="/achievements"><Button variant="outline">Achievement Sharing</Button></Link>
        <Link href="/quests"><Button variant="outline">Classroom Competitions</Button></Link>
      </div>
    </div>
  );
}
