import Script from 'next/script';
import { getPlausibleDomain } from '@/lib/plausible';

export function PlausibleAnalytics() {
  const domain = getPlausibleDomain();

  if (!domain) {
    return null;
  }

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.tagged-events.js"
      strategy="afterInteractive"
    />
  );
}
