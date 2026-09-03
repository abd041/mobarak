"use client";

import { useCallback, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Star } from "lucide-react";
import type { GoogleReview } from "@/lib/google-reviews.server";
import { GoogleG } from "@/components/brand/GoogleLogos";
import { HajjReviewModal } from "@/components/hajj/HajjReviewModal";
import { isRtl as isRtlLocale } from "@/i18n/routing";
import { googleStats } from "@/data/mock";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import { cn } from "@/lib/utils";

function Stars({ count = 5, size = "h-3.5 w-3.5" }: { count?: number; size?: string }) {
  const tCommon = useTranslations("common");
  return (
    <div
      className="flex items-center gap-0.5 text-[#F5A623]"
      role="img"
      aria-label={tCommon("starRating", { count })}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className={`${size} fill-[#F5A623] text-[#F5A623]`} aria-hidden />
      ))}
    </div>
  );
}

function ReviewCardButton({
  review,
  index,
  isRtl,
  onOpen,
  tCommon,
  variant,
}: {
  review: GoogleReview;
  index: number;
  isRtl: boolean;
  onOpen: (index: number) => void;
  tCommon: ReturnType<typeof useTranslations<"common">>;
  variant: "mobile" | "desktop";
}) {
  const isMobile = variant === "mobile";

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={tCommon("openReview", { name: review.name })}
      dir={isRtl ? "rtl" : "ltr"}
      className={cn(
        "flex w-full flex-col rounded-[14px] border border-[#E8EAEE] bg-white text-start transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1264F5]",
        isMobile
          ? "p-3.5 shadow-[0_4px_14px_rgba(11,44,74,0.04)]"
          : "h-full p-4 hover:border-[#d5d9e0] hover:shadow-[0_8px_22px_rgba(11,44,74,0.06)] sm:p-5",
      )}
    >
      <div className={cn("flex items-center gap-2.5", isMobile ? "mb-2.5" : "mb-3")}>
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-[#0B2A7A] font-bold text-white",
            isMobile ? "h-8 w-8 text-[13px]" : "h-9 w-9 text-[14px]",
          )}
          aria-hidden
        >
          {review.name.charAt(0)}
        </span>
        <Stars count={review.rating} size={isMobile ? "h-3 w-3" : "h-3.5 w-3.5"} />
      </div>

      <p
        dir="auto"
        className={cn(
          "flex-1 text-[#0B2A7A]/88 [unicode-bidi:plaintext]",
          isMobile
            ? "text-[12.5px] leading-[1.55]"
            : "min-h-[4.5rem] text-[13px] leading-[1.65] sm:text-[14px]",
        )}
      >
        „{review.text}“
      </p>

      <div className={cn("flex items-end justify-between gap-2", isMobile ? "mt-3" : "mt-4")}>
        <div className="min-w-0">
          <p
            className={cn(
              "truncate font-bold text-[#0B2A7A]",
              isMobile ? "text-[12.5px]" : "text-[13px] sm:text-[14px]",
            )}
          >
            {review.name}
          </p>
          <p className={cn("text-[#1264F5]", isMobile ? "mt-0.5 text-[11px]" : "mt-0.5 text-[12px]")}>
            {review.dateRelative}
          </p>
        </div>
        <GoogleG className={cn("shrink-0 opacity-90", isMobile ? "h-3.5 w-3.5" : "h-4 w-4")} />
      </div>
    </button>
  );
}

export function ReviewsSection({ reviews }: { reviews: GoogleReview[] }) {
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const shown = reviews.slice(0, 3);
  const close = useCallback(() => setModalIndex(null), []);

  const scrollToSlide = useCallback(
    (index: number) => {
      const carousel = carouselRef.current;
      if (!carousel) return;

      const slide = carousel.children[index] as HTMLElement | undefined;
      if (!slide) return;

      slide.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      setActiveSlide(index);
    },
    [],
  );

  const handleCarouselScroll = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const { scrollLeft, offsetWidth } = carousel;
    if (offsetWidth <= 0) return;

    const index = Math.round(Math.abs(scrollLeft) / offsetWidth);
    setActiveSlide(Math.min(Math.max(index, 0), shown.length - 1));
  }, [shown.length]);

  return (
    <section className="bg-white py-8 sm:py-10 md:py-12" aria-labelledby="reviews-heading">
      <Container className="lg:px-9">
        <div className="rounded-[18px] border border-[#E8EAEE] bg-white px-3.5 py-4 shadow-[0_8px_28px_rgba(11,44,74,0.05)] sm:px-6 sm:py-6 md:px-7 md:py-7">
          <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <GoogleG className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
                <h2
                  id="reviews-heading"
                  className="text-[15px] font-bold text-[#0B2A7A] sm:text-[18px]"
                >
                  {t("googleReviews")}
                </h2>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 ps-10 sm:mt-2.5 sm:gap-2.5">
                <span className="text-[18px] font-extrabold tracking-tight text-[#0B2A7A] sm:text-[24px]">
                  {googleStats.rating.toFixed(1).replace(".", ",")} / 5
                </span>
                <Stars size="h-3.5 w-3.5 sm:h-[18px] sm:w-[18px]" />
              </div>
              <p className="mt-0.5 ps-10 text-[12px] text-[#5B6B7C] sm:mt-1 sm:text-[14px]">
                {t("basedOn", { count: googleStats.count })}
              </p>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Mobarak+Hajj+%26+Umrah+Wien"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[#E0E4EA] bg-white px-4 py-2 text-[14px] font-bold text-[#1264F5] transition hover:border-[#1264F5]/40 hover:bg-[#F7FAFF] md:inline-flex"
            >
              {t("allReviews")}
              <DirArrow className="text-base" />
            </a>
          </div>

          {/* Mobile carousel */}
          <div className="md:hidden">
            <div
              ref={carouselRef}
              dir={isRtl ? "rtl" : "ltr"}
              onScroll={handleCarouselScroll}
              className="home-reviews-carousel flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {shown.map((review, index) => (
                <div
                  key={review.id}
                  className="w-full shrink-0 snap-center snap-always"
                  aria-hidden={activeSlide !== index}
                >
                  <ReviewCardButton
                    review={review}
                    index={index}
                    isRtl={isRtl}
                    onOpen={setModalIndex}
                    tCommon={tCommon}
                    variant="mobile"
                  />
                </div>
              ))}
            </div>

            <div
              className="mt-3.5 flex items-center justify-center gap-2"
              role="tablist"
              aria-label={t("googleReviews")}
            >
              {shown.map((review, index) => (
                <button
                  key={`dot-${review.id}`}
                  type="button"
                  role="tab"
                  aria-selected={activeSlide === index}
                  aria-label={tCommon("openReview", { name: review.name })}
                  onClick={() => scrollToSlide(index)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    activeSlide === index ? "bg-[#1264F5]" : "bg-[#1264F5]/22",
                  )}
                />
              ))}
            </div>
          </div>

          {/* Desktop grid — unchanged from md breakpoint upward */}
          <ul className="hidden gap-3.5 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5">
            {shown.map((review, index) => (
              <li key={review.id} className={index === 2 ? "md:col-span-2 lg:col-span-1" : undefined}>
                <ReviewCardButton
                  review={review}
                  index={index}
                  isRtl={isRtl}
                  onOpen={setModalIndex}
                  tCommon={tCommon}
                  variant="desktop"
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {modalIndex !== null ? (
        <HajjReviewModal
          reviews={shown}
          index={modalIndex}
          onClose={close}
          onIndexChange={setModalIndex}
          isRtl={isRtl}
        />
      ) : null}
    </section>
  );
}
