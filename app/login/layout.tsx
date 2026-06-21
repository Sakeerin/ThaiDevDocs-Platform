import type { Metadata } from 'next';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Login',
  description: 'เข้าสู่ระบบด้วย GitHub เพื่อ comment และ community features',
  path: '/login',
  noIndex: true,
});

export default function LoginLayout({ children }: LayoutProps<'/login'>) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
