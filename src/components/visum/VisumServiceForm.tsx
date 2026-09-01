"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  ChevronDown,
  Info,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { NationalityCombobox, type NationalityValue } from "@/components/ui/NationalityCombobox";
import { INDIVIDUAL_UMRAH_PHONE_DIAL_OPTIONS, type IndividualUmrahPhoneCountryCode } from "@/data/individual-umrah";
import { findCountryByCode } from "@/lib/countries";
import { cn } from "@/lib/utils";

const MAX_TRAVELLERS = 6;

const PASSPORT_TYPES = [
  "normal",
  "convention",
  "travel_document",
  "diplomatic",
] as const;
const SOURCES = [
  "instagram",
  "facebook",
  "google",
  "chatgpt",
  "friend",
  "know",
  "other",
] as const;

function flagEmoji(code: string): string {
  if (!/^[A-Za-z]{2}$/.test(code)) return "";
  const cc = code.toUpperCase();
  return String.fromCodePoint(
    ...[...cc].map((c) => 0x1f1e6 - 65 + c.charCodeAt(0)),
  );
}

function defaultAustria(locale: string): NationalityValue {
  const c = findCountryByCode(locale, "AT");
  return { code: "AT", name: c?.name ?? "Österreich" };
}

function isPhoneCountry(value: string): value is IndividualUmrahPhoneCountryCode {
  return INDIVIDUAL_UMRAH_PHONE_DIAL_OPTIONS.some((option) => option.code === value);
}

/** 🇦🇹 +43 ▼ — matches approved Visum / Individual Umrah phone layout */
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
        className="h-full min-h-[34px] w-[5.25rem] cursor-pointer appearance-none border-0 bg-transparent py-1.5 ps-1.5 pe-5 text-transparent outline-none sm:min-h-[42px] sm:w-[8.25rem] sm:ps-2.5 sm:pe-7 sm:py-2.5 md:min-h-[42px] md:w-[8.25rem]"
      >
        {INDIVIDUAL_UMRAH_PHONE_DIAL_OPTIONS.map((option) => (
          <option key={option.code} value={option.code} className="text-navy">
            {option.flag} {option.dial}
          </option>
        ))}
      </select>
      <span
        className="pointer-events-none absolute inset-y-0 start-0 flex items-center gap-1 ps-1.5 pe-5 text-[12px] text-navy sm:gap-1.5 sm:ps-2.5 sm:pe-7 sm:text-[14px]"
        aria-hidden
      >
        <span className="text-[14px] leading-none sm:text-[16px]">{selected.flag}</span>
        <span className="tabular-nums">{selected.dial}</span>
      </span>
      <ChevronDown
        className="pointer-events-none absolute inset-e-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
        aria-hidden
      />
    </div>
  );
}

type Traveller = {
  firstName: string;
  lastName: string;
  nationality: NationalityValue;
  austriaStay: "" | "yes" | "no";
  passportType: (typeof PASSPORT_TYPES)[number] | "";
  passportValid: "" | "yes" | "no";
};

const inputClass =
  "w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-[13px] text-navy outline-none transition placeholder:text-muted focus:border-brand-cta focus:ring-2 focus:ring-brand-cta/20 max-md:border-[#d1d5db] md:px-3 md:py-2.5 md:text-[14px]";

const labelClass = "text-[12px] font-semibold text-navy sm:text-[13px]";

function emptyTraveller(): Traveller {
  return {
    firstName: "",
    lastName: "",
    nationality: null,
    austriaStay: "",
    passportType: "",
    passportValid: "",
  };
}

function RequiredMark() {
  return <span className="text-brand-red"> *</span>;
}

function FormField({
  label,
  required,
  optional,
  children,
  className = "",
  alignTop = false,
}: {
  label: ReactNode;
  required?: boolean;
  optional?: string;
  children: ReactNode;
  className?: string;
  /** Multi-line labels (e.g. passport validity) stay top-aligned on mobile */
  alignTop?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-w-0 max-md:flex max-md:justify-between max-md:gap-2 max-md:py-2.5",
        alignTop ? "max-md:items-start" : "max-md:items-center",
        className,
      )}
    >
      <div className="mb-1.5 max-md:mb-0 max-md:max-w-[38%] max-md:shrink md:mb-1.5">
        <span className={cn(labelClass, "max-md:text-[12px] max-md:leading-snug")}>
          {label}
          {required ? <RequiredMark /> : null}
          {optional ? (
            <span className="block font-normal text-[11px] text-muted md:inline md:text-[inherit]">
              {optional}
            </span>
          ) : null}
        </span>
      </div>
      <div className="min-w-0 max-md:w-[58%] max-md:shrink-0 md:w-full">{children}</div>
    </div>
  );
}

