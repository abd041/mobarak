import Image from "next/image";
import type { UmrahTrip } from "@/data/mock";
import { IQ } from "@/lib/images";
import { cn } from "@/lib/utils";

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
    icon: "/brand/inclusion-icons/excursion-makkah.svg",
    titleKey: "sectionExcursions",
    noteKey: "detailExcursionsDefault",
    noteField: "excursions" as const,
  },
];

function ServiceDetailIcon({ src }: { src: string }) {
  return (
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center sm:h-[52px] sm:w-[52px]">
      <span
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.98),rgba(232,240,252,0.92)_45%,rgba(210,224,245,0.78)_100%)] shadow-[0_4px_14px_rgba(9,36,92,0.1),inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-[#C5A35A]/30"
        aria-hidden
      />
      <span
        className="absolute inset-[3px] rounded-full bg-gradient-to-br from-white via-[#F7FAFD] to-[#E8F0FA] ring-1 ring-white/85"
        aria-hidden
      />
      <span className="relative z-[1] h-6 w-6 sm:h-7 sm:w-7">
        <Image
          src={src}
          alt=""
          fill
          className="object-contain"
          sizes="28px"
          quality={IQ.thumb}
        />
      </span>
    </span>
  );
}

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
      <div className="mb-5 flex items-center gap-4 sm:mb-6">
        <span className="hidden h-px flex-1 bg-[#E4EAF2] sm:block" aria-hidden />
        <h2
          id="offer-details-heading"
          className="shrink-0 text-[18px] font-bold tracking-[-0.01em] text-[#051033] sm:text-[22px]"
        >
          {t("moreOfferInfo")}
        </h2>
        <span className="hidden h-px flex-1 bg-[#E4EAF2] sm:block" aria-hidden />
      </div>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {DETAIL_BLOCKS.map(
          ({ id, icon, titleKey, noteKey, noteField, extraNoteField, extraNoteKey }) => (
            <article
              key={id}
              id={id}
              className={cn(
                "group relative scroll-mt-32 overflow-hidden rounded-[16px] border border-[#E4EAF2] bg-[#F7F9FC] p-5 shadow-[0_4px_18px_rgba(9,36,92,0.05)] sm:p-6",
                "transition-[background-color,box-shadow,border-color] duration-200",
                "hover:border-[#D5DEEA] hover:bg-white hover:shadow-[0_8px_24px_rgba(9,36,92,0.08)]",
              )}
            >
              <span
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#C5A35A]/45 to-transparent"
                aria-hidden
              />

              <div className="flex items-start gap-4 sm:gap-5">
                <ServiceDetailIcon src={icon} />

                <div className="min-w-0 flex-1 pt-0.5">
                  <h3 className="text-[15px] font-bold tracking-[-0.01em] text-[#051033] sm:text-[16px]">
                    {t(titleKey)}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.65] text-[#3D4F5F]">
                    {notes[noteField] || t(noteKey)}
                  </p>
                  {extraNoteField && extraNoteKey ? (
                    <p className="mt-2.5 text-[13px] leading-[1.65] text-[#3D4F5F]">
                      {notes[extraNoteField] || t(extraNoteKey)}
                    </p>
                  ) : null}
                  {id === "guides" ? (
                    <p className="mt-3.5 inline-flex max-w-full flex-wrap items-center gap-x-1.5 rounded-full border border-[#E8EEF6] bg-white px-3 py-1.5 text-[11px] font-semibold leading-snug text-[#051033] shadow-[0_1px_4px_rgba(9,36,92,0.04)] ring-1 ring-[#C5A35A]/20 sm:text-[12px]">
                      <span className="text-[#6B7C8F]">{t("guideLanguages")}:</span>
                      <span>{t("guideLanguagesValue")}</span>
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
