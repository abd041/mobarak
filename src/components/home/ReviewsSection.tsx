"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Star } from "lucide-react";
import type { GoogleReview } from "@/lib/google-reviews.server";
import { GoogleG, GoogleWordmark } from "@/components/brand/GoogleLogos";
import { HajjReviewModal } from "@/components/hajj/HajjReviewModal";
import { isRtl as isRtlLocale } from "@/i18n/routing";
import { googleStats } from "@/data/mock";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";

const AVATAR_COLORS = ["#1F8A4C", "#1A73E8", "#00897B", "#C0392B", "#B86A10"];

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

export function ReviewsSection({ reviews }: { reviews: GoogleReview[] }) {
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const shown = reviews.slice(0, 3);
  const close = useCallback(() => setModalIndex(null), []);

  return (
    <section className="bg-white pb-8 pt-2" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="sr-only">
        {t("googleReviews")}
      </h2>
      <Container className="lg:px-9">
        <div className="rounded-[16px] border border-[#E9EAEE] bg-white px-4 py-5 shadow-[0_4px_18px_rgba(9,30,66,0.045)] lg:px-0 lg:py-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[0.85fr_1.15fr_1.15fr_1.15fr_0.7fr] lg:gap-0">
            <div className="flex flex-col justify-center px-2 lg:min-h-36 lg:border-e lg:border-[#E6E8EC] lg:px-7 lg:py-6">
              <GoogleWordmark className="mb-2.5 h-5 w-auto" />
              <div className="flex items-center gap-2.5">
                <span className="text-[28px] leading-none font-extrabold tracking-tight text-[#091B3B]">
                  {googleStats.rating.toFixed(1).replace(".", ",")}
                </span>
                <Stars size="h-4 w-4" />
              </div>
              <p className="mt-2 text-[12px] leading-snug text-[#5B6B7C]">
                {t("basedOn", { count: googleStats.count })}
              </p>
            </div>

            {shown.map((r, index) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setModalIndex(index)}
                aria-label={tCommon("openReview", { name: r.name })}
                dir={isRtl ? "rtl" : "ltr"}
                className={`flex flex-col px-2 text-start transition hover:bg-[#fafbfc] focus-visible:bg-[#fafbfc] lg:min-h-36 lg:border-e lg:border-[#E6E8EC] lg:px-6 lg:py-6 ${
                  index === shown.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                      style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
                      aria-hidden
                    >
                      {r.name.charAt(0)}
                    </span>
                    <p className="truncate text-[14px] font-bold text-[#091B3B]">{r.name}</p>
                  </div>
                  <GoogleG className="mt-0.5 h-4 w-4 shrink-0" />
                </div>

                <div className="mb-2.5 flex flex-wrap items-center gap-2">
                  <Stars count={r.rating} />
                  <span className="text-[12px] text-[#5B6B7C]">{r.dateRelative}</span>
                </div>

                <p
                  dir="auto"
                  className="line-clamp-3 text-[13px] leading-[1.65] text-[#3D4F5F] [unicode-bidi:plaintext]"
                >
                  {r.text}
                </p>
              </button>
            ))}

            <div className="flex items-center justify-center px-2 sm:col-span-2 lg:col-span-1 lg:px-5 lg:py-6">
              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex max-w-[11rem] items-center gap-2 rounded-sm text-[14px] leading-snug font-bold text-[#091B3B] transition hover:text-brand-orange-ink"
              >
                <span>{t("allReviewsGoogle")}</span>
                <DirArrow />
              </a>
            </div>
          </div>
        </div>
      </Container>

      {modalIndex !== null ? (
        <HajjReviewModal
          reviews={reviews}
          index={modalIndex}
          onClose={close}
          onIndexChange={setModalIndex}
          isRtl={isRtl}
        />
      ) : null}
    </section>
  );
}
