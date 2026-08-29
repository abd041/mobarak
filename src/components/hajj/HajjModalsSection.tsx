"use client";

import { useCallback, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { DirArrow, DirBackArrow } from "@/components/ui/DirArrow";
import { useDialogA11y } from "@/lib/use-dialog-a11y";
import type { hajjJourney, hajjProcess } from "@/data/hajj";

type ProcessItem = (typeof hajjProcess)[number];
type JourneyItem = (typeof hajjJourney)[number];

export function HajjModalsSection({
  processTitle,
  journeyEyebrow,
  journeyTitle,
  learnMore,
  process,
  journey,
}: {
  processTitle: string;
  journeyEyebrow: string;
  journeyTitle: string;
  learnMore: string;
  process: ProcessItem[];
  journey: JourneyItem[];
}) {
  const tCommon = useTranslations("common");
  const titleId = useId();
  const descId = useId();
  const [active, setActive] = useState<
    | { kind: "process"; item: ProcessItem; index: number }
    | { kind: "journey"; item: JourneyItem; index: number }
    | null
  >(null);

  const close = useCallback(() => setActive(null), []);
  const dialogRef = useDialogA11y(Boolean(active), close);

  const goPrev = () => {
    if (!active || active.index === 0) return;
    if (active.kind === "process") {
      const next = process[active.index - 1];
      if (next) setActive({ kind: "process", item: next, index: active.index - 1 });
    } else {
      const next = journey[active.index - 1];
      if (next) setActive({ kind: "journey", item: next, index: active.index - 1 });
    }
  };

  const goNext = () => {
    if (!active) return;
    if (active.kind === "process") {
      if (active.index >= process.length - 1) return;
      const next = process[active.index + 1];
      if (next) setActive({ kind: "process", item: next, index: active.index + 1 });
    } else {
      if (active.index >= journey.length - 1) return;
      const next = journey[active.index + 1];
      if (next) setActive({ kind: "journey", item: next, index: active.index + 1 });
    }
  };

  return (
    <>
      <section id="ablauf" className="py-14">
        <Container>
          <h2 className="mb-6 text-2xl font-bold text-navy md:text-3xl">{processTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {process.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive({ kind: "process", item, index })}
                className="rounded-2xl border border-line bg-white p-4 text-start shadow-sm transition hover:border-brand-orange/40"
              >
                <span className="text-sm font-bold text-brand-orange-ink">{item.num}</span>
                <h3 className="mt-1 font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-xs text-muted">{item.short}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-cta">
                  {learnMore} <DirArrow />
                </span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      <section id="betreuung" className="bg-surface py-14">
        <Container>
          <p className="mb-2 text-sm font-bold tracking-wide text-brand-orange-ink">
            {journeyEyebrow}
          </p>
          <h2 className="mb-6 text-2xl font-bold text-navy md:text-3xl">{journeyTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {journey.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive({ kind: "journey", item, index })}
                className={`rounded-2xl border bg-white p-4 text-start shadow-sm transition hover:border-brand-orange/40 ${
                  item.highlight ? "border-brand-orange ring-1 ring-brand-orange/30" : "border-line"
                }`}
              >
                <span className="text-sm font-bold text-brand-orange-ink">{item.num}</span>
                <h3 className="mt-1 font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-xs text-muted">{item.short}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-cta">
                  {learnMore} <DirArrow />
                </span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 md:items-center md:p-4"
          onClick={close}
        >
          <div
            ref={dialogRef}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-t-2xl bg-white p-6 shadow-xl md:rounded-2xl"
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
              className="absolute end-4 top-4 rounded-full p-2 hover:bg-surface"
              onClick={close}
              aria-label={tCommon("close")}
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            <p className="text-sm font-bold text-brand-orange-ink">{active.item.num}</p>
            <h3 id={titleId} className="mt-1 text-2xl font-bold text-navy">
              {active.item.title}
            </h3>
            <p id={descId} className="mt-4 leading-relaxed text-navy/85">
              {active.item.full}
            </p>
            {"checks" in active.item && active.item.checks && (
              <ul className="mt-4 space-y-2">
                {active.item.checks.map((c) => (
                  <li key={c} className="text-sm text-navy">
                    ✓ {c}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 flex justify-between gap-3">
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-line px-4 py-2 text-sm disabled:opacity-40"
                disabled={active.index === 0}
                onClick={goPrev}
                aria-label={tCommon("previous")}
              >
                <DirBackArrow />
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-line px-4 py-2 text-sm disabled:opacity-40"
                disabled={
                  active.kind === "process"
                    ? active.index >= process.length - 1
                    : active.index >= journey.length - 1
                }
                onClick={goNext}
                aria-label={tCommon("next")}
              >
                <DirArrow />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
