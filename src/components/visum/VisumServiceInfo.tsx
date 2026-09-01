"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import {
  DEFAULT_VISUM_CMS,
  pickLocalized,
  type VisumCmsCard,
  type VisumCmsConfig,
} from "@/data/visum-cms";
import {
  findVisaTypeRule,
  visaTypeRuleBullets,
  type VisumRulesConfig,
} from "@/data/visum-rules";
import { getVisumCms, VISUM_CMS_EVENT } from "@/lib/visum-cms-store";

const VISA_CARD_ICONS = {
  tourist: "/brand/icons/visum-service/tourist.png",
  umrah: "/brand/icons/visum-service/umrah.png",
} as const;

/**
 * Mobile (§9): stacked full-width cards; basic bullets always visible.
 * §38 — Bullet facts from `rules`. §39 — Only title + cards here (no meta blocks before form).
 */
function VisaInfoCard({
  card,
  rules,
}: {
  card: VisumCmsCard;
  rules: VisumRulesConfig;
}) {
  const locale = useLocale();
  const [extraOpen, setExtraOpen] = useState(true);
  const isTourist = card.id === "tourist";
  const typeRule = findVisaTypeRule(rules, card.id);
  const title =
    pickLocalized(card.title, locale) ||
    (typeRule ? pickLocalized(typeRule.name, locale) : "");
  const footer = pickLocalized(card.footer, locale);

  const ruleBullets =
    card.showRulesOnCard !== false && typeRule
      ? visaTypeRuleBullets(typeRule, locale)
      : [];
  const legacyPoints = card.points.map((p) => pickLocalized(p, locale)).filter(Boolean);
  const extraPoints = (card.extraPoints ?? [])
    .map((p) => pickLocalized(p, locale))
    .filter(Boolean);
  const points =
    ruleBullets.length > 0
      ? [...ruleBullets, ...extraPoints]
      : [...legacyPoints, ...extraPoints];

  const theme = isTourist
    ? {
        mobileHeader: "bg-[#e8f1fa]",
        desktopShell: "border-[#c5d8f0] bg-white",
        title: "text-[#1e5a9c]",
        check: "text-[#1e5a9c]",
        footer: "bg-[#e4eef8] text-[#1e5a9c]",
        iconSrc: VISA_CARD_ICONS.tourist,
      }
    : {
        mobileHeader: "bg-[#e8f6ee]",
        desktopShell: "border-[#c5e6d4] bg-white",
        title: "text-[#1f8a4c]",
        check: "text-[#1f8a4c]",
        footer: "bg-[#e0f2e8] text-[#1f8a4c]",
        iconSrc: VISA_CARD_ICONS.umrah,
      };

  return (
    <article
      className={`w-full overflow-hidden rounded-2xl border shadow-[0_8px_28px_rgba(11,44,74,0.07)] ${theme.desktopShell}`}
    >
      <div
        className={`flex w-full items-center gap-3 px-4 py-3.5 md:bg-transparent md:px-5 md:pt-5 md:pb-3 ${theme.mobileHeader} md:bg-transparent`}
      >
        <Image
          src={theme.iconSrc}
          alt=""
          width={44}
          height={44}
          className="h-10 w-10 shrink-0 object-contain md:h-11 md:w-11"
        />
        <span className={`flex-1 text-[16px] font-bold md:text-[18px] ${theme.title}`}>
          {title}
        </span>
        <button
          type="button"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-brand-cta transition hover:bg-black/5 md:hidden"
          aria-expanded={extraOpen}
          aria-label={extraOpen ? "Weniger anzeigen" : "Mehr anzeigen"}
          onClick={() => setExtraOpen((v) => !v)}
        >
          <ChevronDown
            className={`h-5 w-5 transition ${extraOpen ? "rotate-180" : ""}`}
            strokeWidth={2}
          />
        </button>
      </div>

      <ul
        className={`space-y-2.5 px-4 py-4 md:block md:px-5 md:pb-4 md:pt-0 ${extraOpen ? "block" : "hidden md:block"}`}
      >
        {points.map((text) => (
          <li key={text} className="flex items-start gap-2 text-[13px] leading-snug text-navy/85">
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${theme.check}`} strokeWidth={2.5} />
            <span>{text}</span>
          </li>
        ))}
      </ul>

      {footer ? (
        <p
          className={`px-4 py-3.5 text-[12px] font-semibold leading-snug md:px-5 ${theme.footer} ${
            extraOpen ? "block" : "hidden md:block"
          }`}
        >
          {footer}
        </p>
      ) : null}
    </article>
  );
}

export function VisumServiceInfo({
  embedded = false,
  initialCms,
}: {
  embedded?: boolean;
  initialCms?: VisumCmsConfig;
}) {
  const locale = useLocale();
  const [cms, setCms] = useState<VisumCmsConfig>(initialCms ?? DEFAULT_VISUM_CMS);

  useEffect(() => {
    const applyLocal = () => {
      if (typeof window !== "undefined" && window.localStorage.getItem("mobarak.visumCms")) {
        setCms(getVisumCms());
      }
    };
    applyLocal();

    let cancelled = false;
    fetch("/api/visum-cms", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: VisumCmsConfig | null) => {
        if (cancelled || !data) return;
        if (typeof window !== "undefined" && window.localStorage.getItem("mobarak.visumCms")) {
          setCms(getVisumCms());
        } else {
          setCms(data);
        }
      })
      .catch(() => {});

    window.addEventListener(VISUM_CMS_EVENT, applyLocal);
    window.addEventListener("storage", applyLocal);
    return () => {
      cancelled = true;
      window.removeEventListener(VISUM_CMS_EVENT, applyLocal);
      window.removeEventListener("storage", applyLocal);
    };
  }, []);

  const sectionTitle = pickLocalized(cms.sectionTitle, locale);
  const rules = cms.rules ?? DEFAULT_VISUM_CMS.rules;
  const cards = [cms.tourist, cms.umrah].filter((c) => {
    if (!c.enabled) return false;
    const type = findVisaTypeRule(rules, c.id);
    return type ? type.enabled : true;
  });

  return (
    <section
      className={
        embedded
          ? "bg-white px-4 py-7 sm:px-6 md:px-8 md:py-10"
          : "bg-white px-3 py-9 sm:px-6 md:py-12 lg:px-8"
      }
    >
      <div className={embedded ? "mx-auto w-full" : "mx-auto max-w-page"}>
        <div className="text-center">
          <h2 className="visum-display-font text-[1.45rem] font-bold text-navy md:text-[1.85rem]">
            {sectionTitle}
          </h2>
          <span className="mx-auto mt-2 block h-[3px] w-11 rounded-full bg-brand-orange-cta" />
        </div>

        <div className="mx-auto mt-6 grid w-full grid-cols-1 gap-3 md:mt-9 md:grid-cols-2 md:gap-5">
          {cards.map((card) => (
            <VisaInfoCard key={card.id} card={card} rules={rules} />
          ))}
        </div>
      </div>
    </section>
  );
}
