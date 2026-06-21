#!/usr/bin/env node

import { readFileSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';

const baseUrl = process.env.SMOKE_TEST_URL ?? 'http://localhost:3000';
const outputDir = process.env.LIGHTHOUSE_OUTPUT_DIR ?? '.lighthouse';
const minScore = Number(process.env.LIGHTHOUSE_MIN_SCORE ?? 90);

const pages = ['/', '/docs', '/docs/laravel/eager-loading', '/pricing', '/contribute'];

function runLighthouse(url, outputPath) {
  return new Promise((resolve, reject) => {
    const args = [
      url,
      '--quiet',
      '--chrome-flags=--headless',
      `--output=json`,
      `--output-path=${outputPath}`,
      '--only-categories=performance,accessibility,best-practices,seo',
    ];

    const child = spawn('npx', ['lighthouse', ...args], {
      stdio: 'inherit',
      shell: true,
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve(undefined);
      else reject(new Error(`lighthouse exited with code ${code}`));
    });
  });
}

async function main() {
  console.log(`Lighthouse audit for ${baseUrl}`);
  console.log(`Minimum score target: ${minScore}\n`);

  if (!existsSync(outputDir)) {
    await import('node:fs/promises').then((fs) => fs.mkdir(outputDir, { recursive: true }));
  }

  let failed = false;

  for (const page of pages) {
    const url = `${baseUrl.replace(/\/$/, '')}${page}`;
    const slug = page === '/' ? 'home' : page.replace(/\//g, '_').replace(/^_/, '');
    const outputPath = path.join(outputDir, `${slug}.json`);

    try {
      await runLighthouse(url, outputPath);
      const report = JSON.parse(await import('node:fs/promises').then((fs) => fs.readFile(outputPath, 'utf8')));
      const scores = {
        performance: Math.round((report.categories.performance?.score ?? 0) * 100),
        accessibility: Math.round((report.categories.accessibility?.score ?? 0) * 100),
        bestPractices: Math.round((report.categories['best-practices']?.score ?? 0) * 100),
        seo: Math.round((report.categories.seo?.score ?? 0) * 100),
      };

      console.log(`${page}`);
      console.log(
        `  performance=${scores.performance} accessibility=${scores.accessibility} best-practices=${scores.bestPractices} seo=${scores.seo}`,
      );

      for (const [category, score] of Object.entries(scores)) {
        if (score < minScore) {
          failed = true;
          console.log(`  ✗ ${category} below target (${score} < ${minScore})`);
        }
      }
    } catch (error) {
      failed = true;
      console.error(`✗ ${page}: ${error instanceof Error ? error.message : error}`);
    }
  }

  if (failed) {
    console.error('\nLighthouse audit did not meet the target.');
    process.exit(1);
  }

  console.log('\nLighthouse audit passed for all audited pages.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
