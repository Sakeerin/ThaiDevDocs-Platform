'use client';

import dynamic from 'next/dynamic';

const CommentsImpl = dynamic(() => import('@/components/comments').then((mod) => mod.Comments), {
  ssr: false,
  loading: () => (
    <section className="rounded-xl border border-dashed p-6 text-sm text-fd-muted-foreground">
      Loading comments...
    </section>
  ),
});

type CommentsLazyProps = {
  slug: string;
};

export function CommentsLazy({ slug }: CommentsLazyProps) {
  return <CommentsImpl slug={slug} />;
}
