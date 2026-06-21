import { getSession } from '@/lib/auth';
import { getAiUsage } from '@/lib/rate-limit';
import { AI_DAILY_QUERY_LIMIT } from '@/lib/rag/types';

export async function GET() {
  const session = await getSession();

  if (!session?.user) {
    return Response.json({ error: 'login_required' }, { status: 401 });
  }

  const userKey = session.user.login ?? session.user.email ?? session.user.id ?? 'anonymous';
  const usage = await getAiUsage(userKey);

  return Response.json({
    ...usage,
    limit: AI_DAILY_QUERY_LIMIT,
  });
}
