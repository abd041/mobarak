"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { TripCard } from "@/components/umrah/TripCard";
import { Container } from "@/components/ui/Container";
import {
  FILTER_KEYS,
  FILTER_LABELS_DE,
  getHotel,
  IMG,
  trips as allTrips,
} from "@/data/mock";

type SortKey = "next" | "priceAsc" | "priceDesc" | "seats";

export function UmrahListingClient() {
  const t = useTranslations("umrah");
  const [filter, setFilter] = useState<(typeof FILTER_KEYS)[number]>("all");
  const [sort, setSort] = useState<SortKey>("next");

  const filtered = useMemo(() => {
    let list = [...allTrips];
    if (filter !== "all") {
      list = list.filter((trip) => trip.filterTags.includes(filter));
    }
    list.sort((a, b) => {
      if (sort === "priceAsc") return a.prices.quad - b.prices.quad;
      if (sort === "priceDesc") return b.prices.quad - a.prices.quad;
      if (sort === "seats") return b.availableSeats - a.availableSeats;
      return a.startDate.localeCompare(b.startDate);
    });
    return list;
  }, [filter, sort]);

  const inclusions = [
    t("visaIncl"),
    t("flightIncl"),
    t("baggageIncl"),
    t("guideIncl"),
    t("religiousIncl"),
    t("hotelsIncl"),
    t("breakfastIncl"),
    t("transferIncl"),
    t("excursionsIncl"),
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <Container className="grid items-center gap-8 py-10 md:grid-cols-2 md:py-14">
          <div>
            <h1 className="mb-3 text-3xl font-bold text-navy md:text-4xl">{t("listingTitle")}</h1>
            <p className="mb-6 text-lg text-muted">{t("listingSubtitle")}</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-navy/80 sm:grid-cols-3">
              {inclusions.map((item) => (
                <span key={item} className="rounded-lg bg-surface px-2 py-2">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
            <Image src={IMG.kaaba} alt="" fill className="object-cover" sizes="50vw" priority />
          </div>
        </Container>
      </section>

      <Container className="pb-16">
        <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-2">
          {FILTER_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                filter === key
                  ? "border-brand-orange bg-brand-orange-soft text-brand-orange"
                  : "border-line bg-white text-navy"
              }`}
            >
              {key === "all" ? t("filterAll") : FILTER_LABELS_DE[key]}
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-navy">{t("found", { count: filtered.length })}</p>
          <label className="flex items-center gap-2 text-sm text-navy">
            {t("sortBy")}
            <select
              className="rounded-lg border border-line px-3 py-2"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="next">{t("sortNext")}</option>
              <option value="priceAsc">{t("sortPriceAsc")}</option>
              <option value="priceDesc">{t("sortPriceDesc")}</option>
              <option value="seats">{t("sortSeats")}</option>
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface p-10 text-center">
            <p className="mb-4 text-navy">{t("emptyFilter")}</p>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="font-semibold text-brand-cta hover:underline"
            >
              {t("otherDates")}
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                medina={getHotel(trip.medinaHotelId)}
                makkah={getHotel(trip.makkahHotelId)}
              />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
