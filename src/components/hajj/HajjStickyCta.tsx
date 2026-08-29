"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DirArrow } from "@/components/ui/DirArrow";

export function HajjStickyCta({
  children,
  ctaLabel,
}: {
  children: React.ReactNode;
  ctaLabel?: string;
}) {
  const t = useTranslations("hajj");
  const label = ctaLabel ?? t("cta");

  return (
    <>
      {children}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-bottom md:hidden">
        <Link
          href="/hajj-2027/vormerkung"
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-cta py-3.5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {label}
          <DirArrow />
        </Link>
      </div>
    </>
  );
}
