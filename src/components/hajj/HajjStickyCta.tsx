"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function HajjStickyCta({ children }: { children: React.ReactNode }) {
  const t = useTranslations("hajj");

  return (
    <>
      {children}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-bottom md:hidden">
        <Link
          href="/hajj-2027/vormerkung"
          className="flex w-full items-center justify-center rounded-xl bg-brand-cta py-3.5 text-sm font-semibold text-white"
        >
          {t("cta")} →
        </Link>
      </div>
    </>
  );
}
