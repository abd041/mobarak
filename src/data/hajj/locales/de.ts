import type { HajjPageContentCore } from "@/data/hajj-content-defaults";
import { hajjFaqs, hajjJourney, hajjProcess } from "@/data/hajj";
import { HAJJ_JOURNEY_LOGISTICS_NOTE } from "@/data/hajj-disclaimers";
import { attachJourneyImages, experienceSlides, withCampaignYear } from "@/data/hajj/locales/shared";

export function buildDeHajjContent(year = 2027): HajjPageContentCore {
  const content: HajjPageContentCore = {
    hero: {
      label: "HAJJ 2027",
      title: "Deine Hajj-Reise.",
      titleLine2: "Von Anfang an begleitet.",
      body: "Seit über 30 Jahren begleiten wir Pilger auf ihrer wichtigsten Reise – von der Vorbereitung bis zur Betreuung während des Hajj in Saudi-Arabien.",
      imageSrc: "/brand/hero-bg.png",
      benefits: [
        "Unterstützung bei der Registrierung",
        "Passende Hajj-Programme",
        "Persönliche Reiseleitung",
        "Religiöse Begleitung",
        "Betreuung in Saudi-Arabien",
        "Gemeinsam als Gruppe",
      ],
      cta: "Für Hajj 2027 vormerken",
      ctaFree: "Kostenlos & unverbindlich",
      ctaNoPay: "Keine Zahlung erforderlich",
    },
    status: {
      title: "Hajj 2027 – aktueller Stand",
      body: "Die finalen Programme, Preise und Termine für Hajj 2027 stehen derzeit noch nicht fest. Sobald wichtige Informationen zur Registrierung, zu verfügbaren Programmen und zur Buchungsphase veröffentlicht werden, informieren wir unsere vorgemerkten Pilger.",
      cta: "Jetzt kostenlos vormerken",
      note: "Unverbindlich & kostenlos",
    },
    why: {
      eyebrow: "WARUM MOBARAK?",
      title: "Hajj ist mehr als eine Reise.",
      subtitle:
        "Gerade bei einer einmaligen Reise wie dem Hajj ist persönliche Erfahrung entscheidend.",
      cards: [
        {
          id: "why-1",
          icon: "experience",
          title: "30+ Jahre Erfahrung",
          body: "Seit über drei Jahrzehnten begleiten wir Pilger beim Hajj und kennen die organisatorischen und praktischen Herausforderungen dieser besonderen Reise.",
        },
        {
          id: "why-2",
          icon: "support",
          title: "Persönliche Unterstützung",
          body: "Wir begleiten dich bereits vor der Reise und unterstützen dich bei den notwendigen Schritten der Vorbereitung.",
        },
        {
          id: "why-3",
          icon: "religious",
          title: "Religiöse Begleitung",
          body: "Unsere erfahrenen Reiseleiter und religiösen Begleiter bereiten die Gruppe auf die Hajj-Riten vor und begleiten sie während der Reise.",
        },
        {
          id: "why-4",
          icon: "group",
          title: "Gemeinsam als Gruppe",
          body: "Bei den entscheidenden Stationen des Hajj organisieren wir unsere Pilger als Gruppe – entsprechend dem finalen Hajj-Programm und den offiziellen Vorgaben.",
        },
        {
          id: "why-5",
          icon: "onsite",
          title: "Betreuung vor Ort",
          body: "Wir sind während des Hajj in Saudi-Arabien für dich da und unterstützen unsere Pilger in allen wichtigen Situationen.",
        },
        {
          id: "why-6",
          icon: "languages",
          title: "Mehrsprachige Betreuung",
          body: "Deutsch · Arabisch · Bosnisch · Türkisch – je nach Gruppe.",
        },
      ],
    },
    process: {
      title: "Von der Vormerkung bis zur Hajj-Reise",
      steps: hajjProcess.map((step) => ({ ...step })),
    },
    journey: {
      eyebrow: "DEINE HAJJ-REISE MIT UNS",
      title: "Von der Ankunft bis zum Abschieds-Tawaf",
      logisticsNote: HAJJ_JOURNEY_LOGISTICS_NOTE.de,
      steps: attachJourneyImages(hajjJourney.map((step) => ({ ...step }))),
    },
    seo: {
      title: "Hajj 2027 mit Mobarak – persönlich begleitet von Anfang bis Ende",
      blocks: [],
    },
    experience: {
      title: "Hajj {year} mit Mobarak – persönlich begleitet von Anfang bis Ende",
      stat: "30+",
      heading: "JAHRE ERFAHRUNG MIT HAJJ & UMRAH",
      body: "Tausende Pilger haben uns auf ihrer wichtigsten Reise ihr Vertrauen geschenkt.",
      slides: experienceSlides(["1990er Jahre", "2000er Jahre", "2010er Jahre", "Heute"]),
    },
    finalCta: {
      title: "Der Hajj beginnt nicht erst in Makkah.",
      body: "Er beginnt mit der richtigen Vorbereitung. Wir begleiten dich auf diesem Weg.",
      imageSrc: "/brand/offer-hero/hero-bg-kaaba.png",
      features: [
        "30+ Jahre Erfahrung",
        "Persönliche Betreuung",
        "Religiöse Begleitung",
        "Gemeinsam als Gruppe",
      ],
      cta: "Für Hajj 2027 vormerken",
      ctaFree: "Kostenlos & unverbindlich",
    },
    faqs: hajjFaqs.map((faq, index) => ({
      id: `faq-${index + 1}`,
      question: faq.q,
      answer: faq.a,
    })),
  };
  return withCampaignYear(content, year);
}
