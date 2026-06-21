# ThaiDevDocs Platform

Bootstrapped docs platform using Next.js + Fumadocs + typed MDX content.

## Stack

- Next.js 16 (App Router)
- Fumadocs (docs UI + MDX pipeline)
- Tailwind CSS v4
- shadcn/ui (Radix preset)

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Typed MDX Frontmatter

Frontmatter is validated in `source.config.ts` using Zod. Required fields include:

- `topic`, `subtopic`, `difficulty`
- `verified_at`, `author`
- optional version fields (`laravel_version`, `vue_version`)
- `is_premium`, `tags`, `contributors`

## Useful Scripts

- `npm run lint` - run ESLint
- `npm run types:check` - regenerate MDX types + TypeScript check
- `npm run content:validate` - validate MDX frontmatter in `content/docs`
- `npm run content:stale` - list articles with `verified_at` older than 6 months
- `npm run vercel:pull` - pull Vercel preview environment variables
- `npm run deploy:staging` - deploy preview build to Vercel

## Community Features (Phase 2)

- GitHub OAuth login at `/login` (NextAuth.js)
- Profile page at `/profile` showing contributed articles
- Giscus comments at the bottom of every docs page
- "แก้ไข article นี้" button linking to GitHub edit flow
- Contribution guide at `/contribute`
- Version badge, stale content banner, reading progress, helpful votes
- Plausible analytics with custom events (`article_view`, `search_query`, `helpful_vote`)

Copy `.env.local.example` to `.env.local` and configure:

- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `NEXTAUTH_SECRET` for auth
- `NEXT_PUBLIC_GISCUS_*` for comments (create at [giscus.app](https://giscus.app))
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` for analytics


## Vercel Staging Setup

1. Login: `npx vercel login`
2. Link this project: `npx vercel link`
3. Pull preview env vars: `npm run vercel:pull`
4. Deploy staging: `npm run deploy:staging`
