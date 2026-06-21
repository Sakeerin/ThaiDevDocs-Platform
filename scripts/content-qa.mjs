#!/usr/bin/env node

import { readdir, readFile, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), 'content/docs');
const SKIP_ARTICLE_CHECKS = new Set(['content/docs/index.mdx', 'content/docs/test.mdx']);

const VALID_LANGUAGES = new Set([
  'bash',
  'sh',
  'shell',
  'php',
  'javascript',
  'js',
  'typescript',
  'ts',
  'vue',
  'html',
  'css',
  'json',
  'jsonc',
  'yaml',
  'yml',
  'sql',
  'ini',
  'conf',
  'nginx',
  'dockerfile',
  'docker',
  'env',
  'dotenv',
  'markdown',
  'md',
  'text',
  'txt',
  'powershell',
  'ps1',
  'xml',
  'graphql',
  'mermaid',
  'blade',
]);

const args = new Set(process.argv.slice(2));
const strict = args.has('--strict');
const checkPhp = args.has('--php');

/** @type {Array<{ level: 'error' | 'warning' | 'info', file: string, message: string }>} */
const findings = [];

function relative(filePath) {
  return path.relative(process.cwd(), filePath).replace(/\\/g, '/');
}

function report(level, filePath, message) {
  findings.push({ level, file: relative(filePath), message });
}

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

function fileToDocUrl(filePath) {
  const rel = path.relative(CONTENT_DIR, filePath).replace(/\\/g, '/').replace(/\.mdx$/, '');

  if (rel === 'index') {
    return '/docs';
  }

  if (rel.endsWith('/index')) {
    return `/docs/${rel.slice(0, -'/index'.length)}`;
  }

  return `/docs/${rel}`;
}

function stripFrontmatter(content) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
}

function extractCodeBlocks(body) {
  const blocks = [];
  const regex = /(^|\n)(```+)([^\n]*)\n([\s\S]*?)\n\2(?=\n|$)/g;

  for (const match of body.matchAll(regex)) {
    const info = match[3].trim();
    const code = match[4];
    const line = body.slice(0, match.index).split('\n').length + (match[1] ? 1 : 0);

    blocks.push({
      language: info.split(/\s+/)[0]?.toLowerCase() ?? '',
      info,
      code,
      line,
    });
  }

  return blocks;
}

function extractInternalLinks(body) {
  const links = [];

  for (const match of body.matchAll(/\]\((\/docs\/[^)#]+)\)/g)) {
    const line = body.slice(0, match.index).split('\n').length;
    links.push({ href: match[1], line });
  }

  return links;
}

function shouldSkipArticleChecks(filePath) {
  const rel = relative(filePath);
  return SKIP_ARTICLE_CHECKS.has(rel) || rel.endsWith('/index.mdx');
}

function hasPhpBinary() {
  return spawnSync('php', ['-v'], { encoding: 'utf8' }).status === 0;
}

async function lintPhpBlock(code, tempDir, index) {
  const trimmed = code.trim();
  if (!trimmed) return null;

  const wrapped = trimmed.startsWith('<?php') ? trimmed : `<?php\n${trimmed}\n`;
  const tempFile = path.join(tempDir, `snippet-${index}.php`);
  await writeFile(tempFile, wrapped, 'utf8');

  const result = spawnSync('php', ['-l', tempFile], { encoding: 'utf8' });
  if (result.status === 0) return null;

  return (result.stderr || result.stdout || 'invalid PHP syntax').trim();
}

function validateJsonBlock(code) {
  if (/\/\/|\/\*/.test(code)) {
    return 'JSON block contains comments — use ```typescript, ```jsonc, or ```text instead';
  }

  try {
    JSON.parse(code);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : 'invalid JSON';
  }
}

function auditArticle(filePath, content, docUrls) {
  const body = stripFrontmatter(content);
  const blocks = extractCodeBlocks(body);
  const links = extractInternalLinks(body);
  const skipArticleChecks = shouldSkipArticleChecks(filePath);

  if (!skipArticleChecks && blocks.length === 0) {
    report('warning', filePath, 'article has no code blocks');
  }

  for (const block of blocks) {
    const location = `line ${block.line}`;

    if (!block.info) {
      report(
        strict ? 'error' : 'warning',
        filePath,
        `${location}: code block missing language tag (use \`\`\`php, \`\`\`text, etc.)`,
      );
      continue;
    }

    if (!VALID_LANGUAGES.has(block.language)) {
      report(
        'warning',
        filePath,
        `${location}: uncommon language "${block.language}" — verify highlighting manually`,
      );
    }

    if (!block.code.trim()) {
      report('error', filePath, `${location}: empty code block`);
    }

    if (block.language === 'json') {
      const error = validateJsonBlock(block.code);
      if (error) {
        report(strict ? 'error' : 'warning', filePath, `${location}: ${error}`);
      }
    }
  }

  for (const link of links) {
    const normalized = link.href.replace(/\/$/, '');
    if (!docUrls.has(normalized)) {
      report('error', filePath, `line ${link.line}: broken internal link "${link.href}"`);
    }
  }

  if (!skipArticleChecks) {
    const proseWords = body
      .replace(/```[\s\S]*?```/g, ' ')
      .split(/\s+/)
      .filter(Boolean).length;
    const codeWords = blocks
      .flatMap((block) => block.code.split(/\s+/))
      .filter(Boolean).length;

    if (proseWords < 120 && codeWords < 120 && blocks.length < 4) {
      report(
        'warning',
        filePath,
        `article is short (${proseWords} prose words) — target 8–15 min reading time`,
      );
    }
  }
}

async function auditPhpBlocks(files, phpAvailable, tempDir) {
  if (!checkPhp) {
    return;
  }

  if (!phpAvailable) {
    report('info', CONTENT_DIR, 'PHP binary not found — skipping PHP syntax checks');
    return;
  }

  let index = 0;

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf8');
    const blocks = extractCodeBlocks(stripFrontmatter(content)).filter((block) => block.language === 'php');

    for (const block of blocks) {
      index += 1;
      const error = await lintPhpBlock(block.code, tempDir, index);

      if (error) {
        report(
          strict ? 'error' : 'warning',
          filePath,
          `line ${block.line}: PHP syntax check failed — ${error.split('\n')[0]}`,
        );
      }
    }
  }
}

function printFindings() {
  for (const level of ['error', 'warning', 'info']) {
    const items = findings.filter((item) => item.level === level);
    if (items.length === 0) continue;

    console.log(`\n${level.toUpperCase()} (${items.length})`);
    for (const item of items) {
      console.log(`- ${item.file}: ${item.message}`);
    }
  }
}

async function main() {
  const files = await collectMdxFiles(CONTENT_DIR);
  const docUrls = new Set(files.map((filePath) => fileToDocUrl(filePath)));
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'thaidevdocs-qa-'));

  try {
    for (const filePath of files) {
      const content = await readFile(filePath, 'utf8');
      auditArticle(filePath, content, docUrls);
    }

    await auditPhpBlocks(files, hasPhpBinary(), tempDir);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }

  printFindings();

  const errors = findings.filter((item) => item.level === 'error').length;
  const warnings = findings.filter((item) => item.level === 'warning').length;

  console.log(`\nChecked ${files.length} MDX files — ${errors} error(s), ${warnings} warning(s).`);
  console.log('Tip: use --strict to fail on warnings, --php to lint PHP snippets.');

  if (errors > 0 || (strict && warnings > 0)) {
    process.exit(1);
  }

  console.log('Content QA passed.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
