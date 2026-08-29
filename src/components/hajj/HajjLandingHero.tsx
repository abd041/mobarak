import Image from "next/image";
import { Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import type { HajjPageContent } from "@/data/hajj-content-defaults";
import { IQ } from "@/lib/images";

export async function HajjLandingHero({ content }: { content: HajjPageContent["hero"] }) {
  return (
    <section
      id="top"
      className="hajj-hero relative min-h-[min(88vh,44rem)] overflow-hidden bg-white lg:h-[500px] lg:min-h-[500px]"
    >
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={content.imageSrc}
          alt=""
          fill
          priority
          quality={IQ.hero}
          sizes="100vw"
          className="hajj-hero-photo object-cover"
        />
        <div className="hajj-hero-scrim absolute inset-0" />
      </div>

      <Container className="relative flex min-h-[min(88vh,44rem)] items-center py-12 md:py-14 lg:h-[500px] lg:min-h-[500px] lg:py-8">
        <div className="w-full max-w-xl lg:max-w-2xl">
          <span className="mb-4 inline-block rounded-full border border-brand-orange/45 bg-[#FFF8EE] px-3.5 py-1 text-[10px] font-bold tracking-[0.14em] text-brand-orange-ink sm:text-[11px]">
            {content.label}
          </span>

          <h1 className="text-[32px] font-bold leading-[1.08] tracking-[-0.025em] text-navy sm:text-[38px] lg:text-[46px]">
            {content.title}
            <br />
            {content.titleLine2}
          </h1>

          <p className="mt-4 max-w-[34rem] text-[15px] leading-[1.65] text-[#3D4F5F] md:text-[16px]">
            {content.body}
          </p>

          <ul className="mt-7 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {content.benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-2 text-[13px] font-medium leading-snug text-navy md:text-[14px]"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold"
                  strokeWidth={2.75}
                  aria-hidden
                />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 hidden md:block">
            <Link
              href="/hajj-2027/vormerkung"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-cta px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(30,90,156,0.3)] transition hover:bg-navy"
            >
              {content.cta}
              <DirArrow />
            </Link>
            <ul className="mt-3 space-y-1 text-[12px] text-muted">
              <li className="flex items-center gap-1.5">
                <span className="text-brand-gold" aria-hidden>
                  ✓
                </span>
                {content.ctaFree}
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-brand-gold" aria-hidden>
                  ✓
                </span>
                {content.ctaNoPay}
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
