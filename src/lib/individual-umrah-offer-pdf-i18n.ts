/**
 * Customer-facing Individual Umrah offer PDF copy / localization strings.
 *
 * Templates (offer_template_de|ar|en|tr|bs) are assembled in
 * `individual-umrah-offer-pdf-templates.ts` from this content.
 * The shared renderer is `IndividualUmrahOfferDocument` only.
 *
 * Default language = inquiry.customer_language.
 * Optional Admin override = offer.pdfLanguageOverride (never Admin UI language).
 *
 * Spec 14: this module formats presentation only. It must not recalculate prices,
 * change passenger counts, or shift calendar dates — only translate labels and
 * month names (Gregorian + Latin digits).
 */
import type { Locale } from "@/i18n/routing";
import { isRtl } from "@/i18n/routing";
import {
  isIndividualUmrahCustomerLanguage,
  resolveCustomerLanguage,
  type IndividualUmrahInquiry,
} from "@/lib/individual-umrah-inquiry";
import type { IndividualUmrahOffer } from "@/lib/individual-umrah-offer";
import {
  isOfferExcludedTermCode,
  isOfferIncludedTermCode,
  isOfferNoteTermCode,
  labelExcludedTerm,
  labelIncludedTerm,
  labelNoteTerm,
  labelOfferBaggageSpec,
  labelOfferMealPlan,
  labelOfferRoomType,
  resolveMealPlanCodeFromLabel,
  type OfferBaggageSpec,
  type OfferMealPlanCode,
  type OfferRoomTypeCode,
} from "@/lib/individual-umrah-offer-codes";

export type OfferPdfLocale = Locale;

/**
 * Effective PDF language: Admin override if set, else inquiry.customer_language.
 * Spec 18: this is **customer-facing only** — never the Admin UI language.
 */
export function resolveOfferPdfLocale(
  inquiry: IndividualUmrahInquiry,
  offer?: Pick<IndividualUmrahOffer, "pdfLanguageOverride"> | null,
): OfferPdfLocale {
  const override = offer?.pdfLanguageOverride;
  if (override && isIndividualUmrahCustomerLanguage(override)) {
    return override;
  }
  return resolveCustomerLanguage(inquiry);
}

/** True when Admin has set a manual PDF language different from auto. */
export function hasOfferPdfLanguageOverride(
  offer?: Pick<IndividualUmrahOffer, "pdfLanguageOverride"> | null,
): boolean {
  return Boolean(
    offer?.pdfLanguageOverride &&
      isIndividualUmrahCustomerLanguage(offer.pdfLanguageOverride),
  );
}

/**
 * Intl locale for PDF chrome (month names, etc.).
 * Spec 14: always Gregorian calendar + Latin digits — never change the underlying
 * date/number values when switching offer language.
 */
export function offerPdfIntlLocale(lang: OfferPdfLocale): string {
  if (lang === "de") return "de-AT-u-ca-gregory-nu-latn";
  if (lang === "ar") return "ar-SA-u-ca-gregory-nu-latn";
  if (lang === "tr") return "tr-TR-u-ca-gregory-nu-latn";
  if (lang === "bs") return "bs-BA-u-ca-gregory-nu-latn";
  return "en-GB-u-ca-gregory-nu-latn";
}

export function offerPdfIsRtl(lang: OfferPdfLocale): boolean {
  return isRtl(lang);
}

export type OfferPdfCopy = {
  heroTitleLine1: string;
  heroTitleLine2: string;
  greeting: (name: string) => string;
  intro: string;
  pricesInEuro: string;
  offerNumber: string;
  createdOn: string;
  travelStart: string;
  flexibility: string;
  travelSummaryAria: string;
  offerMetaAria: string;
  airports: string;
  travellers: string;
  route: string;
  nights: string;
  travelStartSummary: string;
  adultOne: string;
  adultMany: string;
  childOne: string;
  childMany: string;
  infantOne: string;
  infantMany: string;
  roomOne: string;
  roomMany: string;
  nightMedinaOne: string;
  nightMedinaMany: string;
  nightMakkahOne: string;
  nightMakkahMany: string;
  routeMakkahOnly: string;
  routeMakkahFirst: string;
  routeMedinaFirst: string;
  flexUnspecified: string;
  flexExact: string;
  flexDays: (n: number) => string;
  airportVIE: string;
  airportSZG: string;
  airportMUC: string;
  airportBUD: string;
  alternativesTitle: string;
  alternativesBody: string;
  flightsTitle: string;
  flightsSubtitle: string;
  colAirline: string;
  colOutbound: string;
  colReturn: string;
  colBaggage: string;
  colDuration: string;
  colPricePerPerson: string;
  perPerson: string;
  flightSeatNote: string;
  directFlight: string;
  /** e.g. „1 Stopp“ / „2 Stopps“ */
  stops: (count: number) => string;
  connection: (place: string, wait: string) => string;
  duration: (d: string) => string;
  /** Stock word in baggage lines, e.g. Freigepäck */
  checkedBaggageWord: string;
  /** Stock word in baggage lines, e.g. Handgepäck */
  handBaggageWord: string;
  accommodationMedina: (nights: number) => string;
  accommodationMakkah: (nights: number) => string;
  hotelAlternatives: string;
  hotelAlternativesWithDates: (dates: string) => string;
  distanceHaram: (meters: number) => string;
  missingRate: string;
  roomN: (n: number) => string;
  roomsTotal: (n: number) => string;
  pricingIncomplete: string;
  avgPerPerson: string;
  board: string;
  breakfast: string;
  /** Included breakfast line on hotel cards, e.g. „Frühstück inklusive“. */
  breakfastIncluded: string;
  breakfastOptional: string;
  halfBoard: string;
  fullBoard: string;
  roomOnly: string;
  allInclusive: string;
  lunch: string;
  dinner: string;
  mealPerPersonNight: (euro: string) => string;
  addonsTitle: string;
  optional: string;
  includedTitle: string;
  excludedTitle: string;
  notesTitle: string;
  footerTitle: string;
  starsAria: (n: number) => string;
  erwAbbrev: string;
  kindAbbrev: string;
  missingRateForHotel: (hotelName: string, dateLabel: string) => string;
};

