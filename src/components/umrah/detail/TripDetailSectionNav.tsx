"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { TRIP_DETAIL_NAV } from "@/lib/trip-detail-sections";
import { cn } from "@/lib/utils";

/** Sticky horizontal jump nav — desktop only. */
export function TripDetailSectionNav() {
  const t = useTranslations("umrah");
  const [active, setActive] = useState<string>(TRIP_DETAIL_NAV[0]?.id ?? "gallery");

  useEffect(() => {
    const sections = TRIP_DETAIL_NAV.map(({ id }) => document.getElementById(id)).filter(
      Boolean,
    ) as HTMLElement[];

    if (!sections.length) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        const best = [...ratios.entries()]
          .filter(([, ratio]) => ratio > 0)
          .sort((a, b) => b[1] - a[1])[0]?.[0];
        if (best) setActive(best);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.15, 0.35, 0.55, 0.75] },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className="sticky top-16 z-30 hidden border-b border-line bg-white/95 shadow-card backdrop-blur-md lg:block"
      aria-label={t("sectionNavLabel")}
    >
      <Container className="no-scrollbar flex gap-1.5 overflow-x-auto py-2.5">
        {TRIP_DETAIL_NAV.map(({ id, labelKey }) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition",
              active === id
                ? "bg-brand-cta text-white shadow-sm"
                : "text-navy hover:bg-surface",
            )}
          >
            {t(labelKey)}
          </button>
        ))}
      </Container>
    </nav>
  );
}
