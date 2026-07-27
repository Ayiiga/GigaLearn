# Smart Map

**Explore • Connect • Stay Safe**

AI-powered mapping, navigation, and public safety platform built for Ghana and designed to scale across all 54 African countries.

## Quick links

| Resource | Path |
|----------|------|
| **Application** | [`gigalearn/`](./gigalearn/) |
| **Setup** | [`gigalearn/README.md`](./gigalearn/README.md) |
| **Deploy (Vercel)** | [`gigalearn/docs/DEPLOY_VERCEL.md`](./gigalearn/docs/DEPLOY_VERCEL.md) |
| **Supabase** | [`gigalearn/docs/SUPABASE.md`](./gigalearn/docs/SUPABASE.md) |

## Product pillars

- Interactive maps with trusted public services
- Smart navigation (drive, walk, cycle, transit)
- Safety Center with one-tap SOS
- Community hazard reporting
- AI assistant for routes, places, and emergencies
- Business verification & partnerships

## Local web development

```bash
cd gigalearn
cp .env.example .env.local
npm install
npm run dev
```

## Android

```bash
export ANDROID_HOME=/android-sdk-linux
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
./gradlew assembleDebug test
```

Package: `com.ayiiga3.smartmap`
