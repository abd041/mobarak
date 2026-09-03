"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { ChevronDown, Globe, Menu, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { isNavItemActive } from "@/lib/nav-active";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/hajj-2027", key: "hajj2027" as const },
  { href: "/umrah-gruppenreisen", key: "umrahGroup" as const },
  { href: "/individuelle-umrah", key: "individualUmrah" as const },
  { href: "/visum-service", key: "visa" as const },
  { href: "/ueber-uns", key: "about" as const },
  { href: "/kontakt", key: "contact" as const },
];

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const tMeta = useTranslations("meta");
  const tLang = useTranslations("language");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = useLocale();
  const rtl = locale === "ar";

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8EAEE] bg-white">
      {/* Compact header — match listing reference height */}
      <div className="relative mx-auto flex h-16 max-w-page items-center gap-2 px-3 sm:h-[4.25rem] sm:px-5 md:px-8 min-[1180px]:h-[4.5rem] lg:px-9.25">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-sm"
          onClick={() => setOpen(false)}
          aria-label="Mobarak Hajj & Umrah"
        >
          <BrandLogo
            height={112}
            priority
            className="!h-11 !max-h-11 w-auto sm:!h-12 sm:!max-h-12 min-[1180px]:!h-14 min-[1180px]:!max-h-14"
          />
        </Link>

        {/* Desktop nav only — never on mobile (§4) */}
        <nav
          className="absolute left-1/2 hidden min-w-0 -translate-x-1/2 items-center justify-center gap-5 min-[1180px]:flex xl:gap-6"
          aria-label={tCommon("menu")}
        >
          {NAV.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative shrink-0 whitespace-nowrap rounded-sm pb-1 text-[13px] font-medium transition xl:text-[13.5px]",
                  active
                    ? "font-semibold text-navy"
                    : "text-[#3d4f5f] hover:text-navy",
                )}
              >
                {t(item.key)}
                {active && (
                  <span
                    className="absolute -bottom-0.5 left-1/2 h-[3px] w-[2.25rem] -translate-x-1/2 rounded-full bg-brand-orange"
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div
          className={cn(
            "ms-auto flex shrink-0 items-center gap-1.5 sm:gap-2 min-[1180px]:gap-13.75",
            rtl ? "min-[1180px]:translate-x-4.25" : "min-[1180px]:-translate-x-4.25",
          )}
        >
          {/* Desktop: phone number chip + language */}
          <a
            href={`tel:${tMeta("phone").replace(/\s/g, "")}`}
            className="dir-ltr-keep hidden items-center gap-2 rounded-full bg-[#0A1B3D] px-3.5 py-1.5 text-[12.5px] font-semibold whitespace-nowrap text-white transition hover:bg-[#152848] min-[1180px]:inline-flex xl:text-[13px]"
          >
            <Phone className="h-3.5 w-3.5 shrink-0 text-white" strokeWidth={2} />
            {tMeta("phone")}
          </a>

          <LanguageSwitcher
            current={current as Locale}
            label={tLang("label")}
            className="hidden min-[1180px]:block"
          />

          {/* Mobile: phone · hamburger (language lives in the drawer) */}
          <a
            href={`tel:${tMeta("phone").replace(/\s/g, "")}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E6E8EC] text-[#0A1B3D] transition hover:bg-[#F7F8FA] min-[1180px]:hidden sm:h-10 sm:w-10"
            aria-label={tMeta("phone")}
          >
            <Phone className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={2} />
          </a>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E6E8EC] text-[#0A1B3D] transition hover:bg-[#F7F8FA] min-[1180px]:hidden sm:h-10 sm:w-10"
            aria-label={open ? tCommon("close") : tCommon("menu")}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={2} />
            ) : (
              <Menu className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-[#eceef1] bg-white sm:max-h-[calc(100dvh-5rem)] min-[1180px]:hidden"
        >
          <nav className="mx-auto flex max-w-page flex-col gap-1 px-4 py-3" aria-label={tCommon("menu")}>
            {NAV.map((item) => {
              const active = isNavItemActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3.5 text-[16px] font-medium transition",
                    active
                      ? "bg-brand-orange-soft font-semibold text-brand-orange-ink"
                      : "text-navy hover:bg-surface",
                  )}
                >
                  {t(item.key)}
                </Link>
              );
            })}

            <div className="mt-3 border-t border-line pt-3">
              <LanguageSwitcher
                current={current as Locale}
                label={tLang("label")}
                className="w-full"
                variant="menu"
              />
            </div>

            <div className="mt-3 border-t border-line pt-3">
              <a
                href={`tel:${tMeta("phone").replace(/\s/g, "")}`}
                className="dir-ltr-keep inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0A1B3D] px-4 py-3.5 text-[15px] font-semibold text-white"
              >
                <Phone className="h-4 w-4" />
                {tMeta("phone")}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function LanguageSwitcher({
  current,
  label,
  className,
  variant = "header",
  compact = false,
}: {
  current: Locale;
  label: string;
  className?: string;
  variant?: "header" | "menu";
  /** Smaller control for the compact mobile header bar */
  compact?: boolean;
}) {
  const pathname = usePathname();
  const tLang = useTranslations("language");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const switchTo = (next: Locale) => {
    setOpen(false);
    if (next === current) return;
    window.location.href = `/${next}${pathname === "/" ? "" : pathname}`;
  };

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      {variant === "menu" ? (
        <div className="grid grid-cols-2 gap-2 px-1">
          {locales.map((loc) => {
            const active = loc === current;
            return (
              <button
                key={loc}
                type="button"
                onClick={() => switchTo(loc)}
                className={cn(
                  "min-h-11 rounded-xl px-3 py-2.5 text-[14px] font-medium transition",
                  active
                    ? "bg-[#0A1B3D] font-semibold text-white"
                    : "border border-line bg-white text-navy hover:bg-surface",
                )}
              >
                {tLang(loc)}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <button
            type="button"
            aria-label={label}
            aria-expanded={open}
            aria-haspopup="listbox"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "inline-flex items-center border border-[#E6E8EC] bg-[#F7F8FA] font-semibold tracking-[0.04em] text-[#0A1B3D] transition",
              "hover:border-[#d5d9df] hover:bg-white hover:shadow-[0_2px_8px_rgba(9,30,66,0.06)]",
              open && "border-[#d5d9df] bg-white shadow-[0_2px_8px_rgba(9,30,66,0.06)]",
              compact
                ? "h-9 gap-1 rounded-lg px-2 text-[11px] sm:h-10 sm:px-2.5 sm:text-[12px]"
                : "h-11 gap-1.5 rounded-full px-3 text-[12px] sm:h-9",
            )}
          >
            <Globe
              className={cn("text-[#1E5A9C]", compact ? "h-3.5 w-3.5" : "h-3.5 w-3.5")}
              strokeWidth={2}
            />
            <span>{current.toUpperCase()}</span>
            <ChevronDown
              className={cn(
                "text-[#6B7C8F] transition-transform duration-200",
                compact ? "h-3 w-3" : "h-3.5 w-3.5",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </button>

          {open && (
            <div
              role="listbox"
              aria-label={label}
              className="absolute inset-e-0 top-[calc(100%+8px)] z-50 min-w-44 overflow-hidden rounded-xl border border-[#E6E8EC] bg-white py-1.5 shadow-[0_12px_32px_rgba(9,30,66,0.12)]"
            >
              {locales.map((loc) => {
                const active = loc === current;
                return (
                  <button
                    key={loc}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => switchTo(loc)}
                    className={cn(
                      "flex min-h-11 w-full items-center justify-between gap-3 px-3.5 py-2.5 text-start text-[14px] transition",
                      active
                        ? "bg-[#0A1B3D] font-semibold text-white"
                        : "font-medium text-[#2F3F4F] hover:bg-[#F7F8FA] hover:text-[#0A1B3D]",
                    )}
                  >
                    <span>{tLang(loc)}</span>
                    <span
                      className={cn(
                        "dir-ltr-keep text-[11px] tracking-[0.06em]",
                        active ? "text-white/70" : "text-[#8A97A6]",
                      )}
                    >
                      {loc.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
