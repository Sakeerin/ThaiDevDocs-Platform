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
- `npm run vercel:pull` - pull Vercel preview environment variables
- `npm run deploy:staging` - deploy preview build to Vercel

## Vercel Staging Setup

1. Login: `npx vercel login`
2. Link this project: `npx vercel link`
3. Pull preview env vars: `npm run vercel:pull`
4. Deploy staging: `npm run deploy:staging`
