# Sponsor Onboarding Runbook

Internal guide for processing sponsor inquiries from `/sponsor`.

## Flow overview

1. Sponsor submits form at `/sponsor` → stored in `.data/sponsor-inquiries.json`
2. Resend sends:
   - Notification to `SPONSOR_INQUIRY_NOTIFY_EMAIL` (fallback: `NEXT_PUBLIC_SPONSOR_CONTACT_EMAIL`)
   - Auto-reply to sponsor with next steps
3. Maintainer reviews → quote → payment → add to `data/sponsors.json` → deploy

## List pending inquiries

```bash
npm run sponsor:inquiries
npm run sponsor:inquiries -- --status=pending
```

## Approve a sponsor (go live)

1. Receive payment (invoice/transfer — record externally)
2. Collect assets:
   - Logo SVG or PNG (min 128×128)
   - Tagline (max 80 characters)
   - Landing URL (HTTPS)
   - Tier: `gold` | `silver` | `bronze`
3. Add entry to `data/sponsors.json`:

```json
{
  "id": "acme-dev-tools",
  "name": "Acme Dev Tools",
  "tagline": "Deploy Laravel เร็วขึ้น สำหรับทีมไทย",
  "url": "https://acme.example.com",
  "tier": "gold",
  "logoUrl": "https://acme.example.com/logo.png",
  "active": true
}
```

4. Commit + push → Vercel deploy
5. Email sponsor: live link + Plausible click report schedule
6. Mark inquiry status (manual in `.data/sponsor-inquiries.json` or via script):

```bash
node scripts/list-sponsor-inquiries.mjs --update=<inquiry-id> --status=active
```

## Creative guidelines

| Field | Limit |
|---|---|
| Tagline | 80 characters |
| Logo | SVG preferred; PNG min 128px; transparent background |
| URL | HTTPS landing page; no affiliate redirects |

## Pricing reference

| Package | Price | Includes |
|---|---|---|
| Sidebar | ฿3,000–5,000/mo | 1 sidebar slot |
| Featured | ฿8,000–15,000/mo | Gold slot + homepage + newsletter/quarter |

## Environment

```bash
NEXT_PUBLIC_SPONSORS_ENABLED=true
NEXT_PUBLIC_SPONSOR_CONTACT_EMAIL=sponsors@thaidevdocs.com
SPONSOR_INQUIRY_NOTIFY_EMAIL=sponsors@thaidevdocs.com
RESEND_API_KEY=...
RESEND_FROM_EMAIL=ThaiDevDocs <newsletter@thaidevdocs.com>
```

Without Resend, inquiries are still saved locally — check `.data/sponsor-inquiries.json`.

## Disable sponsors

Set `NEXT_PUBLIC_SPONSORS_ENABLED=false` to hide sidebar slots site-wide.
