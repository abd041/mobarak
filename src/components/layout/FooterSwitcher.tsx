"use client";

import { usePathname } from "@/i18n/navigation";
import { HajjPageFooter } from "@/components/hajj/HajjPageFooter";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { isHajjCampaignPath, isHajjPreRegPath } from "@/data/hajj-campaign-types";

export function FooterSwitcher() {
  const pathname = usePathname();
  // The pre-registration page ends at its own CTA — a footer would compete with it.
  if (isHajjPreRegPath(pathname)) {
    return null;
  }
  if (isHajjCampaignPath(pathname)) {
    return <HajjPageFooter />;
  }
  return <SiteFooter />;
}
