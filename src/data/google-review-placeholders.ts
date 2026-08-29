import type { ReviewLocale } from "@/lib/review-locales";

export type PlaceholderReviewSeed = {
  id: string;
  name: string;
  rating: number;
  avatar?: string;
  sourceLocale: ReviewLocale;
  originalText: string;
  originalDateRelative: string;
};

export const PLACEHOLDER_REVIEW_SEEDS: PlaceholderReviewSeed[] = [
  {
    id: "placeholder-1",
    name: "Ahmad K.",
    rating: 5,
    sourceLocale: "de",
    originalDateRelative: "vor 1 Woche",
    originalText:
      "Alhamdulillah eine sehr gut organisierte Reise. Das Team war immer erreichbar und hat uns während des Hajj hervorragend betreut. Würde jedem empfehlen, mit Mobarak zu reisen.",
  },
  {
    id: "placeholder-2",
    name: "Safija B.",
    rating: 5,
    sourceLocale: "de",
    originalDateRelative: "vor 2 Wochen",
    originalText:
      "Unsere erste Hajj-Reise war ein unvergessliches Erlebnis. Von der Vorbereitung bis zur Betreuung in Saudi-Arabien hat alles perfekt funktioniert. Vielen Dank an das gesamte Mobarak-Team!",
  },
  {
    id: "placeholder-3",
    name: "Muhammed H.",
    rating: 5,
    sourceLocale: "de",
    originalDateRelative: "vor 1 Monat",
    originalText:
      "Von Anfang bis Ende wurden wir bestens unterstützt. Die Reiseleiter und religiösen Begleiter sind sehr erfahren und kümmern sich wirklich um jeden Pilger.",
  },
];

type LocalizedCopy = { text: string; dateRelative: string };

export const PLACEHOLDER_LOCALIZATIONS: Record<
  string,
  Partial<Record<ReviewLocale, LocalizedCopy>>
> = {
  "placeholder-1": {
    de: {
      text: PLACEHOLDER_REVIEW_SEEDS[0]!.originalText,
      dateRelative: "vor 1 Woche",
    },
    en: {
      text: "Alhamdulillah, a very well organised trip. The team was always reachable and supported us excellently during Hajj. I would recommend travelling with Mobarak to everyone.",
      dateRelative: "1 week ago",
    },
    ar: {
      text: "الحمد لله، رحلة منظمة بشكل ممتاز. كان الفريق متاحاً دائماً وقد اعتنى بنا بشكل رائع أثناء الحج. أنصح الجميع بالسفر مع مبارك.",
      dateRelative: "منذ أسبوع",
    },
    tr: {
      text: "Elhamdülillah, çok iyi organize edilmiş bir seyahatti. Ekip her zaman ulaşılabilir durumdaydı ve Hac sırasında bize mükemmel şekilde destek oldu. Herkese Mobarak ile seyahat etmesini tavsiye ederim.",
      dateRelative: "1 hafta önce",
    },
    bs: {
      text: "Alhamdulillah, vrlo dobro organizovano putovanje. Tim je uvijek bio dostupan i odlično nas je podržavao tokom Hadža. Svima bih preporučio putovanje sa Mobarakom.",
      dateRelative: "prije 1 sedmice",
    },
  },
  "placeholder-2": {
    de: {
      text: PLACEHOLDER_REVIEW_SEEDS[1]!.originalText,
      dateRelative: "vor 2 Wochen",
    },
    en: {
      text: "Our first Hajj journey was an unforgettable experience. From preparation to on-site support in Saudi Arabia, everything worked perfectly. Thank you to the entire Mobarak team!",
      dateRelative: "2 weeks ago",
    },
    ar: {
      text: "كانت أول رحلة حج لنا تجربة لا تُنسى. من التحضير إلى الرعاية في السعودية، سار كل شيء على أكمل وجه. شكراً لفريق مبارك بأكمله!",
      dateRelative: "منذ أسبوعين",
    },
    tr: {
      text: "İlk Hac yolculuğumuz unutulmaz bir deneyimdi. Hazırlıktan Suudi Arabistan'daki desteğe kadar her şey mükemmel işledi. Tüm Mobarak ekibine teşekkürler!",
      dateRelative: "2 hafta önce",
    },
    bs: {
      text: "Naše prvo Hadž putovanje bilo je nezaboravno iskustvo. Od pripreme do podrške u Saudijskoj Arabiji sve je savršeno funkcionisalo. Hvala cijelom Mobarak timu!",
      dateRelative: "prije 2 sedmice",
    },
  },
  "placeholder-3": {
    de: {
      text: PLACEHOLDER_REVIEW_SEEDS[2]!.originalText,
      dateRelative: "vor 1 Monat",
    },
    en: {
      text: "From start to finish we were supported in the best way. The tour leaders and religious guides are very experienced and truly care for every pilgrim.",
      dateRelative: "1 month ago",
    },
    ar: {
      text: "من البداية إلى النهاية تم دعمنا بأفضل طريقة. المرشدون ومرافقو الرحلة الدينيون ذوو خبرة كبيرة ويهتمون حقاً بكل حاج.",
      dateRelative: "منذ شهر",
    },
    tr: {
      text: "Baştan sona en iyi şekilde desteklendik. Rehberler ve dini refakatçiler çok deneyimli ve her hacıyla gerçekten ilgileniyorlar.",
      dateRelative: "1 ay önce",
    },
    bs: {
      text: "Od početka do kraja smo bili odlično podržani. Vodiči i vjerski pratioci su veoma iskusni i stvarno brinu o svakom hodočasniku.",
      dateRelative: "prije 1 mjesec",
    },
  },
};
