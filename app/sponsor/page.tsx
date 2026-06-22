import Link from 'next/link';
import { Suspense } from 'react';
import { Users, BookOpen, MousePointerClick } from 'lucide-react';
import { SponsorInquiryForm } from '@/components/sponsor-inquiry-form';
import { SponsorOnboardingSteps } from '@/components/sponsor-onboarding-steps';
import { SponsorPackageCard } from '@/components/sponsor-package-card';
import { SponsorSidebarPreview } from '@/components/sponsor-sidebar-preview';
import { SPONSOR_PACKAGES } from '@/lib/sponsor-packages';
import { getSponsorContactEmail } from '@/lib/sponsors';
import { source } from '@/lib/source';

const faqs = [
  {
    q: 'Audience เป็นใครบ้าง?',
    a: 'Developer ไทยที่อ่าน docs Laravel, Vue, DevOps และ AI — กำลัง implement จริง ไม่ใช่แค่ browse',
  },
  {
    q: 'ต้องส่ง creative อะไรบ้าง?',
    a: 'Logo SVG/PNG (min 128px), tagline สูงสุด 80 ตัวอักษร, landing URL — ทีมช่วย review copy ได้',
  },
  {
    q: 'สัญญาขั้นต่ำกี่เดือน?',
    a: 'Sidebar 3 เดือน, Featured 6 เดือน — ต่ออายุรายเดือนหลังช่วงเริ่มต้น',
  },
  {
    q: 'วัดผลอย่างไร?',
    a: 'Plausible track sponsor_click events — ส่ง summary รายเดือน on request',
  },
];

export default function SponsorPage() {
  const contactEmail = getSponsorContactEmail();
  const articleCount = source.getPages().filter((page) => page.url.startsWith('/docs/')).length;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 py-12">
      <header className="space-y-4">
        <p className="text-sm font-medium text-fd-primary">Sponsor ThaiDevDocs</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Reach Thai developers ที่อ่าน docs จริง
        </h1>
        <p className="max-w-2xl text-fd-muted-foreground">
          Sidebar placement ใน docs ทุกหน้า — audience เป็น Laravel/Vue/DevOps developers ในไทย
          ที่กำลัง implement production systems
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="#inquiry"
            className="inline-flex rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground hover:bg-fd-primary/90"
          >
            ส่ง inquiry
          </Link>
          <Link
            href={`mailto:${contactEmail}?subject=ThaiDevDocs%20Sponsor%20Inquiry`}
            className="inline-flex rounded-lg border px-4 py-2 text-sm font-medium hover:bg-fd-muted/40"
          >
            {contactEmail}
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-4">
          <BookOpen className="size-5 text-fd-primary" aria-hidden />
          <p className="mt-3 text-2xl font-bold">{articleCount}+</p>
          <p className="text-sm text-fd-muted-foreground">articles ภาษาไทย</p>
        </div>
        <div className="rounded-xl border p-4">
          <Users className="size-5 text-fd-primary" aria-hidden />
          <p className="mt-3 text-2xl font-bold">Laravel · Vue · DevOps</p>
          <p className="text-sm text-fd-muted-foreground">developer audience</p>
        </div>
        <div className="rounded-xl border p-4">
          <MousePointerClick className="size-5 text-fd-primary" aria-hidden />
          <p className="mt-3 text-2xl font-bold">Sidebar</p>
          <p className="text-sm text-fd-muted-foreground">TOC placement ทุก docs page</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">แพ็กเกจ</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {SPONSOR_PACKAGES.map((pkg) => (
            <Link key={pkg.id} href={`/sponsor?package=${pkg.id}#inquiry`} className="block">
              <SponsorPackageCard pkg={pkg} />
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Sidebar placement</h2>
          <p className="text-sm text-fd-muted-foreground">
            Sponsor card แสดงใน TOC column (desktop) และ TOC popover (mobile) — ติดอยู่ขณะอ่านบทความ
          </p>
        </div>
        <SponsorSidebarPreview />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Onboarding flow</h2>
        <SponsorOnboardingSteps />
      </section>

      <Suspense fallback={<div className="text-sm text-fd-muted-foreground">Loading form...</div>}>
        <SponsorInquiryForm />
      </Suspense>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">FAQ</h2>
        <div className="space-y-3">
          {faqs.map((item) => (
            <details key={item.q} className="rounded-xl border p-4">
              <summary className="cursor-pointer font-medium">{item.q}</summary>
              <p className="mt-2 text-sm text-fd-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border bg-fd-muted/20 p-6">
        <h2 className="text-lg font-semibold">Prefer email?</h2>
        <p className="mt-2 text-sm text-fd-muted-foreground">
          ส่งอีเมลพร้อม company profile, package ที่สนใจ และ target audience
        </p>
        <Link
          href={`mailto:${contactEmail}?subject=ThaiDevDocs%20Sponsor%20Inquiry&body=Company:%0APackage:%0AWebsite:%0AMessage:`}
          className="mt-4 inline-flex text-sm font-medium text-fd-primary underline-offset-4 hover:underline"
        >
          {contactEmail}
        </Link>
      </section>
    </div>
  );
}
