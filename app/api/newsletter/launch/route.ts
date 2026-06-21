import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendBetaInvite, sendLaunchAnnouncement } from '@/lib/newsletter';

function authorize(request: Request) {
  const secret = request.headers.get('authorization')?.replace('Bearer ', '');
  return Boolean(secret && secret === process.env.CRON_SECRET);
}

const betaSchema = z.object({
  action: z.literal('beta-invite'),
  email: z.string().email(),
});

const launchSchema = z.object({
  action: z.literal('launch-announcement'),
});

export async function POST(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (body.action === 'beta-invite') {
      const parsed = betaSchema.parse(body);
      const result = await sendBetaInvite(parsed.email);
      return NextResponse.json({ ok: true, ...result });
    }

    if (body.action === 'launch-announcement') {
      launchSchema.parse(body);
      const result = await sendLaunchAnnouncement();
      return NextResponse.json({ ok: true, ...result });
    }

    return NextResponse.json({ error: 'invalid_action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }
}
