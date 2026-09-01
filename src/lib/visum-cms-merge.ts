import {
  DEFAULT_VISUM_CMS,
  type LocalizedString,
  type VisumCmsCard,
  type VisumCmsConfig,
  type VisumCmsEntryItem,
  type VisumCmsFaqItem,
  type VisumCmsInternalLink,
  type VisumCmsSeo,
} from "@/data/visum-cms";
import {
  DEFAULT_VISUM_RULES,
  type VisumDocumentRule,
  type VisumNoticeRule,
  type VisumRulesConfig,
  type VisumVisaTypeRule,
} from "@/data/visum-rules";
import { locales } from "@/i18n/routing";

function emptyLocalized(): LocalizedString {
  return Object.fromEntries(locales.map((l) => [l, ""])) as LocalizedString;
}

function mergeLocalized(
  base: LocalizedString,
  override?: Partial<LocalizedString>,
): LocalizedString {
  return { ...base, ...(override ?? {}) };
}

function mergeCard(base: VisumCmsCard, override?: Partial<VisumCmsCard>): VisumCmsCard {
  if (!override) {
    return {
      ...base,
      points: base.points ?? [],
      extraPoints: base.extraPoints ?? [],
      showRulesOnCard: base.showRulesOnCard !== false,
    };
  }
  const points =
    override.points && override.points.length > 0
      ? override.points.map((p, i) =>
          mergeLocalized(base.points[i] ?? emptyLocalized(), p),
        )
      : (base.points ?? []);
  const extraPoints =
    override.extraPoints !== undefined
      ? override.extraPoints.map((p, i) =>
          mergeLocalized((base.extraPoints ?? [])[i] ?? emptyLocalized(), p),
        )
      : (base.extraPoints ?? []);
  return {
    ...base,
    ...override,
    title: mergeLocalized(base.title, override.title),
    footer: mergeLocalized(base.footer, override.footer),
    points,
    extraPoints,
    showRulesOnCard: override.showRulesOnCard ?? base.showRulesOnCard !== false,
  };
}

function mergeEntryItem(
  base: VisumCmsEntryItem | undefined,
  override: Partial<VisumCmsEntryItem>,
): VisumCmsEntryItem {
  return {
    id: override.id ?? base?.id ?? `entry-${Date.now()}`,
    title: mergeLocalized(base?.title ?? emptyLocalized(), override.title),
    body: mergeLocalized(base?.body ?? emptyLocalized(), override.body),
  };
}

function mergeFaqItem(
  base: VisumCmsFaqItem | undefined,
  override: Partial<VisumCmsFaqItem>,
): VisumCmsFaqItem {
  return {
    id: override.id ?? base?.id ?? `faq-${Date.now()}`,
    question: mergeLocalized(base?.question ?? emptyLocalized(), override.question),
    answer: mergeLocalized(base?.answer ?? emptyLocalized(), override.answer),
  };
}

function mergeLink(
  base: VisumCmsInternalLink | undefined,
  override: Partial<VisumCmsInternalLink>,
): VisumCmsInternalLink {
  return {
    id: override.id ?? base?.id ?? `link-${Date.now()}`,
    href: override.href ?? base?.href ?? "/",
    label: mergeLocalized(base?.label ?? emptyLocalized(), override.label),
  };
}

function mergeSeo(base: VisumCmsSeo, override?: Partial<VisumCmsSeo>): VisumCmsSeo {
  if (!override) return base;

  const entryItems =
    override.entryItems && override.entryItems.length > 0
      ? override.entryItems.map((item, i) => mergeEntryItem(base.entryItems[i], item))
      : base.entryItems;

  const faqs =
    override.faqs && override.faqs.length > 0
      ? override.faqs.map((item, i) => mergeFaqItem(base.faqs[i], item))
      : base.faqs;

  const links =
    override.links && override.links.length > 0
      ? override.links.map((item, i) => mergeLink(base.links[i], item))
      : base.links;

  return {
    ...base,
    ...override,
    metaTitle: mergeLocalized(base.metaTitle, override.metaTitle),
    metaDescription: mergeLocalized(base.metaDescription, override.metaDescription),
    heading: mergeLocalized(base.heading, override.heading),
    intro: mergeLocalized(base.intro, override.intro),
    touristHeading: mergeLocalized(base.touristHeading, override.touristHeading),
    touristBody: mergeLocalized(base.touristBody, override.touristBody),
    umrahHeading: mergeLocalized(base.umrahHeading, override.umrahHeading),
    umrahBody: mergeLocalized(base.umrahBody, override.umrahBody),
    entryHeading: mergeLocalized(base.entryHeading, override.entryHeading),
    entryItems,
    disclaimer: mergeLocalized(base.disclaimer, override.disclaimer),
    faqHeading: mergeLocalized(base.faqHeading, override.faqHeading),
    faqs,
    linksHeading: mergeLocalized(base.linksHeading, override.linksHeading),
    links,
  };
}

