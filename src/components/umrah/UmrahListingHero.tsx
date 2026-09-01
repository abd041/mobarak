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
      <div className="relative h-6 w-6 shrink-0">
        <Image
          src={benefit.icon}
          alt=""
          fill
          className="umrah-listing-benefit-icon object-contain"
          sizes="24px"
          quality={IQ.thumb}
        />
      </div>
      <span className="w-full text-[8px] font-semibold leading-[1.15] text-[#051033]">
        {label}
      </span>
    </li>
  );
}

/** Desktop: icon left + text right, single row. */
function ListingHeroBenefitItemDesktop({
  benefit,
  label,
}: {
  benefit: ListingHeroBenefit;
  label: string;
}) {
  return (
    <li className="flex shrink-0 items-center gap-1.5 lg:gap-2">
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
      <span className="max-w-[4.75rem] text-[10px] font-semibold leading-[1.2] text-[#051033] lg:max-w-[5.25rem] lg:text-[11px] xl:max-w-[5.5rem] xl:text-[11px]">
        {label}
      </span>
    </li>
  );
}

/**
 * Listing hero
 * - Mobile (locked): full-bleed Kaaba, title, 4+5 icons
 * - Desktop: title + subtitle + 9 icons in one row (icon left, text right) + Kaaba right fade
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
        className="pointer-events-none absolute inset-0 md:inset-y-0 md:end-0 md:start-auto md:w-[50%]"
        aria-hidden
      >
        <Image
          src={LISTING_HERO_IMAGE}
          alt=""
          fill
          priority
          quality={IQ.hero}
          sizes="(max-width: 767px) 100vw, 50vw"
          className="umrah-listing-hero-photo object-cover object-[78%_36%] md:object-[70%_40%]"
        />
      </div>

      <div className="umrah-listing-hero-scrim pointer-events-none absolute inset-0" aria-hidden />

      {/* ——— Mobile (do not change) ——— */}
      <Container className="relative flex h-full min-h-[inherit] items-end pb-5 pt-6 md:hidden">
        <div className="flex w-full flex-col justify-end gap-4">
          <div>
            <p
              className="min-w-0 font-black leading-[0.98] tracking-[-0.03em] text-[#051033] uppercase"
              aria-hidden="true"
            >
              {titleRest ? (
                <>
                  <span className="block text-[34px] font-black tracking-[-0.04em]">
                    {titleFirst}
                  </span>
                  <span className="block text-[22px] font-extrabold">{titleRest}</span>
                </>
              ) : (
                <span className="block text-[28px]">{listingTitle}</span>
              )}
            </p>
            <p className="mt-1.5 max-w-[34rem] text-[13px] font-medium leading-snug text-[#5B6B7C]">
              {t("listingSubtitle")}
            </p>
          </div>

          <div className="w-full" aria-label={t("inclusions")}>
            {LISTING_HERO_BENEFIT_ROWS_MOBILE.map((row, rowIndex) => (
              <ul
                key={rowIndex}
                className={cn(
                  "ms-0 me-0 mb-0 list-none gap-x-1.5 gap-y-2 p-0",
                  rowIndex === 0
                    ? "mt-0 flex w-[78%] max-w-[17.5rem] justify-between"
                    : "mt-3 grid w-full max-w-[22.5rem] grid-cols-5",
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
      <Container className="relative hidden py-7 md:block lg:py-8">
        <div>
          <p
            className="min-w-0 max-w-[min(100%,44rem)] text-[36px] font-black uppercase leading-[1.05] tracking-[-0.03em] text-[#051033] lg:max-w-[min(100%,48rem)] lg:text-[42px]"
            aria-hidden="true"
          >
            {listingTitle}
          </p>
          <p className="mt-2 max-w-[34rem] text-[15px] font-medium leading-snug text-[#5B6B7C] lg:text-[16px]">
            {t("listingSubtitle")}
          </p>

          <ul
            className="mt-5 flex w-fit max-w-full list-none flex-nowrap items-center justify-start gap-x-2.5 p-0 lg:mt-6 lg:gap-x-3 xl:gap-x-3.5"
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
