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
    <section className="border-t border-line bg-white py-10 md:py-12">
      <Container className="lg:px-9">
        <h2 className="mb-8 text-center text-xs font-bold tracking-[0.12em] text-navy/60 md:text-sm">
          {t("partnersTitle")}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-8 sm:gap-x-8 md:gap-x-10 lg:gap-x-12">
          {partners.map((p) => {
            const imgClass =
              "h-full w-auto max-w-[160px] object-contain object-center sm:max-w-[180px] lg:max-w-[200px]";
            const img = p.logoSrc.startsWith("data:") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.logoSrc} alt={p.title} className={imgClass} />
            ) : (
              <Image
                src={p.logoSrc}
                alt={p.title}
                width={200}
                height={80}
                quality={80}
                loading="lazy"
                className={imgClass}
              />
            );
            return (
              <div
                key={p.id}
                className="flex h-14 w-auto items-center justify-center sm:h-16 lg:h-[72px]"
              >
                {p.link ? (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-full"
                    title={p.title}
                  >
                    {img}
                  </a>
                ) : (
                  img
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
