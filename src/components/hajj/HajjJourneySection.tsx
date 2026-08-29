"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import { HajjStepModal } from "@/components/hajj/HajjStepModal";
import type { HajjJourneyStep, HajjPageContent } from "@/data/hajj-content-defaults";
import { useTouchAxisScroll } from "@/hooks/useTouchAxisScroll";
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
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-white text-start shadow-[0_2px_12px_rgba(9,30,66,0.04)] transition hover:border-brand-orange/35 hover:shadow-[0_4px_18px_rgba(9,30,66,0.07)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cta",
        step.highlight
          ? "border-brand-orange/55 bg-brand-orange-soft/20 ring-2 ring-brand-orange/25 shadow-[0_4px_20px_rgba(232,154,60,0.14)]"
          : "border-line",
      )}
    >
      <div className="relative aspect-[5/4] bg-surface sm:aspect-[4/3]">
        <Image
          src={step.imageSrc}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 20vw"
          quality={IQ.card}
        />
        <span
          className={cn(
            "absolute start-3 top-3 flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-[12px] font-bold text-white shadow-sm",
            step.highlight ? "bg-brand-cta" : "bg-navy",
          )}
        >
          {step.num}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {step.dayLabel ? (
          <p className="text-[11px] font-bold tracking-[0.04em] text-brand-orange-ink sm:text-[12px]">
            {step.dayLabel}
          </p>
        ) : null}
        <h3
          className={cn(
            "text-[14px] font-bold leading-snug text-navy sm:text-[15px]",
            step.dayLabel ? "mt-1" : "",
          )}
        >
          {step.title}
        </h3>
        <p className="mt-2 flex-1 text-[12px] leading-[1.55] text-muted sm:text-[13px]">{step.short}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-cta sm:text-[13px]">
          {learnMore}
          <DirArrow />
        </span>
      </div>
    </button>
  );
}

export function HajjJourneySection({ content }: { content: HajjPageContent["journey"] }) {
  const t = useTranslations("hajj");
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const scrollRef = useRef<HTMLDivElement>(null);
  useTouchAxisScroll(scrollRef);
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
        </Container>

        {/* Mobile / tablet: stacked large image cards */}
        <Container className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:hidden">
          {content.steps.map((step, index) => (
            <JourneyCard
              key={step.id}
              step={step}
              learnMore={learnMore}
              onClick={() => setModalIndex(index)}
            />
          ))}
        </Container>

        {/* Desktop: two rows of large image cards with horizontal scroll */}
        <div
          ref={scrollRef}
          className="mt-10 hidden overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:block [&::-webkit-scrollbar]:hidden"
        >
          <div className="mx-auto grid w-max min-w-full grid-flow-col grid-rows-2 gap-5 px-8 [grid-auto-columns:minmax(280px,300px)] xl:px-10">
            {content.steps.map((step, index) => (
              <JourneyCard
                key={step.id}
                step={step}
                learnMore={learnMore}
                onClick={() => setModalIndex(index)}
              />
            ))}
          </div>
        </div>
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
