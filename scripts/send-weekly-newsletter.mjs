#!/usr/bin/env node

/**
 * Send weekly newsletter to all subscribers.
 * Requires RESEND_API_KEY, RESEND_FROM_EMAIL, and CRON_SECRET.
 *
 * Usage:
 *   CRON_SECRET=xxx node scripts/send-weekly-newsletter.mjs
 *   curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://thaidevdocs.com/api/newsletter/weekly
 */

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const secret = process.env.CRON_SECRET;

if (!secret) {
  console.error('CRON_SECRET is required');
  process.exit(1);
}

const response = await fetch(`${baseUrl}/api/newsletter/weekly`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${secret}`,
  },
});

const data = await response.json();

if (!response.ok) {
  console.error('Failed:', data);
  process.exit(1);
}

console.log(JSON.stringify(data, null, 2));
