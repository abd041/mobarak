"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  Baby,
  BedDouble,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
  Loader2,
  Lock,
  User,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import {
  INDIVIDUAL_UMRAH_AIRPORTS,
  INDIVIDUAL_UMRAH_PHONE_DIAL_OPTIONS,
  INDIVIDUAL_UMRAH_ROOM_PRESETS,
  INDIVIDUAL_UMRAH_ROOMS_SIX_PLUS_MIN,
  INDIVIDUAL_UMRAH_TRAVEL_MONTHS_AHEAD,
  MAX_INDIVIDUAL_ROOMS,
  MAX_NIGHTS_PER_CITY,
  MAX_TRAVELLERS_PER_CATEGORY,
  MIN_NIGHTS_PER_CITY,
  defaultPhoneCountryForLocale,
  type IndividualUmrahCityOrder,
  type IndividualUmrahItinerary,
  type IndividualUmrahPhoneCountryCode,
} from "@/data/individual-umrah";
import {
  hasIndividualUmrahFormErrors,
  resizeChildNeedsBed,
  validateIndividualUmrahPreferences,
  type IndividualUmrahFormData,
  type IndividualUmrahFormErrors,
} from "@/lib/individual-umrah-validation";
import type { Locale } from "@/i18n/routing";
import { locales } from "@/i18n/routing";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { writeIndividualUmrahPreferences, readIndividualUmrahDraft } from "@/lib/individual-umrah-draft";

const ICON_KAABA = "/brand/icons/individual-umrah/kaaba.png";
const ICON_MEDINA = "/brand/icons/individual-umrah/medina.png";
/** How-it-works — ChatGPT sheet Sep 1, 03:30 */
const HOW_ICON_SEND = "/brand/icons/individual-umrah/how/send.png";
const HOW_ICON_OFFER = "/brand/icons/individual-umrah/how/offer.png";
const HOW_ICON_KAABA = "/brand/icons/individual-umrah/how/kaaba.png";
/** Trust strip — ChatGPT sheet Sep 1, 03:23 */
const TRUST_ICON_USER = "/brand/icons/individual-umrah/trust/user.png";
const TRUST_ICON_SHIELD = "/brand/icons/individual-umrah/trust/shield.png";
const TRUST_ICON_CLIPBOARD = "/brand/icons/individual-umrah/trust/clipboard.png";
const TRUST_ICON_GLOBE = "/brand/icons/individual-umrah/trust/globe.png";

/** §36 — preferred language options (native labels; default = website locale). */
const PREFERRED_LANGUAGE_OPTIONS: { value: Locale; label: string }[] = [
  { value: "de", label: "Deutsch" },
  { value: "ar", label: "العربية" },
  { value: "tr", label: "Türkçe" },
  { value: "bs", label: "Bosanski" },
  { value: "en", label: "English" },
];

/** §38 — same referral options as other inquiry forms; no default. */
const SOURCE_OPTION_VALUES = [
  "instagram",
  "facebook",
  "google",
  "chatgpt",
  "friend",
  "know",
  "other",
] as const;

type SourceOption = (typeof SOURCE_OPTION_VALUES)[number];

const SOURCE_OPTIONS: { value: SourceOption; labelKey: string }[] = [
  { value: "instagram", labelKey: "sourceInstagram" },
  { value: "facebook", labelKey: "sourceFacebook" },
  { value: "google", labelKey: "sourceGoogle" },
  { value: "chatgpt", labelKey: "sourceChatgpt" },
  { value: "friend", labelKey: "sourceFriend" },
  { value: "know", labelKey: "sourceKnow" },
  { value: "other", labelKey: "sourceOther" },
];

/** §2 — single premium form shell on md+; mobile = separate step cards (reference) */
const formShellClass =
  "flex flex-col gap-4 max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none md:gap-0 md:rounded-2xl md:border md:border-line md:bg-white md:p-8 md:shadow-[var(--shadow-card)] lg:rounded-[1.25rem] lg:p-10 lg:shadow-[var(--shadow-card-lg)]";
const stepDividerClass =
  "max-md:mt-0 max-md:border-0 max-md:pt-0 border-t border-line pt-6 md:mt-9 md:pt-9";
const mobileStepCardClass =
  "max-md:rounded-[1.1rem] max-md:border max-md:border-line/80 max-md:bg-white max-md:px-5 max-md:pb-5 max-md:pt-7 max-md:shadow-[0_8px_28px_rgba(11,44,74,0.08)]";
/** Desktop: step label left · controls right (matches Individuelle Umrah form mock) */
const stepRowClass = "lg:grid lg:grid-cols-[minmax(12.5rem,16.5rem)_minmax(0,1fr)] lg:items-start lg:gap-x-8 xl:gap-x-10";
const inputClass =
  "w-full min-h-12 rounded-xl border border-line bg-white px-4 py-3.5 text-[15px] text-navy shadow-[inset_0_1px_2px_rgba(11,44,74,0.03)] outline-none transition placeholder:text-muted/55 focus:border-brand-cta focus:ring-2 focus:ring-brand-cta/12";
const selectClass = cn(inputClass, "appearance-none pe-10");
/** §7 — selected airports: navy bg, white text + square check */
const airportSelectedClass = "border-navy bg-navy text-white shadow-[0_4px_12px_rgba(11,44,74,0.2)]";
const selectedChipClass = "border-navy bg-navy text-white shadow-[0_4px_12px_rgba(11,44,74,0.2)]";
const idleChipClass = "border-line bg-white text-navy hover:border-navy/25 hover:bg-[#F8FAFC]";
/** §24 — Mobarak dark blue CTA; full form width */
const ctaBtnClass =
  "flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-navy px-5 text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(11,44,74,0.22)] transition hover:bg-navy-deep active:bg-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:opacity-60 md:min-h-[3.75rem] md:text-[16px]";

