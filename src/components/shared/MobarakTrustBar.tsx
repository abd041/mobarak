import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const TRUST_ITEMS = [
  {
    icon: "/brand/icons/home/trophy.png",
    line1Key: "trust1Line1" as const,
    line2Key: "trust1Line2" as const,
  },
  {
    icon: "/brand/icons/home/people.png",
    line1Key: "trust2Line1" as const,
    line2Key: "trust2Line2" as const,
  },
  {
    icon: "/brand/icons/home/shield.png",
    line1Key: "trust3Line1" as const,
    line2Key: "trust3Line2" as const,
  },
  {
    icon: "/brand/icons/home/heart.png",
    line1Key: "trust4Line1" as const,
    line2Key: "trust4Line2" as const,
  },
] as const;

export async function MobarakTrustBar({
  variant = "home",
}: {
  variant?: "home" | "listing";
}) {
  const t = await getTranslations("home");

  if (variant === "listing") {
    return (
      <section
        className="border-y border-[#E8EAEE] bg-[#FAFBFC] py-4 sm:py-5"
        aria-labelledby="listing-trust-heading"
      >
        <Container>
          <h2 id="listing-trust-heading" className="sr-only">
            {t("trustBarHeading")}
          </h2>
          <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-0">
            {TRUST_ITEMS.map((item, index) => (
              <li
                key={item.line1Key}
                className={cn(
                  "flex items-center gap-2.5 px-1 py-1 md:px-3 lg:px-4",
                  index > 0 && "md:border-s md:border-[#E8EAEE]",
                )}
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={48}
                  height={48}
                  className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11"
                />
                <p className="min-w-0 text-[12px] font-bold leading-snug text-[#0B2A7A] sm:text-[13px]">
                  <span className="block">{t(item.line1Key)}</span>
                  <span className="block font-semibold text-[#0B2A7A]/85">{t(item.line2Key)}</span>
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    );
  }

  return (
    <section
      className="border-y border-[#E8EAEE] bg-white"
      aria-labelledby="home-trust-heading"
    >
      <Container className="lg:px-9">
        <h2 id="home-trust-heading" className="sr-only">
          {t("trustBarHeading")}
        </h2>
        <ul className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item, index) => (
            <li
              key={item.line1Key}
              className={cn(
                "flex flex-col items-center gap-2 px-1 py-4 text-center",
                "md:flex-row md:items-center md:gap-3 md:px-3 md:py-5 md:text-start sm:gap-3.5 sm:px-5 sm:py-6 lg:px-6 lg:py-7",
                index > 0 && "max-md:border-s max-md:border-[#E8EAEE]",
                index % 2 === 1 && "md:border-s md:border-[#E8EAEE]",
                index >= 2 && "md:border-t md:border-[#E8EAEE] lg:border-t-0",
                index > 0 && "lg:border-s lg:border-[#E8EAEE]",
              )}
            >
              <Image
                src={item.icon}
                alt=""
                width={56}
                height={56}
                className="h-9 w-9 shrink-0 object-contain max-md:mx-auto md:h-11 md:w-11 lg:h-14 lg:w-14"
              />
              <p className="min-w-0 text-[10px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#0B2A7A] max-md:mx-auto md:text-[13px] sm:text-[15px] lg:text-[16px]">
                <span className="block">{t(item.line1Key)}</span>
                <span className="block font-bold text-[#0B2A7A]/88">{t(item.line2Key)}</span>
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
