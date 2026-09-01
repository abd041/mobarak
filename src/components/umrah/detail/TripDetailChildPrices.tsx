"use client";

import { useEffect, useState } from "react";
import { Baby, BedDouble, Info, UserRound, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UmrahTrip } from "@/data/mock";
import { resolveTrip } from "@/lib/trip-availability";
import { cn } from "@/lib/utils";

function ChildPriceIcon({ Icon }: { Icon: LucideIcon }) {
  return (
    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center sm:h-12 sm:w-12">
      <span
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.98),rgba(232,240,252,0.92)_45%,rgba(210,224,245,0.78)_100%)] shadow-[0_4px_14px_rgba(9,36,92,0.1),inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-[#C5A35A]/30"
        aria-hidden
      />
      <span
        className="absolute inset-[3px] rounded-full bg-gradient-to-br from-white via-[#F7FAFD] to-[#E8F0FA] ring-1 ring-white/85"
        aria-hidden
      />
      <Icon
        className="relative z-[1] h-[18px] w-[18px] text-[#09245C] sm:h-5 sm:w-5"
        strokeWidth={1.75}
        absoluteStrokeWidth
        aria-hidden
      />
    </span>
  );
}

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

  const rows: {
    label: string;
    amount: number;
    note: string;
    Icon: LucideIcon;
  }[] = [
    {
      label: t("infantPrice"),
      amount: liveTrip.childPrices.infant,
      note: t("inclFlightVisa"),
      Icon: Baby,
    },
    {
      label: t("childNoBed"),
      amount: liveTrip.childPrices.withoutBed,
      note: t("inclFlightVisa"),
      Icon: UserRound,
    },
    {
      label: t("childWithBed"),
      amount: liveTrip.childPrices.withBedDiscount,
      note: t("inclFlightVisa"),
      Icon: BedDouble,
    },
  ];

  return (
    <section className="trip-section" aria-labelledby="child-prices-heading">
      <div className="mb-5 flex items-center gap-4 sm:mb-6">
        <span className="hidden h-px flex-1 bg-[#E4EAF2] sm:block" aria-hidden />
        <h2
          id="child-prices-heading"
          className="shrink-0 text-[18px] font-bold tracking-[-0.01em] text-[#051033] sm:text-[22px]"
        >
          {t("childPrices")}
        </h2>
        <span className="hidden h-px flex-1 bg-[#E4EAF2] sm:block" aria-hidden />
      </div>

      <div className="overflow-hidden rounded-[16px] border border-[#E4EAF2] bg-white shadow-[0_4px_18px_rgba(9,36,92,0.06)]">
        <span
          className="pointer-events-none block h-px bg-gradient-to-r from-transparent via-[#C5A35A]/45 to-transparent"
          aria-hidden
        />

        <ul>
          {rows.map((row, i) => (
            <li
              key={row.label}
              className={cn(
                "flex items-center justify-between gap-4 px-5 py-5 sm:gap-6 sm:px-6 sm:py-6",
                i < rows.length - 1 && "border-b border-[#E4EAF2]",
                i % 2 === 0 ? "bg-[#F7F9FC]/70" : "bg-white",
              )}
            >
              <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
                <ChildPriceIcon Icon={row.Icon} />
                <div className="min-w-0">
                  <p className="text-[14px] font-bold tracking-[-0.01em] text-[#051033] sm:text-[15px]">
                    {row.label}
                  </p>
                  <p className="mt-0.5 text-[12px] font-medium text-[#6B7C8F]">{row.note}</p>
                </div>
              </div>

              <p
                className={cn(
                  "shrink-0 rounded-full border border-[#D8F0E0] bg-[#F3FBF6] px-3.5 py-1.5",
                  "text-[16px] font-extrabold tracking-[-0.02em] text-[var(--mobarak-price-green)] sm:px-4 sm:text-[18px]",
                )}
              >
                {`${row.amount.toLocaleString("de-DE")} €`}
              </p>
            </li>
          ))}
        </ul>

        <div className="flex items-start gap-3 border-t border-[#E4EAF2] bg-[#F7F9FC] px-5 py-4 sm:gap-3.5 sm:px-6 sm:py-5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_1px_4px_rgba(9,36,92,0.06)] ring-1 ring-[#E8EEF6]">
            <Info className="h-3.5 w-3.5 text-[#09245C]" strokeWidth={2} aria-hidden />
          </span>
          <p className="text-[12px] leading-[1.65] text-[#5A6B7C] sm:text-[13px]">
            {t("childPriceNote")}
          </p>
        </div>
      </div>
    </section>
  );
}
