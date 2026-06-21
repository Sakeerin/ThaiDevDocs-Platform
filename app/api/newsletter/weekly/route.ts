import { NextResponse } from 'next/server';
import { source } from '@/lib/source';
import { sendWeeklyNewsletter } from '@/lib/newsletter';

function authorize(request: Request) {
  const secret = request.headers.get('authorization')?.replace('Bearer ', '');
  return Boolean(secret && secret === process.env.CRON_SECRET);
}

async function runWeeklyNewsletter() {
  const pages = source
    .getPages()
    .filter((page) => page.url !== '/docs')
    .sort((a, b) => new Date(b.data.verified_at).getTime() - new Date(a.data.verified_at).getTime())
    .slice(0, 3)
    .map((page) => ({
      title: page.data.title,
      url: page.url,
      description: page.data.description ?? page.data.title,
    }));

  const result = await sendWeeklyNewsletter(pages);

  return NextResponse.json({ ok: true, ...result, articles: pages });
}

export async function GET(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  return runWeeklyNewsletter();
}

export async function POST(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  return runWeeklyNewsletter();
}
