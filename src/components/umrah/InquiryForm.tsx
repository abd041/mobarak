"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, ChevronDown, Info, Megaphone, Phone, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import type { Hotel, UmrahTrip } from "@/data/mock";
import { DEFAULT_SITE_SETTINGS, resolvePrivacyPolicyHref } from "@/data/site-settings";
import { getTripFlightInfo } from "@/lib/trip-flights";
import {
  hasInquiryFormErrors,
  validateInquiryForm,
  type InquiryFormErrors,
  type PaxFieldErrors,
  type PaxFormData,
} from "@/lib/inquiry-form-validation";
import {
  getRemovedPaxWithData,
  mergePaxByCounts,
  paxTypeIndex,
  remapTouchForPax,
  type PaxTouch,
} from "@/lib/inquiry-pax";
import { getTripInquiryLabel } from "@/lib/trip-inquiry";
import { resolveTrip } from "@/lib/trip-availability";
import { getSiteSettings, SITE_SETTINGS_EVENT } from "@/lib/site-settings-store";
import { cn } from "@/lib/utils";
import { DirArrow, DirBackArrow } from "@/components/ui/DirArrow";
import {
  TripInquiryFormNotice,
  useTripInquiryCtaCopy,
} from "@/components/umrah/detail/TripInquiryCtaCopy";
import { useTripFlowContext } from "@/components/umrah/TripFlowProvider";
import { InquiryTripSummary } from "@/components/umrah/inquiry/InquiryTripSummary";

const DIAL_OPTIONS = [
  { code: "AT", flag: "🇦🇹", dial: "+43" },
  { code: "DE", flag: "🇩🇪", dial: "+49" },
  { code: "CH", flag: "🇨🇭", dial: "+41" },
  { code: "BA", flag: "🇧🇦", dial: "+387" },
  { code: "TR", flag: "🇹🇷", dial: "+90" },
  { code: "BE", flag: "🇧🇪", dial: "+32" },
  { code: "FR", flag: "🇫🇷", dial: "+33" },
  { code: "NL", flag: "🇳🇱", dial: "+31" },
  { code: "IT", flag: "🇮🇹", dial: "+39" },
  { code: "RS", flag: "🇷🇸", dial: "+381" },
  { code: "GB", flag: "🇬🇧", dial: "+44" },
  { code: "US", flag: "🇺🇸", dial: "+1" },
  { code: "SA", flag: "🇸🇦", dial: "+966" },
  { code: "AE", flag: "🇦🇪", dial: "+971" },
  { code: "EG", flag: "🇪🇬", dial: "+20" },
];

const SOURCE_OPTION_VALUES = [
  "instagram",
  "facebook",
  "google",
  "chatgpt",
  "friend",
  "know",
  "other",
] as const;

type SourceOptionValue = (typeof SOURCE_OPTION_VALUES)[number];

type SourceLabelKey =
  | "sourceInstagram"
  | "sourceFacebook"
  | "sourceGoogle"
  | "sourceChatgpt"
  | "sourceFriend"
  | "sourceKnow"
  | "sourceOther";

type SourceHintKey =
  | "sourceInstagramHint"
  | "sourceFacebookHint"
  | "sourceGoogleHint"
  | "sourceChatgptHint"
  | "sourceFriendHint"
  | "sourceKnowHint"
  | "sourceOtherHint";

const SOURCE_ICON_SRC: Record<SourceOptionValue, string> = {
  instagram: "/brand/icons/inquiry-source/instagram.png?v=3",
  facebook: "/brand/icons/inquiry-source/facebook.png?v=3",
  google: "/brand/icons/inquiry-source/google.png?v=3",
  chatgpt: "/brand/icons/inquiry-source/chatgpt.png?v=3",
  friend: "/brand/icons/inquiry-source/friend.png?v=3",
  know: "/brand/icons/inquiry-source/know.png?v=3",
  other: "/brand/icons/inquiry-source/other.png?v=3",
};

