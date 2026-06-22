import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { SponsorPackageId } from '@/lib/sponsor-packages';
import { getSponsorPackage } from '@/lib/sponsor-packages';
import { getResendClient, isResendConfigured } from '@/lib/newsletter';
import { getSponsorContactEmail } from '@/lib/sponsors';

export type SponsorInquiryStatus = 'pending' | 'contacted' | 'active' | 'declined';

export type SponsorInquiry = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  website?: string;
  packageId: SponsorPackageId;
  message: string;
  budget?: string;
  status: SponsorInquiryStatus;
  createdAt: string;
};

export type CreateSponsorInquiryInput = {
  companyName: string;
  contactName: string;
  email: string;
  website?: string;
  packageId: SponsorPackageId;
  message: string;
  budget?: string;
};

const inquiriesFile = path.join(process.cwd(), '.data', 'sponsor-inquiries.json');
const rateLimitFile = path.join(process.cwd(), '.data', 'sponsor-inquiry-rate-limit.json');

const DAILY_INQUIRY_LIMIT = 3;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

async function readInquiries(): Promise<SponsorInquiry[]> {
  try {
    const raw = await fs.readFile(inquiriesFile, 'utf8');
    return JSON.parse(raw) as SponsorInquiry[];
  } catch {
    return [];
  }
}

async function writeInquiries(inquiries: SponsorInquiry[]) {
  await fs.mkdir(path.dirname(inquiriesFile), { recursive: true });
  await fs.writeFile(inquiriesFile, JSON.stringify(inquiries, null, 2));
}

type RateLimitRecord = { count: number; date: string };

async function readRateLimits(): Promise<Record<string, RateLimitRecord>> {
  try {
    const raw = await fs.readFile(rateLimitFile, 'utf8');
    return JSON.parse(raw) as Record<string, RateLimitRecord>;
  } catch {
    return {};
  }
}

async function writeRateLimits(store: Record<string, RateLimitRecord>) {
  await fs.mkdir(path.dirname(rateLimitFile), { recursive: true });
  await fs.writeFile(rateLimitFile, JSON.stringify(store, null, 2));
}

export async function isSponsorInquiryRateLimited(email: string) {
  const key = email.trim().toLowerCase();
  const store = await readRateLimits();
  const today = todayKey();
  const record = store[key];

  if (!record || record.date !== today) {
    return false;
  }

  return record.count >= DAILY_INQUIRY_LIMIT;
}

async function incrementSponsorInquiryRateLimit(email: string) {
  const key = email.trim().toLowerCase();
  const store = await readRateLimits();
  const today = todayKey();
  const current = store[key]?.date === today ? store[key].count : 0;

  store[key] = { count: current + 1, date: today };
  await writeRateLimits(store);
}

function getNotifyEmail() {
  return process.env.SPONSOR_INQUIRY_NOTIFY_EMAIL ?? getSponsorContactEmail();
}

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thaidevdocs.com';
}

export async function createSponsorInquiry(input: CreateSponsorInquiryInput) {
  const normalizedEmail = input.email.trim().toLowerCase();

  if (await isSponsorInquiryRateLimited(normalizedEmail)) {
    return { ok: false as const, error: 'rate_limited' as const };
  }

  const inquiry: SponsorInquiry = {
    id: randomUUID(),
    companyName: input.companyName.trim(),
    contactName: input.contactName.trim(),
    email: normalizedEmail,
    website: input.website?.trim() || undefined,
    packageId: input.packageId,
    message: input.message.trim(),
    budget: input.budget?.trim() || undefined,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const inquiries = await readInquiries();
  inquiries.push(inquiry);
  await writeInquiries(inquiries);
  await incrementSponsorInquiryRateLimit(normalizedEmail);

  if (isResendConfigured()) {
    await sendSponsorInquiryEmails(inquiry);
  }

  return { ok: true as const, inquiry };
}

async function sendSponsorInquiryEmails(inquiry: SponsorInquiry) {
  const resend = getResendClient();
  const pkg = getSponsorPackage(inquiry.packageId);
  const notifyEmail = getNotifyEmail();
  const siteUrl = getSiteUrl();

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: notifyEmail,
    replyTo: inquiry.email,
    subject: `[Sponsor] ${inquiry.companyName} — ${pkg?.name ?? inquiry.packageId}`,
    html: `
      <h1>Sponsor inquiry ใหม่</h1>
      <ul>
        <li><strong>Company:</strong> ${escapeHtml(inquiry.companyName)}</li>
        <li><strong>Contact:</strong> ${escapeHtml(inquiry.contactName)}</li>
        <li><strong>Email:</strong> ${escapeHtml(inquiry.email)}</li>
        <li><strong>Website:</strong> ${escapeHtml(inquiry.website ?? '—')}</li>
        <li><strong>Package:</strong> ${escapeHtml(pkg?.name ?? inquiry.packageId)} (${escapeHtml(pkg?.priceLabel ?? '')})</li>
        <li><strong>Budget:</strong> ${escapeHtml(inquiry.budget ?? '—')}</li>
        <li><strong>ID:</strong> ${inquiry.id}</li>
      </ul>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(inquiry.message).replace(/\n/g, '<br/>')}</p>
      <p>ดู runbook: docs/SPONSOR-ONBOARDING.md</p>
    `,
  });

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: inquiry.email,
    subject: 'ThaiDevDocs — ได้รับคำขอ sponsor แล้ว',
    html: `
      <h1>ขอบคุณที่สนใจ sponsor ThaiDevDocs</h1>
      <p>สวัสดี ${escapeHtml(inquiry.contactName)},</p>
      <p>เราได้รับคำขอ sponsor จาก <strong>${escapeHtml(inquiry.companyName)}</strong> แล้ว — ทีมจะติดต่อกลับภายใน <strong>2 วันทำการ</strong></p>
      <p><strong>Package ที่เลือก:</strong> ${escapeHtml(pkg?.name ?? inquiry.packageId)} (${escapeHtml(pkg?.priceLabel ?? '')})</p>
      <h2>ขั้นตอนถัดไป</h2>
      <ol>
        <li>ทีม review audience fit และส่งใบเสนอราคา</li>
        <li>ชำระเงิน + ส่ง logo (SVG/PNG), tagline (max 80 ตัวอักษร), landing URL</li>
        <li>Go live ใน docs sidebar ภายใน 3 วันทำการ</li>
      </ol>
      <p>ดูรายละเอียดแพ็กเกจ: <a href="${siteUrl}/sponsor">${siteUrl}/sponsor</a></p>
      <p>Reference ID: ${inquiry.id}</p>
    `,
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function listSponsorInquiries(status?: SponsorInquiryStatus) {
  const inquiries = await readInquiries();

  if (!status) {
    return inquiries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  return inquiries
    .filter((inquiry) => inquiry.status === status)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateSponsorInquiryStatus(id: string, status: SponsorInquiryStatus) {
  const inquiries = await readInquiries();
  const index = inquiries.findIndex((inquiry) => inquiry.id === id);

  if (index === -1) {
    return { ok: false as const, error: 'not_found' as const };
  }

  inquiries[index] = { ...inquiries[index], status };
  await writeInquiries(inquiries);

  return { ok: true as const, inquiry: inquiries[index] };
}
