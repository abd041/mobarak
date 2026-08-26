"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Hotel, UmrahTrip } from "@/data/mock";
import { formatEuro } from "@/lib/utils";
import { Footprints } from "lucide-react";

const COUNTRIES = [
  "Österreich",
  "Deutschland",
  "Schweiz",
  "Bosnien und Herzegowina",
  "Türkei",
  "Belgien",
  "Frankreich",
  "Niederlande",
  "Italien",
  "Serbien",
];

type Pax = {
  type: "adult" | "child" | "infant";
  firstName: string;
  lastName: string;
  nationality: string;
  passportType: string;
  needsBed?: "" | "yes" | "no";
};

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
  const tLang = useTranslations("language");
  const locale = useLocale();

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [source, setSource] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState(locale);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const passengers = useMemo(() => {
    const list: Pax[] = [];
    for (let i = 0; i < adults; i++) {
      list.push({
        type: "adult",
        firstName: "",
        lastName: "",
        nationality: "",
        passportType: "",
      });
    }
    for (let i = 0; i < children; i++) {
      list.push({
        type: "child",
        firstName: "",
        lastName: "",
        nationality: "",
        passportType: "",
        needsBed: "",
      });
    }
    for (let i = 0; i < infants; i++) {
      list.push({
        type: "infant",
        firstName: "",
        lastName: "",
        nationality: "",
        passportType: "",
      });
    }
    return list;
  }, [adults, children, infants]);

  const [paxData, setPaxData] = useState<Pax[]>(passengers);

  useEffect(() => {
    setPaxData((prev) =>
      passengers.map((p, i) => ({
        ...p,
        ...prev[i],
        type: p.type,
        needsBed: p.type === "child" ? prev[i]?.needsBed ?? "" : undefined,
      })),
    );
  }, [passengers]);

  function updatePax(index: number, patch: Partial<Pax>) {
    setPaxData((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="mb-3 text-3xl font-bold text-navy">{t("successTitle")}</h1>
        <p className="mb-8 text-muted">{t("successBody")}</p>
        <Link href={`/umrah/gruppenreise/${trip.slug}`} className="font-semibold text-brand-cta">
          ← {trip.dateLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-8 md:px-8 lg:grid-cols-[0.9fr_1.6fr]">
      {/* Summary */}
      <aside className="h-fit rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)] lg:sticky lg:top-24">
        <h2 className="mb-3 text-lg font-bold text-navy">{t("inquiryTitle")}</h2>
        <p className="text-sm text-muted">{tCommon("nights", { count: trip.nights })}</p>
        <p className="font-semibold text-navy">{trip.title}</p>
        <p className="mb-3 text-navy">{trip.dateLabel}</p>
        <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl">
          <Image src={trip.images[0].src} alt="" fill className="object-cover" sizes="400px" />
        </div>
        <div className="mb-4 space-y-3 text-sm">
          {[medina, makkah].map((h) => (
            <div key={h.id} className="rounded-lg bg-surface p-3">
              <p className="font-semibold">
                {h.city === "medina" ? t("medina") : t("makkah")} –{" "}
                {tCommon("nights", { count: h.nights })}
              </p>
              <p>
                {h.name} ★{h.stars}
              </p>
              <p className="flex items-start gap-1 text-xs text-muted">
                <Footprints className="mt-0.5 h-3 w-3 text-brand-orange" />
                {t("walkingTo", {
                  minutes: h.walkingMinutes,
                  mosque: h.mosque === "nabawi" ? t("nabawi") : t("haram"),
                })}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-line p-3 text-sm">
          <p className="mb-2 font-semibold">{t("childPrices")}</p>
          <p>
            {t("infantPrice")}:{" "}
            <span className="font-bold text-brand-green">{formatEuro(trip.childPrices.infant)}</span>{" "}
            {t("inclFlightVisa")}
          </p>
          <p>
            {t("childNoBed")}:{" "}
            <span className="font-bold text-brand-green">
              {formatEuro(trip.childPrices.withoutBed)}
            </span>
          </p>
          <p>
            {t("childWithBed")}: −{trip.childPrices.withBedDiscount} €
          </p>
          <p className="mt-2 text-xs text-muted">{t("childPriceNote")}</p>
        </div>
      </aside>

      <form onSubmit={onSubmit} className="space-y-6">
        <section className="rounded-2xl border border-line bg-white p-5">
          <h3 className="mb-4 font-bold text-navy">{t("travellers")}</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Counter label={t("adults")} hint={t("adultsHint")} value={adults} min={1} onChange={setAdults} />
            <Counter label={t("children")} hint={t("childrenHint")} value={children} min={0} onChange={setChildren} />
            <Counter label={t("infants")} hint={t("infantsHint")} value={infants} min={0} onChange={setInfants} />
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h3 className="mb-1 font-bold text-navy">{t("personalData")}</h3>
          <p className="mb-4 text-sm text-muted">{t("personalHint")}</p>
          <div className="space-y-4">
            {paxData.map((p, i) => (
              <div key={`${p.type}-${i}`} className="rounded-xl bg-surface p-4">
                <p className="mb-3 text-sm font-semibold text-brand-orange">
                  {p.type === "adult" ? t("adults") : p.type === "child" ? t("children") : t("infants")}{" "}
                  {i + 1}
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label={t("firstName")} value={p.firstName} onChange={(v) => updatePax(i, { firstName: v })} required />
                  <Field label={t("lastName")} value={p.lastName} onChange={(v) => updatePax(i, { lastName: v })} required />
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium">{t("nationality")}</span>
                    <input
                      list={`nat-${i}`}
                      required
                      value={p.nationality}
                      onChange={(e) => updatePax(i, { nationality: e.target.value })}
                      placeholder={t("nationalityPlaceholder")}
                      className="w-full rounded-lg border border-line px-3 py-2"
                    />
                    <datalist id={`nat-${i}`}>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium">{t("passportType")}</span>
                    <select
                      required
                      value={p.passportType}
                      onChange={(e) => updatePax(i, { passportType: e.target.value })}
                      className="w-full rounded-lg border border-line px-3 py-2"
                    >
                      <option value="">—</option>
                      <option value="normal">{t("passportNormal")}</option>
                      <option value="convention">{t("passportConvention")}</option>
                      <option value="travel">{t("passportTravel")}</option>
                      <option value="diplomatic">{t("passportDiplomatic")}</option>
                    </select>
                  </label>
                </div>
                {p.type === "child" && (
                  <fieldset className="mt-3">
                    <legend className="mb-2 text-sm font-medium">{t("childBed")}</legend>
                    <div className="flex gap-4 text-sm">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name={`bed-${i}`}
                          required
                          checked={p.needsBed === "yes"}
                          onChange={() => updatePax(i, { needsBed: "yes" })}
                        />
                        {t("yes")}
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name={`bed-${i}`}
                          checked={p.needsBed === "no"}
                          onChange={() => updatePax(i, { needsBed: "no" })}
                        />
                        {t("no")}
                      </label>
                    </div>
                  </fieldset>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h3 className="mb-3 font-bold text-navy">{t("sourceTitle")}</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                ["instagram", t("sourceInstagram")],
                ["facebook", t("sourceFacebook")],
                ["google", t("sourceGoogle")],
                ["chatgpt", t("sourceChatgpt")],
                ["friend", t("sourceFriend")],
                ["know", t("sourceKnow")],
                ["other", t("sourceOther")],
              ] as const
            ).map(([val, label]) => (
              <label key={val} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="source"
                  required
                  checked={source === val}
                  onChange={() => setSource(val)}
                />
                {label}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h3 className="mb-3 font-bold text-navy">{t("contactTitle")}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label={t("phone")} value={phone} onChange={setPhone} required />
            <Field label={t("email")} value={email} onChange={setEmail} type="email" />
            <label className="block text-sm md:col-span-2">
              <span className="mb-1 block font-medium">{t("preferredLanguage")}</span>
              <select
                className="w-full rounded-lg border border-line px-3 py-2"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
              >
                <option value="de">{tLang("de")}</option>
                <option value="ar">{tLang("ar")}</option>
                <option value="bs">{tLang("bs")}</option>
                <option value="en">{tLang("en")}</option>
              </select>
              <span className="mt-1 block text-xs text-muted">{t("preferredLanguageHint")}</span>
            </label>
            <label className="block text-sm md:col-span-2">
              <span className="mb-1 block font-medium">{t("message")}</span>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("messagePlaceholder")}
                className="w-full rounded-lg border border-line px-3 py-2"
              />
            </label>
          </div>
          <p className="mt-4 text-xs text-muted">{t("privacyNotice")}</p>
        </section>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand-cta py-3.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? tCommon("loading") : `${tCommon("inquireNow")} →`}
        </button>
        <p className="text-center text-xs text-muted">✓ {tCommon("freeInquiry")}</p>
      </form>
    </div>
  );
}

function Counter({
  label,
  hint,
  value,
  min,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="rounded-xl border border-line p-3">
      <p className="font-semibold text-navy">{label}</p>
      <p className="mb-2 text-xs text-muted">{hint}</p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="h-9 w-9 rounded-lg border border-line"
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          −
        </button>
        <span className="w-6 text-center font-bold">{value}</span>
        <button
          type="button"
          className="h-9 w-9 rounded-lg border border-line"
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line px-3 py-2"
      />
    </label>
  );
}
