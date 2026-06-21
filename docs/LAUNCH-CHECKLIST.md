# Phase 4 Launch Checklist

Use this checklist to close Phase 4 (Week 10) before public launch.

## 1. Production environment

Run locally after pulling Vercel production env:

```bash
npm run verify:production
SMOKE_TEST_URL=https://thaidevdocs.com npm run smoke:test
SMOKE_TEST_URL=https://thaidevdocs.com npm run lighthouse:audit
```

### Vercel

- [ ] Project linked to GitHub repo
- [ ] Production branch = `main`
- [ ] Custom domain `thaidevdocs.com` + SSL active
- [ ] All vars from `.env.local.example` set in Vercel Production
- [ ] `NEXTAUTH_URL` = production URL
- [ ] GitHub OAuth callback = `https://thaidevdocs.com/api/auth/callback/github`

### Algolia DocSearch

- [ ] Application approved at https://docsearch.algolia.com/
- [ ] `NEXT_PUBLIC_ALGOLIA_*` set in production
- [ ] Search works on `/docs` (fallback: built-in Orama if keys blank)

### LemonSqueezy

- [ ] Production store + checkout links in env
- [ ] Test monthly checkout end-to-end
- [ ] Webhook URL points to Laravel API (if using `API_URL`)

### Plausible + Resend

- [ ] `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=thaidevdocs.com`
- [ ] Resend domain verified for `RESEND_FROM_EMAIL`
- [ ] `CRON_SECRET` set (Vercel Cron uses it for weekly newsletter)

---

## 2. Beta program (10–20 users)

Send invites:

```bash
CRON_SECRET=xxx node scripts/send-launch-email.mjs beta dev1@example.com
```

Collect feedback on:

- [ ] Docs readability (Thai + code samples)
- [ ] AI Q&A accuracy (Pro testers)
- [ ] Giscus comments
- [ ] Mobile layout (375px+)

---

## 3. Launch day

### Email

```bash
CRON_SECRET=xxx node scripts/send-launch-email.mjs launch
```

### Facebook groups

Post in Laravel Thailand, Vue.js Thailand, Dev Thailand:

```
ThaiDevDocs v1.0 เปิดแล้ว — docs Laravel, Vue, DevOps และ AI ภาษาไทย
57+ articles · ตัวอย่างบริบทไทย (PromptPay, PDPA, LINE)
Contribute ผ่าน GitHub PR ได้เลย
https://thaidevdocs.com/docs
```

### X / Twitter thread

1. ทำไมสร้าง ThaiDevDocs — docs ไทยสำหรับ Laravel/Vue ยังมีช่องว่าง
2. จุดเด่น: Thai Context, community PR, AI Q&A จาก docs จริง
3. CTA: อ่านฟรี + contribute ได้ที่ GitHub

### Dev.to

Title: **Building a Thai Developer Documentation Platform**

Outline:

- Stack: Next.js 16 + Fumadocs + MDX
- Community: GitHub OAuth, Giscus, edit-on-GitHub
- AI: RAG pipeline + Pro tier
- Lessons: Thai context in code samples matters

### LinkedIn

Short announcement + link to `/docs` + mention open-source repo.

### Product Hunt

- Tagline: Thai developer docs with AI Q&A
- Gallery: home, docs article, AI chat, pricing
- Link: https://thaidevdocs.com

---

## 4. Post-launch (week 1)

- [ ] Monitor Plausible: top pages, bounce rate
- [ ] Respond to GitHub issues/PRs within 3 days
- [ ] Submit to Laravel News
- [ ] Weekly newsletter cron verified (Mondays 02:00 UTC via Vercel Cron)

---

## Scripts reference

| Command | Purpose |
|---|---|
| `npm run verify:production` | Check required env vars |
| `npm run smoke:test` | HTTP smoke test critical routes |
| `npm run lighthouse:audit` | Lighthouse scores (target ≥ 90) |
| `npm run newsletter:weekly` | Trigger weekly newsletter manually |
| `node scripts/send-launch-email.mjs beta <email>` | Beta invite |
| `node scripts/send-launch-email.mjs launch` | Launch email to subscribers |
