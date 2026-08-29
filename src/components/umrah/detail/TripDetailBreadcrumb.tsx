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
        overlay
          ? "relative z-20 border-b border-white/25 bg-white/10 backdrop-blur-[2px]"
          : "border-b border-line bg-white",
      )}
    >
      <nav
        className={cn(
          "mx-auto flex max-w-page flex-wrap items-center gap-1 px-4 py-2.5 text-[12px] font-medium md:px-8 md:text-[13px] lg:px-10",
          overlay ? "text-white/90" : "text-navy",
        )}
        aria-label="Breadcrumb"
      >
        <Link
          href="/"
          className={cn(
            "transition",
            overlay ? "text-white/75 hover:text-white" : "text-muted hover:text-navy",
          )}
        >
          {tNav("home")}
        </Link>
        <span className={overlay ? "text-white/50" : "text-muted/60"} aria-hidden>
          &gt;
        </span>
        <Link
          href={listingHref}
          className={cn(
            "transition",
            overlay ? "text-white/75 hover:text-white" : "text-muted hover:text-navy",
          )}
        >
          {tNav("umrahGroup")}
        </Link>
        <span className={overlay ? "text-white/50" : "text-muted/60"} aria-hidden>
          &gt;
        </span>
        <span className={cn("font-semibold", overlay ? "text-white" : "text-navy")}>
          {dateLabel}
        </span>
      </nav>
    </div>
  );
}
