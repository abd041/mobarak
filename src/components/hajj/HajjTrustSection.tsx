import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { HajjLandingV2, LandingTrustItem } from "@/data/hajj/landing-v2-content";

const ICON_SRC: Record<LandingTrustItem["icon"], string> = {
  experience: "/brand/icons/hajj-trust/experience.png",
  costs: "/brand/icons/hajj-trust/costs.png",
  nusuk: "/brand/icons/hajj-trust/nusuk.png",
  religious: "/brand/icons/hajj-trust/religious.png",
  languages: "/brand/icons/hajj-trust/languages.png",
};

function TrustIcon({ name }: { name: LandingTrustItem["icon"] }) {
  return (
    <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] sm:h-[56px] sm:w-[56px]">
      <Image
        src={ICON_SRC[name]}
        alt=""
        width={28}
        height={28}
        className="h-7 w-7 object-contain"
        unoptimized
      />
    </span>
  );
}

export function HajjTrustSection({ items }: { items: HajjLandingV2["trust"] }) {
  return (
    <section className="hidden border-b border-[#EEF0F3] bg-white py-8 md:py-10 lg:block lg:py-11">
      <Container>
        <ul className="grid gap-5 lg:grid-cols-5 xl:gap-6">
          {items.map((item) => (
            <li key={item.id} className="flex min-w-0 items-start gap-3">
              <TrustIcon name={item.icon} />
              <div className="min-w-0 pt-0.5">
                <h3 className="text-[14px] font-bold leading-snug text-navy xl:text-[15px]">
                  {item.title}
                </h3>
                <p className="mt-1 text-[12px] leading-[1.45] text-[#5A6A7A] xl:text-[13px]">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
