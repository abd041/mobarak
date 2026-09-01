import Image from "next/image";
import type { HajjWhyIcon } from "@/data/hajj-content-defaults";
import { cn } from "@/lib/utils";

const ICON_SRC: Record<HajjWhyIcon, string> = {
  experience: "/brand/icons/hajj-why/experience.png",
  support: "/brand/icons/hajj-why/support.png",
  religious: "/brand/icons/hajj-why/religious.png",
  group: "/brand/icons/hajj-why/group.png",
  onsite: "/brand/icons/hajj-why/onsite.png",
  languages: "/brand/icons/hajj-why/languages.png",
};

export function HajjWhyIconGlyph({
  icon,
  className = "h-7 w-7",
}: {
  icon: HajjWhyIcon;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-block", className)}>
      <Image
        src={ICON_SRC[icon]}
        alt=""
        fill
        className="object-contain"
        sizes="96px"
        quality={90}
      />
    </span>
  );
}

/** Emphasize leading “30+” (or similar) in why-card titles. */
export function HajjWhyCardTitle({ title }: { title: string }) {
  const match = title.match(/^(\d+\+?)\s+(.+)$/);
  if (!match) return <>{title}</>;
  return (
    <>
      <span className="text-[1.12em] tracking-[-0.02em]">{match[1]}</span> {match[2]}
    </>
  );
}
