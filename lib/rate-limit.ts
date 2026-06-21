import { promises as fs } from 'node:fs';
import path from 'node:path';
import { AI_DAILY_QUERY_LIMIT } from '@/lib/rag/types';

type UsageRecord = {
  count: number;
  date: string;
};

const usageFile = path.join(process.cwd(), '.data', 'ai-usage.json');

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

async function readUsageStore(): Promise<Record<string, UsageRecord>> {
  try {
    const raw = await fs.readFile(usageFile, 'utf8');
    return JSON.parse(raw) as Record<string, UsageRecord>;
  } catch {
    return {};
  }
}

async function writeUsageStore(store: Record<string, UsageRecord>) {
  await fs.mkdir(path.dirname(usageFile), { recursive: true });
  await fs.writeFile(usageFile, JSON.stringify(store, null, 2));
}

export async function getAiUsage(userKey: string) {
  const store = await readUsageStore();
  const today = todayKey();
  const record = store[userKey];

  if (!record || record.date !== today) {
    return {
      used: 0,
      remaining: AI_DAILY_QUERY_LIMIT,
      limit: AI_DAILY_QUERY_LIMIT,
    };
  }

  return {
    used: record.count,
    remaining: Math.max(0, AI_DAILY_QUERY_LIMIT - record.count),
    limit: AI_DAILY_QUERY_LIMIT,
  };
}

export async function incrementAiUsage(userKey: string) {
  const store = await readUsageStore();
  const today = todayKey();
  const current = store[userKey]?.date === today ? store[userKey].count : 0;

  if (current >= AI_DAILY_QUERY_LIMIT) {
    return {
      allowed: false,
      ...await getAiUsage(userKey),
    };
  }

  store[userKey] = { count: current + 1, date: today };
  await writeUsageStore(store);

  return {
    allowed: true,
    ...(await getAiUsage(userKey)),
  };
}

export async function isRateLimited(userKey: string) {
  const usage = await getAiUsage(userKey);
  return usage.remaining <= 0;
}
