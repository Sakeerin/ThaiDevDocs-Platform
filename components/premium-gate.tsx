import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSubscriptionStatus } from '@/lib/subscription';

type PremiumGateProps = {
  isPremium: boolean;
  children: React.ReactNode;
};

export async function PremiumGate({ isPremium, children }: PremiumGateProps) {
  if (!isPremium) {
    return <>{children}</>;
  }

  const { isPro } = await getSubscriptionStatus();

  if (isPro) {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden rounded-xl border">
      <div className="pointer-events-none select-none blur-sm opacity-60">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-fd-background/70 p-6">
        <div className="max-w-md rounded-xl border bg-fd-card p-6 text-center shadow-sm">
          <Lock className="mx-auto size-5 text-fd-primary" aria-hidden />
          <p className="mt-3 font-semibold">Premium article</p>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            บทความนี้สำหรับ Pro members — อัปเกรดเพื่ออ่านเนื้อหาเต็มและใช้ AI Q&A
          </p>
          <Button asChild className="mt-4">
            <Link href="/pricing">Upgrade to Pro</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
