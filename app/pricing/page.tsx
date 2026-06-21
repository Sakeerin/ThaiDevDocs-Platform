import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCheckoutUrl, getSubscriptionStatus } from '@/lib/subscription';
import { source } from '@/lib/source';

const features = {
  free: [
    'อ่าน docs ฟรีทั้งหมด (non-premium)',
    'GitHub comments',
    'Contribute ผ่าน Pull Request',
    'Algolia search',
  ],
  pro: [
    'AI Q&A ภาษาไทยจาก docs context',
    '20 queries/วัน',
    'Premium articles',
    'Private Discord community',
    'Source citations ใน AI answers',
  ],
};

const faqs = [
  {
    q: 'AI Q&A ตอบจากอะไร?',
    a: 'ตอบจากเนื้อหาใน ThaiDevDocs docs เท่านั้น ด้วย RAG pipeline ที่ค้นหา sections ที่เกี่ยวข้องก่อนส่งให้ Claude',
  },
  {
    q: 'ยกเลิกได้ไหม?',
    a: 'ยกเลิกได้ทุกเมื่อจากหน้า Billing settings — Pro จะ active จนจบรอบบิล',
  },
  {
    q: 'รองรับ Laravel version ไหน?',
    a: 'Docs เน้น Laravel 11.x และ Vue 3.x — ทุก article มี verified_at และ version badge',
  },
];

export default async function PricingPage() {
  const { isPro } = await getSubscriptionStatus();
  const articleCount = source.getPages().length;
  const premiumPages = source
    .getPages()
    .filter((page) => page.data.is_premium && page.url !== '/docs');
  const monthlyCheckout = getCheckoutUrl('monthly');
  const annualCheckout = getCheckoutUrl('annual');

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-12">
      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-bold">Pricing</h1>
        <p className="text-fd-muted-foreground">
          เริ่มฟรี — อัปเกรด Pro เมื่อต้องการ AI Q&A และ premium content
        </p>
        <p className="text-sm text-fd-muted-foreground">
          {articleCount}+ articles · community-driven · อัปเดตผ่าน GitHub
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border p-6">
          <p className="text-sm font-medium text-fd-muted-foreground">Free</p>
          <p className="mt-2 text-3xl font-bold">฿0</p>
          <ul className="mt-6 space-y-3 text-sm">
            {features.free.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 text-fd-primary" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="mt-8 w-full">
            <Link href="/docs">เริ่มอ่าน docs</Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-fd-primary/40 bg-fd-primary/5 p-6">
          <p className="text-sm font-medium text-fd-primary">Pro</p>
          <p className="mt-2 text-3xl font-bold">฿99<span className="text-base font-normal">/เดือน</span></p>
          <p className="text-sm text-fd-muted-foreground">หรือ ฿890/ปี</p>
          <ul className="mt-6 space-y-3 text-sm">
            {features.pro.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 text-fd-primary" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
          {isPro ? (
            <Button asChild className="mt-8 w-full">
              <Link href="/settings/billing">Manage billing</Link>
            </Button>
          ) : monthlyCheckout ? (
            <div className="mt-8 flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href={monthlyCheckout} target="_blank" rel="noreferrer noopener">
                  Upgrade monthly
                </Link>
              </Button>
              {annualCheckout ? (
                <Button asChild variant="outline" className="w-full">
                  <Link href={annualCheckout} target="_blank" rel="noreferrer noopener">
                    Upgrade annual
                  </Link>
                </Button>
              ) : null}
            </div>
          ) : (
            <Button asChild className="mt-8 w-full">
              <Link href="/login">Login to upgrade</Link>
            </Button>
          )}
        </div>
      </div>

      {premiumPages.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Premium articles</h2>
          <p className="text-sm text-fd-muted-foreground">
            Deep dives สำหรับ Pro members — architecture, production checklist, security
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {premiumPages.map((page) => (
              <li key={page.url}>
                <Link
                  href={page.url}
                  className="block rounded-xl border p-4 transition-colors hover:border-fd-primary/40 hover:bg-fd-muted/30"
                >
                  <p className="font-medium">{page.data.title}</p>
                  <p className="mt-1 text-sm text-fd-muted-foreground">{page.data.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-xl border p-4">
              <p className="font-medium">{faq.q}</p>
              <p className="mt-2 text-sm text-fd-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
