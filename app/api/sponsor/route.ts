import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSponsorInquiry } from '@/lib/sponsor-inquiries';

const bodySchema = z.object({
  companyName: z.string().min(2).max(120),
  contactName: z.string().min(2).max(120),
  email: z.string().email(),
  website: z.union([z.string().url(), z.literal('')]).optional(),
  packageId: z.enum(['sidebar', 'featured']),
  message: z.string().min(20).max(2000),
  budget: z.string().max(120).optional().or(z.literal('')),
  websiteConfirm: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());

    if (body.websiteConfirm) {
      return NextResponse.json({ ok: true, message: 'ขอบคุณ — ทีมจะติดต่อกลับภายใน 2 วันทำการ' });
    }

    const result = await createSponsorInquiry({
      companyName: body.companyName,
      contactName: body.contactName,
      email: body.email,
      website: body.website || undefined,
      packageId: body.packageId,
      message: body.message,
      budget: body.budget || undefined,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 429 });
    }

    return NextResponse.json({
      ok: true,
      id: result.inquiry.id,
      message: 'ส่งคำขอสำเร็จ — ตรวจสอบอีเมลยืนยันและทีมจะติดต่อภายใน 2 วันทำการ',
    });
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }
}
