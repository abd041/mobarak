"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ClipboardList,
  Coins,
  Heart,
  HelpCircle,
  Loader2,
  Lock,
  MoreHorizontal,
  Plane,
  Shield,
  UserRound,
  Users,
} from "lucide-react";
import { DepartureAirportsField } from "@/components/hajj/DepartureAirportsField";
import type { Locale } from "@/i18n/routing";
import type { HajjPassportTypeOption } from "@/data/hajj-passport-types";
import type {
  HajjPreRegBenefit,
  HajjPreRegContent,
  ResolvedResidenceCountry,
} from "@/data/hajj-pre-reg-content";
import type { HajjPersonFieldErrors, HajjPreRegFormErrors } from "@/lib/hajj-pre-reg-validation";
import { IQ } from "@/lib/images";
import { cn } from "@/lib/utils";

const NAVY = "#0B2A55";
const CTA_BLUE = "#1264F5";
const INK_SOFT = "#63748A";
const MOBILE_HERO = "/brand/hajj-2027-hero-mobile-v2.png";
const MAX_TRAVELLERS = 20;
const SIX_PLUS_MIN = 6;
const FORM_STEPS = 5;

const BENEFIT_ICONS = [Shield, Coins, ClipboardList, Users] as const;

const MOBILE_SOURCE_ORDER = ["instagram", "google", "facebook", "chatgpt", "friend", "know"] as const;

const SOURCE_VISUAL: Record<
  string,
  { src?: string; Icon?: typeof Users; tint?: string; ink?: string }
> = {
  instagram: { src: "/brand/icons/inquiry-source/instagram.png" },
  google: { src: "/brand/icons/inquiry-source/google.png" },
  facebook: { src: "/brand/icons/inquiry-source/facebook.png" },
  chatgpt: { src: "/brand/icons/inquiry-source/chatgpt.png" },
  friend: { Icon: Users, tint: "#E8F1FE", ink: CTA_BLUE },
  know: { Icon: Heart, tint: "#E8F1FE", ink: CTA_BLUE },
  other: { Icon: MoreHorizontal, tint: "#E8F1FE", ink: CTA_BLUE },
};

const inputClass =
  "w-full rounded-[12px] border border-[#DDE3EC] bg-white px-3.5 py-[0.72rem] text-[14px] text-navy outline-none transition placeholder:text-[#98A6B8] focus:border-[#1264F5] focus:ring-2 focus:ring-[#1264F5]/12";
const selectClass = cn(inputClass, "appearance-none pe-10");
const selectedTile = "border-[#1264F5] bg-[#EAF3FE]";
const idleTile = "border-[#E7EBF1] bg-white hover:border-[#BFD8FA] hover:bg-[#F7FAFF]";

type Person = {
  firstName: string;
  lastName: string;
  nationality: string;
  nationalityCode: string;
  residence: string;
  passportType: string;
};

function stripSectionNumber(title: string) {
  return title.replace(/^\d+\.\s*/, "");
}

