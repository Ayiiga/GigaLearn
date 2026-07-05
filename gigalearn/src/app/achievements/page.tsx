"use client";

import { motion } from "framer-motion";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ACHIEVEMENTS } from "@/content/curriculum";
import { useGamification } from "@/stores/app-store";

export default function AchievementsPage() {
  const { xp, badges } = useGamification();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-bold">Achievements</h1>
      <p className="mt-2 text-giga-muted">Collect badges and unlock rewards as you learn!</p>

      {badges.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold mb-4">Earned Badges</h2>
          <div className="flex flex-wrap gap-4">
            {badges.map((b) => (
              <Card key={b.id} className="text-center w-32">
                <span className="text-4xl">{b.icon}</span>
                <CardTitle className="mt-2 text-sm">{b.name}</CardTitle>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((a, i) => {
          const earned = xp >= a.xp_required;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={earned ? "border-giga-yellow bg-giga-yellow/5" : "opacity-60"}>
                <span className="text-4xl">{earned ? a.icon : "🔒"}</span>
                <CardTitle className="mt-3">{a.title}</CardTitle>
                <CardDescription>{a.description}</CardDescription>
                <p className="mt-3 text-sm font-bold text-giga-purple">{a.xp_required} XP required</p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
