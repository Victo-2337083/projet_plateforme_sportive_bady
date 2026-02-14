# 1 concept par jour (Primary Learning PWA)

Monorepo pnpm workspaces:
- `apps/web`: Next.js App Router + Tailwind + PWA + IndexedDB offline + FR/EN strings.
- `apps/api`: NestJS REST + Swagger + Mongoose + JWT/RBAC + admin AI drafts.
- `packages/shared`: spaced repetition algorithm.

## Quick start
1. `pnpm install`
2. `docker compose up`
3. API docs: `http://localhost:3001/api/docs`

## API env
- OPENAI_API_KEY
- OPENAI_TEXT_MODEL (default configurable)
- OPENAI_MODERATION_MODEL=omni-moderation-latest
- MONGODB_URI
- JWT_SECRET

## Child-safety constraints
- No ads, no behavioral tracking, no geolocation.
- Notifications off by default.
- OpenAI calls only via backend, admin-only draft workflow with moderation + human publish.