export function HajjPreRegMobile({
  preReg,
  locale: _locale,
  displayClassName,
  scriptClassName,
  benefits,
  count,
  setCount,
  customCount,
  setCustomCount,
  program,
  setProgram,
  persons,
  updatePerson,
  phone,
  setPhone,
  dialCode,
  setDialCode,
  airports,
  setAirports,
  source,
  setSource,
  sourceOtherDetail,
  setSourceOtherDetail,
  residenceCountries,
  loading,
  errors,
  showPersonError,
  showFieldError,
  markPersonTouched,
  markTouched,
  onSubmit,
  validatePersons,
  validateContact,
}: {
  preReg: HajjPreRegContent;
  locale: Locale;
  displayClassName: string;
  scriptClassName: string;
  benefits: HajjPreRegBenefit[];
  count: number;
  setCount: (n: number) => void;
  customCount: number;
  setCustomCount: (n: number) => void;
  program: string;
  setProgram: (id: string) => void;
  persons: Person[];
  updatePerson: (index: number, patch: Partial<Person>) => void;
  phone: string;
  setPhone: (v: string) => void;
  dialCode: string;
  setDialCode: (v: string) => void;
  airports: string[];
  setAirports: (v: string[]) => void;
  source: string;
  setSource: (v: string) => void;
  sourceOtherDetail: string;
  setSourceOtherDetail: (v: string) => void;
  residenceCountries: ResolvedResidenceCountry[];
  loading: boolean;
  errors: HajjPreRegFormErrors;
  showPersonError: (index: number, field: keyof HajjPersonFieldErrors) => string | undefined;
  showFieldError: (field: "source" | "phone") => string | undefined;
  markPersonTouched: (index: number, field: keyof HajjPersonFieldErrors) => void;
  markTouched: (field: "phone" | "source") => void;
  onSubmit: (e: React.FormEvent) => void;
  validatePersons: () => boolean;
  validateContact: () => boolean;
}) {
  const [step, setStep] = useState(0);
  const [openPerson, setOpenPerson] = useState(0);

  const { hero, sections, fields, privacy, cta, mobile } = preReg;
  const effectiveCount = count === 6 ? customCount : count;
  const visiblePersons = persons.slice(0, effectiveCount);
  const gridSources = MOBILE_SOURCE_ORDER.map((value) =>
    preReg.sourceOptions.find((option) => option.value === value && option.enabled),
  ).filter(Boolean) as { value: string; label: string }[];
  const otherSource = preReg.sourceOptions.find((option) => option.value === "other" && option.enabled);
  const handwrittenLines = mobile.handwritten.split("\n").filter(Boolean);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    const active = step > 0;
    document.body.classList.toggle("hajj-prereg-wizard", active);
    return () => document.body.classList.remove("hajj-prereg-wizard");
  }, [step]);

  function goNext() {
    if (step === 3 && !validatePersons()) return;
    if (step === 4 && !validateContact()) return;
    setStep((s) => Math.min(FORM_STEPS, s + 1));
  }

  function addTraveller() {
    if (effectiveCount >= MAX_TRAVELLERS) return;
    if (count < 5) {
      setCount(count + 1);
      setOpenPerson(count);
      return;
    }
    if (count === 5) {
      setCount(6);
      setCustomCount(6);
      setOpenPerson(5);
      return;
    }
    const next = Math.min(MAX_TRAVELLERS, customCount + 1);
    setCustomCount(next);
    setOpenPerson(next - 1);
  }

  return (
    <div className="lg:hidden bg-white">
      {step === 0 ? (
        <MobileHero
          heroImage={MOBILE_HERO}
          handwrittenLines={handwrittenLines}
          scriptClassName={scriptClassName}
          eyebrow={hero.eyebrow}
          benefits={benefits}
          benefitsAriaLabel={preReg.benefitsAriaLabel}
          startCta={mobile.startCta}
          freeLabel={cta.free}
          onStart={() => setStep(1)}
        />
      ) : (
        <form
          onSubmit={onSubmit}
          noValidate
          aria-busy={loading}
          className="flex min-h-dvh flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3"
          aria-label={preReg.formAriaLabel}
        >
          <MobileProgress
            current={step}
            total={FORM_STEPS}
            backLabel={mobile.back}
            onBack={() => setStep((s) => s - 1)}
          />

          <div className="flex-1 pt-5">
            {step === 1 ? (
              <CountStep
                displayClassName={displayClassName}
                title={stripSectionNumber(sections.travellerCount.title)}
                hint={sections.travellerCount.hint}
                fields={fields}
                count={count}
                customCount={customCount}
                setCount={setCount}
                setCustomCount={setCustomCount}
                familyWelcome={mobile.familyWelcome}
              />
            ) : null}

            {step === 2 ? (
              <ProgramStep
                displayClassName={displayClassName}
                title={stripSectionNumber(sections.programDuration.title)}
                hint={sections.programDuration.hint}
                programs={preReg.programDurations}
                program={program}
                setProgram={setProgram}
                unsureLabel={fields.programUnsure}
              />
            ) : null}

            {step === 3 ? (
              <PersonsStep
                displayClassName={displayClassName}
                title={stripSectionNumber(sections.travellerDetails.title)}
                hint={sections.travellerDetails.hint}
                fields={fields}
                visiblePersons={visiblePersons}
                openPerson={openPerson}
                setOpenPerson={setOpenPerson}
                updatePerson={updatePerson}
                showPersonError={showPersonError}
                markPersonTouched={markPersonTouched}
                errors={errors}
                residenceCountries={residenceCountries}
                passportTypes={preReg.passportTypes}
                addLabel={mobile.addPerson}
                canAdd={effectiveCount < MAX_TRAVELLERS}
                onAdd={addTraveller}
              />
            ) : null}

            {step === 4 ? (
              <ContactStep
                displayClassName={displayClassName}
                title={stripSectionNumber(sections.contact.title)}
                hint={sections.contact.hint}
                fields={fields}
                phone={phone}
                setPhone={setPhone}
                dialCode={dialCode}
                setDialCode={setDialCode}
                airports={airports}
                setAirports={setAirports}
                residenceCountries={residenceCountries}
                showPhoneError={showFieldError("phone")}
                markPhoneTouched={() => markTouched("phone")}
                airportInfo={mobile.airportInfo}
              />
            ) : null}

            {step === 5 ? (
              <SourceStep
                displayClassName={displayClassName}
                title={stripSectionNumber(sections.source.title)}
                hint={sections.source.hint}
                gridSources={gridSources}
                otherSource={otherSource}
                source={source}
                setSource={(value) => {
                  markTouched("source");
                  setSource(value);
                  if (value !== "other") setSourceOtherDetail("");
                }}
                sourceOtherDetail={sourceOtherDetail}
                setSourceOtherDetail={setSourceOtherDetail}
                otherPlaceholder={fields.sourceOtherPlaceholder}
                sourceError={showFieldError("source")}
                privacyTitle={privacy.title}
                privacyBody={privacy.body}
              />
            ) : null}
          </div>

          {step < FORM_STEPS ? (
            <MobileCtaButton type="button" onClick={goNext}>
              {mobile.continue}
            </MobileCtaButton>
          ) : (
            <MobileCtaButton type="submit" disabled={loading} busy={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  {cta.submitting}
                </>
              ) : (
                mobile.submit
              )}
            </MobileCtaButton>
          )}
        </form>
      )}
    </div>
  );
}

