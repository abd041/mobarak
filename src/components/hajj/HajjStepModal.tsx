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
  const categoryLabel = step.dayLabel ?? step.num;
  const bodyParagraphs = step.full.split(/\n\n+/).filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        dir={isRtl ? "rtl" : "ltr"}
        className={cn(
          "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white text-start shadow-xl sm:max-h-[90vh] sm:rounded-2xl",
          hasImage ? "max-w-4xl" : "max-w-2xl",
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
          className={cn(
            "absolute end-3 top-3 z-20 rounded-full p-2 transition",
            hasImage
              ? "bg-white/95 text-navy shadow-md hover:bg-white"
              : "text-navy hover:bg-surface",
          )}
          onClick={onClose}
          aria-label={tCommon("close")}
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className={cn("flex min-h-0 flex-1 flex-col", hasImage && "md:flex-row")}>
          {hasImage ? (
            <div className="relative aspect-[16/10] w-full shrink-0 bg-surface md:aspect-auto md:min-h-[320px] md:w-[44%] lg:min-h-[400px]">
              <Image
                src={step.imageSrc!}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 44vw"
                quality={IQ.content}
                priority
              />
            </div>
          ) : null}

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto p-6 pe-12 md:p-8 md:pe-14">
              <p className="text-[11px] font-bold tracking-[0.12em] text-brand-orange-ink uppercase">
                {categoryLabel}
              </p>
              <h3
                id={titleId}
                className="mt-2 text-[22px] font-bold leading-snug text-navy md:text-[26px]"
              >
                {modalHeading}
              </h3>
              <div id={descId} className="mt-4 space-y-4 text-[15px] leading-[1.7] text-navy/90">
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
              <div className="flex shrink-0 items-center justify-between gap-4 border-t border-line px-5 py-4 md:px-8">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={index === 0}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy transition hover:text-brand-orange-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <DirBackArrow />
                  {tHajj("modalPrevStep")}
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={index >= steps.length - 1}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy transition hover:text-brand-orange-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {tHajj("modalNextStep")}
                  <DirArrow />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
