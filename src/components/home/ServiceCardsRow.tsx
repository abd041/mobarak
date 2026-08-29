"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DirArrow } from "@/components/ui/DirArrow";

export type ServiceCardData = {
  key: string;
  href: string;
  icon: string;
  cta: string;
  ctaColor: string;
  iconColor: string;
  bg: string;
  title: string;
  body: string;
  price?: string;
};

export function ServiceCardsRow({ cards }: { cards: ServiceCardData[] }) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const ordered = isRtl ? [...cards].reverse() : cards;

  return (
    <div className="-mx-4 overflow-x-auto overscroll-x-contain px-4 pb-1 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
      <div
        dir="ltr"
        className="flex snap-x snap-mandatory gap-3 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-4.5"
      >
        {ordered.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className={`group relative flex min-h-64 w-[min(86%,320px)] shrink-0 snap-start flex-col overflow-hidden rounded-[20px] ${card.bg} px-5 pt-5 pb-6 shadow-[0_7px_24px_rgba(9,30,66,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(9,30,66,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cta sm:w-auto sm:min-h-70 sm:shrink sm:px-6 sm:pt-6 sm:pb-7 lg:min-h-74 lg:px-7 lg:pt-7 lg:pb-8`}
          >
            <MosqueWatermark
              className={`absolute -bottom-5 -inset-s-2 h-32 w-24 ${card.iconColor} opacity-[0.055]`}
            />

            <div className="relative z-10 flex items-start gap-3.5 lg:gap-4">
              <Image
                  src={card.icon}
                  alt=""
                  width={56}
                  height={56}
                  className="h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12 lg:h-14 lg:w-14"
                  quality={80}
                  sizes="56px"
                />

              <div className="min-w-0 pt-1">
                <h3 className="text-[17px] leading-[1.2] font-bold text-[#091B3B] sm:text-[18px] lg:text-[22px] lg:leading-[1.25] lg:font-extrabold lg:tracking-[-0.02em]">
                  {card.title}
                </h3>
                {card.price && (
                  <p className="mt-1 text-[14px] font-semibold text-[#D88715]">{card.price}</p>
                )}
              </div>
            </div>

            <p className="relative z-10 mt-4 mb-5 flex-1 text-[14px] leading-[1.5] font-medium text-[#445264] sm:mt-5 sm:mb-6 lg:mt-6 lg:mb-7 lg:ps-16">
              {card.body}
            </p>

            <span
              className={`relative z-10 mt-auto flex min-h-11 items-center justify-between gap-3 text-[14px] font-bold lg:ps-16 ${card.ctaColor}`}
            >
              <span>{card.cta}</span>
              <DirArrow className="text-lg" />
            </span>
          </Link>
        ))}
        <div className="w-2 shrink-0 sm:hidden" aria-hidden />
      </div>
    </div>
  );
}

function MosqueWatermark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 120" fill="currentColor" className={className} aria-hidden>
      <path d="M33 15h14l-2 8h-10l-2-8Z" />
      <path d="M38 2h4v14h-4zM35 23h10v72H35z" />
      <path d="M29 48h22v7H29zM27 94h26v8H27z" />
      <path d="M8 73c8-10 16-10 24 0v29H8V73Zm40 0c8-10 16-10 24 0v29H48V73Z" />
      <path d="M0 102h80v18H0z" />
    </svg>
  );
}
