'use client';

import { useEffect, useState } from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackPlausibleEvent } from '@/lib/plausible';
import { cn } from '@/lib/utils';

type HelpfulVoteProps = {
  pageUrl: string;
  pageTitle: string;
};

type VoteValue = 'up' | 'down';

function storageKey(pageUrl: string) {
  return `thaidevdocs:helpful:${pageUrl}`;
}

export function HelpfulVote({ pageUrl, pageTitle }: HelpfulVoteProps) {
  const [selected, setSelected] = useState<VoteValue | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey(pageUrl));

    if (saved === 'up' || saved === 'down') {
      setSelected(saved);
    }
  }, [pageUrl]);

  function handleVote(vote: VoteValue) {
    if (selected) {
      return;
    }

    setSelected(vote);
    window.localStorage.setItem(storageKey(pageUrl), vote);

    trackPlausibleEvent('helpful_vote', {
      page: pageUrl,
      title: pageTitle,
      vote,
    });
  }

  return (
    <section className="rounded-xl border bg-fd-card p-4">
      <p className="mb-3 text-sm font-medium">Was this helpful?</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant={selected === 'up' ? 'default' : 'outline'}
          size="sm"
          disabled={Boolean(selected)}
          onClick={() => handleVote('up')}
        >
          <ThumbsUp className="size-3.5" aria-hidden />
          Yes
        </Button>
        <Button
          type="button"
          variant={selected === 'down' ? 'default' : 'outline'}
          size="sm"
          disabled={Boolean(selected)}
          onClick={() => handleVote('down')}
        >
          <ThumbsDown className="size-3.5" aria-hidden />
          No
        </Button>
        {selected ? (
          <span className={cn('text-xs text-fd-muted-foreground')}>ขอบคุณสำหรับ feedback</span>
        ) : null}
      </div>
    </section>
  );
}