const DE: OfferPdfCopy = {
  heroTitleLine1: "Ihr individuelles",
  heroTitleLine2: "Umrah Angebot",
  greeting: (name) => `Sehr geehrter Herr / Sehr geehrte Frau ${name},`,
  intro:
    "vielen Dank für Ihre Anfrage. Gerne unterbreiten wir Ihnen nachfolgend ein individuelles Angebot für Ihre Umrah Reise.",
  pricesInEuro: "Alle Preise sind in Euro angegeben.",
  offerNumber: "Angebots-Nr.",
  createdOn: "Erstellt am",
  travelStart: "Reisebeginn",
  flexibility: "Flexibilität",
  travelSummaryAria: "Reiseübersicht",
  offerMetaAria: "Angebotsdaten",
  airports: "Abflughäfen",
  travellers: "Reisende",
  route: "Reiseverlauf",
  nights: "Nächte",
  travelStartSummary: "Reisebeginn",
  adultOne: "Erwachsener",
  adultMany: "Erwachsene",
  childOne: "Kind",
  childMany: "Kinder",
  infantOne: "Baby",
  infantMany: "Babys",
  roomOne: "Zimmer",
  roomMany: "Zimmer",
  nightMedinaOne: "Nacht Medina",
  nightMedinaMany: "Nächte Medina",
  nightMakkahOne: "Nacht Makkah",
  nightMakkahMany: "Nächte Makkah",
  routeMakkahOnly: "Nur Makkah",
  routeMakkahFirst: "Zuerst Makkah, dann Medina",
  routeMedinaFirst: "Zuerst Medina, dann Makkah",
  flexUnspecified: "Nicht angegeben",
  flexExact: "Exaktes Datum",
  flexDays: (n) => `± ${n} ${n === 1 ? "Tag" : "Tage"}`,
  airportVIE: "Wien (VIE)",
  airportSZG: "Salzburg (SZG)",
  airportMUC: "München (MUC)",
  airportBUD: "Budapest (BUD)",
  alternativesTitle: "Alternativen zur Auswahl:",
  alternativesBody:
    "Die folgenden Flüge und Hotels sind voneinander unabhängige Optionen. Bitte wählen Sie jeweils eine Variante — die Preise werden nicht automatisch zu einem Gesamtpaket addiert.",
  flightsTitle: "Flugangebote (Hin- und Rückflug)",
  flightsSubtitle: "Mehrere Alternativen — bitte eine Flugoption wählen",
  colAirline: "Airline",
  colOutbound: "Hinflug",
  colReturn: "Rückflug",
  colBaggage: "Gepäck",
  colDuration: "Gesamtdauer",
  colPricePerPerson: "Preis pro Person",
  perPerson: "pro Person",
  flightSeatNote:
    "Sitzplatzreservierung und Mahlzeiten richten sich nach den Bedingungen der jeweiligen Airline.",
  directFlight: "Direktflug",
  stops: (n) => (n === 1 ? "1 Stopp" : `${n} Stopps`),
  connection: (place, wait) => `Umstieg ${place}${wait}`,
  duration: (d) => `Dauer ${d}`,
  checkedBaggageWord: "Freigepäck",
  handBaggageWord: "Handgepäck",
  accommodationMedina: (n) => `Unterkunft in Medina (${n} ${n === 1 ? "Nacht" : "Nächte"})`,
  accommodationMakkah: (n) => `Unterkunft in Makkah (${n} ${n === 1 ? "Nacht" : "Nächte"})`,
  hotelAlternatives: "Alternativen zur Auswahl (eine Hoteloption)",
  hotelAlternativesWithDates: (dates) => `${dates} · Alternativen zur Auswahl (eine Hoteloption)`,
  distanceHaram: (m) => `Entfernung zum Haram: ca. ${m} m`,
  missingRate: "Fehlende Rate",
  roomN: (n) => `Zimmer ${n}`,
  roomsTotal: (n) => `Gesamtpreis für ${n} Zimmer`,
  pricingIncomplete: "Preis unvollständig — PDF erst nach Raten oder manuellem Override.",
  avgPerPerson: "Durchschnitt pro Person",
  board: "Verpflegung:",
  breakfast: "Frühstück",
  breakfastIncluded: "Frühstück inklusive",
  breakfastOptional: "Frühstück (optional)",
  halfBoard: "Halbpension",
  fullBoard: "Vollpension",
  roomOnly: "Nur Übernachtung",
  allInclusive: "All Inclusive",
  lunch: "Mittagessen",
  dinner: "Abendessen",
  mealPerPersonNight: (euro) => `${euro} pro Person / Nacht`,
  addonsTitle: "Zusätzliche Leistungen (Optional)",
  optional: "Optional",
  includedTitle: "Im Preis enthalten",
  excludedTitle: "Nicht inkludiert",
  notesTitle: "Wichtige Hinweise",
  footerTitle: "Wir sind für Sie da",
  starsAria: (n) => `${n} Sterne`,
  erwAbbrev: "Erw.",
  kindAbbrev: "Kind.",
  missingRateForHotel: (hotel, date) => `Keine Rate verfügbar für ${hotel} am ${date}.`,
};

const EN: OfferPdfCopy = {
  heroTitleLine1: "Your personalised",
  heroTitleLine2: "Umrah offer",
  greeting: (name) => `Dear Mr / Ms ${name},`,
  intro:
    "Thank you for your enquiry. Please find below a personalised offer for your Umrah journey.",
  pricesInEuro: "All prices are quoted in Euro.",
  offerNumber: "Offer no.",
  createdOn: "Created on",
  travelStart: "Travel start",
  flexibility: "Flexibility",
  travelSummaryAria: "Travel overview",
  offerMetaAria: "Offer details",
  airports: "Departure airports",
  travellers: "Travellers",
  route: "Itinerary",
  nights: "Nights",
  travelStartSummary: "Travel start",
  adultOne: "adult",
  adultMany: "adults",
  childOne: "child",
  childMany: "children",
  infantOne: "infant",
  infantMany: "infants",
  roomOne: "room",
  roomMany: "rooms",
  nightMedinaOne: "night in Medina",
  nightMedinaMany: "nights in Medina",
  nightMakkahOne: "night in Makkah",
  nightMakkahMany: "nights in Makkah",
  routeMakkahOnly: "Makkah only",
  routeMakkahFirst: "Makkah first, then Medina",
  routeMedinaFirst: "Medina first, then Makkah",
  flexUnspecified: "Not specified",
  flexExact: "Exact date",
  flexDays: (n) => `± ${n} ${n === 1 ? "day" : "days"}`,
  airportVIE: "Vienna (VIE)",
  airportSZG: "Salzburg (SZG)",
  airportMUC: "Munich (MUC)",
  airportBUD: "Budapest (BUD)",
  alternativesTitle: "Options to choose from:",
  alternativesBody:
    "The flights and hotels below are independent alternatives. Please select one option each — prices are not automatically added into a package total.",
  flightsTitle: "Flight offers (outbound & return)",
  flightsSubtitle: "Several alternatives — please choose one flight option",
  colAirline: "Airline",
  colOutbound: "Outbound",
  colReturn: "Return",
  colBaggage: "Baggage",
  colDuration: "Total duration",
  colPricePerPerson: "Price per person",
  perPerson: "per person",
  flightSeatNote:
    "Seat reservation and meals are subject to the conditions of the respective airline.",
  directFlight: "Direct flight",
  stops: (n) => (n === 1 ? "1 stop" : `${n} stops`),
  connection: (place, wait) => `Connection ${place}${wait}`,
  duration: (d) => `Duration ${d}`,
  checkedBaggageWord: "checked baggage",
  handBaggageWord: "hand baggage",
  accommodationMedina: (n) => `Accommodation in Medina (${n} ${n === 1 ? "night" : "nights"})`,
  accommodationMakkah: (n) => `Accommodation in Makkah (${n} ${n === 1 ? "night" : "nights"})`,
  hotelAlternatives: "Alternatives to choose from (one hotel option)",
  hotelAlternativesWithDates: (dates) =>
    `${dates} · Alternatives to choose from (one hotel option)`,
  distanceHaram: (m) => `Distance to the Haram: approx. ${m} m`,
  missingRate: "Missing rate",
  roomN: (n) => `Room ${n}`,
  roomsTotal: (n) => `Total for ${n} rooms`,
  pricingIncomplete: "Price incomplete — finalise rates or set a manual override before PDF.",
  avgPerPerson: "Average per person",
  board: "Board:",
  breakfast: "Breakfast",
  breakfastIncluded: "Breakfast included",
  breakfastOptional: "Breakfast (optional)",
  halfBoard: "Half board",
  fullBoard: "Full board",
  roomOnly: "Room only",
  allInclusive: "All inclusive",
  lunch: "Lunch",
  dinner: "Dinner",
  mealPerPersonNight: (euro) => `${euro} per person / night`,
  addonsTitle: "Additional services (optional)",
  optional: "Optional",
  includedTitle: "Included in the price",
  excludedTitle: "Not included",
  notesTitle: "Important notes",
  footerTitle: "We are here for you",
  starsAria: (n) => `${n} stars`,
  erwAbbrev: "ad.",
  kindAbbrev: "ch.",
  missingRateForHotel: (hotel, date) => `No rate available for ${hotel} on ${date}.`,
};

