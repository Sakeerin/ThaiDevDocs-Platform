import { JsonLd } from '@/components/json-ld';
import { getCanonicalUrl, getSiteUrl } from '@/lib/seo';
import { appName, docsRoute } from '@/lib/shared';
import type { DocsPageFrontmatter } from '@/source.config';

type ArticleJsonLdProps = {
  data: Pick<
    DocsPageFrontmatter,
    'title' | 'description' | 'author' | 'verified_at' | 'tags' | 'topic'
  >;
  path: string;
  slug: string[];
};

export function ArticleJsonLd({ data, path, slug }: ArticleJsonLdProps) {
  const url = getCanonicalUrl(path);
  const breadcrumbItems = [
    { name: appName, item: getSiteUrl() },
    { name: 'Docs', item: getSiteUrl(docsRoute) },
    ...slug.map((segment, index) => ({
      name: segment.replace(/-/g, ' '),
      item: getCanonicalUrl(`${docsRoute}/${slug.slice(0, index + 1).join('/')}`),
    })),
  ];

  return (
    <JsonLd
      data={[
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.title,
          description: data.description,
          author: {
            '@type': 'Person',
            name: data.author,
          },
          dateModified: data.verified_at,
          inLanguage: 'th-TH',
          keywords: data.tags.join(', '),
          articleSection: data.topic,
          mainEntityOfPage: url,
          publisher: {
            '@type': 'Organization',
            name: appName,
            url: getSiteUrl(),
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.item,
          })),
        },
      ]}
    />
  );
}
