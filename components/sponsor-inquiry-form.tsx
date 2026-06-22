'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SponsorPackageCard } from '@/components/sponsor-package-card';
import { SPONSOR_PACKAGES, type SponsorPackageId } from '@/lib/sponsor-packages';
import { trackPlausibleEvent } from '@/lib/plausible';
import { cn } from '@/lib/utils';

const inputClassName =
  'w-full rounded-lg border bg-fd-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-fd-ring';

type SponsorInquiryFormProps = {
  className?: string;
}

export function SponsorInquiryForm({ className }: SponsorInquiryFormProps) {
  const searchParams = useSearchParams();
  const initialPackage =
    searchParams.get('package') === 'featured' || searchParams.get('package') === 'sidebar'
      ? (searchParams.get('package') as SponsorPackageId)
      : 'sidebar';

  const [packageId, setPackageId] = useState<SponsorPackageId>(initialPackage);
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState('');
  const [websiteConfirm, setWebsiteConfirm] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setPackageId(initialPackage);
  }, [initialPackage]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('loading');
    setFeedback('');

    try {
      const response = await fetch('/api/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          contactName,
          email,
          website,
          packageId,
          message,
          budget,
          websiteConfirm,
        }),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        if (data.error === 'rate_limited') {
          throw new Error('rate_limited');
        }
        throw new Error(data.error ?? 'submit_failed');
      }

      setStatus('success');
      setFeedback(data.message ?? 'ส่งคำขอสำเร็จ');
      trackPlausibleEvent('sponsor_inquiry_submit', { package: packageId });
      setCompanyName('');
      setContactName('');
      setEmail('');
      setWebsite('');
      setMessage('');
      setBudget('');
    } catch (error) {
      setStatus('error');
      setFeedback(
        error instanceof Error && error.message === 'rate_limited'
          ? 'ส่งคำขอเกินจำนวนต่อวัน — ลองใหม่พรุ่งนี้หรืออีเมลโดยตรง'
          : 'ส่งไม่สำเร็จ กรุณาตรวจข้อมูลและลองใหม่',
      );
    }
  }

  return (
    <div id="inquiry" className={cn('scroll-mt-24', className)}>
      <div className="mb-6 space-y-2">
        <h2 className="text-xl font-semibold">ส่ง Sponsor Inquiry</h2>
        <p className="text-sm text-fd-muted-foreground">
          กรอกฟอร์มด้านล่าง — ทีมจะติดต่อกลับภายใน 2 วันทำการ (หรือส่งอีเมลโดยตรงที่ด้านล่าง)
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {SPONSOR_PACKAGES.map((pkg) => (
          <SponsorPackageCard
            key={pkg.id}
            pkg={pkg}
            selectable
            selected={packageId === pkg.id}
            onSelect={setPackageId}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 text-sm">
            <span className="font-medium">Company / Brand *</span>
            <input
              required
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              className={inputClassName}
              placeholder="Acme Dev Tools"
            />
          </label>
          <label className="space-y-1.5 text-sm">
            <span className="font-medium">Contact name *</span>
            <input
              required
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
              className={inputClassName}
              placeholder="สมชาย ใจดี"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 text-sm">
            <span className="font-medium">Work email *</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClassName}
              placeholder="you@company.com"
            />
          </label>
          <label className="space-y-1.5 text-sm">
            <span className="font-medium">Website</span>
            <input
              type="url"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              className={inputClassName}
              placeholder="https://company.com"
            />
          </label>
        </div>

        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Monthly budget (optional)</span>
          <input
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            className={inputClassName}
            placeholder="เช่น ฿5,000/เดือน"
          />
        </label>

        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Tell us about your product & target audience *</span>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className={cn(inputClassName, 'resize-y')}
            placeholder="เราทำ dev tool สำหรับ Laravel teams ในไทย ต้องการ reach developers ที่กำลัง deploy production..."
          />
        </label>

        <input
          type="text"
          name="websiteConfirm"
          value={websiteConfirm}
          onChange={(event) => setWebsiteConfirm(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />

        <Button type="submit" disabled={status === 'loading'} className="w-full sm:w-auto">
          {status === 'loading' ? 'กำลังส่ง...' : 'ส่ง Sponsor Inquiry'}
        </Button>

        {feedback ? (
          <p
            className={cn(
              'text-sm',
              status === 'success' ? 'text-emerald-600' : 'text-destructive',
            )}
          >
            {feedback}
          </p>
        ) : null}
      </form>
    </div>
  );
}
