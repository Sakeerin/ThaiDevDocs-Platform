import { Resend } from 'resend';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const subscribersFile = path.join(process.cwd(), '.data', 'newsletter-subscribers.json');

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  return new Resend(process.env.RESEND_API_KEY);
}

type Subscriber = {
  email: string;
  subscribedAt: string;
};

async function readSubscribers(): Promise<Subscriber[]> {
  try {
    const raw = await fs.readFile(subscribersFile, 'utf8');
    return JSON.parse(raw) as Subscriber[];
  } catch {
    return [];
  }
}

async function writeSubscribers(subscribers: Subscriber[]) {
  await fs.mkdir(path.dirname(subscribersFile), { recursive: true });
  await fs.writeFile(subscribersFile, JSON.stringify(subscribers, null, 2));
}

export async function addSubscriber(email: string) {
  const normalized = email.trim().toLowerCase();
  const subscribers = await readSubscribers();

  if (subscribers.some((subscriber) => subscriber.email === normalized)) {
    return { created: false, email: normalized };
  }

  subscribers.push({ email: normalized, subscribedAt: new Date().toISOString() });
  await writeSubscribers(subscribers);

  return { created: true, email: normalized };
}

export async function listSubscribers() {
  return readSubscribers();
}

export async function sendWelcomeEmail(email: string) {
  if (!isResendConfigured()) {
    return { sent: false, reason: 'not_configured' as const };
  }

  const resend = getResendClient();

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: 'ขอบคุณที่สมัคร ThaiDevDocs Newsletter',
    html: `
      <h1>ยินดีต้อนรับสู่ ThaiDevDocs</h1>
      <p>ขอบคุณที่สมัครรับข่าวสารจากเรา — คุณจะได้รับบทความใหม่ทุกสัปดาห์</p>
      <p>เริ่มอ่าน docs ได้ที่ <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thaidevdocs.com'}/docs">ThaiDevDocs</a></p>
    `,
  });

  return { sent: true as const };
}

export async function sendWeeklyNewsletter(articles: Array<{ title: string; url: string; description: string }>) {
  if (!isResendConfigured()) {
    return { sent: 0, reason: 'not_configured' as const };
  }

  const subscribers = await readSubscribers();
  if (subscribers.length === 0) {
    return { sent: 0, reason: 'no_subscribers' as const };
  }

  const resend = getResendClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thaidevdocs.com';
  const articleList = articles
    .map(
      (article) =>
        `<li><a href="${siteUrl}${article.url}"><strong>${article.title}</strong></a><br/>${article.description}</li>`,
    )
    .join('');

  let sent = 0;

  for (const subscriber of subscribers) {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: subscriber.email,
      subject: 'ThaiDevDocs Weekly — Top 3 articles',
      html: `
        <h1>บทความแนะนำประจำสัปดาห์</h1>
        <ol>${articleList}</ol>
        <p><a href="${siteUrl}/docs">อ่าน docs ทั้งหมด</a></p>
      `,
    });
    sent += 1;
  }

  return { sent };
}

export async function sendLaunchAnnouncement() {
  if (!isResendConfigured()) {
    return { sent: 0, reason: 'not_configured' as const };
  }

  const subscribers = await readSubscribers();
  if (subscribers.length === 0) {
    return { sent: 0, reason: 'no_subscribers' as const };
  }

  const resend = getResendClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thaidevdocs.com';
  let sent = 0;

  for (const subscriber of subscribers) {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: subscriber.email,
      subject: 'ThaiDevDocs v1.0 — เปิดให้ใช้งานแล้ว',
      html: `
        <h1>ThaiDevDocs v1.0 เปิดแล้ว</h1>
        <p>ขอบคุณที่สมัครรับข่าวสารไว้ — ตอนนี้ docs พร้อมใช้งานแล้ว</p>
        <ul>
          <li>57+ articles: Laravel, Vue, DevOps, AI, Thai Context</li>
          <li>AI Q&A ภาษาไทย (Pro)</li>
          <li>Contribute ผ่าน GitHub Pull Request</li>
        </ul>
        <p><a href="${siteUrl}/docs">เริ่มอ่าน docs</a> · <a href="${siteUrl}/pricing">ดู Pro plan</a></p>
      `,
    });
    sent += 1;
  }

  return { sent };
}

export async function sendBetaInvite(email: string) {
  if (!isResendConfigured()) {
    return { sent: false, reason: 'not_configured' as const };
  }

  const resend = getResendClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thaidevdocs.com';

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: 'เชิญทดสอบ ThaiDevDocs ก่อน launch',
    html: `
      <h1>เชิญทดสอบ ThaiDevDocs beta</h1>
      <p>เรากำลังเตรียม launch docs ภาษาไทยสำหรับ Laravel/Vue/DevOps และอยากได้ feedback จากคุณก่อนประกาศสาธารณะ</p>
      <p>ช่วยลอง:</p>
      <ul>
        <li>อ่าน docs และแจ้งจุดที่อ่านยาก/ผิด</li>
        <li>ทด AI Q&A (ถ้ามี Pro access)</li>
        <li>Comment ผ่าน Giscus</li>
      </ul>
      <p><a href="${siteUrl}/docs">เปิด ThaiDevDocs</a></p>
    `,
  });

  return { sent: true as const };
}
