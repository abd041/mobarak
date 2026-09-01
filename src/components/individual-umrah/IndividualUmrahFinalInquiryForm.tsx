"use client";

/**
 * Individual Umrah — final inquiry (Step 2)
 *
 * §37 Final design rule: reproduce approved Desktop/Mobile screenshots as closely
 * as technically possible. Prefer clean, premium, uncrowded Mobarak branding.
 * Do not invent new visual components unless required for responsive behaviour.
 */

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  Check,
  ChevronDown,
  Info,
  Loader2,
  Lock,
  Pencil,
  Send,
  Shield,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { NationalityCombobox, type NationalityValue } from "@/components/ui/NationalityCombobox";
import {
  INDIVIDUAL_UMRAH_ADDONS,
  INDIVIDUAL_UMRAH_AIRLINES,
  INDIVIDUAL_UMRAH_PASSPORT_TYPES,
  INDIVIDUAL_UMRAH_TRAVEL_PRIORITIES,
  addonsForItinerary,
  pruneAddonsForItinerary,
  transferCopyKeys,
  type IndividualUmrahAddonId,
  type IndividualUmrahAirlineId,
  type IndividualUmrahTravelPriorityId,
} from "@/data/individual-umrah-final";
import {
  INDIVIDUAL_UMRAH_AIRPORTS,
  INDIVIDUAL_UMRAH_PHONE_DIAL_OPTIONS,
  type IndividualUmrahPhoneCountryCode,
} from "@/data/individual-umrah";
import { Link, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import {
  clearIndividualUmrahDraft,
  readIndividualUmrahDraft,
  writeIndividualUmrahFinalDetails,
  type IndividualUmrahDraft,
  type IndividualUmrahFinalDetails,
} from "@/lib/individual-umrah-draft";
import { buildIndividualUmrahInquiry } from "@/lib/individual-umrah-inquiry";
import { addIndividualUmrahInquiry } from "@/lib/individual-umrah-inquiries-store";
import { buildRequestedStartDate } from "@/lib/individual-umrah-date";
import { findCountryByCode } from "@/lib/countries";
import type { PaxFieldErrors, PaxFormData } from "@/lib/inquiry-form-validation";
import { mergePaxByCounts, paxTypeIndex } from "@/lib/inquiry-pax";
import { cn } from "@/lib/utils";

const SOURCE_OPTIONS = [
  { value: "instagram", labelKey: "sourceInstagram" },
  { value: "facebook", labelKey: "sourceFacebook" },
  { value: "google", labelKey: "sourceGoogle" },
  { value: "chatgpt", labelKey: "sourceChatgpt" },
  { value: "friend", labelKey: "sourceFriend" },
  { value: "know", labelKey: "sourceKnow" },
  { value: "other", labelKey: "sourceOther" },
] as const;

const LANGUAGE_OPTIONS: { value: Locale; labelKey: string }[] = [
  { value: "de", labelKey: "languageGerman" },
  { value: "ar", labelKey: "languageArabic" },
  { value: "tr", labelKey: "languageTurkish" },
  { value: "bs", labelKey: "languageBosnian" },
  { value: "en", labelKey: "languageEnglish" },
];

/** §37 — same premium shell language as Step 1 */
const formShellClass =
  "rounded-2xl border border-line bg-white p-4 shadow-[var(--shadow-card)] sm:p-5 md:p-8 lg:rounded-[1.25rem] lg:p-10 lg:shadow-[var(--shadow-card-lg)]";
/** Breathing room between sections without overcrowding on mobile */
const sectionDividerClass = "mt-7 border-t border-line pt-7 md:mt-10 md:pt-10";
/** Trust strip — ChatGPT sheet Sep 1, 03:23 */
const TRUST_ICON_USER = "/brand/icons/individual-umrah/trust/user.png";
const TRUST_ICON_SHIELD = "/brand/icons/individual-umrah/trust/shield.png";
const TRUST_ICON_CLIPBOARD = "/brand/icons/individual-umrah/trust/clipboard.png";
const TRUST_ICON_GLOBE = "/brand/icons/individual-umrah/trust/globe.png";
/** Summary strip — ChatGPT sheet Sep 1, 03:49 */
const SUMMARY_ICON_AIRPORTS = "/brand/icons/individual-umrah/summary/airports.png";
const SUMMARY_ICON_TRAVELLERS = "/brand/icons/individual-umrah/summary/travellers.png";
const SUMMARY_ICON_ROUTE = "/brand/icons/individual-umrah/summary/route.png";
const SUMMARY_ICON_NIGHTS = "/brand/icons/individual-umrah/summary/nights.png";
const SUMMARY_ICON_DATE = "/brand/icons/individual-umrah/summary/date.png";
const inputClass =
  "min-h-12 w-full rounded-xl border border-line bg-white px-4 py-3.5 text-[15px] text-navy shadow-[inset_0_1px_2px_rgba(11,44,74,0.03)] outline-none transition placeholder:text-muted/55 focus:border-brand-cta focus:ring-2 focus:ring-brand-cta/12";
const selectClass = cn(inputClass, "appearance-none pe-10");
const tableInputClass =
  "min-h-11 w-full min-w-0 rounded-xl border border-line bg-white px-3 py-2.5 text-[13px] text-navy shadow-[inset_0_1px_2px_rgba(11,44,74,0.03)] outline-none transition placeholder:text-muted/55 focus:border-brand-cta focus:ring-2 focus:ring-brand-cta/12";
const tableSelectClass = cn(tableInputClass, "appearance-none pe-8");
/** §30 / §37 — navy CTA, full form width, not sticky */
const submitCtaClass =
  "flex min-h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-navy px-5 text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(11,44,74,0.22)] transition hover:bg-navy-deep active:bg-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-60 md:min-h-15 md:text-[16px]";

/** §35 — mobile accordion; all six sections expanded on initial load */
type FormSectionId = 1 | 2 | 3 | 4 | 5 | 6;

const DEFAULT_OPEN_SECTIONS: Record<FormSectionId, boolean> = {
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
};

type FinalInquiryErrors = {
  pax: PaxFieldErrors[];
  phone?: string;
  email?: string;
  preferredLanguage?: string;
  source?: string;
};

type ValidationMessages = {
  firstName: string;
  lastName: string;
  nationality: string;
  passportType: string;
  phone: string;
  email: string;
  preferredLanguage: string;
  source: string;
};

function localeTag(locale: Locale): string {
  if (locale === "de") return "de-AT";
  if (locale === "ar") return "ar-SA";
  if (locale === "bs") return "bs-BA";
  if (locale === "tr") return "tr-TR";
  return "en-GB";
}

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

function isPhoneCountry(value: string): value is IndividualUmrahPhoneCountryCode {
  return INDIVIDUAL_UMRAH_PHONE_DIAL_OPTIONS.some((option) => option.code === value);
}

function isAirlineId(value: string): value is IndividualUmrahAirlineId {
  return INDIVIDUAL_UMRAH_AIRLINES.some((option) => option.id === value);
}

/** Per-logo sizing — wide wordmarks vs compact marks (reference Step 3). */
const AIRLINE_LOGO_CLASS: Partial<Record<IndividualUmrahAirlineId, string>> = {
  turkish: "max-h-[4.75rem] w-auto max-w-[4.75rem]",
  wizz_budapest: "max-h-[4rem] w-[90%] max-w-[10.5rem]",
};

const AIRLINE_LOGO_DEFAULT_CLASS =
  "max-h-[4.75rem] w-[94%] max-w-[12.5rem] object-contain sm:max-h-20";

function isAddonId(value: string): value is IndividualUmrahAddonId {
  return INDIVIDUAL_UMRAH_ADDONS.some((option) => option.id === value);
}

function isTravelPriorityId(value: string): value is IndividualUmrahTravelPriorityId {
  return INDIVIDUAL_UMRAH_TRAVEL_PRIORITIES.some((option) => option.id === value);
}

function formatTravelDate(draft: IndividualUmrahDraft, locale: Locale): string | null {
  const iso = buildRequestedStartDate(draft.travelMonth, draft.travelDay);
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat(localeTag(locale), {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * §32 — Submission validation
 * Required: traveller first/last name, nationality, passport type; phone;
 * preferred language; “Wo haben Sie uns gefunden?”
 * Optional (never block submit): preferred airline, add-ons, email
 * (email is format-checked only when filled).
 */
function validateFinalInquiry(
  locale: Locale,
  paxData: PaxFormData[],
  phone: string,
  email: string,
  preferredLanguage: Locale | "",
  source: string,
  messages: ValidationMessages,
): FinalInquiryErrors {
  const errors: FinalInquiryErrors = { pax: [] };

  paxData.forEach((pax, index) => {
    const paxErrors: PaxFieldErrors = {};
    if (!pax.firstName.trim()) paxErrors.firstName = messages.firstName;
    if (!pax.lastName.trim()) paxErrors.lastName = messages.lastName;

    const country = pax.nationalityCode
      ? findCountryByCode(locale, pax.nationalityCode)
      : undefined;
    if (!country || country.name !== pax.nationality) {
      paxErrors.nationality = messages.nationality;
    }
    if (!pax.passportType) paxErrors.passportType = messages.passportType;
    errors.pax[index] = paxErrors;
  });

  if (phone.replace(/\D/g, "").length < 6) errors.phone = messages.phone;
  // Email optional — validate format only when provided
  if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = messages.email;
  }
  if (!preferredLanguage) errors.preferredLanguage = messages.preferredLanguage;
  if (!source.trim()) errors.source = messages.source;

  // Airline + add-ons intentionally omitted — optional per §32

  return errors;
}

function hasFinalInquiryErrors(errors: FinalInquiryErrors): boolean {
  return Boolean(
    errors.phone ||
      errors.email ||
      errors.preferredLanguage ||
      errors.source ||
      errors.pax.some((paxErrors) => Object.keys(paxErrors).length > 0),
  );
}

function FormSection({
  step,
  title,
  hint,
  headingId,
  open,
  onToggle,
  action,
  className,
  hideDesktopHint,
  titleSerif,
  children,
}: {
  step: FormSectionId;
  title: string;
  hint: string;
  headingId: string;
  open: boolean;
  onToggle: () => void;
  action?: ReactNode;
  className?: string;
  hideDesktopHint?: boolean;
  titleSerif?: boolean;
  children: ReactNode;
}) {
  const panelId = `${headingId}-panel`;

  return (
    <section className={className} aria-labelledby={headingId}>
      {/* §35 Mobile: accordion headers (arrows stay); sections start expanded */}
      <div className="mb-4 md:hidden">
        <div className="flex items-stretch gap-2">
          <button
            type="button"
            id={headingId}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={onToggle}
            className="flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-xl border border-line bg-[#FFFCF8] px-3.5 py-3 text-start shadow-[0_1px_2px_rgba(11,44,74,0.04)] transition hover:bg-[#FFF8EE] active:bg-[#FFF3E0]"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-[12px] font-bold text-white ring-2 ring-brand-gold/25"
              aria-hidden
            >
              {step}
            </span>
            <span className="min-w-0 flex-1 text-[15px] font-bold leading-snug tracking-[-0.01em] text-navy">
              {title}
            </span>
            <ChevronDown
              className={cn(
                "h-5 w-5 shrink-0 text-[#6B7C8F] transition-transform duration-200",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </button>
          {action ? <div className="flex shrink-0 items-center">{action}</div> : null}
        </div>
        {open ? (
          <p className="mt-2.5 px-1 text-[13px] leading-relaxed text-muted">{hint}</p>
        ) : null}
      </div>

      {/* Desktop: static numbered header — always expanded */}
      <div className="mb-5 hidden items-start justify-between gap-3 md:mb-6 md:flex">
        <div className="flex min-w-0 gap-3.5">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-[13px] font-bold text-white ring-2 ring-brand-gold/25"
            aria-hidden
          >
            {step}
          </span>
          <div className="min-w-0 pt-0.5">
            <h2
              className={cn(
                "text-[19px] font-bold leading-snug tracking-[-0.01em] text-navy",
                titleSerif && "font-serif text-[20px] md:text-[22px]",
              )}
            >
              {title}
            </h2>
            {hideDesktopHint ? null : (
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{hint}</p>
            )}
          </div>
        </div>
        {action ? <div className="shrink-0 pt-0.5">{action}</div> : null}
      </div>

      {/* Content: always visible on desktop; collapsible on mobile only */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        className={cn(!open && "max-md:hidden")}
      >
        {children}
      </div>
    </section>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-2 text-[12px] leading-snug text-red-600" role="alert">
      {message}
    </p>
  );
}

function SummaryItem({
  iconSrc,
  label,
  lines,
}: {
  iconSrc: string;
  label: string;
  lines: string[];
}) {
  const display = lines.filter(Boolean);
  return (
    <div className="flex min-w-0 items-start gap-3 border-t border-line bg-white px-4 py-4 first:border-t-0 sm:gap-3.5 sm:px-5 sm:py-5 lg:border-t-0 lg:border-e lg:border-line/70 lg:px-5 lg:py-5 lg:last:border-e-0">
      <Image
        src={iconSrc}
        alt=""
        width={40}
        height={40}
        className="mt-0.5 h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold leading-snug text-navy sm:text-[14px]">{label}</p>
        <div className="mt-1 space-y-0.5 text-[12px] font-normal leading-relaxed text-navy sm:text-[13px]">
          {display.length > 0 ? (
            display.map((line, index) => <p key={`${label}-${index}`}>{line}</p>)
          ) : (
            <p>—</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** §25 — single country selector: 🇦🇹 +43 ▼ | national number */
function PhoneCountrySelect({
  value,
  onChange,
  ariaLabel,
}: {
  value: IndividualUmrahPhoneCountryCode;
  onChange: (value: IndividualUmrahPhoneCountryCode) => void;
  ariaLabel: string;
}) {
  const selected =
    INDIVIDUAL_UMRAH_PHONE_DIAL_OPTIONS.find((option) => option.code === value) ??
    INDIVIDUAL_UMRAH_PHONE_DIAL_OPTIONS[0];

  return (
    <div className="relative shrink-0 bg-white">
      <select
        value={value}
        onChange={(event) => {
          if (isPhoneCountry(event.target.value)) onChange(event.target.value);
        }}
        aria-label={ariaLabel}
        className="h-full min-h-12 w-[8.5rem] cursor-pointer appearance-none border-0 bg-transparent py-3 ps-2.5 pe-7 text-transparent outline-none"
      >
        {INDIVIDUAL_UMRAH_PHONE_DIAL_OPTIONS.map((option) => (
          <option key={option.code} value={option.code} className="text-navy">
            {option.flag} {option.dial}
          </option>
        ))}
      </select>
      <span
        className="pointer-events-none absolute inset-y-0 start-0 flex items-center gap-1.5 ps-2.5 pe-7 text-[14px] text-navy"
        aria-hidden
      >
        <span className="text-[16px] leading-none">{selected.flag}</span>
        <span className="tabular-nums">{selected.dial}</span>
      </span>
      <ChevronDown
        className="pointer-events-none absolute inset-e-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
        aria-hidden
      />
    </div>
  );
}

function toNationalityValue(pax: PaxFormData): NationalityValue {
  return pax.nationalityCode && pax.nationality
    ? { code: pax.nationalityCode, name: pax.nationality }
    : null;
}

export function IndividualUmrahFinalInquiryForm() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const t = useTranslations("individualUmrahFinal");

  const [draft, setDraft] = useState<IndividualUmrahDraft | null>(null);
  const [paxData, setPaxData] = useState<PaxFormData[]>([]);
  const [airline, setAirline] = useState<IndividualUmrahAirlineId | "">("");
  const [addons, setAddons] = useState<IndividualUmrahAddonId[]>([]);
  /** Optional multi-select; no defaults */
  const [travelPriorities, setTravelPriorities] = useState<IndividualUmrahTravelPriorityId[]>(
    [],
  );
  /** §25 — default 🇦🇹 +43 Austria; customer can change */
  const [phoneCountry, setPhoneCountry] =
    useState<IndividualUmrahPhoneCountryCode>("AT");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<Locale>(locale);
  const [source, setSource] = useState("");
  /** §28 — shown only when source is “Andere” */
  const [sourceOtherDetail, setSourceOtherDetail] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  /** §35 — mobile accordion; all six sections open by default */
  const [openSections, setOpenSections] =
    useState<Record<FormSectionId, boolean>>(DEFAULT_OPEN_SECTIONS);

  /** §33 — latest personal details for persist-on-Ändern / pagehide */
  const finalDetailsRef = useRef<IndividualUmrahFinalDetails>({
    pax: [],
    airline: "",
    addons: [],
    travelPriorities: [],
    phone: "",
    phoneCountry: "AT",
    email: "",
    preferredLanguage: locale,
    source: "",
    sourceOtherDetail: "",
  });
  const submittedRef = useRef(false);
  const hydratedRef = useRef(false);
  finalDetailsRef.current = {
    pax: paxData,
    airline,
    addons,
    travelPriorities,
    phone,
    phoneCountry,
    email,
    preferredLanguage,
    source,
    sourceOtherDetail,
  };
  submittedRef.current = submitted;

  function persistFinalDetails() {
    if (submittedRef.current || !hydratedRef.current) return;
    writeIndividualUmrahFinalDetails(finalDetailsRef.current);
  }

  function toggleSection(step: FormSectionId) {
    setOpenSections((prev) => ({ ...prev, [step]: !prev[step] }));
  }

  const validationMessages = useMemo<ValidationMessages>(
    () => ({
      firstName: t("validationFirstName"),
      lastName: t("validationLastName"),
      nationality: t("validationNationality"),
      passportType: t("validationPassportType"),
      phone: t("validationPhone"),
      email: t("validationEmail"),
      preferredLanguage: t("validationPreferredLanguage"),
      source: t("validationSource"),
    }),
    [t],
  );

  // §33 — load Step 1 travel config + any preserved final personal details
  useEffect(() => {
    hydratedRef.current = false;
    const saved = readIndividualUmrahDraft();
    if (!saved) {
      router.replace("/individuelle-umrah");
      return;
    }

    const savedFinal = saved.final;
    let childIndex = 0;
    const initialPax = mergePaxByCounts(
      {
        adults: saved.adults,
        children: saved.children,
        infants: saved.infants,
      },
      savedFinal?.pax ?? [],
    ).map((pax) => {
      if (pax.type !== "child") return pax;
      const bedAnswer = saved.childNeedsBed[childIndex++];
      const needsBed: PaxFormData["needsBed"] =
        bedAnswer === true ? "yes" : bedAnswer === false ? "no" : pax.needsBed ?? "";
      return {
        ...pax,
        needsBed,
      };
    });

    const restoredAirline =
      savedFinal?.airline && isAirlineId(savedFinal.airline) ? savedFinal.airline : "";
    const restoredAddons = pruneAddonsForItinerary(
      (savedFinal?.addons ?? []).filter(isAddonId),
      saved.itinerary,
    );
    const restoredPriorities = (savedFinal?.travelPriorities ?? []).filter(isTravelPriorityId);
    const restoredPhone = savedFinal?.phone ?? saved.phone ?? "";
    const restoredEmail = savedFinal?.email ?? saved.email ?? "";
    const restoredPhoneCountry = isPhoneCountry(savedFinal?.phoneCountry ?? saved.phoneCountry)
      ? ((savedFinal?.phoneCountry ?? saved.phoneCountry) as IndividualUmrahPhoneCountryCode)
      : "AT";
    const restoredLanguage =
      savedFinal?.preferredLanguage && isLocale(savedFinal.preferredLanguage)
        ? savedFinal.preferredLanguage
        : saved.preferredLanguage && isLocale(saved.preferredLanguage)
          ? saved.preferredLanguage
          : locale;
    const restoredSource = savedFinal?.source ?? saved.source ?? "";

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setDraft(saved);
      setPaxData(initialPax);
      setAirline(restoredAirline);
      setAddons(restoredAddons);
      setTravelPriorities(restoredPriorities);
      setPhone(restoredPhone);
      setEmail(restoredEmail);
      setPhoneCountry(restoredPhoneCountry);
      setPreferredLanguage(restoredLanguage);
      setSource(restoredSource);
      setSourceOtherDetail(savedFinal?.sourceOtherDetail ?? "");
      hydratedRef.current = true;
    });

    return () => {
      cancelled = true;
    };
  }, [locale, router]);

  // §33 — persist on real page leave (Ändern uses onClick; SPA back uses pagehide)
  useEffect(() => {
    function onPageHide() {
      persistFinalDetails();
    }
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
    };
  }, []);

  const errors = useMemo<FinalInquiryErrors>(
    () =>
      submitAttempted
        ? validateFinalInquiry(
            locale,
            paxData,
            phone,
            email,
            preferredLanguage,
            source,
            validationMessages,
          )
        : { pax: [] },
    [
      email,
      locale,
      paxData,
      phone,
      preferredLanguage,
      source,
      submitAttempted,
      validationMessages,
    ],
  );

  function updatePax(index: number, patch: Partial<PaxFormData>) {
    setPaxData((previous) =>
      previous.map((pax, paxIndex) => (paxIndex === index ? { ...pax, ...patch } : pax)),
    );
  }

  function toggleAddon(id: IndividualUmrahAddonId) {
    setAddons((previous) =>
      previous.includes(id)
        ? previous.filter((addonId) => addonId !== id)
        : [...previous, id],
    );
  }

  function toggleTravelPriority(id: IndividualUmrahTravelPriorityId) {
    setTravelPriorities((previous) =>
      previous.includes(id)
        ? previous.filter((priorityId) => priorityId !== id)
        : [...previous, id],
    );
  }

  const visibleAddons = useMemo(
    () => (draft ? addonsForItinerary(draft.itinerary) : []),
    [draft],
  );

  // §22 — drop Medina add-ons if the itinerary is Makkah-only
  useEffect(() => {
    if (!draft) return;
    setAddons((previous) => pruneAddonsForItinerary(previous, draft.itinerary));
  }, [draft]);

  function paxHeading(pax: PaxFormData, index: number): string {
    const number = paxTypeIndex(paxData, index);
    if (pax.type === "adult") return t("adultPerson", { n: number });
    if (pax.type === "child") return t("childPerson", { n: number });
    return t("infantPerson", { n: number });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || !draft) return;

    setSubmitAttempted(true);
    const nextErrors = validateFinalInquiry(
      locale,
      paxData,
      phone,
      email,
      preferredLanguage,
      source,
      validationMessages,
    );

    if (hasFinalInquiryErrors(nextErrors)) {
      const hasPaxErrors = nextErrors.pax.some((paxErrors) => Object.keys(paxErrors).length > 0);
      setOpenSections((prev) => ({
        ...prev,
        ...(hasPaxErrors ? { 2: true } : {}),
        ...(nextErrors.phone ||
        nextErrors.email ||
        nextErrors.preferredLanguage ||
        nextErrors.source
          ? { 6: true }
          : {}),
      }));
      requestAnimationFrame(() => {
        const firstInvalid = document.querySelector<HTMLElement>('[data-invalid="true"]');
        firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const primary = paxData[0];
    const formPayload = {
      ...draft,
      firstName: primary?.firstName?.trim() || draft.firstName || "",
      lastName: primary?.lastName?.trim() || draft.lastName || "",
      phone,
      phoneCountry,
      email,
      preferredLanguage,
      source,
    };
    const inquiry = buildIndividualUmrahInquiry(
      formPayload,
      // Website locale → permanent customer_language on the inquiry record
      { language: locale, status: "new" },
      {
        pax: paxData.map((p) => ({
          type: p.type,
          firstName: p.firstName,
          lastName: p.lastName,
          nationality: p.nationality,
          nationalityCode: p.nationalityCode,
          passportType: p.passportType,
        })),
        airline: airline || null,
        addons,
        travelPriorities,
        sourceOtherDetail: source === "other" ? sourceOtherDetail : null,
      },
    );
    if (inquiry) {
      addIndividualUmrahInquiry(inquiry);
    }

    submittedRef.current = true;
    clearIndividualUmrahDraft();
    setLoading(false);
    setSubmitted(true);
    requestAnimationFrame(() => {
      document
        .getElementById("individual-umrah-final-success")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  if (submitted) {
    return (
      <Container className="py-14 md:py-20">
        <div
          id="individual-umrah-final-success"
          className="mx-auto w-full max-w-xl rounded-2xl border border-line bg-white p-8 text-center shadow-card-lg md:p-10"
          role="status"
          aria-live="polite"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-soft ring-2 ring-brand-green/15">
            <Check className="h-8 w-8 text-brand-green" strokeWidth={2.5} aria-hidden />
          </div>
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-navy md:text-3xl">
            {t("successTitle")}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted md:text-[16px]">
            {t("successBody")}
          </p>
          <Link
            href="/individuelle-umrah"
            className="mt-7 inline-flex items-center justify-center font-semibold text-brand-cta transition hover:text-navy"
          >
            {t("backToIndividual")}
          </Link>
        </div>
      </Container>
    );
  }

  if (!draft) {
    return (
      <Container className="py-16">
        <div className="mx-auto flex max-w-sm items-center justify-center gap-3 rounded-2xl border border-line bg-white p-8 text-[14px] font-medium text-muted shadow-card">
          <Loader2 className="h-5 w-5 animate-spin text-brand-cta" aria-hidden />
          {t("loadingDraft")}
        </div>
      </Container>
    );
  }

  const airportLines = draft.airports
    .map((airportId) => INDIVIDUAL_UMRAH_AIRPORTS.find((airport) => airport.id === airportId))
    .filter((airport): airport is (typeof INDIVIDUAL_UMRAH_AIRPORTS)[number] => Boolean(airport))
    .map((airport) => t(airport.labelKey));

  const travellerLines = [
    `${t("summaryAdultsCount", { count: draft.adults })}, ${t("summaryChildrenCount", {
      count: draft.children,
    })}`,
    `${t("summaryInfantsCount", { count: draft.infants })}, ${t("summaryRoomsCount", {
      count: draft.rooms,
    })}`,
  ];

  const routeLines =
    draft.itinerary === "makkah_only"
      ? [t("itineraryMakkahOnly")]
      : draft.itinerary === "makkah_medina"
        ? [
            t("itineraryBoth"),
            draft.cityOrder === "makkah_first"
              ? t("orderMakkahFirst")
              : draft.cityOrder === "medina_first"
                ? t("orderMedinaFirst")
                : "",
          ].filter(Boolean)
        : [t("notAvailable")];

  const nightsMakkahLine = t("summaryNightsMakkah", { count: draft.nightsMakkah });
  const nightsMedinaLine = t("summaryNightsMedina", { count: draft.nightsMedina });
  const nightsLines =
    draft.itinerary === "makkah_only"
      ? [nightsMakkahLine]
      : draft.itinerary === "makkah_medina"
        ? draft.cityOrder === "medina_first"
          ? [nightsMedinaLine, nightsMakkahLine]
          : [nightsMakkahLine, nightsMedinaLine]
        : [t("notAvailable")];

  const dateLabel = formatTravelDate(draft, locale) ?? t("notAvailable");
  const flexibilityLabel =
    draft.flexibilityDays === null
      ? t("flexibilityNotSpecified")
      : draft.flexibilityDays === 0
        ? t("flexibilityExact")
        : t("flexibilityDays", { days: draft.flexibilityDays });
  const dateLines = [dateLabel, flexibilityLabel];

  const trustItems = [
    { label: t("trust1"), iconSrc: TRUST_ICON_USER },
    { label: t("trust2"), iconSrc: TRUST_ICON_SHIELD },
    { label: t("trust3"), iconSrc: TRUST_ICON_CLIPBOARD },
    { label: t("trust4"), iconSrc: TRUST_ICON_GLOBE },
  ];

  return (
    <Container className="relative z-20 -mt-16 pb-12 md:-mt-10 md:pb-20">
      {/* §34 / §37 — one form / one data model; layout only adapts by breakpoint */}
      <form
        onSubmit={onSubmit}
        noValidate
        aria-label={t("formAriaLabel")}
        aria-busy={loading}
        className="mx-auto max-w-312"
      >
        <div className={formShellClass}>
          {/* 1 — Zusammenfassung Ihrer Angaben (§6) */}
          <FormSection
            step={1}
            title={t("sectionSummaryTitle")}
            hint={t("sectionSummaryHint")}
            headingId="iuf-section-1"
            open={openSections[1]}
            onToggle={() => toggleSection(1)}
            hideDesktopHint
            titleSerif
            action={
              <Link
                href="/individuelle-umrah"
                onClick={() => persistFinalDetails()}
                className="inline-flex h-14 shrink-0 items-center gap-1.5 text-[13px] font-semibold text-brand-cta transition hover:text-navy md:h-auto md:pt-1"
              >
                <Pencil className="h-4 w-4" strokeWidth={2} aria-hidden />
                {t("edit")}
              </Link>
            }
          >
            <div className="overflow-hidden rounded-xl border border-line bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                <SummaryItem
                  iconSrc={SUMMARY_ICON_AIRPORTS}
                  label={t("summaryAirports")}
                  lines={airportLines.length ? airportLines : [t("notAvailable")]}
                />
                <SummaryItem iconSrc={SUMMARY_ICON_TRAVELLERS} label={t("summaryTravellers")} lines={travellerLines} />
                <SummaryItem iconSrc={SUMMARY_ICON_ROUTE} label={t("summaryRoute")} lines={routeLines} />
                <SummaryItem iconSrc={SUMMARY_ICON_NIGHTS} label={t("summaryNights")} lines={nightsLines} />
                <SummaryItem iconSrc={SUMMARY_ICON_DATE} label={t("summaryDate")} lines={dateLines} />
              </div>
            </div>
          </FormSection>

          {/* 2 — Travellers */}
          <FormSection
            className={sectionDividerClass}
            step={2}
            title={t("sectionTravellersTitle")}
            hint={t("sectionTravellersHint")}
            headingId="iuf-section-2"
            open={openSections[2]}
            onToggle={() => toggleSection(2)}
          >
            {/* §34 — desktop table · tablet/mobile traveller cards (same pax data) */}
            <div className="hidden overflow-x-auto rounded-xl border border-line lg:block">
              <table
                className="w-full min-w-[52rem] border-collapse"
                aria-label={t("sectionTravellersHint")}
              >
                <thead>
                  <tr className="border-b border-line bg-[#FFFCF8] text-start text-[12px] font-semibold leading-snug text-navy">
                    <th scope="col" className="w-[9.5rem] px-3 py-3.5 pe-2 whitespace-nowrap">
                      {t("personColumn")}
                    </th>
                    <th scope="col" className="min-w-[9rem] px-3 py-3.5 pe-2">
                      {t("firstName")}
                    </th>
                    <th scope="col" className="min-w-[9rem] px-3 py-3.5 pe-2">
                      {t("lastName")}
                    </th>
                    <th scope="col" className="min-w-[10rem] px-3 py-3.5 pe-2">
                      {t("nationality")}
                    </th>
                    <th scope="col" className="min-w-[11rem] px-3 py-3.5">
                      {t("passportType")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paxData.map((pax, index) => (
                    <tr
                      key={`${pax.type}-${paxTypeIndex(paxData, index)}`}
                      className="border-t border-line align-top"
                    >
                      <th
                        scope="row"
                        className="px-3 py-3.5 pe-2 text-start text-[13px] font-bold leading-snug whitespace-nowrap text-navy"
                      >
                        {paxHeading(pax, index)}
                      </th>
                      <td className="px-3 py-3.5 pe-2">
                        <input
                          value={pax.firstName}
                          onChange={(event) => updatePax(index, { firstName: event.target.value })}
                          placeholder={t("firstNamePlaceholder")}
                          aria-label={`${t("firstName")} – ${paxHeading(pax, index)}`}
                          aria-invalid={errors.pax[index]?.firstName ? true : undefined}
                          data-invalid={errors.pax[index]?.firstName ? "true" : undefined}
                          className={cn(
                            tableInputClass,
                            errors.pax[index]?.firstName &&
                              "border-red-500 focus:border-red-500 focus:ring-red-500/15",
                          )}
                        />
                        <FieldError message={errors.pax[index]?.firstName} />
                      </td>
                      <td className="px-3 py-3.5 pe-2">
                        <input
                          value={pax.lastName}
                          onChange={(event) => updatePax(index, { lastName: event.target.value })}
                          placeholder={t("lastNamePlaceholder")}
                          aria-label={`${t("lastName")} – ${paxHeading(pax, index)}`}
                          aria-invalid={errors.pax[index]?.lastName ? true : undefined}
                          data-invalid={errors.pax[index]?.lastName ? "true" : undefined}
                          className={cn(
                            tableInputClass,
                            errors.pax[index]?.lastName &&
                              "border-red-500 focus:border-red-500 focus:ring-red-500/15",
                          )}
                        />
                        <FieldError message={errors.pax[index]?.lastName} />
                      </td>
                      <td className="px-3 py-3.5 pe-2">
                        <NationalityCombobox
                          label={t("nationality")}
                          placeholder={t("nationalityPlaceholder")}
                          locale={locale}
                          value={toNationalityValue(pax)}
                          fieldId={`individual-final-desktop-${index}`}
                          hideLabel
                          ariaLabel={`${t("nationality")} – ${paxHeading(pax, index)}`}
                          inputClassName={cn(
                            tableInputClass,
                            errors.pax[index]?.nationality &&
                              "border-red-500 focus:border-red-500 focus:ring-red-500/15",
                          )}
                          error={errors.pax[index]?.nationality}
                          showError={Boolean(errors.pax[index]?.nationality)}
                          onChange={(next) =>
                            updatePax(index, {
                              nationality: next?.name ?? "",
                              nationalityCode: next?.code ?? "",
                            })
                          }
                        />
                      </td>
                      <td className="px-3 py-3.5">
                        <label className="block">
                          <span className="sr-only">
                            {t("passportType")} – {paxHeading(pax, index)}
                          </span>
                          <div className="relative">
                            <select
                              value={pax.passportType}
                              onChange={(event) =>
                                updatePax(index, {
                                  passportType: event.target.value as PaxFormData["passportType"],
                                })
                              }
                              aria-invalid={errors.pax[index]?.passportType ? true : undefined}
                              data-invalid={errors.pax[index]?.passportType ? "true" : undefined}
                              className={cn(
                                tableSelectClass,
                                !pax.passportType && "text-muted",
                                errors.pax[index]?.passportType &&
                                  "border-red-500 focus:border-red-500 focus:ring-red-500/15",
                              )}
                            >
                              <option value="">{t("passportPlaceholder")}</option>
                              {INDIVIDUAL_UMRAH_PASSPORT_TYPES.map((passport) => (
                                <option key={passport.id} value={passport.id}>
                                  {t(passport.labelKey)}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              className="pointer-events-none absolute inset-e-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                              aria-hidden
                            />
                          </div>
                          <FieldError message={errors.pax[index]?.passportType} />
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* §34 — traveller cards below lg (same fields as the table) */}
            <div className="space-y-4 lg:hidden">
              {paxData.map((pax, index) => (
                <article
                  key={`${pax.type}-${paxTypeIndex(paxData, index)}`}
                  className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_1px_2px_rgba(11,44,74,0.04)]"
                >
                  <header className="border-b border-line bg-[#FFFCF8] px-4 py-3.5">
                    <h3 className="text-[15px] font-bold leading-snug text-navy">
                      {paxHeading(pax, index)}
                    </h3>
                  </header>

                  <div className="space-y-4 p-4">
                    <label className="block">
                      <span className="mb-1.5 block text-[13px] font-semibold text-navy">
                        {t("firstName")}
                      </span>
                      <input
                        value={pax.firstName}
                        onChange={(event) => updatePax(index, { firstName: event.target.value })}
                        placeholder={t("firstNamePlaceholder")}
                        aria-invalid={errors.pax[index]?.firstName ? true : undefined}
                        data-invalid={errors.pax[index]?.firstName ? "true" : undefined}
                        className={cn(
                          inputClass,
                          errors.pax[index]?.firstName &&
                            "border-red-500 focus:border-red-500 focus:ring-red-500/15",
                        )}
                      />
                      <FieldError message={errors.pax[index]?.firstName} />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[13px] font-semibold text-navy">
                        {t("lastName")}
                      </span>
                      <input
                        value={pax.lastName}
                        onChange={(event) => updatePax(index, { lastName: event.target.value })}
                        placeholder={t("lastNamePlaceholder")}
                        aria-invalid={errors.pax[index]?.lastName ? true : undefined}
                        data-invalid={errors.pax[index]?.lastName ? "true" : undefined}
                        className={cn(
                          inputClass,
                          errors.pax[index]?.lastName &&
                            "border-red-500 focus:border-red-500 focus:ring-red-500/15",
                        )}
                      />
                      <FieldError message={errors.pax[index]?.lastName} />
                    </label>

                    <div>
                      <span className="mb-1.5 block text-[13px] font-semibold text-navy">
                        {t("nationality")}
                      </span>
                      <NationalityCombobox
                        label={t("nationality")}
                        placeholder={t("nationalityPlaceholder")}
                        locale={locale}
                        value={toNationalityValue(pax)}
                        fieldId={`individual-final-mobile-${index}`}
                        hideLabel
                        ariaLabel={`${t("nationality")} – ${paxHeading(pax, index)}`}
                        inputClassName={cn(
                          inputClass,
                          errors.pax[index]?.nationality &&
                            "border-red-500 focus:border-red-500 focus:ring-red-500/15",
                        )}
                        error={errors.pax[index]?.nationality}
                        showError={Boolean(errors.pax[index]?.nationality)}
                        onChange={(next) =>
                          updatePax(index, {
                            nationality: next?.name ?? "",
                            nationalityCode: next?.code ?? "",
                          })
                        }
                      />
                    </div>

                    <label className="block">
                      <span className="mb-1.5 block text-[13px] font-semibold text-navy">
                        {t("passportType")}
                      </span>
                      <div className="relative">
                        <select
                          value={pax.passportType}
                          onChange={(event) =>
                            updatePax(index, {
                              passportType: event.target.value as PaxFormData["passportType"],
                            })
                          }
                          aria-invalid={errors.pax[index]?.passportType ? true : undefined}
                          data-invalid={errors.pax[index]?.passportType ? "true" : undefined}
                          className={cn(
                            selectClass,
                            !pax.passportType && "text-muted",
                            errors.pax[index]?.passportType &&
                              "border-red-500 focus:border-red-500 focus:ring-red-500/15",
                          )}
                        >
                          <option value="">{t("passportPlaceholder")}</option>
                          {INDIVIDUAL_UMRAH_PASSPORT_TYPES.map((passport) => (
                            <option key={passport.id} value={passport.id}>
                              {t(passport.labelKey)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="pointer-events-none absolute inset-e-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                          aria-hidden
                        />
                      </div>
                      <FieldError message={errors.pax[index]?.passportType} />
                    </label>
                  </div>
                </article>
              ))}
            </div>
          </FormSection>

          {/* 3 — Preferred airline (§14–§15 / §32 optional · §34 progressive grid) */}
          <FormSection
            className={sectionDividerClass}
            step={3}
            title={t("sectionAirlineTitle")}
            hint={t("sectionAirlineHint")}
            headingId="iuf-section-3"
            open={openSections[3]}
            onToggle={() => toggleSection(3)}
            titleSerif
          >
            <div
              className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
              role="radiogroup"
              aria-label={t("sectionAirlineTitle")}
              aria-required={false}
            >
              {INDIVIDUAL_UMRAH_AIRLINES.map((option) => {
                const selected = airline === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() =>
                      setAirline((current) => (current === option.id ? "" : option.id))
                    }
                    className={cn(
                      "relative flex min-h-[11.5rem] flex-col items-center rounded-2xl border-2 bg-white px-4 pb-3.5 pt-5 text-center transition sm:min-h-48",
                      selected
                        ? "border-navy bg-[#F8FAFD] shadow-[0_2px_12px_rgba(11,44,74,0.08)]"
                        : "border-[#E6E8EC] hover:border-navy/25 hover:bg-[#FAFBFC]",
                    )}
                  >
                    <span className="flex w-full flex-1 items-center justify-center px-1">
                      <Image
                        src={option.logo}
                        alt=""
                        width={240}
                        height={100}
                        className={cn(
                          AIRLINE_LOGO_DEFAULT_CLASS,
                          AIRLINE_LOGO_CLASS[option.id],
                        )}
                      />
                    </span>
                    <span className="shrink-0 px-1 text-[13px] font-semibold leading-snug text-navy sm:text-[14px]">
                      {t(option.nameKey)}
                    </span>
                    <span
                      className={cn(
                        "absolute end-3.5 top-3.5 flex h-6 w-6 items-center justify-center rounded-full border-2 transition",
                        selected
                          ? "border-navy bg-navy text-white"
                          : "border-[#C5CCD6] bg-white",
                      )}
                      aria-hidden
                    >
                      {selected ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </FormSection>

          {/* 4 — Add-ons (§36: transfer · religious Medina · visa; optional multi-select) */}
          <FormSection
            className={sectionDividerClass}
            step={4}
            title={t("sectionAddonsTitle")}
            hint={t("sectionAddonsHint")}
            headingId="iuf-section-4"
            open={openSections[4]}
            onToggle={() => toggleSection(4)}
          >
            <p className="mb-4 text-[13px] leading-relaxed text-muted md:mb-5 md:text-[14px]">
              {t("sectionAddonsMultiHint")}
            </p>
            <div
              className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3"
              role="group"
              aria-label={t("sectionAddonsTitle")}
              aria-required={false}
            >
              {visibleAddons.map((addon) => {
                const selected = addons.includes(addon.id);
                const copy =
                  addon.icon === "train" && draft
                    ? transferCopyKeys(draft.cityOrder)
                    : { titleKey: addon.titleKey, bodyKey: addon.bodyKey };
                const title = t(copy.titleKey);
                const body = t(copy.bodyKey);
                return (
                  <label
                    key={addon.id}
                    className={cn(
                      /* §21 — full card is the hit target (not only the checkbox) */
                      "flex cursor-pointer select-none items-start gap-4 rounded-2xl border-2 bg-white p-4 transition active:scale-[0.995] sm:min-h-32 sm:p-5",
                      "min-h-28 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-cta",
                      selected
                        ? "border-brand-cta bg-[#EEF5FB] shadow-[0_4px_16px_rgba(30,90,156,0.1)]"
                        : "border-[#E6E8EC] hover:border-brand-cta/35 hover:bg-[#F7FAFD]",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleAddon(addon.id)}
                      className="sr-only"
                      aria-label={title}
                    />
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-line/80">
                      <Image
                        src={addon.iconSrc}
                        alt=""
                        width={40}
                        height={40}
                        className="h-8 w-8 object-contain"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-bold leading-snug text-navy sm:text-[16px]">
                        {title}
                      </span>
                      <span className="mt-1.5 block text-[13px] leading-relaxed text-muted sm:text-[14px]">
                        {body}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition",
                        selected
                          ? "border-brand-cta bg-brand-cta text-white"
                          : "border-[#C5CCD6] bg-white",
                      )}
                      aria-hidden
                    >
                      {selected ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </FormSection>

          {/* 5 — Travel priorities (optional multi-select, no default) */}
          <FormSection
            className={sectionDividerClass}
            step={5}
            title={t("sectionPrioritiesTitle")}
            hint={t("sectionPrioritiesHint")}
            headingId="iuf-section-5"
            open={openSections[5]}
            onToggle={() => toggleSection(5)}
          >
            <p className="mb-4 text-[13px] leading-relaxed text-muted md:mb-5 md:text-[14px]">
              {t("sectionPrioritiesMultiHint")}
            </p>
            <div
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              role="group"
              aria-label={t("sectionPrioritiesTitle")}
              aria-required={false}
            >
              {INDIVIDUAL_UMRAH_TRAVEL_PRIORITIES.map((priority) => {
                const selected = travelPriorities.includes(priority.id);
                const label = t(priority.labelKey);
                return (
                  <label
                    key={priority.id}
                    className={cn(
                      "flex cursor-pointer select-none items-center gap-3.5 rounded-2xl border-2 bg-white px-4 py-3.5 transition active:scale-[0.995]",
                      "min-h-14 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-cta",
                      selected
                        ? "border-brand-cta bg-[#EEF5FB] shadow-[0_4px_16px_rgba(30,90,156,0.1)]"
                        : "border-[#E6E8EC] hover:border-brand-cta/35 hover:bg-[#F7FAFD]",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleTravelPriority(priority.id)}
                      className="sr-only"
                      aria-label={label}
                    />
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition",
                        selected
                          ? "border-brand-cta bg-brand-cta text-white"
                          : "border-[#C5CCD6] bg-white",
                      )}
                      aria-hidden
                    >
                      {selected ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
                    </span>
                    <span className="min-w-0 flex-1 text-[15px] font-semibold leading-snug text-navy sm:text-[16px]">
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          </FormSection>

          {/* 6 — Kontakt & Weitere Angaben (§24) */}
          <FormSection
            className={sectionDividerClass}
            step={6}
            title={t("sectionContactTitle")}
            hint={t("sectionContactHint")}
            headingId="iuf-section-6"
            open={openSections[6]}
            onToggle={() => toggleSection(6)}
          >
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-navy">
                  {t("phone")} <span className="text-brand-orange">*</span>
                </span>
                {/* §25 — 🇦🇹 +43 ▼ | number; wrap only when too narrow to stay usable */}
                <div
                  className={cn(
                    "dir-ltr-keep flex flex-wrap items-stretch overflow-hidden rounded-xl border bg-white focus-within:ring-2",
                    errors.phone
                      ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/15"
                      : "border-line focus-within:border-brand-cta focus-within:ring-brand-cta/12",
                  )}
                >
                  <div className="flex min-h-12 shrink-0 items-stretch">
                    <PhoneCountrySelect
                      value={phoneCountry}
                      onChange={setPhoneCountry}
                      ariaLabel={t("phoneCountry")}
                    />
                    <span
                      className="flex shrink-0 items-center px-1.5 text-[14px] text-muted"
                      aria-hidden
                    >
                      |
                    </span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder={t("phonePlaceholder")}
                    aria-invalid={errors.phone ? true : undefined}
                    data-invalid={errors.phone ? "true" : undefined}
                    aria-required
                    className="min-h-12 min-w-[11rem] flex-1 border-0 bg-white px-3 py-3 text-[14px] text-navy outline-none placeholder:text-muted/55"
                    inputMode="tel"
                    autoComplete="tel-national"
                  />
                </div>
                <FieldError message={errors.phone} />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-navy">
                  {t("email")}{" "}
                  <span className="font-normal text-muted">({t("optional")})</span>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t("emailPlaceholder")}
                  aria-invalid={errors.email ? true : undefined}
                  data-invalid={errors.email ? "true" : undefined}
                  className={cn(
                    inputClass,
                    "dir-ltr-keep",
                    errors.email &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/15",
                  )}
                  autoComplete="email"
                />
                <FieldError message={errors.email} />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-navy">
                  {t("preferredLanguage")} <span className="text-brand-orange">*</span>
                </span>
                <div className="relative">
                  <select
                    value={preferredLanguage}
                    onChange={(event) => {
                      if (isLocale(event.target.value)) setPreferredLanguage(event.target.value);
                    }}
                    aria-invalid={errors.preferredLanguage ? true : undefined}
                    data-invalid={errors.preferredLanguage ? "true" : undefined}
                    aria-required
                    className={cn(
                      selectClass,
                      errors.preferredLanguage &&
                        "border-red-500 focus:border-red-500 focus:ring-red-500/15",
                    )}
                  >
                    {LANGUAGE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute inset-e-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                </div>
                <FieldError message={errors.preferredLanguage} />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-navy">
                  {t("source")} <span className="text-brand-orange">*</span>
                </span>
                <div className="relative">
                  <select
                    value={source}
                    onChange={(event) => {
                      const next = event.target.value;
                      setSource(next);
                      if (next !== "other") setSourceOtherDetail("");
                    }}
                    aria-invalid={errors.source ? true : undefined}
                    data-invalid={errors.source ? "true" : undefined}
                    aria-required
                    className={cn(
                      selectClass,
                      !source && "text-muted",
                      errors.source &&
                        "border-red-500 focus:border-red-500 focus:ring-red-500/15",
                    )}
                  >
                    <option value="">{t("sourcePlaceholder")}</option>
                    {SOURCE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute inset-e-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                </div>
                <FieldError message={errors.source} />
                {/* §28 — extra field when “Andere” is selected */}
                {source === "other" ? (
                  <input
                    type="text"
                    value={sourceOtherDetail}
                    onChange={(event) => setSourceOtherDetail(event.target.value)}
                    placeholder={t("sourceOtherPlaceholder")}
                    aria-label={t("sourceOtherPlaceholder")}
                    className={cn(inputClass, "mt-3 min-h-11 text-[13px]")}
                    autoComplete="off"
                  />
                ) : null}
              </label>
            </div>
          </FormSection>
        </div>

        <div className="mt-6 space-y-5 md:mt-8 md:space-y-6">
          {/* §29 — info box immediately above CTA (subtle light-blue, not a warning) */}
          <div
            role="note"
            className="flex items-start gap-3 rounded-2xl border border-brand-cta/20 bg-[#EEF5FB] p-5 shadow-[0_2px_10px_rgba(30,90,156,0.06)] md:gap-3.5 md:p-6"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-cta/10 text-brand-cta"
              aria-hidden
            >
              <Info className="h-5 w-5" strokeWidth={2} />
            </span>
            <p className="pt-1.5 text-[14px] leading-relaxed text-navy md:text-[15px]">
              {t("submitInfo")}
            </p>
          </div>

          {/* §30 — main CTA: navy + Send icon; full form width; not sticky */}
          <div>
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className={submitCtaClass}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                  {t("submitting")}
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" strokeWidth={2} aria-hidden />
                  {t("submitCta")}
                </>
              )}
            </button>
            <p className="mt-3 flex items-center justify-center gap-2 text-[13px] font-medium text-navy">
              <Shield className="h-4 w-4 text-brand-cta" strokeWidth={2} aria-hidden />
              {t("submitFree")}
            </p>
          </div>
        </div>

        {/* §31 — trust: mobile 2×2 grid (reference) · desktop 4-across */}
        <section className="mt-10 border-t border-line pt-8 md:mt-12 md:pt-10" aria-label={t("trustAriaLabel")}>
          <div className="grid grid-cols-2 divide-x divide-y divide-[#D8E4EE] overflow-hidden rounded-2xl border border-[#D8E4EE] bg-[#F8FAFD] md:hidden">
            {trustItems.map(({ label, iconSrc }) => (
              <div key={label} className="flex flex-col items-center px-3 py-7 text-center">
                <Image
                  src={iconSrc}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
                <span className="mt-3.5 whitespace-pre-line text-[12px] font-semibold leading-[1.35] text-navy">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="hidden grid-cols-4 gap-6 md:grid">
            {trustItems.map(({ label, iconSrc }) => (
              <div key={label} className="flex items-start gap-3">
                <Image
                  src={iconSrc}
                  alt=""
                  width={36}
                  height={36}
                  className="mt-0.5 h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
                />
                <span className="whitespace-pre-line text-[12px] font-semibold leading-[1.35] text-navy sm:text-[13px]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </form>
    </Container>
  );
}
