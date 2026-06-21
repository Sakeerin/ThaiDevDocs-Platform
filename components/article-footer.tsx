import { CommentsLazy } from '@/components/comments-lazy';
import { HelpfulVote } from '@/components/helpful-vote';
import { NewsletterSignup } from '@/components/newsletter-signup';

type ArticleFooterProps = {
  slug: string;
  pageUrl: string;
  pageTitle: string;
};

export function ArticleFooter({ slug, pageUrl, pageTitle }: ArticleFooterProps) {
  return (
    <div className="mt-10 space-y-8 border-t pt-8">
      <HelpfulVote pageUrl={pageUrl} pageTitle={pageTitle} />
      <NewsletterSignup compact />
      <CommentsLazy slug={slug} />
    </div>
  );
}
