import {
  BookOpen,
  Clock3,
  Globe2,
  MapPin,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { HajjWhyIcon } from "@/data/hajj-content-defaults";

const ICONS: Record<HajjWhyIcon, LucideIcon> = {
  experience: Clock3,
  support: UserRound,
  religious: BookOpen,
  group: Users,
  onsite: MapPin,
  languages: Globe2,
};

export function HajjWhyIconGlyph({
  icon,
  className = "h-7 w-7",
}: {
  icon: HajjWhyIcon;
  className?: string;
}) {
  const Icon = ICONS[icon];
  return <Icon className={className} strokeWidth={1.75} aria-hidden />;
}
