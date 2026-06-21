import type { Metadata } from 'next';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Pricing',
  description: 'Free docs สำหรับทุกคน — Pro ฿99/เดือน สำหรับ AI Q&A และ premium articles',
  path: '/pricing',
});

export default function PricingLayout({ children }: LayoutProps<'/pricing'>) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
