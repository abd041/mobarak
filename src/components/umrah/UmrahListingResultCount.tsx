"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/** Dynamic trip count below the period filter bar — updates when filters change. */
export function UmrahListingResultCount({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  const t = useTranslations("umrah");

  return (
    <p
      className={cn(
        "mt-0 text-[14px] font-semibold text-navy sm:text-[16px]",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-result-count={count}
    >
      {t("found", { count })}
    </p>
  );
}
