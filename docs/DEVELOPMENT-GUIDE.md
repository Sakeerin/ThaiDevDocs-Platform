# คู่มือการพัฒนาและใช้งาน — ThaiDevDocs Platform

> เอกสารนี้สำหรับ developer ที่ต้องการ clone โปรเจคนี้ไปรัน local, ปรับแต่ง, deploy หรือ contribute content  
> อัปเดต: มิถุนายน 2026

---

## สารบัญ

1. [ภาพรวมโปรเจค](#1-ภาพรวมโปรเจค)
2. [ความต้องการของระบบ](#2-ความต้องการของระบบ)
3. [Quick Start — รัน docs อย่างเดียว](#3-quick-start--รัน-docs-อย่างเดียว)
4. [การตั้งค่า Environment (.env.local)](#4-การตั้งค่า-environment-envlocal)
5. [Full Setup — เปิดใช้ทุกฟีเจอร์](#5-full-setup--เปิดใช้ทุกฟีเจอร์)
6. [Laravel API (Optional)](#6-laravel-api-optional)
7. [การรันโปรเจค](#7-การรันโปรเจค)
8. [โครงสร้างโฟลเดอร์](#8-โครงสร้างโฟลเดอร์)
9. [การเขียนและแก้ไข Content](#9-การเขียนและแก้ไข-content)
10. [npm Scripts ที่ใช้บ่อย](#10-npm-scripts-ที่ใช้บ่อย)
11. [Deploy บน Vercel](#11-deploy-บน-vercel)
12. [การทดสอบและตรวจสอบคุณภาพ](#12-การทดสอบและตรวจสอบคุณภาพ)
13. [การปรับแต่งสำหรับ Fork / White-label](#13-การปรับแต่งสำหรับ-fork--white-label)
14. [Troubleshooting](#14-troubleshooting)
15. [เอกสารที่เกี่ยวข้อง](#15-เอกสารที่เกี่ยวข้อง)

---

## 1. ภาพรวมโปรเจค

ThaiDevDocs Platform เป็น **docs site ภาษาไทย** สำหรับ Laravel, Vue, DevOps, AI และ Thai Context

| ส่วน | เทคโนโลยี | หน้าที่ |
|---|---|---|
| Frontend / Docs | Next.js 16 + Fumadocs | แสดง MDX, SEO, UI |
| Content | MDX ใน `content/docs/` | บทความทั้งหมด (Git-based) |
| Auth | NextAuth.js + GitHub OAuth | Login, profile |
| AI Q&A | Vercel AI SDK + Claude | ตอบคำถามจาก docs (RAG) |
| Backend (optional) | Laravel 11 ใน `apps/api/` | pgvector RAG, billing webhooks |
| Analytics | Plausible | Privacy-first tracking |
| Email | Resend | Newsletter + sponsor inquiry |
| Billing | LemonSqueezy | Pro subscription |

### โหมดการใช้งาน

```text
โหมด A — Docs only (ง่ายที่สุด)
  npm install && npm run dev
  → อ่าน docs ได้ทันที ไม่ต้องตั้ง OAuth/AI

โหมด B — Full local (แนะนำสำหรับพัฒนา)
  .env.local ครบ + GitHub OAuth + ANTHROPIC_API_KEY + DEV_PRO
  → ทด login, AI chat, premium gate ได้

โหมด C — Production-like
  Next.js บน Vercel + Laravel API + PostgreSQL pgvector
  → RAG แบบ vector search + LemonSqueezy webhooks
```

---

## 2. ความต้องการของระบบ

### จำเป็น (Next.js / Docs)

| รายการ | เวอร์ชันที่แนะนำ |
|---|---|
| Node.js | 20 LTS ขึ้นไป |
| npm | 10+ (มากับ Node) |
| Git | ล่าสุด |

### จำเป็นเมื่อใช้ Laravel API

| รายการ | เวอร์ชัน |
|---|---|
| PHP | 8.2+ |
| Composer | 2.x |
| SQLite | ใช้ default local (มากับ PHP) |
| PostgreSQL + pgvector | แนะนำสำหรับ production RAG |

### จำเป็นเมื่อ lint PHP ใน content QA

| รายการ | หมายเหตุ |
|---|---|
| PHP CLI | สำหรับ `npm run content:qa -- --php` |

### บัญชี / Services ภายนอก (ตามฟีเจอร์ที่ต้องการ)

| Service | ใช้เมื่อ |
|---|---|
| [GitHub OAuth App](https://github.com/settings/developers) | Login |
| [Anthropic API](https://console.anthropic.com/) | AI Q&A local |
| [Giscus](https://giscus.app/) | Comments |
| [Plausible](https://plausible.io/) | Analytics |
| [Resend](https://resend.com/) | Newsletter + sponsor email |
| [LemonSqueezy](https://www.lemonsqueezy.com/) | Pro billing |
| [Algolia DocSearch](https://docsearch.algolia.com/) | Search (optional) |

---

## 3. Quick Start — รัน docs อย่างเดียว

เหมาะสำหรับอ่าน docs หรือแก้ MDX โดยไม่ต้องตั้ง OAuth/AI

```bash
# 1. Clone repository
git clone https://github.com/Sakeerin/ThaiDevDocs-Platform.git
cd ThaiDevDocs-Platform

# 2. ติดตั้ง dependencies
npm install

# 3. รัน dev server
npm run dev
```

เปิดเบราว์เซอร์: **http://localhost:3000**

- Docs: http://localhost:3000/docs
- Contribute guide: http://localhost:3000/contribute
- Pricing: http://localhost:3000/pricing

> ไม่ต้องมี `.env.local` ก็รันได้ — ฟีเจอร์ที่ต้องใช้ env (login, AI, comments) จะถูกปิดหรือแสดง fallback

---

## 4. การตั้งค่า Environment (.env.local)

### ขั้นตอน

```bash
cp .env.local.example .env.local
```

แก้ไข `.env.local` ตามฟีเจอร์ที่ต้องการเปิดใช้

### ตาราง Environment Variables

#### SEO & Site

| Variable | จำเป็น | ค่า local ตัวอย่าง | หน้าที่ |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | แนะนำ | `http://localhost:3000` | Canonical URL, sitemap, email links |

#### Auth (GitHub OAuth)

| Variable | จำเป็น | หน้าที่ |
|---|---|---|
| `NEXTAUTH_SECRET` | ถ้าใช้ login | Random string — สร้างด้วย `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ถ้าใช้ login | `http://localhost:3000` |
| `GITHUB_CLIENT_ID` | ถ้าใช้ login | จาก GitHub OAuth App |
| `GITHUB_CLIENT_SECRET` | ถ้าใช้ login | จาก GitHub OAuth App |

**ตั้งค่า GitHub OAuth App:**

1. ไปที่ https://github.com/settings/developers → OAuth Apps → New
2. Homepage URL: `http://localhost:3000`
3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. คัดลอก Client ID / Secret ใส่ `.env.local`

#### AI Q&A (Local RAG)

| Variable | จำเป็น | หน้าที่ |
|---|---|---|
| `ANTHROPIC_API_KEY` | ถ้าใช้ AI | API key จาก Anthropic |
| `ANTHROPIC_MODEL` | ไม่ | default: `claude-sonnet-4-20250514` |

#### ทด Pro ใน local (ไม่ต้องจ่ายเงิน)

| Variable | ค่า | หน้าที่ |
|---|---|---|
| `NEXT_PUBLIC_DEV_PRO` | `true` | เปิด Pro สำหรับทุกคนใน dev |
| `DEV_PRO_GITHUB_LOGINS` | `your-github-username` | จำกัด Pro เฉพาะ username (คั่นด้วย comma) |

#### Laravel API (Production RAG path)

| Variable | หน้าที่ |
|---|---|
| `API_URL` | URL Laravel API เช่น `http://localhost:8000` |
| `API_SYNC_SECRET` | Secret ร่วมกับ Laravel — header `X-Api-Secret` |

เมื่อตั้ง `API_URL` + login สำเร็จ → AI จะ proxy ไป Laravel pgvector ก่อน; ถ้า Laravel ไม่ตอบ → fallback local RAG

#### Giscus Comments

| Variable | หน้าที่ |
|---|---|
| `NEXT_PUBLIC_GISCUS_REPO` | `owner/repo` |
| `NEXT_PUBLIC_GISCUS_REPO_ID` | จาก giscus.app setup |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | Discussion category ID |

สร้าง config ที่ https://giscus.app/ แล้ว copy IDs มาใส่

#### Algolia DocSearch

| Variable | หน้าที่ |
|---|---|
| `NEXT_PUBLIC_ALGOLIA_APP_ID` | Algolia App ID |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` | Search-only API key |
| `NEXT_PUBLIC_ALGOLIA_INDEX_NAME` | Index name |

ว่างไว้ได้ — Fumadocs มี built-in search fallback

#### Plausible Analytics

| Variable | หน้าที่ |
|---|---|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Domain ที่ลงทะเบียนใน Plausible |

#### Newsletter (Resend)

| Variable | หน้าที่ |
|---|---|
| `RESEND_API_KEY` | API key จาก Resend |
| `RESEND_FROM_EMAIL` | เช่น `ThaiDevDocs <newsletter@yourdomain.com>` |
| `CRON_SECRET` | Random string สำหรับ protect cron endpoints |

#### LemonSqueezy (Pro Billing)

| Variable | หน้าที่ |
|---|---|
| `LEMON_SQUEEZY_STORE_ID` | Store ID |
| `LEMON_SQUEEZY_WEBHOOK_SECRET` | Webhook signing secret |
| `NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_MONTHLY` | Checkout URL รายเดือน |
| `NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_ANNUAL` | Checkout URL รายปี |
| `NEXT_PUBLIC_PRO_DISCORD_INVITE_URL` | Discord invite สำหรับ Pro |

#### Sponsors

| Variable | หน้าที่ |
|---|---|
| `NEXT_PUBLIC_SPONSORS_ENABLED` | `true` / `false` — ปิด sidebar sponsor |
| `NEXT_PUBLIC_SPONSOR_CTA_URL` | default `/sponsor` |
| `NEXT_PUBLIC_SPONSOR_CONTACT_EMAIL` | อีเมลติดต่อ |
| `SPONSOR_INQUIRY_NOTIFY_EMAIL` | รับแจ้งเมื่อมี inquiry form |

---

## 5. Full Setup — เปิดใช้ทุกฟีเจอร์

### ขั้นตอนแนะนำ (Local development)

```bash
# 1. Clone + install
git clone https://github.com/Sakeerin/ThaiDevDocs-Platform.git
cd ThaiDevDocs-Platform
npm install

# 2. Environment
cp .env.local.example .env.local
# แก้ไข .env.local ตามตารางด้านบน

# 3. สร้าง NEXTAUTH_SECRET
# Windows PowerShell:
# [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# 4. รัน
npm run dev
```

### Checklist ฟีเจอร์หลังตั้งค่า

| ฟีเจอร์ | ทดสอบที่ | ต้องมี env |
|---|---|---|
| อ่าน docs | `/docs` | — |
| GitHub login | `/login` | `GITHUB_*`, `NEXTAUTH_*` |
| Profile | `/profile` | login สำเร็จ |
| AI Chat (Pro) | ปุ่มแชทมุมขวา docs | `ANTHROPIC_API_KEY` + Pro |
| Premium blur | บทความ `is_premium: true` | Pro หรือ `DEV_PRO` |
| Comments | ท้ายบทความ | `NEXT_PUBLIC_GISCUS_*` |
| Newsletter | footer บทความ / หน้า home | `RESEND_*` |
| Sponsor form | `/sponsor` | `RESEND_*` (optional — เก็บ local ได้) |
| Search | ปุ่มค้นหา | Algolia keys หรือ built-in |

### ข้อมูล local ที่เก็บใน `.data/` (gitignore)

| ไฟล์ | เก็บอะไร |
|---|---|
| `.data/newsletter-subscribers.json` | อีเมล newsletter |
| `.data/sponsor-inquiries.json` | Sponsor inquiry forms |
| `.data/ai-usage.json` | AI rate limit รายวัน |
| `.data/sponsor-inquiry-rate-limit.json` | Rate limit sponsor form |

---

## 6. Laravel API (Optional)

ใช้เมื่อต้องการ **pgvector RAG**, **Redis rate limit**, และ **LemonSqueezy webhooks** แบบ production

### Setup

```bash
cd apps/api
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan content:embed --sync
php artisan serve
```

API รันที่ **http://localhost:8000**

### Laravel `.env` ที่ต้องเพิ่ม (นอกจาก default)

สร้าง/แก้ใน `apps/api/.env`:

```ini
APP_URL=http://localhost:8000

# ต้องตรงกับ Next.js .env.local
API_SYNC_SECRET=your-shared-secret

ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-20250514

# Embeddings (production ใช้ openai, local ใช้ mock ได้)
EMBEDDING_PROVIDER=mock
OPENAI_API_KEY=

# Webhooks
GITHUB_WEBHOOK_SECRET=
LEMON_SQUEEZY_WEBHOOK_SECRET=

# Production: เปลี่ยนเป็น pgsql + pgvector
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_DATABASE=thaidevdocs
```

จากนั้นตั้ง Next.js `.env.local`:

```ini
API_URL=http://localhost:8000
API_SYNC_SECRET=your-shared-secret
```

### Laravel API Endpoints

| Method | Path | หน้าที่ |
|---|---|---|
| `POST` | `/api/auth/sync` | Sync GitHub user จาก Next.js (header `X-Api-Secret`) |
| `POST` | `/api/ai/qa` | Streaming AI Q&A (Bearer Sanctum token, Pro required) |
| `GET` | `/api/ai/usage` | Daily query usage |
| `POST` | `/api/webhooks/github` | Re-embed content เมื่อ push ไป main |
| `POST` | `/api/webhooks/lemonsqueezy` | Activate/cancel Pro subscription |

### Embed content ใหม่หลังแก้ MDX

```bash
cd apps/api
php artisan content:embed --sync
```

---

## 7. การรันโปรเจค

### Development

```bash
npm run dev
```

- URL: http://localhost:3000
- Hot reload: เปิดอยู่โดยอัตโนมัติ
- MDX เปลี่ยนแล้ว refresh หน้าได้เลย

### Production build (local)

```bash
npm run build
npm run start
```

- ตรวจ TypeScript + generate static pages
- ใช้ทด performance / SEO ก่อน deploy

### Type check

```bash
npm run types:check
```

Regenerate MDX types + รัน `tsc --noEmit`

### Lint

```bash
npm run lint
```

---

## 8. โครงสร้างโฟลเดอร์

```text
ThaiDevDocs-Platform/
├── app/                      # Next.js routes
│   ├── (home)/               # Landing page
│   ├── docs/[[...slug]]/     # Docs pages
│   ├── api/                  # API routes (ai, auth, newsletter, sponsor)
│   ├── login/                # GitHub login
│   ├── profile/              # User profile
│   ├── pricing/              # Pricing page
│   ├── sponsor/              # Sponsor onboarding
│   └── settings/billing/     # Pro billing
├── components/               # React components
├── content/docs/             # MDX articles + meta.json
├── data/
│   ├── sponsors.json         # Active sidebar sponsors
│   └── sponsors.example.json # ตัวอย่าง format
├── docs/                     # Internal documentation
│   ├── DEVELOPMENT-GUIDE.md  # ไฟล์นี้
│   ├── PHASE-IMPLEMENTATION-SUMMARY.md
│   ├── LAUNCH-CHECKLIST.md
│   └── SPONSOR-ONBOARDING.md
├── lib/                      # Shared logic
├── scripts/                  # CLI tools
├── apps/api/                 # Laravel backend
├── source.config.ts          # MDX frontmatter schema
├── proxy.ts                  # Auth guard + MDX rewrite
├── vercel.json               # Cron + build config
└── .env.local.example        # Env template
```

### ไฟล์ config สำคัญ

| ไฟล์ | หน้าที่ |
|---|---|
| `source.config.ts` | Zod schema frontmatter บทความ |
| `lib/shared.ts` | ชื่อ app, GitHub repo config |
| `lib/layout.shared.tsx` | Navigation links |
| `content/docs/meta.json` | ลำดับหมวดใน sidebar |
| `content/docs/*/meta.json` | ลำดับบทความในแต่ละหมวด |
| `data/sponsors.json` | Sponsor ที่แสดงใน docs sidebar |

---

## 9. การเขียนและแก้ไข Content

### สร้างบทความใหม่

1. สร้างไฟล์ `.mdx` ใน `content/docs/{topic}/your-slug.mdx`
2. เพิ่ม slug ใน `content/docs/{topic}/meta.json`
3. ใส่ frontmatter ครบตาม schema
4. รัน `npm run content:check`

### Frontmatter ที่จำเป็น

```yaml
---
title: "ชื่อบทความ"
description: "คำอธิบายสั้นๆ สำหรับ SEO"
topic: laravel          # laravel | vue | devops | ai | thai-context
subtopic: eloquent      # string อธิบายหัวข้อย่อย
tags:
  - eloquent
  - performance
difficulty: intermediate  # beginner | intermediate | advanced
laravel_version: "11.x"   # ใส่เมื่อ topic เป็น laravel
verified_at: "2026-06-21" # วันที่ตรวจสอบล่าสุด (YYYY-MM-DD)
author: github_username
contributors: []
reading_time: 12          # optional — นาที
is_premium: false         # true = Pro only
---
```

### กฎการเขียน

- อธิบาย concept ก่อน code
- ใช้ตัวอย่างบริบทไทย (฿, ชื่อไทย, LINE, PDPA)
- ทุก code block ต้องมี language tag: ` ```php `, ` ```bash `
- Internal links ใช้ `/docs/laravel/eager-loading`
- อัปเดต `verified_at` ทุกครั้งที่แก้เนื้อหาสำคัญ

### ตรวจ content ก่อน commit

```bash
npm run content:check
```

| Script | ตรวจอะไร |
|---|---|
| `content:validate` | frontmatter ครบทุก field |
| `content:stale` | บทความเก่ากว่า 6 เดือน |
| `content:qa` | code fence language, links, JSON syntax |

Flags เพิ่มเติม:

```bash
npm run content:qa -- --strict    # fail เมื่อมี warning
npm run content:qa -- --php       # lint PHP snippets
npm run content:fix-fences        # แก้ bare ``` เป็น ```text
```

### Contribute ผ่าน GitHub

1. Fork repository
2. Branch: `docs/your-topic`
3. แก้ MDX + รัน `npm run content:check`
4. เปิด Pull Request

ดูรายละเอียด: `.github/CONTRIBUTING.md` และ `/contribute`

---

## 10. npm Scripts ที่ใช้บ่อย

| คำสั่ง | หน้าที่ |
|---|---|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | รัน production build |
| `npm run lint` | ESLint |
| `npm run types:check` | TypeScript + MDX types |
| `npm run content:check` | Validate + stale + QA รวม |
| `npm run content:validate` | ตรวจ frontmatter |
| `npm run content:stale` | รายการบทความ outdated |
| `npm run content:qa` | QA code blocks และ links |
| `npm run smoke:test` | HTTP smoke test (ตั้ง `SMOKE_TEST_URL`) |
| `npm run verify:production` | ตรวจ env vars สำหรับ production |
| `npm run lighthouse:audit` | Lighthouse performance audit |
| `npm run newsletter:weekly` | ส่ง weekly newsletter (CLI) |
| `npm run sponsor:inquiries` | ดู sponsor inquiries |
| `npm run vercel:pull` | ดึง env จาก Vercel preview |
| `npm run deploy:staging` | Deploy preview ไป Vercel |

---

## 11. Deploy บน Vercel

### ขั้นตอนแรก

```bash
npx vercel login
npx vercel link
npm run vercel:pull          # ดึง env preview
npm run deploy:staging       # deploy preview
```

### Production

1. เชื่อม GitHub repo กับ Vercel project
2. Production branch = `main`
3. ตั้ง env vars ทั้งหมดจาก `.env.local.example` ใน Vercel Dashboard → Settings → Environment Variables
4. Custom domain + SSL
5. ตั้ง GitHub OAuth callback เป็น `https://yourdomain.com/api/auth/callback/github`

### Cron (Newsletter)

`vercel.json` กำหนด cron ส่ง newsletter ทุกวันจันทร์ 02:00 UTC:

```json
{
  "crons": [
    {
      "path": "/api/newsletter/weekly",
      "schedule": "0 2 * * 1"
    }
  ]
}
```

Endpoint ต้องการ header:

```http
Authorization: Bearer YOUR_CRON_SECRET
```

### Checklist ก่อน launch

```bash
npm run verify:production
SMOKE_TEST_URL=https://yourdomain.com npm run smoke:test
SMOKE_TEST_URL=https://yourdomain.com npm run lighthouse:audit
```

ดูครบ: [docs/LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md)

---

## 12. การทดสอบและตรวจสอบคุณภาพ

### Smoke test

```bash
# Local
npm run smoke:test

# Production
SMOKE_TEST_URL=https://thaidevdocs.com npm run smoke:test
```

ทด routes: `/`, `/docs`, `/pricing`, `/contribute`, `/sitemap.xml`, `/robots.txt` ฯลฯ

### Production env verify

```bash
npm run verify:production
```

อ่านจาก `.env.local` หรือ `.env.production.local` — แจ้ง env ที่ขาด

### Lighthouse audit

```bash
SMOKE_TEST_URL=https://yourdomain.com npm run lighthouse:audit
```

เป้า: score ≥ 90

### Sponsor inquiries (local)

```bash
npm run sponsor:inquiries
npm run sponsor:inquiries -- --status=pending
node scripts/list-sponsor-inquiries.mjs --update=INQUIRY_ID --set-status=active
```

---

## 13. การปรับแต่งสำหรับ Fork / White-label

### เปลี่ยนชื่อและ GitHub repo

แก้ `lib/shared.ts`:

```typescript
export const appName = 'YourDocsName';

export const gitConfig = {
  user: 'your-github-username',
  repo: 'your-repo-name',
  branch: 'main',
};
```

### เปลี่ยน navigation / topics

- หมวดหลัก: `content/docs/meta.json`
- บทความต่อหมวด: `content/docs/{topic}/meta.json`
- เพิ่ม topic ใหม่: แก้ `topic` enum ใน `source.config.ts`

### เพิ่ม Sponsor

แก้ `data/sponsors.json`:

```json
[
  {
    "id": "your-company",
    "name": "Your Company",
    "tagline": "Tagline สูงสุด 80 ตัวอักษร",
    "url": "https://yourcompany.com",
    "tier": "gold",
    "logoUrl": "https://yourcompany.com/logo.png",
    "active": true
  }
]
```

ดู runbook: [docs/SPONSOR-ONBOARDING.md](./SPONSOR-ONBOARDING.md)

### ปิดฟีเจอร์

| ต้องการปิด | ตั้งค่า |
|---|---|
| Sponsors | `NEXT_PUBLIC_SPONSORS_ENABLED=false` |
| Analytics | ไม่ตั้ง `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` |
| Comments | ไม่ตั้ง `NEXT_PUBLIC_GISCUS_*` |
| AI | ไม่ตั้ง `ANTHROPIC_API_KEY` |

---

## 14. Troubleshooting

### `npm run dev` ไม่ขึ้น / port ถูกใช้

```bash
# เปลี่ยน port
npm run dev -- -p 3001
```

### Login ไม่ได้ / redirect loop

- ตรวจ `NEXTAUTH_URL` ตรงกับ URL ที่เปิด (รวม port)
- ตรวจ GitHub OAuth callback URL ตรงกับ `/api/auth/callback/github`
- ตรวจ `NEXTAUTH_SECRET` ไม่ว่าง

### AI Chat แสดง "Pro required"

- ตั้ง `NEXT_PUBLIC_DEV_PRO=true` สำหรับ local
- หรือใส่ GitHub username ใน `DEV_PRO_GITHUB_LOGINS`
- หรือ subscribe Pro ผ่าน LemonSqueezy

### AI Chat error / ไม่ตอบ

- ตรวจ `ANTHROPIC_API_KEY` ถูกต้อง
- ถ้าใช้ Laravel: ตรวจ `API_URL` และ `php artisan serve` รันอยู่
- ดู console / Network tab ที่ `/api/ai`

### Comments ไม่แสดง

- ตรวจ `NEXT_PUBLIC_GISCUS_REPO_ID` และ `CATEGORY_ID`
- เปิด GitHub Discussions ใน repo
- ติดตั้ง Giscus app บน repo

### Newsletter ส่งไม่ได้

- ตรวจ `RESEND_API_KEY` และ verify domain ใน Resend
- `RESEND_FROM_EMAIL` ต้องใช้ domain ที่ verify แล้ว

### `npm run content:check` fail

- อ่าน error message — มักเป็น frontmatter ขาด field หรือ code block ไม่มี language
- รัน `npm run content:fix-fences` สำหรับ bare fences

### Build fail

```bash
npm run types:check   # หา TypeScript error
npm run content:check # หา MDX error
npm run build         # ดู error เต็ม
```

---

## 15. เอกสารที่เกี่ยวข้อง

| เอกสาร | เนื้อหา |
|---|---|
| [README.md](../README.md) | Overview สั้นๆ |
| [thaidevdocs-plan.md](../thaidevdocs-plan.md) | แผนพัฒนาทั้งโปรเจค |
| [PHASE-IMPLEMENTATION-SUMMARY.md](./PHASE-IMPLEMENTATION-SUMMARY.md) | สรุปสิ่งที่ทำแต่ละ Phase |
| [LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md) | Checklist ก่อน launch production |
| [SPONSOR-ONBOARDING.md](./SPONSOR-ONBOARDING.md) | Runbook จัดการ sponsor |
| [.github/CONTRIBUTING.md](../.github/CONTRIBUTING.md) | คู่มือ contribute content |
| [apps/api/README.md](../apps/api/README.md) | Laravel API setup |
| [.env.local.example](../.env.local.example) | Template env ครบทุกตัว |

---

## Quick Reference — คำสั่งที่ใช้ทุกวัน

```bash
# เริ่มพัฒนา
npm install && cp .env.local.example .env.local && npm run dev

# ก่อน commit content
npm run content:check

# ก่อน deploy
npm run build && npm run verify:production

# Laravel API (ถ้าใช้)
cd apps/api && php artisan serve
```

---

*มีคำถามเพิ่มเติม เปิด issue บน GitHub หรือดู `/contribute` บนเว็บไซต์*