function localeTag(locale: Locale): string {
  if (locale === "de") return "de-AT";
  if (locale === "ar") return "ar-SA";
  if (locale === "bs") return "bs-BA";
  if (locale === "tr") return "tr-TR";
  return "en-GB";
}

/** §19 — dynamic upcoming months from today; never hard-code mockup years. */
function buildMonthOptions(locale: Locale, count = INDIVIDUAL_UMRAH_TRAVEL_MONTHS_AHEAD) {
  const tag = localeTag(locale);
  const start = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const raw = d.toLocaleDateString(tag, { month: "long", year: "numeric" });
    const label = raw.charAt(0).toLocaleUpperCase(tag) + raw.slice(1);
    return { value, label, year: d.getFullYear(), month: d.getMonth() };
  });
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function SectionHeader({
  step,
  title,
  hint,
  titleId,
  className,
}: {
  step: number;
  title: string;
  hint: string;
  titleId?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-5 flex gap-3.5 md:mb-6 lg:mb-0", className)}>
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-[13px] font-bold text-white"
        aria-hidden
      >
        {step}
      </span>
      <div className="min-w-0 pt-0.5">
        <h2
          id={titleId}
          className="font-serif text-[18px] font-bold leading-snug tracking-[-0.01em] text-navy md:text-[20px]"
        >
          {title}
        </h2>
        {hint ? (
          <p className="mt-1.5 text-[13px] leading-relaxed text-[#5A6B7A] md:text-[14px]">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-2 text-[12px] text-red-600" role="alert" data-invalid="true">
      {message}
    </p>
  );
}

/** §37 — compact select inside the phone composite field */
function PhoneInlineSelect({
  value,
  onChange,
  ariaLabel,
  className,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("relative bg-white", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="h-full w-full min-h-14 appearance-none border-0 bg-transparent py-3 ps-2 pe-6 text-[15px] text-navy outline-none md:min-h-12 md:py-2.5 md:text-[14px]"
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute end-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
        aria-hidden
      />
    </div>
  );
}

/** §20 — horizontal day strip with chevrons + touch swipe */
function DaySelector({
  days,
  selectedDay,
  onSelect,
  labelledBy,
  prevLabel,
  nextLabel,
  invalid,
}: {
  days: { day: number; weekday: string }[];
  selectedDay: number | null;
  onSelect: (day: number) => void;
  labelledBy: string;
  prevLabel: string;
  nextLabel: string;
  invalid?: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(false);

  function updateScrollEdges() {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollStart(el.scrollLeft > 4);
    setCanScrollEnd(el.scrollLeft < max - 4);
  }

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateScrollEdges();
    el.addEventListener("scroll", updateScrollEdges, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateScrollEdges) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollEdges);
      ro?.disconnect();
    };
  }, [days]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || selectedDay == null) return;
    const chip = el.querySelector<HTMLElement>(`[data-day="${selectedDay}"]`);
    chip?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [selectedDay, days]);

  function scrollByDir(dir: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(280, Math.max(160, el.clientWidth * 0.7));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  return (
    <div className="dir-ltr-keep flex items-center gap-1.5 sm:gap-2" dir="ltr">
      <button
        type="button"
        onClick={() => scrollByDir(-1)}
        disabled={!canScrollStart}
        aria-label={prevLabel}
        className="touch-target flex h-11 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-navy transition hover:bg-surface disabled:opacity-30 sm:w-10"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={2} aria-hidden />
      </button>

      <div
        ref={scrollerRef}
        className="axis-horizontal-scroll no-scrollbar flex min-w-0 flex-1 snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth py-1 [-webkit-overflow-scrolling:touch]"
        role="listbox"
        aria-labelledby={labelledBy}
        aria-invalid={invalid ? true : undefined}
      >
        {days.map(({ day, weekday }, index) => {
          const selected = selectedDay === day;
          return (
            <button
              key={day}
              type="button"
              role="option"
              aria-selected={selected}
              data-day={day}
              onClick={() => onSelect(day)}
              className={cn(
                "flex shrink-0 snap-center flex-col items-center justify-center rounded-xl border px-3 py-2.5 transition sm:min-w-[3.5rem]",
                selected
                  ? "border-navy bg-navy text-white shadow-[0_4px_12px_rgba(11,44,74,0.2)]"
                  : "border-line bg-white text-navy hover:border-navy/30 hover:bg-[#F8FAFC]",
              )}
            >
              <span className="text-[16px] font-bold leading-none sm:text-[17px]">{day}</span>
              <span
                className={cn(
                  "mt-1 text-[11px] font-medium capitalize tracking-wide",
                  selected ? "text-white/90" : "text-[#5A6B7A]",
                )}
              >
                {weekday}
              </span>
              {index < days.length - 1 ? <span className="sr-only">|</span> : null}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scrollByDir(1)}
        disabled={!canScrollEnd}
        aria-label={nextLabel}
        className="touch-target flex h-11 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-navy transition hover:bg-surface disabled:opacity-30 sm:w-10"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}

function Counter({
  label,
  hint,
  value,
  min,
  max = MAX_TRAVELLERS_PER_CATEGORY,
  onChange,
  icon: Icon,
  imageSrc,
  extra,
  className,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max?: number;
  onChange: (n: number) => void;
  icon?: typeof User;
  imageSrc?: string;
  extra?: React.ReactNode;
  className?: string;
}) {
  const tCommon = useTranslations("common");
  const labelId = useId();

  const stepper = (
    <div
      className="dir-ltr-keep mt-3 flex h-12 items-stretch overflow-hidden rounded-lg border border-line bg-[#F8FAFC] md:h-11"
      dir="ltr"
      role="group"
      aria-labelledby={labelId}
    >
      <button
        type="button"
        className="touch-target flex w-12 shrink-0 items-center justify-center text-xl text-navy transition hover:bg-white disabled:opacity-35"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={tCommon("decrease", { label })}
      >
        −
      </button>
      <div className="flex flex-1 items-center justify-center text-[18px] font-bold text-navy" aria-live="polite">
        {value}
      </div>
      <button
        type="button"
        className="touch-target flex w-12 shrink-0 items-center justify-center text-xl text-navy transition hover:bg-white disabled:opacity-35"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={tCommon("increase", { label })}
      >
        +
      </button>
    </div>
  );

  return (
    <div className={cn("flex h-full flex-col rounded-xl border border-line bg-white p-4 md:p-5", className)}>
      {imageSrc ? (
        <div className="flex items-start gap-3.5">
          <Image
            src={imageSrc}
            alt=""
            width={48}
            height={48}
            className="mt-0.5 h-11 w-11 shrink-0 object-contain md:h-12 md:w-12"
          />
          <div className="min-w-0 flex-1">
            <p id={labelId} className="text-[15px] font-bold text-navy">
              {label}
            </p>
            {hint ? <p className="mt-0.5 text-[12px] leading-snug text-[#5A6B7A]">{hint}</p> : null}
            {stepper}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3">
            {Icon ? <Icon className="mt-0.5 h-5 w-5 shrink-0 text-navy" strokeWidth={1.75} aria-hidden /> : null}
            <div className="min-w-0 flex-1">
              <p id={labelId} className="text-[15px] font-bold text-navy">
                {label}
              </p>
              {hint ? <p className="mt-0.5 text-[12px] leading-snug text-[#5A6B7A]">{hint}</p> : null}
            </div>
          </div>
          {stepper}
        </>
      )}
      {extra ? <div className="mt-4 border-t border-line/80 pt-4">{extra}</div> : null}
    </div>
  );
}

export function IndividualUmrahInquiryForm() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const t = useTranslations("individualUmrah");
  const monthOptions = useMemo(() => buildMonthOptions(locale), [locale]);

  const [airports, setAirports] = useState<string[]>(["vie"]);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [childNeedsBed, setChildNeedsBed] = useState<(boolean | null)[]>([]);
  const [rooms, setRooms] = useState(2);
  /** §15 / §45 — no route default; city-order & nights only appear after a relevant choice */
  const [itinerary, setItinerary] = useState<IndividualUmrahItinerary | "">("");
  /** §15 — no default; required only when Makkah + Medina is selected */
  const [cityOrder, setCityOrder] = useState<IndividualUmrahCityOrder | "">("");
  const [nightsMedina, setNightsMedina] = useState(3);
  const [nightsMakkah, setNightsMakkah] = useState(5);
  /** §18 — month first, then day (no day until month is chosen) */
  const [travelMonth, setTravelMonth] = useState("");
  const [travelDay, setTravelDay] = useState<number | null>(null);
  const [flexibilityDays, setFlexibilityDays] = useState<number | null>(null);
  /** §35 — contact; preferred language follows website locale, editable */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  /** §37 — flag + dial prefix; default from locale, always changeable */
  const [phoneCountry, setPhoneCountry] = useState<IndividualUmrahPhoneCountryCode>(() =>
    defaultPhoneCountryForLocale(locale),
  );
  const [email, setEmail] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<Locale>(locale);
  /** §38 — no default selection */
  const [source, setSource] = useState<SourceOption | "">("");
  const [errors, setErrors] = useState<IndividualUmrahFormErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const draftRestoredRef = useRef(false);

  // Restore Step 1 draft when returning via „Ändern“ (§33 — travel config preserved).
  useEffect(() => {
    if (!draftRestoredRef.current) {
      draftRestoredRef.current = true;
      const draft = readIndividualUmrahDraft();
      if (draft) {
        if (draft.airports.length) setAirports(draft.airports);
        setAdults(draft.adults);
        setChildren(draft.children);
        setInfants(draft.infants);
        setChildNeedsBed(draft.childNeedsBed ?? []);
        setRooms(draft.rooms);
        if (draft.itinerary === "makkah_only" || draft.itinerary === "makkah_medina") {
          setItinerary(draft.itinerary);
        }
        if (draft.cityOrder === "makkah_first" || draft.cityOrder === "medina_first") {
          setCityOrder(draft.cityOrder);
        }
        setNightsMedina(draft.nightsMedina);
        setNightsMakkah(draft.nightsMakkah);
        setTravelMonth(draft.travelMonth);
        setTravelDay(draft.travelDay);
        setFlexibilityDays(draft.flexibilityDays);
        setFirstName(draft.firstName);
        setLastName(draft.lastName);
        setPhone(draft.phone);
        if (
          INDIVIDUAL_UMRAH_PHONE_DIAL_OPTIONS.some((option) => option.code === draft.phoneCountry)
        ) {
          setPhoneCountry(draft.phoneCountry as IndividualUmrahPhoneCountryCode);
        }
        setEmail(draft.email);
        if ((locales as readonly string[]).includes(draft.preferredLanguage)) {
          setPreferredLanguage(draft.preferredLanguage as Locale);
        }
        if ((SOURCE_OPTION_VALUES as readonly string[]).includes(draft.source)) {
          setSource(draft.source as SourceOption);
        }
        return;
      }
    }

    setPreferredLanguage(locale);
    setPhoneCountry(defaultPhoneCountryForLocale(locale));
  }, [locale]);

  const phoneDial =
    INDIVIDUAL_UMRAH_PHONE_DIAL_OPTIONS.find((d) => d.code === phoneCountry)?.dial ?? "+43";

  const selectedMonth =
    monthOptions.find((m) => m.value === travelMonth) ?? monthOptions[0] ?? null;
  const dayCount = selectedMonth ? daysInMonth(selectedMonth.year, selectedMonth.month) : 0;

  const days = useMemo(() => {
    if (!selectedMonth) return [];
    const tag = localeTag(locale);
    return Array.from({ length: dayCount }, (_, i) => {
      const day = i + 1;
      const date = new Date(selectedMonth.year, selectedMonth.month, day);
      const weekdayRaw = date.toLocaleDateString(tag, { weekday: "short" });
      // Normalize "Fr." / "Fr" → compact label for the strip
      const weekday = weekdayRaw.replace(/\.$/, "").slice(0, 2);
      return { day, weekday };
    });
  }, [selectedMonth, dayCount, locale]);

  /**
   * §40 / §45 — Progressive disclosure: only relevant questions appear.
   * Tell us what you need → only see relevant questions → submit → offer.
   * - children > 0 → bed question(s)
   * - makkah_only → never ask city order; Medina nights hidden
   * - makkah_medina → city order + Medina + Makkah nights
   */
  const showChildBedQuestions = children > 0;
  const showBothCitiesRoute = itinerary === "makkah_medina";
  const showCityOrder = showBothCitiesRoute;
  const showMedinaNights = showBothCitiesRoute;

  // §39 — preference-only messages (contact is on the final inquiry page)
  const validationMessages = useMemo(
    () => ({
      airports: t("validationAirports"),
      travellers: t("validationTravellers"),
      rooms: t("validationRooms"),
      itinerary: t("validationItinerary"),
      cityOrder: t("validationOrder"),
      nights: t("validationNights"),
      travelMonth: t("validationTravelMonth"),
      travelDay: t("validationTravelDay"),
      childBed: t("validationChildBed"),
    }),
    [t],
  );

  function toggleAirport(id: string) {
    setAirports((prev) => {
      if (prev.includes(id)) {
        // §7 — at least one departure airport must remain selected
        if (prev.length <= 1) return prev;
        return prev.filter((a) => a !== id);
      }
      return [...prev, id];
    });
  }

  function buildFormData(): IndividualUmrahFormData {
    return {
      airports,
      adults,
      children,
      infants,
      childNeedsBed: showChildBedQuestions ? childNeedsBed : [],
      rooms,
      itinerary,
      cityOrder: showCityOrder ? cityOrder : "",
      nightsMedina: showMedinaNights ? nightsMedina : 0,
      nightsMakkah,
      travelMonth,
      travelDay,
      flexibilityDays,
      firstName,
      lastName,
      phone,
      phoneCountry,
      email,
      preferredLanguage,
      source,
    };
  }

  /** Continue to final inquiry page with preferences in sessionStorage. */
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setSubmitAttempted(true);
    const formData = buildFormData();
    const nextErrors = validateIndividualUmrahPreferences(formData, validationMessages);
    setErrors(nextErrors);
    if (hasIndividualUmrahFormErrors(nextErrors)) {
      requestAnimationFrame(() => {
        document.querySelector('[data-invalid="true"]')?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }
    setLoading(true);
    try {
      writeIndividualUmrahPreferences(formData);
      router.push("/individuelle-umrah/anfrage");
    } finally {
      setLoading(false);
    }
  }

  const trustItems = [
    { label: t("trust1"), iconSrc: TRUST_ICON_USER },
    { label: t("trust2"), iconSrc: TRUST_ICON_SHIELD },
    { label: t("trust3"), iconSrc: TRUST_ICON_CLIPBOARD },
    { label: t("trust4"), iconSrc: TRUST_ICON_GLOBE },
  ];

  return (
    <Container className="relative z-20 -mt-11 pb-12 md:-mt-10 md:pb-20">
      <form
        onSubmit={onSubmit}
        noValidate
        className="mx-auto flex w-full max-w-7xl flex-col"
        aria-label={t("formAriaLabel")}
      >
        {/*
          §46 / §47 — Desktop & mobile share the same step order (1–7) in one column.
          Conditional blocks (beds, city order, nights, days) only mount when relevant (§45)
          so the mobile page stays scannable even when several follow-ups appear.
        */}
        <div className={formShellClass}>
          {/* 1 — Departure airports */}
          <section
            aria-labelledby="iu-step-1"
            className={cn(mobileStepCardClass, "md:flex md:items-center md:gap-6 lg:gap-8 xl:gap-10")}
          >
            <SectionHeader
              step={1}
              title={t("step1Title")}
              hint={t("step1Hint")}
              titleId="iu-step-1"
              className="mb-4 md:mb-0 md:shrink-0 md:w-[11.5rem] lg:w-[13.5rem]"
            />
            <div className="min-w-0 flex-1">
              <div
                className="grid grid-cols-1 gap-2.5 md:grid-cols-4 md:gap-2.5 lg:gap-3"
                role="group"
                aria-label={t("step1Title")}
              >
                {INDIVIDUAL_UMRAH_AIRPORTS.map((airport) => {
                  const selected = airports.includes(airport.id);
                  return (
                    <button
                      key={airport.id}
                      type="button"
                      role="checkbox"
                      aria-checked={selected}
                      onClick={() => toggleAirport(airport.id)}
                      className={cn(
                        "flex w-full touch-target min-h-14 items-center gap-2.5 rounded-xl border px-3 py-3.5 text-start text-[14px] font-semibold transition md:min-h-12 md:px-3 md:py-3 lg:gap-3 lg:px-3.5 lg:text-[14px]",
                        selected ? airportSelectedClass : idleChipClass,
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border",
                          selected ? "border-white bg-white" : "border-[#C5CDD6] bg-transparent",
                        )}
                      >
                        {selected ? <Check className="h-3.5 w-3.5 text-navy" strokeWidth={3} aria-hidden /> : null}
                      </span>
                      <span className="min-w-0 truncate">{t(airport.labelKey)}</span>
                    </button>
                  );
                })}
              </div>
              <FieldError message={submitAttempted ? errors.airports : undefined} />
            </div>
          </section>

          {/* 2 — Travellers */}
          <section className={cn(mobileStepCardClass, stepDividerClass, stepRowClass)} aria-labelledby="iu-step-2">
            <SectionHeader step={2} title={t("step2Title")} hint={t("step2Hint")} titleId="iu-step-2" />
            <div>
              <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:items-start md:gap-4">
                {/* §8 — Adults: min 1; §9 — 12+ on return */}
                <Counter label={t("adultsLabel")} hint={t("adultsHint")} value={adults} min={1} onChange={setAdults} icon={User} />
                <Counter
                  label={t("childrenLabel")}
                  hint={t("childrenHint")}
                  value={children}
                  min={0}
                  onChange={(n) => {
                    setChildren(n);
                    setChildNeedsBed((prev) => resizeChildNeedsBed(prev, n));
                  }}
                  icon={Users}
                  extra={
                    showChildBedQuestions ? (
                      <div className="individual-umrah-reveal space-y-3">
                        {Array.from({ length: children }, (_, index) => {
                          const questionId = `child-bed-question-${index}`;
                          const answer = childNeedsBed[index] ?? null;
                          const showChildLabel = children > 1;
                          return (
                            <div key={index} className={children > 1 ? "rounded-lg border border-line bg-[#F8FAFC] p-3" : undefined}>
                              {showChildLabel ? (
                                <p className="mb-1.5 text-[13px] font-bold text-navy">{t("childLabel", { n: index + 1 })}</p>
                              ) : null}
                              <p id={questionId} className="text-[13px] font-medium leading-snug text-navy">
                                {t("childBedQuestion")}
                              </p>
                              <div
                                className="mt-3 flex flex-wrap gap-x-5 gap-y-2"
                                role="radiogroup"
                                aria-labelledby={questionId}
                              >
                                {(["yes", "no"] as const).map((opt) => {
                                  const selected = opt === "yes" ? answer === true : answer === false;
                                  return (
                                    <label
                                      key={opt}
                                      className="flex min-h-10 cursor-pointer items-center gap-2.5 text-[14px] font-medium text-navy"
                                    >
                                      <input
                                        type="radio"
                                        name={`childBed-${index}`}
                                        className="h-4 w-4 accent-navy"
                                        checked={selected}
                                        onChange={() =>
                                          setChildNeedsBed((prev) => {
                                            const next = resizeChildNeedsBed(prev, children);
                                            next[index] = opt === "yes";
                                            return next;
                                          })
                                        }
                                      />
                                      {opt === "yes" ? t("childBedYes") : t("childBedNo")}
                                    </label>
                                  );
                                })}
                              </div>
                              {submitAttempted && answer === null && errors.childBed ? (
                                <FieldError message={errors.childBed} />
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : null
                  }
                />
                {/* §8 — Babys; §9 — under 2 on return */}
                <Counter label={t("infantsLabel")} hint={t("infantsHint")} value={infants} min={0} onChange={setInfants} icon={Baby} />
              </div>
              <FieldError message={submitAttempted ? errors.travellers : undefined} />
            </div>
          </section>

          {/* 3 — Number of rooms */}
          <section className={cn(mobileStepCardClass, stepDividerClass, stepRowClass)} aria-labelledby="iu-step-3">
            <SectionHeader step={3} title={t("step3Title")} hint={t("step3Hint")} titleId="iu-step-3" />
            <div>
              <div className="grid gap-4 md:grid-cols-2 md:items-stretch md:gap-5">
                <div className="space-y-3">
                  <label className="block">
                    <span className="mb-3 block text-[15px] font-bold text-navy md:sr-only">{t("step3Title")}</span>
                    <div className="relative">
                      <BedDouble
                        className="pointer-events-none absolute start-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-navy"
                        aria-hidden
                      />
                      <select
                        value={rooms >= INDIVIDUAL_UMRAH_ROOMS_SIX_PLUS_MIN ? "6+" : String(rooms)}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "6+") {
                            setRooms((prev) =>
                              prev >= INDIVIDUAL_UMRAH_ROOMS_SIX_PLUS_MIN
                                ? prev
                                : INDIVIDUAL_UMRAH_ROOMS_SIX_PLUS_MIN,
                            );
                            return;
                          }
                          setRooms(Number(value));
                        }}
                        className={cn(
                          selectClass,
                          "min-h-14 w-full cursor-pointer rounded-xl border-line ps-11 pe-11 text-[15px] font-semibold shadow-none md:min-h-[3.25rem]",
                        )}
                        aria-invalid={submitAttempted && errors.rooms ? true : undefined}
                      >
                        {INDIVIDUAL_UMRAH_ROOM_PRESETS.map((n) => (
                          <option key={n} value={n}>
                            {t("roomsOption", { count: n })}
                          </option>
                        ))}
                        <option value="6+">{t("roomsSixPlus")}</option>
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy"
                        aria-hidden
                      />
                    </div>
                  </label>

                  {rooms >= INDIVIDUAL_UMRAH_ROOMS_SIX_PLUS_MIN ? (
                    <label className="block">
                      <span className="mb-1.5 block text-[13px] font-medium text-navy">{t("roomsCustomLabel")}</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={INDIVIDUAL_UMRAH_ROOMS_SIX_PLUS_MIN}
                        max={MAX_INDIVIDUAL_ROOMS}
                        value={rooms}
                        onChange={(e) => {
                          const next = Number(e.target.value);
                          if (!Number.isFinite(next)) return;
                          setRooms(
                            Math.min(
                              MAX_INDIVIDUAL_ROOMS,
                              Math.max(INDIVIDUAL_UMRAH_ROOMS_SIX_PLUS_MIN, Math.floor(next)),
                            ),
                          );
                        }}
                        className={cn(inputClass, "min-h-14 md:min-h-12")}
                        aria-invalid={submitAttempted && errors.rooms ? true : undefined}
                      />
                      <span className="mt-1.5 block text-[12px] text-muted">
                        {t("roomsCustomHint", {
                          min: INDIVIDUAL_UMRAH_ROOMS_SIX_PLUS_MIN,
                          max: MAX_INDIVIDUAL_ROOMS,
                        })}
                      </span>
                    </label>
                  ) : null}
                </div>
                <div className="flex gap-3 rounded-xl border border-[#D7E3EF] bg-[#F3F7FB] p-4 md:min-h-[3.25rem] md:items-center">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-navy md:mt-0" aria-hidden />
                  <p className="text-[13px] leading-relaxed text-navy/80 md:text-[14px]">{t("roomsInfo")}</p>
                </div>
              </div>
              <FieldError message={submitAttempted ? errors.rooms : undefined} />
            </div>
          </section>

          {/* 4 — Travel route (+ city order only when Makkah + Medina, §45) */}
          <section className={cn(mobileStepCardClass, stepDividerClass, stepRowClass)} aria-labelledby="iu-step-4">
            <SectionHeader step={4} title={t("step4Title")} hint={t("step4Hint")} titleId="iu-step-4" />
            <div>
              <div
                className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4"
                role="radiogroup"
                aria-label={t("step4Title")}
              >
                {(
                  [
                    {
                      value: "makkah_only" as const,
                      label: t("itineraryMakkahOnly"),
                      description: t("itineraryMakkahOnlyDesc"),
                      icon: ICON_KAABA,
                    },
                    {
                      value: "makkah_medina" as const,
                      label: t("itineraryBoth"),
                      description: t("itineraryBothDesc"),
                      icon: ICON_MEDINA,
                    },
                  ] as const
                ).map((opt) => {
                  const selected = itinerary === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => {
                        setItinerary(opt.value);
                        // §15 / §45 — city-order only for Makkah + Medina; hide selection for Nur Makkah
                        if (opt.value === "makkah_only") {
                          setCityOrder("");
                          setErrors((prev) => {
                            if (!prev.cityOrder) return prev;
                            const next = { ...prev };
                            delete next.cityOrder;
                            return next;
                          });
                        } else {
                          setCityOrder((prev) => prev || "makkah_first");
                        }
                      }}
                      className={cn(
                        "relative flex w-full items-start gap-3.5 rounded-xl border-2 bg-white p-4 text-start transition md:gap-4 md:p-5",
                        selected
                          ? "border-navy shadow-[0_2px_12px_rgba(11,44,74,0.08)]"
                          : "border-line hover:border-navy/30",
                      )}
                    >
                      <Image
                        src={opt.icon}
                        alt=""
                        width={56}
                        height={56}
                        className="mt-0.5 h-12 w-12 shrink-0 object-contain md:h-14 md:w-14"
                      />
                      <span className="min-w-0 flex-1 pe-8">
                        <span className="block text-[16px] font-bold leading-snug text-navy md:text-[17px]">
                          {opt.label}
                        </span>
                        <span className="mt-1.5 block text-[13px] leading-relaxed text-[#5A6B7A] md:text-[14px]">
                          {opt.description}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "absolute end-3.5 top-3.5 flex h-6 w-6 items-center justify-center rounded-full border-2 md:end-4 md:top-4",
                          selected ? "border-navy bg-navy text-white" : "border-[#C5CDD6] bg-white",
                        )}
                        aria-hidden
                      >
                        {selected ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
              <FieldError message={submitAttempted ? errors.itinerary : undefined} />

              {/* §15 / §30 / §44 — city order choices live in step 4 (with itinerary) */}
              <div className="mt-6 md:mt-7">
                <p id="city-order-title" className="mb-3.5 text-[14px] font-semibold text-navy md:text-[15px]">
                  {t("orderTitle")}
                </p>
                <div
                  className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4"
                  role="radiogroup"
                  aria-labelledby="city-order-title"
                >
                  {(
                    [
                      {
                        value: "makkah_first" as const,
                        label: t("orderMakkahFirst"),
                        fromIcon: ICON_KAABA,
                        toIcon: ICON_MEDINA,
                        fromName: t("cityMakkah"),
                        toName: t("cityMedina"),
                      },
                      {
                        value: "medina_first" as const,
                        label: t("orderMedinaFirst"),
                        fromIcon: ICON_MEDINA,
                        toIcon: ICON_KAABA,
                        fromName: t("cityMedina"),
                        toName: t("cityMakkah"),
                      },
                    ] as const
                  ).map((opt) => {
                    const selected = cityOrder === opt.value;
                    const sequenceLabel = t("orderSequenceAria", {
                      from: opt.fromName,
                      to: opt.toName,
                    });
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        aria-label={sequenceLabel}
                        onClick={() => {
                          // Choosing a city order implies Makkah + Medina
                          setItinerary("makkah_medina");
                          setCityOrder(opt.value);
                          setErrors((prev) => {
                            if (!prev.itinerary && !prev.cityOrder) return prev;
                            const next = { ...prev };
                            delete next.itinerary;
                            delete next.cityOrder;
                            return next;
                          });
                        }}
                        className={cn(
                          "flex w-full min-h-14 items-center gap-2.5 rounded-xl border-2 bg-white px-3.5 py-3.5 text-start transition md:gap-3 md:px-4",
                          selected
                            ? "border-navy shadow-[0_2px_10px_rgba(11,44,74,0.08)]"
                            : "border-line hover:border-navy/30",
                        )}
                      >
                        <Image
                          src={opt.fromIcon}
                          alt=""
                          width={36}
                          height={36}
                          className="h-9 w-9 shrink-0 object-contain"
                        />
                        <span className="text-[14px] font-bold leading-snug text-navy md:text-[15px]">
                          {opt.label}
                        </span>
                        <DirArrow className="shrink-0 text-[15px] text-navy" aria-hidden />
                        <Image
                          src={opt.toIcon}
                          alt=""
                          width={36}
                          height={36}
                          className="h-9 w-9 shrink-0 object-contain"
                        />
                        <span
                          className={cn(
                            "ms-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                            selected ? "border-navy bg-navy text-white" : "border-[#C5CDD6] bg-white",
                          )}
                          aria-hidden
                        >
                          {selected ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <FieldError message={submitAttempted ? errors.cityOrder : undefined} />
              </div>
            </div>
          </section>

          {/* 5 — Nächte (always after step 4) */}
          <section
            className={cn(mobileStepCardClass, stepDividerClass, "md:flex md:items-center md:gap-6 lg:gap-8 xl:gap-10")}
            aria-labelledby="iu-step-5"
          >
            <SectionHeader
              step={5}
              title={t("step5Title")}
              hint={t("step5Hint")}
              titleId="iu-step-5"
              className="md:mb-0 md:shrink-0 md:w-[11.5rem] lg:w-[13.5rem]"
            />
            <div className="min-w-0 flex-1">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
                <Counter
                  label={t("nightsMedina")}
                  hint=""
                  value={nightsMedina}
                  min={MIN_NIGHTS_PER_CITY}
                  max={MAX_NIGHTS_PER_CITY}
                  onChange={(n) => {
                    setNightsMedina(n);
                    // Medina nights imply Makkah + Medina route
                    setItinerary((prev) => (prev === "makkah_only" ? "makkah_medina" : prev || "makkah_medina"));
                    setCityOrder((prev) => prev || "makkah_first");
                  }}
                  imageSrc={ICON_MEDINA}
                />
                <Counter
                  label={t("nightsMakkah")}
                  hint=""
                  value={nightsMakkah}
                  min={MIN_NIGHTS_PER_CITY}
                  max={MAX_NIGHTS_PER_CITY}
                  onChange={setNightsMakkah}
                  imageSrc={ICON_KAABA}
                />
              </div>
              <FieldError message={submitAttempted ? errors.nights : undefined} />
            </div>
          </section>

          {/* 6 — Reisebeginn */}
          <section
            className={cn(
              mobileStepCardClass,
              stepDividerClass,
              "md:flex md:items-start md:gap-6 lg:gap-8 xl:gap-10",
            )}
            aria-labelledby="iu-step-6"
          >
            <SectionHeader
              step={6}
              title={t("step6Title")}
              hint={t("step6Hint")}
              titleId="iu-step-6"
              className="md:mb-0 md:shrink-0 md:w-[11.5rem] lg:w-[13.5rem]"
            />
            <div className="min-w-0 flex-1 space-y-4 md:space-y-5">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(12rem,16rem)_minmax(0,1fr)] lg:items-start lg:gap-5">
                <label className="block w-full">
                  <span className="mb-1.5 block text-[13px] font-medium text-[#5A6B7A] md:text-[13px]">
                    {t("monthLabel")}
                  </span>
                  <div className="relative">
                    {/* §19 — placeholder + rolling 12–18 month window */}
                    <select
                      value={travelMonth}
                      onChange={(e) => {
                        setTravelMonth(e.target.value);
                        setTravelDay(null);
                      }}
                      className={cn(
                        selectClass,
                        "min-h-12 w-full cursor-pointer rounded-xl font-semibold shadow-none md:min-h-[3rem]",
                      )}
                      aria-invalid={submitAttempted && errors.travelMonth ? true : undefined}
                    >
                      <option value="">{t("monthPlaceholder")}</option>
                      {monthOptions.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy"
                      aria-hidden
                    />
                  </div>
                  <FieldError message={submitAttempted ? errors.travelMonth : undefined} />
                </label>

                <div className="w-full min-w-0">
                  <p id="travel-day-label" className="mb-1.5 text-[13px] font-medium text-[#5A6B7A]">
                    {t("dayLabel")}
                  </p>
                  {/* §20 / §32 — horizontal swipe day carousel with ‹ › */}
                  <DaySelector
                    days={days}
                    selectedDay={travelDay}
                    onSelect={(day) => {
                      if (!travelMonth && selectedMonth) {
                        setTravelMonth(selectedMonth.value);
                      }
                      setTravelDay(day);
                    }}
                    labelledBy="travel-day-label"
                    prevLabel={t("dayPrev")}
                    nextLabel={t("dayNext")}
                    invalid={submitAttempted && Boolean(errors.travelDay)}
                  />
                  <FieldError message={submitAttempted ? errors.travelDay : undefined} />
                </div>
              </div>

              {/* §21 / §32 / §39 / §40 — flexibility ±1…±4 as in design */}
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
                <p className="shrink-0 text-[13px] font-semibold text-navy md:text-[14px]">
                  {t("flexibilityLabel")}
                </p>
                <div
                  className="flex flex-wrap gap-2.5"
                  role="radiogroup"
                  aria-label={t("flexibilityLabel")}
                >
                  {([1, 2, 3, 4] as const).map((daysFlex) => {
                    const selected = flexibilityDays === daysFlex;
                    return (
                      <button
                        key={daysFlex}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() =>
                          setFlexibilityDays((prev) => (prev === daysFlex ? null : daysFlex))
                        }
                        className={cn(
                          "min-h-10 rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition",
                          selected ? selectedChipClass : idleChipClass,
                        )}
                      >
                        {t("flexibilityDays", { days: daysFlex })}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* After preferences → continue to final inquiry page */}
        <div className="mt-5 flex flex-col gap-5 md:mt-8 md:gap-6">
          <div className="flex flex-col gap-4 md:hidden">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)]">
              <h2 className="mb-5 text-[17px] font-bold text-navy">{t("howItWorksTitle")}</h2>
              <ol className="space-y-5">
                {(
                  [
                    { title: t("howStep1Title"), body: t("howStep1Body"), iconSrc: HOW_ICON_SEND },
                    { title: t("howStep2Title"), body: t("howStep2Body"), iconSrc: HOW_ICON_OFFER },
                    { title: t("howStep3Title"), body: t("howStep3Body"), iconSrc: HOW_ICON_KAABA },
                  ] as const
                ).map(({ title, body, iconSrc }, i) => (
                  <li key={title} className="flex items-start gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F5F9FD] ring-1 ring-brand-cta/15">
                      <Image
                        src={iconSrc}
                        alt=""
                        width={28}
                        height={28}
                        className="h-7 w-7 object-contain"
                      />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[14px] font-bold text-navy">
                        <span className="me-1.5 text-muted">{i + 1}.</span>
                        {title}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl border border-brand-orange/20 bg-[#FFFCF8] p-5">
              <h2 className="mb-3.5 text-[17px] font-bold text-navy">{t("benefitsTitle")}</h2>
              <ul className="relative space-y-3.5 ps-0.5">
                {/* Faint vertical connector through gold check circles (reference) */}
                <span
                  className="pointer-events-none absolute start-[9px] top-2.5 bottom-2.5 w-px bg-[#E6DCCE]"
                  aria-hidden
                />
                {[t("benefit1"), t("benefit2"), t("benefit3"), t("benefit4")].map((benefit) => (
                  <li key={benefit} className="relative flex items-start gap-3 text-[14px] leading-snug text-navy">
                    <span
                      className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#C67D2A] shadow-[0_0_0_3px_#FFFCF8]"
                      aria-hidden
                    >
                      <Check className="h-[11px] w-[11px] text-white" strokeWidth={3.25} />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            role="note"
            className="flex items-start gap-3 rounded-2xl border border-[#D7E3EF] bg-[#F3F7FB] p-5 md:gap-3.5 md:p-6"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-white"
              aria-hidden
            >
              <Info className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <p className="pt-1.5 text-[14px] leading-relaxed text-navy md:text-[15px]">{t("continueBanner")}</p>
          </div>

          <div className="w-full">
            <button type="submit" disabled={loading} className={ctaBtnClass} aria-busy={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  {t("continuing")}
                </>
              ) : (
                <>
                  {t("continueCta")}
                  <DirArrow className="text-[1.05em]" />
                </>
              )}
            </button>
            <p className="mt-3 flex items-center justify-center gap-2 text-[13px] font-medium text-navy">
              <Lock className="h-4 w-4 text-navy" aria-hidden />
              {t("submitFree")}
            </p>
          </div>
        </div>

        {/* Trust strip — 4-across row in white card (mobile reference) */}
        <section
          className="mt-8 rounded-[1.25rem] border border-line bg-white px-2.5 pb-7 pt-9 shadow-[0_8px_28px_rgba(11,44,74,0.06)] md:mt-12 md:rounded-none md:border-0 md:border-t md:bg-transparent md:px-0 md:pb-0 md:pt-10 md:shadow-none"
          aria-label={t("trust1")}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {trustItems.map(({ label, iconSrc }) => (
              <div key={label} className="flex items-start gap-3">
                <Image
                  src={iconSrc}
                  alt=""
                  width={36}
                  height={36}
                  className="mt-0.5 h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
                />
                <span className="text-[12px] font-semibold leading-[1.35] text-navy sm:text-[13px]">{label}</span>
              </div>
            ))}
          </div>
        </section>
      </form>
    </Container>
  );
}
