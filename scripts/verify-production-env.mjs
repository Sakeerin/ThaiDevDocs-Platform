#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';

const required = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'ANTHROPIC_API_KEY',
  'NEXT_PUBLIC_PLAUSIBLE_DOMAIN',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'CRON_SECRET',
  'NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_MONTHLY',
  'NEXT_PUBLIC_GISCUS_REPO_ID',
  'NEXT_PUBLIC_GISCUS_CATEGORY_ID',
];

const recommended = [
  'NEXT_PUBLIC_ALGOLIA_APP_ID',
  'NEXT_PUBLIC_ALGOLIA_SEARCH_KEY',
  'LEMON_SQUEEZY_WEBHOOK_SECRET',
  'API_URL',
  'API_SYNC_SECRET',
];

function loadEnvFile(path) {
  try {
    if (!existsSync(path)) return;
    const content = readFileSync(path, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const index = trimmed.indexOf('=');
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // optional local env file
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env.production.local');

const missingRequired = required.filter((key) => !process.env[key]);
const missingRecommended = recommended.filter((key) => !process.env[key]);

console.log('Production environment verification\n');

if (missingRequired.length === 0) {
  console.log('Required variables: OK');
} else {
  console.log('Missing required variables:');
  for (const key of missingRequired) {
    console.log(`  - ${key}`);
  }
}

if (missingRecommended.length > 0) {
  console.log('\nMissing recommended variables:');
  for (const key of missingRecommended) {
    console.log(`  - ${key}`);
  }
}

console.log('\nManual checks before launch:');
console.log('  - Custom domain + SSL configured on Vercel');
console.log('  - Algolia DocSearch approved for production (or Orama fallback verified)');
console.log('  - LemonSqueezy checkout tested end-to-end');
console.log('  - GitHub OAuth callback URL includes production domain');
console.log('  - Run: SMOKE_TEST_URL=https://your-domain npm run smoke:test');
console.log('  - Run: SMOKE_TEST_URL=https://your-domain npm run lighthouse:audit');

if (missingRequired.length > 0) {
  process.exit(1);
}