function MobileHero({
  heroImage,
  handwrittenLines,
  scriptClassName,
  eyebrow,
  benefits,
  benefitsAriaLabel,
  startCta,
  freeLabel,
  onStart,
}: {
  heroImage: string;
  handwrittenLines: string[];
  scriptClassName: string;
  eyebrow: string;
  benefits: HajjPreRegBenefit[];
  benefitsAriaLabel: string;
  startCta: string;
  freeLabel: string;
  onStart: () => void;
}) {
  return (
    <div className="pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div className="relative h-[min(52vh,26rem)] min-h-[17.5rem] overflow-hidden">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          quality={IQ.hero}
          sizes="100vw"
          className="hajj-prereg-mobile-hero-photo object-cover"
        />
        <p
          className={cn(
            scriptClassName,
            "pointer-events-none absolute start-5 top-[14%] z-10 max-w-[11.5rem] -rotate-[9deg] text-[28px] leading-[1.12] text-white drop-shadow-[0_2px_10px_rgba(11,42,85,0.35)]",
          )}
        >
          {handwrittenLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>

      <div className="px-5 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8A97A8]">{eyebrow}</p>

        <ul className="mt-3.5 grid grid-cols-2 grid-rows-2 gap-2.5" aria-label={benefitsAriaLabel}>
          {benefits.map((benefit, index) => {
            const Icon = BENEFIT_ICONS[index] ?? Shield;
            return (
              <li
                key={benefit.id}
                className="flex h-full min-h-[4.75rem] items-center gap-2.5 rounded-[14px] border border-[#E8EEF6] bg-white px-3 py-3 shadow-[0_1px_4px_rgba(11,42,85,0.04)]"
              >
                <Icon className="h-[18px] w-[18px] shrink-0" style={{ color: CTA_BLUE }} strokeWidth={1.9} />
                <span className="text-[12px] font-semibold leading-snug" style={{ color: NAVY }}>
                  {benefit.title}
                </span>
              </li>
            );
          })}
        </ul>

        <MobileCtaButton type="button" className="mt-6" onClick={onStart}>
          {startCta}
        </MobileCtaButton>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px]" style={{ color: INK_SOFT }}>
          <Lock className="h-3.5 w-3.5" style={{ color: CTA_BLUE }} aria-hidden />
          {freeLabel}
        </p>
      </div>
    </div>
  );
}

