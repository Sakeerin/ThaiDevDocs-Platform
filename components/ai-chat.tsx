'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, MessageCircle, RotateCcw, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AI_DAILY_QUERY_LIMIT } from '@/lib/rag/types';

type AiChatProps = {
  articleSlug?: string;
  isPro: boolean;
  isLoggedIn: boolean;
};

type AiUsage = {
  used: number;
  remaining: number;
  limit: number;
};

type AiSource = {
  title: string;
  heading: string;
  url: string;
};

export function AiChat({ articleSlug, isPro, isLoggedIn }: AiChatProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [usage, setUsage] = useState<AiUsage>({
    used: 0,
    remaining: AI_DAILY_QUERY_LIMIT,
    limit: AI_DAILY_QUERY_LIMIT,
  });
  const [sources, setSources] = useState<AiSource[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/ai',
        body: { articleSlug },
      }),
    [articleSlug],
  );

  const { messages, sendMessage, status, setMessages, clearError } = useChat({
    transport,
    onError: (error) => {
      if (error.message.includes('403')) {
        setErrorMessage('AI Q&A สำหรับ Pro members เท่านั้น');
        return;
      }

      if (error.message.includes('429')) {
        setErrorMessage('ใช้ quota ครบแล้ววันนี้ (20 queries/วัน)');
        return;
      }

      if (error.message.includes('404')) {
        setErrorMessage('ยังไม่พบเนื้อหาที่เกี่ยวข้องใน ThaiDevDocs');
        return;
      }

      setErrorMessage('เกิดข้อผิดพลาด ลองใหม่อีกครั้ง');
    },
  });

  useEffect(() => {
    if (!open || !isLoggedIn || !isPro) return;

    fetch('/api/ai/usage')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data) setUsage(data);
      })
      .catch(() => undefined);
  }, [open, isLoggedIn, isPro, messages.length]);

  const isLoading = status === 'submitted' || status === 'streaming';

  const hint = useMemo(() => {
    if (!isLoggedIn) return 'Login ด้วย GitHub เพื่อถาม AI';
    if (!isPro) return 'Upgrade เป็น Pro เพื่อใช้ AI Q&A';
    return `${usage.remaining}/${usage.limit} queries เหลือวันนี้`;
  }, [isLoggedIn, isPro, usage.limit, usage.remaining]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    clearError();
    sendMessage({ text });
    setInput('');
  }

  function handleClear() {
    setMessages([]);
    setSources([]);
    setErrorMessage(null);
    clearError();
  }

  return (
    <>
      <Button
        type="button"
        size="lg"
        className="fixed bottom-6 right-6 z-40 shadow-lg"
        onClick={() => setOpen(true)}
      >
        <Sparkles className="size-4" aria-hidden />
        ถาม AI
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close AI chat"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex h-[min(720px,calc(100vh-2rem))] w-full max-w-md flex-col overflow-hidden rounded-2xl border bg-fd-background shadow-2xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <Bot className="size-5 text-fd-primary" aria-hidden />
                <div>
                  <p className="font-semibold">ThaiDevDocs AI</p>
                  <p className="text-xs text-fd-muted-foreground">{hint}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon-sm" onClick={handleClear}>
                  <RotateCcw className="size-4" aria-hidden />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => setOpen(false)}>
                  <X className="size-4" aria-hidden />
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {!isLoggedIn ? (
                <div className="rounded-xl border border-dashed p-4 text-sm">
                  <p className="font-medium">Login ก่อนใช้งาน AI Q&A</p>
                  <p className="mt-2 text-fd-muted-foreground">
                    ใช้ GitHub account เพื่อถามคำถามจาก docs context
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/login">Login with GitHub</Link>
                  </Button>
                </div>
              ) : null}

              {isLoggedIn && !isPro ? (
                <div className="rounded-xl border border-dashed p-4 text-sm">
                  <p className="font-medium">AI Q&A สำหรับ Pro members</p>
                  <p className="mt-2 text-fd-muted-foreground">
                    อัปเกรดเป็น Pro ฿99/เดือน เพื่อถามคำถามภาษาไทยจาก docs จริง
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/pricing">ดูแผน Pro</Link>
                  </Button>
                </div>
              ) : null}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'rounded-xl px-3 py-2 text-sm',
                    message.role === 'user'
                      ? 'ml-8 bg-fd-primary text-fd-primary-foreground'
                      : 'mr-8 border bg-fd-card',
                  )}
                >
                  {message.parts.map((part, index) =>
                    part.type === 'text' ? (
                      <ReactMarkdown key={index}>{part.text}</ReactMarkdown>
                    ) : null,
                  )}
                </div>
              ))}

              {isLoading ? (
                <div className="flex items-center gap-2 text-sm text-fd-muted-foreground">
                  <MessageCircle className="size-4 animate-pulse" aria-hidden />
                  กำลังค้นหาคำตอบ...
                </div>
              ) : null}

              {errorMessage ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              ) : null}

              {sources.length > 0 ? (
                <div className="rounded-xl border p-3 text-sm">
                  <p className="mb-2 font-medium">Sources</p>
                  <ul className="space-y-1">
                    {sources.map((source) => (
                      <li key={source.url}>
                        <Link href={source.url} className="text-fd-primary underline">
                          {source.title} — {source.heading}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="border-t p-4">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="ถามเป็นภาษาไทย เช่น 'N+1 query แก้ยังไง?'"
                  disabled={!isLoggedIn || !isPro || isLoading}
                  className="min-w-0 flex-1 rounded-lg border bg-fd-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
                />
                <Button type="submit" disabled={!isLoggedIn || !isPro || isLoading || !input.trim()}>
                  ถาม
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
