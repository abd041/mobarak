import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Headphones, Plane } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { HERO_SERVICE_ICONS } from "@/data/individual-umrah";
import { IQ } from "@/lib/images";

/** §5 — strong full-bleed Makkah / Kaaba photography */
const HERO_IMAGE = "/brand/individual-umrah-hero.png";

const SERVICE_IMAGE: Record<string, string> = {
  flight: "/brand/inclusion-icons/flight.png",
  hotel: "/brand/inclusion-icons/hotel.png",
  visa: "/brand/inclusion-icons/visa.png",
  transfer: "/brand/inclusion-icons/transfer.png",
};

export async function IndividualUmrahHero() {
  const t = await getTranslations("individualUmrah");
  const tSeo = await getTranslations("seo");

  const renderServices = (className?: string) => (
    <ul
      className={
        className ??
        /* Desktop / tablet under hero copy — do not change */
        "grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5 lg:flex lg:flex-wrap lg:gap-x-10 lg:gap-y-5"
      }
      aria-label={t("heroBadge")}
    >
      {HERO_SERVICE_ICONS.map((item) => (
        <li key={item.id} className="flex flex-col items-center gap-2 text-center">
          <Image
            src={SERVICE_IMAGE[item.iconKey]!}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="text-[12px] font-semibold text-navy sm:text-[13px]">{t(item.labelKey)}</span>
        </li>
      ))}
    </ul>
  );

  /** Mobile: full-width icon row — even spacing, navy labels (reference) */
  const renderMobileServicesInHero = () => (
    <ul className="mx-auto grid w-full max-w-sm grid-cols-4 gap-x-2" aria-label={t("heroBadge")}>
      {HERO_SERVICE_ICONS.map((item) => (
        <li key={item.id} className="flex min-w-0 flex-col items-center gap-2 text-center">
          <Image
            src={SERVICE_IMAGE[item.iconKey]!}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
          />
          <span className="w-full truncate text-[12px] font-semibold leading-none text-navy">
            {t(item.labelKey)}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-labelledby="individual-umrah-hero-heading">
      <div className="individual-umrah-hero relative overflow-hidden bg-white">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={HERO_IMAGE}
            alt={tSeo("kaabaAlt")}
            fill
            priority
            quality={IQ.hero}
            sizes="100vw"
            className="individual-umrah-hero-photo object-cover"
          />
          <div className="individual-umrah-hero-scrim absolute inset-0" />
        </div>

        <Container className="relative z-10 flex h-full flex-col py-6 md:items-center md:py-10 lg:py-12">
          <div className="flex w-full flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)] lg:items-start lg:gap-12 xl:gap-16">
            <div className="flex w-full flex-1 flex-col lg:max-w-2xl">
              {/* Mobile: left-aligned copy block (reference) */}
              <div className="max-w-[19rem] text-start md:max-w-none">
                <span className="mb-3.5 inline-block rounded-[6px] border border-brand-gold/60 bg-[#FFF8EE] px-2.5 py-1 text-[9px] font-bold tracking-[0.16em] text-brand-gold uppercase md:mb-4 md:rounded-full md:border-brand-orange/45 md:px-3.5 md:text-[11px] md:tracking-[0.14em] md:text-brand-orange-ink">
                  {t("heroBadge")}
                </span>

                <h1
                  id="individual-umrah-hero-heading"
                  className="text-[30px] font-bold leading-[1.08] tracking-[-0.02em] text-navy max-md:font-serif sm:text-[38px] sm:tracking-[-0.025em] lg:text-[44px]"
                >
                  {t("heroTitle")}
                  <br />
                  <span className="font-serif text-[32px] italic leading-[1.05] text-brand-gold sm:text-[inherit]">
                    {t("heroTitleAccent")}
                  </span>
                </h1>

                <p className="mt-3.5 whitespace-pre-line text-[13.5px] leading-[1.6] text-[#3D4F5F] sm:mt-4 sm:text-[15px] md:mt-5 md:max-w-[34rem] md:text-[16px]">
                  {t("heroBody")}
                </p>
              </div>

              {/*
                Mobile: icons on hero wash; extra bottom padding so the photo
                continues under the form card (overlap like reference).
              */}
              <div className="mt-8 w-full pb-16 md:hidden">{renderMobileServicesInHero()}</div>

              {/* Desktop / tablet: unchanged */}
              <div className="mt-8 hidden md:block">{renderServices()}</div>
            </div>

            {/* Desktop info card — unchanged (lg+) */}
            <aside className="relative mt-8 hidden min-h-[320px] flex-col rounded-[22px] border border-line/70 bg-white px-7 py-8 shadow-[0_10px_36px_rgba(11,44,74,0.10)] lg:mt-1 lg:flex">
              <h2 className="font-serif text-[22px] font-bold leading-tight text-navy">
                {t("infoCardTitle")}
              </h2>

              <div className="mt-8 flex items-start gap-2.5">
                <Plane className="mt-0.5 h-[18px] w-[18px] shrink-0 text-navy" strokeWidth={1.75} aria-hidden />
                <div className="min-w-0">
                  <p className="text-[15px] font-bold leading-snug text-navy">{t("infoCardAirports")}</p>
                  <p className="mt-2 max-w-[16rem] text-[14px] leading-[1.55] text-[#5A6B7A]">
                    {t("infoCardAirportList")}
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-[#E6EBF0]" />

              <p className="mt-7 max-w-[15.5rem] pe-14 text-[14px] leading-[1.55] font-semibold text-navy">
                {t("infoCardNote")}
              </p>

              <span
                className="absolute end-6 bottom-6 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white shadow-[0_6px_18px_rgba(11,44,74,0.28)]"
                aria-hidden
              >
                <Headphones className="h-6 w-6" strokeWidth={1.75} />
              </span>
            </aside>
          </div>
        </Container>
      </div>
    </section>
  );
}
