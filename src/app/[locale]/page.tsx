import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Check,
  Heart,
  MapPin,
  Medal,
  Users,
  Plane,
  Hotel,
  FileText,
  Moon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { TripCard } from "@/components/umrah/TripCard";
import { getHotel, IMG, reviews, trips } from "@/data/mock";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  const services = [
    {
      title: t("serviceUmrahTitle"),
      price: t("serviceUmrahPrice"),
      body: t("serviceUmrahBody"),
      href: "/umrah-gruppenreisen",
      cta: tCommon("viewAllDates"),
      icon: Users,
      tone: "bg-amber-50 text-brand-orange",
    },
    {
      title: t("serviceIndividualTitle"),
      body: t("serviceIndividualBody"),
      href: "/individuelle-umrah",
      cta: tCommon("learnMore"),
      icon: Hotel,
      tone: "bg-sky-50 text-brand-blue",
    },
    {
      title: t("serviceHajjTitle"),
      body: t("serviceHajjBody"),
      href: "/hajj-2027",
      cta: tCommon("learnMore"),
      icon: Moon,
      tone: "bg-emerald-50 text-brand-green",
    },
    {
      title: t("serviceVisaTitle"),
      body: t("serviceVisaBody"),
      href: "/visum-service",
      cta: tCommon("learnMore"),
      icon: FileText,
      tone: "bg-violet-50 text-violet-700",
    },
  ];

  const trust = [
    { title: t("trust1Title"), body: t("trust1Body"), icon: Medal },
    { title: t("trust2Title"), body: t("trust2Body"), icon: Users },
    { title: t("trust3Title"), body: t("trust3Body"), icon: MapPin },
    { title: t("trust4Title"), body: t("trust4Body"), icon: Heart },
  ];

  const why = [t("why1"), t("why2"), t("why3"), t("why4"), t("why5")];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <Container className="relative grid items-center gap-8 py-10 md:grid-cols-2 md:py-16 lg:py-20">
          <div className="relative z-10">
            <p className="mb-3 text-xs font-bold tracking-[0.14em] text-brand-orange md:text-sm">
              {t("heroEyebrow")}
            </p>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-navy md:text-4xl lg:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted md:text-lg">
              {t("heroBody")}
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl md:aspect-[5/4]">
            <Image
              src={IMG.kaaba}
              alt="Masjid al-Haram"
              fill
              priority
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 w-1/3 bg-gradient-to-r from-white to-transparent rtl:bg-gradient-to-l" />
          </div>
        </Container>

        {/* Service cards overlapping hero */}
        <Container className="relative z-20 -mt-6 pb-10 md:-mt-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className={`mb-4 inline-flex rounded-xl p-3 ${s.tone}`}>
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mb-1 text-lg font-bold text-navy">{s.title}</h3>
                {"price" in s && s.price && (
                  <p className="mb-2 text-sm font-semibold text-brand-green">{s.price}</p>
                )}
                <p className="mb-4 text-sm leading-relaxed text-muted">{s.body}</p>
                <span className="text-sm font-semibold text-brand-cta">
                  {s.cta} →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Trust */}
      <section className="border-y border-line bg-white py-10">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trust.map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-orange-soft text-brand-orange">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-navy">{item.title}</h3>
                  <p className="text-sm text-muted">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <ReviewsSection reviews={reviews} />

      {/* Next trips */}
      <section className="py-14">
        <Container>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-wide text-navy md:text-3xl">
              {t("tripsTitle")}
            </h2>
            <p className="mt-2 text-muted">{t("tripsSubtitle")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                medina={getHotel(trip.medinaHotelId)}
                makkah={getHotel(trip.makkahHotelId)}
                variant="home"
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Why + Promise */}
      <section className="bg-surface py-14">
        <Container className="grid items-stretch gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-8 shadow-[var(--shadow-card)]">
            <h2 className="mb-6 text-2xl font-bold text-navy">{t("whyTitle")}</h2>
            <ul className="space-y-4">
              {why.map((item) => (
                <li key={item} className="flex gap-3 text-navy/90">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-2xl">
            <Image src={IMG.medina} alt="" fill className="object-cover" sizes="50vw" />
            <div className="absolute inset-0 bg-navy/45" />
            <div className="relative z-10 flex h-full min-h-[320px] items-end p-8">
              <div className="rounded-2xl bg-white/95 p-6 shadow-lg">
                <h3 className="mb-3 text-lg font-bold text-navy">{t("promiseTitle")}</h3>
                <p className="mb-3 text-sm leading-relaxed text-navy/80">{t("promiseBody")}</p>
                <p className="text-sm font-semibold text-brand-orange">{t("promiseSign")}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Partners — placeholders only (no fake accreditation claims) */}
      <section className="py-12">
        <Container>
          <h2 className="mb-8 text-center text-sm font-bold tracking-wide text-navy/70">
            {t("partnersTitle")}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex h-14 w-28 items-center justify-center rounded-xl border border-dashed border-line bg-surface text-xs text-muted"
              >
                Logo
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Newsletter */}
      <section className="pb-16">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-navy px-6 py-8 text-white md:flex-row md:items-center md:px-10">
            <div className="flex items-start gap-4">
              <Plane className="mt-1 h-8 w-8 text-brand-orange" />
              <div>
                <h2 className="text-xl font-bold">{t("newsletterTitle")}</h2>
                <p className="mt-1 text-sm text-white/75">{t("newsletterBody")}</p>
              </div>
            </div>
            <form className="flex w-full max-w-md flex-col gap-2 sm:flex-row" action="#">
              <input
                type="email"
                required
                placeholder={t("newsletterPlaceholder")}
                className="w-full rounded-xl border-0 px-4 py-3 text-navy outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-brand-orange px-5 py-3 text-sm font-semibold text-white"
              >
                {t("newsletterCta")}
              </button>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}
