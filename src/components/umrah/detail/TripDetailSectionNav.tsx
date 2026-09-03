"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { TRIP_DETAIL_NAV, type TripDetailSectionId } from "@/lib/trip-detail-sections";
import { cn } from "@/lib/utils";

type NavItem = (typeof TRIP_DETAIL_NAV)[number];

/** Only keep jump-nav tabs whose target section is actually on the page. */
function getMountedNavItems(): NavItem[] {
  return TRIP_DETAIL_NAV.filter(({ id }) => document.getElementById(id) != null);
}

/**
 * Section jump nav — hidden in its static spot under the hero;
 * appears fixed under the site header once the hero is scrolled past.
 */
export function TripDetailSectionNav() {
  const t = useTranslations("umrah");
  const [items, setItems] = useState<NavItem[]>(TRIP_DETAIL_NAV);
  const [active, setActive] = useState<string>(TRIP_DETAIL_NAV[0]?.id ?? "hotels");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const syncItems = () => {
      const next = getMountedNavItems();
      setItems(next);
      setActive((prev) =>
        next.some((item) => item.id === prev) ? prev : (next[0]?.id ?? prev),
      );
    };

    syncItems();
    // Client sections (gallery/faq) may mount a tick later
    const raf = requestAnimationFrame(syncItems);
    const timer = window.setTimeout(syncItems, 100);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!items.length) return;

    const sections = items
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

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
  }, [items]);

  useEffect(() => {
    const hero = document.getElementById("overview");
    if (!hero) return;

    const sync = () => {
      const headerOffset = 64; // site header (~top-16)
      const heroBottom = hero.getBoundingClientRect().bottom;
      setVisible(heroBottom <= headerOffset + 8);
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const scrollTo = (id: TripDetailSectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!items.length) return null;

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-16 z-30 border-b border-line bg-white/95 shadow-card backdrop-blur-md transition duration-200",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0",
      )}
      aria-label={t("sectionNavLabel")}
      aria-hidden={!visible}
    >
      <Container className="no-scrollbar flex gap-1.5 overflow-x-auto py-2.5">
        {items.map(({ id, labelKey }) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            tabIndex={visible ? 0 : -1}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition",
              active === id
                ? "bg-brand-cta text-white shadow-sm"
                : "text-[#111111] hover:bg-surface",
            )}
          >
            {t(labelKey)}
          </button>
        ))}
      </Container>
    </nav>
  );
}
