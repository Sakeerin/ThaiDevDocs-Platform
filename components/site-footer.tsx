import Link from 'next/link';
import { appName, gitConfig } from '@/lib/shared';

const githubRepoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;
const contributeUrl = `${githubRepoUrl}/blob/${gitConfig.branch}/CONTRIBUTING.md`;

export function SiteFooter() {
  return (
    <footer className="border-t border-fd-border/60 bg-fd-background/90">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-fd-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="text-foreground">{appName}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href={githubRepoUrl} target="_blank" rel="noreferrer noopener" className="hover:text-foreground">
            GitHub
          </Link>
          <Link href={contributeUrl} target="_blank" rel="noreferrer noopener" className="hover:text-foreground">
            Contribute
          </Link>
          <Link href="https://x.com" target="_blank" rel="noreferrer noopener" className="hover:text-foreground">
            X
          </Link>
          <Link
            href="https://www.linkedin.com"
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-foreground"
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
