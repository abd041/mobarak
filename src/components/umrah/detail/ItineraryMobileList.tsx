import Image from "next/image";
import type { UmrahTrip } from "@/data/mock";

type TFn = (key: string, values?: Record<string, string | number | Date>) => string;

const TAG_ICON: Record<number, string> = {
  1: "day-01",
  2: "day-02",
  3: "day-03",
  4: "day-04",
  5: "day-05",
  6: "day-06",
  7: "day-07",
  8: "day-13",
  9: "day-12",
  10: "day-11",
  11: "day-10",
  12: "day-09",
  13: "day-08",
};

const NAVY = "#071D4F";
const GREEN_BADGE = "#07852D";

/** Vertical Reiseplan — dotted route with stacked white cards (mobile only). */
export function ItineraryMobileList({ trip, t }: { trip: UmrahTrip; t: TFn }) {
  return (
    <div className="relative md:hidden">
      <div
        className="absolute start-[1.125rem] top-6 bottom-6 w-0 border-s-2 border-dashed border-[#C5CDD6]"
        aria-hidden
      />

      <ol className="relative space-y-4">
        {trip.itinerary.map((item, index) => {
          const iconFile = TAG_ICON[item.day] ?? `day-${String(item.day).padStart(2, "0")}`;
          const titleLines = item.title.split("\n");

          return (
            <li key={`${item.day}-${index}`} className="relative ps-11">
              <span
                className="absolute start-2.5 top-5 z-10 h-4 w-4 rounded-full border-2 border-brand-green bg-white shadow-sm"
                aria-hidden
              />

              <article className="mobarak-card overflow-hidden px-4 py-4 sm:px-5">
                <span
                  className="inline-flex rounded-[4px] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white"
                  style={{ backgroundColor: GREEN_BADGE }}
                >
                  {t("dayLabel", { day: item.day })}
                </span>

                <div className="mt-3 flex items-start gap-3">
                  <div className="relative h-12 w-12 shrink-0">
                    <Image
                      src={`/brand/itinerary-icons/${iconFile}.png`}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="48px"
                    />
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    {item.time && (
                      <p className="text-[12px] font-bold leading-snug text-brand-cta sm:text-[13px]">
                        {item.time}
                      </p>
                    )}

                    {titleLines.map((line, i) => (
                      <p
                        key={i}
                        className={`text-[13px] leading-snug font-semibold text-navy sm:text-[14px] ${
                          i > 0 ? "mt-0.5" : item.time ? "mt-0.5" : ""
                        }`}
                        style={{ color: NAVY }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
