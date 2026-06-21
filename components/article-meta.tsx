import { Clock3, Sparkles } from 'lucide-react';
import { VersionBadge } from '@/components/version-badge';
import type { DocsPageFrontmatter } from '@/source.config';

type ArticleMetaProps = {
  data: Pick<
    DocsPageFrontmatter,
    'laravel_version' | 'vue_version' | 'verified_at' | 'reading_time' | 'difficulty' | 'is_premium'
  >;
  readingTimeMinutes: number;
};

export function ArticleMeta({ data, readingTimeMinutes }: ArticleMetaProps) {
  const minutes = data.reading_time ?? readingTimeMinutes;

  return (
    <div className="flex flex-wrap items-center gap-3 border-b pb-6 text-sm text-fd-muted-foreground">
      <VersionBadge data={data} />
      {data.is_premium ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-fd-primary/40 bg-fd-primary/10 px-2 py-0.5 text-xs font-medium text-fd-primary">
          <Sparkles className="size-3" aria-hidden />
          Pro
        </span>
      ) : null}
      <span className="inline-flex items-center gap-1.5">
        <Clock3 className="size-3.5" aria-hidden />
        {minutes} นาทีในการอ่าน
      </span>
      <span className="rounded-full border px-2 py-0.5 text-xs capitalize">{data.difficulty}</span>
    </div>
  );
}
