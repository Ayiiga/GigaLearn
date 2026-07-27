# Smart Map Phased Rollout

## Feature flags

| Flag | Env | Default | Purpose |
|------|-----|---------|---------|
| Phase 1 Foundation | always on | `true` | Map, search, nearby essentials, saved places, profile, PWA |
| `publicSafetyPhase2` | `NEXT_PUBLIC_FEATURE_PUBLIC_SAFETY` | `false` | SOS, emergency contacts, community reports, alerts |
| `aiExpansionPhase3` | `NEXT_PUBLIC_FEATURE_AI_EXPANSION` | `false` | AI assistant, voice, offline maps, tourism, business, admin |

Enable only after explicit approval:

```bash
export NEXT_PUBLIC_FEATURE_PUBLIC_SAFETY=true
export NEXT_PUBLIC_FEATURE_AI_EXPANSION=true
```

## Production posture

Deploy with both Phase 2 and Phase 3 flags **false**. Phase 1 remains live.

## Rollback plan

1. Keep previous Vercel deployment available for instant rollback.
2. If a Phase 2/3 flag was enabled accidentally, set env vars back to `false` and redeploy.
3. Auth, Supabase schema, and package routes are unchanged — rollback does not require data migration.

## Known constraints

- Map tiles require WebGL in the browser.
- Community media attachments are client-side metadata only until storage backend is provisioned.
- Rate limiting is in-memory per instance.
