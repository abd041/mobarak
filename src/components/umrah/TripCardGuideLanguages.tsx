"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { UmrahTrip } from "@/data/mock";
import { IQ } from "@/lib/images";
import { cn } from "@/lib/utils";

const GUIDE_LANG_META: Record<
  string,
  {
    flagSrc: string;
    labelKey: "guideLangAr" | "guideLangDe" | "guideLangBs" | "guideLangTr" | "guideLangEn";
  }
> = {
  ar: { flagSrc: "/brand/flags/saudi-arabia.png", labelKey: "guideLangAr" },
  de: { flagSrc: "/brand/flags/germany.png", labelKey: "guideLangDe" },
  bs: { flagSrc: "/brand/flags/bosnia.png", labelKey: "guideLangBs" },
  tr: { flagSrc: "/brand/flags/turkey.png", labelKey: "guideLangTr" },
  en: { flagSrc: "/brand/flags/united-kingdom.png", labelKey: "guideLangEn" },
};

/** Guide languages row — mint panel with circular flag icons (reference layout). */
export function TripCardGuideLanguages({
  trip,
  prominence = "default",
}: {
  trip: UmrahTrip;
  prominence?: "listing" | "default";
}) {
  const t = useTranslations("umrah");
  const langs = trip.guideLanguages?.filter((code) => GUIDE_LANG_META[code]) ?? [];
  const labelLines = t.raw("cardGuideLanguagesLines") as string[];
  const isListing = prominence === "listing";

  if (langs.length === 0) return null;

  return (
    <div
      className={cn(
        "border-b border-[#E8EBEF] bg-white px-3 py-2",
        isListing && "md:px-3.5 md:py-2.5",
      )}
    >
      <div className="flex items-center gap-2 rounded-lg bg-[#EBF9F0] px-2.5 py-2 md:gap-3 md:px-3 md:py-2">
        <div className="flex min-w-0 shrink-0 items-center gap-1.5">
          <span className="relative h-4 w-4 shrink-0 md:h-5 md:w-5">
            <Image
              src="/brand/inclusion-icons/guide.png"
              alt=""
              fill
              className="object-contain"
              sizes="20px"
              quality={IQ.thumb}
            />
          </span>
          <p className="leading-[1.1] text-[10px] font-bold text-[#0A1B3D] md:text-[11px]">
            {labelLines.map((line, i) => (
              <span key={`guide-label-${i}`} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </p>
        </div>

        <ul className="ms-auto flex shrink-0 items-start justify-end gap-2 md:gap-2.5">
          {langs.map((code) => {
            const meta = GUIDE_LANG_META[code]!;
            return (
              <li key={code} className="flex flex-col items-center gap-0.5">
                <span className="relative block h-7 w-7 overflow-hidden rounded-full border-2 border-white shadow-[0_1px_3px_rgba(11,44,74,0.12)] md:h-8 md:w-8">
                  <Image
                    src={meta.flagSrc}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 28px, 32px"
                    quality={100}
                    unoptimized
                  />
                </span>
                <span className="max-w-[48px] text-center text-[8px] font-medium leading-tight text-[#0A1B3D] md:text-[9px]">
                  {t(meta.labelKey)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
