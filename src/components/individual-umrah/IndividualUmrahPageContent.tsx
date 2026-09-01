import { IndividualUmrahHero } from "@/components/individual-umrah/IndividualUmrahHero";
import { IndividualUmrahInquiryForm } from "@/components/individual-umrah/IndividualUmrahInquiryForm";

export function IndividualUmrahPageContent() {
  return (
    <div className="individual-umrah pb-4 md:pb-0">
      {/*
        §46 Desktop: Hero → 1–7 → Source → Info → CTA
        §47 Mobile: Compact header → Hero → Services → 1–7 → Source →
                    How it works → Advantages → CTA
        (Conditional fields only when relevant — §45; Arabic RTL — §44)
      */}
      <IndividualUmrahHero />
      <IndividualUmrahInquiryForm />
    </div>
  );
}
