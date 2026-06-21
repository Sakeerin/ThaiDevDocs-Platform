import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { getSiteUrl } from '@/lib/seo';

const staticRoutes = ['/', '/docs', '/pricing', '/contribute'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = source.getPages();

  const articleEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: getSiteUrl(page.url),
    lastModified: new Date(page.data.verified_at),
    changeFrequency: 'weekly',
    priority: page.url === '/docs' ? 0.9 : 0.8,
  }));

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: getSiteUrl(path),
    lastModified: now,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));

  return [...staticEntries, ...articleEntries];
}
