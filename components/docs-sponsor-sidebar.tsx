import { SponsorSidebar } from '@/components/sponsor-sidebar';
import { getActiveSponsors } from '@/lib/sponsors';

export function DocsSponsorSidebar({ compact = false }: { compact?: boolean }) {
  const sponsors = getActiveSponsors();

  return <SponsorSidebar sponsors={sponsors} compact={compact} />;
}
