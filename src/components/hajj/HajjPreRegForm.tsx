"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Caveat, Libre_Baskerville } from "next/font/google";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { hajjCampaignLandingPath } from "@/data/hajj-campaign-types";
import { useHajjCampaignOptional } from "@/components/hajj/HajjCampaignProvider";
import type { Locale } from "@/i18n/routing";
import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Heart,
  Loader2,
  Lock,
  MoreHorizontal,
  Shield,
  UserRound,
  Users,
} from "lucide-react";
import { HajjPreRegMobile } from "@/components/hajj/HajjPreRegMobile";
import { DepartureAirportsField } from "@/components/hajj/DepartureAirportsField";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import { RESIDENCE_COUNTRIES } from "@/lib/residence-countries";
import {
  enabledResidenceCodes,
  enabledSourceOptions,
  resolveResidenceCountries,
  type HajjPreRegBenefitIcon,
  type HajjPreRegContent,
  type ResolvedResidenceCountry,
} from "@/data/hajj-pre-reg-content";
import type { HajjPassportTypeOption } from "@/data/hajj-passport-types";
import { DEFAULT_HAJJ_PASSPORT_TYPE_ID } from "@/data/hajj-passport-types";
import { IQ } from "@/lib/images";
import {
  hasHajjPreRegFormErrors,
  validateHajjPreRegForm,
  type HajjPersonFieldErrors,
  type HajjPreRegFormErrors,
} from "@/lib/hajj-pre-reg-validation";
import { cn } from "@/lib/utils";

const HERO_IMAGE_FALLBACK = "/brand/hajj-2027-hero.png";
const MAX_TRAVELLERS = 20;
const SIX_PLUS_MIN = 6;

/** Reference palette — premium German Hajj travel aesthetic */
const NAVY = "#0B2A55";
const CTA_BLUE = "#1264F5";
const GOLD = "#C9964A";
const INK_SOFT = "#63748A";

const display = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  display: "swap",
});

const script = Caveat({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
});

const BENEFIT_ICON_SRC: Record<HajjPreRegBenefitIcon, string> = {
  shield: "/brand/icons/hajj-prereg/shield.png",
  coins: "/brand/icons/hajj-prereg/coins.png",
  clipboard: "/brand/icons/hajj-prereg/clipboard.png",
  users: "/brand/icons/hajj-prereg/users.png",
};

/** Brand logos where they exist, tinted glyph tiles for the rest (matches reference) */
const SOURCE_VISUAL: Record<
  string,
  { src?: string; Icon?: typeof Users; tint?: string; ink?: string }
> = {
  instagram: { src: "/brand/icons/inquiry-source/instagram.png" },
  google: { src: "/brand/icons/inquiry-source/google.png" },
  facebook: { src: "/brand/icons/inquiry-source/facebook.png" },
  chatgpt: { src: "/brand/icons/inquiry-source/chatgpt.png" },
  friend: { Icon: Users, tint: "#E7E9FA", ink: NAVY },
  know: { Icon: Heart, tint: "#E6F0FE", ink: CTA_BLUE },
  other: { Icon: MoreHorizontal, tint: "#E7E9FA", ink: NAVY },
};

const DECO_MINARET = "/brand/hajj-journey/deco-quote-minaret.png";

type Person = {
  firstName: string;
  lastName: string;
  nationality: string;
  nationalityCode: string;
  residence: string;
  passportType: string;
};

export type HajjPreRegSubmission = {
  campaignSlug: string;
  travellerCount: number;
  programDuration: string;
  persons: Person[];
  dialCode: string;
  phone: string;
  departureAirports: string[];
  source: string;
  sourceOtherDetail: string;
};

type PersonTouch = Partial<Record<keyof HajjPersonFieldErrors, boolean>>;
type FormTouch = {
  persons: PersonTouch[];
  phone?: boolean;
  source?: boolean;
};

function emptyFormTouch(): FormTouch {
  return { persons: Array.from({ length: MAX_TRAVELLERS }, () => ({})) };
}

type Benefit = {
  title: string;
  body: string;
  iconSrc: string;
  emphasis?: string;
};

function stripSectionNumber(title: string) {
  return title.replace(/^\d+\.\s*/, "");
}

/** Placeholder transport until the pre-registration API exists. */
async function submitPreRegistration(payload: HajjPreRegSubmission) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return payload;
}

function SectionHeader({
  step,
  title,
  hint,
  headingId,
}: {
  step: number;
  title: string;
  hint: string;
  headingId: string;
}) {
  return (
    <div className="mb-6 flex gap-3.5 md:mb-7 md:gap-4">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white md:h-[2.05rem] md:w-[2.05rem] md:text-[14px]"
        style={{ backgroundColor: CTA_BLUE }}
        aria-hidden
      >
        {step}
      </span>
      <div className="min-w-0">
        <h2
          id={headingId}
          className={cn(display.className, "text-[19px] font-bold leading-tight md:text-[21px]")}
          style={{ color: NAVY }}
        >
          {stripSectionNumber(title)}
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed md:text-[13.5px]" style={{ color: INK_SOFT }}>
          {hint}
        </p>
      </div>
    </div>
  );
}

/** Shared surface tokens — reference cards are soft-edged white on warm ivory */
const cardClass =
  "rounded-[18px] border border-[#E7EBF1] bg-white p-6 shadow-[0_2px_14px_rgba(11,42,85,0.045)] md:p-7 lg:p-8";
const shellClass = "mx-auto w-full max-w-[78rem] px-4 sm:px-6 xl:px-8";
const inputClass =
  "w-full rounded-[10px] border border-[#DDE3EC] bg-white px-3.5 py-[0.8rem] text-[14px] text-navy outline-none transition placeholder:text-[#98A6B8] focus:border-[#1264F5] focus:ring-2 focus:ring-[#1264F5]/12";
