import { RootProvider } from 'fumadocs-ui/provider/next';
import { Geist, Inter, Sarabun } from 'next/font/google';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { SiteFooter } from '@/components/site-footer';
import { AlgoliaSearchDialog } from '@/components/algolia-search';
import { AuthSessionProvider } from '@/components/auth-session-provider';
import { PlausibleAnalytics } from '@/components/plausible-analytics';
import { getSession } from '@/lib/auth';
import { createPageMetadata } from '@/lib/seo';
import { appName } from '@/lib/shared';
import './global.css';

const hasAlgolia = !!(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID &&
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
);

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const inter = Inter({
  subsets: ['latin'],
});

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-thai',
  display: 'swap',
});

export const metadata: Metadata = createPageMetadata({
  title: appName,
  description:
    'เอกสาร Laravel, Vue, DevOps และ AI สำหรับ developer ไทย — community-driven, อัปเดตผ่าน GitHub',
  path: '/',
});

export default async function Layout({ children }: LayoutProps<'/'>) {
  const session = await getSession();

  return (
    <html
      lang="th"
      className={cn(inter.className, 'font-sans', geist.variable, sarabun.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col font-[family-name:var(--font-thai)]">
        <AuthSessionProvider session={session}>
          <RootProvider
            theme={{ defaultTheme: 'system', enableSystem: true }}
            search={hasAlgolia ? { SearchDialog: AlgoliaSearchDialog } : undefined}
          >
            <PlausibleAnalytics />
            <div className="flex min-h-screen flex-col">
              <div className="flex-1">{children}</div>
              <SiteFooter />
            </div>
          </RootProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
