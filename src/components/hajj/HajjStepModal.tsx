"use client";

import Image from "next/image";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, X } from "lucide-react";
import { DirArrow, DirBackArrow } from "@/components/ui/DirArrow";
import { useDialogA11y } from "@/lib/use-dialog-a11y";
import { IQ } from "@/lib/images";
import { cn } from "@/lib/utils";

export type HajjStepModalItem = {
  id: string;
  num: string;
  title: string;
  modalTitle?: string;
  dayLabel?: string;
  imageSrc?: string;
  full: string;
  modalNote?: string;
  checks?: string[];
};

export function HajjStepModal({
  steps,
  index,
  onClose,
  onIndexChange,
  isRtl = false,
}: {
  steps: HajjStepModalItem[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  isRtl?: boolean;
}) {
  const tHajj = useTranslations("hajj");
  const tCommon = useTranslations("common");
  const dialogRef = useDialogA11y(true, onClose);

  const step = steps[index];
  const hasMultiple = steps.length > 1;
  const hasImage = Boolean(step?.imageSrc);

  const goPrev = useCallback(() => {
    if (index > 0) onIndexChange(index - 1);
  }, [index, onIndexChange]);

  const goNext = useCallback(() => {
    if (index < steps.length - 1) onIndexChange(index + 1);
  }, [index, onIndexChange, steps.length]);

  if (!step) return null;

  const titleId = `hajj-step-title-${step.id}`;
  const descId = `hajj-step-body-${step.id}`;
  const modalHeading = step.modalTitle ?? step.title;
  const eyebrowLabel = step.dayLabel ?? step.num;
  const mobileHeading = step.dayLabel ? step.title : modalHeading;
  const bodyParagraphs = step.full.split(/\n\n+/).filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-black/50 lg:items-center lg:p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        dir={isRtl ? "rtl" : "ltr"}
        className={cn(
          "relative flex w-full flex-col overflow-hidden bg-white text-start shadow-xl",
          "h-[92dvh] max-h-[92dvh] rounded-t-2xl",
          "lg:h-auto lg:max-h-[90vh] lg:rounded-2xl",
          hasImage ? "lg:max-w-4xl" : "lg:max-w-2xl",
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
      >
        <button
          type="button"
          data-dialog-close
          className="absolute end-3 top-3 z-20 rounded-full bg-white/95 p-2 text-navy shadow-md transition hover:bg-white"
          onClick={onClose}
          aria-label={tCommon("close")}
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {hasImage ? (
            <div className="relative aspect-[16/10] w-full shrink-0 bg-surface sm:aspect-[5/3] lg:aspect-auto lg:min-h-[400px] lg:w-[44%]">
              <Image
                src={step.imageSrc!}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 44vw"
                quality={IQ.content}
                priority
              />
            </div>
          ) : null}

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div
              className={cn(
                "flex-1 overflow-y-auto overscroll-contain px-5 pb-5",
                hasImage ? "pt-5" : "pt-14",
                "lg:p-8 lg:pe-14",
              )}
            >
              <p className="text-[12px] font-bold tracking-[0.08em] text-brand-orange-ink uppercase lg:text-[11px] lg:tracking-[0.12em]">
                {eyebrowLabel}
              </p>
              <h3
                id={titleId}
                className="mt-2 text-[22px] font-bold leading-snug text-navy lg:text-[26px]"
              >
                <span className="lg:hidden">{mobileHeading}</span>
                <span className="hidden lg:inline">{modalHeading}</span>
              </h3>

              <div
                id={descId}
                className="mt-4 space-y-4 text-[15px] leading-[1.7] text-navy/90 lg:mt-4"
              >
                {bodyParagraphs.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
              </div>

              {step.checks?.length ? (
                <ul className="mt-5 space-y-2.5">
                  {step.checks.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[14px] text-navy/90">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {step.modalNote ? (
                <p className="mt-5 rounded-xl border border-line bg-surface px-4 py-3 text-[13px] leading-relaxed text-muted">
                  <span className="font-semibold text-navy">{tHajj("modalImportant")}: </span>
                  {step.modalNote}
                </p>
              ) : null}
            </div>

            {hasMultiple ? (
              <div className="safe-bottom shrink-0 border-t border-line bg-white px-4 py-3 lg:px-8 lg:py-4">
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={index === 0}
                    className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-navy transition hover:text-brand-orange-ink disabled:cursor-not-allowed disabled:opacity-40 lg:text-[13px]"
                  >
                    <DirBackArrow />
                    <span className="lg:hidden">{tCommon("previous")}</span>
                    <span className="hidden lg:inline">{tHajj("modalPrevStep")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={index >= steps.length - 1}
                    className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-navy transition hover:text-brand-orange-ink disabled:cursor-not-allowed disabled:opacity-40 lg:text-[13px]"
                  >
                    <span className="lg:hidden">{tCommon("next")}</span>
                    <span className="hidden lg:inline">{tHajj("modalNextStep")}</span>
                    <DirArrow />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
