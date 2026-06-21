import Link from 'next/link';
import { getSponsorContactEmail } from '@/lib/sponsors';

const packages = [
  {
    name: 'Sidebar',
    price: '฿3,000–5,000/เดือน',
    features: ['Logo + link ใน docs sidebar', 'Reach developers ที่อ่าน docs จริง', '1 sponsor slot ต่อหน้า'],
  },
  {
    name: 'Featured',
    price: '฿8,000–15,000/เดือน',
    features: ['Sidebar placement สูงสุด', 'Homepage mention', 'Newsletter mention 1 ครั้ง/ไตรมาส'],
  },
];

export default function SponsorPage() {
  const contactEmail = getSponsorContactEmail();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">Become a Sponsor</h1>
        <p className="text-fd-muted-foreground">
          ThaiDevDocs มีผู้อ่านที่เป็น Laravel/Vue/DevOps developers ในไทย — sponsor sidebar
          ช่วยให้ brand ของคุณอยู่ตรง docs ที่พวกเขาอ่านทุกวัน
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {packages.map((pkg) => (
          <div key={pkg.name} className="rounded-2xl border p-5">
            <p className="text-sm font-medium text-fd-primary">{pkg.name}</p>
            <p className="mt-2 text-2xl font-bold">{pkg.price}</p>
            <ul className="mt-4 space-y-2 text-sm text-fd-muted-foreground">
              {pkg.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border bg-fd-muted/20 p-6">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p className="mt-2 text-sm text-fd-muted-foreground">
          สนใจ sponsor slot — ส่งอีเมลพร้อม company profile และ target audience ที่ต้องการ
        </p>
        <Link
          href={`mailto:${contactEmail}?subject=ThaiDevDocs%20Sponsor%20Inquiry`}
          className="mt-4 inline-flex text-sm font-medium text-fd-primary underline-offset-4 hover:underline"
        >
          {contactEmail}
        </Link>
      </section>
    </div>
  );
}
