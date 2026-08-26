"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Star, X } from "lucide-react";
import type { Review } from "@/data/mock";
import { googleStats } from "@/data/mock";

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const [active, setActive] = useState<Review | null>(null);

  return (
    <section className="bg-surface py-14">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold text-brand-orange">{t("googleReviews")}</p>
            <h2 className="text-2xl font-bold text-navy md:text-3xl">{t("reviewsTitle")}</h2>
            <p className="mt-1 text-muted">{t("reviewsSubtitle")}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-navy">{googleStats.rating.toFixed(1).replace(".", ",")}</span>
            <div>
              <div className="flex text-brand-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-brand-gold" />
                ))}
              </div>
              <p className="text-sm text-muted">
                {t("basedOn", { count: googleStats.count })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setActive(r)}
              className="rounded-2xl border border-line bg-white p-5 text-start shadow-[var(--shadow-card)] transition hover:border-brand-orange/40"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange-soft font-bold text-brand-orange">
                  {r.name.charAt(0)}
                </span>
                <div>
                  <p className="font-semibold text-navy">{r.name}</p>
                  <p className="text-xs text-muted">{r.dateRelative}</p>
                </div>
              </div>
              <div className="mb-2 flex text-brand-gold">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-brand-gold" />
                ))}
              </div>
              <p className="line-clamp-4 text-sm leading-relaxed text-navy/80">{r.text}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 text-center md:text-end">
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-brand-cta hover:underline"
          >
            {tCommon("allReviews")} →
          </a>
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="absolute end-4 top-4 rounded-full p-1 hover:bg-surface"
              onClick={() => setActive(null)}
              aria-label={tCommon("close")}
            >
              <X className="h-5 w-5" />
            </button>
            <p className="mb-4 text-sm font-semibold text-brand-orange">{t("googleReviews")}</p>
            <p className="text-lg font-bold text-navy">{active.name}</p>
            <p className="mb-2 text-xs text-muted">{active.dateRelative}</p>
            <div className="mb-4 flex text-brand-gold">
              {Array.from({ length: active.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-brand-gold" />
              ))}
            </div>
            <p className="leading-relaxed text-navy/90">{active.text}</p>
            {active.translated && (
              <p className="mt-3 text-xs text-muted">{tCommon("translatedReview")}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
