'use client';

import { Check } from 'lucide-react';
import type { SponsorPackage, SponsorPackageId } from '@/lib/sponsor-packages';
import { cn } from '@/lib/utils';

type SponsorPackageCardProps = {
  pkg: SponsorPackage;
  selected?: boolean;
  onSelect?: (id: SponsorPackageId) => void;
  selectable?: boolean;
};

export function SponsorPackageCard({
  pkg,
  selected = false,
  onSelect,
  selectable = false,
}: SponsorPackageCardProps) {
  const Wrapper = selectable ? 'button' : 'div';

  return (
    <Wrapper
      type={selectable ? 'button' : undefined}
      onClick={selectable ? () => onSelect?.(pkg.id) : undefined}
      className={cn(
        'rounded-2xl border p-5 text-left transition-colors',
        pkg.highlighted && 'border-fd-primary/40 bg-fd-primary/5',
        selectable && 'cursor-pointer hover:border-fd-primary/50',
        selectable && selected && 'ring-2 ring-fd-primary ring-offset-2 ring-offset-fd-background',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-fd-primary">{pkg.name}</p>
        {pkg.highlighted ? (
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium uppercase text-amber-700 dark:text-amber-300">
            Popular
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-2xl font-bold">{pkg.priceLabel}</p>
      <p className="mt-2 text-sm text-fd-muted-foreground">{pkg.description}</p>
      <ul className="mt-4 space-y-2 text-sm text-fd-muted-foreground">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-fd-primary" aria-hidden />
            {feature}
          </li>
        ))}
      </ul>
    </Wrapper>
  );
}