function SourceOptionIcon({ value }: { value: SourceOptionValue }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SOURCE_ICON_SRC[value]}
      alt=""
      width={52}
      height={52}
      draggable={false}
      className="pointer-events-none h-[52px] w-[52px] shrink-0 rounded-full object-cover shadow-[0_2px_8px_rgba(15,23,42,0.16)]"
    />
  );
}

const SOURCE_OPTIONS: {
  value: SourceOptionValue;
  labelKey: SourceLabelKey;
  hintKey: SourceHintKey;
}[] = [
  { value: "instagram", labelKey: "sourceInstagram", hintKey: "sourceInstagramHint" },
  { value: "facebook", labelKey: "sourceFacebook", hintKey: "sourceFacebookHint" },
  { value: "google", labelKey: "sourceGoogle", hintKey: "sourceGoogleHint" },
  { value: "chatgpt", labelKey: "sourceChatgpt", hintKey: "sourceChatgptHint" },
  { value: "friend", labelKey: "sourceFriend", hintKey: "sourceFriendHint" },
  { value: "know", labelKey: "sourceKnow", hintKey: "sourceKnowHint" },
  { value: "other", labelKey: "sourceOther", hintKey: "sourceOtherHint" },
];

const PREFERRED_LANGUAGE_OPTIONS: {
  value: Locale;
  flag: string;
  labelKey:
    | "preferredLanguageDe"
    | "preferredLanguageAr"
    | "preferredLanguageBs"
    | "preferredLanguageTr"
    | "preferredLanguageEn";
}[] = [
  { value: "de", flag: "🇩🇪", labelKey: "preferredLanguageDe" },
  { value: "ar", flag: "🇸🇦", labelKey: "preferredLanguageAr" },
  { value: "bs", flag: "🇧🇦", labelKey: "preferredLanguageBs" },
  { value: "tr", flag: "🇹🇷", labelKey: "preferredLanguageTr" },
  { value: "en", flag: "🇬🇧", labelKey: "preferredLanguageEn" },
];

type Pax = PaxFormData;

type FormTouch = {
  pax: PaxTouch[];
  source?: boolean;
  phone?: boolean;
  email?: boolean;
};

function emptyFormTouch(paxCount: number): FormTouch {
  return { pax: Array.from({ length: paxCount }, () => ({})) };
}

