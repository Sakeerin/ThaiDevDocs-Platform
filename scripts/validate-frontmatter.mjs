import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), 'content/docs');
const REQUIRED_FIELDS = [
  'title',
  'description',
  'topic',
  'subtopic',
  'difficulty',
  'verified_at',
  'author',
];
const VALID_TOPICS = new Set(['laravel', 'vue', 'devops', 'ai', 'thai-context']);
const VALID_DIFFICULTIES = new Set(['beginner', 'intermediate', 'advanced']);

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

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!match) {
    return null;
  }

  const frontmatter = {};

  for (const line of match[1].split('\n')) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf(':');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    frontmatter[key] = value;
  }

  return frontmatter;
}

function validateFile(filePath, frontmatter) {
  const errors = [];
  const relativePath = path.relative(process.cwd(), filePath);

  if (!frontmatter) {
    errors.push('missing frontmatter block');
    return errors;
  }

  for (const field of REQUIRED_FIELDS) {
    if (!frontmatter[field]) {
      errors.push(`missing required field "${field}"`);
    }
  }

  if (frontmatter.topic && !VALID_TOPICS.has(frontmatter.topic)) {
    errors.push(`invalid topic "${frontmatter.topic}"`);
  }

  if (frontmatter.difficulty && !VALID_DIFFICULTIES.has(frontmatter.difficulty)) {
    errors.push(`invalid difficulty "${frontmatter.difficulty}"`);
  }

  if (frontmatter.verified_at && Number.isNaN(Date.parse(frontmatter.verified_at))) {
    errors.push(`invalid verified_at "${frontmatter.verified_at}"`);
  }

  if (frontmatter.topic === 'laravel' && !frontmatter.laravel_version) {
    errors.push('missing laravel_version for laravel topic');
  }

  if (frontmatter.topic === 'vue' && !frontmatter.vue_version) {
    errors.push('missing vue_version for vue topic');
  }

  if (errors.length > 0) {
    return errors.map((error) => `${relativePath}: ${error}`);
  }

  return [];
}

async function main() {
  const files = await collectMdxFiles(CONTENT_DIR);
  const allErrors = [];

  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const frontmatter = parseFrontmatter(content);
    allErrors.push(...validateFile(file, frontmatter));
  }

  if (allErrors.length > 0) {
    console.error('Frontmatter validation failed:\n');
    console.error(allErrors.join('\n'));
    process.exit(1);
  }

  console.log(`Validated ${files.length} MDX files successfully.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
