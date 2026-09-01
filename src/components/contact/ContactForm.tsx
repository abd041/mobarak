"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const SUBJECTS = ["general", "umrah", "hajj", "visa", "other"] as const;

const inputClass =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] text-navy outline-none transition placeholder:text-muted focus:border-brand-cta focus:ring-2 focus:ring-brand-cta/20";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function ContactForm() {
  const t = useTranslations("contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number] | "">("");
  const [message, setMessage] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function isValid() {
    return (
      name.trim().length > 1 &&
      isValidEmail(email) &&
      Boolean(subject) &&
      message.trim().length > 5
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

  function reset() {
    setName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
    setAttempted(false);
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#dce6f0] bg-white px-5 py-10 text-center shadow-[0_12px_40px_rgba(11,44,74,0.06)] sm:px-8">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-green" strokeWidth={1.75} />
        <h3 className="mt-4 text-[1.35rem] font-bold text-navy">{t("successTitle")}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-muted sm:text-[15px]">{t("successBody")}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-navy px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-navy-deep"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-[#dce6f0] bg-white p-5 shadow-[0_12px_40px_rgba(11,44,74,0.06)] sm:p-7 md:p-8"
    >
      <div className="mb-6">
        <h2 className="text-[1.25rem] font-bold tracking-[-0.015em] text-navy sm:text-[1.4rem]">
          {t("formTitle")}
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted sm:text-[14px]">{t("formSubtitle")}</p>
      </div>

      <div className="space-y-4">
        <Field
          label={t("name")}
          required
          error={attempted && name.trim().length < 2 ? t("validationRequired") : undefined}
        >
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder={t("namePlaceholder")}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label={t("email")}
            required
            error={
              attempted && !isValidEmail(email)
                ? email.trim()
                  ? t("validationEmail")
                  : t("validationRequired")
                : undefined
            }
          >
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
            />
          </Field>

          <Field label={t("phone")}>
            <input
              type="tel"
              className={cn(inputClass, "dir-ltr-keep")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              placeholder={t("phonePlaceholder")}
            />
          </Field>
        </div>

        <Field
          label={t("subject")}
          required
          error={attempted && !subject ? t("validationRequired") : undefined}
        >
          <select
            className={cn(inputClass, "cursor-pointer appearance-none")}
            value={subject}
            onChange={(e) => setSubject(e.target.value as (typeof SUBJECTS)[number] | "")}
          >
            <option value="">{t("subjectPlaceholder")}</option>
            {SUBJECTS.map((key) => (
              <option key={key} value={key}>
                {t(`subject_${key}`)}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label={t("message")}
          required
          error={attempted && message.trim().length < 6 ? t("validationRequired") : undefined}
        >
          <textarea
            className={cn(inputClass, "min-h-[8.5rem] resize-y")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("messagePlaceholder")}
            rows={5}
          />
        </Field>
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-muted">
        {t("privacyNote")}{" "}
        <Link href="/datenschutz" className="font-semibold text-brand-cta underline-offset-2 hover:underline">
          {t("privacyLink")}
        </Link>
      </p>

      {attempted && !isValid() ? (
        <p className="mt-3 text-[13px] font-medium text-brand-red">{t("validationSummary")}</p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-5 py-3.5 text-[15px] font-bold text-white transition hover:bg-navy-deep disabled:opacity-60 sm:w-auto sm:min-w-[12rem]"
      >
        {loading ? t("sending") : t("submit")}
        <Send className="h-4 w-4" strokeWidth={2.25} />
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[12px] font-semibold text-navy sm:text-[13px]">
        {label}
        {required ? <span className="text-brand-red"> *</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1 block text-[12px] font-medium text-brand-red">{error}</span> : null}
    </label>
  );
}
