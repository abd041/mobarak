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
        compact ? "h-5 w-5 md:h-10 md:w-10 lg:h-12 lg:w-12" : "h-12 w-12 sm:h-14 sm:w-14",
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
        className="border-t border-[#EDE6DE] bg-[#FAF6F2] py-8 sm:py-9"
        aria-labelledby="listing-trust-heading"
      >
        <Container>
          <h2 id="listing-trust-heading" className="sr-only">
            {t("trustBarHeading")}
          </h2>
          <div className="grid grid-cols-2 gap-3 md:gap-x-6 md:gap-y-7 lg:grid-cols-4 lg:gap-0">
            {items.map((item, index) => (
              <div
                key={item.titleKey}
                className={cn(
                  "relative flex min-w-0 items-start gap-3 rounded-[14px] border border-[#EFE8E0] bg-white/70 px-3 py-3.5 shadow-[0_2px_10px_rgba(9,30,66,0.04)] backdrop-blur-[2px] md:gap-3.5 md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0 md:shadow-none md:backdrop-blur-none lg:px-5 xl:px-6",
                  index > 0 &&
                    "lg:before:absolute lg:before:inset-y-1 lg:before:start-0 lg:before:w-px lg:before:bg-[#E4DCD3]",
                )}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7F1EA] ring-1 ring-[#E8DFD4]/80 md:h-auto md:w-auto md:bg-transparent md:ring-0">
                  <TrustIcon Icon={item.Icon} compact />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[12.5px] font-extrabold leading-[1.25] tracking-[-0.025em] text-[#091B3B] md:text-[14px] lg:text-[15px]">
                    {t(item.titleKey)}
                  </p>
                  <p className="mt-1.5 text-[11px] font-medium leading-[1.4] text-[#5B6B7C] md:mt-1 md:text-[13px] md:text-[#091B3B]/80">
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
    <section className="bg-[#F7F8FA] pb-5 pt-1 sm:bg-white sm:pb-4">
      <Container className="lg:px-9">
        <div className="grid grid-cols-2 gap-2.5 rounded-[18px] border border-[#E9EAEE] bg-white p-2.5 shadow-[0_8px_28px_rgba(9,30,66,0.06)] sm:min-h-31.5 sm:gap-y-6 sm:p-0 sm:px-4 sm:py-5 lg:grid-cols-4 lg:gap-y-0 lg:px-0 lg:py-0">
          {items.map((item, index) => (
            <div
              key={item.titleKey}
              className={cn(
                "flex min-w-0 flex-col gap-2.5 rounded-[14px] bg-gradient-to-b from-[#FBF8F2] to-[#F7F8FA] px-3 py-3.5 sm:flex-row sm:items-center sm:gap-3.5 sm:rounded-none sm:bg-none sm:bg-transparent sm:px-3 sm:py-0 lg:gap-4 lg:px-6",
                index < items.length - 1 && "lg:border-e lg:border-[#E6E8EC]",
              )}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(197,157,63,0.18)] sm:h-auto sm:w-auto sm:rounded-none sm:bg-transparent sm:shadow-none">
                <TrustIcon Icon={item.Icon} golden compact />
              </div>
              <div className="min-w-0">
                <p className="text-[12.5px] leading-[1.25] font-extrabold tracking-[-0.02em] text-[#091B3B] sm:text-[15px] sm:leading-[1.2] sm:tracking-[-0.03em] lg:text-[16px] lg:tracking-[-0.04em]">
                  {t(item.titleKey)}
                </p>
                <p className="mt-1 text-[11px] leading-[1.4] font-medium text-[#445264] sm:mt-2 sm:text-[14px] sm:leading-[1.35] sm:font-semibold sm:tracking-[-0.02em]">
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
