'use client';

import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { isAuthConfigured } from '@/lib/auth-config';

export default function LoginPage() {
  const { data: session, status } = useSession();

  if (status === 'authenticated' && session?.user) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold">Signed in</h1>
        <p className="text-fd-muted-foreground">
          ยินดีต้อนรับ {session.user.login ?? session.user.name}
        </p>
        <Button asChild>
          <Link href="/profile">Go to profile</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Login with GitHub</h1>
        <p className="text-sm text-fd-muted-foreground">
          ใช้ GitHub account เพื่อ comment, track contributions และเข้าถึง community features
        </p>
      </div>

      {!isAuthConfigured() ? (
        <div className="rounded-xl border border-dashed p-4 text-left text-sm text-fd-muted-foreground">
          <p className="font-medium text-foreground">Auth ยังไม่ได้ตั้งค่า</p>
          <p className="mt-2">
            ตั้งค่า <code className="rounded bg-fd-muted px-1">GITHUB_CLIENT_ID</code>,{' '}
            <code className="rounded bg-fd-muted px-1">GITHUB_CLIENT_SECRET</code>, และ{' '}
            <code className="rounded bg-fd-muted px-1">NEXTAUTH_SECRET</code> ใน{' '}
            <code className="rounded bg-fd-muted px-1">.env.local</code>
          </p>
        </div>
      ) : (
        <Button type="button" size="lg" onClick={() => signIn('github', { callbackUrl: '/profile' })}>
          Continue with GitHub
        </Button>
      )}

      <p className="text-xs text-fd-muted-foreground">
        ยังไม่มี account?{' '}
        <a
          href="https://github.com/join"
          target="_blank"
          rel="noreferrer noopener"
          className="underline"
        >
          สมัคร GitHub ฟรี
        </a>
      </p>
    </div>
  );
}
