"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Star, X } from "lucide-react";
import type { GoogleReview } from "@/lib/google-reviews.server";
import { useDialogA11y } from "@/lib/use-dialog-a11y";

const AVATAR_COLORS = ["#1F8A4C", "#1A73E8", "#00897B", "#C0392B", "#B86A10"];
const SWIPE_THRESHOLD = 48;

function Stars({ count = 5, size = "h-4 w-4" }: { count?: number; size?: string }) {
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
  size = "sm",
}: {
  review: GoogleReview;
  colorIndex: number;
  size?: "sm" | "lg";
}) {
  const dim = size === "lg" ? 48 : 32;
  const className =
    size === "lg"
      ? "h-12 w-12 shrink-0 rounded-full object-cover"
      : "h-8 w-8 shrink-0 rounded-full object-cover";

  if (review.avatar) {
    return <Image src={review.avatar} alt="" width={dim} height={dim} className={className} />;
  }

  const textSize = size === "lg" ? "text-[15px]" : "text-[13px]";
  const boxSize = size === "lg" ? "h-12 w-12" : "h-8 w-8";

  return (
    <span
      className={`flex ${boxSize} shrink-0 items-center justify-center rounded-full font-bold text-white ${textSize}`}
      style={{ backgroundColor: AVATAR_COLORS[colorIndex % AVATAR_COLORS.length] }}
      aria-hidden
    >
      {review.name.charAt(0)}
    </span>
  );
}

export function HajjReviewModal({
  reviews,
  index,
  onClose,
  onIndexChange,
  isRtl = false,
}: {
  reviews: GoogleReview[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  isRtl?: boolean;
}) {
  const tHajj = useTranslations("hajj");
  const tCommon = useTranslations("common");
  const dialogRef = useDialogA11y(true, onClose);
  const touchStart = useRef({ x: 0, y: 0 });
  const [showOriginal, setShowOriginal] = useState(false);

  const review = reviews[index];
  const hasMultiple = reviews.length > 1;
  const canToggleLanguage = review?.translated ?? false;
  const bodyText =
    review && showOriginal && canToggleLanguage ? review.originalText : review?.text;
  const bodyDir =
    showOriginal && canToggleLanguage ? "ltr" : isRtl ? "rtl" : "ltr";

  useEffect(() => {
    setShowOriginal(false);
  }, [index]);

  const goTo = useCallback(
    (next: number) => {
      if (reviews.length === 0) return;
      const clamped = ((next % reviews.length) + reviews.length) % reviews.length;
      onIndexChange(clamped);
    },
    [onIndexChange, reviews.length],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!hasMultiple) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (isRtl) goNext();
        else goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (isRtl) goPrev();
        else goNext();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, hasMultiple, isRtl]);

  if (!review) return null;

  const titleId = `hajj-review-title-${review.id}`;
  const descId = `hajj-review-body-${review.id}`;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        dir={isRtl ? "rtl" : "ltr"}
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white text-start shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchStart.current = {
            x: e.touches[0]?.clientX ?? 0,
            y: e.touches[0]?.clientY ?? 0,
          };
        }}
        onTouchEnd={(e) => {
          if (!hasMultiple) return;
          const touch = e.changedTouches[0];
          if (!touch) return;
          const dx = touch.clientX - touchStart.current.x;
          const dy = touch.clientY - touchStart.current.y;
          if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
          if (isRtl) {
            if (dx > 0) goNext();
            else goPrev();
          } else {
            if (dx > 0) goPrev();
            else goNext();
          }
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
      >
        <button
          type="button"
          data-dialog-close
          className="absolute end-3 top-3 z-10 rounded-full p-2 text-navy transition hover:bg-surface"
          onClick={onClose}
          aria-label={tCommon("close")}
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="overflow-y-auto p-6 ps-6 pe-12">
          <p className="mb-4 text-sm font-semibold text-brand-orange-ink">
            {tHajj("googleReviewLabel")}
          </p>

          <div className="mb-3 flex items-center gap-3">
            <ReviewerAvatar review={review} colorIndex={index} size="lg" />
            <p id={titleId} className="min-w-0 flex-1 text-lg font-bold text-navy">
              {review.name}
            </p>
          </div>

          {review.dateRelative ? (
            <p className="mb-2 text-sm text-muted">{review.dateRelative}</p>
          ) : null}

          <div className="mb-4 flex justify-start">
            <Stars count={review.rating} />
          </div>

          <p
            id={descId}
            dir={bodyDir}
            className="leading-[1.75] text-navy/90 [unicode-bidi:plaintext]"
          >
            {bodyText}
          </p>

          {canToggleLanguage ? (
            <button
              type="button"
              onClick={() => setShowOriginal((value) => !value)}
              className="mt-3 text-xs font-medium text-brand-cta underline-offset-2 hover:underline"
            >
              {showOriginal ? tHajj("showTranslation") : tHajj("showOriginal")}
            </button>
          ) : null}
        </div>

        {hasMultiple ? (
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#E9EAEE] px-4 py-3">
            <button
              type="button"
              onClick={goPrev}
              className="text-[13px] font-semibold text-navy transition hover:text-brand-orange-ink"
            >
              {isRtl ? `→ ${tHajj("modalPrevReview")}` : `← ${tHajj("modalPrevReview")}`}
            </button>
            <span className="text-[#D0D4DA]" aria-hidden>
              |
            </span>
            <button
              type="button"
              onClick={goNext}
              className="text-[13px] font-semibold text-navy transition hover:text-brand-orange-ink"
            >
              {isRtl ? `${tHajj("modalNextReview")} ←` : `${tHajj("modalNextReview")} →`}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
