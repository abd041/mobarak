import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { MailOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "@/components/home/NewsletterForm";

export async function HomeNewsletter() {
  const t = await getTranslations("home");

  return (
    <section className="bg-white pb-14 pt-4 md:pb-16">
      <Container className="lg:px-9">
        <div className="relative overflow-hidden rounded-[14px] bg-white shadow-[0_6px_28px_rgba(9,30,66,0.08)] ring-1 ring-[#ECEEF1]">
          <div className="pointer-events-none absolute inset-y-0 end-0 hidden w-[34%] lg:block xl:w-[32%]">
            <Image
              src="/brand/newsletter-quran.jpg"
              alt={t("newsletterImageAlt")}
              fill
              quality={70}
              loading="lazy"
              className="object-cover object-[78%_center] rtl:object-[22%_center]"
              sizes="(max-width:1280px) 34vw, 420px"
            />
            <div className="newsletter-fade absolute inset-0" />
          </div>

          <div className="relative flex flex-col gap-4 px-4 py-5 sm:gap-5 sm:px-6 sm:py-6 md:flex-row md:items-center md:gap-6 md:px-7 md:py-5 lg:gap-8 lg:pe-[36%] xl:gap-10">
            <div className="flex min-w-0 flex-1 items-start gap-3.5 md:items-center md:gap-4">
              <MailOpen
                className="mt-0.5 h-9 w-9 shrink-0 text-[#E8913A] md:mt-0 md:h-10 md:w-10"
                strokeWidth={1.6}
              />
              <div className="min-w-0">
                <h2 className="text-[18px] font-bold leading-tight text-[#1A2332] md:text-[20px]">
                  {t("newsletterTitle")}
                </h2>
                <p className="mt-1 max-w-md text-[13px] leading-[1.45] text-[#5B6B7C] md:text-[14px]">
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
