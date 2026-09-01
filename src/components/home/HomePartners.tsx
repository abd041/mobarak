"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import type { Partner } from "@/data/partners";
import { getVisiblePartners, PARTNERS_EVENT } from "@/lib/partners-store";

export function HomePartners() {
  const t = useTranslations("home");
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const sync = () => setPartners(getVisiblePartners());
    sync();
    window.addEventListener(PARTNERS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PARTNERS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (partners.length === 0) return null;

  return (
    <section className="bg-[#F7F8FA] py-[28px] md:py-[36px]">
      <Container className="lg:px-[36px]">
        <div className="rounded-[16px] border border-[#EEF0F3] bg-white px-[20px] py-[24px] shadow-[0_6px_22px_rgba(9,30,66,0.06)] sm:px-[28px] sm:py-[28px] md:px-[36px] md:py-[32px]">
          <h2 className="mb-[22px] text-center text-[11px] font-extrabold tracking-[0.12em] text-[#0A1B3D] uppercase sm:mb-[26px] sm:text-[12px] md:text-[13px]">
            {t("partnersTitle")}
          </h2>

          <ul className="flex flex-wrap items-center justify-center gap-y-[20px] sm:flex-nowrap sm:justify-between sm:gap-y-0">
            {partners.map((p, index) => {
              const imgClass =
                "h-full w-auto max-w-[120px] object-contain object-center sm:max-w-[130px] md:max-w-[150px] lg:max-w-[160px]";
              const img = p.logoSrc.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.logoSrc} alt={p.title} className={imgClass} />
              ) : (
                <Image
                  src={p.logoSrc}
                  alt={p.title}
                  width={800}
                  height={400}
                  quality={100}
                  unoptimized
                  sizes="(max-width: 640px) 120px, (max-width: 1024px) 150px, 160px"
                  loading="lazy"
                  className={imgClass}
                />
              );

              return (
                <li
                  key={p.id}
                  className="relative flex min-h-[60px] w-1/2 items-center justify-center px-[10px] sm:w-auto sm:flex-1 sm:px-[8px] md:min-h-[68px] md:px-[12px]"
                >
                  {index > 0 ? (
                    <span
                      aria-hidden
                      className="absolute start-0 top-1/2 hidden h-[36px] w-px -translate-y-1/2 bg-[#E6E8EC] sm:block md:h-[42px]"
                    />
                  ) : null}
                  {p.link ? (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-[52px] items-center justify-center md:h-[60px]"
                      title={p.title}
                    >
                      {img}
                    </a>
                  ) : (
                    <div className="flex h-[52px] items-center justify-center md:h-[60px]">{img}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
