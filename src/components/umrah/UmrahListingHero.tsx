import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import {
  LISTING_HERO_BENEFITS,
  LISTING_HERO_BENEFIT_ROWS_MOBILE,
  LISTING_HERO_IMAGE,
  type ListingHeroBenefit,
} from "@/lib/listing-hero-benefits";
import { IQ } from "@/lib/images";
import { cn } from "@/lib/utils";

function ListingHeroBenefitItemMobile({
  benefit,
  label,
}: {
  benefit: ListingHeroBenefit;
  label: string;
}) {
  return (
    <li className="flex min-w-0 flex-col items-center gap-1 text-center">
      <div className="relative h-5 w-5 shrink-0">
        <Image
          src={benefit.icon}
          alt=""
          fill
          className="umrah-listing-benefit-icon object-contain"
          sizes="20px"
          quality={IQ.thumb}
        />
      </div>
      <span className="w-full text-[8px] font-semibold leading-[1.15] text-[#051033]">
        {label}
      </span>
    </li>
  );
}

/** Desktop: icon above + two-line label — matches reference density. */
function ListingHeroBenefitItemDesktop({
  benefit,
  label,
}: {
  benefit: ListingHeroBenefit;
  label: string;
}) {
  return (
    <li className="flex w-[5.75rem] shrink-0 flex-col items-center gap-1.5 text-center lg:w-[6.25rem] xl:w-[6.5rem]">
      <div className="relative h-6 w-6 shrink-0 lg:h-7 lg:w-7">
        <Image
          src={benefit.icon}
          alt=""
          fill
          className="umrah-listing-benefit-icon object-contain"
          sizes="28px"
          quality={IQ.thumb}
        />
      </div>
      <span className="w-full text-[10px] font-semibold leading-[1.2] text-[#051033] lg:text-[11px]">
        {label}
      </span>
    </li>
  );
}

/**
 * Listing hero (Umrah Gruppenreisen only)
 * - Mobile: full-bleed Makkah plate, title, 4+4 icons
 * - Desktop: title + subtitle + 8 icons + soft-faded photo on the right
 */
export async function UmrahListingHero() {
  const t = await getTranslations("umrah");
  const listingTitle = t("listingTitle");
  const titleParts = listingTitle.trim().split(/\s+/);
  const titleFirst = titleParts[0] ?? listingTitle;
  const titleRest = titleParts.slice(1).join(" ");

  return (
    <section
      className="umrah-listing-hero-bg relative overflow-hidden border-b-0 bg-white"
      aria-labelledby="umrah-listing-hero-heading"
    >
      <h1 id="umrah-listing-hero-heading" className="sr-only">
        {listingTitle}
      </h1>

      {/* Mobile: full-bleed. Desktop: photo on the right. */}
      <div
        className="pointer-events-none absolute inset-0 md:inset-y-0 md:end-0 md:start-auto md:w-[55%]"
        aria-hidden
      >
        <Image
          src={LISTING_HERO_IMAGE}
          alt=""
          fill
          priority
          quality={IQ.hero}
          sizes="(max-width: 767px) 100vw, 55vw"
          className="umrah-listing-hero-photo object-cover object-[72%_42%] md:object-[76%_40%]"
        />
      </div>

      <div className="umrah-listing-hero-scrim pointer-events-none absolute inset-0" aria-hidden />

      {/* ——— Mobile ——— */}
      <Container className="relative flex h-full min-h-[inherit] items-end pb-4 pt-5 md:hidden">
        <div className="flex w-full flex-col justify-end gap-3">
          <div>
            <p
              className="min-w-0 font-black leading-[0.98] tracking-[-0.03em] text-[#051033] uppercase"
              aria-hidden="true"
            >
              {titleRest ? (
                <>
                  <span className="block text-[32px] font-black tracking-[-0.04em]">
                    {titleFirst}
                  </span>
                  <span className="block text-[20px] font-extrabold">{titleRest}</span>
                </>
              ) : (
                <span className="block text-[26px]">{listingTitle}</span>
              )}
            </p>
            <p className="mt-1 max-w-[34rem] text-[13px] font-medium leading-snug text-[#5B6B7C]">
              {t("listingSubtitle")}
            </p>
          </div>

          <div className="w-full" aria-label={t("inclusions")}>
            {LISTING_HERO_BENEFIT_ROWS_MOBILE.map((row, rowIndex) => (
              <ul
                key={rowIndex}
                className={cn(
                  "ms-0 me-0 mb-0 grid w-full max-w-[22rem] list-none grid-cols-4 gap-x-2 gap-y-1.5 p-0",
                  rowIndex === 0 ? "mt-0" : "mt-2.5",
                )}
              >
                {row.map((benefit) => (
                  <ListingHeroBenefitItemMobile
                    key={benefit.id}
                    benefit={benefit}
                    label={t(benefit.labelKey)}
                  />
                ))}
              </ul>
            ))}
          </div>
        </div>
      </Container>

      {/* ——— Desktop ——— */}
      <Container className="relative hidden py-5 md:block lg:py-6">
        <div className="relative z-10 max-w-[min(100%,36rem)] lg:max-w-[min(100%,38rem)]">
          <p
            className="min-w-0 text-[30px] font-black uppercase leading-[1.05] tracking-[-0.03em] text-[#051033] lg:text-[34px] xl:text-[36px]"
            aria-hidden="true"
          >
            {listingTitle}
          </p>
          <p className="mt-1.5 max-w-[32rem] text-[14px] font-medium leading-snug text-[#5B6B7C] lg:text-[15px]">
            {t("listingSubtitle")}
          </p>

          <ul
            className="mt-4 flex w-fit max-w-full list-none flex-nowrap items-start justify-start gap-x-1 p-0 lg:mt-5 lg:gap-x-1.5 xl:gap-x-2"
            aria-label={t("inclusions")}
          >
            {LISTING_HERO_BENEFITS.map((benefit) => (
              <ListingHeroBenefitItemDesktop
                key={benefit.id}
                benefit={benefit}
                label={t(benefit.labelKey)}
              />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
