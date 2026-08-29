import Image from "next/image";
import type { ItineraryActivity, ItineraryDay } from "@/lib/trip-itinerary";
import { itineraryIconSrc } from "@/lib/trip-itinerary";

const NAVY = "#071D4F";
const GREEN_BADGE = "#07852D";

export function itineraryDayBadgeLabel(
  day: ItineraryDay,
  dayLabel: string,
): string {
  return day.locationLabel ? `${dayLabel} – ${day.locationLabel}` : dayLabel;
}

function ActivityNode({ activity }: { activity: ItineraryActivity }) {
  const titleLines = activity.title.split("\n");

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative h-14 w-14 sm:h-16 sm:w-16">
        <Image
          src={itineraryIconSrc(activity.icon)}
          alt=""
          fill
          className="object-contain"
          sizes="64px"
        />
      </div>
      {activity.time && (
        <p className="mt-2 text-[12px] leading-snug font-bold sm:text-[13px]" style={{ color: NAVY }}>
          {activity.time}
        </p>
      )}
      {titleLines.map((line, i) => (
        <p
          key={i}
          className={`max-w-[10rem] text-[12px] leading-snug font-semibold sm:max-w-[11rem] sm:text-[13px] ${
            i > 0 ? "mt-0.5" : activity.time ? "mt-0.5" : "mt-2"
          }`}
          style={{ color: NAVY }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}

export function ItineraryDayColumn({
  day,
  dayLabel,
  routeBadge = false,
}: {
  day: ItineraryDay;
  dayLabel: string;
  routeBadge?: boolean;
}) {
  return (
    <li className="flex flex-col items-center px-1 sm:px-2">
      <span
        {...(routeBadge ? { "data-route-badge": "" } : {})}
        className="relative z-20 inline-flex rounded-[4px] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white"
        style={{ backgroundColor: GREEN_BADGE }}
      >
        {itineraryDayBadgeLabel(day, dayLabel)}
      </span>

      <div className="mt-5 flex w-full flex-col items-center gap-5 sm:mt-6 sm:gap-6">
        {day.activities.map((activity, i) => (
          <ActivityNode key={`${day.day}-${i}-${activity.title}`} activity={activity} />
        ))}
      </div>
    </li>
  );
}
