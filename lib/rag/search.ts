import type { RagSearchResult } from '@/lib/rag/types';
import { loadRagSections } from '@/lib/rag/load-sections';

const THAI_STOP_WORDS = new Set(['ใน', 'ของ', 'และ', 'กับ', 'ที่', 'เป็น', 'ไม่', 'มี', 'ได้', '如何', 'the', 'a', 'an', 'is', 'to', 'how', 'what']);

function tokenize(text: string) {
  return text
   .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length > 1 && !THAI_STOP_WORDS.has(token));
}

function scoreSection(questionTokens: string[], sectionText: string, articleSlug?: string, slug?: string) {
  const haystack = sectionText.toLowerCase();
  let score = 0;

  for (const token of questionTokens) {
    if (haystack.includes(token)) {
      score += 2;
    }
  }

  if (articleSlug && slug && slug.includes(articleSlug.replace(/^\/docs\/?/, ''))) {
    score += 5;
  }

  return score;
}

export async function searchRagSections(
  question: string,
  options: { limit?: number; articleSlug?: string } = {},
): Promise<RagSearchResult[]> {
  const limit = options.limit ?? 5;
  const sections = await loadRagSections();
  const questionTokens = tokenize(question);

  const ranked = sections
    .map((section) => ({
      ...section,
      score: scoreSection(questionTokens, `${section.title} ${section.heading} ${section.content}`, options.articleSlug, section.slug),
    }))
    .filter((section) => section.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    return sections.slice(0, limit).map((section) => ({ ...section, score: 0.1 }));
  }

  return ranked.slice(0, limit);
}
