import type { Locale } from "@/i18n/routing";
import { locales } from "@/i18n/routing";

export type LocalizedString = Record<Locale, string>;

function emptyLocalized(fallback = ""): LocalizedString {
  return Object.fromEntries(locales.map((l) => [l, fallback])) as LocalizedString;
}

function localizedFrom(
  values: Partial<LocalizedString> & { de: string },
): LocalizedString {
  return { ...emptyLocalized(values.de), ...values };
}

export type VisumEntryMode = "single" | "multiple" | "other";

/**
 * §38 — Structured visa regulations (data), not page design.
 * Edit in Admin when authorities change rules — no frontend code deploy.
 */
export type VisumVisaTypeRule = {
  id: string;
  enabled: boolean;
  /** Stable machine key (backend / analytics) */
  code: string;
  name: LocalizedString;
  purpose: LocalizedString;
  /** e.g. "1 Jahr" / "3 Monate" */
  validity: LocalizedString;
  /** e.g. "bis zu 90 Tage pro Einreise" */
  maxStay: LocalizedString;
  entryMode: VisumEntryMode;
  /** Display label for entry mode */
  entryLabel: LocalizedString;
};

export type VisumDocumentRule = {
  id: string;
  required: boolean;
  label: LocalizedString;
};

export type VisumNoticeRule = {
  id: string;
  severity: "info" | "warning";
  text: LocalizedString;
};

export type VisumRulesConfig = {
  /** Typical minimum passport validity at entry (months) — structured fact */
  passportMinValidityMonths: number;
  /** Human-readable passport rule (shown on site / form warning) */
  passportValidityRequirement: LocalizedString;
  /** Who may apply — summary text (eligibility is often nuanced) */
  eligibleNationalitiesSummary: LocalizedString;
  /** Optional explicit list (country names or ISO codes); empty = summary only */
  eligibleNationalities: string[];
  /** Section label for documents on the public page */
  documentsHeading: LocalizedString;
  /** Section label for eligibility on the public page */
  eligibilityHeading: LocalizedString;
  requiredDocuments: VisumDocumentRule[];
  notices: VisumNoticeRule[];
  visaTypes: VisumVisaTypeRule[];
};

