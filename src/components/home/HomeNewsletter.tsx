import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "@/components/home/NewsletterForm";

export async function HomeNewsletter() {
  const t = await getTranslations("home");

  return (
    <section className="bg-white pb-[40px] pt-[16px] md:pb-[52px] md:pt-[20px]">
      <Container className="lg:px-[36px]">
        <div className="relative overflow-hidden rounded-[16px] bg-[#FAFBFC] shadow-[0_8px_28px_rgba(9,30,66,0.08)] ring-1 ring-[#ECEEF2]">
          {/* Right photo with soft fade into white */}
          <div className="pointer-events-none absolute inset-y-0 end-0 hidden w-[32%] lg:block xl:w-[30%]">
            <Image
              src="/brand/newsletter-quran.jpg"
              alt={t("newsletterImageAlt")}
              fill
              quality={75}
              loading="lazy"
              className="object-cover object-[72%_center] rtl:object-[28%_center]"
              sizes="(max-width:1280px) 32vw, 400px"
            />
            <div className="newsletter-fade absolute inset-0" />
          </div>

          <div className="relative flex flex-col gap-[18px] px-[18px] py-[20px] sm:px-[24px] sm:py-[22px] md:flex-row md:items-center md:gap-[20px] md:px-[28px] md:py-[22px] lg:gap-[28px] lg:pe-[34%] xl:gap-[36px] xl:pe-[32%]">
            {/* Icon + copy */}
            <div className="flex min-w-0 flex-1 items-center gap-[14px] sm:gap-[16px]">
              <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[12px] bg-white shadow-[0_4px_14px_rgba(9,30,66,0.10)] ring-1 ring-[#EEF0F3] sm:h-[56px] sm:w-[56px]">
                <Mail className="h-[24px] w-[24px] text-[#E8913A] sm:h-[26px] sm:w-[26px]" strokeWidth={1.75} aria-hidden />
              </div>
              <div className="min-w-0">
                <h2 className="text-[18px] font-bold leading-tight text-[#0A1B3D] sm:text-[20px]">
                  {t("newsletterTitle")}
                </h2>
                <p className="mt-[4px] max-w-[420px] text-[13px] leading-[1.45] text-[#5B6B7C] sm:text-[14px]">
                  {t("newsletterBody")}
                </p>
              </div>
            </div>

            <NewsletterForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
