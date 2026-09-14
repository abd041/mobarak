import type { Locale } from "@/i18n/routing";

export type LandingTrustItem = {
  id: string;
  title: string;
  body: string;
  icon: "experience" | "costs" | "nusuk" | "religious" | "languages";
};

export type LandingServiceColumn = {
  id: string;
  title: string;
  items: string[];
};

export type LandingNusukStep = {
  num: string;
  label: string;
};

export type LandingJourneyPhase = {
  id: string;
  label: string;
};

export type LandingJourneyCard = {
  title: string;
  items: string[];
  imageSrc: string;
};

export type LandingJourneyChapter = {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  intro?: string;
  cards?: LandingJourneyCard[];
  quote?: string;
  arabicBlock?: { arabic: string; translit: string; translation: string };
  ritualSteps?: { title: string; body: string }[];
  dayCards?: { date: string; title: string; items: string[]; highlight?: boolean; imageSrc?: string }[];
  closingHandwritten?: string;
  closingImageSrc?: string;
};

export type HajjLandingV2 = {
  hero: {
    label: string;
    title: string;
    subtitle: string;
    body: string;
    cta: string;
    secondaryCta: string;
    handwritten: string;
    quote: string;
    imageSrc: string;
  };
  trust: LandingTrustItem[];
  mission: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    boldLine: string;
    afterBold: string;
    quote: string;
    imageSrc: string;
  };
  services: {
    columns: LandingServiceColumn[];
  };
  nusuk: {
    eyebrow: string;
    title: string;
    body: string;
    moreLabel: string;
    guideCta: string;
    steps: LandingNusukStep[];
  };
  journeyIntro: {
    eyebrow: string;
    title: string;
    body: string;
    handwritten: string;
  };
  journeyPhases: LandingJourneyPhase[];
  chapters: LandingJourneyChapter[];
  finalCta: {
    label: string;
    title: string;
    body: string;
    cta: string;
    ctaFree: string;
    note: string;
    imageSrc: string;
  };
};