export const DEFAULT_VISUM_RULES: VisumRulesConfig = {
  passportMinValidityMonths: 6,
  passportValidityRequirement: localizedFrom({
    de: "Für das touristische eVisa muss der verwendete Reisepass bei der Einreise nach Saudi-Arabien grundsätzlich noch mindestens sechs Monate gültig sein.",
    en: "For the tourist eVisa, the passport used must generally still be valid for at least six months upon entry into Saudi Arabia.",
    ar: "بالنسبة للتأشيرة السياحية الإلكترونية يجب أن يبقى جواز السفر المستخدم عادةً ساري المفعول لمدة ستة أشهر على الأقل عند الدخول إلى السعودية.",
    tr: "Turistik eVisa için kullanılan pasaportun Suudi Arabistan’a girişte genellikle en az altı ay daha geçerli olması gerekir.",
    bs: "Za turističku eVizuu korišteni pasoš pri ulasku u Saudijsku Arabiju u načelu mora biti još važeći najmanje šest mjeseci.",
  }),
  eligibleNationalitiesSummary: localizedFrom({
    de: "Die Visumberechtigung hängt von Nationalität, Reisepass und ggf. Aufenthaltsstatus ab. Wir prüfen Ihre Angaben individuell — ohne automatische Ablehnung im Formular.",
    en: "Visa eligibility depends on nationality, passport and residence status where applicable. We review your details individually — the form does not auto-reject anyone.",
    ar: "يعتمد أهلية التأشيرة على الجنسية وجواز السفر ووضع الإقامة إن وُجد. نراجع بياناتكم فردياً — دون رفض تلقائي في النموذج.",
    tr: "Vize uygunluğu uyruğa, pasaporta ve varsa ikamet durumuna bağlıdır. Bilgilerinizi bireysel inceleriz — form kimseyi otomatik reddetmez.",
    bs: "Pravo na vizu zavisi od državljanstva, pasoša i statusa boravka gdje je primjenjivo. Individualno pregledamo podatke — obrazac nikoga ne odbija automatski.",
  }),
  eligibleNationalities: [],
  documentsHeading: localizedFrom({
    de: "Erforderliche Unterlagen",
    en: "Required documents",
    ar: "المستندات المطلوبة",
    tr: "Gerekli belgeler",
    bs: "Potrebna dokumenta",
  }),
  eligibilityHeading: localizedFrom({
    de: "Berechtigte Nationalitäten",
    en: "Eligible nationalities",
    ar: "الجنسيات المؤهلة",
    tr: "Uygun uyruklar",
    bs: "Prihvatljiva državljanstva",
  }),
  requiredDocuments: [
    {
      id: "doc-passport",
      required: true,
      label: localizedFrom({
        de: "Gültiger Reisepass",
        en: "Valid passport",
        ar: "جواز سفر ساري",
        tr: "Geçerli pasaport",
        bs: "Važeći pasoš",
      }),
    },
    {
      id: "doc-photo",
      required: true,
      label: localizedFrom({
        de: "Passfoto",
        en: "Passport photo",
        ar: "صورة جواز",
        tr: "Vesikalık fotoğraf",
        bs: "Fotografija za pasoš",
      }),
    },
    {
      id: "doc-form",
      required: true,
      label: localizedFrom({
        de: "Angaben aus dem Anfrageformular",
        en: "Details from the enquiry form",
        ar: "بيانات نموذج الطلب",
        tr: "Talep formundaki bilgiler",
        bs: "Podaci iz obrasca upita",
      }),
    },
  ],
  notices: [
    {
      id: "notice-changes",
      severity: "warning",
      text: localizedFrom({
        de: "Visabestimmungen können sich kurzfristig ändern. Maßgeblich sind die aktuellen Vorgaben der saudischen Behörden und Ihre persönliche Situation.",
        en: "Visa regulations can change at short notice. The current rules of the Saudi authorities and your personal situation are decisive.",
        ar: "قد تتغيّر أحكام التأشيرات على المدى القصير. المرجع هو المتطلبات الحالية للسلطات السعودية ووضعكم الشخصي.",
        tr: "Vize düzenlemeleri kısa sürede değişebilir. Esas olan Suudi makamlarının güncel kuralları ve kişisel durumunuzdur.",
        bs: "Propisi o vizama mogu se kratkoročno mijenjati. Mjerodavni su aktuelni zahtjevi saudijskih tijela i vaša lična situacija.",
      }),
    },
    {
      id: "notice-entry",
      severity: "info",
      text: localizedFrom({
        de: "Ein ausgestelltes Visum garantiert die Einreise nicht automatisch.",
        en: "An issued visa does not automatically guarantee entry.",
        ar: "التأشيرة الصادرة لا تضمن الدخول تلقائياً.",
        tr: "Düzenlenmiş bir vize girişi otomatik olarak garanti etmez.",
        bs: "Izdata viza ne garantuje ulazak automatski.",
      }),
    },
  ],
  visaTypes: [
    {
      id: "tourist",
      enabled: true,
      code: "tourist_evisa",
      name: localizedFrom({
        de: "Touristen Visum",
        en: "Tourist visa",
        ar: "تأشيرة سياحية",
        tr: "Turist vizesi",
        bs: "Turistička viza",
      }),
      purpose: localizedFrom({
        de: "Für touristische Zwecke, Urlaub und Familienbesuch",
        en: "For tourism, holidays and family visits",
        ar: "لأغراض سياحية والعطلات وزيارة العائلة",
        tr: "Turizm, tatil ve aile ziyareti için",
        bs: "Za turističke svrhe, odmor i porodične posjete",
      }),
      validity: localizedFrom({
        de: "1 Jahr",
        en: "1 year",
        ar: "سنة واحدة",
        tr: "1 yıl",
        bs: "1 godina",
      }),
      maxStay: localizedFrom({
        de: "bis zu 90 Tage pro Einreise",
        en: "up to 90 days per entry",
        ar: "حتى 90 يوماً لكل دخول",
        tr: "giriş başına 90 güne kadar",
        bs: "do 90 dana po ulasku",
      }),
      entryMode: "multiple",
      entryLabel: localizedFrom({
        de: "Mehrfacheinreise möglich",
        en: "Multiple entries possible",
        ar: "الدخول المتعدد ممكن",
        tr: "Çoklu giriş mümkün",
        bs: "Višestruki ulazak moguć",
      }),
    },
    {
      id: "umrah",
      enabled: true,
      code: "umrah_visa",
      name: localizedFrom({
        de: "Umrah Visum",
        en: "Umrah visa",
        ar: "تأشيرة عمرة",
        tr: "Umre vizesi",
        bs: "Umrah viza",
      }),
      purpose: localizedFrom({
        de: "Speziell für die Umrah Reise",
        en: "Specifically for Umrah travel",
        ar: "مخصصة لرحلة العمرة",
        tr: "Özellikle Umre seyahati için",
        bs: "Posebno za Umrah putovanje",
      }),
      validity: localizedFrom({
        de: "3 Monate",
        en: "3 months",
        ar: "3 أشهر",
        tr: "3 ay",
        bs: "3 mjeseca",
      }),
      maxStay: localizedFrom({
        de: "bis zu 90 Tage",
        en: "up to 90 days",
        ar: "حتى 90 يوماً",
        tr: "90 güne kadar",
        bs: "do 90 dana",
      }),
      entryMode: "single",
      entryLabel: localizedFrom({
        de: "Einreise einmalig",
        en: "Single entry",
        ar: "دخول لمرة واحدة",
        tr: "Tek giriş",
        bs: "Jednokratni ulazak",
      }),
    },
  ],
};

