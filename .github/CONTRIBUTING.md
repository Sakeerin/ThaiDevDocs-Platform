# Contributing to ThaiDevDocs

ขอบคุณที่สนใจ contribute ให้ ThaiDevDocs! โปรเจกต์นี้เป็น docs platform สำหรับ developer ไทย เนื้อหาอยู่ใน MDX ภายใต้ `content/docs/`

## วิธี Contribute

1. Fork repository
2. สร้าง branch ใหม่ (`docs/your-topic`)
3. เขียนหรือแก้ไข MDX ใน `content/docs/`
4. เปิด Pull Request พร้อม checklist ใน PR template
5. รอ review จาก maintainer

ดู workflow แบบ step-by-step ได้ที่ `/contribute` บนเว็บไซต์

## สิ่งที่ต้องมีทุก article

- frontmatter ครบทุก field (`title`, `description`, `topic`, `subtopic`, `tags`, `difficulty`, `verified_at`, `author`)
- ระบุ `laravel_version` หรือ `vue_version` ตาม topic
- อธิบายเป็นภาษาไทยที่เข้าใจง่าย
- ตัวอย่าง code ที่ runnable และ test แล้ว
- บอก framework version ที่ code ใช้ได้

## Thai Context หมายถึงอะไร?

แทนที่จะเขียน:

```php
$user = User::find(1); // John Smith, USD
```

เขียนว่า:

```php
$order = Order::find(1); // สมชาย ใจดี, ฿ (บาท)
```

ใช้บริบทไทยเมื่อเป็นไปได้: LINE, PromptPay, PDPA, DBD, วันที่ พ.ศ.

## Code Standards

- ทุก code block ต้องระบุ language: ` ```php `, ` ```javascript `
- ❌ bad code ให้ comment กำกับ
- ✅ good code ให้ comment กำกับ
- ทดสอบ code ใน local ก่อน submit

## Review Process

- Maintainer review ภายใน 3 วันทำการ
- ถ้ายังไม่ได้ review ใน 5 วัน → ping maintainer ใน PR
- GitHub Actions จะตรวจ frontmatter, stale content, content QA และ broken links

## Content QA ก่อนเปิด PR

```bash
npm run content:check
```

Script จะตรวจ:
- frontmatter ครบถ้วน
- code block มี language tag
- internal links `/docs/...` ชี้ไปหน้าที่มีจริง
- JSON blocks ไม่มี comment ปน (ใช้ `typescript` สำหรับ tsconfig)

Optional flags:
- `npm run content:qa -- --strict` — fail เมื่อมี warnings
- `npm run content:qa -- --php` — lint PHP snippets (ถ้ามี PHP ใน PATH)
- `npm run content:fix-fences` — แก้ bare ` ``` ` เป็น ` ```text ` อัตโนมัติ
- ทุก PR จะได้ Vercel preview URL (เมื่อเชื่อม Vercel กับ repo แล้ว)

## Getting Help

- เปิด issue สำหรับคำถามทั่วไป
- ใช้ issue template "Suggest update" สำหรับบทความที่ outdated
- ดู contribution guide บนเว็บ: `/contribute`
