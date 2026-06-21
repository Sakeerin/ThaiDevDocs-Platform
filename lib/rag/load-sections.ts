import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { RagSection } from '@/lib/rag/types';
import { docsRoute, contentDocsPath } from '@/lib/shared';

const CONTENT_DIR = path.join(/* turbopackIgnore: true */ process.cwd(), contentDocsPath);

function slugFromFile(relativePath: string) {
  return relativePath.replace(/\.mdx$/, '').replace(/\\/g, '/');
}

function urlFromSlug(slug: string) {
  return slug === 'index' ? docsRoute : `${docsRoute}/${slug}`;
}

function parseFrontmatterField(content: string, field: string) {
  const match = content.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  if (!match) return undefined;
  return match[1].trim().replace(/^["']|["']$/g, '');
}

function splitSections(body: string, slug: string, title: string, topic: string, url: string): RagSection[] {
  const lines = body.split('\n');
  const sections: RagSection[] = [];
  let currentHeading = title;
  let buffer: string[] = [];

  function flush(sectionIndex: number) {
    const text = buffer.join('\n').trim();
    if (!text) return;

    sections.push({
      id: `${slug}#${sectionIndex}`,
      slug,
      title,
      heading: currentHeading,
      content: text,
      topic,
      url,
    });
  }

  let sectionIndex = 0;
  for (const line of lines) {
    const headingMatch = line.match(/^##+\s+(.+)$/);
    if (headingMatch) {
      flush(sectionIndex);
      sectionIndex += 1;
      currentHeading = headingMatch[1].trim();
      buffer = [line];
      continue;
    }

    buffer.push(line);
  }

  flush(sectionIndex);

  if (sections.length === 0) {
    sections.push({
      id: `${slug}#0`,
      slug,
      title,
      heading: title,
      content: body.trim(),
      topic,
      url,
    });
  }

  return sections;
}

async function collectMdxFiles(dir: string, prefix = ''): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      files.push(...(await collectMdxFiles(path.join(dir, entry.name), relative)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.push(relative);
    }
  }

  return files;
}

let cachedSections: RagSection[] | null = null;

export async function loadRagSections(force = false): Promise<RagSection[]> {
  if (cachedSections && !force) {
    return cachedSections;
  }

  const files = await collectMdxFiles(CONTENT_DIR);
  const sections: RagSection[] = [];

  for (const file of files) {
    const raw = await readFile(path.join(CONTENT_DIR, file), 'utf8');
    const frontmatterMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!frontmatterMatch) continue;

    const frontmatter = frontmatterMatch[1];
    const body = frontmatterMatch[2];
    const slug = slugFromFile(file);
    const title = parseFrontmatterField(frontmatter, 'title') ?? slug;
    const topic = parseFrontmatterField(frontmatter, 'topic') ?? 'general';

    sections.push(...splitSections(body, slug, title, topic, urlFromSlug(slug)));
  }

  cachedSections = sections;
  return sections;
}

export function buildRagContext(results: Array<{ heading: string; content: string; url: string; title: string }>) {
  return results
    .map(
      (section) =>
        `### ${section.title} — ${section.heading}\nURL: ${section.url}\n\n${section.content}`,
    )
    .join('\n\n---\n\n');
}
