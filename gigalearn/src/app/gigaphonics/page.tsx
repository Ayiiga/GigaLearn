"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PhonicsCard, BlendingActivity } from "@/components/learning/phonics-card";
import { ProgressBar } from "@/components/gamification/progress-bar";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { PHONICS_SOUNDS, CVC_WORDS } from "@/content/curriculum";

const TABS = ["Sounds", "Blending", "CVC Words", "Practice"] as const;

export default function GigaPhonicsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Sounds");
  const [soundIndex, setSoundIndex] = useState(0);
  const [cvcIndex, setCvcIndex] = useState(0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <span className="text-5xl">🔤</span>
          <h1 className="font-display mt-4 text-4xl font-bold text-gradient">GigaPhonics</h1>
          <p className="mt-2 text-giga-muted max-w-xl mx-auto">
            Master phonics sounds, blending, digraphs, trigraphs, and CVC words with interactive audio-guided lessons
          </p>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <ProgressBar />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-xl px-5 py-3 font-bold min-h-[48px] transition-all ${
                tab === t
                  ? "bg-gradient-to-r from-giga-orange to-giga-yellow text-white shadow-lg"
                  : "bg-white border border-giga-border text-giga-muted hover:border-giga-orange dark:bg-giga-surface"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Sounds" && (
          <div className="space-y-8">
            <PhonicsCard {...PHONICS_SOUNDS[soundIndex]} />
            <div className="flex justify-center gap-3 flex-wrap">
              {PHONICS_SOUNDS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setSoundIndex(i)}
                  className={`rounded-xl px-4 py-2 font-bold min-h-[44px] ${
                    i === soundIndex ? "bg-giga-purple text-white" : "bg-giga-purple/10 text-giga-purple"
                  }`}
                >
                  {s.grapheme}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "Blending" && (
          <BlendingActivity
            {...CVC_WORDS[cvcIndex]}
            onComplete={() => setCvcIndex((i) => (i + 1) % CVC_WORDS.length)}
          />
        )}

        {tab === "CVC Words" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CVC_WORDS.map((word) => (
              <Card key={word.word} hover className="text-center">
                <span className="text-4xl">{word.image}</span>
                <CardTitle className="mt-3 font-display text-2xl">{word.word}</CardTitle>
                <CardDescription>{word.phonemes.join(" - ")}</CardDescription>
              </Card>
            ))}
          </div>
        )}

        {tab === "Practice" && (
          <div className="grid gap-6 sm:grid-cols-2">
            <Card gradient>
              <CardTitle>🎯 Digraphs</CardTitle>
              <CardDescription>sh, ch, th — two letters, one sound</CardDescription>
            </Card>
            <Card gradient>
              <CardTitle>🎯 Trigraphs</CardTitle>
              <CardDescription>str, spr — three letters, one sound</CardDescription>
            </Card>
            <Card gradient>
              <CardTitle>📖 Reading Practice</CardTitle>
              <CardDescription>Blend sounds to read full sentences</CardDescription>
            </Card>
            <Card gradient>
              <CardTitle>🎤 Pronunciation</CardTitle>
              <CardDescription>Speak and get instant feedback</CardDescription>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
}
