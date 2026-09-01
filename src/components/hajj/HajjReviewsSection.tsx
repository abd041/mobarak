"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { GoogleReview, GoogleReviewStats } from "@/lib/google-reviews.server";
import { GoogleG, GoogleWordmark } from "@/components/brand/GoogleLogos";
import { isRtl as isRtlLocale } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import { HajjReviewModal } from "@/components/hajj/HajjReviewModal";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = ["#8B5E3C", "#6B3A2A", "#1F8A4C", "#1A73E8", "#B86A10", "#C0392B"];
const AVATAR_STACK_SIZE = 5;

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
  size = "md",
}: {
  review: Pick<GoogleReview, "name" | "avatar">;
  colorIndex: number;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-8 w-8 text-[12px]" : "h-10 w-10 text-[14px]";

  if (review.avatar) {
    return (
      <Image
        src={review.avatar}
        alt=""
        width={size === "sm" ? 32 : 40}
        height={size === "sm" ? 32 : 40}
        className={cn(dim, "shrink-0 rounded-full object-cover ring-2 ring-white")}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-bold text-white ring-2 ring-white",
        dim,
      )}
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
      className="flex h-full min-h-[220px] flex-col rounded-[14px] border border-[#E8EAEE] bg-white p-5 shadow-[0_1px_2px_rgba(9,30,66,0.03)]"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={tCommon("openReview", { name: review.name })}
        className="flex flex-1 flex-col text-start"
      >
        <div className="flex items-center gap-3">
          <ReviewerAvatar review={review} colorIndex={index} />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-bold leading-tight text-[#1A1A1A]">
              {review.name}
            </p>
            {review.dateRelative ? (
              <p className="mt-0.5 text-[12px] leading-tight text-[#8A94A6]">{review.dateRelative}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-3">
          <Stars count={review.rating} size="h-3.5 w-3.5" />
        </div>

        <p
          dir="auto"
          className="mt-3 line-clamp-5 flex-1 text-[13px] leading-[1.55] text-[#3D4F5F] [unicode-bidi:plaintext]"
        >
          {review.text}
        </p>

        <div className="mt-4 flex justify-end">
          <GoogleG className="h-4 w-4 shrink-0 opacity-90" />
        </div>
      </button>
    </article>
  );
}

function formatOverflowLabel(count: number, locale: string): string | null {
  const overflow = Math.max(0, count - AVATAR_STACK_SIZE);
  if (overflow <= 0) return null;
  if (overflow >= 1000) {
    const value = overflow / 1000;
    return `+${value.toLocaleString(locale, { maximumFractionDigits: 1 })}K`;
  }
  return `+${overflow.toLocaleString(locale, { maximumFractionDigits: 0 })}`;
}

function AvatarStack({
  stackReviews,
  overflowLabel,
}: {
  stackReviews: GoogleReview[];
  overflowLabel: string | null;
}) {
  return (
    <div className="flex items-center">
      {stackReviews.slice(0, AVATAR_STACK_SIZE).map((review, index) => (
        <div
          key={review.id}
          className={cn("relative", index > 0 && "-ms-2.5")}
          style={{ zIndex: AVATAR_STACK_SIZE - index }}
        >
          <ReviewerAvatar review={review} colorIndex={index} size="sm" />
        </div>
      ))}
      {overflowLabel ? (
        <span
          className="-ms-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F1FB] text-[10px] font-bold text-[#1A73E8] ring-2 ring-white"
          style={{ zIndex: 0 }}
        >
          {overflowLabel}
        </span>
      ) : null}
    </div>
  );
}

function SummaryCard({
  ratingLabel,
  count,
  mapsUrl,
  stackReviews,
  locale,
}: {
  ratingLabel: string;
  count: number;
  mapsUrl: string;
  stackReviews: GoogleReview[];
  locale: string;
}) {
  const tCommon = useTranslations("common");
  const tHome = useTranslations("home");
  const tHajj = useTranslations("hajj");
  const overflowLabel = formatOverflowLabel(count, locale);

  return (
    <aside className="flex h-full min-h-[220px] flex-col rounded-[14px] border border-[#E8EAEE] bg-white p-5 shadow-[0_1px_2px_rgba(9,30,66,0.03)] lg:p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#B8860B] sm:text-[11px]">
        {tHome("reviewsTitle")}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <GoogleWordmark className="h-[22px] w-auto" />
        <span className="text-[18px] font-bold leading-none tracking-[-0.02em] text-[#1A1A1A]">
          {tHajj("reviewsBrandWord")}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2.5">
        <span className="text-[36px] font-extrabold leading-none tracking-tight text-[#1A1A1A]">
          {ratingLabel}
        </span>
        <Stars size="h-[18px] w-[18px]" />
      </div>

      <p className="mt-2 text-[13px] leading-snug text-[#6B7785]">
        {tHajj("basedOnReviews", { count })}
      </p>

      <div className="mt-5 flex items-center">
        <AvatarStack stackReviews={stackReviews} overflowLabel={overflowLabel} />
      </div>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[14px] font-bold text-[#1A73E8] transition hover:text-[#1557B0]"
      >
        <span>{tCommon("allReviews")}</span>
        <DirArrow />
      </a>
    </aside>
  );
}

/** Mobile-only unified Google reviews card — matches reference exactly. */
function MobileReviewsCard({
  reviews,
  stats,
  mapsUrl,
  ratingLabel,
  stackReviews,
  locale,
  isRtl,
  onOpen,
}: {
  reviews: GoogleReview[];
  stats: GoogleReviewStats;
  mapsUrl: string;
  ratingLabel: string;
  stackReviews: GoogleReview[];
  locale: string;
  isRtl: boolean;
  onOpen: (index: number) => void;
}) {
  const tCommon = useTranslations("common");
  const tHome = useTranslations("home");
  const tHajj = useTranslations("hajj");
  const [activeIndex, setActiveIndex] = useState(0);
  const overflowLabel = formatOverflowLabel(stats.count, locale);
  const total = reviews.length;
  const safeIndex = total > 0 ? activeIndex % total : 0;
  const activeReview = reviews[safeIndex];

  const go = (direction: 1 | -1) => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev + direction + total) % total);
  };

  if (!activeReview) return null;

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-t-[22px] rounded-b-[22px] bg-white px-5 pb-5 pt-6 shadow-[0_-12px_36px_rgba(11,44,74,0.14),0_12px_40px_rgba(9,30,66,0.1)] ring-1 ring-[#EEF0F3]">
        <p className="text-center text-[10px] font-bold tracking-[0.14em] text-[#E07A1A] uppercase">
          {tHome("reviewsTitle")}
        </p>

        <div className="mt-3 flex items-center justify-center gap-2">
          <GoogleWordmark className="h-[24px] w-auto" />
          <span className="text-[20px] font-bold leading-none tracking-[-0.02em] text-[#1A1A1A]">
            {tHajj("reviewsBrandWord")}
          </span>
        </div>

        <div className="mt-5 flex flex-col items-center">
          <div className="flex items-center gap-2.5">
            <span className="text-[40px] font-extrabold leading-none tracking-tight text-navy">
              {ratingLabel}
            </span>
            <Stars size="h-5 w-5" />
          </div>
          <p className="mt-2 text-[13px] leading-snug text-[#3D5A80]">
            {tHajj("basedOnReviews", {
              count: stats.count.toLocaleString(locale),
            })}
          </p>
        </div>

        <div className="mt-5 flex justify-center">
          <AvatarStack stackReviews={stackReviews} overflowLabel={overflowLabel} />
        </div>

        <article
          dir={isRtl ? "rtl" : "ltr"}
          className="relative mt-6 rounded-[14px] border border-[#E8EAEE] bg-white p-4"
        >
          <button
            type="button"
            onClick={() => onOpen(safeIndex)}
            aria-label={tCommon("openReview", { name: activeReview.name })}
            className="flex w-full flex-col text-start"
          >
            <div className="flex items-center gap-3">
              <ReviewerAvatar review={activeReview} colorIndex={safeIndex} />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-bold leading-tight text-[#1A1A1A]">
                  {activeReview.name}
                </p>
                {activeReview.dateRelative ? (
                  <p className="mt-0.5 text-[12px] leading-tight text-[#8A94A6]">
                    {activeReview.dateRelative}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-3">
              <Stars count={activeReview.rating} size="h-3.5 w-3.5" />
            </div>

            <p
              dir="auto"
              className="mt-3 line-clamp-5 text-[13px] leading-[1.55] text-[#3D4F5F] [unicode-bidi:plaintext]"
            >
              {activeReview.text}
            </p>

            <div className="mt-3 flex justify-end">
              <GoogleG className="h-4 w-4 shrink-0 opacity-90" />
            </div>
          </button>
        </article>

        {total > 1 ? (
          <div className="mt-5 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(isRtl ? 1 : -1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E0E3E8] bg-white text-[#1A1A1A] transition hover:bg-[#FAFBFC]"
              aria-label={tCommon("previousReview")}
            >
              <ChevronLeft className="h-5 w-5 rtl:rotate-180" aria-hidden />
            </button>

            <div className="flex items-center gap-1.5" role="tablist" aria-label={tCommon("reviewsCarousel")}>
              {reviews.map((review, index) => (
                <button
                  key={review.id}
                  type="button"
                  role="tab"
                  aria-selected={index === safeIndex}
                  aria-label={`${index + 1} / ${total}`}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "h-2 w-2 rounded-full transition",
                    index === safeIndex ? "bg-navy" : "bg-[#D5DAE0]",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(isRtl ? -1 : 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E0E3E8] bg-white text-[#1A1A1A] transition hover:bg-[#FAFBFC]"
              aria-label={tCommon("nextReview")}
            >
              <ChevronRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex justify-center">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[15px] font-bold text-navy transition hover:text-brand-cta"
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
  const tCommon = useTranslations("common");
  const tHome = useTranslations("home");
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const openReview = useCallback((index: number) => setModalIndex(index), []);
  const closeModal = useCallback(() => setModalIndex(null), []);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const ratingLabel = stats.rating.toLocaleString(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const stackReviews = useMemo(() => reviews.slice(0, AVATAR_STACK_SIZE), [reviews]);

  const updateNav = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const left = Math.abs(el.scrollLeft);
    setCanPrev(left > 4);
    setCanNext(left < max - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateNav();
    el.addEventListener("scroll", updateNav, { passive: true });
    window.addEventListener("resize", updateNav);
    return () => {
      el.removeEventListener("scroll", updateNav);
      window.removeEventListener("resize", updateNav);
    };
  }, [reviews.length, updateNav]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-review-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    const delta = direction * step * (isRtl ? -1 : 1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section
      id="hajj-reviews"
      className="relative z-20 bg-transparent pb-10 lg:bg-[#FAFBFC] lg:py-14"
      aria-labelledby="hajj-reviews-heading"
    >
      <h2 id="hajj-reviews-heading" className="sr-only">
        {tHome("reviewsTitle")}
      </h2>

      <Container>
        {/* Mobile: pull card up so it overlaps the hero photo */}
        <div className="relative z-20 -mt-20 px-1 sm:-mt-24 lg:hidden">
          <MobileReviewsCard
            reviews={reviews}
            stats={stats}
            mapsUrl={mapsUrl}
            ratingLabel={ratingLabel}
            stackReviews={stackReviews}
            locale={locale}
            isRtl={isRtl}
            onOpen={openReview}
          />
        </div>

        {/* Desktop: summary + sliding review cards + edge chevron */}
        <div className="relative hidden lg:block">
          <div className="grid grid-cols-[minmax(15.5rem,18.5rem)_minmax(0,1fr)] items-stretch gap-4 xl:grid-cols-[minmax(16.5rem,19.5rem)_minmax(0,1fr)] xl:gap-5">
            <SummaryCard
              ratingLabel={ratingLabel}
              count={stats.count}
              mapsUrl={mapsUrl}
              stackReviews={stackReviews}
              locale={locale}
            />

            <div className="relative min-w-0">
              <div
                ref={scrollerRef}
                dir={isRtl ? "rtl" : "ltr"}
                className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pe-2"
                role="region"
                aria-roledescription="carousel"
                aria-label={tCommon("reviewsCarousel")}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    scrollByCard(isRtl ? 1 : -1);
                  } else if (e.key === "ArrowRight") {
                    e.preventDefault();
                    scrollByCard(isRtl ? -1 : 1);
                  }
                }}
              >
                {reviews.map((review, index) => (
                  <div
                    key={review.id}
                    data-review-card
                    className="w-[calc((100%-2rem)/3)] min-w-[15.5rem] max-w-[19rem] shrink-0 snap-start"
                  >
                    <ReviewCard
                      review={review}
                      index={index}
                      isRtl={isRtl}
                      onOpen={() => openReview(index)}
                    />
                  </div>
                ))}
              </div>

              {canPrev ? (
                <button
                  type="button"
                  onClick={() => scrollByCard(-1)}
                  className="absolute start-0 top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E6E8EC] bg-white text-[#1A1A1A] shadow-[0_4px_14px_rgba(9,30,66,0.12)] transition hover:bg-[#FAFBFC] rtl:translate-x-1/2"
                  aria-label={tCommon("previousReview")}
                >
                  <ChevronLeft className="h-5 w-5 rtl:rotate-180" aria-hidden />
                </button>
              ) : null}

              {canNext ? (
                <button
                  type="button"
                  onClick={() => scrollByCard(1)}
                  className="absolute end-0 top-1/2 z-10 flex h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E6E8EC] bg-white text-[#1A1A1A] shadow-[0_4px_14px_rgba(9,30,66,0.12)] transition hover:bg-[#FAFBFC] rtl:-translate-x-1/2"
                  aria-label={tCommon("nextReview")}
                >
                  <ChevronRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
                </button>
              ) : null}
            </div>
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
