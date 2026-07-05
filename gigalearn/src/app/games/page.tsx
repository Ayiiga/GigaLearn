"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { GAMES } from "@/content/curriculum";
import { useAppStore } from "@/stores/app-store";

export default function GamesPage() {
  const addXP = useAppStore((s) => s.addXP);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-bold">Learning Games</h1>
      <p className="mt-2 text-giga-muted">Fun, educational games — works offline too! 🎮</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              hover
              className="cursor-pointer h-full"
              onClick={() => addXP(25)}
            >
              <span className="text-5xl">{game.icon}</span>
              <CardTitle className="mt-4">{game.title}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
              <p className="mt-4 text-sm font-bold text-giga-purple">+25 XP per play</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/learn" className="text-giga-purple font-bold hover:underline">
          Explore structured lessons →
        </Link>
      </div>
    </div>
  );
}
