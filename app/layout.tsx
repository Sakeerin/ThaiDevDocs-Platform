import { RootProvider } from 'fumadocs-ui/provider/next';
import { Geist, Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { SiteFooter } from '@/components/site-footer';
import './global.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={cn(inter.className, 'font-sans', geist.variable)}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <RootProvider theme={{ defaultTheme: 'system', enableSystem: true }}>
          <div className="flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </RootProvider>
      </body>
    </html>
  );
}
