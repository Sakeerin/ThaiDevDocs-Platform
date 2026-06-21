'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { isAuthConfigured } from '@/lib/auth-config';

export function AuthNavLink() {
  const { data: session, status } = useSession();

  if (!isAuthConfigured()) {
    return (
      <Link href="/login" className="hover:text-foreground">
        Login
      </Link>
    );
  }

  if (status === 'loading') {
    return <span className="text-fd-muted-foreground">...</span>;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/profile" className="hover:text-foreground">
          {session.user.login ?? session.user.name ?? 'Profile'}
        </Link>
        <Button type="button" variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <Link href="/login" className="hover:text-foreground">
      Login
    </Link>
  );
}
