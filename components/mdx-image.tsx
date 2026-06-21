import Image from 'next/image';
import type { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type MdxImageProps = ImgHTMLAttributes<HTMLImageElement>;

function parseDimension(value: string | number | undefined, fallback: number) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isNaN(parsed)) return parsed;
  }

  return fallback;
}

export function MdxImage({ src, alt, className, width, height, ...props }: MdxImageProps) {
  if (!src || typeof src !== 'string') {
    return null;
  }

  const resolvedWidth = parseDimension(width, 800);
  const resolvedHeight = parseDimension(height, 450);

  return (
    <Image
      src={src}
      alt={alt ?? ''}
      width={resolvedWidth}
      height={resolvedHeight}
      loading="lazy"
      sizes="(max-width: 768px) 100vw, 720px"
      className={cn('my-4 h-auto w-full rounded-lg border', className)}
      {...props}
    />
  );
}
