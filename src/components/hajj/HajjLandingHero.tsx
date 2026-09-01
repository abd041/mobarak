import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import { HajjBenefitCheck } from "@/components/hajj/HajjBenefitCheck";
import type { HajjPageContent } from "@/data/hajj-content-defaults";
import { hajjCampaignPreRegPath } from "@/data/hajj-campaign-types";
import { HAJJ_DESKTOP_CTA_BLOCK } from "@/lib/hajj-cta";
import { IQ } from "@/lib/images";

export async function HajjLandingHero({
  content,
  campaignSlug = "hajj-2027",
}: {
  content: HajjPageContent["hero"];
  campaignSlug?: string;
}) {
  return (
    <section id="top" className="hajj-hero relative bg-white lg:overflow-hidden">
      {/* ── Mobile / tablet — full-bleed photo + whitish wash (do not affect lg+) ── */}
      <div className="relative overflow-x-clip lg:hidden">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={content.imageSrc}
            alt=""
            fill
            priority
            quality={IQ.hero}
            sizes="100vw"
            className="object-cover object-[center_32%]"
          />
          <div className="hajj-hero-mobile-whitish absolute inset-0" />
        </div>

        <Container className="relative pt-8 pb-5">
          <span className="mb-4 inline-block rounded-md bg-[#C4A35A] px-3 py-1.5 text-[11px] font-bold tracking-[0.12em] text-white">
            {content.label}
          </span>

          <h1 className="font-serif text-[32px] font-semibold leading-[1.12] tracking-[-0.02em] text-navy sm:text-[36px]">
            {content.title}
            <br />
            {content.titleLine2}
          </h1>

          <p className="mt-4 max-w-[34rem] text-[15px] leading-[1.65] text-[#2F3F4F]">
            {content.body}
          </p>

          <ul className="mt-6 flex flex-col gap-3">
            {content.benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-2.5 text-[14px] font-semibold leading-snug text-navy"
              >
                <HajjBenefitCheck filled />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </Container>

        {/* Photo band — reviews card overlaps this from the next section */}
        <div className="relative h-[min(62vw,300px)] w-full pb-16" aria-hidden />
      </div>

      {/* ── Desktop — locked layout (unchanged) ── */}
      <div className="hajj-hero-bg relative hidden overflow-hidden lg:block">
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

        <Container className="relative flex h-full min-h-[inherit] items-center py-10 md:py-8">
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

            <ul className="mt-7 grid gap-x-10 gap-y-3 sm:grid-cols-2">
              {content.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-2 text-[13px] font-semibold leading-snug text-navy md:text-[14px]"
                >
                  <HajjBenefitCheck />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className={`mt-9 ${HAJJ_DESKTOP_CTA_BLOCK}`}>
              <Link
                href={hajjCampaignPreRegPath(campaignSlug)}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-cta px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(30,90,156,0.3)] transition hover:bg-navy"
              >
                {content.cta}
                <DirArrow />
              </Link>
              <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] text-muted md:text-[13px]">
                <li className="inline-flex items-center gap-1.5">
                  <HajjBenefitCheck className="h-3.5 w-3.5" />
                  {content.ctaFree}
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <HajjBenefitCheck className="h-3.5 w-3.5" />
                  {content.ctaNoPay}
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