function MobileProgress({
  current,
  total,
  backLabel,
  onBack,
}: {
  current: number;
  total: number;
  backLabel: string;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#7A8BA0]"
        aria-label={backLabel}
      >
        <ChevronLeft className="h-6 w-6 rtl:rotate-180" strokeWidth={1.8} />
      </button>
      <div className="flex min-w-0 flex-1 items-center" aria-hidden>
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1;
          const filled = n <= current;
          return (
            <Fragment key={n}>
              {i > 0 ? (
                <span className={cn("h-[3px] flex-1 rounded-full", filled ? "bg-[#1264F5]" : "bg-[#D9E1EC]")} />
              ) : null}
              <span
                className={cn("h-2.5 w-2.5 shrink-0 rounded-full", filled ? "bg-[#1264F5]" : "bg-[#D9E1EC]")}
              />
            </Fragment>
          );
        })}
      </div>
      <span className="shrink-0 text-[13px] font-semibold tabular-nums" style={{ color: CTA_BLUE }}>
        {current}/{total}
      </span>
    </div>
  );
}

function StepHeading({
  title,
  hint,
  displayClassName,
}: {
  title: string;
  hint: string;
  displayClassName: string;
}) {
  return (
    <div className="mb-5">
      <h2 className={cn(displayClassName, "text-[26px] font-bold leading-[1.15]")} style={{ color: NAVY }}>
        {title}
      </h2>
      <p className="mt-2 text-[14px] leading-[1.55]" style={{ color: INK_SOFT }}>
        {hint}
      </p>
    </div>
  );
}

