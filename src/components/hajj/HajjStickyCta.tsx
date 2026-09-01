"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { DirArrow } from "@/components/ui/DirArrow";
import { hajjCampaignPreRegPath, isHajjPreRegPath } from "@/data/hajj-campaign-types";
import { HAJJ_MOBILE_PAGE_PADDING, HAJJ_MOBILE_STICKY_CTA } from "@/lib/hajj-cta";

/** Sticky mobile CTA for the Hajj landing page only — never on /vormerkung (§26). */
export function HajjStickyCta({
  children,
  ctaLabel,
  campaignSlug = "hajj-2027",
}: {
  children: React.ReactNode;
  ctaLabel?: string;
  campaignSlug?: string;
}) {
  const pathname = usePathname();
  const t = useTranslations("hajj");
  const label = ctaLabel ?? t("cta");

  if (isHajjPreRegPath(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <div className={HAJJ_MOBILE_PAGE_PADDING}>{children}</div>
      <aside
        className={`fixed inset-x-0 bottom-0 z-40 px-3 pt-3 shadow-[0_-4px_16px_rgba(11,44,74,0.12)] safe-bottom sm:px-4 ${HAJJ_MOBILE_STICKY_CTA}`}
        aria-label={label}
      >
        <Link
          href={hajjCampaignPreRegPath(campaignSlug)}
          className="flex h-14 w-full items-center justify-center gap-1.5 rounded-xl bg-brand-cta text-[15px] font-semibold text-white transition active:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cta"
        >
          {label}
          <DirArrow />
        </Link>
      </aside>
    </>
  );
}