const AR: OfferPdfCopy = {
  heroTitleLine1: "عرضكم الشخصي لـ",
  heroTitleLine2: "العمرة",
  greeting: (name) => `السلام عليكم ورحمة الله، السيد/ة ${name}،`,
  intro:
    "شكرًا لاستفساركم. يسعدنا أن نقدّم لكم أدناه عرضًا شخصيًا لرحلة العمرة.",
  pricesInEuro: "جميع الأسعار باليورو.",
  offerNumber: "رقم العرض",
  createdOn: "تاريخ الإنشاء",
  travelStart: "بداية الرحلة",
  flexibility: "المرونة",
  travelSummaryAria: "ملخص الرحلة",
  offerMetaAria: "بيانات العرض",
  airports: "مطارات المغادرة",
  travellers: "المسافرون",
  route: "مسار الرحلة",
  nights: "الليالي",
  travelStartSummary: "بداية الرحلة",
  adultOne: "بالغ",
  adultMany: "بالغون",
  childOne: "طفل",
  childMany: "أطفال",
  infantOne: "رضيع",
  infantMany: "رضّع",
  roomOne: "غرفة",
  roomMany: "غرف",
  nightMedinaOne: "ليلة في المدينة",
  nightMedinaMany: "ليالٍ في المدينة",
  nightMakkahOne: "ليلة في مكة",
  nightMakkahMany: "ليالٍ في مكة",
  routeMakkahOnly: "مكة فقط",
  routeMakkahFirst: "مكة أولًا ثم المدينة",
  routeMedinaFirst: "المدينة أولًا ثم مكة",
  flexUnspecified: "غير محدد",
  flexExact: "تاريخ دقيق",
  flexDays: (n) => `± ${n} ${n === 1 ? "يوم" : "أيام"}`,
  airportVIE: "فيينا (VIE)",
  airportSZG: "سالزبورغ (SZG)",
  airportMUC: "ميونخ (MUC)",
  airportBUD: "بودابست (BUD)",
  alternativesTitle: "خيارات للاختيار:",
  alternativesBody:
    "الرحلات والفنادق أدناه خيارات مستقلة. يُرجى اختيار خيار واحد لكل قسم — لا تُجمع الأسعار تلقائيًا في باقة واحدة.",
  flightsTitle: "عروض الطيران (ذهاب وإياب)",
  flightsSubtitle: "عدة بدائل — يُرجى اختيار خيار طيران واحد",
  colAirline: "الخطوط",
  colOutbound: "الذهاب",
  colReturn: "الإياب",
  colBaggage: "الأمتعة",
  colDuration: "المدة الإجمالية",
  colPricePerPerson: "السعر للشخص",
  perPerson: "للشخص",
  flightSeatNote: "حجز المقاعد والوجبات وفق شروط شركة الطيران المعنية.",
  directFlight: "رحلة مباشرة",
  stops: (n) =>
    n === 1 ? "توقف واحد" : n === 2 ? "توقفان" : `${n} توقفات`,
  connection: (place, wait) => `توقف ${place}${wait}`,
  duration: (d) => `المدة ${d}`,
  checkedBaggageWord: "أمتعة مسجّلة",
  handBaggageWord: "أمتعة يدوية",
  accommodationMedina: (n) => `الإقامة في المدينة (${n} ${n === 1 ? "ليلة" : "ليالٍ"})`,
  accommodationMakkah: (n) => `الإقامة في مكة (${n} ${n === 1 ? "ليلة" : "ليالٍ"})`,
  hotelAlternatives: "بدائل للاختيار (خيار فندق واحد)",
  hotelAlternativesWithDates: (dates) => `${dates} · بدائل للاختيار (خيار فندق واحد)`,
  distanceHaram: (m) => `المسافة إلى الحرم: حوالي ${m} م`,
  missingRate: "سعر ناقص",
  roomN: (n) => `غرفة ${n}`,
  roomsTotal: (n) => `السعر الإجمالي لـ ${n} غرف`,
  pricingIncomplete: "السعر غير مكتمل — يُرجى إكمال الأسعار قبل إنشاء ملف PDF.",
  avgPerPerson: "المتوسط للشخص",
  board: "الوجبات:",
  breakfast: "الإفطار",
  breakfastIncluded: "الإفطار مشمول",
  breakfastOptional: "الإفطار (اختياري)",
  halfBoard: "نصف إقامة",
  fullBoard: "إقامة كاملة",
  roomOnly: "مبيت فقط",
  allInclusive: "شامل كليًا",
  lunch: "غداء",
  dinner: "عشاء",
  mealPerPersonNight: (euro) => `${euro} للشخص / الليلة`,
  addonsTitle: "خدمات إضافية (اختياري)",
  optional: "اختياري",
  includedTitle: "مشمول في السعر",
  excludedTitle: "غير مشمول",
  notesTitle: "ملاحظات هامة",
  footerTitle: "نحن بخدمتكم",
  starsAria: (n) => `${n} نجوم`,
  erwAbbrev: "بالغ",
  kindAbbrev: "طفل",
  missingRateForHotel: (hotel, date) => `لا يتوفر سعر لـ ${hotel} بتاريخ ${date}.`,
};

