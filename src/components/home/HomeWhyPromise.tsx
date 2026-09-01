import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";

/**
 * Why / Promise — two HTML cards only; clean roza.png mosque background (no baked UI).
 * Mobile: why + mosque + promise linked as one unit (no gaps).
 */
export async function HomeWhyPromise() {
  const t = await getTranslations("home");
  const why = [t("why1"), t("why2"), t("why3"), t("why4"), t("why5")];

  return (
    <section className="relative isolate w-full overflow-hidden bg-[#F7F8FA] lg:bg-white">
      {/* Full-bleed roza only on desktop — center column shows through between cards */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
        <Image
          src="/brand/why-roza-bg.png"
          alt=""
          fill
          quality={90}
          priority={false}
          className="object-cover"
          style={{ objectPosition: "62% 42%" }}
          sizes="100vw"
          loading="lazy"
          aria-hidden
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,rgba(255,255,255,0.75)_6%,rgba(255,255,255,0.2)_14%,transparent_22%,transparent_78%,rgba(255,255,255,0.2)_86%,rgba(255,255,255,0.75)_94%,#ffffff_100%)]"
        />
      </div>

      <Container className="relative z-10 px-5 py-5 sm:px-8 sm:py-6 lg:max-w-[1220px] lg:px-7 lg:py-5 xl:px-9 xl:py-6">
        <div className="grid w-full grid-cols-1 gap-0 lg:grid-cols-[minmax(0,420px)_minmax(120px,1fr)_minmax(0,360px)] lg:items-center lg:gap-5 xl:gap-7">
          {/* Mobile: one linked stack. Desktop: children join the grid via contents. */}
          <div className="overflow-hidden rounded-[18px] shadow-[0_10px_28px_rgba(9,30,66,0.12)] lg:contents lg:overflow-visible lg:rounded-none lg:shadow-none">
            <article className="relative z-10 flex h-fit flex-col justify-center bg-white px-5 py-5 sm:px-6 sm:py-6 lg:rounded-[18px] lg:px-[26px] lg:py-6 lg:shadow-[0_10px_28px_rgba(9,30,66,0.12)]">
              <h2 className="mb-3.5 text-[13px] font-extrabold tracking-[0.08em] text-[#0A1B3D] uppercase sm:mb-4 sm:text-[15px] lg:text-[16px] lg:tracking-[0.06em]">
                {t("whyTitle")}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {why.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[13px] leading-[1.35] text-[#2A3544] sm:items-center sm:text-[14px] sm:leading-none"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E8913A] sm:mt-0">
                      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3.5} />
                    </span>
                    <span className="min-w-0 lg:whitespace-nowrap">{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            {/* Mobile: mosque strip — flush between cards */}
            <div className="relative h-[120px] overflow-hidden sm:h-[140px] lg:hidden">
              <Image
                src="/brand/why-roza-bg.png"
                alt={t("whyImageAlt")}
                fill
                quality={85}
                className="object-cover"
                style={{ objectPosition: "50% 38%" }}
                sizes="(max-width: 1024px) 100vw, 0px"
                loading="lazy"
              />
            </div>

            {/* Desktop center — mosque from section bg */}
            <div className="relative hidden lg:block" aria-hidden />

            <article className="relative z-10 flex h-fit flex-col justify-center bg-white px-5 py-4 sm:px-6 sm:py-5 lg:rounded-[18px] lg:px-[26px] lg:py-3.5 lg:shadow-[0_10px_28px_rgba(9,30,66,0.12)]">
              <h2 className="mb-2.5 text-[13px] font-extrabold tracking-[0.08em] text-[#0A1B3D] uppercase sm:mb-3 sm:text-[15px] lg:text-[16px] lg:tracking-[0.06em]">
                {t("promiseTitle")}
              </h2>
              <p className="text-[13px] leading-[1.55] text-[#2A3544] sm:text-[14px] sm:leading-[1.5]">
                {t("promiseBody")}
              </p>
              <p className="mt-3 text-[13px] font-bold text-[#0A1B3D] sm:mt-2.5 sm:text-[14px]">
                – {t("promiseSign")}
              </p>
            </article>
          </div>
        </div>
      </Container>
    </section>
  );
}
