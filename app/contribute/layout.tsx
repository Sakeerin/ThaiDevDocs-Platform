import type { Metadata } from 'next';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Contribution Guide',
  description: 'วิธี contribute บทความใหม่หรือแก้ไข docs ผ่าน GitHub Pull Request',
  path: '/contribute',
});

export default function ContributeLayout({ children }: LayoutProps<'/contribute'>) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
