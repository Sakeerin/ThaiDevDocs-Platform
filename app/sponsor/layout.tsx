import type { Metadata } from 'next';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Become a Sponsor',
  description: 'Sponsor ThaiDevDocs sidebar — reach Thai Laravel and Vue developers',
  path: '/sponsor',
});

export default function SponsorLayout({ children }: LayoutProps<'/sponsor'>) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
