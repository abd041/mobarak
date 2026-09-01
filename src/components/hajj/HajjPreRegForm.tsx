"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { hajjCampaignLandingPath } from "@/data/hajj-campaign-types";
import { useHajjCampaignOptional } from "@/components/hajj/HajjCampaignProvider";
import type { Locale } from "@/i18n/routing";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Globe2,
  Loader2,
  Lock,
  Shield,
  UserRound,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import { NationalityCombobox, type NationalityValue } from "@/components/ui/NationalityCombobox";
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
import { IQ } from "@/lib/images";
import {
  hasHajjPreRegFormErrors,
  validateHajjPreRegForm,
  type HajjPersonFieldErrors,
  type HajjPreRegFormErrors,
} from "@/lib/hajj-pre-reg-validation";
import { cn } from "@/lib/utils";

const HERO_IMAGE_FALLBACK = "/brand/hero-bg.png";
const MAX_TRAVELLERS = 20;
const SIX_PLUS_MIN = 6;

const BENEFIT_ICON_SRC: Record<HajjPreRegBenefitIcon, string> = {
  shield: "/brand/icons/hajj-prereg/shield.png",
  users: "/brand/icons/hajj-prereg/users.png",
  clipboard: "/brand/icons/hajj-prereg/clipboard.png",
  award: "/brand/icons/hajj-prereg/award.png",
};

const TRUST_ICONS = [Clock3, UserRound, BookOpen, Users, Globe2] as const;

type Person = {
  firstName: string;
  lastName: string;
  nationality: string;
  nationalityCode: string;
  residence: string;
  passportType: string;
};

type PersonTouch = Partial<Record<keyof HajjPersonFieldErrors, boolean>>;
type FormTouch = {
  persons: PersonTouch[];
  phone?: boolean;
  email?: boolean;
  source?: boolean;
};

function emptyFormTouch(): FormTouch {
  return { persons: Array.from({ length: MAX_TRAVELLERS }, () => ({})) };
}

function toNationalityValue(person: Person): NationalityValue {
  return person.nationalityCode && person.nationality
    ? { code: person.nationalityCode, name: person.nationality }
    : null;
}

type Benefit = {
  title: string;
  body: string;
  iconSrc: string;
  emphasis?: string;
  highlight?: boolean;
};

function stripSectionNumber(title: string) {
  return title.replace(/^\d+\.\s*/, "");
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
    <div className="mb-5 flex gap-3.5 md:mb-6">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-[13px] font-bold text-white lg:h-9 lg:w-9 lg:ring-2 lg:ring-brand-gold/25"
        aria-hidden
      >
        {step}
      </span>
      <div className="min-w-0 pt-0.5">
        <h2
          id={headingId}
          className="font-serif text-[20px] font-semibold leading-snug tracking-[-0.02em] text-navy lg:font-sans lg:text-[19px] lg:font-bold lg:tracking-[-0.01em]"
        >
          {stripSectionNumber(title)}
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted md:text-[14px]">{hint}</p>
      </div>
    </div>
  );
}

/** Shared form surface tokens — premium Hajj pre-reg, not generic contact form */
const formCardClass =
  "rounded-2xl border border-line bg-white p-5 shadow-card md:p-7 lg:rounded-[1.125rem] lg:p-8";
const inputClass =
  "w-full rounded-xl border border-line bg-white px-3.5 py-3 text-[14px] text-navy shadow-[inset_0_1px_2px_rgba(11,44,74,0.03)] outline-none transition placeholder:text-muted/55 focus:border-brand-cta focus:ring-2 focus:ring-brand-cta/12";
const selectClass = cn(inputClass, "appearance-none pe-10");
const tableInputClass =
  "w-full min-w-0 rounded-lg border border-line bg-white px-2.5 py-2.5 text-[13px] text-navy shadow-[inset_0_1px_2px_rgba(11,44,74,0.03)] outline-none transition focus:border-brand-cta focus:ring-2 focus:ring-brand-cta/12";
const tableSelectClass = cn(tableInputClass, "appearance-none pe-8");
const finalCtaBtnClass =
  "flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-navy px-5 text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(11,44,74,0.22)] transition hover:bg-navy-deep active:bg-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:opacity-60 md:min-h-[52px] md:px-6 md:py-4";

