import Link from 'next/link';
import { ArrowUpRight, GitFork, GitPullRequest, PencilLine } from 'lucide-react';
import { gitConfig } from '@/lib/shared';

const githubRepoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;
const contributingUrl = `${githubRepoUrl}/blob/${gitConfig.branch}/.github/CONTRIBUTING.md`;

const steps = [
  {
    title: '1. Fork repository',
    description: 'Fork repo ไปที่ GitHub account ของคุณ แล้ว clone ลงเครื่อง local',
    icon: GitFork,
  },
  {
    title: '2. สร้าง branch ใหม่',
    description: 'ใช้ branch name ที่สื่อความหมาย เช่น docs/laravel-eager-loading',
    icon: PencilLine,
  },
  {
    title: '3. เขียนหรือแก้ MDX',
    description: 'แก้ไขไฟล์ใน content/docs/ และตรวจ frontmatter ให้ครบทุก field',
    icon: PencilLine,
  },
  {
    title: '4. เปิด Pull Request',
    description: 'Push branch แล้วเปิด PR — GitHub Actions จะ lint MDX, ตรวจ links และสร้าง Vercel preview',
    icon: GitPullRequest,
  },
];

export default function ContributePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">Contribution Guide</h1>
        <p className="text-fd-muted-foreground">
          ThaiDevDocs เป็น open-source docs platform — community สามารถเพิ่มหรือปรับปรุงบทความผ่าน GitHub Pull Request
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={githubRepoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-fd-muted/40"
          >
            GitHub repo
            <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
          <Link
            href={contributingUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-fd-muted/40"
          >
            CONTRIBUTING.md
            <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Workflow</h2>
        <ol className="space-y-4">
          {steps.map((step) => (
            <li key={step.title} className="flex gap-4 rounded-xl border p-4">
              <step.icon className="mt-0.5 size-5 shrink-0 text-fd-primary" aria-hidden />
              <div>
                <p className="font-medium">{step.title}</p>
                <p className="mt-1 text-sm text-fd-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Frontmatter ที่ต้องมี</h2>
        <pre className="overflow-x-auto rounded-xl border bg-fd-muted/30 p-4 text-sm">
{`---
title: "ชื่อบทความ"
description: "คำอธิบายสั้นๆ"
topic: laravel
subtopic: eloquent
tags: [eloquent, performance]
difficulty: intermediate
laravel_version: "11.x"
verified_at: "2026-04-01"
author: github_username
contributors: []
is_premium: false
---`}
        </pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Thai Context</h2>
        <p className="text-sm text-fd-muted-foreground">
          ใช้ตัวอย่างที่สะท้อนบริบทไทย เช่น ชื่อลูกค้าไทย สกุลเงินบาท (฿) และ services ที่ developer ไทยใช้จริง (LINE, PromptPay, PDPA)
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Review process</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-fd-muted-foreground">
          <li>Maintainer review ภายใน 3 วันทำการ</li>
          <li>GitHub Actions ตรวจ MDX frontmatter, stale content และ broken links</li>
          <li>ทุก PR ได้ Vercel preview URL ก่อน merge</li>
          <li>หลัง merge จะ deploy อัตโนมัติ</li>
        </ul>
      </section>
    </div>
  );
}
