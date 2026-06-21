import { getSession } from '@/lib/auth';
import { isDevProEnabled, isDevProLogin } from '@/lib/pro-access';

export async function getSubscriptionStatus() {
  const session = await getSession();
  const login = session?.user?.login ?? session?.user?.name ?? undefined;

  if (isDevProEnabled()) {
    return {
      isPro: true,
      plan: 'pro' as const,
      login,
    };
  }

  if (isDevProLogin(login)) {
    return {
      isPro: true,
      plan: 'pro' as const,
      login,
    };
  }

  return {
    isPro: Boolean(session?.user?.isPro),
    plan: session?.user?.isPro ? ('pro' as const) : ('free' as const),
    login,
  };
}

export function getCheckoutUrl(plan: 'monthly' | 'annual' = 'monthly') {
  const monthly = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_MONTHLY;
  const annual = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_ANNUAL;
  return plan === 'annual' ? annual : monthly;
}

export function getDiscordInviteUrl() {
  return process.env.NEXT_PUBLIC_PRO_DISCORD_INVITE_URL;
}
