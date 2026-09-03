import Image from "next/image";
import type { ReactNode } from "react";
import { Libre_Baskerville } from "next/font/google";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const sectionDisplay = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  display: "swap",
});

const EXPERT_ICONS = {
  user: "/brand/icons/home/expert-user.png",
  clock: "/brand/icons/home/expert-clock.png",
  calendar: "/brand/icons/home/expert-calendar.png",
  phone: "/brand/icons/home/expert-phone.png",
} as const;

const BENEFIT_ICON_SRCS = [
  EXPERT_ICONS.user,
  EXPERT_ICONS.clock,
  EXPERT_ICONS.calendar,
] as const;

function ExpertIcon({
  src,
  size = 22,
  className,
}: {
  src: string;
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      aria-hidden
    />
  );
}

function BenefitPill({ src, lines }: { src: string; lines: string[] }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 shadow-[0_2px_10px_rgba(11,44,74,0.08)] sm:px-3.5 sm:py-3">
      <ExpertIcon src={src} size={22} />
      <span className="min-w-0 leading-[1.15] text-[#0A1B3D]">
        {lines.map((line, i) => (
          <span key={line + i} className="block text-[11px] font-bold sm:text-[12px]">
            {line}
          </span>
        ))}
      </span>
    </div>
  );
}

function MobileInfoBox({
  iconSrc,
  children,
  href,
}: {
  iconSrc: string;
  children: ReactNode;
  href?: string;
}) {
  const inner = (
    <>
      <ExpertIcon src={iconSrc} size={21} />
      <div className="mt-1.5 min-w-0 leading-[1.15] text-[#0B2A7A]">{children}</div>
    </>
  );

  const className =
    "flex min-h-[92px] min-w-0 flex-col items-center justify-center rounded-[8px] bg-white px-1 py-2 text-center shadow-[0_2px_8px_rgba(11,44,74,0.08)]";

  if (href) {
    return (
      <a href={href} className={cn(className, "transition hover:bg-[#F7FAFF]")}>
        {inner}
      </a>
    );
  }

  return <div className={className}>{inner}</div>;
}

/** Homepage expert contact strip — title + benefits + phone (no CTA button). */
export async function HomeExpertCta() {
  const t = await getTranslations("home");
  const tMeta = await getTranslations("meta");
  const phone = tMeta("phone");
  const phoneHref = `tel:${phone.replace(/\s/g, "")}`;

  const benefits = [
    t.raw("expertCtaBenefit1Lines") as string[],
    t.raw("expertCtaBenefit2Lines") as string[],
    t.raw("expertCtaBenefit3Lines") as string[],
  ];

  return (
    <section className="bg-white py-8 sm:py-10 md:py-12" aria-label={t("expertCtaTitle")}>
      <Container className="px-3 sm:px-8 lg:px-9">
        <div className="relative h-[248px] overflow-hidden rounded-[13px] md:h-auto md:min-h-[112px] md:rounded-[14px]">
          <Image
            src="/brand/home-expert-cta-bg.png"
            alt=""
            fill
            priority={false}
            quality={92}
            className="home-expert-cta-bg object-cover object-[82%_center] md:object-[75%_center]"
            sizes="(max-width: 1024px) 100vw, 1200px"
            loading="lazy"
            aria-hidden
          />

          <div className="home-expert-cta-overlay absolute inset-0" aria-hidden />

          {/* Mobile — title + 4 equal info boxes */}
          <div className="relative z-10 flex h-full flex-col justify-between gap-4 px-[18px] py-5 md:hidden">
            <div className="min-w-0 text-white">
              <h2
                className={cn(
                  sectionDisplay.className,
                  "text-[22px] font-bold leading-[1.05] tracking-[-0.02em]",
                )}
              >
                {t("expertCtaTitle")}
              </h2>
              <p className="mt-1 max-w-[16rem] text-[12.5px] leading-snug text-white/95">
                {t("expertCtaSubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-[6px]">
              <MobileInfoBox iconSrc={EXPERT_ICONS.user}>
                {benefits[0]!.map((line, i) => (
                  <span key={line + i} className="block text-[10px] font-bold">
                    {line}
                  </span>
                ))}
              </MobileInfoBox>

              <MobileInfoBox iconSrc={EXPERT_ICONS.clock}>
                {benefits[1]!.map((line, i) => (
                  <span key={line + i} className="block text-[10px] font-bold">
                    {line}
                  </span>
                ))}
              </MobileInfoBox>

              <MobileInfoBox iconSrc={EXPERT_ICONS.calendar}>
                {benefits[2]!.map((line, i) => (
                  <span key={line + i} className="block text-[10px] font-bold">
                    {line}
                  </span>
                ))}
              </MobileInfoBox>

              <MobileInfoBox iconSrc={EXPERT_ICONS.phone} href={phoneHref}>
                <span className="block text-[10px] font-extrabold leading-[1.1] text-[#1264F5]">
                  {phone}
                </span>
                <span className="mt-0.5 block text-[8.5px] font-medium leading-[1.15] text-[#5B6B7C]">
                  {t("expertCtaPhoneHours")}
                </span>
              </MobileInfoBox>
            </div>
          </div>

          {/* Desktop — title + 4 equal pills (benefits + phone) */}
          <div className="relative z-10 hidden items-center gap-4 p-4 sm:p-5 md:flex lg:gap-5 lg:p-5 xl:gap-6 xl:p-6">
            <div className="min-w-0 shrink-0 text-white lg:max-w-[200px] xl:max-w-[220px]">
              <h2
                className={cn(
                  sectionDisplay.className,
                  "text-[1.35rem] font-bold leading-tight tracking-[-0.02em] sm:text-[1.5rem] md:text-[1.55rem]",
                )}
              >
                {t("expertCtaTitle")}
              </h2>
              <p className="mt-1 text-[12px] leading-snug text-white/95 sm:text-[13px]">
                {t("expertCtaSubtitle")}
              </p>
            </div>

            <div className="flex min-w-0 flex-1 items-stretch gap-2 sm:gap-2.5 xl:gap-3">
              {benefits.map((lines, index) => (
                <BenefitPill key={index} src={BENEFIT_ICON_SRCS[index]!} lines={lines} />
              ))}

              <a
                href={phoneHref}
                className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 shadow-[0_2px_10px_rgba(11,44,74,0.08)] transition hover:bg-[#F7FAFF] sm:px-3.5 sm:py-3"
              >
                <ExpertIcon src={EXPERT_ICONS.phone} size={22} />
                <span className="min-w-0 leading-[1.15]">
                  <span className="block truncate text-[12px] font-extrabold text-[#1264F5] sm:text-[13px]">
                    {phone}
                  </span>
                  <span className="mt-0.5 block text-[10px] font-medium text-[#5B6B7C] sm:text-[11px]">
                    {t("expertCtaPhoneHours")}
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
