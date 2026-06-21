'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NewsletterSignupProps = {
  className?: string;
  compact?: boolean;
};

export function NewsletterSignup({ className, compact = false }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? 'subscription_failed');
      }

      setStatus('success');
      setMessage(data.message ?? 'สมัครสำเร็จ — ตรวจสอบอีเมลของคุณ');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('สมัครไม่สำเร็จ ลองใหม่อีกครั้ง');
    }
  }

  return (
    <div className={cn('rounded-xl border bg-fd-card p-4', className)}>
      {!compact ? (
        <div className="mb-3">
          <p className="font-medium">Newsletter</p>
          <p className="text-sm text-fd-muted-foreground">รับบทความใหม่ทุกสัปดาห์</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="your@email.com"
          className="min-w-0 flex-1 rounded-lg border bg-fd-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
        />
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'กำลังสมัคร...' : 'Subscribe'}
        </Button>
      </form>

      {message ? (
        <p
          className={cn(
            'mt-2 text-sm',
            status === 'success' ? 'text-emerald-600' : 'text-destructive',
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