function YesNoRadios({
  name,
  value,
  onChange,
  yesLabel,
  noLabel,
}: {
  name: string;
  value: "" | "yes" | "no";
  onChange: (v: "" | "yes" | "no") => void;
  yesLabel: string;
  noLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
      <label className="inline-flex cursor-pointer items-center gap-1 text-[12px] text-navy sm:gap-1.5 sm:text-[13px]">
        <input
          type="radio"
          name={name}
          className="h-3.5 w-3.5 border-line accent-navy sm:h-4 sm:w-4"
          checked={value === "yes"}
          onChange={() => onChange("yes")}
        />
        {yesLabel}
      </label>
      <label className="inline-flex cursor-pointer items-center gap-1 text-[12px] text-navy sm:gap-1.5 sm:text-[13px]">
        <input
          type="radio"
          name={name}
          className="h-3.5 w-3.5 border-line accent-navy sm:h-4 sm:w-4"
          checked={value === "no"}
          onChange={() => onChange("no")}
        />
        {noLabel}
      </label>
    </div>
  );
}

function YesNoField({
  name,
  value,
  onChange,
  pleaseSelectLabel,
  yesLabel,
  noLabel,
}: {
  name: string;
  value: "" | "yes" | "no";
  onChange: (v: "" | "yes" | "no") => void;
  pleaseSelectLabel: string;
  yesLabel: string;
  noLabel: string;
}) {
  return (
    <>
      <div className="md:hidden">
        <YesNoRadios
          name={name}
          value={value}
          onChange={onChange}
          yesLabel={yesLabel}
          noLabel={noLabel}
        />
      </div>
      <div className="hidden md:block">
        <YesNoSelect
          value={value}
          onChange={onChange}
          pleaseSelectLabel={pleaseSelectLabel}
          yesLabel={yesLabel}
          noLabel={noLabel}
        />
      </div>
    </>
  );
}

function YesNoSelect({
  value,
  onChange,
  pleaseSelectLabel,
  yesLabel,
  noLabel,
}: {
  value: "" | "yes" | "no";
  onChange: (v: "" | "yes" | "no") => void;
  pleaseSelectLabel: string;
  yesLabel: string;
  noLabel: string;
}) {
  return (
    <select
      className={`${inputClass} cursor-pointer appearance-none`}
      value={value}
      onChange={(e) => onChange(e.target.value as "" | "yes" | "no")}
    >
      <option value="">{pleaseSelectLabel}</option>
      <option value="yes">{yesLabel}</option>
      <option value="no">{noLabel}</option>
    </select>
  );
}