/** Labels for composing card bullets from structured rules (UI chrome, not regulation facts). */
const RULE_LABELS = {
  validity: localizedFrom({
    de: "Gültigkeit",
    en: "Validity",
    ar: "الصلاحية",
    tr: "Geçerlilik",
    bs: "Važenje",
  }),
  stay: localizedFrom({
    de: "Aufenthalt",
    en: "Stay",
    ar: "الإقامة",
    tr: "Kalış",
    bs: "Boravak",
  }),
};

export function pickLocalizedRule(
  value: LocalizedString | undefined,
  locale: string,
  fallback = "",
): string {
  if (!value) return fallback;
  const loc = locale as Locale;
  return (value[loc] || value.de || fallback).trim();
}

/** Bullet lines for a visa type card — derived from rules data, not hard-coded in React. */
export function visaTypeRuleBullets(
  type: VisumVisaTypeRule,
  locale: string,
): string[] {
  const purpose = pickLocalizedRule(type.purpose, locale);
  const validity = pickLocalizedRule(type.validity, locale);
  const maxStay = pickLocalizedRule(type.maxStay, locale);
  const entry = pickLocalizedRule(type.entryLabel, locale);
  const validityPrefix = pickLocalizedRule(RULE_LABELS.validity, locale);
  const stayPrefix = pickLocalizedRule(RULE_LABELS.stay, locale);

  const lines: string[] = [];
  if (purpose) lines.push(purpose);
  if (validity) lines.push(`${validityPrefix}: ${validity}`);
  if (maxStay) lines.push(`${stayPrefix} ${maxStay}`);
  if (entry) lines.push(entry);
  return lines;
}

export function findVisaTypeRule(
  rules: VisumRulesConfig,
  id: string,
): VisumVisaTypeRule | undefined {
  return rules.visaTypes.find((t) => t.id === id);
}

export function createEmptyVisaTypeRule(): VisumVisaTypeRule {
  const id = `visa-${Date.now()}`;
  return {
    id,
    enabled: true,
    code: id,
    name: emptyLocalized(),
    purpose: emptyLocalized(),
    validity: emptyLocalized(),
    maxStay: emptyLocalized(),
    entryMode: "other",
    entryLabel: emptyLocalized(),
  };
}

export function createEmptyDocumentRule(): VisumDocumentRule {
  return {
    id: `doc-${Date.now()}`,
    required: true,
    label: emptyLocalized(),
  };
}

export function createEmptyNoticeRule(): VisumNoticeRule {
  return {
    id: `notice-${Date.now()}`,
    severity: "info",
    text: emptyLocalized(),
  };
}