const TR: OfferPdfCopy = {
  heroTitleLine1: "Kişisel",
  heroTitleLine2: "Umre teklifiniz",
  greeting: (name) => `Sayın ${name},`,
  intro:
    "Talebiniz için teşekkür ederiz. Aşağıda Umre yolculuğunuz için kişisel teklifimizi sunuyoruz.",
  pricesInEuro: "Tüm fiyatlar Euro cinsindendir.",
  offerNumber: "Teklif no.",
  createdOn: "Oluşturulma",
  travelStart: "Seyahat başlangıcı",
  flexibility: "Esneklik",
  travelSummaryAria: "Seyahat özeti",
  offerMetaAria: "Teklif bilgileri",
  airports: "Kalkış havaalanları",
  travellers: "Yolcular",
  route: "Güzergâh",
  nights: "Gece",
  travelStartSummary: "Seyahat başlangıcı",
  adultOne: "yetişkin",
  adultMany: "yetişkin",
  childOne: "çocuk",
  childMany: "çocuk",
  infantOne: "bebek",
  infantMany: "bebek",
  roomOne: "oda",
  roomMany: "oda",
  nightMedinaOne: "gece Medine",
  nightMedinaMany: "gece Medine",
  nightMakkahOne: "gece Mekke",
  nightMakkahMany: "gece Mekke",
  routeMakkahOnly: "Sadece Mekke",
  routeMakkahFirst: "Önce Mekke, sonra Medine",
  routeMedinaFirst: "Önce Medine, sonra Mekke",
  flexUnspecified: "Belirtilmedi",
  flexExact: "Kesin tarih",
  flexDays: (n) => `± ${n} gün`,
  airportVIE: "Viyana (VIE)",
  airportSZG: "Salzburg (SZG)",
  airportMUC: "Münih (MUC)",
  airportBUD: "Budapeşte (BUD)",
  alternativesTitle: "Seçenekler:",
  alternativesBody:
    "Aşağıdaki uçuşlar ve oteller bağımsız alternatiflerdir. Lütfen her bölümden bir seçenek belirleyin — fiyatlar otomatik olarak paket toplamına eklenmez.",
  flightsTitle: "Uçuş teklifleri (gidiş-dönüş)",
  flightsSubtitle: "Birden fazla alternatif — lütfen bir uçuş seçin",
  colAirline: "Havayolu",
  colOutbound: "Gidiş",
  colReturn: "Dönüş",
  colBaggage: "Bagaj",
  colDuration: "Toplam süre",
  colPricePerPerson: "Kişi başı fiyat",
  perPerson: "kişi başı",
  flightSeatNote:
    "Koltuk rezervasyonu ve yemekler ilgili havayolunun koşullarına tabidir.",
  directFlight: "Direkt uçuş",
  stops: (n) => (n === 1 ? "1 aktarma" : `${n} aktarma`),
  connection: (place, wait) => `Aktarma ${place}${wait}`,
  duration: (d) => `Süre ${d}`,
  checkedBaggageWord: "kayıtlı bagaj",
  handBaggageWord: "el bagajı",
  accommodationMedina: (n) => `Medine konaklama (${n} gece)`,
  accommodationMakkah: (n) => `Mekke konaklama (${n} gece)`,
  hotelAlternatives: "Seçilecek alternatifler (bir otel seçeneği)",
  hotelAlternativesWithDates: (dates) =>
    `${dates} · Seçilecek alternatifler (bir otel seçeneği)`,
  distanceHaram: (m) => `Harem’e mesafe: yakl. ${m} m`,
  missingRate: "Eksik fiyat",
  roomN: (n) => `Oda ${n}`,
  roomsTotal: (n) => `${n} oda için toplam`,
  pricingIncomplete: "Fiyat eksik — PDF öncesi oranları tamamlayın veya manuel fiyat girin.",
  avgPerPerson: "Kişi başı ortalama",
  board: "Yemek:",
  breakfast: "Kahvaltı",
  breakfastIncluded: "Kahvaltı dahil",
  breakfastOptional: "Kahvaltı (opsiyonel)",
  halfBoard: "Yarım pansiyon",
  fullBoard: "Tam pansiyon",
  roomOnly: "Sadece konaklama",
  allInclusive: "Her şey dahil",
  lunch: "Öğle yemeği",
  dinner: "Akşam yemeği",
  mealPerPersonNight: (euro) => `${euro} kişi / gece`,
  addonsTitle: "Ek hizmetler (opsiyonel)",
  optional: "Opsiyonel",
  includedTitle: "Fiyata dahil",
  excludedTitle: "Dahil değil",
  notesTitle: "Önemli notlar",
  footerTitle: "Yanınızdayız",
  starsAria: (n) => `${n} yıldız`,
  erwAbbrev: "yet.",
  kindAbbrev: "çoc.",
  missingRateForHotel: (hotel, date) => `${hotel} için ${date} tarihinde fiyat yok.`,
};

const BS: OfferPdfCopy = {
  heroTitleLine1: "Vaša personalizirana",
  heroTitleLine2: "Umrah ponuda",
  greeting: (name) => `Poštovani/a ${name},`,
  intro:
    "Hvala na upitu. U nastavku vam dostavljamo personaliziranu ponudu za vaše Umrah putovanje.",
  pricesInEuro: "Sve cijene su iskazane u eurima.",
  offerNumber: "Broj ponude",
  createdOn: "Kreirano",
  travelStart: "Početak putovanja",
  flexibility: "Fleksibilnost",
  travelSummaryAria: "Pregled putovanja",
  offerMetaAria: "Podaci o ponudi",
  airports: "Aerodromi polaska",
  travellers: "Putnici",
  route: "Ruta",
  nights: "Noći",
  travelStartSummary: "Početak putovanja",
  adultOne: "odrasli",
  adultMany: "odraslih",
  childOne: "dijete",
  childMany: "djece",
  infantOne: "dojenče",
  infantMany: "dojenčadi",
  roomOne: "soba",
  roomMany: "sobe",
  nightMedinaOne: "noć u Medini",
  nightMedinaMany: "noći u Medini",
  nightMakkahOne: "noć u Mekki",
  nightMakkahMany: "noći u Mekki",
  routeMakkahOnly: "Samo Mekka",
  routeMakkahFirst: "Prvo Mekka, zatim Medina",
  routeMedinaFirst: "Prvo Medina, zatim Mekka",
  flexUnspecified: "Nije navedeno",
  flexExact: "Tačan datum",
  flexDays: (n) => `± ${n} ${n === 1 ? "dan" : "dana"}`,
  airportVIE: "Beč (VIE)",
  airportSZG: "Salzburg (SZG)",
  airportMUC: "Minhen (MUC)",
  airportBUD: "Budimpešta (BUD)",
  alternativesTitle: "Alternative za izbor:",
  alternativesBody:
    "Navedeni letovi i hoteli su nezavisne opcije. Molimo odaberite po jednu varijantu — cijene se ne sabiraju automatski u paket.",
  flightsTitle: "Ponude letova (odlazak i povratak)",
  flightsSubtitle: "Više alternativa — odaberite jednu opciju leta",
  colAirline: "Aviokompanija",
  colOutbound: "Odlazak",
  colReturn: "Povratak",
  colBaggage: "Prtljag",
  colDuration: "Ukupno trajanje",
  colPricePerPerson: "Cijena po osobi",
  perPerson: "po osobi",
  flightSeatNote:
    "Rezervacija sjedišta i obroci podliježu uslovima odgovarajuće aviokompanije.",
  directFlight: "Direktni let",
  stops: (n) => (n === 1 ? "1 stajanje" : `${n} stajanja`),
  connection: (place, wait) => `Presjedanje ${place}${wait}`,
  duration: (d) => `Trajanje ${d}`,
  checkedBaggageWord: "predani prtljag",
  handBaggageWord: "ručni prtljag",
  accommodationMedina: (n) => `Smještaj u Medini (${n} ${n === 1 ? "noć" : "noći"})`,
  accommodationMakkah: (n) => `Smještaj u Mekki (${n} ${n === 1 ? "noć" : "noći"})`,
  hotelAlternatives: "Alternative za izbor (jedna hotelska opcija)",
  hotelAlternativesWithDates: (dates) =>
    `${dates} · Alternative za izbor (jedna hotelska opcija)`,
  distanceHaram: (m) => `Udaljenost do Harama: ca. ${m} m`,
  missingRate: "Nedostaje cijena",
  roomN: (n) => `Soba ${n}`,
  roomsTotal: (n) => `Ukupno za ${n} sobe`,
  pricingIncomplete: "Cijena nepotpuna — dopunite cijene prije PDF-a.",
  avgPerPerson: "Prosjek po osobi",
  board: "Ishrana:",
  breakfast: "Doručak",
  breakfastIncluded: "Doručak uključen",
  breakfastOptional: "Doručak (opcionalno)",
  halfBoard: "Polupansion",
  fullBoard: "Pun pansion",
  roomOnly: "Samo noćenje",
  allInclusive: "All inclusive",
  lunch: "Ručak",
  dinner: "Večera",
  mealPerPersonNight: (euro) => `${euro} po osobi / noć`,
  addonsTitle: "Dodatne usluge (opcionalno)",
  optional: "Opcionalno",
  includedTitle: "Uključeno u cijenu",
  excludedTitle: "Nije uključeno",
  notesTitle: "Važne napomene",
  footerTitle: "Tu smo za vas",
  starsAria: (n) => `${n} zvjezdica`,
  erwAbbrev: "odr.",
  kindAbbrev: "dj.",
  missingRateForHotel: (hotel, date) => `Nema cijene za ${hotel} na dan ${date}.`,
};

