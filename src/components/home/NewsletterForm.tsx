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
    <div className="w-full shrink-0 md:max-w-[420px] lg:max-w-[440px]">
      <form
        className="flex w-full flex-col items-stretch gap-[10px] sm:flex-row sm:items-center"
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
          className="dir-ltr-keep min-h-[48px] min-w-0 flex-1 rounded-[10px] border border-[#D5DBE3] bg-white px-[14px] py-[12px] text-[14px] text-[#0A1B3D] placeholder:text-[#8A97A6] shadow-[inset_0_1px_2px_rgba(9,30,66,0.03)] transition focus:border-[#E8913A] focus:outline-none focus:ring-2 focus:ring-[#E8913A]/25 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-[10px] bg-[#E8913A] px-[22px] py-[12px] text-[14px] font-bold text-white shadow-[0_2px_8px_rgba(232,145,58,0.35)] transition hover:bg-[#d07d2a] disabled:opacity-60 sm:px-[26px]"
        >
          {pending ? t("newsletterSubmitting") : t("newsletterCta")}
        </button>
      </form>
      {status === "success" && (
        <p className="mt-[8px] text-[12px] font-medium text-[#1F8A4C]" role="status">
          {t("newsletterSuccess")}
        </p>
      )}
      {status === "error" && (
        <p className="mt-[8px] text-[12px] font-medium text-red-600" role="alert">
          {t("newsletterError")}
        </p>
      )}
    </div>
  );
}
