import { Clock3 } from 'lucide-react';
import { VersionBadge } from '@/components/version-badge';
import type { DocsPageFrontmatter } from '@/source.config';

type ArticleMetaProps = {
  data: Pick<
    DocsPageFrontmatter,
    'laravel_version' | 'vue_version' | 'verified_at' | 'reading_time' | 'difficulty'
  >;
  readingTimeMinutes: number;
};

export function ArticleMeta({ data, readingTimeMinutes }: ArticleMetaProps) {
  const minutes = data.reading_time ?? readingTimeMinutes;

  return (
    <div className="flex flex-wrap items-center gap-3 border-b pb-6 text-sm text-fd-muted-foreground">
      <VersionBadge data={data} />
      <span className="inline-flex items-center gap-1.5">
        <Clock3 className="size-3.5" aria-hidden />
        {minutes} นาทีในการอ่าน
      </span>
      <span className="rounded-full border px-2 py-0.5 text-xs capitalize">{data.difficulty}</span>
    </div>
  );
}
