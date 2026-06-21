'use client';

import dynamic from 'next/dynamic';

const AiChat = dynamic(() => import('@/components/ai-chat').then((mod) => mod.AiChat), {
  ssr: false,
  loading: () => null,
});

type AiChatLazyProps = {
  articleSlug?: string;
  isPro: boolean;
  isLoggedIn: boolean;
};

export function AiChatLazy(props: AiChatLazyProps) {
  return <AiChat {...props} />;
}
