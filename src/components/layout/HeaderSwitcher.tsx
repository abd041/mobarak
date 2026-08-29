"use client";

import { usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { HajjPageHeader } from "@/components/hajj/HajjPageHeader";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function HeaderSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const isHajjLanding = pathname === "/hajj-2027";

  if (isHajjLanding) {
    return <HajjPageHeader locale={locale} />;
  }

  return <SiteHeader locale={locale} />;
}
