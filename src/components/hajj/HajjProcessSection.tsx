"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import { HajjStepModal } from "@/components/hajj/HajjStepModal";
import type { HajjPageContent } from "@/data/hajj-content-defaults";
import { isRtl as isRtlLocale } from "@/i18n/routing";

type ProcessStep = HajjPageContent["process"]["steps"][number];

function ProcessStepCard({ step, onClick }: { step: ProcessStep; onClick: () => void }) {
  const t = useTranslations("hajj");

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-full w-full flex-col items-start gap-2.5 rounded-2xl border border-[#E8EAEE] bg-white px-3 py-3.5 text-start shadow-[0_2px_12px_rgba(9,30,66,0.04)] transition hover:border-brand-orange/35 hover:shadow-[0_4px_18px_rgba(9,30,66,0.07)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cta sm:flex-row sm:gap-3 sm:px-4 sm:py-4 md:gap-3.5 md:px-4 md:py-5"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-bold tabular-nums text-white sm:mt-0.5 sm:h-9 sm:w-9 sm:text-[12px] md:h-10 md:w-10 md:text-[13px]">
        {step.num}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="text-[13px] font-bold leading-snug text-navy sm:text-[15px] md:text-[16px]">
          {step.title}
        </h3>
        <p className="mt-1 text-[11px] leading-[1.5] text-muted sm:mt-1.5 sm:text-[12px] sm:leading-[1.55] md:text-[13px] md:leading-[1.6]">
          {step.short}
        </p>
        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-cta sm:mt-3 sm:text-[12px]">
          {t("learnMore")}
          <DirArrow />
        </span>
      </div>
    </button>
  );
}

export function HajjProcessSection({ content }: { content: HajjPageContent["process"] }) {
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const closeModal = useCallback(() => setModalIndex(null), []);

  return (
    <>
      <section id="ablauf" className="border-t border-line bg-[#FAFBFC] py-14 md:py-16 lg:py-20">
        <Container>
          <h2 className="text-center text-[26px] font-bold tracking-[-0.02em] text-navy md:text-[32px]">
            {content.title}
          </h2>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5 lg:grid-rows-2 lg:gap-5">
            {content.steps.map((step, index) => (
              <ProcessStepCard
                key={step.id}
                step={step}
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
