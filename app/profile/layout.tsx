import type { Metadata } from 'next';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Profile',
  description: 'ดูบทความที่คุณ contribute บน ThaiDevDocs',
  path: '/profile',
  noIndex: true,
});

export default function ProfileLayout({ children }: LayoutProps<'/profile'>) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
