export type SponsorPackageId = 'sidebar' | 'featured';

export type SponsorPackage = {
  id: SponsorPackageId;
  name: string;
  priceLabel: string;
  tier: 'silver' | 'gold';
  description: string;
  features: string[];
  highlighted?: boolean;
};

export const SPONSOR_PACKAGES: SponsorPackage[] = [
  {
    id: 'sidebar',
    name: 'Sidebar',
    priceLabel: '฿3,000–5,000/เดือน',
    tier: 'silver',
    description: 'Logo + link ใน docs sidebar ทุกหน้า — เหมาะกับ dev tools และ SaaS B2B',
    features: [
      '1 sponsor slot ใน docs sidebar',
      'Logo + tagline + link ไป landing page',
      'Plausible click tracking',
      'รายงาน impressions รายเดือน (on request)',
    ],
  },
  {
    id: 'featured',
    name: 'Featured',
    priceLabel: '฿8,000–15,000/เดือน',
    tier: 'gold',
    description: 'Placement สูงสุด + mention ใน newsletter — เหมาะกับ brand ที่ต้องการ reach กว้าง',
    features: [
      'Sidebar placement ลำดับแรก (gold tier)',
      'Mention บน homepage sponsor section',
      'Newsletter mention 1 ครั้ง/ไตรมาส',
      'Priority support สำหรับ creative update',
    ],
    highlighted: true,
  },
];

export const SPONSOR_ONBOARDING_STEPS = [
  {
    step: 1,
    title: 'ส่ง inquiry',
    description: 'กรอกฟอร์มพร้อม company profile และ package ที่สนใจ — ตอบกลับภายใน 2 วันทำการ',
  },
  {
    step: 2,
    title: 'Review & ใบเสนอราคา',
    description: 'ทีมเราตรวจ audience fit และส่งใบเสนอราคา + media kit (logo spec, tagline limit)',
  },
  {
    step: 3,
    title: 'ชำระเงิน & ส่ง creative',
    description: 'โอน/invoice ตามที่ตกลง แล้วส่ง logo (SVG/PNG), tagline และ landing URL',
  },
  {
    step: 4,
    title: 'Go live',
    description: 'เพิ่มใน sidebar ภายใน 3 วันทำการหลังได้รับ creative — แจ้งเมื่อ live พร้อม report',
  },
] as const;

export function getSponsorPackage(id: SponsorPackageId) {
  return SPONSOR_PACKAGES.find((pkg) => pkg.id === id);
}