export const OFFER_PDF_COPY: Record<OfferPdfLocale, OfferPdfCopy> = {
  de: DE,
  en: EN,
  ar: AR,
  tr: TR,
  bs: BS,
};

export function getOfferPdfCopy(lang: OfferPdfLocale): OfferPdfCopy {
  return OFFER_PDF_COPY[lang] ?? OFFER_PDF_COPY.de;
}

export function pluralPdf(
  t: OfferPdfCopy,
  count: number,
  oneKey: "adultOne" | "childOne" | "infantOne" | "roomOne" | "nightMedinaOne" | "nightMakkahOne",
  manyKey:
    | "adultMany"
    | "childMany"
    | "infantMany"
    | "roomMany"
    | "nightMedinaMany"
    | "nightMakkahMany",
): string {
  return `${count} ${count === 1 ? t[oneKey] : t[manyKey]}`;
}

/**
 * Format a calendar date for the PDF.
 * Spec 14: the civil date (Y-M-D) never changes by language — only month/day words do.
 * Always Gregorian + Latin digits (see `offerPdfIntlLocale`).
 */
export function formatOfferPdfDate(iso: string, lang: OfferPdfLocale): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Intl.DateTimeFormat(offerPdfIntlLocale(lang), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
}

export function formatOfferPdfDateTime(iso: string, lang: OfferPdfLocale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(offerPdfIntlLocale(lang), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Euro amount for the customer PDF.
 * Spec 14: translation never changes prices — same integer EUR value, Latin digits,
 * stable „N €“ form in every language. Unit labels („pro Person“) are separate.
 */
export function formatOfferPdfEuro(
  amount: number,
  _lang?: OfferPdfLocale,
): string {
  const n = Math.round(Number(amount) || 0);
  return `${n} €`;
}

export function formatOfferPdfAirport(code: string, t: OfferPdfCopy): string {
  const map: Record<string, string> = {
    VIE: t.airportVIE,
    SZG: t.airportSZG,
    MUC: t.airportMUC,
    BUD: t.airportBUD,
  };
  return map[code] ?? code;
}

/**
 * Customer-facing board / meal line for the PDF hotel card.
 * Prefers structured `mealPlan` code; falls back to resolving legacy boardLabel text.
 * Custom free-text (no matching code) is kept as entered.
 */
export function formatOfferPdfBoard(
  t: OfferPdfCopy,
  breakfastMode: "included" | "optional" | "priced",
  boardLabel?: string | null,
  mealPlan?: OfferMealPlanCode | null,
  lang?: OfferPdfLocale,
): string {
  const locale = lang ?? inferLocaleFromCopy(t);
  const code =
    mealPlan ??
    resolveMealPlanCodeFromLabel(boardLabel, breakfastMode) ??
    (breakfastMode === "optional"
      ? ("breakfast_optional" as const)
      : breakfastMode === "priced"
        ? ("breakfast" as const)
        : boardLabel?.trim()
          ? null
          : ("breakfast" as const));

  if (code) {
    return labelOfferMealPlan(code, locale);
  }

  const custom = (boardLabel ?? "").trim();
  return custom || t.breakfastIncluded;
}

function inferLocaleFromCopy(t: OfferPdfCopy): OfferPdfLocale {
  if (t.breakfastIncluded === AR.breakfastIncluded) return "ar";
  if (t.breakfastIncluded === EN.breakfastIncluded) return "en";
  if (t.breakfastIncluded === TR.breakfastIncluded) return "tr";
  if (t.breakfastIncluded === BS.breakfastIncluded) return "bs";
  return "de";
}

/**
 * Translate stored occupancy labels (often German from the rate engine)
 * into the customer PDF language. Numbers stay unchanged.
 */
export function localizeOfferPdfOccupancy(
  label: string,
  t: OfferPdfCopy,
  lang: OfferPdfLocale,
): string {
  if (!label || label === "—") return "—";

  const word = (n: number, one: string, many: string) =>
    `${n} ${n === 1 ? one : many}`;

  let s = label
    .replace(/\b(\d+)\s*Erwachsene[rn]?\b/gi, (_, n) =>
      word(Number(n), t.adultOne, t.adultMany),
    )
    .replace(/\b(\d+)\s*Erwachsener\b/gi, (_, n) =>
      word(Number(n), t.adultOne, t.adultMany),
    )
    .replace(/\b(\d+)\s*adults?\b/gi, (_, n) =>
      word(Number(n), t.adultOne, t.adultMany),
    )
    .replace(/\b(\d+)\s*yetişkin\b/gi, (_, n) =>
      word(Number(n), t.adultOne, t.adultMany),
    )
    .replace(/\b(\d+)\s*odrasl[iaih]*\b/gi, (_, n) =>
      word(Number(n), t.adultOne, t.adultMany),
    )
    .replace(/\b(\d+)\s*Kinder\b/gi, (_, n) =>
      word(Number(n), t.childOne, t.childMany),
    )
    .replace(/\b(\d+)\s*Kind\b/gi, (_, n) =>
      word(Number(n), t.childOne, t.childMany),
    )
    .replace(/\b(\d+)\s*children\b/gi, (_, n) =>
      word(Number(n), t.childOne, t.childMany),
    )
    .replace(/\b(\d+)\s*child\b/gi, (_, n) =>
      word(Number(n), t.childOne, t.childMany),
    )
    .replace(/\b(\d+)\s*çocuk\b/gi, (_, n) =>
      word(Number(n), t.childOne, t.childMany),
    )
    .replace(/\b(\d+)\s*djece\b/gi, (_, n) =>
      word(Number(n), t.childOne, t.childMany),
    )
    .replace(/\b(\d+)\s*dijete\b/gi, (_, n) =>
      word(Number(n), t.childOne, t.childMany),
    )
    .replace(/\b(\d+)\s*Babys?\b/gi, (_, n) =>
      word(Number(n), t.infantOne, t.infantMany),
    )
    .replace(/\b(\d+)\s*infants?\b/gi, (_, n) =>
      word(Number(n), t.infantOne, t.infantMany),
    )
    .replace(/\b(\d+)\s*infant\b/gi, (_, n) =>
      word(Number(n), t.infantOne, t.infantMany),
    )
    .replace(/\b(\d+)\s*bebek\b/gi, (_, n) =>
      word(Number(n), t.infantOne, t.infantMany),
    )
    .replace(/\b(\d+)\s*dojenč(?:e|adi)\b/gi, (_, n) =>
      word(Number(n), t.infantOne, t.infantMany),
    )
    .replace(/\bErwachsene[rn]?\b/gi, t.adultMany)
    .replace(/\bErwachsener\b/gi, t.adultOne)
    .replace(/\badults?\b/gi, t.adultMany)
    .replace(/\bKinder\b/gi, t.childMany)
    .replace(/\bKind\b/gi, t.childOne)
    .replace(/\bchildren\b/gi, t.childMany)
    .replace(/\bchild\b/gi, t.childOne)
    .replace(/\bBabys\b/gi, t.infantMany)
    .replace(/\bBaby\b/gi, t.infantOne);

  if (lang === "de") {
    return compactOfferPdfOccupancy(s, t);
  }
  return s.trim();
}

/** Common room-category labels; unknown Admin names stay as entered. */
const ROOM_CATEGORY_I18N: Record<string, Record<OfferPdfLocale, string>> = {
  "standard room": {
    de: "Standardzimmer",
    en: "Standard Room",
    ar: "غرفة قياسية",
    tr: "Standart Oda",
    bs: "Standardna soba",
  },
  "standard double": {
    de: "Standard Doppelzimmer",
    en: "Standard Double",
    ar: "غرفة مزدوجة قياسية",
    tr: "Standart Çift Kişilik",
    bs: "Standardni dvokrevetni",
  },
  "standard twin": {
    de: "Standard Twin",
    en: "Standard Twin",
    ar: "غرفة توأم قياسية",
    tr: "Standart Twin",
    bs: "Standardni twin",
  },
  "deluxe room": {
    de: "Deluxe-Zimmer",
    en: "Deluxe Room",
    ar: "غرفة ديلوكس",
    tr: "Deluxe Oda",
    bs: "Deluxe soba",
  },
  "deluxe double": {
    de: "Deluxe Doppelzimmer",
    en: "Deluxe Double",
    ar: "غرفة ديلوكس مزدوجة",
    tr: "Deluxe Çift Kişilik",
    bs: "Deluxe dvokrevetni",
  },
  suite: {
    de: "Suite",
    en: "Suite",
    ar: "جناح",
    tr: "Suit",
    bs: "Suite",
  },
  "family room": {
    de: "Familienzimmer",
    en: "Family Room",
    ar: "غرفة عائلية",
    tr: "Aile Odası",
    bs: "Porodična soba",
  },
  "triple room": {
    de: "Dreibettzimmer",
    en: "Triple Room",
    ar: "غرفة ثلاثية",
    tr: "Üç Kişilik Oda",
    bs: "Trokrevetna soba",
  },
  "quad room": {
    de: "Vierbettzimmer",
    en: "Quad Room",
    ar: "غرفة رباعية",
    tr: "Dört Kişilik Oda",
    bs: "Četverokrevetna soba",
  },
};

export function localizeOfferPdfRoomCategory(
  name: string | null | undefined,
  lang: OfferPdfLocale,
  roomType?: OfferRoomTypeCode | null,
): string {
  if (roomType) {
    return labelOfferRoomType(roomType, lang);
  }
  const raw = (name ?? "").trim();
  if (!raw) return "";
  const key = raw.toLowerCase();
  return ROOM_CATEGORY_I18N[key]?.[lang] ?? raw;
}

export function formatOfferPdfMissingRate(
  t: OfferPdfCopy,
  hotelName: string,
  dateIso: string,
  lang: OfferPdfLocale,
): string {
  return t.missingRateForHotel(hotelName, formatOfferPdfDate(dateIso, lang));
}

/**
 * Flight leg detail lines for the PDF.
 * Airport codes / times stay as entered; Direktflug / Stopp / Umstieg / Dauer localize.
 */
export function formatOfferPdfFlightLegLines(
  t: OfferPdfCopy,
  leg: {
    fromCode?: string;
    toCode?: string;
    departTime?: string;
    arriveTime?: string;
    duration?: string;
    segments?: Array<{
      fromCode: string;
      toCode: string;
      departTime: string;
      arriveTime: string;
    }>;
    connections?: Array<{
      airportCode: string;
      cityLabel: string;
      duration: string;
    }>;
  },
): string[] {
  const segments = leg.segments?.length
    ? leg.segments
    : [
        {
          fromCode: leg.fromCode ?? "",
          toCode: leg.toCode ?? "",
          departTime: leg.departTime ?? "",
          arriveTime: leg.arriveTime ?? "",
        },
      ];
  const connections = leg.connections ?? [];
  const lines: string[] = [];

  if (segments.length <= 1) {
    lines.push(t.directFlight);
  } else {
    lines.push(t.stops(segments.length - 1));
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i]!;
      lines.push(
        `${seg.fromCode} ${seg.departTime} → ${seg.toCode} ${seg.arriveTime}`
          .replace(/\s+/g, " ")
          .trim(),
      );
      const conn = connections[i];
      if (conn) {
        const place = conn.cityLabel || conn.airportCode || "";
        const wait = conn.duration ? `: ${conn.duration}` : "";
        lines.push(t.connection(place, wait));
      }
    }
  }

  if (leg.duration?.trim()) {
    lines.push(t.duration(leg.duration.trim()));
  }
  return lines;
}

