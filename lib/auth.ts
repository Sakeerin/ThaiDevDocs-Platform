import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export { authOptions, isAuthConfigured } from '@/lib/auth-config';

export function getSession() {
  return getServerSession(authOptions);
}
