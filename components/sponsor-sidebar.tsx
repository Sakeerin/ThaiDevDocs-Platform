'use client';

import Link from 'next/link';
import { ExternalLink, Megaphone } from 'lucide-react';
import type { Sponsor } from '@/lib/sponsors';
import { getSponsorCtaUrl } from '@/lib/sponsors';
import { trackPlausibleEvent } from '@/lib/plausible';
import { cn } from '@/lib/utils';

type SponsorSidebarProps = {
  sponsors: Sponsor[];
  compact?: boolean;
  className?: string;
};

function SponsorCard({ sponsor, compact }: { sponsor: Sponsor; compact?: boolean }) {
  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="sponsored noreferrer noopener"
      onClick={() =>
        trackPlausibleEvent('sponsor_click', {
          sponsor: sponsor.id,
          tier: sponsor.tier ?? 'standard',
        })
      }
      className={cn(
        'group block rounded-xl border bg-fd-card p-3 transition-colors hover:border-fd-primary/40 hover:bg-fd-muted/30',
        sponsor.tier === 'gold' && 'border-amber-500/30 bg-amber-500/5',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-wide text-fd-muted-foreground">
          Sponsored
        </p>
        <ExternalLink className="size-3 text-fd-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
      </div>
      <p className={cn('mt-2 font-semibold text-foreground', compact ? 'text-sm' : 'text-base')}>
        {sponsor.name}
      </p>
      {!compact ? (
        <p className="mt-1 text-xs leading-relaxed text-fd-muted-foreground">{sponsor.tagline}</p>
      ) : null}
    </a>
  );
}

function SponsorCta({ compact }: { compact?: boolean }) {
  const ctaUrl = getSponsorCtaUrl();

  return (
    <div className="rounded-xl border border-dashed bg-fd-muted/20 p-3">
      <div className="flex items-center gap-2">
        <Megaphone className="size-4 text-fd-primary" aria-hidden />
        <p className="text-sm font-medium">Become a sponsor</p>
      </div>
      {!compact ? (
        <p className="mt-2 text-xs leading-relaxed text-fd-muted-foreground">
          โฆษณาถึง developer ไทยที่อ่าน Laravel, Vue และ DevOps docs
        </p>
      ) : null}
      <Link
        href={ctaUrl}
        className="mt-3 inline-flex text-xs font-medium text-fd-primary underline-offset-4 hover:underline"
        onClick={() => trackPlausibleEvent('sponsor_click', { sponsor: 'cta', tier: 'cta' })}
      >
        ดูแพ็กเกจ sponsor
      </Link>
    </div>
  );
}

export function SponsorSidebar({ sponsors, compact = false, className }: SponsorSidebarProps) {
  return (
    <div className={cn('not-prose space-y-3', className)}>
      {sponsors.length > 0 ? (
        sponsors.map((sponsor) => <SponsorCard key={sponsor.id} sponsor={sponsor} compact={compact} />)
      ) : (
        <SponsorCta compact={compact} />
      )}
    </div>
  );
}