export function VisumServiceForm({
  embedded = false,
  passportValidityWarning,
}: {
  embedded?: boolean;
  /** From CMS rules — not hard-coded visa regulation text */
  passportValidityWarning?: string;
}) {
  const t = useTranslations("visum");
  const locale = useLocale();
  const [count, setCount] = useState(1);
  const [travellers, setTravellers] = useState<Traveller[]>([emptyTraveller()]);
  const [residenceCountry, setResidenceCountry] = useState<NationalityValue>(() =>
    defaultAustria(locale),
  );
  const [phoneCountry, setPhoneCountry] =
    useState<IndividualUmrahPhoneCountryCode>("AT");
  const [phonePrefixManual, setPhonePrefixManual] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState<(typeof SOURCES)[number] | "">("");
  const [sourceOther, setSourceOther] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    setResidenceCountry((prev) => {
      const code = prev?.code ?? "AT";
      const c = findCountryByCode(locale, code);
      if (!c) return prev;
      if (prev?.code === c.code && prev.name === c.name) return prev;
      return { code: c.code, name: c.name };
    });
  }, [locale]);

  function setResidence(value: NationalityValue) {
    setResidenceCountry(value);
    // Auto-align phone prefix with residence when possible; manual override still allowed
    if (!phonePrefixManual && value?.code && isPhoneCountry(value.code)) {
      setPhoneCountry(value.code);
    }
  }

  function setPhonePrefix(value: IndividualUmrahPhoneCountryCode) {
    setPhonePrefixManual(true);
    setPhoneCountry(value);
  }

  function setTravellerCount(n: number) {
    const next = Math.min(MAX_TRAVELLERS, Math.max(1, n));
    setCount(next);
    setTravellers((prev) => {
      if (prev.length === next) return prev;
      if (prev.length < next) {
        return [
          ...prev,
          ...Array.from({ length: next - prev.length }, () => emptyTraveller()),
        ];
      }
      return prev.slice(0, next);
    });
  }

  function patchTraveller(index: number, patch: Partial<Traveller>) {
    setTravellers((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  }

  function requiresConfirmation() {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 768px)").matches;
  }

  function isValid() {
    if (requiresConfirmation() && !confirmed) return false;
    if (!phone.trim() || phone.trim().length < 6) return false;
    if (!source) return false;
    if (source === "other" && !sourceOther.trim()) return false;
    if (!residenceCountry?.code) return false;
    return travellers.every(
      (tr) =>
        tr.firstName.trim() &&
        tr.lastName.trim() &&
        tr.nationality?.code &&
        tr.passportType &&
        tr.passportValid,
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAttempted(true);
    if (!isValid()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section
        id="visum-anfrage"
        className={
          embedded
            ? "scroll-mt-24 bg-white px-4 py-10 sm:px-6 md:px-8"
            : "scroll-mt-24 bg-white px-4 py-12 sm:px-6 lg:px-8"
        }
      >
        <div className="mx-auto max-w-3xl text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-brand-green" strokeWidth={1.75} />
          <h2 className="visum-display-font mt-4 text-2xl font-bold text-navy">
            {t("successTitle")}
          </h2>
          <p className="mt-2 text-[15px] text-muted">{t("successBody")}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="visum-anfrage"
      className={
        embedded
          ? "scroll-mt-24 overflow-x-clip bg-white px-3 py-8 sm:px-6 md:px-8 md:py-10"
          : "scroll-mt-24 overflow-x-clip bg-white px-3 pb-10 sm:px-6 md:pb-14 lg:px-8"
      }
    >
      <div className={embedded ? "mx-auto w-full" : "mx-auto max-w-4xl"}>
        <div
          className={
            embedded
              ? ""
              : "rounded-2xl border border-line bg-white p-4 shadow-[0_12px_40px_rgba(11,44,74,0.06)] sm:p-6 md:p-8"
          }
        >
          <div className="text-center">
            <h2 className="visum-display-font text-[1.45rem] font-bold text-navy md:text-[1.85rem]">
              {t("formTitle")}
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted md:text-[14px]">
              {t("formSubtitle")}
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-5 md:mt-8" noValidate>
            <div className="flex items-center justify-between gap-2 md:justify-start md:gap-4">
              <span className={`${labelClass} max-md:max-w-[38%] shrink-0 max-md:text-[12px]`}>
                {t("travellerCountLabel")}:
              </span>
              <div className="relative max-md:w-[58%] max-md:shrink-0 md:max-w-sm md:flex-1">
                <UserRound
                  className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/45"
                  aria-hidden
                />
                <select
                  className={`${inputClass} cursor-pointer appearance-none pe-9 ps-9`}
                  value={count}
                  onChange={(e) => setTravellerCount(Number(e.target.value))}
                  aria-label={t("travellerCountLabel")}
                >
                  {Array.from({ length: MAX_TRAVELLERS }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n === 1 ? t("travellerOne") : t("travellerMany", { count: n })}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/50"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>
            </div>

            <div className="space-y-4 md:space-y-5">
              {travellers.map((tr, index) => (
                <section
                  key={index}
                  aria-labelledby={`visa-traveller-heading-${index}`}
                  className="overflow-hidden rounded-xl border border-[#c5d8f0] bg-[#f0f4ff] md:bg-[#f5f8fb]"
                >
                  <header
                    id={`visa-traveller-heading-${index}`}
                    className="border-b border-[#c5d8f0] bg-[#e4eef8] px-4 py-2.5 text-[13px] font-bold text-navy md:px-5 md:py-3"
                  >
                    {t("travellerHeading", { n: index + 1 })}
                  </header>

                  <div className="px-3 py-3 md:space-y-5 md:p-5">
                    <div className="max-md:divide-y max-md:divide-[#dce6f0] md:grid md:grid-cols-3 md:gap-x-4 md:gap-y-5">
                      <FormField label={t("firstName")} required>
                        <input
                          className={inputClass}
                          value={tr.firstName}
                          onChange={(e) => patchTraveller(index, { firstName: e.target.value })}
                          autoComplete="given-name"
                          spellCheck={false}
                          autoCapitalize="characters"
                          placeholder={t("firstName")}
                        />
                      </FormField>
                      <FormField label={t("lastName")} required>
                        <input
                          className={inputClass}
                          value={tr.lastName}
                          onChange={(e) => patchTraveller(index, { lastName: e.target.value })}
                          autoComplete="family-name"
                          spellCheck={false}
                          autoCapitalize="characters"
                          placeholder={t("lastName")}
                        />
                      </FormField>
                      <FormField label={t("nationality")} required>
                        <NationalityCombobox
                          label={t("nationality")}
                          placeholder={t("pleaseSelect")}
                          locale={locale}
                          value={tr.nationality}
                          onChange={(value) => patchTraveller(index, { nationality: value })}
                          fieldId={`visa-${index}`}
                          required
                          hideLabel
                          showError={attempted && !tr.nationality?.code}
                          error={t("validationRequired")}
                        />
                      </FormField>

                      <FormField label={t("austriaStay")} optional={t("austriaStayHint")} alignTop>
                        <YesNoField
                          name={`austria-${index}`}
                          value={tr.austriaStay}
                          onChange={(v) => patchTraveller(index, { austriaStay: v })}
                          pleaseSelectLabel={t("pleaseSelect")}
                          yesLabel={t("yes")}
                          noLabel={t("no")}
                        />
                      </FormField>
                      <FormField label={t("passportType")} required>
                        <select
                          className={`${inputClass} cursor-pointer appearance-none`}
                          value={tr.passportType}
                          onChange={(e) =>
                            patchTraveller(index, {
                              passportType: e.target.value as Traveller["passportType"],
                            })
                          }
                        >
                          <option value="">{t("pleaseSelect")}</option>
                          {PASSPORT_TYPES.map((v) => (
                            <option key={v} value={v}>
                              {t(`passport_${v}`)}
                            </option>
                          ))}
                        </select>
                      </FormField>
                      <FormField label={t("passportValid")} required alignTop>
                        <YesNoField
                          name={`passport-valid-${index}`}
                          value={tr.passportValid}
                          onChange={(v) => patchTraveller(index, { passportValid: v })}
                          pleaseSelectLabel={t("pleaseSelect")}
                          yesLabel={t("yes")}
                          noLabel={t("no")}
                        />
                      </FormField>

                      {index === travellers.length - 1 ? (
                        <>
                          <FormField label={t("residenceCountry")} required>
                            <div className="flex min-w-0 items-center gap-1.5 md:gap-2">
                              {residenceCountry?.code ? (
                                <span className="shrink-0 text-[1rem] leading-none sm:text-[1.15rem]" aria-hidden>
                                  {flagEmoji(residenceCountry.code)}
                                </span>
                              ) : null}
                              <div className="min-w-0 flex-1">
                                <NationalityCombobox
                                  label={t("residenceCountry")}
                                  placeholder={t("pleaseSelect")}
                                  locale={locale}
                                  value={residenceCountry}
                                  onChange={setResidence}
                                  fieldId="residence"
                                  required
                                  hideLabel
                                  showError={attempted && !residenceCountry?.code}
                                  error={t("validationRequired")}
                                />
                              </div>
                            </div>
                          </FormField>

                          <FormField label={t("phone")} required>
                            <div
                              className={cn(
                                "dir-ltr-keep flex min-w-0 max-w-full items-stretch overflow-hidden rounded-lg border bg-white focus-within:ring-2 max-md:border-[#d1d5db]",
                                attempted && phone.trim().length < 6
                                  ? "border-brand-red focus-within:border-brand-red focus-within:ring-brand-red/15"
                                  : "border-line focus-within:border-brand-cta focus-within:ring-brand-cta/20",
                              )}
                            >
                              <div className="flex min-h-[34px] shrink-0 items-stretch md:min-h-[42px]">
                                <PhoneCountrySelect
                                  value={phoneCountry}
                                  onChange={setPhonePrefix}
                                  ariaLabel={t("phoneCountry")}
                                />
                                <span
                                  className="flex shrink-0 items-center px-0.5 text-[12px] text-muted sm:px-1.5 sm:text-[14px]"
                                  aria-hidden
                                >
                                  |
                                </span>
                              </div>
                              <input
                                type="tel"
                                className="min-h-[34px] min-w-0 flex-1 border-0 bg-white px-2 py-1.5 text-[13px] text-navy outline-none placeholder:text-muted sm:min-w-[7rem] sm:px-3 sm:py-2 sm:text-[14px] md:min-h-[42px] md:py-2.5"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                inputMode="tel"
                                autoComplete="tel-national"
                                placeholder={t("phonePlaceholder")}
                              />
                            </div>
                          </FormField>

                          <FormField label={t("email")} optional={t("emailOptional")}>
                            <input
                              className={inputClass}
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              autoComplete="email"
                              placeholder="name@example.com"
                            />
                          </FormField>

                          <FormField label={t("source")} required>
                            <select
                              className={`${inputClass} cursor-pointer appearance-none`}
                              value={source}
                              onChange={(e) => {
                                const next = e.target.value as (typeof SOURCES)[number] | "";
                                setSource(next);
                                if (next !== "other") setSourceOther("");
                              }}
                            >
                              <option value="">{t("pleaseSelect")}</option>
                              {SOURCES.map((v) => (
                                <option key={v} value={v}>
                                  {t(`source_${v}`)}
                                </option>
                              ))}
                            </select>
                          </FormField>

                          {source === "other" ? (
                            <FormField label={t("sourceOtherLabel")} required>
                              <input
                                className={inputClass}
                                value={sourceOther}
                                onChange={(e) => setSourceOther(e.target.value)}
                                autoComplete="off"
                              />
                            </FormField>
                          ) : null}
                        </>
                      ) : null}
                    </div>

                    {tr.passportValid === "no" ? (
                      <p
                        role="status"
                        className="mx-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12px] leading-snug text-amber-950 md:mx-0"
                      >
                        {passportValidityWarning?.trim() || t("passportValidWarning")}
                      </p>
                    ) : null}

                    {index === travellers.length - 1 ? (
                      <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#d0dfff] bg-[#e6eeff] px-3 py-2.5 text-[12px] leading-snug text-navy md:hidden">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-navy" strokeWidth={2} />
                        <p>{t("formHintMobile")}</p>
                      </div>
                    ) : null}
                  </div>
                </section>
              ))}
            </div>

            <label className="hidden items-start gap-2.5 px-1 text-[13px] text-navy md:flex md:px-0">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-line accent-navy"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              <span>{t("confirmAccuracy")}</span>
            </label>

            {attempted && !isValid() ? (
              <p className="text-[13px] font-medium text-brand-red">{t("validationSummary")}</p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-5 py-3.5 text-[15px] font-bold text-white transition hover:bg-navy-deep disabled:opacity-60 md:rounded-full"
            >
              {loading ? t("sending") : t("submit")}
              <Send className="h-4 w-4" strokeWidth={2.25} />
            </button>

            <p className="flex items-center justify-center gap-1.5 text-[12px] font-bold text-navy md:font-medium">
              <ShieldCheck className="h-4 w-4 text-navy md:text-brand-cta" strokeWidth={2} aria-hidden />
              {t("secureNote")}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

const TRUST_BAR_ICONS = {
  advice: "/brand/icons/visum-service/trust/advice.png",
  secure: "/brand/icons/visum-service/trust/secure.png",
  fast: "/brand/icons/visum-service/trust/fast.png",
  free: "/brand/icons/visum-service/trust/free.png",
} as const;

export function VisumServiceTrustBar() {
  const t = useTranslations("visum");
  const items = [
    { iconSrc: TRUST_BAR_ICONS.advice, titleKey: "trustAdviceTitle", bodyKey: "trustAdviceBody" },
    { iconSrc: TRUST_BAR_ICONS.secure, titleKey: "trustSecureTitle", bodyKey: "trustSecureBody" },
    { iconSrc: TRUST_BAR_ICONS.fast, titleKey: "trustFastTitle", bodyKey: "trustFastBody" },
    { iconSrc: TRUST_BAR_ICONS.free, titleKey: "trustFreeTitle", bodyKey: "trustFreeBody" },
  ] as const;

  return (
    <section className="border-t border-line bg-white px-2.5 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Desktop: one horizontal row · Mobile: compact 4-up from approved screenshot */}
      <ul className="mx-auto grid max-w-page grid-cols-4 gap-1.5 sm:gap-4 md:gap-6 lg:gap-8">
        {items.map(({ iconSrc, titleKey, bodyKey }) => (
          <li
            key={titleKey}
            className="flex min-w-0 flex-col items-center px-0.5 text-center md:flex-row md:items-start md:gap-3 md:px-0 md:text-start"
          >
            <Image
              src={iconSrc}
              alt=""
              width={36}
              height={36}
              className="mb-1 h-7 w-7 shrink-0 object-contain sm:mb-1.5 sm:h-9 sm:w-9 md:mb-0"
            />
            <span className="min-w-0">
              <span className="block text-[9px] font-bold leading-tight text-navy sm:text-[12px] md:text-[13px]">
                {t(titleKey)}
              </span>
              <span className="mt-0.5 block text-[9px] leading-snug text-navy/72 sm:text-[10px] md:text-muted">
                {t(bodyKey)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
