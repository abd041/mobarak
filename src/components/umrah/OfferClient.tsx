"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Hotel, UmrahTrip } from "@/data/mock";

export function OfferClient({
  trip,
  children,
}: {
  trip: UmrahTrip;
  medina: Hotel;
  makkah: Hotel;
  children: React.ReactNode;
}) {
  const tCommon = useTranslations("common");

  return (
    <>
      {children}
      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-bottom md:hidden">
        <Link
          href={`/umrah/gruppenreise/${trip.slug}/anfrage`}
          className="flex w-full items-center justify-center rounded-xl bg-brand-cta py-3.5 text-sm font-semibold text-white"
        >
          {tCommon("inquireNow")} →
        </Link>
      </div>
    </>
  );
}
