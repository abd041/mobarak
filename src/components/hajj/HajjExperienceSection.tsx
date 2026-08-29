"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { HajjPageContent } from "@/data/hajj-content-defaults";
import { useTouchAxisScroll } from "@/hooks/useTouchAxisScroll";
import { isRtl as isRtlLocale } from "@/i18n/routing";
import { IQ } from "@/lib/images";

function ExperienceCarousel({ slides }: { slides: HajjPageContent["experience"]["slides"] }) {
  const locale = useLocale();
  const tCommon = useTranslations("common");
  const isRtl = isRtlLocale(locale);
  const scrollerRef = useRef<HTMLDivElement>(null);
  useTouchAxisScroll(scrollerRef);
  const [active, setActive] = useState(0);

  const ordered = isRtl ? [...slides].reverse() : slides;

  const syncActiveFromScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = [...el.querySelectorAll<HTMLElement>("[data-exp-slide]")];
    if (!cards.length) return;
    const left = el.scrollLeft;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - left);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    syncActiveFromScroll();
    el.addEventListener("scroll", syncActiveFromScroll, { passive: true });
    window.addEventListener("resize", syncActiveFromScroll);
    return () => {
      el.removeEventListener("scroll", syncActiveFromScroll);
      window.removeEventListener("resize", syncActiveFromScroll);
    };
  }, [isRtl, ordered.length, syncActiveFromScroll]);

  const goTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el || ordered.length === 0) return;
    const clamped = ((index % ordered.length) + ordered.length) % ordered.length;
    const card = el.querySelectorAll<HTMLElement>("[data-exp-slide]")[clamped];
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    setActive(clamped);
  };

  const goPrev = () => goTo(active - 1);
  const goNext = () => goTo(active + 1);

  if (ordered.length === 0) return null;

  return (
    <div
      className="relative min-w-0"
      role="region"
      aria-roledescription="carousel"
      aria-label={tCommon("experienceCarousel")}
    >
      {ordered.length > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute start-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-navy-deep/80 text-white shadow-lg backdrop-blur-sm transition hover:bg-navy-deep lg:h-10 lg:w-10"
            aria-label={tCommon("previous")}
          >
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" aria-hidden />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute end-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-navy-deep/80 text-white shadow-lg backdrop-blur-sm transition hover:bg-navy-deep lg:h-10 lg:w-10"
            aria-label={tCommon("next")}
          >
            <ChevronRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
          </button>
        </>
      ) : null}

      <div
        ref={scrollerRef}
        dir={isRtl ? "rtl" : "ltr"}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-1 py-1"
        tabIndex={0}
        aria-live="polite"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            if (isRtl) goNext();
            else goPrev();
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            if (isRtl) goPrev();
            else goNext();
          }
        }}
      >
        {ordered.map((slide) => (
          <figure
            key={slide.id}
            data-exp-slide
            className="w-[min(100%,340px)] shrink-0 snap-center sm:w-[min(85%,380px)] lg:w-full"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-navy-deep shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
              <Image
                src={slide.imageSrc}
                alt={slide.label}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 85vw, 480px"
                quality={IQ.content}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/55 to-transparent px-4 pb-4 pt-12">
                <figcaption className="text-[14px] font-bold tracking-[0.06em] text-white uppercase sm:text-[15px]">
                  {slide.label}
                </figcaption>
              </div>
            </div>
          </figure>
        ))}
      </div>

      {ordered.length > 1 ? (
        <div className="mt-4 flex justify-center gap-2">
          {ordered.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(index)}
              className={`h-2 rounded-full transition ${
                index === active ? "w-6 bg-brand-gold" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`${slide.label} (${index + 1}/${ordered.length})`}
              aria-current={index === active ? "true" : undefined}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function HajjExperienceSection({ content }: { content: HajjPageContent["experience"] }) {
  return (
    <section id="erfahrung" className="bg-navy py-14 text-white md:py-16 lg:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14">
          <div className="text-center lg:text-start">
            <p
              className="text-[72px] font-bold leading-[0.9] tracking-[-0.03em] text-brand-gold sm:text-[88px] lg:text-[104px]"
              aria-hidden
            >
              {content.stat}
            </p>
            <h2 className="mt-4 text-[16px] font-bold tracking-[0.14em] text-white sm:text-[18px] lg:mt-5 lg:text-[20px]">
              {content.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-[1.7] text-white/82 sm:text-[16px] lg:mx-0 lg:max-w-none">
              {content.body}
            </p>
          </div>

          <ExperienceCarousel slides={content.slides} />
        </div>
      </Container>
    </section>
  );
}
