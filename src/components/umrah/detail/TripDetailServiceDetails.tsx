import Image from "next/image";
import type { UmrahTrip } from "@/data/mock";

type TFn = (key: string, values?: Record<string, string | number | Date>) => string;

const DETAIL_BLOCKS: {
  id: string;
  icon: string;
  titleKey: string;
  noteKey: string;
  noteField: keyof NonNullable<UmrahTrip["detailNotes"]>;
  extraNoteField?: keyof NonNullable<UmrahTrip["detailNotes"]>;
  extraNoteKey?: string;
}[] = [
  {
    id: "luggage",
    icon: "/brand/inclusion-icons/baggage.png",
    titleKey: "sectionLuggage",
    noteKey: "detailLuggageDefault",
    noteField: "luggage" as const,
  },
  {
    id: "transfers",
    icon: "/brand/inclusion-icons/transfer.png",
    titleKey: "sectionTransfers",
    noteKey: "detailTransfersDefault",
    noteField: "transfers" as const,
  },
  {
    id: "visa",
    icon: "/brand/inclusion-icons/visa.png",
    titleKey: "sectionVisa",
    noteKey: "detailVisaDefault",
    noteField: "visa" as const,
  },
  {
    id: "guides",
    icon: "/brand/inclusion-icons/guide.png",
    titleKey: "sectionGuides",
    noteKey: "detailTourGuideDefault",
    noteField: "tourGuide" as const,
    extraNoteField: "religiousGuide" as const,
    extraNoteKey: "detailReligiousGuideDefault",
  },
  {
    id: "excursions",
    icon: "/brand/inclusion-icons/excursions.png",
    titleKey: "sectionExcursions",
    noteKey: "detailExcursionsDefault",
    noteField: "excursions" as const,
  },
];

export function TripDetailServiceDetails({
  trip,
  t,
}: {
  trip: UmrahTrip;
  t: TFn;
}) {
  const notes = trip.detailNotes ?? {};

  return (
    <section className="trip-section" aria-labelledby="offer-details-heading">
      <div className="trip-section-heading">
        <h2 id="offer-details-heading" className="shrink-0 text-xl font-bold text-navy sm:text-2xl">
          {t("moreOfferInfo")}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {DETAIL_BLOCKS.map(
          ({ id, icon, titleKey, noteKey, noteField, extraNoteField, extraNoteKey }) => (
            <article
              key={id}
              id={id}
              className="mobarak-card scroll-mt-32 p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="relative h-12 w-12 shrink-0">
                  <Image src={icon} alt="" fill className="object-contain" sizes="48px" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[16px] font-bold text-navy">{t(titleKey)}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    {notes[noteField] || t(noteKey)}
                  </p>
                  {extraNoteField && extraNoteKey ? (
                    <p className="mt-2 text-[13px] leading-relaxed text-muted">
                      {notes[extraNoteField] || t(extraNoteKey)}
                    </p>
                  ) : null}
                  {id === "guides" ? (
                    <p className="mt-3 text-[12px] font-semibold text-brand-cta">
                      {t("guideLanguages")}: {t("guideLanguagesValue")}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          ),
        )}
      </div>
    </section>
  );
}
