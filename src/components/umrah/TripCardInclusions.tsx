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
  lines,
  showDivider,
}: {
  item: TripCardInclusionItem;
  lines: string[];
  showDivider: boolean;
}) {
  return (
    <li
      className={cn(
        "flex min-w-0 items-center gap-1.5 px-1.5 py-0.5 first:ps-0 last:pe-0",
        showDivider && "border-e border-[#D8E4EE]",
      )}
    >
      <div className="relative h-5 w-5 shrink-0 md:h-6 md:w-6">
        <Image
          src={item.icon}
          alt=""
          fill
          className="object-contain object-center umrah-listing-benefit-icon"
          sizes="24px"
          quality={IQ.thumb}
        />
      </div>
      <span className="min-w-0 leading-[1.15] text-[#001A4B]">
        {lines.map((line, i) => (
          <span
            key={`${item.id}-l-${i}`}
            className="block text-[8px] font-bold md:text-[9px]"
          >
            {line}
          </span>
        ))}
      </span>
    </li>
  );
}

function InclusionRow({
  items,
  cols,
}: {
  items: TripCardInclusionItem[];
  cols: number;
}) {
  const t = useTranslations("umrah");
  if (items.length === 0) return null;

  return (
    <ul
      className="grid min-w-0"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {items.map((item, index) => {
        const lines = t.raw(item.linesKey) as string[];
        return (
          <InclusionItem
            key={item.id}
            item={item}
            lines={lines}
            showDivider={index < items.length - 1}
          />
        );
      })}
    </ul>
  );
}

/** Included services — rounded panel, 3 + 3 grid with dividers (listing reference). */
export function TripCardInclusions({
  trip,
  prominence = "default",
}: {
  trip: UmrahTrip;
  prominence?: "listing" | "default";
}) {
  const { row1, row2 } = getTripCardInclusionRows(trip);
  const isListing = prominence === "listing";

  if (row1.length === 0 && row2.length === 0) return null;

  return (
    <div
      className={cn(
        "border-b border-[#E8EBEF] bg-white px-3 py-2",
        isListing && "md:px-3.5 md:py-2.5",
      )}
    >
      <div className="flex flex-col gap-1.5 rounded-lg bg-[#F4F8FB] px-2.5 py-2 md:px-3 md:py-2.5">
        <InclusionRow items={row1} cols={3} />
        <InclusionRow items={row2} cols={3} />
      </div>
    </div>
  );
}
