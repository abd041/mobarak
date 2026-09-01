import { IndividualUmrahFinalHero } from "@/components/individual-umrah/IndividualUmrahFinalHero";
import { IndividualUmrahFinalInquiryForm } from "@/components/individual-umrah/IndividualUmrahFinalInquiryForm";

/** §37 — Step 2 page shell: approved hero + form only; no extra chrome. */
export function IndividualUmrahFinalPageContent() {
  return (
    <div className="individual-umrah pb-4 md:pb-0">
      <IndividualUmrahFinalHero />
      <IndividualUmrahFinalInquiryForm />
    </div>
  );
}
