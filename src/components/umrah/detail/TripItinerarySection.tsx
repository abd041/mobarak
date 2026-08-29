import type { UmrahTrip } from "@/data/mock";
import { ItineraryDesktopView } from "./ItineraryDesktopView";
import { ItineraryMobileList } from "./ItineraryMobileList";

type TFn = (key: string, values?: Record<string, string | number | Date>) => string;

const NAVY = "#071D4F";

/** Reiseplan — responsive route drawn from the desktop day-grid positions. */
export function TripItinerarySection({
  trip,
  t,
}: {
  trip: UmrahTrip;
  t: TFn;
}) {
  return (
    <section id="itinerary" className="trip-section scroll-mt-24">
      <div className="trip-section-heading">
        <h2 className="shrink-0 text-xl font-bold sm:text-2xl" style={{ color: NAVY }}>
          {t("itinerary")}
        </h2>
      </div>

      <ItineraryMobileList trip={trip} t={t} />

      <div className="hidden md:block">
        <ItineraryDesktopView trip={trip} />
      </div>
    </section>
  );
}
