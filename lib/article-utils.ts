import type { DocsPageFrontmatter } from '@/source.config';

const STALE_MONTHS = 6;
const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(text: string, wordsPerMinute = WORDS_PER_MINUTE): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function isArticleStale(verifiedAt: string, staleMonths = STALE_MONTHS): boolean {
  const verifiedDate = new Date(verifiedAt);

  if (Number.isNaN(verifiedDate.getTime())) {
    return false;
  }

  const staleThreshold = new Date();
  staleThreshold.setMonth(staleThreshold.getMonth() - staleMonths);

  return verifiedDate < staleThreshold;
}

export function getVerifiedVersionLabel(data: Pick<
  DocsPageFrontmatter,
  'laravel_version' | 'vue_version'
>): string | null {
  if (data.laravel_version) {
    return `Laravel ${data.laravel_version}`;
  }

  if (data.vue_version) {
    return `Vue ${data.vue_version}`;
  }

  return null;
}

export function formatVerifiedDate(verifiedAt: string): string {
  const date = new Date(verifiedAt);

  if (Number.isNaN(date.getTime())) {
    return verifiedAt;
  }

  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function userContributedToArticle(
  username: string,
  data: Pick<DocsPageFrontmatter, 'author' | 'contributors'>,
): boolean {
  const normalized = username.toLowerCase();

  return (
    data.author.toLowerCase() === normalized ||
    data.contributors.some((contributor) => contributor.toLowerCase() === normalized)
  );
}
