import Image from "next/image";
import { Libre_Baskerville } from "next/font/google";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import { hajjCampaignPreRegPath } from "@/data/hajj-campaign-types";
import type { HajjLandingV2 } from "@/data/hajj/landing-v2-content";

const CTA_BLUE = "#1264F5";

const display = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
});

export function HajjFinalCtaSection({
  content,
  campaignSlug = "hajj-2027",
}: {
  content: HajjLandingV2["finalCta"];
  campaignSlug?: string;
}) {
  return (
    <section id="abschluss" className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={content.imageSrc}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[38%_center] lg:object-[center_58%]"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/65 lg:hidden" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-black/70 via-black/28 to-black/12 lg:block" />
      </div>

      <Container className="relative grid min-h-[430px] items-center gap-6 py-10 md:min-h-[300px] md:gap-8 md:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div className="max-w-xl">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-white/90">{content.label}</p>
          <h2
            className={`${display.className} mt-3 max-w-[18ch] text-[32px] leading-[1.15] tracking-[-0.02em] text-white sm:text-[38px] md:text-[42px]`}
          >
            {content.title}
          </h2>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/88 md:text-[15px]">
            {content.body}
          </p>
        </div>

        <div className="lg:justify-self-end lg:text-end">
          <Link
            href={hajjCampaignPreRegPath(campaignSlug)}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold text-white transition hover:brightness-95 lg:w-auto"
            style={{ backgroundColor: CTA_BLUE }}
          >
            {content.cta}
            <DirArrow />
          </Link>
          <p className="mt-3 text-[13px] text-white/90">{content.ctaFree}</p>
          <p className="mt-1 text-[12px] text-white/75">{content.note}</p>
        </div>
      </Container>
    </section>
  );
}