const DE: HajjLandingV2 = {
  hero: {
    label: "HAJJ 2027 – 1448 AH",
    title: "Eine Reise, die bleibt.",
    subtitle: "Mit Vertrauen. Mit Erfahrung. Mit dir.",
    body: "Von der Nusuk-Registrierung über Medina und Makkah bis zu den Hajj-Tagen in Mina, Arafat und Muzdalifah – wir begleiten dich persönlich durch jeden Schritt.",
    cta: "Für Hajj 2027 vormerken",
    secondaryCta: "So funktioniert es",
    handwritten: "Mehr als eine Reise.\nEine lebensverändernde Erfahrung.",
    quote: "„Und vollende die Pilgerfahrt und die Umrah für Allah.“ (Sure Al-Baqara, 2:196)",
    imageSrc: "/brand/hajj-2027-hero.png",
  },
  trust: [
    {
      id: "t1",
      icon: "experience",
      title: "Mehr als 30 Jahre Erfahrung",
      body: "Seit über drei Jahrzehnten begleiten wir Pilger.",
    },
    {
      id: "t2",
      icon: "costs",
      title: "Keine zusätzlichen Betreuungskosten",
      body: "Du zahlst nur über Nusuk. Unsere Betreuung ist inklusive.",
    },
    {
      id: "t3",
      icon: "nusuk",
      title: "Persönliche Nusuk-Begleitung",
      body: "Wir unterstützen dich bei jedem Schritt.",
    },
    {
      id: "t4",
      icon: "religious",
      title: "Religiöse Begleitung",
      body: "Erfahrene Imame und islamisch fundierte Betreuung.",
    },
    {
      id: "t5",
      icon: "languages",
      title: "Mehrsprachiges Team",
      body: "Deutsch, Arabisch, Bosnisch, Türkisch.",
    },
  ],
  mission: {
    eyebrow: "UNSERE MISSION",
    title: "Hajj ist mehr als eine Buchung",
    paragraphs: [
      "Eine Hajj-Reise besteht nicht nur aus Flug und Hotel. Bereits Monate vor der Abreise müssen Registrierung, Dokumente, Verifizierung, Paketauswahl und viele weitere Schritte korrekt durchgeführt werden.",
      "Während der Hajj-Tage folgen zahlreiche zeitlich und organisatorisch genau abgestimmte Abläufe zwischen Makkah, Mina, Arafat und Muzdalifah.",
    ],
    boldLine: "Genau hier begleiten wir dich.",
    afterBold: "Von deiner ersten Registrierung bis zur Rückreise – organisatorisch und religiös.",
    quote:
      "„Unser Ziel ist es, dass du dich voll auf deine Ibadah konzentrieren kannst – wir kümmern uns um den Rest.“",
    imageSrc: "/brand/hajj-mission-makkah.png",
  },
  services: {
    columns: [
      {
        id: "s1",
        title: "Vor der Buchung",
        items: [
          "Nusuk-Registrierung begleiten",
          "Dokumentenprüfung",
          "Verifizierung unterstützen",
          "Pakete erklären & auswählen",
          "Alle deine Fragen beantworten",
        ],
      },
      {
        id: "s2",
        title: "Vor der Reise",
        items: [
          "Informationsveranstaltungen",
          "Religiöse Vorbereitung",
          "Packliste & Tipps",
          "Reiseinformationen",
          "Gruppeneinteilung",
        ],
      },
      {
        id: "s3",
        title: "Während der Reise",
        items: [
          "Flughafenbetreuung",
          "Transfers & Hotel Check-in",
          "Gruppenkoordination",
          "Laufende Informationen",
          "Ansprechpartner vor Ort",
        ],
      },
      {
        id: "s4",
        title: "Während der Hajj-Tage",
        items: [
          "Religiöse Leitung durch Imame",
          "Mina – Arafat – Muzdalifah",
          "Jamarat & Tawaf",
          "Organisation aller Bewegungen",
          "Unterstützung in jeder Situation",
        ],
      },
    ],
  },
  nusuk: {
    eyebrow: "NUSUK HAJJ",
    title: "Die Hajj-Registrierung über Nusuk – Schritt für Schritt",
    body: "Die offizielle Hajj-Buchung erfolgt über die staatliche Plattform Nusuk. Wir begleiten dich durch den gesamten Prozess.",
    moreLabel: "Mehr über Nusuk",
    guideCta: "Zur detaillierten Nusuk-Anleitung",
    steps: [
      { num: "01", label: "Konto erstellen" },
      { num: "02", label: "Dokumente hochladen" },
      { num: "03", label: "Antrag ausfüllen" },
      { num: "04", label: "Verifizierung durch Nusuk" },
      { num: "05", label: "Paketkategorie auswählen" },
      { num: "06", label: "eWallet aufladen" },
      { num: "07", label: "Service Provider wählen" },
      { num: "08", label: "Hajj-Paket auswählen" },
      { num: "09", label: "Paket buchen" },
      { num: "10", label: "Reiseplan prüfen" },
    ],
  },
  journeyIntro: {
    eyebrow: "VON DER VORMERKUNG BIS ZUR RÜCKREISE",
    title: "Deine Hajj-Reise – Schritt für Schritt",
    body: "Eine Hajj-Reise besteht aus vielen wichtigen Schritten. Wir begleiten dich – organisatorisch und religiös – durch den gesamten Ablauf: von der Vorbereitung über Medina und Makkah bis zu den Hajj-Tagen und der Rückreise.",
    handwritten: "Mit Wissen. Mit Erfahrung.\nMit aufrichtigem Herzen.",
  },
  journeyPhases: [
    { id: "p1", label: "Vormerkung & Information" },
    { id: "p2", label: "Nusuk Registrierung" },
    { id: "p3", label: "Medina" },
    { id: "p4", label: "Makkah & Umrah" },
    { id: "p5", label: "Hajj-Tage (Mina, Arafat, Muzdalifah)" },
    { id: "p6", label: "Rückkehr nach Makkah" },
    { id: "p7", label: "Rückreise" },
  ],
  chapters: [
    {
      id: "medina",
      num: "1",
      title: "Medina",
      subtitle: "Die Stadt des Propheten ﷺ – ein gesegneter Anfang",
      intro:
        "Wir beginnen unsere Reise in der Regel mit Medina. Hier hast du Zeit für Gebete, Ziyarat und geistige Vorbereitung – begleitet von unserem Team.",
      quote:
        "„Wer mich in Medina besucht, den werde ich am Tag der Auferstehung seine Fürsprache zuteil werden lassen.“",
      cards: [
        {
          title: "Abflug & Reise",
          imageSrc: "/brand/flights-panel-plane.png",
          items: [
            "Gemeinsamer Treffpunkt",
            "Unterstützung beim Check-in",
            "Gepäck & Reiseunterlagen",
            "Ansprechpartner vor Ort",
          ],
        },
        {
          title: "Ankunft in Medina",
          imageSrc: "/brand/booking-cta-medina.png",
          items: ["Einreise & Gepäck", "Gemeinsamer Transfer", "Hotel Check-in", "Erste Informationen"],
        },
        {
          title: "Aufenthalt in Medina",
          imageSrc: "/brand/why-roza-bg.png",
          items: [
            "Gebete in der Prophetenmoschee",
            "Rawdah-Informationen",
            "Religiöse Vorträge",
            "Gemeinsame Treffen",
          ],
        },
        {
          title: "Ziyarat in Medina",
          imageSrc: "/brand/newsletter-quran.jpg",
          items: ["Masjid Quba", "Uhud", "Weitere historische Orte", "Erklärungen durch unsere Imame"],
        },
      ],
    },
    {
      id: "to-makkah",
      num: "2",
      title: "Von Medina nach Makkah",
      subtitle: "Gemeinsam in den Ihram – auf dem Weg zur ersten Umrah",
      intro:
        "Nach unserem Aufenthalt in Medina reisen wir gemeinsam nach Makkah. Am Miqat treten wir in den Ihram – auf dem Weg zur ersten gemeinsamen Umrah.",
      arabicBlock: {
        arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْك",
        translit: "Labbayka Allahumma Labbayk",
        translation:
          "Hier bin ich, o Allah, hier bin ich.\nHier bin ich, Du hast keinen Teilhaber, hier bin ich.",
      },
      cards: [
        {
          title: "Vorbereitung auf den Ihram",
          imageSrc: "/brand/hajj-journey/makkah-ihram.png",
          items: [
            "Erklärung der Regeln",
            "Niyyah und Talbiyah",
            "Was ist erlaubt / nicht erlaubt",
            "Praktische Tipps",
          ],
        },
        {
          title: "Miqat",
          imageSrc: "/brand/hajj-journey/makkah-miqat-clear.png",
          items: ["Gemeinsamer Stopp am Miqat", "Ihram anlegen", "Niyyah fassen", "Talbiyah sprechen"],
        },
        {
          title: "Weiterreise nach Makkah",
          imageSrc: "/brand/hajj-journey/makkah-travel.png",
          items: [
            "Gemeinsame Fahrt",
            "Informationen zur Ankunft",
            "Organisation vor Ort",
            "Begleitung durch unser Team",
          ],
        },
        {
          title: "Ankunft & Check-in",
          imageSrc: "/brand/hajj-journey/makkah-checkin.png",
          items: [
            "Einreise & Gepäck / Ankunft",
            "Hotel Check-in",
            "Zimmerverteilung",
            "Wichtige Informationen",
          ],
        },
      ],
    },
    {
      id: "umrah",
      num: "3",
      title: "Die erste gemeinsame Umrah",
      subtitle: "Ein besonderer Moment an der Kaaba",
      intro:
        "Nach der Ankunft in Makkah führen wir gemeinsam die Umrah durch. Unsere religiösen Begleiter erklären jeden Schritt und unterstützen die Gruppe.",
      ritualSteps: [
        { title: "Tawaf", body: "Sieben Runden um die Kaaba" },
        { title: "Maqam Ibrahim", body: "Gebet am Maqam Ibrahim" },
        { title: "Zamzam", body: "Zamzam trinken" },
        { title: "Sa'i", body: "Sieben Wege zwischen Safa und Marwah" },
        { title: "Halq / Taqsir", body: "Haare rasieren oder kürzen" },
        { title: "Umrah abgeschlossen", body: "Damit endet der Ihram-Zustand." },
      ],
    },
    {
      id: "hajj-days",
      num: "4",
      title: "Die Tage des Hajj",
      subtitle: "Von Mina bis Arafat – wir gehen den Weg gemeinsam",
      intro:
        "Die Hajj-Tage sind der Höhepunkt der Reise. Wir begleiten dich bei allen Bewegungen, informieren über die Abläufe und stehen dir mit unseren erfahrenen Imamen zur Seite.",
      dayCards: [
        {
          date: "08. Dhul-Hijjah",
          title: "Mina – Yawm at-Tarwiyah",
          imageSrc: "/brand/hajj-journey/day-01.png",
          items: [
            "Abfahrt nach Mina",
            "Unterbringung im Camp",
            "Vorbereitung auf Arafat",
            "Religiöse Begleitung",
          ],
        },
        {
          date: "09. Dhul-Hijjah",
          title: "Arafat – der Höhepunkt",
          imageSrc: "/brand/hajj-journey/day-02.png",
          highlight: true,
          items: [
            "Gemeinsame Abfahrt",
            "Aufenthalt in Arafat",
            "Dua, Dhikr und Ibadah",
            "Begleitung durch unsere Imame",
          ],
        },
        {
          date: "Nacht 9./10. Dhul-Hijjah",
          title: "Muzdalifah",
          imageSrc: "/brand/hajj-journey/day-03.png",
          items: [
            "Gemeinsame Weiterreise",
            "Maghrib & Isha",
            "Aufenthalt und Übernachtung entsprechend dem Ablauf",
            "Vorbereitung auf Jamarat",
          ],
        },
        {
          date: "10. Dhul-Hijjah",
          title: "Jamarat & Eid al-Adha",
          imageSrc: "/brand/hajj-journey/day-04.png",
          items: [
            "Ramy al-Jamarat",
            "Hady entsprechend der Hajj-Art",
            "Halq / Taqsir",
            "Tawaf al-Ifadah und ggf. Sa'i",
          ],
        },
        {
          date: "11.–13. Dhul-Hijjah",
          title: "Tage des Tashriq",
          imageSrc: "/brand/hajj-journey/day-05.png",
          items: [
            "Jamarat an den vorgesehenen Tagen",
            "Rückkehr nach Mina",
            "Organisation durch unser Team",
            "Laufende Informationen",
          ],
        },
      ],
    },
    {
      id: "return",
      num: "5",
      title: "Rückkehr nach Makkah & Abschluss",
      subtitle: "Zeit für Ibadah, Erholung und den Abschied",
      intro:
        "Nach den Hajj-Tagen kehren wir nach Makkah zurück. Du hast Zeit für weitere Gebete im Masjid al-Haram, bis schließlich der Abschluss-Tawaf und die Rückreise anstehen.",
      closingHandwritten: "Eine Reise geht zu Ende.\nIhre Wirkung soll bleiben.",
      closingImageSrc: "/brand/hajj-journey/closing-makkah.png",
      cards: [
        {
          title: "Rückkehr nach Makkah",
          imageSrc: "/brand/hajj-journey/return-makkah.png",
          items: ["Zeit für Ibadah", "Gemeinsame Treffen", "Religiöse Betreuung", "Erholung"],
        },
        {
          title: "Tawaf al-Wada'",
          imageSrc: "/brand/hajj-journey/return-wada.png",
          items: ["Abschieds-Tawaf", "Vorbereitung auf die Abreise", "Begleitung durch unser Team"],
        },
        {
          title: "Rückreise",
          imageSrc: "/brand/hajj-journey/return-flight.png",
          items: ["Hotel Check-out", "Transfer zum Flughafen", "Check-in", "Rückflug"],
        },
      ],
    },
  ],
  finalCta: {
    label: "HAJJ 2027 – 1448 AH",
    title: "Möchtest du diesen Weg mit uns gehen?",
    body: "Mehr als 30 Jahre Erfahrung, persönliche religiöse und organisatorische Begleitung und keine zusätzlichen Betreuungskosten außerhalb der offiziellen Nusuk-Buchung.",
    cta: "Für Hajj 2027 vormerken",
    ctaFree: "Kostenlos & unverbindlich",
    note: "Die offizielle Hajj-Buchung erfolgt über Nusuk Hajj.",
    imageSrc: "/brand/hajj-journey/final-cta.png",
  },
};

export function getHajjLandingV2(_locale: Locale): HajjLandingV2 {
  // Reference DE copy is the approved design source; other locales use DE until localized.
  return DE;
}
