# แผนพัฒนา ThaiDevDocs Platform

> **สถานะ:** Planning Phase  
> **เวอร์ชัน:** 1.0  
> **อัปเดตล่าสุด:** เมษายน 2026  
> **Stack:** Next.js 15 · Fumadocs · MDX · Claude API · pgvector · Laravel 11

---

## สารบัญ

1. [ภาพรวมโปรเจค](#1-ภาพรวมโปรเจค)
2. [Tech Stack](#2-tech-stack)
3. [สถาปัตยกรรมระบบ](#3-สถาปัตยกรรมระบบ)
4. [Content Architecture](#4-content-architecture)
5. [AI Q&A System](#5-ai-qa-system)
6. [Community & Contribution System](#6-community--contribution-system)
7. [Timeline แบบละเอียด (10 สัปดาห์)](#7-timeline-แบบละเอียด-10-สัปดาห์)
8. [Content Roadmap (80+ articles)](#8-content-roadmap-80-articles)
9. [Monetization & Pricing](#9-monetization--pricing)
10. [Go-to-Market Strategy](#10-go-to-market-strategy)
11. [Risk Assessment](#11-risk-assessment)
12. [Definition of Done](#12-definition-of-done)

---

## 1. ภาพรวมโปรเจค

### Vision
แพลตฟอร์ม docs ภาษาไทยสำหรับ developer ที่อธิบาย Laravel, Vue.js, DevOps และ AI integration ด้วยตัวอย่าง context ไทย (PromptPay, PDPA, LINE Bot) พร้อม AI Q&A ที่ถามเป็นภาษาไทยแล้วได้คำตอบจาก docs จริง — community-driven ผ่าน GitHub PR

### ปัญหาที่แก้

| ปัญหา | ผลกระทบต่อ dev ไทย |
|---|---|
| Official docs เป็นอังกฤษทั้งหมด | ต้องแปลงภาษา + แปลง mental model ใช้เวลาเพิ่ม |
| ตัวอย่าง code ใช้ "John Smith", "USD" | ต้อง adapt เองให้ตรงกับ context ไทย |
| Stack Overflow คำตอบเป็นอังกฤษ | ถามและหาคำตอบยากสำหรับผู้ที่อ่านอังกฤษไม่คล่อง |
| ไม่มี Thai-specific guides | Omise, PromptPay, DBD API, LINE Bot — ต้องลองผิดลองถูกเอง |
| YouTube tutorial ภาษาไทย searchable ยาก | ข้อมูลกระจัดกระจาย หาย reference ไม่ได้ |

### Competitive Moat

```
ภาษาไทย = SEO moat ที่ชัดที่สุด
  → Google "laravel eloquent ภาษาไทย" → แทบไม่มีผลดีอยู่เลย
  → ยิ่งมี content เยอะ ยิ่ง compound — ไม่มี global platform มาแข่งได้

AI Q&A ภาษาไทยจาก docs context
  → ถาม "ทำ N+1 query ใน Eloquent แก้ยังไง?" → ได้คำตอบทันที
  → ไม่มีที่ไหนในภาษาไทยทำแบบนี้ได้

Community-maintained
  → Knowledge สะสมจาก PR ของ community ดีกว่าเขียนคนเดียว
  → Contributors ได้ credit → incentive ในการ contribute
```

### Target Audience
- **Junior dev ไทย:** เพิ่งเรียนจบ หรือ self-taught, อ่านอังกฤษได้แต่ยังไม่คล่อง
- **Mid-level dev:** ต้องการ reference เร็ว ไม่อยากอ่าน official docs ยาว
- **Dev ที่ทำงานกับ Thai business context:** PromptPay, PDPA, LINE Bot, Thai APIs

---

## 2. Tech Stack

### Content Platform

```
Next.js 15 (App Router)  — SSG/ISR สำหรับ docs pages, SEO-first
Fumadocs 13.x            — docs framework บน Next.js (sidebar, search, TOC)
MDX 3.x                  — content authoring (Markdown + JSX components)
Contentlayer2            — MDX → TypeScript typed content objects
```

> **ทำไม Fumadocs:** ให้ full-text search, sidebar navigation, dark mode, i18n, versioned docs ฟรี ไม่ต้องสร้างเอง เขียน MDX แล้วได้ docs site ทันที

### Search

```
Algolia DocSearch        — full-text search (ฟรีสำหรับ open-source docs)
Orama                    — self-hosted fallback (open-source, edge-compatible)
```

> Algolia DocSearch ยื่นขอผ่าน docsearch.algolia.com ฟรีสำหรับ public docs — อนุมัติเร็วถ้า site มี content แล้ว

### AI Q&A System

```
Claude claude-sonnet-4-6          — ตอบคำถามจาก docs context (RAG)
pgvector 0.7             — vector embedding ของ docs content
Vercel AI SDK            — streaming response ใน Next.js
```

### Backend (Community + Pro features)

```
Laravel 11               — API: auth, comments, Pro subscription, AI Q&A proxy
GitHub OAuth             — login ด้วย GitHub account
PostgreSQL 16 + pgvector — user data + content embeddings
Redis                    — rate limiting, session, cache
```

### Frontend Components

```
shadcn/ui                — UI components (reuse จากโปรเจคอื่น)
Tailwind CSS v4          — styling
Giscus                   — comment system บน GitHub Discussions (ฟรี)
```

### Hosting & Analytics

```
Vercel                   — Next.js hosting (Edge, global CDN)
Cloudflare               — DNS, WAF, additional CDN cache
Plausible Analytics      — privacy-first analytics (ไม่ใช้ cookie, GDPR compliant)
GitHub                   — content repository (open-source, community PR)
```

### Billing

```
LemonSqueezy             — Pro subscription (฿99/เดือน)
                           merchant of record, รองรับ Thai credit card
```

### DevOps

```
GitHub Actions           — CI/CD: lint MDX, check broken links, deploy
Vercel Previews          — preview URL ทุก PR ก่อน merge
```

---

## 3. สถาปัตยกรรระบบ

### Repository Structure

```
thaidevdocs/
├── apps/
│   └── web/                          — Next.js 15 site
│       ├── app/
│       │   ├── (docs)/
│       │   │   └── [slug]/page.tsx   — SSG docs pages
│       │   ├── ai/
│       │   │   └── route.ts          — AI Q&A streaming endpoint
│       │   └── api/
│       │       ├── auth/             — GitHub OAuth
│       │       └── comments/         — proxy ไป Laravel API
│       ├── components/
│       │   ├── AiChat.tsx            — AI Q&A UI
│       │   ├── ArticleCard.tsx
│       │   └── VersionBadge.tsx      — "verified: Laravel 11"
│       └── public/
├── content/                          — MDX content (open-source)
│   ├── laravel/
│   │   ├── eloquent/
│   │   │   ├── relationships.mdx
│   │   │   ├── scopes.mdx
│   │   │   └── eager-loading.mdx
│   │   ├── queue/
│   │   ├── auth/
│   │   └── testing/
│   ├── vue/
│   │   ├── composition-api/
│   │   ├── pinia/
│   │   └── inertia/
│   ├── devops/
│   │   ├── docker/
│   │   ├── ci-cd/
│   │   └── deployment/
│   ├── ai/
│   │   ├── claude-api/
│   │   ├── langraph/
│   │   └── line-bot-ai/
│   └── thai-context/
│       ├── omise-promptpay/
│       ├── pdpa/
│       └── line-api/
├── apps/
│   └── api/                          — Laravel 11 backend
│       ├── app/Services/
│       │   ├── AiQaService.php       — RAG pipeline
│       │   └── EmbeddingService.php  — content embedding
│       └── ...
└── packages/
    └── mdx-components/               — shared MDX components
```

### Content Delivery Flow

```
GitHub repo (content/*.mdx)
  │
  │ git push / PR merge
  ▼
GitHub Actions
  ├── lint MDX (remark-lint)
  ├── check broken links (lychee)
  └── deploy to Vercel

Vercel Build
  ├── Contentlayer2: parse MDX → typed objects
  ├── Next.js SSG: render ทุก page เป็น static HTML
  └── Edge deployment: global CDN

User เปิด docs page
  ├── Vercel Edge: serve static HTML (< 50ms TTFB)
  ├── Algolia DocSearch: search index อัปเดตอัตโนมัติ
  └── Giscus: load GitHub Discussions สำหรับ comments
```

### AI Q&A Flow (Pro users)

```
User พิมพ์คำถามภาษาไทย
  │
  ▼
Next.js Route Handler: POST /api/ai
  ├── ตรวจ Pro session (Laravel API)
  ├── rate limit: 20 queries/วัน per user (Redis)
  └── ส่ง query ไป Laravel AiQaService

Laravel AiQaService (RAG pipeline)
  ├── embed query ด้วย Claude text-embedding-3-small
  ├── pgvector cosine search บน content embeddings
  │   → ดึง top 5 relevant sections
  ├── build prompt: system + context sections + user question
  └── stream Claude response → SSE → browser

Browser แสดง streaming response
  └── cite sources: link ไปยัง article ที่เกี่ยวข้อง
```

---

## 4. Content Architecture

### MDX Frontmatter Schema

```yaml
---
title: "Eloquent Relationships ภาษาไทย — คู่มือฉบับสมบูรณ์"
description: "อธิบาย hasOne, hasMany, belongsTo, belongsToMany พร้อมตัวอย่างจริงใน context ไทย"
topic: laravel
subtopic: eloquent
tags: [eloquent, relationships, orm, database]
difficulty: intermediate          # beginner | intermediate | advanced
laravel_version: "11.x"          # version ที่ verified
verified_at: "2026-04-01"        # วันที่ verify ล่าสุด
author: github_username
contributors: [username1, username2]
reading_time: 12                  # นาที (auto-calculate ก็ได้)
is_premium: false                 # true = Pro only
---
```

### MDX Custom Components

```tsx
// packages/mdx-components/index.tsx

export const mdxComponents = {
  // Code block พร้อม copy button + syntax highlight
  pre: CodeBlock,

  // Callout boxes
  Note: ({ children }) => <Callout type="note">{children}</Callout>,
  Warning: ({ children }) => <Callout type="warning">{children}</Callout>,
  Tip: ({ children }) => <Callout type="tip">{children}</Callout>,

  // Thai context badge
  ThaiContext: ({ children }) => (
    <div className="thai-context-block">
      <span className="badge">🇹🇭 Thai Context</span>
      {children}
    </div>
  ),

  // Version badge
  VersionBadge: ({ version }) => (
    <span className="version-badge">Laravel {version}</span>
  ),

  // Live code example (optional)
  LiveCode: ({ code, language }) => <SandpackEditor code={code} lang={language} />,

  // Comparison table
  Comparison: ({ items }) => <ComparisonTable items={items} />,
}
```

### Article Template

```mdx
---
title: "N+1 Query Problem ใน Laravel — วิเคราะห์และแก้ไข"
description: "..."
topic: laravel
subtopic: database
difficulty: intermediate
laravel_version: "11.x"
verified_at: "2026-04-01"
---

## N+1 Problem คืออะไร?

<Note>
N+1 problem เกิดขึ้นเมื่อ code ของเรา query database ซ้ำๆ ใน loop
แทนที่จะ load ข้อมูลทั้งหมดพร้อมกันในครั้งเดียว
</Note>

## ตัวอย่างปัญหา

สมมติเรามีระบบสั่งซื้อสินค้า มี `Order` model และ `Customer` model:

```php
// ❌ ปัญหา: query วิ่ง N+1 ครั้ง
$orders = Order::all(); // 1 query

foreach ($orders as $order) {
    echo $order->customer->name; // +1 query ทุก iteration
}
// ถ้ามี 100 orders = 101 queries!
```

<ThaiContext>
ในระบบ e-commerce ไทย ถ้ามีออเดอร์ 500 รายการต่อวัน
N+1 อาจทำให้ page โหลดช้าจาก 200ms เป็น 5+ วินาที
ลูกค้าจะ bounce ออกทันที
</ThaiContext>

## วิธีแก้ด้วย Eager Loading

```php
// ✅ แก้ด้วย with(): query แค่ 2 ครั้งเสมอ
$orders = Order::with('customer')->get();

foreach ($orders as $order) {
    echo $order->customer->name; // ไม่มี query เพิ่ม
}
```

...
```

### Version Verification System

ทุก article ต้องมี `laravel_version` และ `verified_at` — GitHub Actions ตรวจ:

```yaml
# .github/workflows/content-check.yml
- name: Check stale articles
  run: |
    # flag articles ที่ verified_at > 6 เดือนที่แล้ว
    node scripts/check-stale-content.js
    # comment บน PR ถ้ามี article ที่อาจ outdated
```

---

## 5. AI Q&A System

### RAG Pipeline

```php
// app/Services/AiQaService.php (Laravel backend)

class AiQaService
{
    public function __construct(
        private readonly EmbeddingService $embeddings,
        private readonly ClaudeClient $claude,
    ) {}

    public function streamAnswer(string $question, callable $onChunk): void
    {
        // 1. Embed คำถาม
        $questionEmbedding = $this->embeddings->embed($question);

        // 2. ค้นหา relevant sections ด้วย pgvector
        $relevantSections = DB::select("
            SELECT title, content, slug, topic
            FROM content_sections
            ORDER BY embedding <=> ?::vector
            LIMIT 5
        ", [json_encode($questionEmbedding)]);

        // 3. Build context จาก sections ที่เจอ
        $context = collect($relevantSections)
            ->map(fn($s) => "### {$s->title}\n{$s->content}")
            ->join("\n\n---\n\n");

        // 4. Stream คำตอบจาก Claude
        $this->claude->streamMessages([
            'model'      => 'claude-sonnet-4-6',
            'max_tokens' => 1024,
            'system'     => $this->buildSystemPrompt(),
            'messages'   => [[
                'role'    => 'user',
                'content' => "Context จาก ThaiDevDocs:\n\n{$context}\n\n---\n\nคำถาม: {$question}",
            ]],
        ], $onChunk);
    }

    private function buildSystemPrompt(): string
    {
        return <<<'PROMPT'
        คุณคือ AI assistant ของ ThaiDevDocs — docs ภาษาไทยสำหรับ Laravel และ Vue.js developer

        กฎสำคัญ:
        - ตอบเป็นภาษาไทยเสมอ (ยกเว้น code ที่เป็นภาษา programming)
        - ตอบจาก context ที่ได้รับเท่านั้น อย่าตอบจากความรู้ทั่วไปถ้าไม่มีใน context
        - ถ้าไม่มีข้อมูลใน context ให้บอกตรงๆ ว่า "ยังไม่มี article เรื่องนี้ใน ThaiDevDocs"
        - แนะนำ article ที่เกี่ยวข้องเสมอ
        - ตัวอย่าง code ต้องถูกต้องและ runnable ใน Laravel 11
        - ใช้ภาษาที่เข้าใจง่าย ไม่ formal เกินไป
        PROMPT;
    }
}
```

### Content Embedding Pipeline

```php
// app/Jobs/EmbedContentJob.php

class EmbedContentJob implements ShouldQueue
{
    public function handle(EmbeddingService $embeddings): void
    {
        // รัน batch embedding ทุกครั้งที่ content เปลี่ยน (webhook จาก GitHub)
        $articles = $this->parseAllMdxFiles();

        foreach ($articles as $article) {
            // แบ่ง article เป็น sections (H2, H3)
            $sections = $this->splitIntoSections($article->content);

            foreach ($sections as $section) {
                $embedding = $embeddings->embed($section->text);

                ContentSection::updateOrCreate(
                    ['slug' => $article->slug, 'section_id' => $section->id],
                    [
                        'title'     => $section->heading,
                        'content'   => $section->text,
                        'topic'     => $article->topic,
                        'embedding' => json_encode($embedding),
                    ]
                );
            }
        }
    }
}
```

### Next.js Streaming Route Handler

```typescript
// app/api/ai/route.ts

import { createClient } from '@/lib/api-client'

export async function POST(request: Request) {
  const { question } = await request.json()

  // ตรวจ Pro session
  const session = await getServerSession()
  if (!session?.user?.isPro) {
    return Response.json({ error: 'Pro required' }, { status: 403 })
  }

  // Proxy ไป Laravel API พร้อม streaming
  const response = await fetch(`${process.env.API_URL}/ai/qa`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    },
    body: JSON.stringify({ question }),
  })

  // Pass-through stream ไป browser
  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })
}
```

### AiChat Component

```typescript
// components/AiChat.tsx
'use client'

import { useChat } from 'ai/react'

export function AiChat({ articleSlug }: { articleSlug?: string }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai',
    body: { articleSlug },    // ส่ง context ว่าอยู่ที่ article ไหน
  })

  return (
    <div className="ai-chat-panel">
      <div className="messages">
        {messages.map(m => (
          <div key={m.id} className={`message ${m.role}`}>
            <ReactMarkdown>{m.content}</ReactMarkdown>
          </div>
        ))}
        {isLoading && <div className="thinking">กำลังค้นหาคำตอบ...</div>}
      </div>

      <form onSubmit={handleSubmit} className="input-area">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="ถามเป็นภาษาไทยได้เลย เช่น 'ทำ N+1 query แก้ยังไง?'"
        />
        <button type="submit" disabled={isLoading}>ถาม</button>
      </form>

      <p className="hint">ตอบจาก ThaiDevDocs docs · {20 - usageToday} queries เหลือวันนี้</p>
    </div>
  )
}
```

---

## 6. Community & Contribution System

### GitHub-based Content Flow

```
ผู้ contribute ต้องการเพิ่มหรือแก้ article:

1. Fork repo → สร้าง branch
2. เขียน/แก้ไข MDX ใน content/
3. เปิด Pull Request
4. GitHub Actions ตรวจ:
   - MDX syntax valid
   - Frontmatter ครบ
   - ไม่มี broken links
   - spell check ภาษาไทย (optional)
   - Vercel Preview URL สร้างให้อัตโนมัติ
5. Maintainer review + approve
6. Merge → auto-deploy ไป Vercel
7. Re-embed content ใหม่ผ่าน GitHub webhook → Laravel

Contributors ได้ credit บน article (frontmatter + GitHub)
```

### Contribution Guidelines (.github/CONTRIBUTING.md)

```markdown
## วิธี Contribute

### สิ่งที่ต้องมีทุก article
- frontmatter ครบทุก field (title, description, topic, laravel_version, verified_at)
- อธิบายเป็นภาษาไทยที่เข้าใจง่าย
- ตัวอย่าง code ที่ runnable และ test แล้ว
- บอก Laravel/Vue version ที่ code ใช้ได้
- ใช้ตัวอย่าง context ไทย (ถ้าทำได้)

### Thai Context หมายถึงอะไร?
แทนที่จะเขียน:
  $user = User::find(1); // John Smith, USD

เขียนว่า:
  $order = Order::find(1); // สมชาย ใจดี, ฿ (บาท)

### Code Standards
- ทุก code block ต้องระบุ language: ```php, ```javascript
- ❌ bad code ให้ comment กำกับ
- ✅ good code ให้ comment กำกับ
- ทดสอบ code ใน local ก่อน submit

### Review Process
- Maintainer review ภายใน 3 วันทำการ
- ถ้ายังไม่ได้ review ใน 5 วัน → ping @maintainer ใน PR
```

### Comment System (Giscus)

ใช้ GitHub Discussions เป็น backend — ฟรี, ไม่ต้องดูแล infra:

```tsx
// components/Comments.tsx
import Giscus from '@giscus/react'

export function Comments({ slug }: { slug: string }) {
  return (
    <Giscus
      repo="thaidevdocs/thaidevdocs"
      repoId="R_xxxx"
      category="Comments"
      categoryId="DIC_xxxx"
      mapping="pathname"
      theme="preferred_color_scheme"
      lang="th"
    />
  )
}
```

---

## 7. Timeline แบบละเอียด (10 สัปดาห์)

---

### Phase 1: Platform Setup + Seed Content (สัปดาห์ 1–2)

**เป้าหมาย:** Platform ทำงานได้ มี 15 articles คุณภาพดีก่อน launch

#### สัปดาห์ 1 — Next.js + Fumadocs Setup

**วันที่ 1–2: Bootstrap**
- [x] `npx create-fumadocs-app` → Next.js 15 + Fumadocs
- [x] configure Contentlayer2: MDX → typed content
- [x] ตั้งค่า Tailwind v4 + shadcn/ui
- [x] dark mode: system preference auto-detect
- [ ] deploy ไป Vercel (staging domain) — รอ `vercel login` บนเครื่องผู้ใช้

**วันที่ 3–4: Navigation + Layout**
- [x] sidebar navigation: Laravel / Vue / DevOps / AI / Thai Context
- [x] breadcrumb navigation
- [x] Table of Contents (right sidebar) — เฉพาะ desktop
- [x] mobile hamburger menu
- [x] footer: GitHub link, contribute link, social

**วันที่ 5: Algolia DocSearch**
- [ ] ยื่นขอ Algolia DocSearch: docsearch.algolia.com
- [x] config `docusearch.config.json` ให้ crawl content
- [x] ติดตั้ง `@docsearch/react` ใน Fumadocs
- [ ] ทดสอบ search บน staging

**Deliverable สัปดาห์ 1:** Platform โครงสร้างพร้อม deploy staging แล้ว

---

#### สัปดาห์ 2 — Seed Content (15 Articles)

**วันที่ 6–7: Laravel Eloquent (5 articles)**
- [ ] Eloquent Relationships ครบทุก type (hasOne, hasMany, belongsTo, belongsToMany, morphTo)
- [ ] Eager Loading กับ N+1 Query Problem
- [ ] Eloquent Scopes (local + global)
- [ ] Query Builder vs Eloquent — เมื่อไหร่ใช้อะไร
- [ ] Eloquent Events & Observers

**วันที่ 8–9: Laravel Intermediate (5 articles)**
- [ ] Queue & Jobs — ทำงานเป็น background
- [ ] Laravel Service Container & Dependency Injection
- [ ] Laravel Policies & Gates — Authorization
- [ ] API Resources — transform data ก่อนส่ง
- [ ] Laravel Testing ด้วย Pest

**วันที่ 10: Thai Context (5 articles)**
- [ ] Omise + PromptPay integration กับ Laravel
- [ ] PDPA compliance ใน Laravel project
- [ ] LINE Messaging API integration
- [ ] DBD API — ค้นหาข้อมูลบริษัทไทย
- [ ] Thai date format ใน Laravel (Buddhist era)

**Deliverable สัปดาห์ 2:** 15 articles พร้อม, site ดูสมบูรณ์พอ soft launch

---

### Phase 2: Community Features + GitHub Flow (สัปดาห์ 3–4)

**เป้าหมาย:** Community contribute ได้ผ่าน GitHub PR

#### สัปดาห์ 3 — Auth + Comments + Edit Flow

**วันที่ 11–12: GitHub OAuth**
- [ ] Laravel Socialite: GitHub OAuth
- [ ] Next.js: auth session (NextAuth.js หรือ Better Auth)
- [ ] `/login` → GitHub → callback → save user
- [ ] Profile page: แสดง contributed articles

**วันที่ 13: Giscus Comments**
- [ ] สร้าง GitHub Discussions category "Comments"
- [ ] ติดตั้ง Giscus component ท้ายทุก article
- [ ] ทดสอบ: login ด้วย GitHub → comment ได้

**วันที่ 14–15: Edit on GitHub**
- [ ] "แก้ไข article นี้" button → link ไป GitHub edit หน้า
- [ ] Contribution guide page: วิธี fork + PR
- [ ] GitHub PR template: checklist frontmatter, code tested, Thai context
- [ ] GitHub Actions: MDX lint + broken link check + Vercel preview

**Deliverable สัปดาห์ 3:** Community contribute ผ่าน GitHub ได้แล้ว

---

#### สัปดาห์ 4 — Article Quality + Analytics

**วันที่ 16–17: Version Verification System**
- [ ] `VersionBadge` component: แสดง "✓ Verified: Laravel 11"
- [ ] GitHub Actions: flag articles ที่ `verified_at` เกิน 6 เดือน
- [ ] "article นี้อาจ outdated" banner สำหรับ article เก่า
- [ ] "Suggest update" button → เปิด GitHub issue template

**วันที่ 18–19: Reading Experience**
- [ ] progress bar ด้านบน page (scroll indicator)
- [ ] estimated reading time (คำนวณจาก word count)
- [ ] copy code button ทุก code block
- [ ] "Was this helpful?" thumbs up/down (บันทึกลง Plausible events)

**วันที่ 20: Plausible Analytics**
- [ ] ติดตั้ง Plausible (self-hosted หรือ cloud $9/เดือน)
- [ ] custom events: article_view, search_query, ai_question, helpful_vote
- [ ] dashboard: top articles, search terms, bounce rate

**Deliverable สัปดาห์ 4:** article quality system พร้อม analytics

---

### Phase 3: AI Q&A System (สัปดาห์ 5–8)

**เป้าหมาย:** AI Q&A ภาษาไทยทำงานได้ Pro tier พร้อม

#### สัปดาห์ 5 — Backend Setup + Embedding

**วันที่ 21–22: Laravel API**
- [ ] Laravel 11 project สำหรับ backend
- [ ] migration: `users`, `content_sections`, `ai_queries`, `subscriptions`
- [ ] `content_sections.embedding` VECTOR(1536) ด้วย pgvector
- [ ] GitHub OAuth sync ระหว่าง Next.js session → Laravel user

**วันที่ 23–24: Content Embedding Pipeline**
- [ ] `EmbeddingService`: เรียก Claude text-embedding-3-small
- [ ] `EmbedContentJob`: parse MDX → split sections → embed → store
- [ ] GitHub webhook: trigger re-embed เมื่อ content เปลี่ยน (push to main)
- [ ] batch job สำหรับ initial embedding (15 articles × avg 5 sections = 75 vectors)

**วันที่ 25: pgvector Search**
- [ ] ทดสอบ cosine similarity search: "N+1 query" → ค้นเจอ section ที่ถูกต้อง
- [ ] tune LIMIT (top 5) และ similarity threshold
- [ ] index: `USING ivfflat (embedding vector_cosine_ops)`

**Deliverable สัปดาห์ 5:** Content embedding pipeline ทำงาน search เจอ

---

#### สัปดาห์ 6 — Claude Integration + Streaming

**วันที่ 26–27: AiQaService**
- [ ] `AiQaService::streamAnswer()` ตาม design ข้างบน
- [ ] system prompt ภาษาไทย + RAG context injection
- [ ] Laravel streaming response → SSE
- [ ] บันทึก query log: user, question, tokens_used, response_time

**วันที่ 28–29: Next.js AI Chat UI**
- [ ] `AiChat.tsx` component ใช้ Vercel AI SDK `useChat()`
- [ ] floating chat button ทุก docs page
- [ ] streaming response แสดงแบบ real-time
- [ ] source citations: link ไป sections ที่ใช้เป็น context
- [ ] "ถามใหม่" / "clear" button

**วันที่ 30: Rate Limiting + Error Handling**
- [ ] Rate limit: 20 queries/วัน per Pro user (Redis)
- [ ] Usage indicator: "15/20 queries เหลือวันนี้"
- [ ] Error states: API timeout, no relevant content found, rate limited
- [ ] Fallback: ถ้า API ไม่ตอบ → แสดง "ลองใหม่อีกครั้ง"

**Deliverable สัปดาห์ 6:** AI Q&A ทำงาน streaming ได้

---

#### สัปดาห์ 7 — Pro Tier + Billing

**วันที่ 31–32: LemonSqueezy Subscription**
- [ ] สร้าง product + variant: Pro Monthly ฿99, Pro Annual ฿890
- [ ] webhook: `subscription_created` → activate Pro
- [ ] webhook: `subscription_cancelled` → deactivate Pro
- [ ] `/settings/billing` page: plan info, upgrade, cancel

**วันที่ 33–34: Pro Gating**
- [ ] AI Q&A ต้องมี Pro → แสดง upgrade prompt ถ้าไม่มี
- [ ] Premium articles (is_premium: true) → blur + upgrade CTA
- [ ] Private Discord invite link สำหรับ Pro members

**วันที่ 35: Pricing Page**
- [ ] `/pricing`: Free vs Pro feature comparison
- [ ] FAQ: "AI Q&A ตอบจากอะไร?", "ยกเลิกได้ไหม?"
- [ ] Social proof: จำนวน articles, contributors, Pro members

**Deliverable สัปดาห์ 7:** Pro subscription ทำงาน AI Q&A gated

---

#### สัปดาห์ 8 — Content Expansion (+ 35 articles)

**เป้าหมาย:** รวม 50+ articles ก่อน public launch

**วันที่ 36–40: Write/Commission Articles**

Vue.js Section (10 articles):
- [ ] Vue 3 Composition API — setup(), ref, reactive, computed
- [ ] Pinia State Management — ทางเลือกแทน Vuex
- [ ] Inertia.js + Laravel — SPA โดยไม่ต้อง REST API
- [ ] Vue 3 + TypeScript — type-safe components
- [ ] Vue Component Patterns — reusable components
- [ ] Vue Router 4 — navigation, guards, lazy loading
- [ ] Vue Testing ด้วย Vitest + Vue Test Utils
- [ ] Vite configuration สำหรับ Laravel project
- [ ] Vue Composables — reusable logic
- [ ] Error Handling ใน Vue

DevOps Section (10 articles):
- [ ] Docker สำหรับ Laravel — local dev environment
- [ ] Docker Compose — multi-service setup
- [ ] GitHub Actions CI/CD สำหรับ Laravel
- [ ] Azure DevOps Pipeline — build, test, deploy
- [ ] Laravel Forge — deploy ง่ายไม่ต้อง devops expertise
- [ ] Nginx config สำหรับ Laravel
- [ ] MySQL optimization — indexes, explain plan
- [ ] Redis ใน Laravel — cache, session, queue
- [ ] Environment management — .env ที่ปลอดภัย
- [ ] Monitoring Laravel — Telescope, Horizon, Sentry

AI Integration (8 articles):
- [ ] Claude API เบื้องต้น — PHP + streaming
- [ ] LangGraph.js — stateful AI agent
- [ ] pgvector ใน PostgreSQL — semantic search
- [ ] RAG pattern — ทำ AI Q&A จาก documents
- [ ] LINE Bot + AI — Thai language chatbot
- [ ] AI code review — integrate กับ GitHub
- [ ] Embeddings — text similarity, semantic search
- [ ] Prompt engineering สำหรับ Laravel developer

Thai Context เพิ่มเติม (7 articles):
- [ ] SCB Easy App Payment API
- [ ] KBank KPlus API
- [ ] True Money Wallet API
- [ ] NDID digital identity ไทย
- [ ] Thai tax calculation — VAT + WHT ใน Laravel
- [ ] Social Security Thailand API
- [ ] Thai phone number validation + OTP

**Deliverable สัปดาห์ 8:** 50+ articles พร้อม

---

### Phase 4: SEO + Launch (สัปดาห์ 9–10)

#### สัปดาห์ 9 — SEO + Performance

**วันที่ 41–42: SEO Optimization**
- [ ] `generateMetadata()` ทุก page: title, description, OG, Twitter card
- [ ] Structured data (JSON-LD): Article, BreadcrumbList
- [ ] `/sitemap.xml` — ทุก article page
- [ ] `/robots.txt` — allow Googlebot
- [ ] Canonical URLs

**วันที่ 43–44: Performance**
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
- [ ] Next.js `<Image>` สำหรับทุก image (lazy load + WebP)
- [ ] Font optimization: `next/font` สำหรับ Sarabun (Thai font)
- [ ] Code splitting: AI Chat component load แยก (heavy)
- [ ] Lighthouse score > 90 ทุก page

**วันที่ 45: Newsletter Setup**
- [ ] Resend: transactional email
- [ ] Newsletter signup form บน landing page + article footer
- [ ] Welcome email: "ขอบคุณที่สมัคร — articles ใหม่ทุกสัปดาห์"
- [ ] Weekly newsletter: top 3 articles ของสัปดาห์

**Deliverable สัปดาห์ 9:** SEO ready, performance ผ่าน, newsletter พร้อม

---

#### สัปดาห์ 10 — Launch

**วันที่ 46–47: Pre-launch**
- [ ] ตรวจ production environment:
  - [ ] Custom domain + SSL
  - [ ] Algolia DocSearch live (ไม่ใช่ staging)
  - [ ] LemonSqueezy production keys
  - [ ] Plausible production
- [ ] Smoke test ทุก critical path บน production
- [ ] Invite 10–20 beta users จาก network (dev ไทย)

**วันที่ 48–50: Launch**
- [ ] โพสต์ใน Facebook Group: Laravel Thailand, Vue.js Thailand, Dev Thailand
- [ ] โพสต์ใน Twitter/X: thread "ทำไมถึงสร้าง ThaiDevDocs"
- [ ] Dev.to article: "Building a Thai Developer Documentation Platform"
- [ ] LinkedIn announcement
- [ ] ProductHunt submission
- [ ] ส่ง email ถึง newsletter subscribers (early access)

**Deliverable สัปดาห์ 10:** v1.0 public launch 🚀

---

## 8. Content Roadmap (80+ articles)

### Phase 1: Seed Content (Launch — 15 articles)

**Laravel Core**
- [ ] Eloquent Relationships ครบทุก type
- [ ] Eager Loading & N+1 Query Problem
- [ ] Eloquent Scopes (local + global)
- [ ] Query Builder vs Eloquent
- [ ] Eloquent Events & Observers
- [ ] Queue & Jobs
- [ ] Service Container & DI
- [ ] Policies & Gates
- [ ] API Resources
- [ ] Testing ด้วย Pest

**Thai Context**
- [ ] Omise + PromptPay ใน Laravel
- [ ] PDPA compliance
- [ ] LINE Messaging API
- [ ] DBD API
- [ ] Thai date format (Buddhist era)

### Phase 2: V1.0 (เดือน 1–2 — เพิ่มเป็น 50 articles)

**Vue.js (10 articles)**
- [ ] Composition API, Pinia, Inertia.js, TypeScript, Router, Testing, Composables...

**DevOps (10 articles)**
- [ ] Docker, GitHub Actions, Azure DevOps, Forge, Nginx, Redis, MySQL...

**AI Integration (8 articles)**
- [ ] Claude API, LangGraph, pgvector, RAG, LINE Bot + AI...

**Thai Context เพิ่มเติม (7 articles)**
- [ ] SCB, KBank, True Money, NDID, Thai tax, Thai phone OTP...

### Phase 3: Community-driven Growth (เดือน 3+)

**รับ PR จาก community:**
- [ ] Laravel Testing ขั้นสูง (feature tests, mocking)
- [ ] Livewire + Alpine.js
- [ ] Laravel Octane + Swoole
- [ ] Microservices กับ Laravel
- [ ] GraphQL ใน Laravel
- [ ] Performance optimization ขั้นสูง

**Premium Content (Pro only):**
- [ ] สร้าง SaaS ด้วย Laravel — full guide
- [ ] Production deployment checklist ฉบับสมบูรณ์
- [ ] Security hardening ใน Laravel
- [ ] Database design สำหรับ Thai business

### Content Quality Metrics

| Metric | Target |
|---|---|
| Articles ตอน launch | 15+ |
| Articles เดือนที่ 3 | 50+ |
| Articles ปีแรก | 100+ |
| Average reading time | 8–15 นาที |
| Articles verified ใน 6 เดือน | > 90% |
| Community PR ต่อเดือน (เดือน 3+) | 5+ |

---

## 9. Monetization & Pricing

### Revenue Streams

| Stream | ราคา | เริ่มเมื่อ |
|---|---|---|
| Pro subscription | ฿99/เดือน หรือ ฿890/ปี | Phase 3 |
| Sponsor sidebar | ฿3,000–฿15,000/เดือน | เดือน 3+ |
| Sponsored article | ฿5,000–฿15,000 ต่อ article | เดือน 4+ |
| Job board | ฿500–฿2,000 ต่อ posting | ปีที่ 2 |
| Workshop/bootcamp | ฿990–฿2,990 ต่อคน | ปีที่ 2 |

### Unit Economics

```
Pro user:
  Revenue:               ฿99/เดือน
  Claude API cost:       ~฿6/เดือน   (avg 10 queries × ฿0.60)
  LemonSqueezy fee:      ~฿3/เดือน
  Net per Pro user:      ~฿90/เดือน  (91% margin)

Infra cost (คงที่):
  Vercel Pro:            $20/เดือน (~฿730)
  Laravel API (Forge):   ฿440/เดือน
  PostgreSQL (Supabase): $25/เดือน (~฿912)
  Plausible Analytics:   $9/เดือน (~฿328)
  Resend email:          $0 (ถึง 3,000 emails/เดือน)
  Total infra:           ~฿2,410/เดือน

Break-even:              ~27 Pro users → MRR ฿2,673 > infra ฿2,410
```

### Revenue Projection (ปีแรก)

| เดือน | MAU | Pro | Sponsors | MRR | ARR rate |
|---|---|---|---|---|---|
| 1–2 | 500 | 20 | 0 | ฿1,980 | ฿23,760 |
| 3–4 | 2,000 | 80 | 1 | ฿14,920 | ฿178,920 |
| 5–6 | 5,000 | 200 | 2 | ฿34,800 | ฿417,600 |
| 7–9 | 10,000 | 400 | 3 | ฿59,600 | ฿715,200 |
| 10–12 | 20,000 | 700 | 4 | ฿101,300 | ฿1,215,600 |

> ARR เป้าหมายสิ้นปีแรก: **~฿800,000–฿1,200,000**

---

## 10. Go-to-Market Strategy

### Phase 0: Pre-launch Content (ก่อน launch 2 สัปดาห์)
- เขียน 15 seed articles ให้เสร็จก่อน announce
- share article draft ให้ dev ไทยที่รู้จัก review ก่อน
- ตั้ง GitHub repo ให้ public ตั้งแต่วันแรก

### Distribution Channels

| Channel | Target | Timing | Expected |
|---|---|---|---|
| Facebook: Laravel/Vue Thailand Group | Thai dev | Launch day | 200–500 signups |
| Twitter/X Thread | Global Thai dev | Launch day | organic |
| Dev.to Article | Global | Week 1 | 50–100 signups |
| Laravel News submission | Global Laravel community | Week 1 | 100–300 signups |
| Google SEO (Thai keywords) | Organic | Month 2+ | compound |
| YouTube channel (TH) | Thai dev | Month 3+ | 50+ signups/video |
| Newsletter → weekly articles | Retention | Month 1+ | compounds |

### SEO Strategy

```
Primary keywords (ปริมาณ + competition ต่ำ):
  "laravel eloquent ภาษาไทย"
  "vue 3 composition api ไทย"
  "docker laravel ภาษาไทย"
  "queue laravel คืออะไร"

Long-tail keywords (conversion สูง):
  "วิธีทำ payment ด้วย omise ใน laravel"
  "laravel n+1 query แก้ยังไง"
  "inertia.js กับ vue 3 ใช้ยังไง"

Content strategy:
  - เขียน 1 article/สัปดาห์ (maintain mode)
  - แต่ละ article target 1–2 keywords
  - Internal linking ระหว่าง related articles
```

### Positioning Statement
> "ThaiDevDocs — docs ภาษาไทยเดียวที่อธิบาย Laravel, Vue.js และ DevOps ด้วยตัวอย่าง context ไทย พร้อม AI ที่ตอบคำถามเป็นภาษาไทยจาก docs จริง"

---

## 11. Risk Assessment

### ความเสี่ยงสูง

**Content quality ต่ำ → ไม่มีใครกลับมา**
- ปัญหา: article ที่เขียนเร็วหรือ outdated ทำให้ trust พัง
- แนวทาง:
  - ทำ 15 articles ที่ดีจริงก่อน launch ไม่รีบ quantity
  - Version badge + verified_at ทุก article
  - "Report error" button ให้ community แจ้งได้เร็ว
  - ตั้ง editorial standard ชัดเจนใน CONTRIBUTING.md

**Content maintenance burden**
- ปัญหา: Laravel ออก version ใหม่ทุกปี articles ต้องอัปเดต
- แนวทาง:
  - GitHub Actions flag articles เกิน 6 เดือน
  - Community contributor ช่วย maintain
  - Focus content ที่เป็น timeless (concepts) มากกว่า version-specific

### ความเสี่ยงกลาง

**Pro conversion ต่ำ**
- แนวทาง: AI Q&A ต้องดีพอ — ทดสอบกับ beta users ก่อน gating
- Premium articles ต้องเป็น deep dives จริงๆ ที่หาจากที่อื่นไม่ได้

**SEO ใช้เวลา**
- Google ใช้เวลา 3–6 เดือนก่อน index อย่างจริงจัง
- แนวทาง: ใช้ community channels เป็น traffic หลักใน 3 เดือนแรก

### ความเสี่ยงต่ำ

**Competition**
- ไม่มี Thai-language dev docs ที่ focus Laravel/Vue อยู่ตอนนี้ — first mover advantage ชัดเจน

**Algolia DocSearch ไม่อนุมัติ**
- Fallback: Orama (self-hosted, open-source) มี Thai tokenizer รองรับ

---

## 12. Definition of Done

### MVP Launch Checklist

**Platform**
- [ ] docs pages SSG load < 1 วินาที (Vercel Edge)
- [ ] Algolia search ทำงาน (หรือ Orama fallback)
- [ ] Dark mode ทำงานถูกต้อง
- [ ] Mobile responsive (375px+)
- [ ] GitHub OAuth login ทำงาน
- [ ] Giscus comments ทำงาน
- [ ] "Edit on GitHub" button ทุก article

**Content**
- [ ] 15+ articles ก่อน launch ทุก article มี frontmatter ครบ
- [ ] ทุก code block ทดสอบแล้ว (runnable จริง)
- [ ] ทุก article มี `laravel_version` หรือ `vue_version`
- [ ] Thai Context section อย่างน้อย 5 articles

**AI Q&A**
- [ ] ถามภาษาไทย → ได้คำตอบที่ถูกต้องจาก docs context
- [ ] streaming response แสดงแบบ real-time
- [ ] rate limit 20 queries/วัน ทำงานถูกต้อง
- [ ] source citations แสดง link ไปยัง article

**Business**
- [ ] Pro subscription ฿99/เดือน ทำงาน
- [ ] AI Q&A gated สำหรับ Pro only
- [ ] Plausible analytics บันทึก events ถูกต้อง
- [ ] Newsletter signup ทำงาน

---

## หมายเหตุสำหรับ Developer

### Environment Variables

```bash
# Next.js (.env.local)
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
NEXT_PUBLIC_GISCUS_REPO=thaidevdocs/thaidevdocs
NEXT_PUBLIC_GISCUS_REPO_ID=
NEXT_PUBLIC_GISCUS_CATEGORY_ID=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=thaidevdocs.com

NEXTAUTH_SECRET=
NEXTAUTH_URL=https://thaidevdocs.com
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

API_URL=https://api.thaidevdocs.com
LEMON_SQUEEZY_STORE_ID=

# Laravel API (.env)
APP_URL=https://api.thaidevdocs.com

DB_CONNECTION=pgsql
DB_DATABASE=thaidevdocs

REDIS_HOST=redis

ANTHROPIC_API_KEY=
GITHUB_WEBHOOK_SECRET=         # สำหรับ content update trigger

LEMON_SQUEEZY_API_KEY=
LEMON_SQUEEZY_WEBHOOK_SECRET=
```

### Key Design Decisions

| Decision | ทางเลือก | เหตุผล |
|---|---|---|
| Fumadocs แทน Docusaurus | Docusaurus, Nextra | Next.js native, TypeScript first, ปรับแต่งได้มากกว่า |
| MDX ใน GitHub repo | CMS (Contentful, Sanity) | Community contribute ผ่าน PR ได้ง่ายกว่า, version control ชัดเจน |
| Giscus แทน custom comments | Custom, Disqus | ฟรี, ไม่มี infra, login ด้วย GitHub account ที่มีอยู่แล้ว |
| Algolia DocSearch | Meilisearch, Orama | ฟรีสำหรับ open-source, DX ดีที่สุด, Thai tokenizer รองรับ |
| Plausible แทน Google Analytics | GA4 | Privacy-first, ไม่ต้องมี cookie banner, ข้อมูลไม่ไปอยู่ที่ Google |
| pgvector แทน Pinecone | Pinecone, Weaviate | อยู่ใน PostgreSQL เดียวกัน ไม่มี external service cost |
| LemonSqueezy แทน Stripe | Stripe | Merchant of record — จัดการ VAT ไทยให้อัตโนมัติ |

### Content Writing Guidelines (Quick Reference)

```
✅ ทำ:
  - อธิบาย concept ก่อน code เสมอ
  - มี ❌ bad example + ✅ good example ทุกหัวข้อ
  - ใช้ตัวอย่าง context ไทย (ชื่อไทย, บาท, PromptPay)
  - ระบุ version ที่ test แล้ว
  - เพิ่ม Note/Warning/Tip ที่เกี่ยวข้อง

❌ อย่า:
  - copy จาก official docs แล้วแปล — ต้อง re-explain ด้วยภาษาของตัวเอง
  - ใช้ code ที่ยังไม่ได้ test
  - เขียน article ที่ยาวเกินไปโดยไม่มี practical example
  - ลืม update verified_at เมื่อ update content
```

---

*review เอกสารนี้ทุก 2 สัปดาห์ อัปเดต content roadmap checkboxes และ metrics tracking*
