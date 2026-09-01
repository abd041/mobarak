import type { Locale } from "@/i18n/routing";

/** Short phrase for inline use in journey/process copy. */
export const HAJJ_LOGISTICS_PHRASE: Record<Locale, string> = {
  de: "entsprechend dem finalen Hajj-Programm und den offiziellen Vorgaben",
  en: "in line with the final Hajj programme and official requirements",
  ar: "وفق البرنامج النهائي للحج والتعليمات الرسمية",
  tr: "nihai Hac programı ve resmi düzenlemelere uygun olarak",
  bs: "u skladu s konačnim hadž programom i službenim propisima",
};

/** Visible note below the journey section title. */
export const HAJJ_JOURNEY_LOGISTICS_NOTE: Record<Locale, string> = {
  de: "Transport, Mashair, Gruppeneinteilung und genaue Zeiten richten sich nach den offiziellen saudi-arabischen Vorgaben und dem finalen Hajj-Programm. Bis zur Bestätigung nennen wir keine verbindlichen Abfahrtszeiten oder garantierten Routen. Unsere Begleitung erfolgt entsprechend dem finalen Hajj-Programm und den offiziellen Vorgaben.",
  en: "Transport, Mashair, group allocation and exact timings depend on official Saudi requirements and the final Hajj programme. Until the programme is confirmed, we do not state binding departure times or guaranteed routes. Our support is provided in line with the final Hajj programme and official requirements.",
  ar: "يعتمد النقل والمشاعر وتوزيع المجموعات والأوقات الدقيقة على اللوائح السعودية الرسمية والبرنامج النهائي للحج. إلى حين تأكيد البرنامج، لا نذكر أوقات مغادرة ملزمة أو مسارات مضمونة. تتم رعايتنا وفق البرنامج النهائي للحج والتعليمات الرسمية.",
  tr: "Ulaşım, Meşair, grup dağılımı ve kesin saatler Suudi Arabistan'ın resmi düzenlemelerine ve nihai Hac programına bağlıdır. Program onaylanana kadar kesin kalkış saatleri veya garanti edilen güzergâhlar belirtmiyoruz. Refaketimiz nihai Hac programı ve resmi düzenlemelere uygun olarak sağlanır.",
  bs: "Prevoz, Mešair, raspodjela grupe i tačna vremena zavise od službenih saudijskih propisa i konačnog hadž programa. Do potvrde programa ne navodimo obavezujuća vremena polaska niti garantovane rute. Našu pratnju pružamo u skladu s konačnim hadž programom i službenim propisima.",
};

export const HAJJ_LOGISTICS_FAQ: Record<Locale, { question: string; answer: string }> = {
  de: {
    question: "Sind Zeiten und Routen während des Hajj bereits festgelegt?",
    answer:
      "Die genauen Hajj-Abläufe hängen von offiziellen saudi-arabischen Regelungen, dem finalen Paket, dem Transportplan, der Mashair-Organisation, der Menschenmengensteuerung und der Gruppeneinteilung ab. Bis das finale Hajj-Programm bestätigt ist, nennen wir keine verbindlichen Abfahrtszeiten oder garantierten Bewegungsrouten. Unsere Begleitung erfolgt entsprechend dem finalen Hajj-Programm und den offiziellen Vorgaben.",
  },
  en: {
    question: "Are times and routes during Hajj already fixed?",
    answer:
      "The exact Hajj logistics depend on official Saudi regulations, the final package, transport schedule, Mashair organisation, crowd management and group allocation. Until the final Hajj programme is confirmed, we do not state binding departure times or guaranteed movement routes. Our support is provided in line with the final Hajj programme and official requirements.",
  },
  ar: {
    question: "هل الأوقات والمسارات أثناء الحج محددة مسبقاً؟",
    answer:
      "تعتمد تفاصيل الحج على اللوائح السعودية الرسمية والباقة النهائية وجدول النقل وتنظيم المشاعر وإدارة الازدحام وتوزيع المجموعات. إلى حين تأكيد البرنامج النهائي للحج، لا نذكر أوقات مغادرة ملزمة أو مسارات حركة مضمونة. تتم رعايتنا وفق البرنامج النهائي للحج والتعليمات الرسمية.",
  },
  tr: {
    question: "Hac sırasında saatler ve güzergâhlar kesinleşmiş mi?",
    answer:
      "Hac lojistiği Suudi Arabistan'ın resmi düzenlemelerine, nihai pakete, ulaşım planına, Meşair organizasyonuna, kalabalık yönetimine ve grup dağılımına bağlıdır. Nihai Hac programı onaylanana kadar kesin kalkış saatleri veya garanti edilen güzergâhlar belirtmiyoruz. Refaketimiz nihai Hac programı ve resmi düzenlemelere uygun olarak sağlanır.",
  },
  bs: {
    question: "Jesu li vremena i rute tokom hadža već utvrđene?",
    answer:
      "Tačna hadž logistika zavisi od službenih saudijskih propisa, konačnog paketa, rasporeda prevoza, organizacije Mešaira, upravljanja gužvama i raspodjele grupe. Do potvrde konačnog hadž programa ne navodimo obavezujuća vremena polaska niti garantovane rute kretanja. Našu pratnju pružamo u skladu s konačnim hadž programom i službenim propisima.",
  },
};
