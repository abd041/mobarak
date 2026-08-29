import Image from "next/image";
import { Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import type { HajjPageContent } from "@/data/hajj-content-defaults";
import { IQ } from "@/lib/images";

export function HajjFinalCtaSection({ content }: { content: HajjPageContent["finalCta"] }) {
  const bodyParts = content.body
    .split(/(?<=\.)\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <section id="abschluss" className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={content.imageSrc}
          alt=""
          fill
          quality={IQ.hero}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy/75" />
      </div>

      <Container className="relative py-16 text-center text-white md:py-20 lg:py-24">
        <h2 className="mx-auto max-w-3xl text-[28px] font-bold leading-[1.15] tracking-[-0.02em] md:text-[34px] lg:text-[38px]">
          {content.title}
        </h2>

        <div className="mx-auto mt-5 max-w-2xl space-y-1 text-[15px] leading-relaxed text-white/88 md:mt-6 md:text-[16px] md:leading-[1.65]">
          {bodyParts.map((part, index) => (
            <p key={index}>{part}</p>
          ))}
        </div>

        <ul className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 text-[13px] font-medium text-white/92 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-3.5 md:mt-10 md:text-[14px] lg:max-w-4xl lg:grid-cols-4 lg:gap-4">
          {content.features.map((feature) => (
            <li key={feature} className="inline-flex items-center justify-center gap-2 sm:justify-center">
              <Check className="h-4 w-4 shrink-0 text-brand-gold" strokeWidth={2.5} aria-hidden />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 hidden flex-col items-center md:mt-12 md:flex">
          <Link
            href="/hajj-2027/vormerkung"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-cta px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_4px_20px_rgba(30,90,156,0.35)] transition hover:bg-navy"
          >
            {content.cta}
            <DirArrow />
          </Link>
          <p className="mt-3 text-[12px] text-white/78 md:text-[13px]">{content.ctaFree}</p>
        </div>
      </Container>
    </section>
  );
}