function CountStep({
  displayClassName,
  title,
  hint,
  fields,
  count,
  customCount,
  setCount,
  setCustomCount,
  familyWelcome,
}: {
  displayClassName: string;
  title: string;
  hint: string;
  fields: HajjPreRegContent["fields"];
  count: number;
  customCount: number;
  setCount: (n: number) => void;
  setCustomCount: (n: number) => void;
  familyWelcome: string;
}) {
  return (
    <>
      <StepHeading title={title} hint={hint} displayClassName={displayClassName} />
      <div className="grid grid-cols-3 gap-2.5" role="radiogroup" aria-label={title}>
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
                if (n === 6 && customCount < SIX_PLUS_MIN) setCustomCount(SIX_PLUS_MIN);
              }}
              className={cn(
                "relative flex min-h-[6.6rem] flex-col items-center justify-center rounded-[16px] border px-1.5 py-3 shadow-[0_1px_4px_rgba(11,42,85,0.04)]",
                selected ? selectedTile : idleTile,
              )}
            >
              {selected ? <MobileCheck /> : null}
              <UserRound
                className="h-6 w-6"
                style={{ color: selected ? CTA_BLUE : "#8DB0E8" }}
                strokeWidth={1.7}
                aria-hidden
              />
              <span className={cn(displayClassName, "mt-2 text-[26px] font-bold leading-none")} style={{ color: NAVY }}>
                {n === 6 ? "6+" : n}
              </span>
              <span className="mt-1 text-[11.5px] font-medium" style={{ color: INK_SOFT }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {count === 6 ? (
        <div className="mt-3.5 rounded-[14px] border border-[#E7EBF1] bg-[#F7FAFF] p-3.5">
          <label className="block" htmlFor="six-plus-count-mobile">
            <span className="text-[13px] font-semibold" style={{ color: NAVY }}>
              {fields.sixPlusLabel}
            </span>
            <div className="relative mt-2">
              <select
                id="six-plus-count-mobile"
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
                    {n} {fields.people}
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

      <div className="mt-3.5 flex items-start gap-3 rounded-[16px] bg-[#F3F8FF] px-4 py-3.5">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white"
          aria-hidden
        >
          <Users className="h-5 w-5" style={{ color: CTA_BLUE }} strokeWidth={1.8} />
        </span>
        <p className="text-[13px] leading-[1.5]" style={{ color: "#4B6A94" }}>
          {familyWelcome}
        </p>
      </div>
    </>
  );
}

function ProgramStep({
  displayClassName,
  title,
  hint,
  programs,
  program,
  setProgram,
  unsureLabel,
}: {
  displayClassName: string;
  title: string;
  hint: string;
  programs: HajjPreRegContent["programDurations"];
  program: string;
  setProgram: (id: string) => void;
  unsureLabel: string;
}) {
  return (
    <>
      <StepHeading title={title} hint={hint} displayClassName={displayClassName} />
      <div className="space-y-2.5" role="radiogroup" aria-label={title}>
        {programs.map((option) => {
          const selected = program === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setProgram(option.id)}
              className={cn(
                "relative flex w-full items-center gap-3.5 rounded-[16px] border px-3.5 py-3.5 text-start shadow-[0_1px_4px_rgba(11,42,85,0.04)]",
                selected ? selectedTile : idleTile,
              )}
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: selected ? "#DCEBFE" : "#EEF4FC" }}
                aria-hidden
              >
                <CalendarDays className="h-5 w-5" style={{ color: CTA_BLUE }} strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] font-medium" style={{ color: INK_SOFT }}>
                  {option.label}
                </span>
                <span className={cn(displayClassName, "mt-0.5 block text-[20px] font-bold leading-tight")} style={{ color: NAVY }}>
                  {option.range}
                </span>
                <span className="mt-0.5 block text-[12px]" style={{ color: INK_SOFT }}>
                  {option.note}
                </span>
              </span>
              {selected ? (
                <span
                  className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: CTA_BLUE }}
                  aria-hidden
                >
                  <Check className="h-3 w-3 text-white" strokeWidth={3.4} />
                </span>
              ) : (
                <EmptyRadio />
              )}
            </button>
          );
        })}

        <button
          type="button"
          role="radio"
          aria-checked={program === "unsure"}
          onClick={() => setProgram("unsure")}
          className={cn(
            "relative flex min-h-[3.4rem] w-full items-center gap-3.5 rounded-[16px] border px-3.5 py-3.5 text-start",
            program === "unsure" ? selectedTile : idleTile,
          )}
        >
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEF4FC]"
            aria-hidden
          >
            <HelpCircle className="h-5 w-5" style={{ color: CTA_BLUE }} strokeWidth={1.8} />
          </span>
          <span className="min-w-0 flex-1 text-[13.5px] font-medium leading-snug" style={{ color: NAVY }}>
            {unsureLabel}
          </span>
          {program === "unsure" ? (
            <span
              className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: CTA_BLUE }}
              aria-hidden
            >
              <Check className="h-3 w-3 text-white" strokeWidth={3.4} />
            </span>
          ) : (
            <EmptyRadio />
          )}
        </button>
      </div>
    </>
  );
}

