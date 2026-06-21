import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';
import { appName } from '@/lib/shared';

export const revalidate = false;

export async function GET() {
  return new ImageResponse(
    <DefaultImage
      title={appName}
      description="เอกสาร Laravel, Vue, DevOps และ AI สำหรับ developer ไทย"
      site={appName}
    />,
    {
      width: 1200,
      height: 630,
    },
  );
}
