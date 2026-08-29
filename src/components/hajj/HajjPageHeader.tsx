"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Menu, Phone, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { scrollToSection } from "@/lib/scroll-to-section";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

const HAJJ_SECTION_IDS = ["top", "warum-mobarak", "ablauf", "betreuung", "faq"] as const;

type HajjSectionId = (typeof HAJJ_SECTION_IDS)[number];

const HAJJ_NAV: Array<
  | { kind: "section"; id: HajjSectionId; labelKey: "hajj2027" | "whyMobarak" | "process" | "onSite" | "faq" }
  | { kind: "link"; href: "/kontakt"; labelKey: "contact" }
> = [
  { kind: "section", id: "top", labelKey: "hajj2027" },
  { kind: "section", id: "warum-mobarak", labelKey: "whyMobarak" },
  { kind: "section", id: "ablauf", labelKey: "process" },
  { kind: "section", id: "betreuung", labelKey: "onSite" },
  { kind: "section", id: "faq", labelKey: "faq" },
  { kind: "link", href: "/kontakt", labelKey: "contact" },
];

const HEADER_OFFSET = 80;

export function HajjPageHeader({ locale: _locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const tMeta = useTranslations("meta");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<HajjSectionId>("top");

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const sections = HAJJ_SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const id = visible[0]?.target.id;
        if (id && HAJJ_SECTION_IDS.includes(id as HajjSectionId)) {
          setActiveSection(id as HajjSectionId);
        }
      },
      {
        rootMargin: `-${HEADER_OFFSET}px 0px -55% 0px`,
        threshold: [0, 0.15, 0.35, 0.55],
      },
    );

    sections.forEach((section) => observer.observe(section!));
    return () => observer.disconnect();
  }, []);

  const phoneHref = `tel:${tMeta("phone").replace(/\s/g, "")}`;

  const goToSection = (id: HajjSectionId) => {
    setOpen(false);
    scrollToSection(id, HEADER_OFFSET);
    setActiveSection(id);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#eceef1] bg-white/95 backdrop-blur-sm">
      <div className="relative mx-auto flex h-16 max-w-page items-center gap-3 px-4 sm:px-5 md:px-8 lg:h-[4.5rem] lg:px-9.25">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-sm"
          aria-label="Mobarak Hajj & Umrah"
        >
          <BrandLogo height={48} className="lg:hidden" priority />
          <BrandLogo height={64} className="hidden lg:block" priority />
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-5 lg:flex xl:gap-7"
          aria-label={tCommon("menu")}
        >
          {HAJJ_NAV.map((item) => {
            if (item.kind === "link") {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="shrink-0 whitespace-nowrap rounded-sm pb-1 text-[13px] font-medium text-[#3d4f5f] transition hover:text-navy xl:text-[14px]"
                >
                  {t(item.labelKey)}
                </Link>
              );
            }

            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goToSection(item.id)}
                className={cn(
                  "relative shrink-0 cursor-pointer whitespace-nowrap rounded-sm pb-1 text-[13px] font-medium transition xl:text-[14px]",
                  active
                    ? "font-semibold text-brand-orange-ink"
                    : "text-[#3d4f5f] hover:text-navy",
                )}
              >
                {t(item.labelKey)}
                {active ? (
                  <span
                    className="absolute -bottom-0.5 left-1/2 h-0.5 w-7 -translate-x-1/2 rounded-full bg-brand-orange"
                    aria-hidden
                  />
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-2">
          <a
            href={phoneHref}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white transition hover:bg-navy-deep lg:h-11 lg:w-11"
            aria-label={tMeta("phone")}
          >
            <Phone className="h-[18px] w-[18px]" strokeWidth={2} />
          </a>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-navy transition hover:bg-surface lg:hidden"
            aria-label={open ? tCommon("close") : tCommon("menu")}
            aria-expanded={open}
            aria-controls="hajj-mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="hajj-mobile-nav"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-[#eceef1] bg-white lg:hidden"
        >
          <nav className="mx-auto flex max-w-page flex-col gap-1 px-4 py-3" aria-label={tCommon("menu")}>
            {HAJJ_NAV.map((item) => {
              if (item.kind === "link") {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3.5 text-[16px] font-medium text-navy transition hover:bg-surface"
                  >
                    {t(item.labelKey)}
                  </Link>
                );
              }

              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goToSection(item.id)}
                  className={cn(
                    "rounded-xl px-4 py-3.5 text-start text-[16px] font-medium transition",
                    active
                      ? "bg-brand-orange-soft font-semibold text-brand-orange-ink"
                      : "text-navy hover:bg-surface",
                  )}
                >
                  {t(item.labelKey)}
                </button>
              );
            })}

            <a
              href={phoneHref}
              className="dir-ltr-keep mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3.5 text-[15px] font-semibold text-white"
            >
              <Phone className="h-4 w-4" />
              {tMeta("phone")}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
