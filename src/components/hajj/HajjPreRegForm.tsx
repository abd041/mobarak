"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { IMG } from "@/data/mock";
import { Check, Shield } from "lucide-react";
import { DirArrow } from "@/components/ui/DirArrow";

const RESIDENCE = [
  { code: "AT", label: "Österreich", dial: "+43" },
  { code: "DE", label: "Deutschland", dial: "+49" },
  { code: "CH", label: "Schweiz", dial: "+41" },
  { code: "SI", label: "Slowenien", dial: "+386" },
  { code: "BE", label: "Belgien", dial: "+32" },
  { code: "FR", label: "Frankreich", dial: "+33" },
  { code: "NL", label: "Niederlande", dial: "+31" },
  { code: "IT", label: "Italien", dial: "+39" },
  { code: "SK", label: "Slowakei", dial: "+421" },
  { code: "RS", label: "Serbien", dial: "+381" },
];

type Person = {
  firstName: string;
  lastName: string;
  nationality: string;
  residence: string;
  passportType: string;
};

export function HajjPreRegForm() {
  const t = useTranslations("hajj");
  const tSeo = useTranslations("seo");
  const tUmrah = useTranslations("umrah");
  const tCommon = useTranslations("common");

  const [count, setCount] = useState(2);
  const [customCount, setCustomCount] = useState(6);
  const [persons, setPersons] = useState<Person[]>(emptyPersons(2));
  const [phone, setPhone] = useState("");
  const [dial, setDial] = useState("+43");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const effectiveCount = count === 6 ? customCount : count;

  useEffect(() => {
    setPersons((prev) => {
      const next = emptyPersons(effectiveCount).map((p, i) => ({ ...p, ...prev[i] }));
      return next;
    });
  }, [effectiveCount]);

  useEffect(() => {
    const residence = persons[0]?.residence || "AT";
    const found = RESIDENCE.find((r) => r.code === residence);
    if (found) setDial(found.dial);
  }, [persons]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="mb-3 text-3xl font-bold text-navy">{t("successTitle")}</h1>
        <p className="mb-8 text-muted">{t("successBody")}</p>
        <Link href="/hajj-2027" className="inline-flex items-center gap-1.5 font-semibold text-brand-cta">
          {t("backToHajj")} <DirArrow />
        </Link>
      </div>
    );
  }

  const benefits = [
    { title: t("benefitTransparent"), body: t("benefitTransparentBody") },
    { title: t("benefitNoCost"), body: t("benefitNoCostBody") },
    { title: t("benefitOffers"), body: t("benefitOffersBody") },
    { title: t("benefitDecide"), body: t("benefitDecideBody") },
  ];

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-10 md:grid-cols-2 md:px-8 md:py-14">
          <div>
            <span className="mb-3 inline-block rounded-full bg-brand-orange-soft px-3 py-1 text-xs font-bold text-brand-orange-ink">
              {t("label")}
            </span>
            <h1 className="mb-3 text-3xl font-bold text-navy md:text-4xl">{t("preRegTitle")}</h1>
            <p className="text-muted md:text-lg">{t("preRegBody")}</p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
            <Image
              src={IMG.kaaba}
              alt={tSeo("kaabaAlt")}
              fill
              className="object-cover"
              priority
              sizes="50vw"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto mb-10 grid max-w-[1440px] gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 md:px-8">
        {benefits.map((b) => (
          <div key={b.title} className="rounded-2xl border border-line bg-white p-4 shadow-sm">
            <Check className="mb-2 h-5 w-5 text-brand-orange-ink" />
            <h3 className="font-bold text-navy">{b.title}</h3>
            <p className="mt-1 text-xs text-muted">{b.body}</p>
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mx-auto max-w-[1440px] space-y-6 px-4 md:px-8">
        <section className="rounded-2xl border border-line bg-white p-5 md:p-6">
          <h2 className="font-bold text-navy">{t("travellerCount")}</h2>
          <p className="mb-4 text-sm text-muted">{t("travellerCountHint")}</p>
          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6"
            role="radiogroup"
            aria-label={t("travellerCount")}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={count === n}
                onClick={() => setCount(n)}
                className={`rounded-xl border px-3 py-4 text-center transition ${
                  count === n
                    ? "border-navy bg-navy text-white"
                    : "border-line bg-white text-navy"
                }`}
              >
                <span className="block text-lg font-bold">{n === 6 ? "6+" : n}</span>
                <span className="text-xs">{n === 1 ? t("person") : t("people")}</span>
              </button>
            ))}
          </div>
          {count === 6 && (
            <label className="mt-4 block text-sm">
              <span className="mb-1 block font-medium">{t("people")}</span>
              <input
                type="number"
                min={6}
                max={20}
                value={customCount}
                onChange={(e) => setCustomCount(Number(e.target.value) || 6)}
                className="w-32 rounded-lg border border-line px-3 py-2"
              />
            </label>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 md:p-6">
          <h2 className="font-bold text-navy">{t("travellerDetails")}</h2>
          <p className="mb-4 text-sm text-muted">{t("travellerDetailsHint")}</p>
          <div className="space-y-4">
            {persons.map((p, i) => (
              <div key={i} className="rounded-xl bg-surface p-4">
                <p className="mb-3 text-sm font-semibold text-brand-orange-ink">
                  {t("person")} {i + 1}
                </p>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                  <Input label={tUmrah("firstName")} value={p.firstName} required onChange={(v) => setPersons((prev) => prev.map((x, idx) => (idx === i ? { ...x, firstName: v } : x)))} />
                  <Input label={tUmrah("lastName")} value={p.lastName} required onChange={(v) => setPersons((prev) => prev.map((x, idx) => (idx === i ? { ...x, lastName: v } : x)))} />
                  <Input label={tUmrah("nationality")} value={p.nationality} required onChange={(v) => setPersons((prev) => prev.map((x, idx) => (idx === i ? { ...x, nationality: v } : x)))} />
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium">{t("residence")}</span>
                    <select
                      required
                      value={p.residence}
                      onChange={(e) =>
                        setPersons((prev) =>
                          prev.map((x, idx) => (idx === i ? { ...x, residence: e.target.value } : x)),
                        )
                      }
                      className="w-full rounded-lg border border-line px-3 py-2"
                    >
                      <option value="">—</option>
                      {RESIDENCE.map((r) => (
                        <option key={r.code} value={r.code}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium">{tUmrah("passportType")}</span>
                    <select
                      required
                      value={p.passportType}
                      onChange={(e) =>
                        setPersons((prev) =>
                          prev.map((x, idx) =>
                            idx === i ? { ...x, passportType: e.target.value } : x,
                          ),
                        )
                      }
                      className="w-full rounded-lg border border-line px-3 py-2"
                    >
                      <option value="">—</option>
                      <option value="normal">{tUmrah("passportNormal")}</option>
                      <option value="convention">{tUmrah("passportConvention")}</option>
                      <option value="travel">{tUmrah("passportTravel")}</option>
                      <option value="diplomatic">{tUmrah("passportDiplomatic")}</option>
                    </select>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 md:p-6">
          <h2 className="font-bold text-navy">{t("contactDetails")}</h2>
          <p className="mb-4 text-sm text-muted">{t("contactHint")}</p>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium">{tUmrah("phone")}</span>
              <div className="dir-ltr-keep flex gap-2">
                <select
                  value={dial}
                  onChange={(e) => setDial(e.target.value)}
                  className="rounded-lg border border-line px-2 py-2"
                  aria-label={tUmrah("phone")}
                >
                  {RESIDENCE.map((r) => (
                    <option key={r.code} value={r.dial}>
                      {r.dial}
                    </option>
                  ))}
                </select>
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-line px-3 py-2"
                  inputMode="tel"
                />
              </div>
            </label>
            <Input label={t("emailOptional")} value={email} onChange={setEmail} type="email" />
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 md:p-6">
          <h2 className="font-bold text-navy">{t("sourceTitle")}</h2>
          <p className="mb-4 text-sm text-muted">{t("sourceHint")}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                ["instagram", tUmrah("sourceInstagram")],
                ["facebook", tUmrah("sourceFacebook")],
                ["google", tUmrah("sourceGoogle")],
                ["chatgpt", tUmrah("sourceChatgpt")],
                ["friend", tUmrah("sourceFriend")],
                ["know", tUmrah("sourceKnow")],
                ["other", tUmrah("sourceOther")],
              ] as const
            ).map(([val, label]) => (
              <label key={val} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="hajj-source"
                  required
                  checked={source === val}
                  onChange={() => setSource(val)}
                />
                {label}
              </label>
            ))}
          </div>
        </section>

        <div className="rounded-2xl border border-line bg-sky-50 p-5">
          <div className="flex gap-3">
            <Shield className="h-6 w-6 text-brand-cta" />
            <div>
              <h3 className="font-bold text-navy">{t("privacyTitle")}</h3>
              <p className="mt-1 text-sm text-muted">{t("privacyBody")}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-navy p-6 text-white md:flex md:items-center md:justify-between md:gap-6">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">{t("preRegInfoTitle")}</h3>
            <p className="mt-2 text-sm text-white/75">{t("preRegInfoBody")}</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full shrink-0 rounded-xl bg-brand-cta px-6 py-3.5 text-sm font-semibold disabled:opacity-60 md:w-auto"
          >
            {loading ? tCommon("loading") : <><span>{t("preRegCta")}</span> <DirArrow /></>}
          </button>
        </div>
        <p className="text-center text-xs text-muted">✓ {t("ctaFree")}</p>
      </form>
    </div>
  );
}

function emptyPersons(n: number): Person[] {
  return Array.from({ length: n }, () => ({
    firstName: "",
    lastName: "",
    nationality: "",
    residence: "",
    passportType: "",
  }));
}

function Input({
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
  const keepLtr = type === "email" || type === "tel";
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border border-line px-3 py-2${keepLtr ? " dir-ltr-keep" : ""}`}
      />
    </label>
  );
}
