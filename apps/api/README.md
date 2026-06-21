# ThaiDevDocs Laravel API

Backend API for AI Q&A (RAG), GitHub auth sync, and LemonSqueezy subscriptions.

## Setup

```bash
cd apps/api
cp .env.example .env
composer install
php artisan migrate
php artisan content:embed --sync
php artisan serve
```

## Key endpoints

- `POST /api/auth/sync` — sync GitHub user from Next.js (requires `X-Api-Secret`)
- `POST /api/ai/qa` — streaming AI Q&A (Sanctum token, Pro required)
- `GET /api/ai/usage` — daily query usage
- `POST /api/webhooks/github` — re-embed content on push to main
- `POST /api/webhooks/lemonsqueezy` — activate/cancel Pro subscriptions

## Environment

See `.env.example` for `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `API_SYNC_SECRET`, webhook secrets, and PostgreSQL settings for production pgvector search.
