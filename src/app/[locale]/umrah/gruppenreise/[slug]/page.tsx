import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Briefcase,
  Footprints,
  Languages,
  Plane,
  Star,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { AvailabilityBadge } from "@/components/umrah/AvailabilityBadge";
import { OfferClient } from "@/components/umrah/OfferClient";
import { getHotel, getTrip, trips } from "@/data/mock";
import { formatEuro } from "@/lib/utils";

export function generateStaticParams() {
  return trips.map((t) => ({ slug: t.slug }));
}

export default async function OfferPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const trip = getTrip(slug);
  if (!trip) notFound();

  const t = await getTranslations("umrah");
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");
  const medina = getHotel(trip.medinaHotelId);
  const makkah = getHotel(trip.makkahHotelId);

  return (
    <OfferClient trip={trip} medina={medina} makkah={makkah}>
      <Container className="py-4 text-sm text-muted">
        <nav className="flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-navy">
            {tNav("home")}
          </Link>
          <span>/</span>
          <Link href="/umrah-gruppenreisen" className="hover:text-navy">
            {tNav("umrahGroup")}
          </Link>
          <span>/</span>
          <span className="text-navy">{trip.dateLabel}</span>
        </nav>
      </Container>

      {/* Hero summary for SSR content; interactive gallery in client */}
      <section className="pb-8">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="relative min-h-[360px] overflow-hidden rounded-3xl">
              <Image
                src={trip.images[0].src}
                alt={trip.images[0].caption}
                fill
                className="object-cover"
                priority
                sizes="(max-width:1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                <div className="mb-3">
                  <AvailabilityBadge trip={trip} />
                </div>
                <span className="mb-2 inline-block rounded bg-white/20 px-2 py-1 text-xs font-bold">
                  {tCommon("nights", { count: trip.nights }).toUpperCase()}
                </span>
                <h1 className="text-3xl font-bold md:text-4xl">{trip.title}</h1>
                <p className="mt-2 text-lg">{trip.dateLabel}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <span>{t("visaIncl")}</span>
                  <span>{t("flightIncl")}</span>
                  <span>{t("baggageIncl")}</span>
                  <span>{t("guideIncl")}</span>
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
              <h2 className="mb-4 text-lg font-bold text-navy">{t("pricesPerPerson")}</h2>
              <ul className="mb-6 space-y-3">
                <li className="flex items-end justify-between border-b border-line pb-3">
                  <span className="text-sm text-navy">{t("room4")}</span>
                  <span className="text-xl font-bold text-brand-green">
                    {formatEuro(trip.prices.quad)}
                  </span>
                </li>
                <li className="flex items-end justify-between border-b border-line pb-3">
                  <span className="text-sm text-navy">{t("room3")}</span>
                  <span className="text-xl font-bold text-brand-green">
                    {formatEuro(trip.prices.triple)}
                  </span>
                </li>
                <li className="flex items-end justify-between pb-1">
                  <span className="text-sm text-navy">{t("room2")}</span>
                  <span className="text-xl font-bold text-brand-green">
                    {formatEuro(trip.prices.double)}
                  </span>
                </li>
              </ul>
              <Link
                href={`/umrah/gruppenreise/${trip.slug}/anfrage`}
                className="mb-3 hidden w-full items-center justify-center rounded-xl bg-brand-cta py-3.5 text-sm font-semibold text-white md:inline-flex"
              >
                {tCommon("inquireNow")} →
              </Link>
              <a
                href="#hotels"
                className="mb-3 block text-center text-sm font-semibold text-brand-cta md:hidden"
              >
                {t("moreOfferInfo")} ↓
              </a>
              <ul className="space-y-1 text-xs text-muted">
                <li>✓ {tCommon("secureSpot")}</li>
                <li>✓ {tCommon("freeInquiry")}</li>
              </ul>
            </aside>
          </div>
        </Container>
      </section>

      {/* Hotels */}
      <section id="hotels" className="pb-10">
        <Container className="grid gap-6 md:grid-cols-2">
          {[medina, makkah].map((hotel) => (
            <article
              key={hotel.id}
              className="overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]"
            >
              <div className="relative aspect-[16/10]">
                <Image src={hotel.images[0].src} alt={hotel.name} fill className="object-cover" sizes="50vw" />
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-brand-orange">
                  {hotel.city === "medina" ? t("medina") : t("makkah")} –{" "}
                  {tCommon("nights", { count: hotel.nights })}
                </p>
                <h3 className="mt-1 flex flex-wrap items-center gap-2 text-xl font-bold text-navy">
                  {hotel.name}
                  <span className="inline-flex text-brand-gold">
                    {Array.from({ length: hotel.stars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-brand-gold" />
                    ))}
                  </span>
                </h3>
                <p className="text-sm text-muted">
                  {hotel.checkIn} – {hotel.checkOut}
                </p>
                <p className="mt-3 flex items-start gap-2 text-sm text-navy">
                  <Footprints className="mt-0.5 h-4 w-4 text-brand-orange" />
                  {t("walkingTo", {
                    minutes: hotel.walkingMinutes,
                    mosque: hotel.mosque === "nabawi" ? t("nabawi") : t("haram"),
                  })}
                </p>
                <p className="mt-1 text-sm text-navy">{t("breakfast")}</p>
                <p className="mt-3 flex items-center gap-2 text-sm text-navy/80">
                  <Languages className="h-4 w-4 text-brand-orange" />
                  {t("guideLanguages")}: {t("guideLanguagesValue")}
                </p>
              </div>
            </article>
          ))}
        </Container>
      </section>

      {/* Info bar */}
      <section className="pb-8">
        <Container>
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-line bg-surface p-5 md:grid-cols-5">
            <Info label={t("duration")} value={tCommon("nights", { count: trip.nights })} />
            <Info label={t("period")} value={trip.dateLabel} />
            <Info label={t("groupSize")} value={t("maxPersons", { count: trip.groupSize })} />
            <Info label={t("departureAirport")} value={trip.departureAirport} />
            <Info label={t("airline")} value={trip.airline} />
          </div>
        </Container>
      </section>

      {/* Flights */}
      <section className="pb-10">
        <Container>
          <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-navy">
              <Plane className="h-5 w-5 text-brand-orange" />
              {t("flightInfo", { airline: trip.airline })}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <FlightBlock
                title={t("outbound")}
                leg={trip.outbound}
                directLabel={t("direct")}
                durationLabel={t("flightDuration", { duration: trip.outbound.duration })}
              />
              <FlightBlock
                title={t("inbound")}
                leg={trip.inbound}
                directLabel={t("direct")}
                durationLabel={t("flightDuration", { duration: trip.inbound.duration })}
              />
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-navy">
              <Briefcase className="h-4 w-4" />
              {t("baggageIncl")}
            </p>
          </div>
        </Container>
      </section>

      {/* Inclusions */}
      <section className="pb-10">
        <Container>
          <h2 className="mb-4 text-xl font-bold text-navy">{t("inclusions")}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {[
              t("visaIncl"),
              t("flightIncl"),
              t("baggageIncl"),
              t("guideIncl"),
              t("religiousIncl"),
              t("transferIncl"),
              t("hotelsIncl"),
              t("breakfastIncl"),
              t("excursionsIncl"),
              `${t("guideLanguages")}: ${t("guideLanguagesValue")}`,
            ].map((item) => (
              <div key={item} className="rounded-xl border border-line bg-white p-3 text-sm text-navy">
                {item}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Itinerary */}
      <section className="pb-10">
        <Container>
          <h2 className="mb-4 text-xl font-bold text-navy">{t("itinerary")}</h2>
          <ol className="relative space-y-4 border-s-2 border-dashed border-brand-orange/40 ps-6">
            {trip.itinerary.map((item, idx) => (
              <li key={`${item.day}-${idx}`} className="relative">
                <span className="absolute -start-[1.9rem] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-green text-[10px] font-bold text-white">
                  {item.day}
                </span>
                <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold text-brand-orange">
                    TAG {item.day}
                    {item.time ? ` · ${item.time}` : ""}
                  </p>
                  <p className="font-medium text-navy">{item.title}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Final CTA desktop */}
      <section className="pb-24 md:pb-16">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-navy p-8 text-white md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold">{t("finalCtaTitle")}</h2>
              <p className="mt-2 text-white/75">{t("finalCtaBody")}</p>
            </div>
            <Link
              href={`/umrah/gruppenreise/${trip.slug}/anfrage`}
              className="inline-flex rounded-xl bg-brand-cta px-6 py-3.5 text-sm font-semibold"
            >
              {tCommon("inquireNow")} →
            </Link>
          </div>
        </Container>
      </section>
    </OfferClient>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="font-semibold text-navy">{value}</p>
    </div>
  );
}

function FlightBlock({
  title,
  leg,
  directLabel,
  durationLabel,
}: {
  title: string;
  leg: {
    dateLabel: string;
    fromCode: string;
    toCode: string;
    fromCity: string;
    toCity: string;
    departTime: string;
    arriveTime: string;
    duration: string;
    direct: boolean;
  };
  directLabel: string;
  durationLabel: string;
}) {
  return (
    <div className="rounded-xl bg-surface p-4">
      <p className="mb-2 font-semibold text-navy">{title}</p>
      <p className="text-sm text-muted">{leg.dateLabel}</p>
      <p className="mt-2 text-lg font-bold text-navy">
        {leg.fromCode} {leg.departTime} → {leg.toCode} {leg.arriveTime}
      </p>
      <p className="text-sm text-navy/80">
        {leg.fromCity} → {leg.toCity}
      </p>
      <p className="mt-1 text-sm text-muted">
        {leg.direct ? directLabel : ""} · {durationLabel}
      </p>
    </div>
  );
}
