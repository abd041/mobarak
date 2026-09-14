"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { Libre_Baskerville } from "next/font/google";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { GoogleReview, GoogleReviewStats } from "@/lib/google-reviews.server";
import { GoogleG, GoogleWordmark } from "@/components/brand/GoogleLogos";
import { isRtl as isRtlLocale } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import { HajjReviewModal } from "@/components/hajj/HajjReviewModal";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = ["#5B6B7C", "#2A9B8F", "#8B5E3C", "#1A73E8", "#B86A10", "#C0392B"];
const CTA_BLUE = "#1264F5";
const NAVY = "#0A1F3D";

const reviewsDisplay = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
});

function Stars({ count = 5, size = "h-3.5 w-3.5" }: { count?: number; size?: string }) {
  const tCommon = useTranslations("common");
  return (
    <div
      className="flex items-center gap-0.5 text-[#F4B400]"
      role="img"
      aria-label={tCommon("starRating", { count })}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className={cn(size, "fill-[#F4B400]")} aria-hidden />
      ))}
    </div>
  );
}

function ReviewerAvatar({
  review,
  colorIndex,
}: {
  review: Pick<GoogleReview, "name" | "avatar">;
  colorIndex: number;
}) {
  if (review.avatar) {
    return (
      <Image
        src={review.avatar}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white"
      style={{ backgroundColor: AVATAR_COLORS[colorIndex % AVATAR_COLORS.length] }}
      aria-hidden
    >
      {review.name.charAt(0).toUpperCase()}
    </span>
  );
}

function ReviewCard({
  review,
  index,
  onOpen,
  isRtl,
}: {
  review: GoogleReview;
  index: number;
  onOpen: () => void;
  isRtl: boolean;
}) {
  const tCommon = useTranslations("common");

  return (
    <article
      dir={isRtl ? "rtl" : "ltr"}
      className="flex h-full min-h-[168px] flex-col rounded-2xl bg-white p-4 shadow-[0_4px_18px_rgba(9,30,66,0.06)] sm:p-5"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={tCommon("openReview", { name: review.name })}
        className="flex flex-1 flex-col text-start"
      >
        <div className="flex items-start gap-3">
          <ReviewerAvatar review={review} colorIndex={index} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="truncate text-[14px] font-bold leading-tight text-[#1A1A1A]">
                {review.name}
              </p>
              <Stars count={review.rating} size="h-3 w-3" />
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[12px] text-[#8A94A6]">
              <GoogleG className="h-3.5 w-3.5 shrink-0" />
              {review.dateRelative ? <span>{review.dateRelative}</span> : null}
            </div>
          </div>
        </div>

        <p
          dir="auto"
          className="mt-3 line-clamp-4 flex-1 text-[13px] leading-[1.55] text-[#4A5A6A] [unicode-bidi:plaintext]"
        >
          {review.text}
        </p>
      </button>
    </article>
  );
}

export function HajjReviewsSection({
  reviews,
  stats,
  mapsUrl,
}: {
  reviews: GoogleReview[];
  stats: GoogleReviewStats;
  mapsUrl: string;
}) {
  const t = useTranslations("hajj");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const openReview = useCallback((index: number) => setModalIndex(index), []);
  const closeModal = useCallback(() => setModalIndex(null), []);

  const ratingLabel = stats.rating.toLocaleString(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const desktopReviews = useMemo(() => reviews.slice(0, 3), [reviews]);
  const mobileReviews = useMemo(() => reviews.slice(0, 5), [reviews]);

  return (
    <section
      id="hajj-reviews"
      className="bg-white py-8 md:py-10 lg:py-12"
      aria-labelledby="hajj-reviews-heading"
    >
      <Container>
        <h2 id="hajj-reviews-heading" className="sr-only">
          {t("reviewsHeading")}
        </h2>
        <div className="rounded-[20px] bg-white px-0 py-0 lg:bg-[#F4F5F7] lg:px-8 lg:py-9 xl:px-10 sm:px-0 md:rounded-[24px]">
          {/* Desktop / large tablet — reference horizontal layout */}
          <div className="hidden items-stretch gap-6 lg:grid lg:grid-cols-[minmax(13.5rem,16.5rem)_minmax(9.5rem,11.5rem)_minmax(0,1fr)] lg:gap-7 xl:grid-cols-[minmax(14.5rem,17.5rem)_minmax(10rem,12rem)_minmax(0,1fr)] xl:gap-8">
            {/* Left copy + CTA */}
            <div className="flex flex-col justify-center">
              <p
                className={`${reviewsDisplay.className} text-[28px] font-bold leading-[1.2] tracking-[-0.02em] xl:text-[32px]`}
                style={{ color: NAVY }}
              >
                {t("reviewsHeading")}
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-[#5A6A7A] xl:text-[15px]">
                {t("reviewsLead")}
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg border px-4 py-2.5 text-[13px] font-semibold transition hover:bg-white xl:text-[14px]"
                style={{ borderColor: CTA_BLUE, color: CTA_BLUE }}
              >
                {tCommon("allReviews")}
                <DirArrow />
              </a>
            </div>

            {/* Google rating summary */}
            <div className="flex flex-col items-center justify-center text-center">
              <GoogleWordmark className="h-[28px] w-auto" />
              <div className="mt-3">
                <Stars size="h-[18px] w-[18px]" />
              </div>
              <p
                className="mt-2 text-[18px] font-bold leading-none xl:text-[20px]"
                style={{ color: NAVY }}
              >
                {t("ratingOf5", { rating: ratingLabel })}
              </p>
              <p className="mt-2 max-w-[11rem] text-[12px] leading-snug text-[#6B7785]">
                {t("basedOnReviewsOver", {
                  count: stats.count.toLocaleString(locale),
                })}
              </p>
            </div>

            {/* Three review cards */}
            <div className="grid min-w-0 grid-cols-3 gap-3 xl:gap-4">
              {desktopReviews.map((review, index) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  index={index}
                  isRtl={isRtl}
                  onOpen={() => openReview(index)}
                />
              ))}
            </div>
          </div>

          {/* Mobile / small tablet */}
          <div className="lg:hidden">
            <p
              className={`${reviewsDisplay.className} text-[26px] font-bold leading-[1.2]`}
              style={{ color: NAVY }}
            >
              {t("reviewsHeading")}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-[#5A6A7A]">
              {t("reviewsLead")}
            </p>

            <div className="mt-6 flex flex-col items-center">
              <GoogleWordmark className="h-[26px] w-auto" />
              <div className="mt-2">
                <Stars size="h-4 w-4" />
              </div>
              <p className="mt-2 text-[17px] font-bold" style={{ color: NAVY }}>
                {t("ratingOf5", { rating: ratingLabel })}
              </p>
              <p className="mt-1 text-center text-[11px] leading-snug text-[#6B7785]">
                {t("basedOnReviewsOver", {
                  count: stats.count.toLocaleString(locale),
                })}
              </p>
            </div>

            <div className="mt-5">
              {mobileReviews[mobileIndex] ? (
                <ReviewCard
                  review={mobileReviews[mobileIndex]}
                  index={mobileIndex}
                  isRtl={isRtl}
                  onOpen={() => openReview(mobileIndex)}
                />
              ) : null}
            </div>

            {mobileReviews.length > 1 ? (
              <div className="mt-3 flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={() =>
                    setMobileIndex(
                      (mobileIndex - 1 + mobileReviews.length) % mobileReviews.length,
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7785]"
                  aria-label="Vorherige Bewertung"
                >
                  {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
                <div className="flex items-center gap-1.5" aria-hidden>
                  {mobileReviews.map((review, index) => (
                    <span
                      key={review.id}
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: index === mobileIndex ? 18 : 6,
                        backgroundColor: index === mobileIndex ? CTA_BLUE : "#D6DCE5",
                      }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setMobileIndex((mobileIndex + 1) % mobileReviews.length)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7785]"
                  aria-label="Nächste Bewertung"
                >
                  {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              </div>
            ) : null}

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border text-[13px] font-semibold"
              style={{ borderColor: CTA_BLUE, color: CTA_BLUE }}
            >
              {tCommon("allReviews")}
              <DirArrow />
            </a>
          </div>
        </div>
      </Container>

      {modalIndex !== null ? (
        <HajjReviewModal
          reviews={reviews}
          index={modalIndex}
          onClose={closeModal}
          onIndexChange={setModalIndex}
          isRtl={isRtl}
        />
      ) : null}
    </section>
  );
}