/**
 * Localize stock baggage wording (Freigepäck / Handgepäck) for the customer PDF.
 * Weights and counts stay as entered; custom free-text is left alone when unmatched.
 */
export function localizeOfferPdfBaggageLine(line: string, t: OfferPdfCopy): string {
  const raw = line.trim();
  if (!raw || raw === "—") return raw;

  return raw
    .replace(/\bFreigepäck\b/gi, t.checkedBaggageWord)
    .replace(/\bHandgepäck\b/gi, t.handBaggageWord)
    .replace(/\bchecked baggage\b/gi, t.checkedBaggageWord)
    .replace(/\bhand baggage\b/gi, t.handBaggageWord)
    .replace(/\bcabin baggage\b/gi, t.handBaggageWord)
    .replace(/\bkayıtlı bagaj\b/gi, t.checkedBaggageWord)
    .replace(/\bel bagajı\b/gi, t.handBaggageWord)
    .replace(/\bpredani prtljag\b/gi, t.checkedBaggageWord)
    .replace(/\bručni prtljag\b/gi, t.handBaggageWord)
    .replace(/أمتعة مسجّ?لة/g, t.checkedBaggageWord)
    .replace(/أمتعة يدوية/g, t.handBaggageWord);
}

export function formatOfferPdfBaggageLines(
  t: OfferPdfCopy,
  flight: {
    checkedBaggageSpec?: OfferBaggageSpec | null;
    handBaggageSpec?: OfferBaggageSpec | null;
    checkedBaggage?: string;
    handBaggage?: string;
    baggage?: string;
  },
  lang?: OfferPdfLocale,
): string[] {
  const locale = lang ?? inferLocaleFromCopy(t);
  const lines: string[] = [];

  if (flight.checkedBaggageSpec) {
    lines.push(labelOfferBaggageSpec(flight.checkedBaggageSpec, locale));
  } else {
    const checked =
      (flight.checkedBaggage ?? "").trim() || (flight.baggage ?? "").trim();
    if (checked) lines.push(localizeOfferPdfBaggageLine(checked, t));
  }

  if (flight.handBaggageSpec) {
    lines.push(labelOfferBaggageSpec(flight.handBaggageSpec, locale));
  } else {
    const hand = (flight.handBaggage ?? "").trim();
    if (hand) lines.push(localizeOfferPdfBaggageLine(hand, t));
  }

  return lines.length ? lines : ["—"];
}

