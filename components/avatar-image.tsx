import Image from 'next/image';

type AvatarImageProps = {
  src: string;
  alt: string;
};

export function AvatarImage({ src, alt }: AvatarImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={64}
      height={64}
      className="size-16 rounded-full border"
      loading="lazy"
    />
  );
}
