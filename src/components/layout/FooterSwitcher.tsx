"use client";

import { usePathname } from "@/i18n/navigation";
import { HajjPageFooter } from "@/components/hajj/HajjPageFooter";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { isHajjCampaignPath } from "@/data/hajj-campaign-types";

export function FooterSwitcher() {
  const pathname = usePathname();
  if (isHajjCampaignPath(pathname)) {
    return <HajjPageFooter />;
  }
  return <SiteFooter />;
}
