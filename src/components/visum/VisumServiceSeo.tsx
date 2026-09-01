import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pickLocalized, type VisumCmsConfig } from "@/data/visum-cms";
import { VisumRulesMetaBlocks } from "@/components/visum/VisumRulesMetaBlocks";
import { VisumSeoAccordion } from "@/components/visum/VisumSeoAccordion";
import { VisumSeoFaqSection } from "@/components/visum/VisumSeoFaqSection";
import { ReadableParagraphs } from "@/components/visum/VisumReadableParagraphs";
import {
  buildVisumBreadcrumbJsonLd,
  buildVisumFaqJsonLd,
  faqsEligibleForSchema,
  JsonLdScript,
  localizeFaqs,
} from "@/lib/visum-seo";
import { cn } from "@/lib/utils";

const TOPIC_ICONS = {
  tourist: "/brand/icons/visum-service/tourist.png",
  umrah: "/brand/icons/visum-service/umrah.png",
} as const;

/**
 * §41 — SEO / information ONLY below the screenshot-locked conversion UI.
 * Topics (Admin CMS): Saudi Arabia Visa → Tourist Visa → Umrah Visa → Entry Requirements.
 */
export async function VisumServiceSeo({
  locale,
  cms,
}: {
  locale: string;
  cms: VisumCmsConfig;
}) {
  const seo = cms.seo;
  if (!seo.enabled) return null;

  const t = await getTranslations({ locale, namespace: "visum" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const heading = pickLocalized(seo.heading, locale);
  const intro = pickLocalized(seo.intro, locale);
  const touristHeading = pickLocalized(seo.touristHeading, locale);
  const touristBody = pickLocalized(seo.touristBody, locale);
  const umrahHeading = pickLocalized(seo.umrahHeading, locale);
  const umrahBody = pickLocalized(seo.umrahBody, locale);
  const entryHeading = pickLocalized(seo.entryHeading, locale);
  const disclaimer = pickLocalized(seo.disclaimer, locale);
  const faqHeading = pickLocalized(seo.faqHeading, locale);
  const linksHeading = pickLocalized(seo.linksHeading, locale);

  const entryItems = seo.entryItems
    .map((item) => ({
      id: item.id,
      title: pickLocalized(item.title, locale),
      body: pickLocalized(item.body, locale),
    }))
    .filter((i) => i.title || i.body);

  const faqs = localizeFaqs(seo.faqs, locale);
  const schemaFaqs = faqsEligibleForSchema(faqs);

  const links = seo.links
    .map((item) => ({
      id: item.id,
      label: pickLocalized(item.label, locale),
      href: item.href,
    }))
    .filter((i) => i.label && i.href);

  const breadcrumbLd = buildVisumBreadcrumbJsonLd(locale, [
    { name: tNav("home"), path: "/" },
    { name: tNav("visa"), path: "/visum-service" },
  ]);
  const faqLd = buildVisumFaqJsonLd(schemaFaqs);

  const bodyClass =
    "text-[14px] leading-[1.75] text-navy/82 sm:text-[15px] md:text-[16px] md:leading-[1.85]";

  return (
    <>
      <JsonLdScript data={breadcrumbLd} />
      <JsonLdScript data={faqLd} />

      <section
        id="visum-informationen"
        aria-labelledby="visum-seo-heading"
        className="visum-seo-section relative overflow-hidden border-t border-[#dce6f0] bg-[#f3f7fb] px-2.5 py-14 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.92)_0%,transparent_58%),radial-gradient(ellipse_at_bottom_left,rgba(30,90,156,0.06)_0%,transparent_48%)]"
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-6xl md:max-w-7xl xl:max-w-page">
          {/* Editorial header */}
          <header className="mx-auto text-center">
            <p className="mb-3 inline-flex items-center rounded-full border border-[#c5d8f0]/90 bg-white/80 px-3.5 py-1 text-[10px] font-bold tracking-[0.16em] text-[#1e5a9c] uppercase shadow-[0_2px_8px_rgba(11,44,74,0.04)] backdrop-blur-sm sm:text-[11px]">
              {t("seoEyebrow")}
            </p>
            {heading ? (
              <h2
                id="visum-seo-heading"
                className="visum-display-font text-[1.45rem] font-bold leading-[1.15] tracking-[-0.02em] text-navy sm:text-[1.75rem] md:text-[2rem] lg:text-[2.15rem]"
              >
                {heading}
              </h2>
            ) : null}
            <div
              className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-brand-cta/70 to-transparent"
              aria-hidden
            />
          </header>

          {/* Lead intro */}
          {intro ? (
            <div className="mx-auto mt-8 w-full rounded-2xl border border-white/80 bg-white/90 px-5 py-5 shadow-[0_8px_32px_rgba(11,44,74,0.06)] backdrop-blur-sm sm:mt-10 sm:px-7 sm:py-6 md:mt-12">
              <ReadableParagraphs
                text={intro}
                className={`${bodyClass} text-[15px] sm:text-[16px]`}
              />
            </div>
          ) : null}

          {/* Topic accordions — tourist + umrah side by side on desktop */}
          <div className="mt-10 space-y-4 sm:mt-12 md:space-y-5">
            {touristHeading || umrahHeading ? (
              <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
                {touristHeading ? (
                  <VisumSeoAccordion
                    title={touristHeading}
                    iconSrc={TOPIC_ICONS.tourist}
                    accent="tourist"
                  >
                    {touristBody ? (
                      <ReadableParagraphs text={touristBody} className={bodyClass} />
                    ) : null}
                  </VisumSeoAccordion>
                ) : null}

                {umrahHeading ? (
                  <VisumSeoAccordion
                    title={umrahHeading}
                    iconSrc={TOPIC_ICONS.umrah}
                    accent="umrah"
                  >
                    {umrahBody ? (
                      <ReadableParagraphs text={umrahBody} className={bodyClass} />
                    ) : null}
                  </VisumSeoAccordion>
                ) : null}
              </div>
            ) : null}

            {entryHeading ? (
              <VisumSeoAccordion title={entryHeading} accent="entry">
                {entryItems.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    {entryItems.map((item, index) => (
                      <li
                        key={item.id}
                        className={cn(
                          "group relative overflow-hidden rounded-xl border border-[#dce6f0] bg-[#f7f9fc] p-4 transition duration-300",
                          "hover:border-[#c5d8f0] hover:bg-white hover:shadow-[0_6px_20px_rgba(11,44,74,0.06)]",
                          "sm:p-5",
                        )}
                      >
                        <div className="flex gap-3 sm:gap-3.5">
                          <span
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums sm:h-10 sm:w-10 sm:text-[12px]",
                              "bg-white text-navy ring-1 ring-[#dce6f0]",
                              "transition duration-300 group-hover:bg-[#e8f1fa] group-hover:text-[#1e5a9c] group-hover:ring-[#c5d8f0]",
                            )}
                            aria-hidden
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0 flex-1">
                            {item.title ? (
                              <h4 className="text-[14px] font-bold leading-snug text-navy sm:text-[15px]">
                                {item.title}
                              </h4>
                            ) : null}
                            {item.body ? (
                              <ReadableParagraphs
                                text={item.body}
                                className="mt-2 text-[13px] leading-[1.65] text-navy/78 sm:text-[14px] sm:leading-[1.7]"
                              />
                            ) : null}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {disclaimer ? (
                  <aside
                    className="mt-5 flex gap-3 rounded-xl border border-amber-200/90 bg-gradient-to-br from-amber-50/90 to-amber-50/40 px-4 py-4 sm:mt-6 sm:px-5 sm:py-4"
                    role="note"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100/80 text-amber-800">
                      <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden />
                    </span>
                    <ReadableParagraphs
                      text={disclaimer}
                      className="text-[13px] leading-[1.65] text-navy/88 sm:text-[14px]"
                    />
                  </aside>
                ) : null}

                <div className="mt-5 sm:mt-6">
                  <VisumRulesMetaBlocks rules={cms.rules} locale={locale} />
                </div>
              </VisumSeoAccordion>
            ) : (
              <>
                {disclaimer ? (
                  <aside
                    className="flex gap-3 rounded-xl border border-amber-200/90 bg-gradient-to-br from-amber-50/90 to-amber-50/40 px-4 py-4 sm:px-5"
                    role="note"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100/80 text-amber-800">
                      <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden />
                    </span>
                    <ReadableParagraphs
                      text={disclaimer}
                      className="text-[13px] leading-[1.65] text-navy/88 sm:text-[14px]"
                    />
                  </aside>
                ) : null}
                <VisumRulesMetaBlocks rules={cms.rules} locale={locale} />
              </>
            )}
          </div>

          {/* FAQ */}
          {faqs.length > 0 ? (
            <VisumSeoFaqSection
              heading={faqHeading || t("seoFaqEyebrow")}
              eyebrow={t("seoFaqEyebrow")}
              subtitle={t("seoFaqSubtitle")}
              items={faqs}
            />
          ) : null}

          {/* Internal links */}
          {links.length > 0 ? (
            <nav
              className="mt-10 rounded-2xl border border-[#dce6f0] bg-white/80 px-5 py-5 sm:mt-12 sm:px-6 sm:py-6"
              aria-label={linksHeading || "Internal links"}
            >
              {linksHeading ? (
                <p className="text-[12px] font-bold tracking-[0.08em] text-navy/70 uppercase sm:text-[13px]">
                  {linksHeading}
                </p>
              ) : null}
              <ul className="mt-3.5 flex flex-wrap gap-2 sm:gap-2.5">
                {links.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center rounded-full border border-[#dce6f0] bg-[#f7f9fc] px-3.5 py-1.5 text-[13px] font-semibold text-navy transition hover:border-brand-cta/40 hover:bg-white hover:text-brand-cta hover:shadow-[0_4px_14px_rgba(11,44,74,0.06)] sm:px-4 sm:py-2 sm:text-[14px]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </section>
    </>
  );
}
