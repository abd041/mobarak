import Image from "next/image";
import { Libre_Baskerville } from "next/font/google";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { HajjLandingV2 } from "@/data/hajj/landing-v2-content";
import { IQ } from "@/lib/images";

const NAVY = "#0A1F3D";
const ACCENT = "#1264F5";

const display = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
});

const SERVICE_ICONS = [
  "/brand/icons/hajj-services/booking.png",
  "/brand/icons/hajj-services/travel.png",
  "/brand/icons/hajj-services/trip.png",
  "/brand/icons/hajj-services/hajj-days.png",
] as const;

export function HajjMissionSection({
  content,
  services,
}: {
  content: HajjLandingV2["mission"];
  services: HajjLandingV2["services"];
}) {
  return (
    <section id="betreuung" className="scroll-mt-20 bg-white py-8 lg:py-20">
      <Container>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 xl:items-center xl:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-[12px] font-bold tracking-[0.16em]" style={{ color: ACCENT }}>
                {content.eyebrow}
              </p>
              <span className="h-px w-10 sm:w-14" style={{ backgroundColor: ACCENT }} aria-hidden />
            </div>

            <h2
              className={`${display.className} mt-4 text-[30px] font-bold leading-[1.15] tracking-[-0.02em] md:text-[38px] xl:text-[42px]`}
              style={{ color: NAVY }}
            >
              {content.title}
            </h2>

            <div className="mt-4 space-y-4 text-[13px] leading-[1.6] text-[#4A5A6A] md:text-[16px] md:leading-[1.7] lg:mt-5">
              {content.paragraphs.map((p, index) => (
                <p key={p.slice(0, 48)} className={index > 0 ? "hidden lg:block" : undefined}>
                  {p}
                </p>
              ))}
            </div>

            <p className="mt-4 text-[14px] font-bold md:text-[17px] lg:mt-6" style={{ color: NAVY }}>
              {content.boldLine}
            </p>
            <p className="mt-1.5 text-[13px] leading-[1.6] text-[#4A5A6A] md:text-[16px] md:leading-relaxed lg:mt-2">
              {content.afterBold}
            </p>
          </div>

          <div className="relative pb-8 sm:pb-6 lg:pb-8">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] md:rounded-[26px]">
              <Image
                src={content.imageSrc}
                alt=""
                fill
                quality={IQ.content}
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover object-[center_42%]"
                loading="eager"
              />
              <div className="absolute inset-x-3 bottom-3 rounded-xl bg-white px-4 py-3 shadow-[0_10px_28px_rgba(7,31,53,0.1)] lg:hidden">
                <p className="text-[13px] leading-relaxed text-[#2F3F4F]">{content.quote}</p>
              </div>
            </div>

            <div className="absolute bottom-2 end-0 z-10 hidden w-[min(100%,20.5rem)] rounded-xl bg-white px-5 py-4 shadow-[0_10px_28px_rgba(7,31,53,0.1)] lg:block sm:bottom-0 sm:end-[-0.5rem] md:w-[19.5rem]">
              <p className="text-[13px] leading-relaxed text-[#2F3F4F] sm:text-[14px]">
                {content.quote}
              </p>
            </div>
          </div>
        </div>

        <ul
          id="vorbereitung"
          className="mt-6 grid scroll-mt-20 grid-cols-2 items-stretch gap-3 lg:mt-16 lg:grid-cols-4 lg:gap-5 xl:gap-6"
        >
          {services.columns.map((col, index) => (
            <li
              key={col.id}
              className="flex h-full min-w-0 flex-col rounded-2xl border border-[#E8ECF1] bg-white p-3.5 shadow-[0_4px_18px_rgba(7,31,53,0.05)] lg:p-5"
            >
              <Image
                src={`${SERVICE_ICONS[index] ?? SERVICE_ICONS[0]}?v=4`}
                alt=""
                width={44}
                height={44}
                className="h-9 w-9 object-contain lg:h-11 lg:w-11"
                unoptimized
              />
              <h3
                className={`${display.className} mt-2.5 text-[12px] font-bold leading-tight lg:mt-4 lg:text-[21px] lg:leading-snug`}
                style={{ color: NAVY }}
              >
                {col.title}
              </h3>
              <ul className="mt-2.5 flex flex-1 flex-col gap-1.5 lg:mt-4 lg:gap-2.5">
                {col.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-1.5 text-[10px] leading-[1.4] text-[#4A5A6A] lg:gap-2.5 lg:text-[14px] lg:leading-snug"
                  >
                    <Check
                      className="mt-0.5 h-3 w-3 shrink-0 lg:h-4 lg:w-4"
                      style={{ color: ACCENT }}
                      strokeWidth={2.4}
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
