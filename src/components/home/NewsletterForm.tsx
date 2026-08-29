"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";

export function NewsletterForm() {
  const t = useTranslations("home");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    startTransition(async () => {
      try {
        const res = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, locale }),
        });
        if (!res.ok) {
          setStatus("error");
          return;
        }
        setStatus("success");
        setEmail("");
      } catch {
        setStatus("error");
      }
    });
  }

  return (
    <div className="w-full max-w-none shrink-0 md:max-w-[380px] lg:max-w-[400px]">
      <form
        className="flex w-full flex-col items-stretch gap-2.5 sm:flex-row"
        onSubmit={onSubmit}
        noValidate={false}
      >
        <label className="sr-only" htmlFor="newsletter-email">
          {t("newsletterPlaceholder")}
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder={t("newsletterPlaceholder")}
          disabled={pending}
          className="dir-ltr-keep min-h-12 min-w-0 flex-1 rounded-[8px] border border-[#D9DEE5] bg-white px-3.5 py-3 text-[14px] text-[#1A2332] placeholder:text-[#6B7A89] focus:border-brand-orange-cta disabled:opacity-60 md:px-4 md:py-3"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-[8px] bg-brand-orange-cta px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#a05e0e] disabled:opacity-60 sm:px-6"
        >
          {pending ? t("newsletterSubmitting") : t("newsletterCta")}
        </button>
      </form>
      {status === "success" && (
        <p className="mt-2 text-[12px] font-medium text-[#1F8A4C]" role="status">
          {t("newsletterSuccess")}
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-[12px] font-medium text-red-600" role="alert">
          {t("newsletterError")}
        </p>
      )}
    </div>
  );
}
