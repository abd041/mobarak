import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import {
  LISTING_HERO_IMAGE_MAKKAH,
  LISTING_HERO_IMAGE_MEDINA,
} from "@/lib/listing-hero-benefits";
import { IQ } from "@/lib/images";

/**
 * Compact Makkah + Medina hero — title and subtitle only.
 * Included services live in {@link UmrahListingInclusions} below.
 */
export async function UmrahListingHero() {
  const t = await getTranslations("umrah");

  return (
    <section
      className="relative overflow-hidden border-b border-line/70 bg-white lg:h-[500px] lg:min-h-[500px]"
      aria-labelledby="umrah-listing-hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 grid grid-cols-2" aria-hidden>
        <div className="relative">
          <Image
            src={LISTING_HERO_IMAGE_MEDINA}
            alt=""
            fill
            priority
            quality={IQ.hero}
            sizes="50vw"
            className="umrah-listing-hero-photo object-cover object-center"
          />
        </div>
        <div className="relative">
          <Image
            src={LISTING_HERO_IMAGE_MAKKAH}
            alt=""
            fill
            priority
            quality={IQ.hero}
            sizes="50vw"
            className="umrah-listing-hero-photo object-cover object-center"
          />
        </div>
      </div>

      <div className="umrah-listing-hero-scrim pointer-events-none absolute inset-0" aria-hidden />

      <Container className="relative flex h-full min-h-[inherit] items-center lg:min-h-[500px]">
        <div className="max-w-[min(100%,40rem)] py-5 sm:max-w-[min(100%,44rem)] sm:py-6 md:max-w-[min(100%,52rem)] lg:max-w-[min(100%,58rem)] lg:py-0">
          <h1
            id="umrah-listing-hero-heading"
            className="min-w-0 break-words text-[24px] font-bold tracking-[-0.02em] text-navy uppercase sm:text-[28px] lg:text-[30px]"
          >
            {t("listingTitle")}
          </h1>
          <p className="mt-1.5 max-w-[34rem] text-[15px] font-medium leading-snug text-[#3D4F5F] sm:mt-2 sm:text-[16px]">
            {t("listingSubtitle")}
          </p>
        </div>
      </Container>
    </section>
  );
}
