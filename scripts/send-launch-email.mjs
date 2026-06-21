#!/usr/bin/env node

/**
 * Send beta invite or launch announcement emails.
 *
 * Beta invite:
 *   CRON_SECRET=xxx node scripts/send-launch-email.mjs beta user@example.com
 *
 * Launch announcement to all subscribers:
 *   CRON_SECRET=xxx node scripts/send-launch-email.mjs launch
 */

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const secret = process.env.CRON_SECRET;
const [action, email] = process.argv.slice(2);

if (!secret) {
  console.error('CRON_SECRET is required');
  process.exit(1);
}

if (!action || !['beta', 'launch'].includes(action)) {
  console.error('Usage: node scripts/send-launch-email.mjs beta <email>');
  console.error('       node scripts/send-launch-email.mjs launch');
  process.exit(1);
}

const body =
  action === 'beta'
    ? { action: 'beta-invite', email }
    : { action: 'launch-announcement' };

if (action === 'beta' && !email) {
  console.error('Email is required for beta invites');
  process.exit(1);
}

const response = await fetch(`${baseUrl}/api/newsletter/launch`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${secret}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

const data = await response.json();

if (!response.ok) {
  console.error('Failed:', data);
  process.exit(1);
}

console.log(JSON.stringify(data, null, 2));
