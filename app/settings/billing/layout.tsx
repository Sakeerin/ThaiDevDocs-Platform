import type { Metadata } from 'next';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Billing',
  description: 'จัดการแผน Pro และ billing settings',
  path: '/settings/billing',
  noIndex: true,
});

export default function BillingLayout({ children }: LayoutProps<'/settings/billing'>) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
