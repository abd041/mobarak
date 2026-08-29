import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { ServiceCardsRow, type ServiceCardData } from "@/components/home/ServiceCardsRow";

const cardsMeta = [
  {
    key: "umrah",
    href: "/umrah-gruppenreisen",
    icon: "/brand/icons/service-umrah-group-chatgpt.png",
    ctaKey: "viewAllDates" as const,
    ctaColor: "text-brand-orange-ink",
    iconColor: "text-[#F4A000]",
    bg: "bg-[#FFF9F1]",
    hasPrice: true,
  },
  {
    key: "individual",
    href: "/individuelle-umrah",
    icon: "/brand/icons/service-individual-chatgpt.png",
    ctaKey: "learnMore" as const,
    ctaColor: "text-[#145BC0]",
    iconColor: "text-[#075DCE]",
    bg: "bg-[#F3F8FF]",
    hasPrice: false,
  },
  {
    key: "hajj",
    href: "/hajj-2027",
    icon: "/brand/icons/service-hajj-chatgpt.png",
    ctaKey: "learnMore" as const,
    ctaColor: "text-[#19804B]",
    iconColor: "text-[#078949]",
    bg: "bg-[#F2FAF5]",
    hasPrice: false,
  },
  {
    key: "visa",
    href: "/visum-service",
    icon: "/brand/icons/service-visa-chatgpt.png",
    ctaKey: "learnMore" as const,
    ctaColor: "text-[#6527B8]",
    iconColor: "text-[#6827C7]",
    bg: "bg-[#F8F4FF]",
    hasPrice: false,
  },
] as const;

export async function HomeServiceCards() {
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  const copy = {
    umrah: {
      title: t("serviceUmrahTitle"),
      price: t("serviceUmrahPrice"),
      body: t("serviceUmrahBody"),
    },
    individual: {
      title: t("serviceIndividualTitle"),
      body: t("serviceIndividualBody"),
    },
    hajj: {
      title: t("serviceHajjTitle"),
      body: t("serviceHajjBody"),
    },
    visa: {
      title: t("serviceVisaTitle"),
      body: t("serviceVisaBody"),
    },
  };

  const cards: ServiceCardData[] = cardsMeta.map((card) => {
    const item = copy[card.key];
    return {
      key: card.key,
      href: card.href,
      icon: card.icon,
      cta: tCommon(card.ctaKey),
      ctaColor: card.ctaColor,
      iconColor: card.iconColor,
      bg: card.bg,
      title: item.title,
      body: item.body,
      price: card.hasPrice && "price" in item ? item.price : undefined,
    };
  });

  return (
    <Container className="relative z-20 -mt-12 overflow-x-clip pb-6 sm:-mt-14 md:-mt-17 lg:-mt-21 lg:overflow-visible lg:px-9">
      <ServiceCardsRow cards={cards} />
    </Container>
  );
}
