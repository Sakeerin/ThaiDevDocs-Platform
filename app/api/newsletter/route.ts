import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addSubscriber, isResendConfigured, sendWelcomeEmail } from '@/lib/newsletter';

const bodySchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const result = await addSubscriber(body.email);

    if (isResendConfigured()) {
      await sendWelcomeEmail(result.email);
    }

    return NextResponse.json({
      ok: true,
      created: result.created,
      message: result.created
        ? 'ขอบคุณที่สมัคร — articles ใหม่ทุกสัปดาห์'
        : 'อีเมลนี้สมัครไว้แล้ว',
    });
  } catch {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }
}
