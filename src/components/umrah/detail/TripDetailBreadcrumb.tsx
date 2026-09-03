"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useTripFlowContextOptional } from "@/components/umrah/TripFlowProvider";
import { cn } from "@/lib/utils";

/** Breadcrumb on trip detail — overlay on hero image or standalone bar. */
export function TripDetailBreadcrumb({
  dateLabel,
  overlay = false,
}: {
  dateLabel: string;
  overlay?: boolean;
}) {
  const tNav = useTranslations("nav");
  const flow = useTripFlowContextOptional();
  const listingHref = flow?.listingPath ?? "/umrah-gruppenreisen";

  return (
    <div
      className={cn(
        overlay ? "relative z-20 bg-transparent" : "border-b border-line bg-white",
      )}
    >
      <nav
        className={cn(
          "mx-auto flex max-w-page flex-wrap items-center gap-1.5 px-4 pt-3 pb-5 text-[12px] font-medium md:px-8 md:text-[13px] lg:px-10 lg:pt-3 lg:pb-5",
          overlay ? "text-[#8A97A6]" : "text-[#111111]",
        )}
        aria-label="Breadcrumb"
      >
        <Link
          href="/"
          className={cn(
            "transition",
            overlay ? "text-[#8A97A6] hover:text-[#111111]" : "text-muted hover:text-[#111111]",
          )}
        >
          {tNav("home")}
        </Link>
        <span className="text-[#C0C7D1]" aria-hidden>
          &gt;
        </span>
        <Link
          href={listingHref}
          className={cn(
            "transition",
            overlay ? "text-[#8A97A6] hover:text-[#111111]" : "text-muted hover:text-[#111111]",
          )}
        >
          {tNav("umrahGroup")}
        </Link>
        <span className="text-[#C0C7D1]" aria-hidden>
          &gt;
        </span>
        <span className={cn("font-semibold", overlay ? "text-[#5B6B7C]" : "text-[#111111]")}>
          {dateLabel}
        </span>
      </nav>
    </div>
  );
}
