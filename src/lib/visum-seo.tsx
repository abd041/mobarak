import type { VisumCmsFaqItem } from "@/data/visum-cms";
import { pickLocalized } from "@/data/visum-cms";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";

export type VisumFaqForDisplay = {
  id: string;
  question: string;
  answer: string;
};

/**
 * Google FAQPage: only include Q&A pairs that are fully visible on the page
 * (non-empty question + answer). Never emit schema for incomplete CMS rows.
 */
export function faqsEligibleForSchema(
  faqs: VisumFaqForDisplay[],
): VisumFaqForDisplay[] {
  return faqs.filter(
    (f) => f.question.trim().length > 0 && f.answer.trim().length > 0,
  );
}

export function localizeFaqs(
  items: VisumCmsFaqItem[],
  locale: string,
): VisumFaqForDisplay[] {
  return items
    .map((item) => ({
      id: item.id,
      question: pickLocalized(item.question, locale),
      answer: pickLocalized(item.answer, locale),
    }))
    .filter((i) => i.question || i.answer);
}

export function buildVisumFaqJsonLd(faqs: VisumFaqForDisplay[]) {
  const eligible = faqsEligibleForSchema(faqs);
  if (eligible.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: eligible.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildVisumBreadcrumbJsonLd(
  locale: string,
  crumbs: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(locale, crumb.path),
    })),
  };
}

/** WebPage + Service hints for the visa landing page. */
export function buildVisumWebPageJsonLd(input: {
  locale: string;
  title: string;
  description: string;
  path?: string;
}) {
  const path = input.path ?? "/visum-service";
  const url = absoluteUrl(input.locale, path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.title,
    description: input.description,
    url,
    inLanguage: input.locale === "ar" ? "ar" : input.locale,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function JsonLdScript({ data }: { data: object | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

