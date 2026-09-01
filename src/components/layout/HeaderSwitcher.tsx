"use client";

import { usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { HajjPageHeader } from "@/components/hajj/HajjPageHeader";
import { SiteHeader } from "@/components/layout/SiteHeader";

import { isHajjCampaignPath } from "@/data/hajj-campaign-types";

export function HeaderSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const isHajjSection = isHajjCampaignPath(pathname);

  if (isHajjSection) {
    return <HajjPageHeader locale={locale} />;
  }

  return <SiteHeader locale={locale} />;
}
