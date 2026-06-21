import { AlertTriangle } from 'lucide-react';
import { formatVerifiedDate, isArticleStale } from '@/lib/article-utils';
import { SuggestUpdateButton } from '@/components/suggest-update-button';

type OutdatedBannerProps = {
  verifiedAt: string;
  pageTitle: string;
  pageUrl: string;
};

export function OutdatedBanner({ verifiedAt, pageTitle, pageUrl }: OutdatedBannerProps) {
  if (!isArticleStale(verifiedAt)) {
    return null;
  }

  return (
    <div className="my-4 flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-950 dark:text-amber-100 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p>
          บทความนี้อาจ outdated — ตรวจสอบล่าสุดเมื่อ {formatVerifiedDate(verifiedAt)} (เกิน 6 เดือน)
        </p>
      </div>
      <SuggestUpdateButton pageTitle={pageTitle} pageUrl={pageUrl} />
    </div>
  );
}
