#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), 'content/docs');

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

function fixBareOpeningFences(content) {
  const lines = content.split('\n');
  let inCodeBlock = false;
  let changed = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed.startsWith('```')) {
      continue;
    }

    const language = trimmed.slice(3).trim();

    if (!inCodeBlock) {
      if (!language) {
        lines[index] = line.replace('```', '```text');
        changed += 1;
      }
      inCodeBlock = true;
      continue;
    }

    if (trimmed === '```' || trimmed.startsWith('```')) {
      inCodeBlock = false;
    }
  }

  return { content: lines.join('\n'), changed };
}

async function main() {
  const files = await collectMdxFiles(CONTENT_DIR);
  let totalChanges = 0;

  for (const filePath of files) {
    const original = await readFile(filePath, 'utf8');
    const { content, changed } = fixBareOpeningFences(original);

    if (changed > 0) {
      await writeFile(filePath, content, 'utf8');
      totalChanges += changed;
      console.log(`${path.relative(process.cwd(), filePath)}: fixed ${changed} bare fence(s)`);
    }
  }

  console.log(`\nFixed ${totalChanges} bare opening code fence(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
