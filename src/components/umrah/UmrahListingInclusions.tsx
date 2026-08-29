import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import {
  LISTING_HERO_BENEFIT_ROWS,
  type ListingHeroBenefit,
} from "@/lib/listing-hero-benefits";
import { IQ } from "@/lib/images";
import { cn } from "@/lib/utils";

function ListingInclusionItem({
  benefit,
  label,
}: {
  benefit: ListingHeroBenefit;
  label: string;
}) {
  return (
    <li className="flex min-w-0 flex-col items-center gap-1.5 text-center">
      <div className="relative h-8 w-8 shrink-0 sm:h-9 sm:w-9">
        <Image
          src={benefit.icon}
          alt=""
          fill
          className="umrah-listing-benefit-icon object-contain"
          sizes="36px"
          quality={IQ.thumb}
        />
      </div>
      <span className="min-w-0 break-words text-[10px] font-semibold leading-[1.25] text-navy sm:text-[11px]">
        {label}
      </span>
    </li>
  );
}

/** Page-level included services — shown after the hero, before travel filters. */
export async function UmrahListingInclusions() {
  const t = await getTranslations("umrah");

  return (
    <section
      className="border-b border-line/70 bg-white"
      aria-labelledby="umrah-listing-inclusions-heading"
    >
      <Container className="py-4 sm:py-5">
        <h2
          id="umrah-listing-inclusions-heading"
          className="mb-3 text-center text-[13px] font-bold tracking-[0.04em] text-navy uppercase sm:mb-4 sm:text-[14px]"
        >
          {t("inclusions")}
        </h2>
        <div className="space-y-3 sm:space-y-3.5">
          {LISTING_HERO_BENEFIT_ROWS.map((row, rowIndex) => (
            <ul
              key={rowIndex}
              className={cn(
                "grid gap-x-2 gap-y-3 sm:gap-x-3",
                rowIndex === 0 ? "grid-cols-3 sm:grid-cols-5" : "grid-cols-2 sm:grid-cols-4",
              )}
            >
              {row.map((benefit) => (
                <ListingInclusionItem
                  key={benefit.id}
                  benefit={benefit}
                  label={t(benefit.labelKey)}
                />
              ))}
            </ul>
          ))}
        </div>
      </Container>
    </section>
  );
}
