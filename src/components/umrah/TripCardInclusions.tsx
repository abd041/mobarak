"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { UmrahTrip } from "@/data/mock";
import { IQ } from "@/lib/images";
import {
  getTripCardInclusionRows,
  type TripCardInclusionItem,
} from "@/lib/trip-card-inclusions";
import { cn } from "@/lib/utils";

function InclusionItem({
  item,
  label,
}: {
  item: TripCardInclusionItem;
  label: string;
}) {
  return (
    <li className="flex min-w-0 items-start gap-[6px]">
      <div className="relative mt-[1px] h-[18px] w-[18px] shrink-0 md:h-[20px] md:w-[20px]">
        <Image
          src={item.icon}
          alt=""
          fill
          className="object-contain object-top"
          sizes="20px"
          quality={IQ.thumb}
        />
      </div>
      <span className="min-w-0 text-[11px] font-semibold leading-[1.35] text-[#1A1A1A] md:text-[12px]">
        {label}
      </span>
    </li>
  );
}

/** Included services — all enabled items kept; layout matches compact reference grid. */
export function TripCardInclusions({
  trip,
  prominence = "default",
}: {
  trip: UmrahTrip;
  prominence?: "listing" | "default";
}) {
  const t = useTranslations("umrah");
  const { row1, row2 } = getTripCardInclusionRows(trip);
  const isListing = prominence === "listing";
  const items = [...row1, ...row2];

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "border-b border-[#EEF0F3] bg-white",
        isListing
          ? "px-4 py-3 md:px-[16px] md:py-[14px]"
          : "ps-[22px] pe-[14px] py-[12px] sm:px-[16px]",
      )}
    >
      <ul className="grid grid-cols-2 gap-x-[10px] gap-y-[10px] sm:grid-cols-4">
        {items.map((item) => (
          <InclusionItem key={item.id} item={item} label={t(item.labelKey)} />
        ))}
      </ul>
    </div>
  );
}
