"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", key: "home" as const },
  { href: "/umrah-gruppenreisen", key: "umrahGroup" as const },
  { href: "/individuelle-umrah", key: "individualUmrah" as const },
  { href: "/hajj-2027", key: "hajj2027" as const },
  { href: "/visum-service", key: "visa" as const },
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

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-4 px-4 md:h-20 md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange-soft text-sm font-bold text-brand-orange">
            M
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-wide text-brand-orange">
              MOBARAK
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-navy">
              Hajj & Umrah
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative pb-1 text-sm font-medium text-navy/80 transition hover:text-navy",
                  active && "text-navy",
                )}
              >
                {t(item.key)}
                {active && (
                  <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-brand-orange" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href={`tel:${tMeta("phone").replace(/\s/g, "")}`}
            className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm font-medium text-navy md:inline-flex"
          >
            <Phone className="h-4 w-4 text-brand-orange" />
            {tMeta("phone")}
          </a>

          <LanguageSwitcher current={current as Locale} label={tLang("label")} />

          <a
            href={`tel:${tMeta("phone").replace(/\s/g, "")}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-navy md:hidden"
            aria-label={tMeta("phone")}
          >
            <Phone className="h-4 w-4" />
          </a>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-navy lg:hidden"
            aria-label={tCommon("menu")}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-white lg:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col gap-1 px-4 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-navy hover:bg-surface"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function LanguageSwitcher({
  current,
  label,
}: {
  current: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const t = useTranslations("language");

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <select
        className="appearance-none rounded-full border border-line bg-white py-1.5 pe-8 ps-3 text-sm font-medium text-navy"
        value={current}
        onChange={(e) => {
          const next = e.target.value as Locale;
          window.location.href = `/${next}${pathname === "/" ? "" : pathname}`;
        }}
        aria-label={label}
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {t(loc)}
          </option>
        ))}
      </select>
    </label>
  );
}
