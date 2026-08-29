import {
  Award,
  HeartHandshake,
  MapPin,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const items: {
  Icon: LucideIcon;
  titleKey: "trust1Title" | "trust2Title" | "trust3Title" | "trust4Title";
  bodyKey: "trust1Body" | "trust2Body" | "trust3Body" | "trust4Body";
}[] = [
  { Icon: Award, titleKey: "trust1Title", bodyKey: "trust1Body" },
  { Icon: Users, titleKey: "trust2Title", bodyKey: "trust2Body" },
  { Icon: MapPin, titleKey: "trust3Title", bodyKey: "trust3Body" },
  { Icon: HeartHandshake, titleKey: "trust4Title", bodyKey: "trust4Body" },
];

function TrustIcon({
  Icon,
  compact = false,
  golden = false,
}: {
  Icon: LucideIcon;
  compact?: boolean;
  golden?: boolean;
}) {
  return (
    <Icon
      className={cn(
        "shrink-0",
        golden ? "text-[#C59D3F]" : "text-[#091B3B]",
        compact ? "h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" : "h-12 w-12 sm:h-14 sm:w-14",
      )}
      strokeWidth={1.5}
      aria-hidden
    />
  );
}

export async function MobarakTrustBar({
  variant = "home",
}: {
  variant?: "home" | "listing";
}) {
  const t = await getTranslations("home");

  if (variant === "listing") {
    return (
      <section
        className="border-t border-[#E8EBEF] bg-[#F7F8FA] py-8 sm:py-10"
        aria-labelledby="listing-trust-heading"
      >
        <Container>
          <h2 id="listing-trust-heading" className="sr-only">
            {t("trustBarHeading")}
          </h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 rounded-[16px] border border-[#E9EAEE] bg-white px-3 py-5 shadow-[0_2px_10px_rgba(9,30,66,0.05)] sm:gap-x-6 sm:gap-y-8 sm:px-6 sm:py-8 lg:grid-cols-4 lg:gap-y-0 lg:px-0 lg:py-0">
            {items.map((item, index) => (
              <div
                key={item.titleKey}
                className={cn(
                  "flex min-w-0 flex-col gap-2 px-1 sm:gap-3 sm:px-2 lg:px-6 lg:py-8",
                  index < items.length - 1 && "lg:border-e lg:border-[#E6E8EC]",
                )}
              >
                <TrustIcon Icon={item.Icon} compact />
                <div className="min-w-0">
                  <p className="mt-1 min-w-0 break-words text-[12px] leading-tight font-extrabold tracking-[-0.02em] text-[#091B3B] sm:mt-1.5 sm:text-[14px] lg:text-[16px]">
                    {t(item.titleKey)}
                  </p>
                  <p className="mt-1 min-w-0 break-words text-[11px] leading-[1.35] font-semibold tracking-[-0.01em] text-[#445264] sm:mt-1.5 sm:text-[13px] lg:text-[14px]">
                    {t(item.bodyKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-white pb-4 pt-1">
      <Container className="lg:px-9">
        <div className="grid min-h-31.5 gap-y-6 rounded-[16px] border border-[#E9EAEE] bg-white px-4 py-5 shadow-[0_4px_18px_rgba(9,30,66,0.045)] sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0 lg:px-0 lg:py-0">
          {items.map((item, index) => (
            <div
              key={item.titleKey}
              className={`flex items-center gap-3.5 px-3 lg:gap-4 lg:px-6 ${
                index < items.length - 1 ? "lg:border-e lg:border-[#E6E8EC]" : ""
              }`}
            >
              <TrustIcon Icon={item.Icon} golden />
              <div className="min-w-0">
                <p className="text-[15px] leading-[1.2] font-extrabold tracking-[-0.03em] text-[#091B3B] lg:text-[16px] lg:tracking-[-0.04em]">
                  {t(item.titleKey)}
                </p>
                <p className="mt-2 text-[14px] leading-[1.35] font-semibold tracking-[-0.02em] text-[#445264]">
                  {t(item.bodyKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
