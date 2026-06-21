import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), 'content/docs');
const STALE_MONTHS = 6;

async function collectMdxFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectMdxFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

function parseVerifiedAt(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!match) {
    return null;
  }

  const verifiedLine = match[1]
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('verified_at:'));

  if (!verifiedLine) {
    return null;
  }

  return verifiedLine.split(':').slice(1).join(':').trim().replace(/^["']|["']$/g, '');
}

function isStale(verifiedAt) {
  const verifiedDate = new Date(verifiedAt);

  if (Number.isNaN(verifiedDate.getTime())) {
    return false;
  }

  const threshold = new Date();
  threshold.setMonth(threshold.getMonth() - STALE_MONTHS);

  return verifiedDate < threshold;
}

async function main() {
  const files = await collectMdxFiles(CONTENT_DIR);
  const staleArticles = [];

  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const verifiedAt = parseVerifiedAt(content);
    const relativePath = path.relative(process.cwd(), file);

    if (verifiedAt && isStale(verifiedAt)) {
      staleArticles.push({ file: relativePath, verifiedAt });
    }
  }

  if (staleArticles.length === 0) {
    console.log('No stale articles found.');
    return;
  }

  console.log(`Found ${staleArticles.length} stale article(s) (verified_at > ${STALE_MONTHS} months):\n`);

  for (const article of staleArticles) {
    console.log(`- ${article.file} (verified_at: ${article.verifiedAt})`);
  }

  if (process.env.FAIL_ON_STALE === 'true') {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