export function compactOfferPdfOccupancy(label: string, t: OfferPdfCopy): string {
  return label
    .replace(/\bErwachsene[rn]?\b/g, t.erwAbbrev)
    .replace(/\bErwachsener\b/g, t.erwAbbrev)
    .replace(/\badults?\b/gi, t.erwAbbrev)
    .replace(/\bKinder\b/g, t.kindAbbrev)
    .replace(/\bKind\b/g, t.kindAbbrev)
    .replace(/\bchildren\b/gi, t.kindAbbrev)
    .replace(/\bchild\b/gi, t.kindAbbrev)
    .replace(/\bBabys\b/g, t.infantOne)
    .replace(/\bBaby\b/g, t.infantOne)
    .trim();
}

export const DEFAULT_OFFER_TERMS_BY_LOCALE: Record<
  OfferPdfLocale,
  { included: string[]; excluded: string[]; notes: string[] }
> = {
  de: {
    included: [
      "Unterkunft in Medina und Makkah gemäß Auswahl",
      "Flug gemäß ausgewählter Airline",
      "Steuern und Gebühren",
      "Persönliche Betreuung vor, während und nach der Reise",
    ],
    excluded: [
      "Visum – falls nicht ausgewählt",
      "Reiseversicherung",
      "Mahlzeiten – sofern nicht in Hotelrate enthalten",
      "Persönliche Ausgaben",
    ],
    notes: [
      "Dieses Angebot ist unverbindlich.",
      "Verfügbarkeit und Preise können sich jederzeit ändern.",
      "Nach Bestätigung prüfen wir alle ausgewählten Leistungen erneut und senden Ihnen anschließend die verbindliche Buchungsbestätigung.",
    ],
  },
  en: {
    included: [
      "Accommodation in Medina and Makkah as selected",
      "Flight with the selected airline",
      "Taxes and fees",
      "Personal support before, during and after the trip",
    ],
    excluded: [
      "Visa – unless selected",
      "Travel insurance",
      "Meals – unless included in the hotel rate",
      "Personal expenses",
    ],
    notes: [
      "This offer is non-binding.",
      "Availability and prices may change at any time.",
      "After confirmation we re-check all selected services and then send you the binding booking confirmation.",
    ],
  },
  ar: {
    included: [
      "الإقامة في المدينة ومكة حسب الاختيار",
      "الطيران وفق الخطوط المختارة",
      "الضرائب والرسوم",
      "متابعة شخصية قبل الرحلة وأثناءها وبعدها",
    ],
    excluded: [
      "التأشيرة – إن لم تُختر",
      "تأمين السفر",
      "الوجبات – ما لم تكن ضمن سعر الفندق",
      "المصروفات الشخصية",
    ],
    notes: [
      "هذا العرض غير ملزم.",
      "قد تتغير التوفر والأسعار في أي وقت.",
      "بعد التأكيد نراجع جميع الخدمات المختارة ثم نرسل لكم تأكيد الحجز الملزم.",
    ],
  },
  tr: {
    included: [
      "Seçime göre Medine ve Mekke konaklaması",
      "Seçilen havayolu ile uçuş",
      "Vergiler ve harçlar",
      "Seyahat öncesi, sırası ve sonrası kişisel destek",
    ],
    excluded: [
      "Vize – seçilmediyse",
      "Seyahat sigortası",
      "Yemekler – otel fiyatına dahil değilse",
      "Kişisel harcamalar",
    ],
    notes: [
      "Bu teklif bağlayıcı değildir.",
      "Müsaitlik ve fiyatlar her an değişebilir.",
      "Onaydan sonra tüm seçilen hizmetleri yeniden kontrol eder ve bağlayıcı rezervasyon onayını göndeririz.",
    ],
  },
  bs: {
    included: [
      "Smještaj u Medini i Mekki prema odabiru",
      "Let odabranom aviokompanijom",
      "Porezi i naknade",
      "Lična podrška prije, tokom i nakon putovanja",
    ],
    excluded: [
      "Viza – ako nije odabrana",
      "Putno osiguranje",
      "Obroci – ako nisu uključeni u hotelsku cijenu",
      "Lični troškovi",
    ],
    notes: [
      "Ova ponuda nije obavezujuća.",
      "Dostupnost i cijene se mogu promijeniti u bilo kojem trenutku.",
      "Nakon potvrde ponovo provjeravamo sve odabrane usluge i šaljemo vam obavezujuću potvrdu rezervacije.",
    ],
  },
};

export const DEFAULT_ADDON_COPY_BY_LOCALE: Record<
  OfferPdfLocale,
  Record<string, { title: string; body: string }>
