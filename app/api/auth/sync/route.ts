import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { syncUserWithApi } from '@/lib/api-client';

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  const synced = await syncUserWithApi({
    githubId: session.user.id,
    login: session.user.login ?? session.user.name ?? 'unknown',
    name: session.user.name,
    email: session.user.email,
    avatar: session.user.image,
  });

  return Response.json({
    synced: Boolean(synced),
    isPro: synced?.is_pro ?? false,
  });
}
