# GigaLearn

> **Founder & Lead Developer:** Ayiiga Benard Issaka  
> **Vision:** World-class AI-powered education for children — literacy, numeracy, and joy of learning, with a focus on Africa and underserved communities.

📄 [Master Vision](./docs/VISION.md) · 🗺️ [Upgrade Roadmap](./docs/UPGRADE_ROADMAP.md)

**Learn, Read, Speak, and Grow Smarter Every Day.**

GigaLearn is a production-ready, offline-first Progressive Web App (PWA) for English language learning — designed for toddlers, kindergarten pupils, primary learners, teachers, parents, homeschoolers, and schools across Africa and the world.

**GigaPhonics** is the flagship phonics module (Level 2).

## Features

- 📱 **Installable PWA** with offline support (Workbox service workers)
- 🎓 **9 Learning Levels** — Alphabet through Grammar + GigaMath
- 🔤 **GigaPhonics** — A–Z lessons, sounds, blending, digraphs, CVC words
- 🤖 **AI Tutor** — reading coach, pronunciation, story/quiz generator
- 🎮 **Gamification** — XP, coins, badges, streaks, unlockables
- 👩‍🏫 **Multi-role dashboards** — Student, Teacher, Parent, Admin
- 🔐 **Google OAuth** + email auth (Supabase)
- 🌍 **Inclusive design** — African & global learners, WCAG accessible
- 🌙 **Dark/Light mode**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| Auth & DB | Supabase |
| Offline | IndexedDB (Dexie) + Workbox |
| AI | OpenAI GPT-4o-mini |
| Deploy | **Vercel** (recommended) · Cloudflare Workers · GitHub Pages |

## Quick Start

```bash
cd gigalearn
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy (one step)

**Vercel (recommended):**

```bash
export VERCEL_TOKEN=your_token
npm run deploy:vercel
```

See **[docs/DEPLOY_VERCEL.md](./docs/DEPLOY_VERCEL.md)** for dashboard setup (root directory: `gigalearn`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run test` | Vitest unit tests |
| `npm run deploy:vercel` | Deploy to Vercel |
| `npm run deploy` | Deploy to Cloudflare Workers (OpenNext) |
| `npm run build:github-pages` | Static export for GitHub Pages |

Full guide: **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)**

## License

Proprietary — GigaLearn © 2026