export function InquiryForm({
  trip,
  medina,
  makkah,
}: {
  trip: UmrahTrip;
  medina: Hotel;
  makkah: Hotel;
}) {
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
  const tMeta = useTranslations("meta");
  const locale = useLocale();
  const [liveTrip, setLiveTrip] = useState(trip);

  useEffect(() => {
    const sync = () => setLiveTrip(resolveTrip(trip));
    sync();
    window.addEventListener("mobarak-availability", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mobarak-availability", sync);
      window.removeEventListener("storage", sync);
    };
  }, [trip]);

  const inquiryLabel = getTripInquiryLabel(liveTrip);
  const flightInfo = getTripFlightInfo(liveTrip);
  const inquiryCta = useTripInquiryCtaCopy(liveTrip);
  const flow = useTripFlowContext();
  const phoneDisplay = tMeta("phone");
  const phoneHref = `tel:${phoneDisplay.replace(/\s/g, "")}`;

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [source, setSource] = useState<(typeof SOURCE_OPTION_VALUES)[number] | "">("");
  const [sourceOtherDetail, setSourceOtherDetail] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("AT");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState(locale);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [privacyPolicyHref, setPrivacyPolicyHref] = useState(
    () => resolvePrivacyPolicyHref(DEFAULT_SITE_SETTINGS),
  );
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState<FormTouch>(() => emptyFormTouch(2));
  const [errors, setErrors] = useState<InquiryFormErrors>({ pax: [] });

  const validationMessages = useMemo(
    () => ({
      firstName: t("validationFirstName"),
      lastName: t("validationLastName"),
      nationality: t("validationNationality"),
      passportType: t("validationPassportType"),
      childBed: t("validationChildBed"),
      source: t("validationSource"),
      phone: t("validationPhone"),
      email: t("validationEmail"),
    }),
    [t],
  );

  useEffect(() => {
    setPreferredLanguage(locale);
  }, [locale]);

  useEffect(() => {
    const syncPrivacyHref = () =>
      setPrivacyPolicyHref(resolvePrivacyPolicyHref(getSiteSettings()));
    syncPrivacyHref();
    window.addEventListener(SITE_SETTINGS_EVENT, syncPrivacyHref);
    return () => window.removeEventListener(SITE_SETTINGS_EVENT, syncPrivacyHref);
  }, []);

  const phoneDial = DIAL_OPTIONS.find((d) => d.code === phoneCountry)?.dial ?? "+43";

  const [paxData, setPaxData] = useState<Pax[]>(() =>
    mergePaxByCounts({ adults: 2, children: 0, infants: 0 }, []),
  );

  useEffect(() => {
    const anyTouched =
      touched.source ||
      touched.phone ||
      touched.email ||
      touched.pax.some((p) => Object.values(p).some(Boolean));

    if (submitAttempted || anyTouched) {
      setErrors(validateInquiryForm(locale, paxData, source, phone, email, validationMessages));
    }
  }, [
    paxData,
    source,
    phone,
    email,
    submitAttempted,
    touched,
    locale,
    validationMessages,
  ]);

  function markPaxTouched(index: number, field: keyof PaxTouch) {
    setTouched((prev) => ({
      ...prev,
      pax: prev.pax.map((p, i) => (i === index ? { ...p, [field]: true } : p)),
    }));
  }

  function showPaxError(index: number, field: keyof PaxFieldErrors): string | undefined {
    const show = submitAttempted || touched.pax[index]?.[field as keyof PaxTouch];
    return show ? errors.pax[index]?.[field] : undefined;
  }

  function showFieldError(
    field: "source" | "phone" | "email",
  ): string | undefined {
    const show = submitAttempted || touched[field];
    return show ? errors[field] : undefined;
  }

  function updatePax(index: number, patch: Partial<Pax>) {
    setPaxData((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  }

  function trySetTravellerCount(type: Pax["type"], next: number, current: number, min: number) {
    const clamped = Math.max(min, next);
    if (clamped === current) return;

    if (clamped < current) {
      const removed = getRemovedPaxWithData(type, paxData, clamped);
      if (removed.length > 0 && !window.confirm(t("paxReduceConfirm"))) {
        return;
      }
    }

    const nextCounts = {
      adults: type === "adult" ? clamped : adults,
      children: type === "child" ? clamped : children,
      infants: type === "infant" ? clamped : infants,
    };

    setPaxData((prev) => {
      const merged = mergePaxByCounts(nextCounts, prev);
      setTouched((touch) => ({
        ...touch,
        pax: remapTouchForPax(prev, touch.pax, merged),
      }));
      return merged;
    });

    if (type === "adult") setAdults(clamped);
    else if (type === "child") setChildren(clamped);
    else setInfants(clamped);
  }

  function paxHeading(p: Pax, index: number): string {
    const n = paxTypeIndex(paxData, index);
    if (p.type === "adult") return `${t("adultLabel")} ${n}`;
    if (p.type === "child") return t("childLabelWithAge", { n });
    return t("infantLabelWithAge", { n });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);

    const nextErrors = validateInquiryForm(
      locale,
      paxData,
      source,
      phone,
      email,
      validationMessages,
    );
    setErrors(nextErrors);

    if (hasInquiryFormErrors(nextErrors)) {
      requestAnimationFrame(() => {
        document
          .querySelector('[data-invalid="true"]')
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-soft">
          <Check className="h-8 w-8 text-brand-green" strokeWidth={2.5} aria-hidden />
        </div>
        <h1 className="mb-3 text-3xl font-bold text-navy">{t("successTitle")}</h1>
        <p className="mb-8 text-muted">{t("successBody")}</p>
        <Link
          href={flow.offerPath}
          className="inline-flex items-center gap-1 font-semibold text-brand-cta"
        >
          <DirBackArrow /> {liveTrip.dateLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-page px-4 py-6 md:px-8 md:py-8 lg:py-10">
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] lg:items-start lg:gap-10 xl:gap-12">
        <InquiryTripSummary trip={liveTrip} medina={medina} makkah={makkah} />

        <form
          id="inquiry-form"
          onSubmit={onSubmit}
          noValidate
          className="min-w-0 w-full self-start overflow-hidden rounded-[16px] border border-line bg-white shadow-[var(--shadow-card)]"
        >
          <input type="hidden" name="trip_id" value={flow.tripId} />
          <input type="hidden" name="trip_slug" value={liveTrip.slug} />
          <input type="hidden" name="trip_label" value={inquiryLabel} />
          <input type="hidden" name="trip_start_date" value={liveTrip.startDate} />
          <input type="hidden" name="trip_end_date" value={liveTrip.endDate} />
          <input type="hidden" name="medina_hotel_id" value={liveTrip.medinaHotelId} />
          <input type="hidden" name="makkah_hotel_id" value={liveTrip.makkahHotelId} />
          <input type="hidden" name="airline" value={flightInfo.airline} />
          <input type="hidden" name="departure_airport" value={liveTrip.departureAirport} />

          {/* Header — desktop only phone pill; mobile uses site header */}
          <div className="relative p-5 sm:p-6">
            <a
              href={phoneHref}
              className="dir-ltr-keep absolute end-5 top-5 hidden shrink-0 items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[13px] font-semibold text-navy shadow-sm transition hover:border-[#d5d9df] hover:shadow-card sm:end-6 sm:top-6 sm:inline-flex"
            >
              <Phone className="h-4 w-4 shrink-0 text-navy" strokeWidth={2} aria-hidden />
              {phoneDisplay}
            </a>
            <div className="sm:pe-48">
              <h2 className="text-xl font-bold text-navy sm:text-2xl lg:text-[28px]">{t("inquiryFormTitle")}</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted sm:text-[14px]">{t("inquiryFormSubtitle")}</p>
              <div className="mt-4">
                <TripInquiryFormNotice trip={liveTrip} />
              </div>
            </div>
          </div>

          {/* Traveller count */}
          <section className="border-t border-line p-5 sm:p-6">
            <div className="rounded-xl border border-line bg-white p-4 sm:p-5 lg:p-6">
              <h3 className="text-[15px] font-bold text-navy sm:text-[16px]">{t("travellers")}</h3>
              <div className="mt-4 grid grid-cols-3 divide-x divide-line sm:mt-5">
                <SegmentedCounter
                  label={t("adults")}
                  hint={t("adultsHint")}
                  value={adults}
                  min={1}
                  onChange={(n) => trySetTravellerCount("adult", n, adults, 1)}
                  className="pe-3 sm:pe-5"
                />
                <SegmentedCounter
                  label={t("children")}
                  hint={t("childrenHint")}
                  value={children}
                  min={0}
                  onChange={(n) => trySetTravellerCount("child", n, children, 0)}
                  className="px-3 sm:px-5"
                />
                <SegmentedCounter
                  label={t("infants")}
                  hint={t("infantsHint")}
                  value={infants}
                  min={0}
                  onChange={(n) => trySetTravellerCount("infant", n, infants, 0)}
                  className="ps-3 sm:ps-5"
                />
              </div>
              <div className="mt-5 rounded-lg border border-brand-cta/20 bg-brand-cta/5 px-4 py-3.5">
                <div className="flex gap-2.5">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-cta" aria-hidden />
                  <p className="text-[12px] leading-relaxed text-navy">
                    <span className="font-bold">{t("inquiryTravellersInfoTitle")}</span>{" "}
                    {t("inquiryTravellersAgeNote")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Personal data */}
          <section className="border-t border-line p-5 sm:p-6">
            <div className="rounded-xl border border-line bg-white p-4 sm:p-5 lg:p-6">
              <h3 className="text-[15px] font-bold text-navy sm:text-[16px]">{t("personalData")}</h3>
              <p className="mt-1 text-[12px] text-muted sm:text-[13px]">{t("personalHint")}</p>
              <div className="mt-5 divide-y divide-line">
                {paxData.map((p, i) => {
                  const typeIndex = paxTypeIndex(paxData, i);
                  return (
                  <div key={`${p.type}-${typeIndex}`} className="py-5 first:pt-0 last:pb-0">
                    <p className="mb-4 text-[13px] font-bold text-navy">{paxHeading(p, i)}</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
                      <Field
                        label={t("firstName")}
                        placeholder={t("firstName")}
                        value={p.firstName}
                        onChange={(v) => updatePax(i, { firstName: v })}
                        onBlur={() => markPaxTouched(i, "firstName")}
                        error={showPaxError(i, "firstName")}
                      />
                      <Field
                        label={t("lastName")}
                        placeholder={t("lastName")}
                        value={p.lastName}
                        onChange={(v) => updatePax(i, { lastName: v })}
                        onBlur={() => markPaxTouched(i, "lastName")}
                        error={showPaxError(i, "lastName")}
                      />
                      <Field
                        label={t("nationality")}
                        placeholder={t("nationalityPlaceholder")}
                        value={p.nationality}
                        onChange={(v) =>
                          updatePax(i, { nationality: v, nationalityCode: "" })
                        }
                        onBlur={() => markPaxTouched(i, "nationality")}
                        error={showPaxError(i, "nationality")}
                        autoComplete="off"
                      />
                      <PassportTypeSelect
                        label={t("passportType")}
                        placeholder={t("passportSelectPlaceholder")}
                        value={p.passportType}
                        onChange={(v) => updatePax(i, { passportType: v })}
                        onBlur={() => markPaxTouched(i, "passportType")}
                        error={showPaxError(i, "passportType")}
                      />
                    </div>
                    {p.type === "child" && (
                      <fieldset
                        className="mt-4 border-t border-line pt-4"
                        onBlur={(e) => {
                          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                            markPaxTouched(i, "needsBed");
                          }
                        }}
                      >
                        <legend className="mb-3 text-[13px] font-bold text-navy">
                          {t("childBed")}
                        </legend>
                        <div className="flex flex-wrap gap-6 text-[13px] text-navy">
                          <label className="inline-flex cursor-pointer items-center gap-2.5">
                            <input
                              type="radio"
                              name={`child-bed-${i}`}
                              className="h-4 w-4 accent-brand-cta"
                              checked={p.needsBed === "yes"}
                              onChange={() => {
                                updatePax(i, { needsBed: "yes" });
                                markPaxTouched(i, "needsBed");
                              }}
                            />
                            {t("yes")}
                          </label>
                          <label className="inline-flex cursor-pointer items-center gap-2.5">
                            <input
                              type="radio"
                              name={`child-bed-${i}`}
                              className="h-4 w-4 accent-brand-cta"
                              checked={p.needsBed === "no"}
                              onChange={() => {
                                updatePax(i, { needsBed: "no" });
                                markPaxTouched(i, "needsBed");
                              }}
                            />
                            {t("no")}
                          </label>
                        </div>
                        {showPaxError(i, "needsBed") && (
                          <p
                            className="mt-2 text-[12px] text-red-600"
                            role="alert"
                            data-invalid="true"
                          >
                            {showPaxError(i, "needsBed")}
                          </p>
                        )}
                      </fieldset>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Referral source — optional cards */}
          <section className="border-t border-line p-5 sm:p-6">
            <div className="rounded-[16px] border border-line bg-white p-5 shadow-[0_1px_8px_rgba(11,44,74,0.04)] sm:p-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF4FF] px-2.5 py-1 text-[11px] font-semibold text-[#1264F5]">
                <Megaphone className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
                {t("sourceBadge")}
              </span>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h3 className="text-[18px] font-bold text-[#111111] sm:text-[20px]">{t("sourceTitle")}</h3>
                <span className="text-[12px] font-medium text-muted">{t("sourceOptional")}</span>
              </div>
              <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-[#6B7C8F]">
                {t("sourceIntro")}
              </p>
              <input type="hidden" name="source" value={source} readOnly />
              <div
                className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
                role="radiogroup"
                aria-label={t("sourceTitle")}
              >
                {SOURCE_OPTIONS.map(({ value, labelKey, hintKey }) => {
                  const selected = source === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => {
                        const next = selected ? "" : value;
                        setSource(next);
                        setTouched((prev) => ({ ...prev, source: true }));
                        if (next !== "other") setSourceOtherDetail("");
                      }}
                      className={cn(
                        "relative flex min-h-[92px] items-center gap-[14px] rounded-[14px] border bg-white px-4 py-[18px] pe-12 text-start transition",
                        selected
                          ? "border-[#1264F5] bg-[#F5F9FF] shadow-[0_1px_6px_rgba(18,100,245,0.12)]"
                          : "border-[#E6E9EE] shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:border-[#C5CEDA]",
                      )}
                    >
                      <SourceOptionIcon value={value} />
                      <span className="min-w-0 flex-1 pr-1">
                        <span className="block text-[14px] font-bold leading-[1.25] text-[#111111]">
                          {t(labelKey)}
                        </span>
                        <span className="mt-1 block text-[12px] font-normal leading-[1.35] text-[#6B7C8F]">
                          {t(hintKey)}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "absolute end-3.5 top-3.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-[1.5px]",
                          selected ? "border-[#1264F5]" : "border-[#C9D2DC]",
                        )}
                        aria-hidden
                      >
                        {selected ? (
                          <span className="h-2 w-2 rounded-full bg-[#1264F5]" />
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
              {source === "other" && (
                <input
                  type="text"
                  name="source_other_detail"
                  value={sourceOtherDetail}
                  onChange={(e) => setSourceOtherDetail(e.target.value)}
                  placeholder={t("sourceOtherPlaceholder")}
                  className={cn(inputClass, "mt-3")}
                  autoComplete="off"
                />
              )}
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-line p-5 sm:p-6">
            <div className="rounded-xl border border-line bg-white p-5 sm:p-6">
              <h3 className="text-[16px] font-bold text-navy">{t("contactTitle")}</h3>
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-navy">{t("phone")}</span>
                  <div
                    className={cn(
                      "dir-ltr-keep flex overflow-hidden rounded-lg border bg-white focus-within:ring-2",
                      showFieldError("phone")
                        ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/15"
                        : "border-line focus-within:border-brand-cta focus-within:ring-brand-cta/15",
                    )}
                  >
                    <PhoneInlineSelect
                      value={phoneCountry}
                      onChange={setPhoneCountry}
                      ariaLabel={t("phonePrefix")}
                      className="w-[4.25rem] shrink-0 border-e border-line"
                    >
                      {DIAL_OPTIONS.map((d) => (
                        <option key={d.code} value={d.code}>
                          {d.flag}
                        </option>
                      ))}
                    </PhoneInlineSelect>
                    <PhoneInlineSelect
                      value={phoneDial}
                      onChange={(dial) => {
                        const found = DIAL_OPTIONS.find((d) => d.dial === dial);
                        if (found) setPhoneCountry(found.code);
                      }}
                      ariaLabel={t("phonePrefix")}
                      className="w-[4.75rem] shrink-0"
                    >
                      {DIAL_OPTIONS.map((d) => (
                        <option key={d.code} value={d.dial}>
                          {d.dial}
                        </option>
                      ))}
                    </PhoneInlineSelect>
                    <span
                      className="flex shrink-0 items-center px-1 text-[14px] text-muted"
                      aria-hidden
                    >
                      |
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                      data-invalid={showFieldError("phone") ? "true" : undefined}
                      aria-invalid={showFieldError("phone") ? true : undefined}
                      className="min-w-0 flex-1 border-0 bg-white px-2 py-2.5 text-[16px] text-navy placeholder:text-muted outline-none sm:px-3"
                      placeholder={t("phonePlaceholder")}
                      inputMode="tel"
                      autoComplete="tel-national"
                    />
                    <input type="hidden" name="phone_country" value={phoneCountry} readOnly />
                    <input type="hidden" name="phone_dial" value={phoneDial} readOnly />
                  </div>
                  {showFieldError("phone") && (
                    <p className="mt-1.5 text-[12px] text-red-600" role="alert">
                      {showFieldError("phone")}
                    </p>
                  )}
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-navy">{t("emailAddress")}</span>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    data-invalid={showFieldError("email") ? "true" : undefined}
                    aria-invalid={showFieldError("email") ? true : undefined}
                    className={cn(
                      inputClass,
                      "dir-ltr-keep",
                      showFieldError("email") &&
                        "border-red-500 focus:border-red-500 focus:ring-red-500/15",
                    )}
                    placeholder={t("emailPlaceholder")}
                    autoComplete="email"
                  />
                  {showFieldError("email") && (
                    <p className="mt-1.5 text-[12px] text-red-600" role="alert">
                      {showFieldError("email")}
                    </p>
                  )}
                </label>
              </div>
            </div>
          </section>

          {/* Further details */}
          <section className="border-t border-line p-5 sm:p-6">
            <div className="rounded-xl border border-line bg-white p-5 sm:p-6">
              <h3 className="text-[16px] font-bold text-navy">{t("furtherDetails")}</h3>
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-navy">
                    {t("preferredLanguage")}
                  </span>
                  <div className="relative">
                    <select
                      name="preferred_language"
                      aria-label={t("preferredLanguage")}
                      className={cn(selectClass, "dir-ltr-keep text-navy")}
                      value={preferredLanguage}
                      onChange={(e) => {
                        const next = e.target.value as Locale;
                        if (PREFERRED_LANGUAGE_OPTIONS.some((o) => o.value === next)) {
                          setPreferredLanguage(next);
                        }
                      }}
                    >
                      {PREFERRED_LANGUAGE_OPTIONS.map(({ value, flag, labelKey }) => (
                        <option key={value} value={value}>
                          {flag} {t(labelKey)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                      aria-hidden
                    />
                  </div>
                  <span className="mt-1.5 block text-[12px] leading-relaxed text-muted">
                    {t("preferredLanguageHint")}
                  </span>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-navy">{t("message")}</span>
                  <textarea
                    name="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("messagePlaceholder")}
                    className={cn(inputClass, "resize-y")}
                  />
                </label>
              </div>
            </div>
          </section>

          {/* Privacy + final CTA — full width of right form column only */}
          <section className="border-t border-line p-5 sm:p-6">
            <div className="flex gap-2.5 rounded-lg border border-line/70 bg-surface/40 px-4 py-3.5">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-muted"
                aria-hidden
              />
              <p className="text-[12px] leading-relaxed text-muted">
                {t.rich("privacyNotice", {
                  link: (chunks) => (
                    <PrivacyPolicyLink href={privacyPolicyHref}>{chunks}</PrivacyPolicyLink>
                  ),
                })}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "mt-5 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-[12px] px-6 py-3.5 text-[14px] font-bold text-white transition hover:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-[52px] sm:text-[15px]",
                inquiryCta.mode === "waitlist"
                  ? "bg-brand-orange-cta focus-visible:outline-brand-orange-cta"
                  : inquiryCta.mode === "full"
                    ? "bg-navy focus-visible:outline-navy"
                    : "bg-[#1264F5] shadow-[0_8px_20px_rgba(18,100,245,0.28)] focus-visible:outline-[#1264F5]",
              )}
            >
              {loading ? tCommon("loading") : inquiryCta.buttonLabel}
              {!loading && <DirArrow />}
            </button>

            <p className="mt-4 flex items-center justify-center gap-2 text-[13px] font-medium text-navy">
              <span
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-green"
                aria-hidden
              >
                <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
              </span>
              {tCommon("freeInquiry")}
            </p>
          </section>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-[16px] text-navy placeholder:text-muted outline-none transition focus:border-brand-cta focus:ring-2 focus:ring-brand-cta/15";
const selectClass = cn(
  inputClass,
  "appearance-none pe-9",
);

function SegmentedCounter({
  label,
  hint,
  value,
  min,
  onChange,
  className,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  onChange: (n: number) => void;
  className?: string;
}) {
  const tCommon = useTranslations("common");
  const labelId = useId();

  return (
    <div className={className}>
      <p id={labelId} className="text-[14px] font-bold leading-tight text-navy">
        {label}
      </p>
      <p className="mt-0.5 text-[11px] leading-snug text-muted">{hint}</p>
      <div
        className="mt-3 flex h-12 items-stretch overflow-hidden rounded-lg border border-line bg-white"
        role="group"
        aria-labelledby={labelId}
      >
        <button
          type="button"
          className="flex w-10 shrink-0 items-center justify-center text-xl font-normal text-navy transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-35 sm:w-12"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={tCommon("decrease", { label })}
        >
          −
        </button>
        <div
          className="flex flex-1 items-center justify-center text-[16px] font-bold text-navy"
          aria-live="polite"
        >
          {value}
        </div>
        <button
          type="button"
          className="flex w-10 shrink-0 items-center justify-center text-xl font-normal text-navy transition hover:bg-surface sm:w-12"
          onClick={() => onChange(value + 1)}
          aria-label={tCommon("increase", { label })}
        >
          +
        </button>
      </div>
    </div>
  );
}

function PassportTypeSelect({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
}: {
  label: string;
  placeholder: string;
  value: Pax["passportType"];
  onChange: (v: Pax["passportType"]) => void;
  onBlur?: () => void;
  error?: string;
}) {
  const t = useTranslations("umrah");
  const errorId = useId();
  const hasError = Boolean(error);

  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-bold text-navy">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as Pax["passportType"])}
          onBlur={onBlur}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
          data-invalid={hasError ? "true" : undefined}
          className={cn(
            selectClass,
            !value && "text-muted",
            hasError && "border-red-500 focus:border-red-500 focus:ring-red-500/15",
          )}
        >
          <option value="">{placeholder}</option>
          <option value="normal">{t("passportNormal")}</option>
          <option value="convention">{t("passportConvention")}</option>
          <option value="travel">{t("passportTravel")}</option>
          <option value="diplomatic">{t("passportDiplomatic")}</option>
        </select>
        <ChevronDown
          className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
      </div>
      {hasError && (
        <p id={errorId} className="mt-1.5 text-[12px] text-red-600" role="alert">
          {error}
        </p>
      )}
    </label>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  autoComplete,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  const errorId = useId();
  const keepLtr = type === "email" || type === "tel";
  const hasError = Boolean(error);

  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-bold text-navy">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? errorId : undefined}
        data-invalid={hasError ? "true" : undefined}
        className={cn(
          inputClass,
          keepLtr && "dir-ltr-keep",
          hasError && "border-red-500 focus:border-red-500 focus:ring-red-500/15",
        )}
      />
      {hasError && (
        <p id={errorId} className="mt-1.5 text-[12px] text-red-600" role="alert">
          {error}
        </p>
      )}
    </label>
  );
}

function PrivacyPolicyLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const className =
    "font-semibold text-brand-cta underline-offset-2 hover:underline";

  if (href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

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
        className="w-full appearance-none border-0 bg-transparent py-2.5 ps-2 pe-6 text-[16px] text-navy outline-none"
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
