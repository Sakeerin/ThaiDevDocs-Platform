import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { gitConfig } from '@/lib/shared';
import { calculateReadingTime } from '@/lib/article-utils';
import { ArticleMeta } from '@/components/article-meta';
import { OutdatedBanner } from '@/components/outdated-banner';
import { EditOnGitHubButton } from '@/components/edit-on-github-button';
import { ArticleFooter } from '@/components/article-footer';
import { ArticleViewTracker } from '@/components/article-view-tracker';
import { ReadingProgress } from '@/components/reading-progress';
import { AiChatLazy } from '@/components/ai-chat-lazy';
import { ArticleJsonLd } from '@/components/article-json-ld';
import { PremiumGate } from '@/components/premium-gate';
import { getSession } from '@/lib/auth';
import { getSubscriptionStatus } from '@/lib/subscription';
import { createArticleMetadata, getSiteUrl } from '@/lib/seo';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const processed = await page.data.getText('processed');
  const readingTimeMinutes = calculateReadingTime(processed);
  const pageUrl = page.url;
  const session = await getSession();
  const subscription = await getSubscriptionStatus();

  return (
    <>
      <ArticleJsonLd data={page.data} path={pageUrl} slug={page.slugs} />
      <ReadingProgress />
      <ArticleViewTracker
        pageUrl={pageUrl}
        pageTitle={page.data.title}
        topic={page.data.topic}
      />
      <DocsPage
        toc={page.data.toc}
        full={page.data.full}
        breadcrumb={{
          enabled: true,
          includeRoot: true,
          includePage: true,
        }}
        tableOfContent={{
          enabled: true,
        }}
      >
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
        <ArticleMeta data={page.data} readingTimeMinutes={readingTimeMinutes} />
        <OutdatedBanner
          verifiedAt={page.data.verified_at}
          pageTitle={page.data.title}
          pageUrl={pageUrl}
        />
        <div className="flex flex-row flex-wrap gap-2 items-center border-b pb-6">
          <EditOnGitHubButton pagePath={page.path} />
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
          />
        </div>
        <DocsBody>
          <PremiumGate isPremium={page.data.is_premium}>
            <MDX
              components={getMDXComponents({
                // this allows you to link to other pages with relative file paths
                a: createRelativeLink(source, page),
              })}
            />
          </PremiumGate>
        </DocsBody>
        <ArticleFooter slug={pageUrl} pageUrl={pageUrl} pageTitle={page.data.title} />
      </DocsPage>
      <AiChatLazy
        articleSlug={pageUrl}
        isPro={subscription.isPro}
        isLoggedIn={Boolean(session?.user)}
      />
    </>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const ogImage = getSiteUrl(getPageImage(page).url);

  return createArticleMetadata({
    title: page.data.title,
    description: page.data.description ?? page.data.title,
    path: page.url,
    ogImage,
    tags: page.data.tags,
  });
}
