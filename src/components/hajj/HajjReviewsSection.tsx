"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { GoogleReview, GoogleReviewStats } from "@/lib/google-reviews.server";
import { GoogleG } from "@/components/brand/GoogleLogos";
import { isRtl as isRtlLocale } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import { HajjReviewModal } from "@/components/hajj/HajjReviewModal";

const AVATAR_COLORS = ["#1F8A4C", "#1A73E8", "#00897B", "#C0392B", "#B86A10"];
const DESKTOP_VISIBLE = 3;

function Stars({ count = 5, size = "h-3.5 w-3.5" }: { count?: number; size?: string }) {
  const tCommon = useTranslations("common");
  return (
    <div
      className="flex items-center gap-0.5 text-[#B86A10]"
      role="img"
      aria-label={tCommon("starRating", { count })}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className={`${size} fill-[#B86A10]`} aria-hidden />
      ))}
    </div>
  );
}

function ReviewerAvatar({
  review,
  colorIndex,
}: {
  review: GoogleReview;
  colorIndex: number;
}) {
  if (review.avatar) {
    return (
      <Image
        src={review.avatar}
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
      style={{ backgroundColor: AVATAR_COLORS[colorIndex % AVATAR_COLORS.length] }}
      aria-hidden
    >
      {review.name.charAt(0)}
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
  const tHajj = useTranslations("hajj");

  return (
    <article
      dir={isRtl ? "rtl" : "ltr"}
      className="flex h-full min-h-40 flex-col rounded-xl border border-[#E9EAEE] bg-white p-4 lg:min-h-44 lg:p-5"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={tCommon("openReview", { name: review.name })}
        className="flex flex-1 flex-col text-start"
      >
        <div className="flex items-center gap-2.5">
          <ReviewerAvatar review={review} colorIndex={index} />
          <p className="min-w-0 flex-1 truncate text-[14px] font-bold text-[#091B3B]">{review.name}</p>
        </div>

        <div className="mt-2.5 flex justify-start">
          <Stars count={review.rating} />
        </div>

        {review.dateRelative ? (
          <p className="mt-1.5 text-[12px] text-[#5B6B7C]">{review.dateRelative}</p>
        ) : null}

        <p
          dir="auto"
          className="mt-2.5 line-clamp-4 text-[13px] leading-[1.65] text-[#3D4F5F] [unicode-bidi:plaintext]"
        >
          {review.text}
        </p>

        <div className="mt-3 flex items-end justify-between gap-2">
          <span className="text-[13px] font-semibold text-brand-cta">{tHajj("readMoreReview")}</span>
          <GoogleG className="h-4 w-4 shrink-0" />
        </div>
      </button>
    </article>
  );
}

function ReviewsSlider({
  reviews,
  mapsUrl,
  onOpen,
  isRtl,
}: {
  reviews: GoogleReview[];
  mapsUrl: string;
  onOpen: (index: number) => void;
  isRtl: boolean;
}) {
  const tCommon = useTranslations("common");
  const tHajj = useTranslations("hajj");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [perView, setPerView] = useState(1);

  const ordered = isRtl ? [...reviews].reverse() : reviews;

  const goPrev = () => goTo(active - 1);
  const goNext = () => goTo(active + 1);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setPerView(mq.matches ? DESKTOP_VISIBLE : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const syncActiveFromScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = [...el.querySelectorAll<HTMLElement>("[data-review-card]")];
    if (!cards.length) return;
    const left = el.scrollLeft;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - left);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    syncActiveFromScroll();
    el.addEventListener("scroll", syncActiveFromScroll, { passive: true });
    window.addEventListener("resize", syncActiveFromScroll);
    return () => {
      el.removeEventListener("scroll", syncActiveFromScroll);
      window.removeEventListener("resize", syncActiveFromScroll);
    };
  }, [isRtl, ordered.length, syncActiveFromScroll]);

  const goTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el || ordered.length === 0) return;
    const clamped = ((index % ordered.length) + ordered.length) % ordered.length;
    const card = el.querySelectorAll<HTMLElement>("[data-review-card]")[clamped];
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    setActive(clamped);
  };

  const showNav = ordered.length > perView;
  const toSourceIndex = (displayIndex: number) =>
    isRtl ? reviews.length - 1 - displayIndex : displayIndex;

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div
        className="relative min-w-0"
        role="region"
        aria-roledescription="carousel"
        aria-label={tCommon("reviewsCarousel")}
      >
        {showNav ? (
          <button
            type="button"
            onClick={goPrev}
            className="absolute start-0 top-[42%] z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E6E8EC] bg-white text-navy shadow-sm transition hover:bg-[#fafbfc] lg:h-10 lg:w-10"
            aria-label={tCommon("previousReview")}
          >
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" aria-hidden />
          </button>
        ) : null}

        {showNav ? (
          <button
            type="button"
            onClick={goNext}
            className="absolute end-0 top-[42%] z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E6E8EC] bg-white text-navy shadow-sm transition hover:bg-[#fafbfc] lg:h-10 lg:w-10"
            aria-label={tCommon("nextReview")}
          >
            <ChevronRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
          </button>
        ) : null}

        <div
          ref={scrollerRef}
          dir={isRtl ? "rtl" : "ltr"}
          className={`no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth py-1 ${
            showNav ? "px-11 lg:px-12" : "px-1"
          }`}
          tabIndex={0}
          aria-live="polite"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              if (isRtl) goNext();
              else goPrev();
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              if (isRtl) goPrev();
              else goNext();
            }
          }}
        >
          {ordered.map((review, index) => (
            <div
              key={review.id}
              data-review-card
              className="w-full shrink-0 snap-start lg:w-[calc((100%-2rem)/3)]"
            >
              <ReviewCard
                review={review}
                index={index}
                isRtl={isRtl}
                onOpen={() => onOpen(toSourceIndex(index))}
              />
            </div>
          ))}
        </div>
      </div>

      {ordered.length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-1" role="tablist">
          {ordered.map((review, i) => (
            <button
              key={review.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={tCommon("goToReview", { n: i + 1 })}
              aria-current={i === active ? "true" : undefined}
              className="flex h-8 w-8 items-center justify-center rounded-full"
            >
              <span
                className={`block rounded-full transition-all ${
                  i === active
                    ? "h-2.5 w-2.5 bg-brand-orange-cta"
                    : "h-2 w-2 bg-navy/25 hover:bg-navy/45"
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex justify-center lg:mt-6">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[14px] font-bold text-[#091B3B] transition hover:text-brand-orange-ink"
        >
          <span>{tHajj("allGoogleReviews")}</span>
          <DirArrow />
        </a>
      </div>
    </div>
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
  const t = useTranslations("home");
  const tHajj = useTranslations("hajj");
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const openReview = useCallback((index: number) => setModalIndex(index), []);
  const closeModal = useCallback(() => setModalIndex(null), []);

  const ratingLabel = stats.rating.toLocaleString(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <section className="bg-white py-8 md:py-10" aria-labelledby="hajj-reviews-heading">
      <Container>
        <div className="mb-6 text-center md:mb-8">
          <h2
            id="hajj-reviews-heading"
            className="text-[22px] font-bold tracking-[-0.02em] text-navy md:text-[28px]"
          >
            {t("reviewsTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-[14px] leading-relaxed text-muted md:text-[15px]">
            {t("reviewsSubtitle")}
          </p>
        </div>

        <div className="rounded-[16px] border border-[#E9EAEE] bg-white px-4 py-5 shadow-[0_4px_18px_rgba(9,30,66,0.045)] lg:px-6 lg:py-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <div className="flex flex-col justify-center border-[#E6E8EC] lg:w-[min(100%,220px)] lg:shrink-0 lg:border-e lg:pe-8">
              <p className="mb-3 text-[13px] font-semibold text-[#5B6B7C]">{t("googleReviews")}</p>
              <div className="flex items-center gap-2.5">
                <span className="text-[32px] leading-none font-extrabold tracking-tight text-[#091B3B] md:text-[36px]">
                  {ratingLabel}
                </span>
                <Stars size="h-4 w-4 md:h-[18px] md:w-[18px]" />
              </div>
              <p className="mt-2 text-[12px] leading-snug text-[#5B6B7C] md:text-[13px]">
                {tHajj("basedOnReviews", { count: stats.count })}
              </p>
            </div>

            <ReviewsSlider
              reviews={reviews}
              mapsUrl={mapsUrl}
              onOpen={openReview}
              isRtl={isRtl}
            />
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
