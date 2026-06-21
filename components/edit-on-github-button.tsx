import Link from 'next/link';
import { PencilLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getGitHubEditUrl } from '@/lib/shared';

type EditOnGitHubButtonProps = {
  pagePath: string;
};

export function EditOnGitHubButton({ pagePath }: EditOnGitHubButtonProps) {
  return (
    <Button asChild variant="outline" size="sm">
      <Link href={getGitHubEditUrl(pagePath)} target="_blank" rel="noreferrer noopener">
        <PencilLine className="size-3.5" aria-hidden />
        แก้ไข article นี้
      </Link>
    </Button>
  );
}
