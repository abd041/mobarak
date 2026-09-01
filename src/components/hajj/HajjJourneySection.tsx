"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import { HajjStepModal } from "@/components/hajj/HajjStepModal";
import type { HajjJourneyStep, HajjPageContent } from "@/data/hajj-content-defaults";
import { isRtl as isRtlLocale } from "@/i18n/routing";
import { IQ } from "@/lib/images";
import { cn } from "@/lib/utils";

function JourneyCard({
  step,
  learnMore,
  onClick,
}: {
  step: HajjJourneyStep;
  learnMore: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${step.title}: ${learnMore}`}
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-xl border bg-white text-start shadow-[0_2px_12px_rgba(9,30,66,0.04)] transition hover:border-brand-orange/35 hover:shadow-[0_4px_18px_rgba(9,30,66,0.07)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cta active:scale-[0.995] sm:rounded-2xl",
        step.highlight
          ? "border-brand-orange/55 bg-brand-orange-soft/20 ring-2 ring-brand-orange/25 shadow-[0_4px_20px_rgba(232,154,60,0.14)]"
          : "border-line",
      )}
    >
      <div className="relative aspect-[4/3] w-full bg-surface sm:aspect-[5/4]">
        <Image
          src={step.imageSrc}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 1023px) 33vw, (max-width: 1280px) 16vw, 200px"
          quality={IQ.card}
        />
        <span
          className={cn(
            "absolute start-1.5 top-1.5 flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-[10px] font-bold text-white shadow-sm sm:start-3 sm:top-3 sm:h-8 sm:min-w-8 sm:px-2 sm:text-[12px]",
            step.highlight ? "bg-brand-cta" : "bg-navy",
          )}
        >
          {step.num}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-4 md:p-5">
        {step.dayLabel ? (
          <p className="text-[9px] font-bold tracking-[0.04em] text-brand-orange-ink sm:text-[11px] md:text-[12px]">
            {step.dayLabel}
          </p>
        ) : null}
        <h3
          className={cn(
            "text-[11px] font-bold leading-snug text-navy sm:text-[14px] md:text-[15px]",
            step.dayLabel ? "mt-0.5 sm:mt-1" : "",
          )}
        >
          {step.title}
        </h3>

        <p className="mt-1 flex-1 text-[10px] leading-[1.45] text-muted sm:mt-2 sm:text-[12px] sm:leading-[1.55] md:text-[13px]">
          {step.short}
        </p>

        <span className="mt-2 inline-flex items-center gap-0.5 text-[10px] font-semibold text-brand-cta sm:mt-4 sm:gap-1 sm:text-[12px] md:text-[13px]">
          {learnMore}
          <DirArrow className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </span>
      </div>
    </button>
  );
}

export function HajjJourneySection({ content }: { content: HajjPageContent["journey"] }) {
  const t = useTranslations("hajj");
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const closeModal = useCallback(() => setModalIndex(null), []);
  const learnMore = t("learnMore");

  return (
    <>
      <section id="betreuung" className="bg-white py-14 md:py-16 lg:py-20">
        <Container>
          <p className="mb-2 text-center text-[12px] font-bold tracking-[0.14em] text-brand-orange-ink">
            {content.eyebrow}
          </p>
          <h2 className="text-center text-[26px] font-bold tracking-[-0.02em] text-navy md:text-[32px]">
            {content.title}
          </h2>
          {content.logisticsNote ? (
            <p className="mx-auto mt-4 max-w-2xl px-4 text-center text-[14px] leading-relaxed text-muted md:text-[15px]">
              {content.logisticsNote}
            </p>
          ) : null}

          {/* Mobile: 3 per row · Desktop: 6 per row */}
          <div className="mt-10 grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6 lg:gap-4 xl:gap-5">
            {content.steps.map((step, index) => (
              <JourneyCard
                key={step.id}
                step={step}
                learnMore={learnMore}
                onClick={() => setModalIndex(index)}
              />
            ))}
          </div>
        </Container>
      </section>

      {modalIndex !== null ? (
        <HajjStepModal
          steps={content.steps}
          index={modalIndex}
          onClose={closeModal}
          onIndexChange={setModalIndex}
          isRtl={isRtl}
        />
      ) : null}
    </>
  );
}
