import { Libre_Baskerville } from "next/font/google";
import { VisumServiceHero } from "@/components/visum/VisumServiceHero";
import { VisumServiceInfo } from "@/components/visum/VisumServiceInfo";
import {
  VisumServiceForm,
  VisumServiceTrustBar,
} from "@/components/visum/VisumServiceForm";
import { VisumServiceSeo } from "@/components/visum/VisumServiceSeo";
import { pickLocalized, type VisumCmsConfig } from "@/data/visum-cms";

const visaDisplay = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-visa-display",
  display: "swap",
});

/**
 * §41 — VISUAL LOCK: Hero → cards → form → trust must stay screenshot-faithful.
 * Only major addition: SEO/information underneath (Admin CMS).
 *
 * §39/§40 order: Header → Hero → Benefits → Visa info → Form → Trust → SEO → Footer
 */
export function VisumServicePageContent({
  locale,
  cms,
}: {
  locale: string;
  cms: VisumCmsConfig;
}) {
  const isArabic = locale === "ar";
  const passportWarning = pickLocalized(
    cms.rules.passportValidityRequirement,
    locale,
  );

  return (
    <div
      className={`visum-service-page ${isArabic ? "" : visaDisplay.variable}`}
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Hero + trust benefits (desktop in-hero) */}
      <VisumServiceHero />

      {/* Infos + Touristen/Umrah → Formular — overlaps hero (reference) */}
      <div className="relative z-10 mt-0 px-2.5 pb-4 sm:px-6 md:-mt-12 md:pb-6 lg:-mt-14 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-x-clip overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_40px_rgba(11,44,74,0.07)] md:max-w-7xl xl:max-w-page">
          <VisumServiceInfo embedded initialCms={cms} />
          <div className="border-t border-line">
            <VisumServiceForm
              embedded
              passportValidityWarning={passportWarning}
            />
          </div>
        </div>
      </div>

      {/* Trust Elements */}
      <VisumServiceTrustBar />

      {/* SEO → Touristenvisum → Umrah → Einreise → FAQ → (then site Footer) */}
      <VisumServiceSeo locale={locale} cms={cms} />
    </div>
  );
}
