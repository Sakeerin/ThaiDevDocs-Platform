#!/usr/bin/env node

const baseUrl = process.env.SMOKE_TEST_URL ?? 'http://localhost:3000';

const routes = [
  '/',
  '/docs',
  '/docs/laravel/eager-loading',
  '/pricing',
  '/contribute',
  '/login',
  '/sitemap.xml',
  '/robots.txt',
  '/og/default',
  '/llms.txt',
];

async function checkRoute(path) {
  const url = `${baseUrl.replace(/\/$/, '')}${path}`;
  const response = await fetch(url, { redirect: 'follow' });

  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }

  return { path, status: response.status };
}

async function main() {
  console.log(`Smoke testing ${baseUrl}\n`);

  const results = [];

  for (const route of routes) {
    try {
      const result = await checkRoute(route);
      results.push(result);
      console.log(`✓ ${route} (${result.status})`);
    } catch (error) {
      console.error(`✗ ${route}: ${error instanceof Error ? error.message : error}`);
      process.exitCode = 1;
    }
  }

  if (process.exitCode) {
    console.error('\nSmoke test failed.');
    return;
  }

  console.log(`\nAll ${results.length} routes passed.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
