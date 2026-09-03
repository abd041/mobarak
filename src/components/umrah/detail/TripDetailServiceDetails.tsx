"use client";

import { useState } from "react";
import Image from "next/image";
import { Libre_Baskerville } from "next/font/google";
import { useLocale, useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import type { UmrahTrip } from "@/data/mock";
import { IQ } from "@/lib/images";
import { getLocalizedDetailNote } from "@/lib/trip-localized-copy";
import { cn } from "@/lib/utils";

const display = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
});

const INFO_ROWS: {
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
    icon: "/brand/icons/offer-info/luggage.png",
    titleKey: "offerInfoLuggage",
    noteKey: "detailLuggageDefault",
    noteField: "luggage",
  },
  {
    id: "transfers",
    icon: "/brand/icons/offer-info/transfers.png",
    titleKey: "offerInfoTransfers",
    noteKey: "detailTransfersDefault",
    noteField: "transfers",
  },
  {
    id: "visa",
    icon: "/brand/icons/offer-info/visa.png",
    titleKey: "offerInfoVisa",
    noteKey: "detailVisaDefault",
    noteField: "visa",
  },
  {
    id: "guides",
    icon: "/brand/icons/offer-info/guides.png",
    titleKey: "offerInfoGuides",
    noteKey: "detailTourGuideDefault",
    noteField: "tourGuide",
    extraNoteField: "religiousGuide",
    extraNoteKey: "detailReligiousGuideDefault",
  },
  {
    id: "excursions",
    icon: "/brand/icons/offer-info/camera.png",
    titleKey: "offerInfoExcursions",
    noteKey: "detailExcursionsDefault",
    noteField: "excursions",
  },
];

/** Weitere Informationen — list rows with expand (reference). */
export function TripDetailServiceDetails({ trip }: { trip: UmrahTrip }) {
  const t = useTranslations("umrah");
  const locale = useLocale();
  const notes = trip.detailNotes ?? {};
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="min-w-0" aria-labelledby="offer-details-heading">
      <div className="mb-4">
        <h2
          id="offer-details-heading"
          className={cn(
            display.className,
            "m-0 text-[1.35rem] font-bold tracking-[-0.02em] text-[#111111] sm:text-[1.5rem]",
          )}
        >
          {t("offerMoreInfoTitle")}
        </h2>
        <p className="mt-1.5 m-0 text-[14px] font-medium text-[#3D4F5F]">
          {t("offerMoreInfoSubtitle")}
        </p>
      </div>

      <div className="overflow-hidden rounded-[12px] border border-[#E5E9EF] bg-white">
        <ul className="m-0 list-none p-0">
          {INFO_ROWS.map((row, index) => {
            const open = openId === row.id;
            const body = getLocalizedDetailNote(
              notes[row.noteField],
              locale,
              t(row.noteKey),
            );
            const extra =
              row.extraNoteField && row.extraNoteKey
                ? getLocalizedDetailNote(
                    notes[row.extraNoteField],
                    locale,
                    t(row.extraNoteKey),
                  )
                : null;

            return (
              <li
                key={row.id}
                id={row.id}
                className={cn(
                  "scroll-mt-28",
                  index < INFO_ROWS.length - 1 && "border-b border-[#EEF1F5]",
                )}
              >
                <button
                  type="button"
                  className="flex w-full items-center gap-3.5 px-4 py-3.5 text-start transition hover:bg-[#FAFBFC] sm:gap-4 sm:px-5 sm:py-4"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : row.id)}
                >
                  <span className="relative h-9 w-9 shrink-0 sm:h-10 sm:w-10">
                    <Image
                      src={row.icon}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="40px"
                      quality={IQ.thumb}
                      unoptimized
                    />
                  </span>
                  <span className="min-w-0 flex-1 text-[14px] font-bold text-[#111111] sm:text-[15px]">
                    {t(row.titleKey)}
                  </span>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 shrink-0 text-[#9AA6B5] transition",
                      open && "rotate-90",
                    )}
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </button>
                {open ? (
                  <div className="border-t border-[#F0F3F7] bg-[#FAFBFC] px-4 py-3.5 sm:px-5">
                    <p className="m-0 ps-11 text-[13px] leading-relaxed text-[#3D4F5F] sm:ps-14">
                      {body}
                    </p>
                    {extra ? (
                      <p className="mt-2 m-0 ps-11 text-[13px] leading-relaxed text-[#3D4F5F] sm:ps-14">
                        {extra}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
