import { Comments } from '@/components/comments';
import { HelpfulVote } from '@/components/helpful-vote';

type ArticleFooterProps = {
  slug: string;
  pageUrl: string;
  pageTitle: string;
};

export function ArticleFooter({ slug, pageUrl, pageTitle }: ArticleFooterProps) {
  return (
    <div className="mt-10 space-y-8 border-t pt-8">
      <HelpfulVote pageUrl={pageUrl} pageTitle={pageTitle} />
      <Comments slug={slug} />
    </div>
  );
}
