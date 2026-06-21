import Link from 'next/link';
import { PencilLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSuggestUpdateIssueUrl } from '@/lib/shared';

type SuggestUpdateButtonProps = {
  pageTitle: string;
  pageUrl: string;
  className?: string;
};

export function SuggestUpdateButton({ pageTitle, pageUrl, className }: SuggestUpdateButtonProps) {
  return (
    <Button asChild variant="outline" size="sm" className={className}>
      <Link href={getSuggestUpdateIssueUrl(pageTitle, pageUrl)} target="_blank" rel="noreferrer noopener">
        <PencilLine className="size-3.5" aria-hidden />
        Suggest update
      </Link>
    </Button>
  );
}