function mergeVisaType(
  base: VisumVisaTypeRule | undefined,
  override: Partial<VisumVisaTypeRule>,
): VisumVisaTypeRule {
  const fallback = base ?? DEFAULT_VISUM_RULES.visaTypes[0];
  return {
    id: override.id ?? fallback.id,
    enabled: override.enabled ?? fallback.enabled,
    code: override.code ?? fallback.code,
    name: mergeLocalized(fallback.name, override.name),
    purpose: mergeLocalized(fallback.purpose, override.purpose),
    validity: mergeLocalized(fallback.validity, override.validity),
    maxStay: mergeLocalized(fallback.maxStay, override.maxStay),
    entryMode: override.entryMode ?? fallback.entryMode,
    entryLabel: mergeLocalized(fallback.entryLabel, override.entryLabel),
  };
}

function mergeDocument(
  base: VisumDocumentRule | undefined,
  override: Partial<VisumDocumentRule>,
): VisumDocumentRule {
  return {
    id: override.id ?? base?.id ?? `doc-${Date.now()}`,
    required: override.required ?? base?.required ?? true,
    label: mergeLocalized(base?.label ?? emptyLocalized(), override.label),
  };
}

function mergeNotice(
  base: VisumNoticeRule | undefined,
  override: Partial<VisumNoticeRule>,
): VisumNoticeRule {
  return {
    id: override.id ?? base?.id ?? `notice-${Date.now()}`,
    severity: override.severity ?? base?.severity ?? "info",
    text: mergeLocalized(base?.text ?? emptyLocalized(), override.text),
  };
}

function mergeRules(
  base: VisumRulesConfig,
  override?: Partial<VisumRulesConfig>,
): VisumRulesConfig {
  if (!override) return base;

  const visaTypes =
    override.visaTypes && override.visaTypes.length > 0
      ? override.visaTypes.map((item, i) => mergeVisaType(base.visaTypes[i], item))
      : base.visaTypes;

  const requiredDocuments =
    override.requiredDocuments && override.requiredDocuments.length > 0
      ? override.requiredDocuments.map((item, i) =>
          mergeDocument(base.requiredDocuments[i], item),
        )
      : base.requiredDocuments;

  const notices =
    override.notices && override.notices.length > 0
      ? override.notices.map((item, i) => mergeNotice(base.notices[i], item))
      : base.notices;

  return {
    ...base,
    ...override,
    passportMinValidityMonths:
      override.passportMinValidityMonths ?? base.passportMinValidityMonths,
    passportValidityRequirement: mergeLocalized(
      base.passportValidityRequirement,
      override.passportValidityRequirement,
    ),
    eligibleNationalitiesSummary: mergeLocalized(
      base.eligibleNationalitiesSummary,
      override.eligibleNationalitiesSummary,
    ),
    eligibleNationalities:
      override.eligibleNationalities ?? base.eligibleNationalities,
    documentsHeading: mergeLocalized(
      base.documentsHeading,
      override.documentsHeading,
    ),
    eligibilityHeading: mergeLocalized(
      base.eligibilityHeading,
      override.eligibilityHeading,
    ),
    requiredDocuments,
    notices,
    visaTypes,
  };
}

/** Deep-merge a partial override onto defaults (safe for older saved shapes). */
export function mergeVisumCmsConfig(parsed: Partial<VisumCmsConfig>): VisumCmsConfig {
  return {
    sectionTitle: mergeLocalized(DEFAULT_VISUM_CMS.sectionTitle, parsed.sectionTitle),
    tourist: mergeCard(DEFAULT_VISUM_CMS.tourist, parsed.tourist),
    umrah: mergeCard(DEFAULT_VISUM_CMS.umrah, parsed.umrah),
    seo: mergeSeo(DEFAULT_VISUM_CMS.seo, parsed.seo),
    rules: mergeRules(DEFAULT_VISUM_RULES, parsed.rules),
  };
}