const selectClass = cn(inputClass, "appearance-none pe-10");
const tableInputClass =
  "w-full min-w-0 rounded-[8px] border border-[#DDE3EC] bg-white px-3 py-2.5 text-[13px] text-navy outline-none transition placeholder:text-[#98A6B8] focus:border-[#1264F5] focus:ring-2 focus:ring-[#1264F5]/12";
const tableSelectClass = cn(tableInputClass, "appearance-none pe-7");
const selectedTileClass = "border-[#1264F5] bg-[#EAF3FE]";
const idleTileClass = "border-[#E7EBF1] bg-white hover:border-[#BFD8FA] hover:bg-[#F7FAFF]";

export function HajjPreRegForm({
  campaignSlug,
  preReg,
}: {
  campaignSlug?: string;
  preReg: HajjPreRegContent;
}) {
  const campaign = useHajjCampaignOptional();
  const slug = campaign?.campaign.slug ?? campaignSlug ?? "hajj-2027";
  const landingPath = campaign?.landingPath ?? hajjCampaignLandingPath(slug);
  const locale = useLocale() as Locale;

  const residenceCountries = useMemo(
    () => resolveResidenceCountries(preReg.residenceCountries, locale),
    [preReg.residenceCountries, locale],
  );
  const allowedResidenceCodes = useMemo(
    () => enabledResidenceCodes(preReg.residenceCountries),
    [preReg.residenceCountries],
  );
  const sourceOptions = useMemo(() => enabledSourceOptions(preReg.sourceOptions), [preReg.sourceOptions]);
  const gridSourceOptions = sourceOptions.filter((option) => option.value !== "other");
  const otherSourceOption = sourceOptions.find((option) => option.value === "other");

  const defaultProgram =
    preReg.programDurations.find((program) => program.recommended)?.id ??
    preReg.programDurations[0]?.id ??
    "";

  const [count, setCount] = useState(2);
  const [customCount, setCustomCount] = useState(6);
  const [program, setProgram] = useState(defaultProgram);
  // §13: fixed buffer — retain entered data when count decreases; restore when count increases again
  const [persons, setPersons] = useState<Person[]>(() => emptyPersons(MAX_TRAVELLERS));
  const [phone, setPhone] = useState("");
  const [dialCode, setDialCode] = useState("AT");
  const [airports, setAirports] = useState<string[]>([]);
  const [source, setSource] = useState("");
  const [sourceOtherDetail, setSourceOtherDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<HajjPreRegFormErrors>({ persons: [] });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState<FormTouch>(() => emptyFormTouch());

  const validationMessages = useMemo(() => ({ ...preReg.validation }), [preReg.validation]);

  const effectiveCount = count === 6 ? customCount : count;
  const visiblePersons = persons.slice(0, effectiveCount);
  // §20–§21: Person 1's country of residence drives the contact phone prefix; other travellers are ignored
  const leadResidence = persons[0]?.residence ?? "";

  useEffect(() => {
    // §20–§21: sync from Person 1 only; manual override until Person 1's residence changes again
    if (!leadResidence) return;
    if (RESIDENCE_COUNTRIES.some((r) => r.code === leadResidence) && allowedResidenceCodes.has(leadResidence)) {
      setDialCode(leadResidence);
    }
  }, [leadResidence, allowedResidenceCodes]);

  useEffect(() => {
    if (!submitAttempted) return;
    setErrors(
      validateHajjPreRegForm(
        locale,
        persons,
        effectiveCount,
        source,
        phone,
        "",
        validationMessages,
        allowedResidenceCodes,
      ),
    );
  }, [submitAttempted, locale, persons, effectiveCount, source, phone, validationMessages, allowedResidenceCodes]);

  function markPersonTouched(index: number, field: keyof HajjPersonFieldErrors) {
    setTouched((prev) => ({
      ...prev,
      persons: prev.persons.map((person, i) => (i === index ? { ...person, [field]: true } : person)),
    }));
  }

  function markTouched(field: "phone" | "source") {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function showPersonError(index: number, field: keyof HajjPersonFieldErrors): string | undefined {
    const show = submitAttempted || touched.persons[index]?.[field];
    return show ? errors.persons[index]?.[field] : undefined;
  }

  function showFieldError(field: "source" | "phone"): string | undefined {
    const show = submitAttempted || touched[field];
    return show ? errors[field] : undefined;
  }

  function updatePerson(index: number, patch: Partial<Person>) {
    setPersons((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || done) return;

    setSubmitAttempted(true);

    const nextErrors = validateHajjPreRegForm(
      locale,
      persons,
      effectiveCount,
      source,
      phone,
      "",
      validationMessages,
      allowedResidenceCodes,
    );
    setErrors(nextErrors);

    if (hasHajjPreRegFormErrors(nextErrors)) {
      requestAnimationFrame(() => {
        document.querySelector('[data-invalid="true"]')?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }

    setLoading(true);
    try {
      await submitPreRegistration({
        campaignSlug: slug,
        travellerCount: effectiveCount,
        programDuration: program,
        persons: visiblePersons,
        dialCode,
        phone,
        departureAirports: airports,
        source,
        sourceOtherDetail: source === "other" ? sourceOtherDetail : "",
      });
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setLoading(false);
    }
  }

  function runValidation() {
    return validateHajjPreRegForm(
      locale,
      persons,
      effectiveCount,
      source,
      phone,
      "",
      validationMessages,
      allowedResidenceCodes,
    );
  }

  function validatePersonsStep() {
    const nextErrors = runValidation();
    setErrors(nextErrors);
    setTouched((prev) => ({
      ...prev,
      persons: prev.persons.map((person, i) =>
        i < effectiveCount
          ? { firstName: true, lastName: true, nationality: true, residence: true, passportType: true }
          : person,
      ),
    }));
    return !nextErrors.persons
      .slice(0, effectiveCount)
      .some((person) => person && Object.keys(person).length > 0);
  }

  function validateContactStep() {
    const nextErrors = runValidation();
    setErrors(nextErrors);
    markTouched("phone");
    return !nextErrors.phone;
  }

  if (done) {
    return (
      <div
        className="hajj-prereg flex min-h-[70vh] items-center justify-center px-4 py-16 md:min-h-[65vh] md:py-24"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <div
          className="w-full max-w-lg rounded-[18px] border border-[#E7EBF1] bg-white p-8 text-center shadow-card md:p-10"
          role="status"
          aria-live="polite"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-soft ring-2 ring-brand-green/15">
            <Check className="h-8 w-8 text-brand-green" strokeWidth={2.5} aria-hidden />
          </div>
          <h1
            className={cn(display.className, "mb-4 text-2xl font-bold md:text-[28px]")}
            style={{ color: NAVY }}
          >
            {preReg.success.title}
          </h1>
          <p className="mb-8 text-[15px] leading-relaxed text-muted md:text-[16px] md:leading-[1.7]">
            {preReg.success.body}
          </p>
          <Link
            href={landingPath}
            className="inline-flex items-center justify-center gap-1.5 font-semibold transition hover:opacity-80"
            style={{ color: CTA_BLUE }}
          >
            {preReg.success.backToHajj} <DirArrow />
          </Link>
        </div>
      </div>
    );
  }

  const benefits: Benefit[] = preReg.benefits.map((benefit) => ({
    title: benefit.title,
    body: benefit.body,
    emphasis: benefit.emphasis,
    iconSrc: BENEFIT_ICON_SRC[benefit.icon],
  }));

  const { hero, sections, fields, privacy, cta } = preReg;
  const handwrittenLines = hero.handwritten.split("\n");

  return (
    <div className="hajj-prereg" dir={locale === "ar" ? "rtl" : "ltr"}>
      <HajjPreRegMobile
        preReg={preReg}
        locale={locale}
        displayClassName={display.className}
        scriptClassName={script.className}
        benefits={preReg.benefits}
        count={count}
        setCount={setCount}
        customCount={customCount}
        setCustomCount={setCustomCount}
        program={program}
        setProgram={setProgram}
        persons={persons}
        updatePerson={updatePerson}
        phone={phone}
        setPhone={setPhone}
        dialCode={dialCode}
        setDialCode={setDialCode}
        airports={airports}
        setAirports={setAirports}
        source={source}
        setSource={setSource}
        sourceOtherDetail={sourceOtherDetail}
        setSourceOtherDetail={setSourceOtherDetail}
        residenceCountries={residenceCountries}
        loading={loading}
        errors={errors}
        showPersonError={showPersonError}
        showFieldError={showFieldError}
        markPersonTouched={markPersonTouched}
        markTouched={markTouched}
        onSubmit={onSubmit}
        validatePersons={validatePersonsStep}
        validateContact={validateContactStep}
      />

      <div className="hidden lg:block">
      {/* §31 Wording: Voranmeldung / pre-registration only — never Buchung/booking on this form */}
      {/* Hero — full-bleed Kaaba photo right, soft white fade left */}
      <section id="top" className="relative overflow-hidden bg-[#F8F6F1] lg:h-[600px] lg:max-h-[600px] lg:min-h-[600px]">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={hero.imageSrc || HERO_IMAGE_FALLBACK}
            alt=""
            fill
            priority
            quality={IQ.hero}
            sizes="100vw"
            className="hajj-prereg-hero-photo object-cover"
          />
          <div className="hajj-prereg-hero-fade pointer-events-none absolute inset-0" />
        </div>

        {/* Handwritten overlay — over the sky, upper right */}
        <p
          className={cn(
            script.className,
            "pointer-events-none absolute end-[12%] top-[8%] z-20 hidden -rotate-[7deg] text-end text-[28px] leading-[1.25] lg:block xl:text-[32px]",
          )}
          style={{ color: NAVY }}
          aria-hidden
        >
          {handwrittenLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        {/* Quran quote card — floating, lower right */}
        <figure className="absolute bottom-7 end-6 z-20 hidden max-w-[19rem] items-start gap-3 rounded-[14px] bg-white px-4 py-3.5 shadow-[0_10px_30px_rgba(11,42,85,0.14)] lg:flex xl:end-9">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]"
            style={{ backgroundColor: "#FBF3E5" }}
            aria-hidden
          >
            <BookOpen className="h-4 w-4" style={{ color: GOLD }} strokeWidth={1.9} />
          </span>
          <blockquote className="text-[11.5px] leading-[1.5]" style={{ color: INK_SOFT }}>
            {hero.quote}
          </blockquote>
        </figure>

        <Container className="relative z-10 flex h-full flex-col justify-center py-8 lg:py-0">
          <div className="w-full lg:max-w-[48rem]">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.16em] lg:text-[12px]"
              style={{ color: "#8494A8" }}
            >
              {hero.eyebrow}
            </p>

            <h1
              className={cn(
                display.className,
                "mt-3 text-[30px] font-bold leading-[1.08] sm:text-[36px] lg:mt-3.5 lg:text-[42px] xl:text-[46px]",
              )}
              style={{ color: NAVY }}
            >
              {hero.title}
              {hero.titleLine2 ? (
                <>
                  <br />
                  {hero.titleLine2}
                </>
              ) : null}
            </h1>

            <p
              className="mt-3.5 max-w-[40rem] text-[13.5px] leading-[1.65] lg:mt-4 lg:text-[14.5px]"
              style={{ color: "#4B5C70" }}
            >
              {hero.body}
            </p>

            {/* Four benefits — one horizontal row on the fade, no card frame */}
            <ul
              className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 lg:mt-8 lg:gap-x-5"
              aria-label={preReg.benefitsAriaLabel}
            >
              {benefits.map((benefit) => (
                <li key={benefit.title} className="min-w-0">
                  <span className="relative mb-3 block h-14 w-14 lg:h-16 lg:w-16">
                    <Image
                      src={benefit.iconSrc}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="64px"
                      unoptimized
                    />
                  </span>
                  <h3 className="text-[12.5px] font-bold leading-snug lg:text-[13.5px]" style={{ color: NAVY }}>
                    {benefit.title}
                  </h3>
                  <p className="mt-1.5 text-[11px] leading-[1.5] lg:text-[11.5px]" style={{ color: "#4B5C70" }}>
                    {benefit.body}
                  </p>
                  {benefit.emphasis ? (
                    <p className="mt-1.5 text-[10.5px] font-semibold leading-snug" style={{ color: GOLD }}>
                      {benefit.emphasis}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>

            {/* Quote — inline below the copy on small screens */}
            <blockquote
              className="mt-7 flex items-start gap-3 rounded-[14px] bg-white/85 px-4 py-3.5 text-[12px] leading-[1.5] shadow-[0_6px_20px_rgba(11,42,85,0.08)] lg:hidden"
              style={{ color: INK_SOFT }}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]"
                style={{ backgroundColor: "#FBF3E5" }}
                aria-hidden
              >
                <BookOpen className="h-4 w-4" style={{ color: GOLD }} strokeWidth={1.9} />
              </span>
              {hero.quote}
            </blockquote>
          </div>
        </Container>
      </section>

      {/* §28 Mobile form order follows the reference top-to-bottom */}
      <form
        onSubmit={onSubmit}
        noValidate
        aria-busy={loading}
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={cn(shellClass, "space-y-6 pt-8 md:space-y-9 md:pt-10")}
        aria-label={preReg.formAriaLabel}
      >
        {/* 1 — Personenanzahl */}
        <section id="traveller-count" aria-labelledby="section-1-heading" className={cardClass}>
          <SectionHeader
            step={1}
            headingId="section-1-heading"
            title={sections.travellerCount.title}
            hint={sections.travellerCount.hint}
          />
          <div
            className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-3.5"
            role="radiogroup"
            aria-label={stripSectionNumber(sections.travellerCount.title)}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => {
              const selected = count === n;
              const label = n === 1 ? fields.person : fields.people;
              return (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={`${n === 6 ? "6+" : n} ${label}`}
                  onClick={() => {
                    setCount(n);
                    if (n === 6 && customCount < 6) setCustomCount(6);
                  }}
                  className={cn(
                    "relative flex min-h-[6.5rem] flex-col items-center justify-center rounded-[14px] border px-2 py-5 transition sm:min-h-[7.25rem]",
                    selected ? selectedTileClass : idleTileClass,
                  )}
                >
                  {selected ? <SelectedBadge /> : null}
                  <UserRound
                    className="h-6 w-6"
                    style={{ color: selected ? CTA_BLUE : "#8DAFDB" }}
                    strokeWidth={1.8}
                    aria-hidden
                  />
                  <span
                    className="mt-2.5 block text-[26px] font-bold leading-none sm:text-[28px]"
                    style={{ color: NAVY }}
                  >
                    {n === 6 ? "6+" : n}
                  </span>
                  <span className="mt-1.5 block text-[12px] font-medium" style={{ color: INK_SOFT }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* §7 6+ travellers — exact count selector */}
          {count === 6 ? (
            <div className="mt-4 rounded-[14px] border border-[#E7EBF1] bg-[#F9FBFE] p-4 md:mt-5">
              <label className="block" htmlFor="six-plus-count">
                <span className="text-[13.5px] font-semibold" style={{ color: NAVY }}>
                  {fields.sixPlusLabel}
                </span>
                <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: INK_SOFT }}>
                  {fields.sixPlusHint}
                </p>
                <div className="relative mt-3 max-w-xs">
                  <select
                    id="six-plus-count"
                    value={customCount}
                    onChange={(e) =>
                      setCustomCount(
                        Math.min(MAX_TRAVELLERS, Math.max(SIX_PLUS_MIN, Number(e.target.value) || SIX_PLUS_MIN)),
                      )
                    }
                    className={selectClass}
                  >
                    {Array.from({ length: MAX_TRAVELLERS - SIX_PLUS_MIN + 1 }, (_, i) => i + SIX_PLUS_MIN).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? fields.person : fields.people}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2"
                    style={{ color: INK_SOFT }}
                    aria-hidden
                  />
                </div>
              </label>
            </div>
          ) : null}
        </section>

        {/* 2 — Gewünschte Programmdauer */}
        <section id="program-duration" aria-labelledby="section-2-heading" className={cardClass}>
          <SectionHeader
            step={2}
            headingId="section-2-heading"
            title={sections.programDuration.title}
            hint={sections.programDuration.hint}
          />
          <div
            className="grid gap-3.5 md:grid-cols-3 md:gap-4 md:items-stretch"
            role="radiogroup"
            aria-label={stripSectionNumber(sections.programDuration.title)}
          >
            {preReg.programDurations.map((option) => {
              const selected = program === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setProgram(option.id)}
                  className={cn(
                    "relative flex h-full flex-col rounded-[14px] border p-5 text-start transition",
                    selected ? selectedTileClass : idleTileClass,
                  )}
                >
                  {selected ? <SelectedBadge /> : null}
                  <div className="flex items-start gap-3.5">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]"
                      style={{ backgroundColor: selected ? "#DCEBFE" : "#EDF3FB" }}
                      aria-hidden
                    >
                      <CalendarDays className="h-5 w-5" style={{ color: CTA_BLUE }} strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0 pe-6">
                      <span
                        className="block text-[10px] font-bold uppercase tracking-[0.11em]"
                        style={{ color: selected ? CTA_BLUE : "#8494A8" }}
                      >
                        {option.label}
                      </span>
                      <span
                        className={cn(display.className, "mt-1.5 block text-[22px] font-bold leading-tight")}
                        style={{ color: NAVY }}
                      >
                        {option.range}
                      </span>
                    </span>
                  </div>
                  <p className="mt-3 flex-1 text-[12.5px] leading-[1.55]" style={{ color: INK_SOFT }}>
                    {option.note}
                  </p>
                  <span className="mt-4 flex items-center gap-2 text-[12.5px] font-semibold">
                    <RadioDot checked={selected} />
                    <span style={{ color: selected ? CTA_BLUE : INK_SOFT }}>
                      {selected ? fields.programChosen : fields.programChoose}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            role="radio"
            aria-checked={program === "unsure"}
            onClick={() => setProgram("unsure")}
            className={cn(
              "mt-3.5 flex min-h-[3.25rem] w-full items-center justify-center gap-2.5 rounded-[14px] border px-4 py-3.5 text-[13px] font-medium transition md:mt-4",
              program === "unsure" ? selectedTileClass : "border-[#E7EBF1] bg-[#F9FBFE] hover:bg-[#F3F8FF]",
            )}
            style={{ color: program === "unsure" ? CTA_BLUE : INK_SOFT }}
          >
            <RadioDot checked={program === "unsure"} />
            {fields.programUnsure}
          </button>
        </section>

        {/* 3 — Angaben zu den Personen */}
        <section id="traveller-details" aria-labelledby="section-3-heading" className={cardClass}>
          <SectionHeader
            step={3}
            headingId="section-3-heading"
            title={sections.travellerDetails.title}
            hint={sections.travellerDetails.hint}
          />

          {/* Desktop: one compact row per traveller */}
          <div className="hidden overflow-x-auto rounded-[12px] border border-[#E7EBF1] md:block">
            <table className="w-full min-w-[54rem] border-collapse" aria-label={sections.travellerDetails.hint}>
              <thead>
                <tr className="bg-[#F4F7FB] text-start text-[12.5px] font-semibold" style={{ color: NAVY }}>
                  <th scope="col" className="w-12 px-3 py-3 text-start">
                    {fields.personColumn}
                  </th>
                  <th scope="col" className="px-2.5 py-3 text-start">
                    {fields.firstName}
                  </th>
                  <th scope="col" className="px-2.5 py-3 text-start">
                    {fields.lastName}
                  </th>
                  <th scope="col" className="px-2.5 py-3 text-start">
                    {fields.nationality}
                  </th>
                  <th scope="col" className="px-2.5 py-3 text-start">
                    {fields.residence}
                  </th>
                  <th scope="col" className="px-2.5 py-3 text-start">
                    {fields.passportType}
                  </th>
                </tr>
              </thead>
              <tbody>
                {visiblePersons.map((p, i) => (
                  <tr key={i} className="border-t border-[#EEF1F6] align-top">
                    <th
                      scope="row"
                      className="px-3 py-3 text-start text-[13px] font-bold"
                      style={{ color: NAVY }}
                    >
                      {i + 1}
                    </th>
                    <td className="px-2.5 py-3">
                      <input
                        value={p.firstName}
                        onChange={(e) => updatePerson(i, { firstName: e.target.value })}
                        onBlur={() => markPersonTouched(i, "firstName")}
                        placeholder={fields.firstNamePlaceholder}
                        aria-label={`${fields.firstName} ${i + 1}`}
                        aria-invalid={showPersonError(i, "firstName") ? true : undefined}
                        data-invalid={showPersonError(i, "firstName") ? "true" : undefined}
                        className={cn(
                          tableInputClass,
                          showPersonError(i, "firstName") && "border-red-500 focus:border-red-500 focus:ring-red-500/15",
                        )}
                      />
                      <FieldError message={showPersonError(i, "firstName")} />
                    </td>
                    <td className="px-2.5 py-3">
                      <input
                        value={p.lastName}
                        onChange={(e) => updatePerson(i, { lastName: e.target.value })}
                        onBlur={() => markPersonTouched(i, "lastName")}
                        placeholder={fields.lastNamePlaceholder}
                        aria-label={`${fields.lastName} ${i + 1}`}
                        aria-invalid={showPersonError(i, "lastName") ? true : undefined}
                        data-invalid={showPersonError(i, "lastName") ? "true" : undefined}
                        className={cn(
                          tableInputClass,
                          showPersonError(i, "lastName") && "border-red-500 focus:border-red-500 focus:ring-red-500/15",
                        )}
                      />
                      <FieldError message={showPersonError(i, "lastName")} />
                    </td>
                    <td className="px-2.5 py-3">
                      <input
                        value={p.nationality}
                        onChange={(e) => updatePerson(i, { nationality: e.target.value, nationalityCode: "" })}
                        onBlur={() => markPersonTouched(i, "nationality")}
                        placeholder={fields.nationalityPlaceholder}
                        aria-label={`${fields.nationality} ${i + 1}`}
                        aria-invalid={showPersonError(i, "nationality") ? true : undefined}
                        data-invalid={showPersonError(i, "nationality") ? "true" : undefined}
                        autoComplete="off"
                        className={cn(
                          tableInputClass,
                          showPersonError(i, "nationality") && "border-red-500 focus:border-red-500 focus:ring-red-500/15",
                        )}
                      />
                      <FieldError message={showPersonError(i, "nationality")} />
                    </td>
                    <td className="px-2.5 py-3">
                      <ResidenceField
                        value={p.residence}
                        countries={residenceCountries}
                        onChange={(v) => {
                          markPersonTouched(i, "residence");
                          updatePerson(i, { residence: v });
                        }}
                        onBlur={() => markPersonTouched(i, "residence")}
                        className={tableSelectClass}
                        label={fields.residence}
                        placeholder={fields.residencePlaceholder}
                        hideLabel
                        ariaLabel={`${fields.residence} ${i + 1}`}
                        error={showPersonError(i, "residence")}
                      />
                    </td>
                    <td className="px-2.5 py-3">
                      <PassportField
                        value={p.passportType}
                        onChange={(v) => {
                          markPersonTouched(i, "passportType");
                          updatePerson(i, { passportType: v });
                        }}
                        onBlur={() => markPersonTouched(i, "passportType")}
                        className={tableSelectClass}
                        label={fields.passportType}
                        placeholder={fields.passportTypePlaceholder}
                        options={preReg.passportTypes}
                        hideLabel
                        ariaLabel={`${fields.passportType} ${i + 1}`}
                        error={showPersonError(i, "passportType")}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* §34 Mobile: all selected travellers visible — no accordion */}
          <div className="space-y-4 md:hidden">
            {visiblePersons.map((p, i) => (
              <article key={i} className="overflow-hidden rounded-[14px] border border-[#E7EBF1] bg-white">
                <div className="border-b border-[#EEF1F6] bg-[#F8FAFD] px-4 py-2.5">
                  <h3 className="text-[13.5px] font-bold" style={{ color: NAVY }}>
                    {fields.person} {i + 1}
                  </h3>
                </div>
                <div className="space-y-3.5 px-4 py-4">
                  <FieldInput
                    label={fields.firstName}
                    value={p.firstName}
                    placeholder={fields.firstNamePlaceholder}
                    error={showPersonError(i, "firstName")}
                    onBlur={() => markPersonTouched(i, "firstName")}
                    onChange={(v) => updatePerson(i, { firstName: v })}
                  />
                  <FieldInput
                    label={fields.lastName}
                    value={p.lastName}
                    placeholder={fields.lastNamePlaceholder}
                    error={showPersonError(i, "lastName")}
                    onBlur={() => markPersonTouched(i, "lastName")}
                    onChange={(v) => updatePerson(i, { lastName: v })}
                  />
                  <FieldInput
                    label={fields.nationality}
                    value={p.nationality}
                    placeholder={fields.nationalityPlaceholder}
                    error={showPersonError(i, "nationality")}
                    onBlur={() => markPersonTouched(i, "nationality")}
                    onChange={(v) => updatePerson(i, { nationality: v, nationalityCode: "" })}
                  />
                  <ResidenceField
                    value={p.residence}
                    countries={residenceCountries}
                    onChange={(v) => {
                      markPersonTouched(i, "residence");
                      updatePerson(i, { residence: v });
                    }}
                    onBlur={() => markPersonTouched(i, "residence")}
                    className={selectClass}
                    label={fields.residence}
                    placeholder={fields.residencePlaceholder}
                    error={showPersonError(i, "residence")}
                  />
                  <PassportField
                    value={p.passportType}
                    onChange={(v) => {
                      markPersonTouched(i, "passportType");
                      updatePerson(i, { passportType: v });
                    }}
                    onBlur={() => markPersonTouched(i, "passportType")}
                    className={selectClass}
                    label={fields.passportType}
                    placeholder={fields.passportTypePlaceholder}
                    options={preReg.passportTypes}
                    error={showPersonError(i, "passportType")}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 4 — Kontaktdaten: phone + departure airport (no email in the reference) */}
        <section id="contact-details" aria-labelledby="section-4-heading" className={cardClass}>
          <SectionHeader
            step={4}
            headingId="section-4-heading"
            title={sections.contact.title}
            hint={sections.contact.hint}
          />
          <div className="grid gap-5 md:grid-cols-2 md:gap-7">
            <label className="block">
              <span className="mb-2 block text-[13px] font-semibold" style={{ color: NAVY }}>
                {fields.phoneNumber}
              </span>
              <div
                className={cn(
                  "dir-ltr-keep flex overflow-hidden rounded-[10px] border bg-white transition focus-within:ring-2",
                  showFieldError("phone")
                    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/15"
                    : "border-[#DDE3EC] focus-within:border-[#1264F5] focus-within:ring-[#1264F5]/12",
                )}
              >
                <div className="relative shrink-0">
                  <select
                    value={dialCode}
                    onChange={(e) => setDialCode(e.target.value)}
                    className={cn(
                      selectClass,
                      "w-[5.75rem] rounded-none border-0 border-e border-[#DDE3EC] bg-[#FAFBFD] pe-6 ps-3 text-[12.5px] font-semibold focus:ring-0",
                    )}
                    aria-label={fields.phoneDialCode}
                  >
                    {residenceCountries.map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.code} {r.dial}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => markTouched("phone")}
                  placeholder={fields.phonePlaceholder}
                  aria-label={fields.phoneNumber}
                  aria-invalid={showFieldError("phone") ? true : undefined}
                  data-invalid={showFieldError("phone") ? "true" : undefined}
                  className={cn(inputClass, "min-w-0 flex-1 rounded-none border-0 focus:ring-0")}
                  inputMode="tel"
                  autoComplete="tel-national"
                />
              </div>
              <FieldError message={showFieldError("phone")} />
            </label>

            <DepartureAirportsField
              label={fields.departureAirport}
              placeholder={fields.departureAirportPlaceholder}
              addLabel={fields.addDepartureAirport}
              value={airports}
              onChange={setAirports}
            />
          </div>
        </section>

        {/* 5 — Wo haben Sie uns gefunden? (nothing preselected) */}
        <section id="referral-source" aria-labelledby="section-5-heading" className={cardClass}>
          <SectionHeader
            step={5}
            headingId="section-5-heading"
            title={sections.source.title}
            hint={sections.source.hint}
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3.5" role="radiogroup" aria-labelledby="section-5-heading">
            {gridSourceOptions.map(({ value, label }) => (
              <SourceTile
                key={value}
                value={value}
                label={label}
                checked={source === value}
                onChange={() => {
                  markTouched("source");
                  setSource(value);
                  setSourceOtherDetail("");
                }}
              />
            ))}
          </div>

          {otherSourceOption ? (
            <SourceTile
              value={otherSourceOption.value}
              label={otherSourceOption.label}
              checked={source === otherSourceOption.value}
              centered
              className="mt-3 lg:mt-3.5"
              onChange={() => {
                markTouched("source");
                setSource(otherSourceOption.value);
              }}
            />
          ) : null}

          <FieldError message={showFieldError("source")} className="mt-3" />

          {source === "other" ? (
            <label className="mt-3 block max-w-md">
              <span className="mb-1.5 block text-[12.5px] font-semibold" style={{ color: NAVY }}>
                {fields.sourceOtherPlaceholder}
              </span>
              <input
                type="text"
                value={sourceOtherDetail}
                onChange={(e) => setSourceOtherDetail(e.target.value)}
                placeholder={fields.sourceOtherPlaceholder}
                className={inputClass}
              />
            </label>
          ) : null}
        </section>

        {/* Security strip — informational only; no unverified legal claims */}
        <section
          id="privacy-information"
          aria-labelledby="privacy-heading"
          className="rounded-[18px] border border-[#D7E6FA] bg-[#F1F7FE] p-5 md:flex md:items-center md:justify-between md:gap-8 md:px-7 md:py-5"
        >
          <div className="flex min-w-0 items-start gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(11,42,85,0.08)]">
              <Shield className="h-5 w-5" style={{ color: CTA_BLUE }} strokeWidth={1.8} aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 id="privacy-heading" className="text-[15px] font-bold" style={{ color: NAVY }}>
                {privacy.title}
              </h2>
              <p className="mt-1.5 text-[13px] leading-[1.6]" style={{ color: INK_SOFT }}>
                {privacy.body}
              </p>
            </div>
          </div>
          <div className="mt-4 flex shrink-0 flex-wrap gap-2.5 text-[12.5px] font-semibold md:mt-0" style={{ color: NAVY }}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2.5 shadow-[0_1px_4px_rgba(11,42,85,0.07)]">
              <Lock className="h-3.5 w-3.5" style={{ color: CTA_BLUE }} aria-hidden />
              {privacy.ssl}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2.5 shadow-[0_1px_4px_rgba(11,42,85,0.07)]">
              <Check className="h-3.5 w-3.5" style={{ color: GOLD }} strokeWidth={2.75} aria-hidden />
              {privacy.compliant}
            </span>
          </div>
        </section>

        {/* Final CTA — copy left, blue button right, script line beneath */}
        <section
          id="final-cta"
          aria-labelledby="final-cta-heading"
          className="rounded-[18px] border border-[#E7EBF1] bg-white p-6 shadow-[0_2px_14px_rgba(11,42,85,0.045)] md:flex md:items-center md:justify-between md:gap-10 md:px-8 md:py-8"
        >
          <div className="min-w-0 md:max-w-[40rem] md:flex-1">
            <h2
              id="final-cta-heading"
              className={cn(display.className, "text-[19px] font-bold leading-snug md:text-[22px]")}
              style={{ color: NAVY }}
            >
              {cta.infoTitle}
            </h2>
            <p className="mt-3 text-[13px] font-medium leading-[1.65] md:text-[14px]" style={{ color: "#3E5470" }}>
              {cta.infoLead}
            </p>
            <p className="mt-2.5 text-[12.5px] leading-[1.65] md:text-[13px]" style={{ color: INK_SOFT }}>
              {cta.infoFollowUp}
            </p>
          </div>
          <div className="mt-6 shrink-0 md:mt-0 md:w-[21rem]">
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className={cn(
                "flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-[10px] px-5 text-[15px] font-bold text-white shadow-[0_8px_22px_rgba(18,100,245,0.26)] transition hover:brightness-95 disabled:opacity-60",
                loading && "cursor-not-allowed",
              )}
              style={{ backgroundColor: CTA_BLUE }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  {cta.submitting}
                </>
              ) : (
                <>
                  {cta.submit}
                  <DirArrow />
                </>
              )}
            </button>
            <p
              className={cn(script.className, "mt-3.5 text-center text-[22px] leading-none md:text-end")}
              style={{ color: NAVY }}
              aria-hidden
            >
              {cta.handwritten}
            </p>
          </div>
        </section>
      </form>

      {/* Subtle decorative close — mirrors the faint minaret sketch in the reference */}
      <div className="pointer-events-none relative h-24 overflow-hidden md:h-28" aria-hidden>
        <span className="absolute bottom-0 end-0 block h-full w-48 opacity-50" style={decoStyle} />
        <span
          className="absolute bottom-0 start-0 block h-full w-48 opacity-30 -scale-x-100"
          style={decoStyle}
        />
      </div>
      </div>
    </div>
  );
}

const decoStyle: React.CSSProperties = {
  backgroundImage: `url('${DECO_MINARET}')`,
  backgroundSize: "520px auto",
  backgroundPosition: "right bottom",
  backgroundRepeat: "no-repeat",
};

function SelectedBadge() {
  return (
    <span
      className="absolute end-2.5 top-2.5 flex h-[17px] w-[17px] items-center justify-center rounded-full"
      style={{ backgroundColor: CTA_BLUE }}
      aria-hidden
    >
      <Check className="h-[9px] w-[9px] text-white" strokeWidth={3.5} />
    </span>
  );
}

function RadioDot({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border transition",
        checked ? "border-[#1264F5]" : "border-[#C6D0DD]",
      )}
      aria-hidden
    >
      {checked ? (
        <span className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: CTA_BLUE }} />
      ) : null}
    </span>
  );
}

function SourceTile({
  value,
  label,
  checked,
  onChange,
  centered,
  className,
}: {
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  centered?: boolean;
  className?: string;
}) {
  const visual = SOURCE_VISUAL[value] ?? SOURCE_VISUAL.other;
  const Icon = visual.Icon;

  return (
    <label
      className={cn(
        "relative flex min-h-[3.5rem] cursor-pointer items-center gap-3 rounded-[12px] border px-4 py-3.5 transition",
        centered && "justify-center",
        checked ? selectedTileClass : idleTileClass,
        className,
      )}
    >
      {checked ? <SelectedBadge /> : null}
      {visual.src ? (
        <span className="relative h-8 w-8 shrink-0">
          <Image src={visual.src} alt="" fill className="object-contain" sizes="32px" />
        </span>
      ) : Icon ? (
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: visual.tint }}
          aria-hidden
        >
          <Icon className="h-4 w-4" style={{ color: visual.ink }} strokeWidth={2} />
        </span>
      ) : null}
      <span className="min-w-0 text-[13.5px] font-medium" style={{ color: NAVY }}>
        {label}
      </span>
      <input
        type="radio"
        name="source"
        value={value}
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
}

function FieldError({ message, className }: { message?: string; className?: string }) {
  if (!message) return null;
  return (
    <p className={cn("text-[11.5px] text-red-600", className ?? "mt-1.5")} role="alert" data-invalid="true">
      {message}
    </p>
  );
}

function CountrySelect({
  value,
  countries,
  onChange,
  onBlur,
  className,
  placeholder,
  ariaLabel,
  error,
}: {
  value: string;
  countries: ResolvedResidenceCountry[];
  onChange: (v: string) => void;
  onBlur?: () => void;
  className: string;
  placeholder?: string;
  ariaLabel?: string;
  error?: string;
}) {
  const hasError = Boolean(error);

  return (
    <div className="relative">
      <select
        value={value}
        aria-label={ariaLabel}
        aria-invalid={hasError || undefined}
        data-invalid={hasError ? "true" : undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={cn(
          className,
          !value && placeholder && "text-[#98A6B8]",
          hasError && "border-red-500 focus:border-red-500 focus:ring-red-500/15",
        )}
      >
        <option value="">{placeholder ?? "—"}</option>
        {countries.map((r) => (
          <option key={r.code} value={r.code}>
            {r.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute end-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
        style={{ color: INK_SOFT }}
        aria-hidden
      />
    </div>
  );
}

function ResidenceField({
  value,
  countries,
  onChange,
  onBlur,
  className,
  label,
  placeholder,
  hideLabel,
  ariaLabel,
  error,
}: {
  value: string;
  countries: ResolvedResidenceCountry[];
  onChange: (v: string) => void;
  onBlur?: () => void;
  className: string;
  label: string;
  placeholder: string;
  hideLabel?: boolean;
  ariaLabel?: string;
  error?: string;
}) {
  return (
    <label className="block">
      {hideLabel ? (
        <span className="sr-only">{ariaLabel ?? label}</span>
      ) : (
        <span className="mb-1.5 block text-[12.5px] font-semibold" style={{ color: NAVY }}>
          {label}
        </span>
      )}
      <CountrySelect
        value={value}
        countries={countries}
        onChange={onChange}
        onBlur={onBlur}
        className={className}
        placeholder={placeholder}
        ariaLabel={ariaLabel ?? label}
        error={error}
      />
      <FieldError message={error} />
    </label>
  );
}

function PassportField({
  value,
  onChange,
  onBlur,
  className,
  label,
  placeholder,
  options,
  hideLabel,
  ariaLabel,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  className: string;
  label: string;
  placeholder: string;
  options: HajjPassportTypeOption[];
  hideLabel?: boolean;
  ariaLabel?: string;
  error?: string;
}) {
  const hasError = Boolean(error);

  return (
    <label className="block">
      {hideLabel ? (
        <span className="sr-only">{ariaLabel ?? label}</span>
      ) : (
        <span className="mb-1.5 block text-[12.5px] font-semibold" style={{ color: NAVY }}>
          {label}
        </span>
      )}
      <div className="relative">
        <select
          value={value}
          aria-label={ariaLabel ?? label}
          aria-invalid={hasError || undefined}
          data-invalid={hasError ? "true" : undefined}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={cn(
            className,
            !value && placeholder && "text-[#98A6B8]",
            hasError && "border-red-500 focus:border-red-500 focus:ring-red-500/15",
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute end-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
          style={{ color: INK_SOFT }}
          aria-hidden
        />
      </div>
      <FieldError message={error} />
    </label>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  const keepLtr = type === "email" || type === "tel";
  const hasError = Boolean(error);

  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-semibold" style={{ color: NAVY }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={hasError || undefined}
        data-invalid={hasError ? "true" : undefined}
        className={cn(
          inputClass,
          keepLtr && "dir-ltr-keep",
          hasError && "border-red-500 focus:border-red-500 focus:ring-red-500/15",
        )}
      />
      <FieldError message={error} />
    </label>
  );
}

function emptyPersons(n: number): Person[] {
  return Array.from({ length: n }, () => ({
    firstName: "",
    lastName: "",
    nationality: "",
    nationalityCode: "",
    residence: "",
    passportType: DEFAULT_HAJJ_PASSPORT_TYPE_ID,
  }));
}
