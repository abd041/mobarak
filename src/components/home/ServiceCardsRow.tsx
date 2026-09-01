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
    <div
      dir="ltr"
      className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4 lg:gap-4.5"
    >
      {ordered.map((card) => (
        <Link
          key={card.key}
          href={card.href}
          className={`group relative flex min-h-[188px] flex-col overflow-hidden rounded-[16px] ${card.bg} px-3 pt-3.5 pb-3.5 shadow-[0_7px_24px_rgba(9,30,66,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(9,30,66,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cta sm:min-h-70 sm:rounded-[20px] sm:px-6 sm:pt-6 sm:pb-7 lg:min-h-74 lg:px-7 lg:pt-7 lg:pb-8`}
        >
          <MosqueWatermark
            className={`absolute -bottom-5 -inset-s-2 h-28 w-20 sm:h-32 sm:w-24 ${card.iconColor} opacity-[0.055]`}
          />

          <div className="relative z-10 flex items-start gap-2 sm:gap-3.5 lg:gap-4">
            <Image
              src={card.icon}
              alt=""
              width={56}
              height={56}
              className="h-8 w-8 shrink-0 object-contain sm:h-12 sm:w-12 lg:h-14 lg:w-14"
              quality={80}
              sizes="56px"
            />

            <div className="min-w-0 pt-0.5 sm:pt-1">
              <h3 className="text-[13px] leading-[1.2] font-bold text-[#091B3B] sm:text-[18px] lg:text-[22px] lg:leading-[1.25] lg:font-extrabold lg:tracking-[-0.02em]">
                {card.title}
              </h3>
              {card.price && (
                <p className="mt-0.5 text-[12px] font-semibold text-[#D88715] sm:mt-1 sm:text-[14px]">
                  {card.price}
                </p>
              )}
            </div>
          </div>

          <p className="relative z-10 mt-2.5 mb-3 flex-1 text-[11px] leading-[1.45] font-medium text-[#445264] sm:mt-5 sm:mb-6 sm:text-[14px] sm:leading-[1.5] lg:mt-6 lg:mb-7 lg:ps-16">
            {card.body}
          </p>

          <span
            className={`relative z-10 mt-auto flex min-h-8 items-center justify-between gap-1.5 text-[11px] font-bold sm:min-h-11 sm:gap-3 sm:text-[14px] lg:ps-16 ${card.ctaColor}`}
          >
            <span className="line-clamp-2 sm:line-clamp-none">{card.cta}</span>
            <DirArrow className="shrink-0 text-base sm:text-lg" />
          </span>
        </Link>
      ))}
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