> = {
  de: {
    city_transfer: {
      title: "Transfer Medina → Makkah",
      body: "Komfortabler Bahntransfer zwischen Medina und Makkah (Haramain).",
    },
    religious_medina: {
      title: "Religiöse Reiseführung in Medina",
      body: "Deutschsprachige religiöse Begleitung in Medina.",
    },
    visa: {
      title: "Visum für Saudi-Arabien",
      body: "Organisation und Beantragung Ihres Umrah-Visums.",
    },
  },
  en: {
    city_transfer: {
      title: "Transfer Medina → Makkah",
      body: "Comfortable train transfer between Medina and Makkah (Haramain).",
    },
    religious_medina: {
      title: "Religious guidance in Medina",
      body: "Religious accompaniment in Medina.",
    },
    visa: {
      title: "Visa for Saudi Arabia",
      body: "Organisation and application of your Umrah visa.",
    },
  },
  ar: {
    city_transfer: {
      title: "نقل المدينة → مكة",
      body: "نقل مريح بالقطار بين المدينة ومكة (الحرمين).",
    },
    religious_medina: {
      title: "إرشاد ديني في المدينة",
      body: "مرافقة دينية في المدينة المنورة.",
    },
    visa: {
      title: "تأشيرة المملكة العربية السعودية",
      body: "تنظيم وتقديم طلب تأشيرة العمرة.",
    },
  },
  tr: {
    city_transfer: {
      title: "Transfer Medine → Mekke",
      body: "Medine ve Mekke arasında konforlu tren transferi (Haramain).",
    },
    religious_medina: {
      title: "Medine’de dini rehberlik",
      body: "Medine’de dini eşlik.",
    },
    visa: {
      title: "Suudi Arabistan vizesi",
      body: "Umre vizenizin düzenlenmesi ve başvurusu.",
    },
  },
  bs: {
    city_transfer: {
      title: "Transfer Medina → Mekka",
      body: "Udoban željeznički transfer između Medine i Mekke (Haramain).",
    },
    religious_medina: {
      title: "Vjersko vođenje u Medini",
      body: "Vjerska pratnja u Medini.",
    },
    visa: {
      title: "Viza za Saudijsku Arabiju",
      body: "Organizacija i podnošenje zahtjeva za Umrah vizu.",
    },
  },
};

function sameList(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((item, i) => item === b[i]);
}

/** Use localized stock templates when Admin has not customized defaults. */
export function resolveOfferPdfTerms(
  items: string[],
  kind: "included" | "excluded" | "notes",
  lang: OfferPdfLocale,
): string[] {
  const target = DEFAULT_OFFER_TERMS_BY_LOCALE[lang][kind];
  const locales = Object.keys(DEFAULT_OFFER_TERMS_BY_LOCALE) as OfferPdfLocale[];
  for (const loc of locales) {
    if (sameList(items, DEFAULT_OFFER_TERMS_BY_LOCALE[loc][kind])) {
      return [...target];
    }
  }
  return items;
}

/**
 * Prefer structured term codes on the offer; fall back to free-text list migration.
 */
export function resolveOfferPdfTermsFromOffer(
  offer: {
    includedTermIds?: string[];
    excludedTermIds?: string[];
    noteTermIds?: string[];
    includedItems?: string[];
    excludedItems?: string[];
    importantNotes?: string[];
  },
  kind: "included" | "excluded" | "notes",
  lang: OfferPdfLocale,
): string[] {
  if (kind === "included" && offer.includedTermIds?.length) {
    return offer.includedTermIds
      .filter(isOfferIncludedTermCode)
      .map((id) => labelIncludedTerm(id, lang));
  }
  if (kind === "excluded" && offer.excludedTermIds?.length) {
    return offer.excludedTermIds
      .filter(isOfferExcludedTermCode)
      .map((id) => labelExcludedTerm(id, lang));
  }
  if (kind === "notes" && offer.noteTermIds?.length) {
    return offer.noteTermIds
      .filter(isOfferNoteTermCode)
      .map((id) => labelNoteTerm(id, lang));
  }

  const items =
    kind === "included"
      ? (offer.includedItems ?? [])
      : kind === "excluded"
        ? (offer.excludedItems ?? [])
        : (offer.importantNotes ?? []);
  return resolveOfferPdfTerms(items, kind, lang);
}

/** Built-in add-ons — PDF titles/bodies come from the language template. */
export const CATALOG_OFFER_ADDON_IDS = [
  "city_transfer",
  "religious_medina",
  "visa",
] as const;

export function isCatalogOfferAddonId(id: string): boolean {
  return (CATALOG_OFFER_ADDON_IDS as readonly string[]).includes(id);
}

export function resolveOfferPdfAddonCopy(
  addon: { id: string; title: string; body: string },
  lang: OfferPdfLocale,
): { title: string; body: string } {
  const localized = DEFAULT_ADDON_COPY_BY_LOCALE[lang]?.[addon.id];
  if (!localized || !isCatalogOfferAddonId(addon.id)) {
    // Custom / unknown add-on — keep Admin text as entered
    return { title: addon.title, body: addon.body };
  }

  const body = addon.body.trim();
  const locales = Object.keys(DEFAULT_ADDON_COPY_BY_LOCALE) as OfferPdfLocale[];
  const bodyIsStock =
    !body ||
    locales.some((loc) => DEFAULT_ADDON_COPY_BY_LOCALE[loc][addon.id]?.body === body);

  // Catalog services always show the template title in the PDF language
  // (Transfer / Religiöse Reiseführung / Visum). Customized bodies are kept.
  return {
    title: localized.title,
    body: bodyIsStock ? localized.body : addon.body,
  };
}

/**
 * Addon price on the customer PDF.
 * Spec 14: amount is invariant („150 €“); only the unit label translates.
 */
export function formatOfferPdfAddonPriceParts(
  amount: number,
  pricingType: string | undefined,
  lang: OfferPdfLocale,
): { price: string; unit: string } {
  const n = Math.round(Number(amount) || 0);
  return {
    price: `${n} €`,
    unit: formatAddonPricingTypePdf(pricingType, lang),
  };
}

export function formatAddonPricingTypePdf(
  pricingType: string | undefined,
  lang: OfferPdfLocale,
): string {
  const t = getOfferPdfCopy(lang);
  if (pricingType === "per_booking") {
    if (lang === "de") return "pro Buchung";
    if (lang === "ar") return "للحجز";
    if (lang === "tr") return "rezervasyon başına";
    if (lang === "bs") return "po rezervaciji";
    return "per booking";
  }
  if (pricingType === "per_room") {
    if (lang === "de") return "pro Zimmer";
    if (lang === "ar") return "للغرفة";
    if (lang === "tr") return "oda başına";
    if (lang === "bs") return "po sobi";
    return "per room";
  }
  return t.perPerson;
}

/** Admin hint labels (German UI) for the auto PDF language. */
export const OFFER_PDF_LANGUAGE_LABEL_DE: Record<OfferPdfLocale, string> = {
  de: "Deutsch",
  en: "Englisch",
  ar: "Arabisch",
  tr: "Türkisch",
  bs: "Bosnisch",
};
