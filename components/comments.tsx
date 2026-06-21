'use client';

import Giscus from '@giscus/react';

type CommentsProps = {
  slug: string;
};

function getGiscusConfig() {
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  if (!repo || !repoId || !categoryId) {
    return null;
  }

  return { repo, repoId, categoryId };
}

export function Comments({ slug }: CommentsProps) {
  const config = getGiscusConfig();

  if (!config) {
    return (
      <section className="rounded-xl border border-dashed p-6 text-sm text-fd-muted-foreground">
        <h2 className="mb-2 text-base font-semibold text-foreground">Comments</h2>
        <p>
          ตั้งค่า Giscus ด้วย{' '}
          <code className="rounded bg-fd-muted px-1 py-0.5">NEXT_PUBLIC_GISCUS_*</code> env vars
          แล้วสร้าง GitHub Discussions category &quot;Comments&quot; ที่{' '}
          <a
            href="https://giscus.app"
            target="_blank"
            rel="noreferrer noopener"
            className="text-fd-primary underline"
          >
            giscus.app
          </a>
        </p>
        <p className="mt-2">Page: {slug}</p>
      </section>
    );
  }

  return (
    <section className="not-prose">
      <h2 className="mb-4 text-lg font-semibold">Comments</h2>
      <Giscus
        repo={config.repo as `${string}/${string}`}
        repoId={config.repoId}
        category="Comments"
        categoryId={config.categoryId}
        mapping="specific"
        term={slug}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang="th"
        loading="lazy"
      />
    </section>
  );
}