export function HajjPreRegForm({
  campaignSlug,
  preReg,
}: {
  campaignSlug?: string;
  preReg: HajjPreRegContent;
}) {
  const campaign = useHajjCampaignOptional();
  const landingPath = campaign?.landingPath ?? hajjCampaignLandingPath(campaignSlug ?? "hajj-2027");
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

  const [count, setCount] = useState(2);
  const [customCount, setCustomCount] = useState(6);
  // §13: fixed buffer — retain entered data when count decreases; restore when count increases again
  const [persons, setPersons] = useState<Person[]>(() => emptyPersons(MAX_TRAVELLERS));
  const [phone, setPhone] = useState("");
  const [dialCode, setDialCode] = useState("AT");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [sourceOtherDetail, setSourceOtherDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<HajjPreRegFormErrors>({ persons: [] });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState<FormTouch>(() => emptyFormTouch());

  const validationMessages = useMemo(
    () => ({ ...preReg.validation }),
    [preReg.validation],
  );

  const effectiveCount = count === 6 ? customCount : count;
  const visiblePersons = persons.slice(0, effectiveCount);
  // §20–§21: Person 1's country of residence drives the contact phone prefix; other travellers are ignored
  const leadResidence = persons[0]?.residence ?? "";
  const dialCountry = residenceCountries.find((r) => r.code === dialCode) ??
    RESIDENCE_COUNTRIES.find((r) => r.code === dialCode);
  const dialFlag = dialCountry?.flag ?? "🇦🇹";

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
        email,
        validationMessages,
        allowedResidenceCodes,
      ),
    );
  }, [submitAttempted, locale, persons, effectiveCount, source, phone, email, validationMessages, allowedResidenceCodes]);

  function markPersonTouched(index: number, field: keyof HajjPersonFieldErrors) {
    setTouched((prev) => ({
      ...prev,
      persons: prev.persons.map((person, i) => (i === index ? { ...person, [field]: true } : person)),
    }));
  }

  function markTouched(field: "phone" | "email" | "source") {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function showPersonError(index: number, field: keyof HajjPersonFieldErrors): string | undefined {
    const show = submitAttempted || touched.persons[index]?.[field];
    return show ? errors.persons[index]?.[field] : undefined;
  }

  function showFieldError(field: "source" | "phone" | "email"): string | undefined {
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
      email,
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
      // Placeholder until API wiring — §30 keeps button disabled for the full request
      await new Promise((r) => setTimeout(r, 800));
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div
        className="hajj-prereg flex min-h-[70vh] items-center justify-center px-4 py-16 md:min-h-[65vh] md:py-24"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <div
          className="w-full max-w-lg rounded-2xl border border-line bg-white p-8 text-center shadow-card md:p-10"
          role="status"
          aria-live="polite"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-soft ring-2 ring-brand-green/15">
            <Check className="h-8 w-8 text-brand-green" strokeWidth={2.5} aria-hidden />
          </div>
          <h1 className="mb-4 text-2xl font-bold tracking-[-0.02em] text-navy md:text-3xl">{preReg.success.title}</h1>
          <p className="mb-8 text-[15px] leading-relaxed text-muted md:text-[16px] md:leading-[1.7]">{preReg.success.body}</p>
          <Link
            href={landingPath}
            className="inline-flex items-center justify-center gap-1.5 font-semibold text-brand-cta transition hover:text-navy"
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
    highlight: benefit.highlight,
    iconSrc: BENEFIT_ICON_SRC[benefit.icon],
  }));

  const trustItems = preReg.trust.map((label, index) => ({
    label,
    Icon: TRUST_ICONS[index] ?? Clock3,
  }));

  const { hero, sections, fields, privacy, cta } = preReg;

  return (
    <div className="hajj-prereg pb-12 md:pb-0" dir={locale === "ar" ? "rtl" : "ltr"}>
      {/* §31 Wording: Voranmeldung / pre-registration only — never Buchung/booking on this form */}
      {/* Hero — mobile list card / desktop 4-col strip (do not change desktop) */}
      <section id="top" className="relative bg-white">
        {/* ── Mobile — match design reference (do not affect lg+) ── */}
        <div className="relative overflow-hidden lg:hidden">
          <div className="absolute inset-0" aria-hidden>
            <Image
              src={hero.imageSrc || HERO_IMAGE_FALLBACK}
              alt=""
              fill
              priority
              quality={IQ.hero}
              className="hajj-prereg-mobile-photo object-cover"
              sizes="100vw"
            />
            <div className="hajj-prereg-mobile-wash absolute inset-0" />
          </div>

          <div className="relative px-5 pt-7 pb-5 sm:px-6">
            <span className="mb-3 inline-block rounded-[6px] bg-[#C4A35A] px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-white uppercase">
              {hero.label}
            </span>
            <h1 className="max-w-[17ch] font-serif text-[26px] font-semibold leading-[1.08] tracking-[-0.02em] text-navy sm:text-[28px]">
              {hero.title}
              {hero.titleLine2 ? (
                <>
                  <br />
                  {hero.titleLine2}
                </>
              ) : null}
            </h1>
            <p className="mt-3 max-w-[34rem] text-[13px] leading-[1.65] font-medium text-navy/90 sm:text-[14px]">
              {hero.body}
            </p>

            <div
              className="mt-6 overflow-hidden rounded-[22px] border border-[#ECEEF2] bg-white shadow-[0_10px_36px_rgba(9,30,66,0.08)]"
              role="list"
              aria-label={preReg.benefitsAriaLabel}
            >
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  role="listitem"
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 sm:gap-3.5 sm:px-5 sm:py-4",
                    index < benefits.length - 1 && "border-b border-[#ECEEF2]",
                  )}
                >
                  <span className="relative h-8 w-8 shrink-0 sm:h-9 sm:w-9">
                    <Image
                      src={benefit.iconSrc}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="36px"
                    />
                  </span>
                  <div className="min-w-0 flex-1 pe-1">
                    <h3 className="text-[14px] font-bold leading-snug text-navy sm:text-[15px]">
                      {benefit.title}
                    </h3>
                    <p className="mt-0.5 text-[12px] leading-[1.5] text-[#5B6B7C] sm:text-[12.5px]">
                      {benefit.body}
                    </p>
                  </div>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-navy/55 rtl:rotate-180"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Desktop — locked (do not change) ── */}
        <div className="relative hidden min-h-[520px] overflow-hidden md:min-h-[500px] lg:block">
          <div className="absolute inset-0" aria-hidden>
            <Image
              src={hero.imageSrc || HERO_IMAGE_FALLBACK}
              alt=""
              fill
              priority
              quality={IQ.hero}
              className="hajj-hero-photo object-cover"
              sizes="100vw"
            />
            <div className="hajj-hero-scrim absolute inset-0" />
          </div>

          <Container className="relative flex min-h-[inherit] items-center py-10 md:py-8">
            <div className="w-full max-w-xl lg:max-w-3xl">
              <span className="mb-4 inline-block rounded-md bg-[#C4A35A] px-3.5 py-1.5 text-[10px] font-bold tracking-[0.14em] text-white uppercase sm:text-[11px]">
                {hero.label}
              </span>
              <h1 className="font-serif text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-navy sm:text-[36px] lg:text-[40px]">
                {hero.title}
                {hero.titleLine2 ? (
                  <>
                    <br />
                    {hero.titleLine2}
                  </>
                ) : null}
              </h1>
              <p className="mt-3 max-w-[34rem] text-[14px] leading-[1.65] text-navy/80 md:text-[15px]">
                {hero.body}
              </p>

              {/* §4 Benefits — under hero copy, 4 in one row */}
              <div
                className="mt-6 grid grid-cols-4 overflow-hidden rounded-[14px] border border-[#E8EAEE] bg-white/95 shadow-[0_8px_28px_rgba(9,30,66,0.08)] backdrop-blur-[2px]"
                role="list"
                aria-label={preReg.benefitsAriaLabel}
              >
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit.title}
                    role="listitem"
                    className={cn(
                      "flex flex-col items-start px-2.5 py-3 text-start sm:px-3 sm:py-3.5 lg:px-3.5 lg:py-4",
                      index < benefits.length - 1 && "border-e border-[#E8EAEE]",
                      benefit.highlight && "bg-[#FFFCF8]",
                    )}
                  >
                    <span className="relative mb-2.5 block h-8 w-8 shrink-0 sm:h-9 sm:w-9 lg:h-10 lg:w-10">
                      <Image
                        src={benefit.iconSrc}
                        alt=""
                        fill
                        className="object-contain"
                        sizes="40px"
                      />
                    </span>
                    <h3 className="text-[11px] font-bold leading-snug text-navy sm:text-[12px] lg:text-[13px]">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-[9px] leading-[1.4] text-navy/70 sm:text-[10px] sm:leading-[1.45] lg:text-[11px]">
                      {benefit.body}
                    </p>
                    {benefit.emphasis ? (
                      <p className="mt-1 text-[9px] font-semibold leading-snug text-brand-orange-ink sm:text-[10px]">
                        {benefit.emphasis}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* §28 Mobile form order: hero → benefits → §1 count → §2 travellers → §3 contact → §4 source → privacy → CTA */}
      <form
        onSubmit={onSubmit}
        noValidate
        aria-busy={loading}
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="mx-auto mt-5 max-w-5xl space-y-7 px-4 md:mt-10 md:space-y-8 md:px-8 lg:mt-12"
        aria-label={preReg.formAriaLabel}
      >
        {/* §5 Main form — four numbered sections */}
        {/* §6 Number of Travellers */}
        <section id="traveller-count" aria-labelledby="section-1-heading" className={formCardClass}>
          <SectionHeader
            step={1}
            headingId="section-1-heading"
            title={sections.travellerCount.title}
            hint={sections.travellerCount.hint}
          />
          <div
            className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 lg:gap-4"
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
                    "relative flex items-center gap-3 rounded-2xl border px-3.5 py-3.5 text-start transition lg:min-h-[7.75rem] lg:flex-col lg:items-center lg:justify-center lg:gap-0 lg:px-3 lg:py-6 lg:text-center",
                    selected
                      ? "border-navy bg-navy text-white shadow-[0_4px_16px_rgba(11,44,74,0.28)]"
                      : "border-line bg-white text-navy hover:border-brand-orange/35 hover:bg-[#FFFCF8]",
                  )}
                >
                  {selected ? (
                    <span
                      className="absolute end-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-navy"
                      aria-hidden
                    >
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                  ) : null}
                  <UserRound
                    className={cn(
                      "h-6 w-6 shrink-0 lg:mb-2.5",
                      selected ? "text-white" : "text-brand-gold",
                    )}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span className="flex min-w-0 flex-1 items-baseline gap-1.5 lg:flex-col lg:items-center lg:gap-0">
                    <span className="block text-[22px] font-bold leading-none lg:text-[28px]">
                      {n === 6 ? "6+" : n}
                    </span>
                    <span
                      className={cn(
                        "block text-[12px] font-semibold lg:mt-1.5 lg:text-[13px]",
                        selected ? "text-white/95" : "text-navy",
                      )}
                    >
                      {label}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* §7 6+ travellers — exact count selector */}
          {count === 6 ? (
            <div className="mt-5 rounded-xl border border-line bg-[#FFFCF8] p-4 md:mt-6 md:p-5">
              <label className="block" htmlFor="six-plus-count">
                <span className="text-[14px] font-semibold text-navy md:text-[15px]">{fields.sixPlusLabel}</span>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted md:text-[14px]">{fields.sixPlusHint}</p>
                <div className="relative mt-4 max-w-xs">
                  <select
                    id="six-plus-count"
                    value={customCount}
                    onChange={(e) =>
                      setCustomCount(
                        Math.min(MAX_TRAVELLERS, Math.max(SIX_PLUS_MIN, Number(e.target.value) || SIX_PLUS_MIN)),
                      )
                    }
                    className={selectClass}
                    aria-describedby="six-plus-count-hint"
                  >
                    {Array.from({ length: MAX_TRAVELLERS - SIX_PLUS_MIN + 1 }, (_, i) => i + SIX_PLUS_MIN).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? fields.person : fields.people}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                    aria-hidden
                  />
                </div>
                <p id="six-plus-count-hint" className="sr-only">
                  {fields.sixPlusHint}
                </p>
              </label>
            </div>
          ) : null}
        </section>

        {/* §8 Traveller details — desktop table; §9–§12 mobile accordion (all expanded by default) */}
        <section id="traveller-details" aria-labelledby="section-2-heading" className={formCardClass}>
          <SectionHeader
            step={2}
            headingId="section-2-heading"
            title={sections.travellerDetails.title}
            hint={sections.travellerDetails.hint}
          />

          {/* Desktop: one horizontal row per traveller */}
          <div className="hidden overflow-x-auto rounded-xl border border-line md:block">
            <table className="w-full min-w-[860px] border-collapse" aria-label={sections.travellerDetails.hint}>
              <thead>
                <tr className="border-b border-line bg-[#FFFCF8] text-start text-[12px] font-semibold text-navy">
                  <th scope="col" className="w-14 px-3 py-3.5 pe-2">
                    {fields.personColumn}
                  </th>
                  <th scope="col" className="px-3 py-3.5 pe-2">
                    {fields.firstName}
                  </th>
                  <th scope="col" className="px-3 py-3.5 pe-2">
                    {fields.lastName}
                  </th>
                  <th scope="col" className="px-3 py-3.5 pe-2">
                    {fields.nationality}
                  </th>
                  <th scope="col" className="px-3 py-3.5 pe-2">
                    {fields.residence}
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    {fields.passportType}
                  </th>
                </tr>
              </thead>
              <tbody>
                {visiblePersons.map((p, i) => (
                  <tr key={i} className="border-t border-line align-top">
                    <th scope="row" className="px-3 py-3.5 pe-2 text-[14px] font-bold text-navy">
                      {i + 1}
                    </th>
                    <td className="px-3 py-3.5 pe-2">
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
                    <td className="px-3 py-3.5 pe-2">
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
                    <td className="px-3 py-3.5 pe-2">
                      <NationalityCombobox
                        label={fields.nationality}
                        placeholder={fields.nationalityPlaceholder}
                        locale={locale}
                        fieldId={`hajj-traveller-${i}`}
                        hideLabel
                        ariaLabel={`${fields.nationality} ${i + 1}`}
                        inputClassName={cn(
                          tableInputClass,
                          showPersonError(i, "nationality") && "border-red-500 focus:border-red-500 focus:ring-red-500/15",
                        )}
                        value={toNationalityValue(p)}
                        error={errors.persons[i]?.nationality}
                        showError={submitAttempted || Boolean(touched.persons[i]?.nationality)}
                        onBlur={() => markPersonTouched(i, "nationality")}
                        onChange={(next) => {
                          markPersonTouched(i, "nationality");
                          updatePerson(i, {
                            nationality: next?.name ?? "",
                            nationalityCode: next?.code ?? "",
                          });
                        }}
                      />
                    </td>
                    <td className="px-3 py-3.5 pe-2">
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
                    <td className="px-3 py-3.5">
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

          {/* §34 Mobile: all selected travellers visible — no accordion; forms shown immediately */}
          <div className="space-y-4 md:hidden">
            {visiblePersons.map((p, i) => (
              <article
                key={i}
                className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_2px_12px_rgba(11,44,74,0.04)]"
              >
                <div
                  id={`traveller-mobile-${i}-heading`}
                  className="border-b border-line px-4 py-3.5"
                >
                  <h3 className="text-[15px] font-bold text-navy">
                    {fields.person} {i + 1}
                  </h3>
                </div>
                <div
                  id={`traveller-mobile-${i}-panel`}
                  aria-labelledby={`traveller-mobile-${i}-heading`}
                  className="space-y-4 px-4 py-4"
                >
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
                  <NationalityCombobox
                    label={fields.nationality}
                    placeholder={fields.nationalityPlaceholder}
                    locale={locale}
                    fieldId={`hajj-traveller-mobile-${i}`}
                    value={toNationalityValue(p)}
                    error={errors.persons[i]?.nationality}
                    showError={submitAttempted || Boolean(touched.persons[i]?.nationality)}
                    onBlur={() => markPersonTouched(i, "nationality")}
                    onChange={(next) => {
                      markPersonTouched(i, "nationality");
                      updatePerson(i, {
                        nationality: next?.name ?? "",
                        nationalityCode: next?.code ?? "",
                      });
                    }}
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

        {/* §19 Contact details — after all traveller information */}
        <section id="contact-details" aria-labelledby="section-3-heading" className={formCardClass}>
          <SectionHeader
            step={3}
            headingId="section-3-heading"
            title={sections.contact.title}
            hint={sections.contact.hint}
          />
          <div className="space-y-4 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-navy">{fields.phoneNumber}</span>
              <div
                className={cn(
                  "dir-ltr-keep flex overflow-hidden rounded-xl border bg-white focus-within:ring-2",
                  showFieldError("phone")
                    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/15"
                    : "border-line focus-within:border-brand-cta focus-within:ring-brand-cta/12",
                )}
              >
                <div className="relative shrink-0">
                  <select
                    value={dialCode}
                    onChange={(e) => setDialCode(e.target.value)}
                    className={cn(selectClass, "w-[6.5rem] rounded-none border-0 border-e border-line ps-9 shadow-none focus:ring-0")}
                    aria-label={fields.phoneDialCode}
                  >
                    {residenceCountries.map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.flag} {r.dial}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute start-2.5 top-1/2 -translate-y-1/2 text-[15px]" aria-hidden>
                    {dialFlag}
                  </span>
                </div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => markTouched("phone")}
                  placeholder={fields.phonePlaceholder}
                  aria-label={fields.phoneNumber}
                  aria-invalid={showFieldError("phone") ? true : undefined}
                  data-invalid={showFieldError("phone") ? "true" : undefined}
                  className={cn(inputClass, "min-w-0 flex-1 rounded-none border-0 shadow-none focus:ring-0")}
                  inputMode="tel"
                  autoComplete="tel-national"
                />
              </div>
              <FieldError message={showFieldError("phone")} />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-navy">
                {fields.emailAddress}{" "}
                <span className="font-normal text-muted">({fields.fieldOptional})</span>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => markTouched("email")}
                placeholder={fields.emailPlaceholder}
                aria-invalid={showFieldError("email") ? true : undefined}
                data-invalid={showFieldError("email") ? "true" : undefined}
                className={cn(
                  inputClass,
                  "dir-ltr-keep",
                  showFieldError("email") && "border-red-500 focus:border-red-500 focus:ring-red-500/15",
                )}
                autoComplete="email"
              />
              <FieldError message={showFieldError("email")} />
            </label>
          </div>
        </section>

        {/* §23 How did you find us? — nothing preselected */}
        <section id="referral-source" aria-labelledby="section-4-heading" className={formCardClass}>
          <SectionHeader
            step={4}
            headingId="section-4-heading"
            title={sections.source.title}
            hint={sections.source.hint}
          />

          <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-labelledby="section-4-heading">
            {sourceOptions.map(({ value, label }) => (
              <SourceRadio
                key={value}
                value={value}
                label={label}
                checked={source === value}
                onChange={() => {
                  markTouched("source");
                  setSource(value);
                  if (value !== "other") setSourceOtherDetail("");
                }}
              />
            ))}
          </div>

          <FieldError message={showFieldError("source")} className="mt-3" />

          {source === "other" ? (
            <label className="mt-3 block max-w-md text-sm">
              <span className="mb-1.5 block text-[13px] font-medium text-navy">{fields.sourceOtherPlaceholder}</span>
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

        {/* §24 Privacy trust box — informational only; no unverified legal claims */}
        <section id="privacy-information" aria-labelledby="privacy-heading" className="rounded-2xl border border-brand-cta/15 bg-[#F5F9FD] p-5 md:flex md:items-center md:justify-between md:gap-8 md:p-6 lg:rounded-[1.125rem]">
          <div className="flex min-w-0 gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-cta shadow-card">
              <Shield className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 id="privacy-heading" className="text-[15px] font-bold text-navy md:text-[16px]">
                {privacy.title}
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted md:text-[14px]">{privacy.body}</p>
            </div>
          </div>
          <div className="mt-4 flex shrink-0 flex-wrap gap-3 text-[12px] font-semibold text-navy md:mt-0 md:gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-[0_1px_4px_rgba(11,44,74,0.06)]">
              <Lock className="h-3.5 w-3.5 text-brand-cta" aria-hidden />
              {privacy.ssl}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-[0_1px_4px_rgba(11,44,74,0.06)]">
              <Check className="h-3.5 w-3.5 text-brand-gold" strokeWidth={2.75} aria-hidden />
              {privacy.compliant}
            </span>
          </div>
        </section>

        {/* §25–§27 Final CTA — desktop: info + button; §28 mobile: privacy → button → free note only */}
        <section
          id="final-cta"
          aria-labelledby="final-cta-heading"
          className="max-md:border-0 max-md:bg-transparent max-md:shadow-none md:overflow-hidden md:rounded-2xl md:border md:border-line md:bg-white md:shadow-card md:flex md:items-center md:justify-between md:gap-8 md:p-7 lg:rounded-[1.125rem] lg:p-8"
        >
          <h2 id="final-cta-heading" className="sr-only">
            {cta.infoTitle}
          </h2>
          <div className="hidden min-w-0 md:block md:max-w-xl md:flex-1" aria-hidden="true">
            <p className="text-[17px] font-bold leading-snug tracking-[-0.01em] text-navy md:text-[19px]">
              {cta.infoTitle}
            </p>
            <p className="mt-2.5 text-[14px] font-medium leading-relaxed text-navy md:text-[15px]">
              {cta.infoLead}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted md:text-[14px] md:leading-[1.65]">
              {cta.infoFollowUp}
            </p>
          </div>
          <div className="shrink-0 md:w-auto md:min-w-[17.5rem] md:ps-2">
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className={cn(finalCtaBtnClass, loading && "cursor-not-allowed")}
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
            <p className="mt-3 flex items-center justify-center gap-2 text-[13px] font-medium text-navy md:hidden">
              <span
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-green"
                aria-hidden
              >
                <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
              </span>
              {cta.free}
            </p>
          </div>
        </section>
      </form>

      {/* Footer trust bar — desktop/tablet; mobile form flow ends at §28 CTA */}
      <section
        className="mt-10 hidden border-t border-line bg-white/80 py-10 backdrop-blur-sm md:mt-12 md:block md:py-12"
        aria-label={preReg.trust[0]}
      >
        <Container>
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
            {trustItems.map(({ label, Icon }) => (
              <div key={label} className="flex flex-col items-center text-center">
                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange-soft text-brand-gold ring-1 ring-brand-orange/20">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="max-w-[9rem] text-[12px] font-semibold leading-snug text-navy md:text-[13px]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

function FieldError({ message, className }: { message?: string; className?: string }) {
  if (!message) return null;
  return (
    <p className={cn("text-[12px] text-red-600", className ?? "mt-1.5")} role="alert" data-invalid="true">
      {message}
    </p>
  );
}

function SourceRadio({
  value,
  label,
  checked,
  onChange,
}: {
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-transparent px-2 py-2 text-[14px] text-navy transition hover:border-line hover:bg-[#FFFCF8]">
      <input
        type="radio"
        name="source"
        value={value}
        className="h-4 w-4 shrink-0 accent-brand-cta"
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
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
        className={cn(className, !value && placeholder && "text-muted", hasError && "border-red-500 focus:border-red-500 focus:ring-red-500/15")}
      >
        <option value="">{placeholder ?? "—"}</option>
        {countries.map((r) => (
          <option key={r.code} value={r.code}>
            {r.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute end-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
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
    <label className={hideLabel ? "block" : "block text-sm"}>
      {hideLabel ? (
        <span className="sr-only">{ariaLabel ?? label}</span>
      ) : (
        <span className="mb-1.5 block font-medium text-navy">{label}</span>
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
    <label className={hideLabel ? "block" : "block text-sm"}>
      {hideLabel ? (
        <span className="sr-only">{ariaLabel ?? label}</span>
      ) : (
        <span className="mb-1.5 block font-medium text-navy">{label}</span>
      )}
      <div className="relative">
        <select
          value={value}
          aria-label={ariaLabel ?? label}
          aria-invalid={hasError || undefined}
          data-invalid={hasError ? "true" : undefined}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={cn(className, !value && placeholder && "text-muted", hasError && "border-red-500 focus:border-red-500 focus:ring-red-500/15")}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute end-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
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
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-navy">{label}</span>
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
    passportType: "",
  }));
}
