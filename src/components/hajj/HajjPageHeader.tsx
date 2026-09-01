"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Menu, Phone, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  hajjCampaignLandingPath,
  parseHajjCampaignSlug,
} from "@/data/hajj-campaign-types";
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

const desktopNavLinkClass =
  "shrink-0 whitespace-nowrap rounded-sm pb-1 text-[13px] font-medium text-[#3d4f5f] transition hover:text-navy xl:text-[14px]";

export function HajjPageHeader({ locale: _locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const tMeta = useTranslations("meta");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();
  const campaignSlug = parseHajjCampaignSlug(pathname) ?? "hajj-2027";
  const landingPath = hajjCampaignLandingPath(campaignSlug);
  const onLandingPage = pathname === landingPath;

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
    if (!onLandingPage) return;

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
  }, [onLandingPage]);

  const phoneHref = `tel:${tMeta("phone").replace(/\s/g, "")}`;

  const goToSection = (id: HajjSectionId) => {
    setOpen(false);
    if (onLandingPage && document.getElementById(id)) {
      scrollToSection(id, HEADER_OFFSET);
      setActiveSection(id);
      return;
    }
    router.push(`${landingPath}#${id}`);
  };

  function DesktopSectionItem({ id, label }: { id: HajjSectionId; label: string }) {
    const active = onLandingPage && activeSection === id;

    if (onLandingPage) {
      return (
        <button
          type="button"
          onClick={() => goToSection(id)}
          className={cn(
            "relative shrink-0 cursor-pointer whitespace-nowrap rounded-sm pb-1 text-[13px] font-medium transition xl:text-[14px]",
            active ? "font-semibold text-brand-orange-ink" : "text-[#3d4f5f] hover:text-navy",
          )}
        >
          {label}
          {active ? (
            <span
              className="absolute -bottom-0.5 left-1/2 h-0.5 w-7 -translate-x-1/2 rounded-full bg-brand-orange"
              aria-hidden
            />
          ) : null}
        </button>
      );
    }

    return (
      <Link href={`${landingPath}#${id}`} className={desktopNavLinkClass}>
        {label}
      </Link>
    );
  }

  function MobileSectionItem({ id, label }: { id: HajjSectionId; label: string }) {
    const active = onLandingPage && activeSection === id;

    if (onLandingPage) {
      return (
        <button
          type="button"
          onClick={() => goToSection(id)}
          className={cn(
            "rounded-xl px-4 py-3.5 text-start text-[16px] font-medium transition",
            active
              ? "bg-brand-orange-soft font-semibold text-brand-orange-ink"
              : "text-navy hover:bg-surface",
          )}
        >
          {label}
        </button>
      );
    }

    return (
      <Link
        href={`${landingPath}#${id}`}
        onClick={() => setOpen(false)}
        className="rounded-xl px-4 py-3.5 text-[16px] font-medium text-navy transition hover:bg-surface"
      >
        {label}
      </Link>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-sm">
      {/*
        §2 Header
        Desktop (lg+): logo + centred nav (Hajj 2027 … Contact) + phone
        Mobile (<lg): logo left · phone + hamburger right — no inline nav links
      */}
      <div className="relative mx-auto flex h-[4.5rem] max-w-page items-center gap-3 px-4 sm:px-5 md:px-8 lg:h-24 lg:px-9.25">
        <Link
          href={landingPath}
          className="flex shrink-0 items-center rounded-sm"
          aria-label="Mobarak Hajj & Umrah"
        >
          <BrandLogo
            height={96}
            priority
            className="!h-14 !max-h-14 w-auto lg:!h-[5.25rem] lg:!max-h-[5.25rem]"
          />
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-5 lg:flex xl:gap-7"
          aria-label={tCommon("menu")}
        >
          {HAJJ_NAV.map((item) => {
            if (item.kind === "link") {
              return (
                <Link key={item.href} href={item.href} className={desktopNavLinkClass}>
                  {t(item.labelKey)}
                </Link>
              );
            }

            return (
              <DesktopSectionItem key={item.id} id={item.id} label={t(item.labelKey)} />
            );
          })}
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
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
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-white lg:hidden"
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

              return (
                <MobileSectionItem key={item.id} id={item.id} label={t(item.labelKey)} />
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