function PersonsStep({
  displayClassName,
  title,
  hint,
  fields,
  visiblePersons,
  openPerson,
  setOpenPerson,
  updatePerson,
  showPersonError,
  markPersonTouched,
  errors,
  residenceCountries,
  passportTypes,
  addLabel,
  canAdd,
  onAdd,
}: {
  displayClassName: string;
  title: string;
  hint: string;
  fields: HajjPreRegContent["fields"];
  visiblePersons: Person[];
  openPerson: number;
  setOpenPerson: (index: number) => void;
  updatePerson: (index: number, patch: Partial<Person>) => void;
  showPersonError: (index: number, field: keyof HajjPersonFieldErrors) => string | undefined;
  markPersonTouched: (index: number, field: keyof HajjPersonFieldErrors) => void;
  errors: HajjPreRegFormErrors;
  residenceCountries: ResolvedResidenceCountry[];
  passportTypes: HajjPassportTypeOption[];
  addLabel: string;
  canAdd: boolean;
  onAdd: () => void;
}) {
  return (
    <>
      <StepHeading title={title} hint={hint} displayClassName={displayClassName} />
      <div className="space-y-3">
        {visiblePersons.map((person, i) => {
          const open = openPerson === i;
          return (
            <article key={i} className="overflow-hidden rounded-[16px] border border-[#E7EBF1] bg-white">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3.5"
                aria-expanded={open}
                onClick={() => setOpenPerson(open ? -1 : i)}
              >
                <span className="text-[15px] font-bold" style={{ color: NAVY }}>
                  {fields.person} {i + 1}
                </span>
                <ChevronDown
                  className={cn("h-5 w-5 transition", open && "rotate-180")}
                  style={{ color: "#8AA0B8" }}
                  aria-hidden
                />
              </button>
              {open ? (
                <div className="space-y-3.5 border-t border-[#EEF1F6] px-4 py-4">
                  <MobileInput
                    label={fields.firstName}
                    value={person.firstName}
                    placeholder={fields.firstNamePlaceholder}
                    error={showPersonError(i, "firstName")}
                    onBlur={() => markPersonTouched(i, "firstName")}
                    onChange={(v) => updatePerson(i, { firstName: v })}
                  />
                  <MobileInput
                    label={fields.lastName}
                    value={person.lastName}
                    placeholder={fields.lastNamePlaceholder}
                    error={showPersonError(i, "lastName")}
                    onBlur={() => markPersonTouched(i, "lastName")}
                    onChange={(v) => updatePerson(i, { lastName: v })}
                  />
                  <MobileInput
                    label={fields.nationality}
                    value={person.nationality}
                    placeholder={fields.nationalityPlaceholder}
                    error={showPersonError(i, "nationality")}
                    onBlur={() => markPersonTouched(i, "nationality")}
                    onChange={(v) => updatePerson(i, { nationality: v, nationalityCode: "" })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <MobileSelect
                      label={fields.residence}
                      value={person.residence}
                      placeholder={fields.residencePlaceholder}
                      error={showPersonError(i, "residence")}
                      onBlur={() => markPersonTouched(i, "residence")}
                      onChange={(v) => {
                        markPersonTouched(i, "residence");
                        updatePerson(i, { residence: v });
                      }}
                      options={residenceCountries.map((country) => ({
                        value: country.code,
                        label: country.label,
                      }))}
                    />
                    <MobileSelect
                      label={fields.passportType}
                      value={person.passportType}
                      placeholder={fields.passportTypePlaceholder}
                      error={showPersonError(i, "passportType")}
                      onBlur={() => markPersonTouched(i, "passportType")}
                      onChange={(v) => {
                        markPersonTouched(i, "passportType");
                        updatePerson(i, { passportType: v });
                      }}
                      options={passportTypes.map((option) => ({ value: option.id, label: option.label }))}
                    />
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      {canAdd ? (
        <button
          type="button"
          onClick={onAdd}
          className="mt-3.5 flex min-h-[3rem] w-full items-center justify-center gap-1.5 rounded-[14px] bg-[#EAF3FE] text-[14px] font-semibold"
          style={{ color: CTA_BLUE }}
        >
          + {addLabel}
        </button>
      ) : null}
    </>
  );
}

function ContactStep({
  displayClassName,
  title,
  hint,
  fields,
  phone,
  setPhone,
  dialCode,
  setDialCode,
  airports,
  setAirports,
  residenceCountries,
  showPhoneError,
  markPhoneTouched,
  airportInfo,
}: {
  displayClassName: string;
  title: string;
  hint: string;
  fields: HajjPreRegContent["fields"];
  phone: string;
  setPhone: (v: string) => void;
  dialCode: string;
  setDialCode: (v: string) => void;
  airports: string[];
  setAirports: (v: string[]) => void;
  residenceCountries: ResolvedResidenceCountry[];
  showPhoneError?: string;
  markPhoneTouched: () => void;
  airportInfo: string;
}) {
  return (
    <>
      <StepHeading title={title} hint={hint} displayClassName={displayClassName} />
      <label className="block">
        <span className="mb-2 block text-[13px] font-semibold" style={{ color: NAVY }}>
          {fields.phoneNumber}
        </span>
        <div
          className={cn(
            "dir-ltr-keep flex overflow-hidden rounded-[12px] border bg-white focus-within:ring-2",
            showPhoneError
              ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/15"
              : "border-[#DDE3EC] focus-within:border-[#1264F5] focus-within:ring-[#1264F5]/12",
          )}
        >
          <select
            value={dialCode}
            onChange={(e) => setDialCode(e.target.value)}
            className={cn(
              selectClass,
              "w-[6.4rem] rounded-none border-0 border-e border-[#DDE3EC] bg-[#FAFBFD] pe-6 ps-3 text-[12.5px] font-semibold focus:ring-0",
            )}
            aria-label={fields.phoneDialCode}
          >
            {residenceCountries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.code} {country.dial}
              </option>
            ))}
          </select>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={markPhoneTouched}
            placeholder={fields.phonePlaceholder}
            aria-label={fields.phoneNumber}
            aria-invalid={showPhoneError ? true : undefined}
            data-invalid={showPhoneError ? "true" : undefined}
            className={cn(inputClass, "min-w-0 flex-1 rounded-none border-0 focus:ring-0")}
            inputMode="tel"
            autoComplete="tel-national"
          />
        </div>
        <FieldError message={showPhoneError} />
      </label>

      <DepartureAirportsField
        className="mt-5"
        label={fields.departureAirport}
        placeholder={fields.departureAirportPlaceholder}
        addLabel={fields.addDepartureAirport}
        value={airports}
        onChange={setAirports}
        inputClassName="rounded-[12px]"
      />

      <div className="mt-4 flex items-start gap-3 rounded-[16px] bg-[#F3F8FF] px-4 py-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white" aria-hidden>
          <Plane className="h-5 w-5" style={{ color: CTA_BLUE }} strokeWidth={1.8} />
        </span>
        <p className="text-[13px] leading-[1.5]" style={{ color: "#4B6A94" }}>
          {airportInfo}
        </p>
      </div>
    </>
  );
}

function SourceStep({
  displayClassName,
  title,
  hint,
  gridSources,
  otherSource,
  source,
  setSource,
  sourceOtherDetail,
  setSourceOtherDetail,
  otherPlaceholder,
  sourceError,
  privacyTitle,
  privacyBody,
}: {
  displayClassName: string;
  title: string;
  hint: string;
  gridSources: { value: string; label: string }[];
  otherSource?: { value: string; label: string };
  source: string;
  setSource: (value: string) => void;
  sourceOtherDetail: string;
  setSourceOtherDetail: (v: string) => void;
  otherPlaceholder: string;
  sourceError?: string;
  privacyTitle: string;
  privacyBody: string;
}) {
  return (
    <>
      <StepHeading title={title} hint={hint} displayClassName={displayClassName} />
      <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label={title}>
        {gridSources.map((option) => (
          <MobileSourceTile
            key={option.value}
            value={option.value}
            label={option.label}
            checked={source === option.value}
            onChange={() => setSource(option.value)}
          />
        ))}
      </div>
      {otherSource ? (
        <MobileSourceTile
          value={otherSource.value}
          label={otherSource.label}
          checked={source === otherSource.value}
          onChange={() => setSource(otherSource.value)}
          wide
          className="mt-2.5"
        />
      ) : null}
      <FieldError message={sourceError} className="mt-3" />
      {source === "other" ? (
        <input
          type="text"
          value={sourceOtherDetail}
          onChange={(e) => setSourceOtherDetail(e.target.value)}
          placeholder={otherPlaceholder}
          className={cn(inputClass, "mt-3")}
        />
      ) : null}

      <div className="mt-6 flex items-start gap-3 rounded-[16px] bg-[#F3F8FF] px-4 py-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white" aria-hidden>
          <Shield className="h-5 w-5" style={{ color: CTA_BLUE }} strokeWidth={1.8} />
        </span>
        <div>
          <p className="text-[13.5px] font-bold" style={{ color: NAVY }}>
            {privacyTitle}
          </p>
          <p className="mt-1 text-[12.5px] leading-[1.5]" style={{ color: "#4B6A94" }}>
            {privacyBody}
          </p>
        </div>
      </div>
    </>
  );
}

function MobileSourceTile({
  value,
  label,
  checked,
  onChange,
  wide,
  className,
}: {
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  wide?: boolean;
  className?: string;
}) {
  const visual = SOURCE_VISUAL[value] ?? SOURCE_VISUAL.other;
  const Icon = visual.Icon;

  return (
    <label
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center rounded-[16px] border px-3 py-4 shadow-[0_1px_4px_rgba(11,42,85,0.04)]",
        wide ? "min-h-[3.4rem] flex-row gap-2" : "min-h-[6.4rem] gap-2.5",
        checked ? selectedTile : idleTile,
        className,
      )}
    >
      {checked ? <MobileCheck /> : null}
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
      <span className="text-center text-[13px] font-medium leading-snug" style={{ color: NAVY }}>
        {label}
      </span>
      <input type="radio" name="source-mobile" value={value} className="sr-only" checked={checked} onChange={onChange} />
    </label>
  );
}

function MobileCtaButton({
  children,
  type,
  onClick,
  disabled,
  busy,
  className,
}: {
  children: React.ReactNode;
  type: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  busy?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-busy={busy}
      className={cn(
        "mt-7 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(18,100,245,0.28)] transition hover:brightness-95 disabled:opacity-60",
        className,
      )}
      style={{ backgroundColor: CTA_BLUE }}
    >
      {children}
      {busy ? null : (
        <span className="inline-block rtl:rotate-180" aria-hidden>
          →
        </span>
      )}
    </button>
  );
}

function MobileCheck() {
  return (
    <span
      className="absolute end-2 top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full"
      style={{ backgroundColor: CTA_BLUE }}
      aria-hidden
    >
      <Check className="h-[10px] w-[10px] text-white" strokeWidth={3.4} />
    </span>
  );
}

function EmptyRadio() {
  return (
    <span className="h-[18px] w-[18px] shrink-0 rounded-full border border-[#C9D4E3]" aria-hidden />
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

function MobileInput({
  label,
  value,
  placeholder,
  error,
  onChange,
  onBlur,
}: {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-semibold" style={{ color: NAVY }}>
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        data-invalid={error ? "true" : undefined}
        className={cn(inputClass, error && "border-red-500 focus:border-red-500 focus:ring-red-500/15")}
      />
      <FieldError message={error} />
    </label>
  );
}

function MobileSelect({
  label,
  value,
  placeholder,
  options,
  error,
  onChange,
  onBlur,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[12.5px] font-semibold" style={{ color: NAVY }}>
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          data-invalid={error ? "true" : undefined}
          className={cn(
            selectClass,
            !value && "text-[#98A6B8]",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/15",
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2"
          style={{ color: INK_SOFT }}
          aria-hidden
        />
      </div>
      <FieldError message={error} />
    </label>
  );
}
