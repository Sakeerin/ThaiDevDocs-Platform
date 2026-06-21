import { CheckCircle2 } from 'lucide-react';
import { formatVerifiedDate, getVerifiedVersionLabel } from '@/lib/article-utils';
import type { DocsPageFrontmatter } from '@/source.config';
import { cn } from '@/lib/utils';

type VersionBadgeProps = {
  data: Pick<DocsPageFrontmatter, 'laravel_version' | 'vue_version' | 'verified_at'>;
  className?: string;
};

export function VersionBadge({ data, className }: VersionBadgeProps) {
  const versionLabel = getVerifiedVersionLabel(data);

  if (!versionLabel) {
    return null;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300',
        className,
      )}
    >
      <CheckCircle2 className="size-3.5" aria-hidden />
      Verified: {versionLabel}
      <span className="text-fd-muted-foreground">({formatVerifiedDate(data.verified_at)})</span>
    </span>
  );
}
