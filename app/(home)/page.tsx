import Link from 'next/link';
import { ArrowRight, BookOpen, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { createPageMetadata } from '@/lib/seo';
import { source } from '@/lib/source';

export const metadata = createPageMetadata({
  title: 'ThaiDevDocs',
  description:
    'เอกสาร Laravel, Vue, DevOps และ AI สำหรับ developer ไทย — อ่านฟรี, contribute ผ่าน GitHub, AI Q&A สำหรับ Pro',
  path: '/',
});

const topics = [
  { name: 'Laravel', href: '/docs/laravel', description: 'Eloquent, Queue, Testing, Policies' },
  { name: 'Vue.js', href: '/docs/vue', description: 'Composition API, Pinia, Inertia.js' },
  { name: 'DevOps', href: '/docs/devops', description: 'Docker, CI/CD, Forge, Redis' },
  { name: 'AI', href: '/docs/ai', description: 'Claude API, RAG, pgvector, LINE Bot' },
  {
    name: 'Thai Context',
    href: '/docs/thai-context',
    description: 'PromptPay, PDPA, LINE, ภาษีไทย',
  },
];

export default function HomePage() {
  const articleCount = source.getPages().filter((page) => page.url !== '/docs').length;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-12 md:py-20">
      <section className="mx-auto max-w-3xl space-y-6 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-fd-muted-foreground">
          <Sparkles className="size-4 text-fd-primary" aria-hidden />
          {articleCount}+ articles · community-driven
        </p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          เอกสารสำหรับ developer ไทย
        </h1>
        <p className="text-lg text-fd-muted-foreground">
          Laravel, Vue, DevOps และ AI — เขียนด้วยบริบทไทย อัปเดตผ่าน GitHub Pull Request
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/docs">
              เริ่มอ่าน docs
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contribute">Contribute</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <Link
            key={topic.href}
            href={topic.href}
            className="group rounded-2xl border p-5 transition-colors hover:border-fd-primary/40 hover:bg-fd-muted/30"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="size-5 text-fd-primary" aria-hidden />
              <p className="font-semibold">{topic.name}</p>
            </div>
            <p className="mt-2 text-sm text-fd-muted-foreground">{topic.description}</p>
          </Link>
        ))}
        <Link
          href="/pricing"
          className="group rounded-2xl border border-fd-primary/30 bg-fd-primary/5 p-5 transition-colors hover:bg-fd-primary/10"
        >
          <div className="flex items-center gap-2">
            <Bot className="size-5 text-fd-primary" aria-hidden />
            <p className="font-semibold">AI Q&A Pro</p>
          </div>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            ถามคำถามภาษาไทยจาก docs context — ฿99/เดือน
          </p>
        </Link>
      </section>

      <section className="mx-auto w-full max-w-xl">
        <NewsletterSignup />
      </section>
    </div>
  );
}
