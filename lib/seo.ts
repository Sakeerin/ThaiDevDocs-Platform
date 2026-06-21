import type { Metadata } from 'next';
import { appName } from '@/lib/shared';

const defaultSiteUrl = 'https://thaidevdocs.com';

export function getSiteUrl(path = '') {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl).replace(/\/$/, '');
  if (!path) return base;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getCanonicalUrl(path = '/') {
  return getSiteUrl(path);
}

type CreateMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path = '/',
  ogImage = '/og/default',
  noIndex = false,
}: CreateMetadataOptions): Metadata {
  const canonical = getCanonicalUrl(path);
  const fullTitle = path === '/' ? `${title} — ${appName}` : `${title} | ${appName}`;
  const imageUrl = ogImage.startsWith('http') ? ogImage : getSiteUrl(ogImage);

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: appName,
      locale: 'th_TH',
      type: 'website',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function createArticleMetadata(input: {
  title: string;
  description: string;
  path: string;
  ogImage: string;
  tags?: string[];
}): Metadata {
  const metadata = createPageMetadata({
    title: input.title,
    description: input.description,
    path: input.path,
    ogImage: input.ogImage,
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      tags: input.tags,
    },
  };
}
