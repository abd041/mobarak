"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import { HajjStepModal } from "@/components/hajj/HajjStepModal";
import type { HajjPageContent } from "@/data/hajj-content-defaults";
import { isRtl as isRtlLocale } from "@/i18n/routing";

export function HajjProcessSection({ content }: { content: HajjPageContent["process"] }) {
  const t = useTranslations("hajj");
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

          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-5 md:gap-5">
            {content.steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setModalIndex(index)}
                className="flex h-full flex-col items-center rounded-2xl border border-line bg-white px-3 py-5 text-center shadow-[0_2px_12px_rgba(9,30,66,0.04)] transition hover:border-brand-orange/35 hover:shadow-[0_4px_18px_rgba(9,30,66,0.07)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cta sm:px-4 sm:py-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-[13px] font-bold text-white">
                  {step.num}
                </span>
                <h3 className="mt-4 text-[13px] font-bold leading-snug text-navy sm:text-[14px]">
                  {step.title}
                </h3>
                <p className="mt-2 flex-1 text-[11px] leading-[1.55] text-muted sm:text-[12px]">
                  {step.short}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-cta sm:text-[12px]">
                  {t("learnMore")}
                  <DirArrow />
                </span>
              </button>
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
