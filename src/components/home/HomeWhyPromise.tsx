import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Check, Heart } from "lucide-react";
import { Container } from "@/components/ui/Container";

export async function HomeWhyPromise() {
  const t = await getTranslations("home");
  const why = [t("why1"), t("why2"), t("why3"), t("why4"), t("why5")];

  return (
    <section className="bg-[#F7F8FA] py-8 md:py-10">
      <Container className="lg:px-9">
        <div className="grid overflow-hidden rounded-[14px] bg-white shadow-[0_6px_24px_rgba(9,30,66,0.08)] lg:grid-cols-[1.15fr_0.7fr_1.1fr] lg:items-stretch">
          {/* Left — Why Mobarak */}
          <div className="flex flex-col justify-center px-6 py-6 sm:px-8 sm:py-7 lg:px-8 lg:py-7 xl:px-10">
            <h2 className="mb-4 text-[13px] font-extrabold tracking-[0.06em] text-[#0A1B3D] uppercase sm:text-[14px] lg:mb-3.5 lg:text-[14px]">
              {t("whyTitle")}
            </h2>
            <ul className="flex flex-col gap-2.5">
              {why.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[12.5px] leading-[1.4] text-[#2F3F4F] sm:text-[13px]"
                >
                  <span className="mt-[2px] flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full bg-[#E8913A]">
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3.5} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Center image — fills column; dome centered, finial visible */}
          <div className="relative min-h-[180px] w-full overflow-hidden lg:min-h-[260px]">
            <Image
              src="/brand/why-promise-roza.jpg"
              alt={t("whyImageAlt")}
              fill
              quality={75}
              className="h-full w-full object-cover object-[50%_28%]"
              sizes="(max-width:1024px) 100vw, 280px"
              loading="lazy"
            />
          </div>

          {/* Right — Our Promise */}
          <div className="flex flex-col justify-center px-6 py-6 sm:px-8 sm:py-7 lg:px-8 lg:py-7 xl:px-10">
            <h2 className="mb-3 text-[13px] font-extrabold tracking-[0.06em] text-[#0A1B3D] uppercase sm:text-[14px] lg:mb-3 lg:text-[14px]">
              {t("promiseTitle")}
            </h2>
            <p className="text-[12.5px] leading-[1.5] text-[#2F3F4F] sm:text-[13px]">
              {t("promiseBody")}
            </p>
            <p className="mt-4 flex items-center gap-2 text-[13px] font-bold text-[#0A1B3D] sm:text-[13.5px] lg:mt-5">
              <Heart className="h-3.5 w-3.5 fill-[#E8913A] text-[#E8913A]" />
              {t("promiseSign")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
