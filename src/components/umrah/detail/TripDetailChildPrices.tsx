"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { UmrahTrip } from "@/data/mock";
import { resolveTrip } from "@/lib/trip-availability";

export function TripDetailChildPrices({ trip }: { trip: UmrahTrip }) {
  const t = useTranslations("umrah");
  const [liveTrip, setLiveTrip] = useState(trip);

  useEffect(() => {
    const sync = () => setLiveTrip(resolveTrip(trip));
    sync();
    window.addEventListener("mobarak-availability", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mobarak-availability", sync);
      window.removeEventListener("storage", sync);
    };
  }, [trip]);

  const rows = [
    {
      label: t("infantPrice"),
      amount: liveTrip.childPrices.infant,
      note: t("inclFlightVisa"),
    },
    {
      label: t("childNoBed"),
      amount: liveTrip.childPrices.withoutBed,
      note: t("inclFlightVisa"),
    },
    {
      label: t("childWithBed"),
      amount: liveTrip.childPrices.withBedDiscount,
      note: t("inclFlightVisa"),
    },
  ];

  return (
    <section className="trip-section" aria-labelledby="child-prices-heading">
      <div className="trip-section-heading">
        <h2 id="child-prices-heading" className="shrink-0 text-xl font-bold text-navy sm:text-2xl">
          {t("childPrices")}
        </h2>
      </div>

      <div className="mobarak-card overflow-hidden">
        <ul>
          {rows.map((row, i) => (
            <li
              key={row.label}
              className={`flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-6 ${
                i < rows.length - 1 ? "border-b border-line" : ""
              }`}
            >
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-navy">{row.label}</p>
                <p className="mt-0.5 text-[12px] text-muted">{row.note}</p>
              </div>
              <p className="text-[18px] font-extrabold text-[var(--mobarak-price-green)]">
                {`${row.amount.toLocaleString("de-DE")} €`}
              </p>
            </li>
          ))}
        </ul>
        <p className="border-t border-line bg-surface px-5 py-4 text-[12px] leading-relaxed text-muted sm:px-6">
          {t("childPriceNote")}
        </p>
      </div>
    </section>
  );
}
