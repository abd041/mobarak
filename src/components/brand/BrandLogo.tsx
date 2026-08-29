import Image from "next/image";
import { cn } from "@/lib/utils";
import { IQ } from "@/lib/images";
import { BRAND_LOGO } from "@/lib/brand";

export const LOGO_SRC = BRAND_LOGO.src;

type BrandLogoProps = {
  className?: string;
  height?: number;
  priority?: boolean;
};

export function BrandLogo({
  className,
  height = 42,
  priority = false,
}: BrandLogoProps) {
  const width = Math.round(height * (BRAND_LOGO.width / BRAND_LOGO.height));

  return (
    <Image
      src={BRAND_LOGO.src}
      alt={BRAND_LOGO.alt}
      width={width}
      height={height}
      priority={priority}
      quality={IQ.logo}
      sizes={`${width}px`}
      className={cn("h-auto w-auto object-contain", className)}
      style={{ height, width: "auto", maxHeight: height }}
    />
  );
}
