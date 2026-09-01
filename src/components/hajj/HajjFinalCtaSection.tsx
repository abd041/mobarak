import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import type { HajjPageContent } from "@/data/hajj-content-defaults";
import { hajjCampaignPreRegPath } from "@/data/hajj-campaign-types";
import { IQ } from "@/lib/images";

const FEATURE_ICONS = [
  "/brand/icons/hajj-why/experience.png",
  "/brand/icons/hajj-why/support.png",
  "/brand/icons/hajj-why/religious.png",
  "/brand/icons/hajj-why/group.png",
] as const;

/**
 * Final CTA banner — navy left / Kaaba right with soft fade (reference layout).
 */
export function HajjFinalCtaSection({
  content,
  campaignSlug = "hajj-2027",
}: {
  content: HajjPageContent["finalCta"];
  campaignSlug?: string;
}) {
  const bodyParts = content.body
    .split(/(?<=\.)\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const features = content.features.slice(0, 4);

  return (
    <section id="abschluss" className="bg-[#F7F5F1] py-10 md:py-12 lg:py-16">
      <Container>
        <div className="relative overflow-hidden rounded-[22px] bg-[#071F35] shadow-[0_16px_48px_rgba(7,31,53,0.28)] md:rounded-[28px]">
          {/* Right photo — desktop */}
          <div
            className="pointer-events-none absolute inset-y-0 end-0 hidden w-[52%] md:block lg:w-[48%]"
            aria-hidden
          >
            <Image
              src={content.imageSrc || "/brand/offer-hero/hero-bg-kaaba.png"}
              alt=""
              fill
              quality={IQ.hero}
              sizes="50vw"
              className="object-cover object-[68%_40%]"
            />
          </div>

          {/* Soft navy → photo fade */}
          <div
            className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#071F35] from-[42%] via-[#071F35]/92 via-[55%] to-transparent to-[78%] md:block"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(212,160,23,0.08),transparent_55%)]"
            aria-hidden
          />

          {/* Mobile photo strip */}
          <div className="relative h-44 w-full md:hidden" aria-hidden>
            <Image
              src={content.imageSrc || "/brand/offer-hero/hero-bg-kaaba.png"}
              alt=""
              fill
              quality={IQ.hero}
              sizes="100vw"
              className="object-cover object-[70%_35%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#071F35]/25 via-transparent to-[#071F35]" />
          </div>

          <div className="relative grid gap-8 px-6 py-8 sm:px-8 sm:py-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-center md:gap-6 md:px-10 md:py-12 lg:gap-10 lg:px-12 lg:py-14">
            {/* Left copy */}
            <div className="min-w-0">
              <h2 className="max-w-xl font-serif text-[28px] leading-[1.15] font-semibold tracking-[-0.02em] text-white sm:text-[32px] md:text-[34px] lg:text-[40px]">
                {content.title}
              </h2>

              <div className="mt-4 max-w-lg space-y-1 text-[15px] leading-relaxed text-[#D4B56A] sm:text-[16px] md:mt-5 md:text-[17px]">
                {bodyParts.map((part, index) => (
                  <p key={index}>{part}</p>
                ))}
              </div>

              <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 sm:flex sm:flex-wrap sm:items-start sm:gap-x-6 sm:gap-y-4 lg:gap-x-8">
                {features.map((feature, index) => (
                  <li
                    key={feature}
                    className="flex w-full max-w-[9.5rem] flex-col items-center text-center sm:w-auto sm:items-center"
                  >
                    <span className="relative mb-2.5 h-11 w-11 sm:h-12 sm:w-12">
                      <Image
                        src={FEATURE_ICONS[index] ?? FEATURE_ICONS[0]!}
                        alt=""
                        fill
                        className="object-contain brightness-110"
                        sizes="48px"
                        quality={90}
                      />
                    </span>
                    <span className="text-[11px] font-medium leading-snug text-white/95 sm:text-[12px]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right CTA — sits over photo on desktop */}
            <div className="hidden flex-col items-center justify-center md:flex lg:items-end">
              <Link
                href={hajjCampaignPreRegPath(campaignSlug)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/90 bg-[#071F35]/92 px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_28px_rgba(0,0,0,0.35)] backdrop-blur-[2px] transition hover:border-white hover:bg-[#0A2A45]"
              >
                {content.cta}
                <DirArrow />
              </Link>
              <p className="mt-3 text-center text-[12px] text-white/80 md:text-[13px]">
                {content.ctaFree}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
