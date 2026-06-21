import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getCheckoutUrl, getDiscordInviteUrl, getSubscriptionStatus } from '@/lib/subscription';
import { Button } from '@/components/ui/button';

export default async function BillingSettingsPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login?callbackUrl=/settings/billing');
  }

  const status = await getSubscriptionStatus();
  const discordInvite = getDiscordInviteUrl();
  const monthlyCheckout = getCheckoutUrl('monthly');

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-fd-muted-foreground">
          จัดการแผน Pro สำหรับ {session.user.login ?? session.user.name}
        </p>
      </header>

      <section className="rounded-xl border p-6">
        <p className="text-sm text-fd-muted-foreground">Current plan</p>
        <p className="mt-2 text-2xl font-semibold capitalize">{status.plan}</p>
        <p className="mt-2 text-sm text-fd-muted-foreground">
          {status.isPro
            ? 'AI Q&A และ premium articles พร้อมใช้งาน'
            : 'อัปเกรดเป็น Pro เพื่อปลดล็อก AI Q&A'}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {!status.isPro && monthlyCheckout ? (
            <Button asChild>
              <Link href={monthlyCheckout} target="_blank" rel="noreferrer noopener">
                Upgrade to Pro
              </Link>
            </Button>
          ) : null}
          <Button asChild variant="outline">
            <Link href="/pricing">View pricing</Link>
          </Button>
        </div>
      </section>

      {status.isPro && discordInvite ? (
        <section className="rounded-xl border p-6">
          <p className="font-medium">Pro Discord community</p>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            เข้าร่วม private Discord สำหรับ Pro members
          </p>
          <Button asChild className="mt-4">
            <Link href={discordInvite} target="_blank" rel="noreferrer noopener">
              Join Discord
            </Link>
          </Button>
        </section>
      ) : null}
    </div>
  );
}
