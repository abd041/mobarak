"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { DirArrow } from "@/components/ui/DirArrow";
import {
  hajjCampaignLandingPath,
  hajjCampaignPreRegPath,
  parseHajjCampaignSlug,
} from "@/data/hajj-campaign-types";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { scrollToSection } from "@/lib/scroll-to-section";
import { cn } from "@/lib/utils";

const HAJJ_SECTION_IDS = [
  "top",
  "ablauf",
  "nusuk",
  "vorbereitung",
  "betreuung",
  "faq",
] as const;

type HajjSectionId = (typeof HAJJ_SECTION_IDS)[number];

const HAJJ_NAV: Array<
  | {
      kind: "section";
      id: HajjSectionId;
      labelKey:
        | "hajj2027"
        | "process"
        | "nusuk"
        | "preparation"
        | "care"
        | "faq";
    }
  | { kind: "link"; href: "/ueber-uns"; labelKey: "about" }
> = [
  { kind: "section", id: "top", labelKey: "hajj2027" },
  { kind: "section", id: "ablauf", labelKey: "process" },
  { kind: "section", id: "nusuk", labelKey: "nusuk" },
  { kind: "section", id: "vorbereitung", labelKey: "preparation" },
  { kind: "section", id: "betreuung", labelKey: "care" },
  { kind: "section", id: "faq", labelKey: "faq" },
  { kind: "link", href: "/ueber-uns", labelKey: "about" },
];

const HEADER_OFFSET = 72;
const CTA_BLUE = "#1264F5";

export function HajjPageHeader({ locale: _locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const t = useTranslations("nav");
  const tLang = useTranslations("language");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();
  const current = useLocale() as Locale;
  const campaignSlug = parseHajjCampaignSlug(pathname) ?? "hajj-2027";
  const landingPath = hajjCampaignLandingPath(campaignSlug);
  const onLandingPage = pathname === landingPath;
  void _locale;

  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
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
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const id = visible[0]?.target.id;
        if (id && HAJJ_SECTION_IDS.includes(id as HajjSectionId)) {
          setActiveSection(id as HajjSectionId);
        }
      },
      { rootMargin: `-${HEADER_OFFSET}px 0px -55% 0px`, threshold: [0, 0.15, 0.35] },
    );
    sections.forEach((s) => observer.observe(s!));
    return () => observer.disconnect();
  }, [onLandingPage]);

  const goToSection = (id: HajjSectionId) => {
    setOpen(false);
    if (onLandingPage && document.getElementById(id)) {
      scrollToSection(id, HEADER_OFFSET);
      setActiveSection(id);
      return;
    }
    router.push(`${landingPath}#${id}`);
  };

  const switchLocale = (next: Locale) => {
    setLangOpen(false);
    setOpen(false);
    router.replace(pathname, { locale: next });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8EAEE] bg-white">
      <div
        className={cn(
          "relative mx-auto flex max-w-page items-center",
          compact
            ? "h-14 gap-2 px-4 lg:h-[4.5rem] lg:gap-3 lg:px-9"
            : "h-16 gap-3 px-4 sm:h-[4.5rem] sm:px-5 md:px-8 lg:px-9",
        )}
      >
        <Link href={landingPath} className="flex shrink-0 items-center" aria-label="Mobarak">
          <BrandLogo
            height={96}
            priority
            className={cn(
              "w-auto",
              compact
                ? "!h-11 !max-h-11 lg:!h-14 lg:!max-h-14"
                : "!h-[3.25rem] !max-h-[3.25rem] sm:!h-14 sm:!max-h-14",
            )}
          />
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 xl:gap-7 min-[1100px]:flex"
          aria-label={tCommon("menu")}
        >
          {HAJJ_NAV.map((item) => {
            if (item.kind === "link") {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap pb-1 text-[14px] font-medium text-[#3D4F5F] transition hover:text-navy xl:text-[14.5px]"
                >
                  {t(item.labelKey)}
                </Link>
              );
            }
            const active = onLandingPage && activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goToSection(item.id)}
                className={cn(
                  "relative whitespace-nowrap pb-1 text-[14px] font-medium transition xl:text-[14.5px]",
                  active ? "font-semibold text-navy" : "text-[#3D4F5F] hover:text-navy",
                )}
              >
                {t(item.labelKey)}
                {active ? (
                  <span
                    className="absolute -bottom-0.5 left-1/2 h-0.5 w-7 -translate-x-1/2 rounded-full"
                    style={{ backgroundColor: CTA_BLUE }}
                    aria-hidden
                  />
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className={cn("ms-auto flex items-center", compact ? "gap-1.5 lg:gap-3.5" : "gap-2.5 sm:gap-3.5")}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[14px] font-semibold text-navy"
              aria-expanded={langOpen}
            >
              {current.toUpperCase()}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {langOpen ? (
              <div className="absolute end-0 top-full z-50 mt-1 min-w-[8rem] overflow-hidden rounded-lg border border-line bg-white py-1 shadow-lg">
                {locales.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => switchLocale(l)}
                    className={cn(
                      "block w-full px-3 py-2 text-start text-[13px] transition hover:bg-surface",
                      l === current ? "font-semibold text-navy" : "text-[#3D4F5F]",
                    )}
                  >
                    {tLang(l)}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <Link
            href={hajjCampaignPreRegPath(campaignSlug)}
            className="hidden items-center gap-1.5 rounded-[10px] px-5 py-3 text-[14px] font-bold text-white transition hover:brightness-95 min-[1100px]:inline-flex"
            style={{ backgroundColor: CTA_BLUE }}
          >
            Für Hajj 2027 vormerken
            <DirArrow />
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy hover:bg-surface min-[1100px]:hidden"
            aria-label={open ? tCommon("close") : tCommon("menu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-white min-[1100px]:hidden">
          <nav className="mx-auto flex max-w-page flex-col gap-1 px-4 py-3">
            {HAJJ_NAV.map((item) =>
              item.kind === "link" ? (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3.5 text-[16px] font-medium text-navy"
                >
                  {t(item.labelKey)}
                </Link>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goToSection(item.id)}
                  className="rounded-xl px-4 py-3.5 text-start text-[16px] font-medium text-navy"
                >
                  {t(item.labelKey)}
                </button>
              ),
            )}
            <div className="mt-2 border-t border-line pt-3">
              <p className="px-4 text-[12px] font-semibold uppercase tracking-wide text-muted">
                {tLang("label")}
              </p>
              <div className="mt-1 flex flex-wrap gap-2 px-4 pb-2">
                {locales.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => switchLocale(l)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[13px] font-medium",
                      l === current
                        ? "border-[#1264F5] bg-[#F3F8FF] text-[#1264F5]"
                        : "border-line text-navy",
                    )}
                  >
                    {tLang(l)}
                  </button>
                ))}
              </div>
            </div>
            <Link
              href={hajjCampaignPreRegPath(campaignSlug)}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-[15px] font-bold text-white"
              style={{ backgroundColor: CTA_BLUE }}
            >
              Für Hajj 2027 vormerken
              <DirArrow />
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
