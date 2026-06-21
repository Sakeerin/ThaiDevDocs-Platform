'use client';

import { useEffect } from 'react';
import { trackPlausibleEvent } from '@/lib/plausible';

type ArticleViewTrackerProps = {
  pageUrl: string;
  pageTitle: string;
  topic: string;
};

export function ArticleViewTracker({ pageUrl, pageTitle, topic }: ArticleViewTrackerProps) {
  useEffect(() => {
    trackPlausibleEvent('article_view', {
      page: pageUrl,
      title: pageTitle,
      topic,
    });
  }, [pageUrl, pageTitle, topic]);

  return null;
}
