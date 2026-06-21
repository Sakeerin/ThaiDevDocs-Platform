import sponsorsData from '@/data/sponsors.json';

export type Sponsor = {
  id: string;
  name: string;
  tagline: string;
  url: string;
  tier?: 'gold' | 'silver' | 'bronze';
  logoUrl?: string;
  active?: boolean;
};

const sponsors = sponsorsData as Sponsor[];

export function areSponsorsEnabled() {
  return process.env.NEXT_PUBLIC_SPONSORS_ENABLED !== 'false';
}

export function getActiveSponsors(limit = 2) {
  if (!areSponsorsEnabled()) {
    return [];
  }

  return sponsors.filter((sponsor) => sponsor.active !== false).slice(0, limit);
}

export function getSponsorCtaUrl() {
  return process.env.NEXT_PUBLIC_SPONSOR_CTA_URL ?? '/sponsor';
}

export function getSponsorContactEmail() {
  return process.env.NEXT_PUBLIC_SPONSOR_CONTACT_EMAIL ?? 'sponsors@thaidevdocs.com';
}
