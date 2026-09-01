import type { Locale } from "@/i18n/routing";
import { locales } from "@/i18n/routing";
import {
  DEFAULT_VISUM_RULES,
  type VisumRulesConfig,
} from "@/data/visum-rules";

export type LocalizedString = Record<Locale, string>;

function emptyLocalized(fallback = ""): LocalizedString {
  return Object.fromEntries(locales.map((l) => [l, fallback])) as LocalizedString;
}

function localizedFrom(
  values: Partial<LocalizedString> & { de: string },
): LocalizedString {
  return { ...emptyLocalized(values.de), ...values };
}

/** One public visa info card — design/presentation only (§38). Facts live in `rules`. */
export type VisumCmsCard = {
  id: "tourist" | "umrah";
  enabled: boolean;
  title: LocalizedString;
  footer: LocalizedString;
  /**
   * @deprecated Prefer rules.visaTypes + extraPoints. Kept for older overrides.
   */
  points: LocalizedString[];
  /** Optional marketing bullets shown after structured rule bullets */
  extraPoints: LocalizedString[];
  /** When true, card bullets come from matching rules.visaTypes entry */
  showRulesOnCard: boolean;
};

export type VisumCmsEntryItem = {
  id: string;
  title: LocalizedString;
  body: LocalizedString;
};

export type VisumCmsFaqItem = {
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
};

export type VisumCmsInternalLink = {
  id: string;
  label: LocalizedString;
  href: string;
};

/**
 * §35 — All SEO / structured page content lives in CMS (Admin-editable).
 * Do not hard-code visa rules in React components.
 */
export type VisumCmsSeo = {
  enabled: boolean;
  /** Page meta title (per locale) */
  metaTitle: LocalizedString;
  /** Page meta description (per locale) */
  metaDescription: LocalizedString;
  /** Main SEO H2 */
  heading: LocalizedString;
  intro: LocalizedString;
  touristHeading: LocalizedString;
  touristBody: LocalizedString;
  umrahHeading: LocalizedString;
  umrahBody: LocalizedString;
  entryHeading: LocalizedString;
  entryItems: VisumCmsEntryItem[];
  disclaimer: LocalizedString;
  faqHeading: LocalizedString;
  faqs: VisumCmsFaqItem[];
  linksHeading: LocalizedString;
  links: VisumCmsInternalLink[];
};

/**
 * Visum Service CMS.
 * §38 — `rules` = visa regulations/data; cards + seo = design/content.
 */
export type VisumCmsConfig = {
  sectionTitle: LocalizedString;
  tourist: VisumCmsCard;
  umrah: VisumCmsCard;
  seo: VisumCmsSeo;
  rules: VisumRulesConfig;
};

export const DEFAULT_VISUM_CMS: VisumCmsConfig = {
  sectionTitle: localizedFrom({
    de: "Infos zu unseren Visum-Services",
    en: "About our visa services",
    ar: "معلومات عن خدمات التأشيرة",
    tr: "Vize hizmetlerimiz hakkında",
    bs: "Informacije o našim viza uslugama",
  }),
  tourist: {
    id: "tourist",
    enabled: true,
    showRulesOnCard: true,
    title: localizedFrom({
      de: "Touristen Visum",
      en: "Tourist visa",
      ar: "تأشيرة سياحية",
      tr: "Turist vizesi",
      bs: "Turistička viza",
    }),
    /** Legacy free-text points — unused when showRulesOnCard + rules exist */
    points: [],
    extraPoints: [],
    footer: localizedFrom({
      de: "Wir übernehmen die komplette Antragstellung für Sie.",
      en: "We handle the complete application for you.",
      ar: "نتولى تقديم الطلب بالكامل نيابةً عنكم.",
      tr: "Başvurunun tamamını sizin için üstleniyoruz.",
      bs: "Preuzimamo kompletnu prijavu za vas.",
    }),
  },
  umrah: {
    id: "umrah",
    enabled: true,
    showRulesOnCard: true,
    title: localizedFrom({
      de: "Umrah Visum",
      en: "Umrah visa",
      ar: "تأشيرة عمرة",
      tr: "Umre vizesi",
      bs: "Umrah viza",
    }),
    points: [],
    extraPoints: [],
    footer: localizedFrom({
      de: "Ideal für Ihre spirituelle Reise nach Makkah und Medina.",
      en: "Ideal for your spiritual journey to Makkah and Medina.",
      ar: "مثالية لرحلتكم الروحية إلى مكة والمدينة.",
      tr: "Mekke ve Medine’ye manevi yolculuğunuz için ideal.",
      bs: "Idealno za vaše duhovno putovanje u Mekku i Medinu.",
    }),
  },
  rules: DEFAULT_VISUM_RULES,
  seo: {
    enabled: true,
    metaTitle: localizedFrom({
      de: "Visum für Saudi Arabien",
      en: "Visa for Saudi Arabia",
      ar: "تأشيرة المملكة العربية السعودية",
      tr: "Suudi Arabistan Vizesi",
      bs: "Viza za Saudijsku Arabiju",
    }),
    metaDescription: localizedFrom({
      de: "Schneller und zuverlässiger Visum-Service für Saudi-Arabien von Mobarak Hajj & Umrah.",
      en: "Fast and reliable Saudi Arabia visa service from Mobarak Hajj & Umrah.",
      ar: "خدمة تأشيرات سريعة وموثوقة من مبارك للحج والعمرة.",
      tr: "Mobarak Hajj & Umrah ile hızlı ve güvenilir Suudi Arabistan vize hizmeti.",
      bs: "Brza i pouzdana viza usluga za Saudijsku Arabiju od Mobarak Hajj & Umrah.",
    }),
    heading: localizedFrom({
      de: "Visum für Saudi-Arabien – Informationen zur Einreise",
      en: "Saudi Arabia Visa – entry information",
      ar: "تأشيرة السعودية – معلومات حول الدخول",
      tr: "Suudi Arabistan vizesi – giriş bilgileri",
      bs: "Viza za Saudijsku Arabiju – informacije o ulasku",
    }),
    intro: localizedFrom({
      de: "Für eine Reise nach Saudi-Arabien benötigen Reisende abhängig von Nationalität, Reisepass und Reisezweck das passende Visum. Ob Sie Saudi-Arabien als Tourist besuchen oder für eine Umrah-Reise nach Makkah und Medina reisen möchten – wir unterstützen Sie bei der Auswahl und Beantragung des passenden Visums.",
      en: "For travel to Saudi Arabia, travellers need the right visa depending on nationality, passport and purpose of travel. Whether you visit Saudi Arabia as a tourist or travel for Umrah to Makkah and Medina – we support you in choosing and applying for the right visa.",
      ar: "للسفر إلى المملكة العربية السعودية يحتاج المسافرون إلى التأشيرة المناسبة بحسب الجنسية وجواز السفر وغرض الرحلة. سواء زرتم السعودية كسيّاح أو لرحلة عمرة إلى مكة والمدينة – ندعمكم في اختيار التأشيرة المناسبة وتقديم الطلب.",
      tr: "Suudi Arabistan’a seyahat için yolcuların uyruk, pasaport ve seyahat amacına göre doğru vizeye ihtiyacı vardır. Suudi Arabistan’ı turist olarak ziyaret etmek veya Umre için Mekke ve Medine’ye gitmek istiyorsanız – doğru vizeyi seçmenizde ve başvurmanızda size destek oluyoruz.",
      bs: "Za putovanje u Saudijsku Arabiju putnicima je potrebna odgovarajuća viza u zavisnosti od državljanstva, pasoša i svrhe putovanja. Bilo da Saudijsku Arabiju posjećujete kao turista ili putujete na Umrah u Mekku i Medinu – pomažemo vam pri odabiru i podnošenju zahtjeva za odgovarajuću vizu.",
    }),
    touristHeading: localizedFrom({
      de: "Touristenvisum",
      en: "Tourist Visa",
      ar: "التأشيرة السياحية",
      tr: "Turist vizesi",
      bs: "Turistička viza",
    }),
    touristBody: localizedFrom({
      de: "Das Touristenvisum ermöglicht berechtigten Reisenden touristische Aufenthalte in Saudi-Arabien. Das elektronische Touristenvisum kann je nach Voraussetzungen als Multiple-Entry-Visum ausgestellt werden und ermöglicht Aufenthalte von bis zu 90 Tagen. Auch eine Umrah kann grundsätzlich mit einem entsprechenden Touristenvisum durchgeführt werden, sofern die jeweils geltenden Bestimmungen erfüllt werden. Das Touristenvisum ist nicht für die Teilnahme am Hajj bestimmt.",
      en: "The tourist visa allows eligible travellers to stay in Saudi Arabia for tourism. Depending on the requirements, the electronic tourist visa may be issued as a multiple-entry visa and allows stays of up to 90 days. Umrah can generally also be performed with an appropriate tourist visa, provided the applicable rules are met. The tourist visa is not intended for participation in Hajj.",
      ar: "تتيح التأشيرة السياحية للمسافرين المؤهلين الإقامة لأغراض سياحية في المملكة العربية السعودية. يمكن إصدار التأشيرة السياحية الإلكترونية بحسب الشروط كتأشيرة متعددة الدخول، وتسمح بإقامة تصل إلى 90 يوماً. كما يمكن أداء العمرة عموماً بتأشيرة سياحية مناسبة إذا استُوفيت الأحكام السارية. التأشيرة السياحية ليست مخصصة للمشاركة في الحج.",
      tr: "Turist vizesi, uygun yolcuların Suudi Arabistan’da turistik amaçla kalmasına olanak tanır. Şartlara bağlı olarak elektronik turist vizesi çoklu girişli olarak verilebilir ve 90 güne kadar kalışa imkân sağlar. Geçerli kuralların karşılanması kaydıyla Umre de genel olarak uygun bir turist vizesiyle yapılabilir. Turist vizesi Hac’a katılım için değildir.",
      bs: "Turistička viza omogućava podobnim putnicima turistički boravak u Saudijskoj Arabiji. Elektronska turistička viza može, ovisno o uslovima, biti izdata kao viza s višestrukim ulaskom i omogućava boravak do 90 dana. Umrah se u načelu također može obaviti s odgovarajućom turističkom vizom, ako se ispune važeći propisi. Turistička viza nije namijenjena za učešće na Hadžu.",
    }),
    umrahHeading: localizedFrom({
      de: "Umrah Visum",
      en: "Umrah Visa",
      ar: "تأشيرة العمرة",
      tr: "Umre vizesi",
      bs: "Umrah viza",
    }),
    umrahBody: localizedFrom({
      de: "Für eine Umrah-Reise nach Makkah und Medina gelten je nach Nationalität und persönlicher Situation unterschiedliche Möglichkeiten der Visumbeantragung. Wir prüfen Ihre Angaben und unterstützen Sie dabei, die für Ihre Reise geeignete Visumlösung zu finden.",
      en: "For an Umrah journey to Makkah and Medina, visa application options differ depending on nationality and personal situation. We review your details and help you find the visa solution that suits your trip.",
      ar: "لرحلة عمرة إلى مكة والمدينة تختلف إمكانيات طلب التأشيرة بحسب الجنسية والوضع الشخصي. نراجع بياناتكم وندعمكم في إيجاد حل التأشيرة المناسب لرحلتكم.",
      tr: "Mekke ve Medine’ye Umre yolculuğu için vize başvuru seçenekleri uyruğa ve kişisel duruma göre değişir. Bilgilerinizi inceler ve yolculuğunuza uygun vize çözümünü bulmanıza yardımcı oluruz.",
      bs: "Za Umrah putovanje u Mekku i Medinu postoje različite mogućnosti podnošenja zahtjeva za vizu, ovisno o državljanstvu i ličnoj situaciji. Provjeravamo vaše podatke i pomažemo vam da pronađete rješenje vize koje odgovara vašem putovanju.",
    }),
    entryHeading: localizedFrom({
      de: "Einreisebestimmungen für Saudi-Arabien",
      en: "Saudi Arabia Entry Requirements",
      ar: "متطلبات الدخول إلى المملكة العربية السعودية",
      tr: "Suudi Arabistan giriş koşulları",
      bs: "Uvjeti ulaska u Saudijsku Arabiju",
    }),
    entryItems: [
      {
        id: "passport",
        title: localizedFrom({
          de: "Reisepass",
          en: "Passport",
          ar: "جواز السفر",
          tr: "Pasaport",
          bs: "Pasoš",
        }),
        body: localizedFrom({
          de: "Für das touristische eVisa muss der verwendete Reisepass bei der Einreise nach Saudi-Arabien grundsätzlich noch mindestens sechs Monate gültig sein.",
          en: "For the tourist eVisa, the passport used must generally still be valid for at least six months upon entry into Saudi Arabia.",
          ar: "بالنسبة للتأشيرة السياحية الإلكترونية يجب أن يبقى جواز السفر المستخدم ساري المفعول عادةً لمدة ستة أشهر على الأقل عند الدخول إلى السعودية.",
          tr: "Turistik eVisa için kullanılan pasaportun Suudi Arabistan’a girişte genellikle en az altı ay daha geçerli olması gerekir.",
          bs: "Za turističku eVizuu korišteni pasoš pri ulasku u Saudijsku Arabiju u načelu mora biti još važeći najmanje šest mjeseci.",
        }),
      },
      {
        id: "valid-visa",
        title: localizedFrom({
          de: "Gültiges Visum",
          en: "Valid visa",
          ar: "تأشيرة سارية",
          tr: "Geçerli vize",
          bs: "Važeća viza",
        }),
        body: localizedFrom({
          de: "Vor der Einreise muss ein für den jeweiligen Reisezweck gültiges Visum vorliegen.",
          en: "Before entry, a visa that is valid for the respective purpose of travel must be in place.",
          ar: "قبل الدخول يجب أن تكون لديكم تأشيرة سارية لغرض الرحلة المعني.",
          tr: "Girişten önce ilgili seyahat amacına uygun geçerli bir vize bulunmalıdır.",
          bs: "Prije ulaska mora postojati viza koja je važeća za odgovarajuću svrhu putovanja.",
        }),
      },
      {
        id: "same-passport",
        title: localizedFrom({
          de: "Richtiger Reisepass",
          en: "Correct passport",
          ar: "جواز السفر الصحيح",
          tr: "Doğru pasaport",
          bs: "Ispravan pasoš",
        }),
        body: localizedFrom({
          de: "Für die Einreise muss grundsätzlich derselbe Reisepass verwendet werden, mit dem das eVisa beantragt wurde.",
          en: "For entry, the same passport with which the eVisa was applied for must generally be used.",
          ar: "للدخول يجب عموماً استخدام نفس جواز السفر الذي قُدّم به طلب التأشيرة الإلكترونية.",
          tr: "Giriş için genel olarak eVisa’nın başvurulduğu aynı pasaport kullanılmalıdır.",
          bs: "Za ulazak se u načelu mora koristiti isti pasoš s kojim je podnesen zahtjev za eVizuu.",
        }),
      },
      {
        id: "entry-decision",
        title: localizedFrom({
          de: "Einreiseentscheidung",
          en: "Entry decision",
          ar: "قرار الدخول",
          tr: "Giriş kararı",
          bs: "Odluka o ulasku",
        }),
        body: localizedFrom({
          de: "Auch ein ausgestelltes Visum garantiert die Einreise nicht automatisch. Die endgültige Entscheidung über die Einreise liegt bei den zuständigen saudischen Behörden.",
          en: "Even an issued visa does not automatically guarantee entry. The final decision on entry rests with the competent Saudi authorities.",
          ar: "حتى التأشيرة الصادرة لا تضمن الدخول تلقائياً. القرار النهائي بشأن الدخول يعود للسلطات السعودية المختصة.",
          tr: "Düzenlenmiş bir vize bile girişi otomatik olarak garanti etmez. Girişe ilişkin nihai karar yetkili Suudi makamlarına aittir.",
          bs: "Čak ni izdata viza ne garantuje ulazak automatski. Konačnu odluku o ulasku donose nadležna saudijska tijela.",
        }),
      },
    ],
    disclaimer: localizedFrom({
      de: "Hinweis: Visabestimmungen und Einreisevoraussetzungen können sich kurzfristig ändern und hängen unter anderem von Nationalität, Reisepass, Aufenthaltsstatus und Reisezweck ab. Die Angaben auf dieser Seite dienen der allgemeinen Information. Vor der Beantragung prüfen wir die für Ihre persönliche Situation geltenden Voraussetzungen.",
      en: "Note: Visa regulations and entry requirements can change at short notice and depend, among other things, on nationality, passport, residence status and purpose of travel. The information on this page is for general guidance. Before applying, we review the requirements that apply to your personal situation.",
      ar: "ملاحظة: قد تتغيّر أحكام التأشيرات ومتطلبات الدخول على المدى القصير، وتعتمد من بين أمور أخرى على الجنسية وجواز السفر ووضع الإقامة وغرض الرحلة. المعلومات في هذه الصفحة للإرشاد العام. قبل تقديم الطلب نراجع المتطلبات السارية على وضعكم الشخصي.",
      tr: "Not: Vize düzenlemeleri ve giriş koşulları kısa sürede değişebilir ve diğerlerinin yanı sıra uyruğa, pasaporta, ikamet durumuna ve seyahat amacına bağlıdır. Bu sayfadaki bilgiler genel bilgilendirme amaçlıdır. Başvurudan önce kişisel durumunuz için geçerli şartları inceleriz.",
      bs: "Napomena: Propisi o vizama i uslovi ulaska mogu se kratkoročno mijenjati i zavise, između ostalog, od državljanstva, pasoša, statusa boravka i svrhe putovanja. Informacije na ovoj stranici služe općem informisanju. Prije podnošenja zahtjeva provjeravamo uslove koji važe za vašu ličnu situaciju.",
    }),
    faqHeading: localizedFrom({
      de: "Häufige Fragen zum Saudi-Arabien Visum",
      en: "Frequently asked questions about the Saudi Arabia visa",
      ar: "أسئلة شائعة حول تأشيرة السعودية",
      tr: "Suudi Arabistan vizesi hakkında sık sorulan sorular",
      bs: "Česta pitanja o vizi za Saudijsku Arabiju",
    }),
    /** §36 — Recommended FAQ set; answers editable in Admin. */
    faqs: [
      {
        id: "faq-passport-validity",
        question: localizedFrom({
          de: "Wie lange muss mein Reisepass gültig sein?",
          en: "How long must my passport remain valid?",
          ar: "كم يجب أن يبقى جواز سفري ساري المفعول؟",
          tr: "Pasaportum ne kadar süre geçerli olmalı?",
          bs: "Koliko dugo pasoš mora biti važeći?",
        }),
        answer: localizedFrom({
          de: "Für das touristische eVisa muss der verwendete Reisepass bei der Einreise nach Saudi-Arabien grundsätzlich noch mindestens sechs Monate gültig sein. Die genauen Anforderungen prüfen wir anhand Ihrer Angaben.",
          en: "For the tourist eVisa, the passport used must generally still be valid for at least six months upon entry into Saudi Arabia. We verify the exact requirements based on your details.",
          ar: "بالنسبة للتأشيرة السياحية الإلكترونية يجب أن يبقى جواز السفر المستخدم عادةً ساري المفعول لمدة ستة أشهر على الأقل عند الدخول إلى السعودية. نتحقق من المتطلبات الدقيقة بناءً على بياناتكم.",
          tr: "Turistik eVisa için kullanılan pasaportun Suudi Arabistan’a girişte genellikle en az altı ay daha geçerli olması gerekir. Kesin şartları bilgilerinize göre kontrol ederiz.",
          bs: "Za turističku eVizuu korišteni pasoš pri ulasku u Saudijsku Arabiju u načelu mora biti još važeći najmanje šest mjeseci. Tačne zahtjeve provjeravamo na osnovu vaših podataka.",
        }),
      },
      {
        id: "faq-tourist-umrah",
        question: localizedFrom({
          de: "Kann ich mit einem Touristenvisum Umrah machen?",
          en: "Can I perform Umrah with a tourist visa?",
          ar: "هل يمكنني أداء العمرة بتأشيرة سياحية؟",
          tr: "Turist vizesiyle Umre yapabilir miyim?",
          bs: "Mogu li s turističkom vizom obaviti Umrah?",
        }),
        answer: localizedFrom({
          de: "Ja, eine Umrah kann grundsätzlich mit einem entsprechenden Touristenvisum durchgeführt werden, sofern die jeweils geltenden Bestimmungen erfüllt sind. Das Touristenvisum ist nicht für die Teilnahme am Hajj bestimmt.",
          en: "Yes, Umrah can generally be performed with an appropriate tourist visa, provided the applicable rules are met. The tourist visa is not intended for participation in Hajj.",
          ar: "نعم، يمكن أداء العمرة عموماً بتأشيرة سياحية مناسبة إذا استُوفيت الأحكام السارية. التأشيرة السياحية ليست مخصصة للمشاركة في الحج.",
          tr: "Evet, geçerli kuralların karşılanması kaydıyla Umre genel olarak uygun bir turist vizesiyle yapılabilir. Turist vizesi Hac’a katılım için değildir.",
          bs: "Da, Umrah se u načelu može obaviti s odgovarajućom turističkom vizom, ako se ispune važeći propisi. Turistička viza nije namijenjena za učešće na Hadžu.",
        }),
      },
      {
        id: "faq-stay-duration",
        question: localizedFrom({
          de: "Wie lange darf ich in Saudi-Arabien bleiben?",
          en: "How long may I stay in Saudi Arabia?",
          ar: "كم يمكنني البقاء في السعودية؟",
          tr: "Suudi Arabistan’da ne kadar kalabilirim?",
          bs: "Koliko smijem boraviti u Saudijskoj Arabiji?",
        }),
        answer: localizedFrom({
          de: "Die zulässige Aufenthaltsdauer hängt vom Visumtyp ab. Beim Touristenvisum sind Aufenthalte von bis zu 90 Tagen je Einreise üblich; beim Umrah-Visum gelten die jeweiligen Bedingungen des ausgestellten Visums. Wir klären die Details mit Ihrer Anfrage.",
          en: "The permitted length of stay depends on the visa type. With a tourist visa, stays of up to 90 days per entry are common; for an Umrah visa, the conditions of the issued visa apply. We clarify the details with your enquiry.",
          ar: "تعتمد مدة الإقامة المسموح بها على نوع التأشيرة. مع التأشيرة السياحية تكون الإقامة حتى 90 يوماً لكل دخول شائعة؛ ولتأشيرة العمرة تسري شروط التأشيرة الصادرة. نوضح التفاصيل مع طلبكم.",
          tr: "İzin verilen kalış süresi vize türüne bağlıdır. Turist vizesinde giriş başına 90 güne kadar kalış yaygındır; Umre vizesinde düzenlenen vizenin koşulları geçerlidir. Detayları talebinizle netleştiririz.",
          bs: "Dozvoljena dužina boravka zavisi od tipa vize. Kod turističke vize uobičajen je boravak do 90 dana po ulasku; za Umrah vizu važe uslovi izdate vize. Detalje razjašnjavamo uz vaš upit.",
        }),
      },
      {
        id: "faq-children-visa",
        question: localizedFrom({
          de: "Benötigen Kinder ein eigenes Visum?",
          en: "Do children need their own visa?",
          ar: "هل يحتاج الأطفال إلى تأشيرة خاصة بهم؟",
          tr: "Çocukların kendi vizelerine ihtiyacı var mı?",
          bs: "Treba li djeci vlastita viza?",
        }),
        answer: localizedFrom({
          de: "Ja, in der Regel benötigt jede reisende Person – auch Kinder und Säuglinge – ein eigenes Visum. Tragen Sie alle Mitreisenden in der Anfrage ein, damit wir die Beantragung vollständig übernehmen können.",
          en: "Yes, as a rule every traveller – including children and infants – needs their own visa. Include all accompanying travellers in the enquiry so we can handle the full application.",
          ar: "نعم، عادةً يحتاج كل مسافر – بما في ذلك الأطفال والرضّع – إلى تأشيرة خاصة به. أدرجوا جميع المرافقين في الطلب حتى نتمكن من تولي التقديم بالكامل.",
          tr: "Evet, kural olarak her yolcunun – çocuklar ve bebekler dâhil – kendi vizesine ihtiyacı vardır. Başvuruyu eksiksiz üstlenebilmemiz için tüm yolcuları talebe ekleyin.",
          bs: "Da, u pravilu svaka putujuća osoba – uključujući djecu i dojenčad – treba vlastitu vizu. Unesite sve putnike u upit kako bismo preuzeli kompletnu prijavu.",
        }),
      },
      {
        id: "faq-convention-passport",
        question: localizedFrom({
          de: "Kann ich mit einem Konventionspass ein Visum beantragen?",
          en: "Can I apply for a visa with a convention travel document?",
          ar: "هل يمكنني طلب تأشيرة بجواز اتفاقية؟",
          tr: "Konvansiyon pasaportuyla vize başvurusu yapabilir miyim?",
          bs: "Mogu li podnijeti zahtjev za vizu s konvencijskim putnim dokumentom?",
        }),
        answer: localizedFrom({
          de: "Das hängt von Ihrem Dokument, Ihrem Aufenthaltsstatus und den aktuellen saudischen Bestimmungen ab. Geben Sie in der Anfrage Ihren Pass-Typ an – wir prüfen die Möglichkeiten individuell und beraten Sie.",
          en: "It depends on your document, residence status and current Saudi regulations. State your passport type in the enquiry – we review the options individually and advise you.",
          ar: "يعتمد ذلك على وثيقتكم ووضع إقامتكم والأحكام السعودية الحالية. حدّدوا نوع جواز السفر في الطلب – نراجع الإمكانيات فردياً وننصحكم.",
          tr: "Belgenize, ikamet durumunuza ve güncel Suudi düzenlemelerine bağlıdır. Talebinizde pasaport türünü belirtin – seçenekleri bireysel inceler ve size danışmanlık veririz.",
          bs: "Zavisi od vašeg dokumenta, statusa boravka i važećih saudijskih propisa. U upitu navedite tip pasoša – individualno pregledamo mogućnosti i savjetujemo vas.",
        }),
      },
      {
        id: "faq-documents",
        question: localizedFrom({
          de: "Welche Unterlagen benötige ich?",
          en: "Which documents do I need?",
          ar: "ما المستندات التي أحتاجها؟",
          tr: "Hangi belgelere ihtiyacım var?",
          bs: "Koja dokumenta su mi potrebna?",
        }),
        answer: localizedFrom({
          de: "In der Regel benötigen wir gültigen Reisepass, Passfoto und die Angaben aus dem Anfrageformular. Je nach Nationalität und Pass-Typ können weitere Unterlagen erforderlich sein. Nach Ihrer Anfrage nennen wir Ihnen die konkrete Checkliste.",
          en: "As a rule we need a valid passport, a passport photo and the details from the enquiry form. Depending on nationality and passport type, further documents may be required. After your enquiry we will provide the specific checklist.",
          ar: "عادةً نحتاج جواز سفر ساري المفعول وصورة جواز وبيانات نموذج الطلب. بحسب الجنسية ونوع الجواز قد تُطلب مستندات إضافية. بعد طلبكم نزوّدكم بقائمة التحقق المحددة.",
          tr: "Kural olarak geçerli pasaport, vesikalık fotoğraf ve talep formundaki bilgilere ihtiyacımız vardır. Uyruk ve pasaport türüne göre ek belgeler gerekebilir. Talebinizden sonra size somut kontrol listesini veririz.",
          bs: "U pravilu trebamo važeći pasoš, fotografiju i podatke iz obrasca upita. Ovisno o državljanstvu i tipu pasoša mogu biti potrebna dodatna dokumenta. Nakon upita damo vam konkretnu listu.",
        }),
      },
      {
        id: "faq-processing-time",
        question: localizedFrom({
          de: "Wie lange dauert die Bearbeitung?",
          en: "How long does processing take?",
          ar: "كم تستغرق المعالجة؟",
          tr: "İşlem ne kadar sürer?",
          bs: "Koliko traje obrada?",
        }),
        answer: localizedFrom({
          de: "Die Bearbeitungszeit hängt vom Visumtyp und den aktuellen Behördenprozessen ab. Nach Ihrer Anfrage nennen wir Ihnen einen realistischen Zeitrahmen.",
          en: "Processing time depends on the visa type and current authority processes. After your enquiry we will give you a realistic timeframe.",
          ar: "يعتمد وقت المعالجة على نوع التأشيرة وإجراءات الجهات المختصة الحالية. بعد طلبكم نوضح لكم إطاراً زمنياً واقعياً.",
          tr: "İşlem süresi vize türüne ve güncel resmi süreçlere bağlıdır. Talebinizden sonra size gerçekçi bir süre veririz.",
          bs: "Vrijeme obrade zavisi od tipa vize i trenutnih procedura. Nakon upita damo vam realan rok.",
        }),
      },
      {
        id: "faq-mobarak-handles",
        question: localizedFrom({
          de: "Kann Mobarak den Visumantrag für mich übernehmen?",
          en: "Can Mobarak handle the visa application for me?",
          ar: "هل يمكن لمبارك تولي طلب التأشيرة نيابةً عني؟",
          tr: "Mobarak vize başvurusunu benim için üstlenebilir mi?",
          bs: "Može li Mobarak preuzeti zahtjev za vizu za mene?",
        }),
        answer: localizedFrom({
          de: "Ja. Senden Sie uns Ihre Anfrage über das Formular auf dieser Seite – wir prüfen Ihre Angaben, beraten Sie zum passenden Visum und übernehmen die Antragstellung für Sie.",
          en: "Yes. Send us your enquiry via the form on this page – we review your details, advise you on the right visa and handle the application for you.",
          ar: "نعم. أرسلوا طلبكم عبر النموذج في هذه الصفحة – نراجع بياناتكم وننصحكم بالتأشيرة المناسبة ونتولى تقديم الطلب نيابةً عنكم.",
          tr: "Evet. Bu sayfadaki form üzerinden talebinizi gönderin – bilgilerinizi inceler, uygun vize konusunda danışmanlık verir ve başvuruyu sizin için üstleniriz.",
          bs: "Da. Pošaljite upit putem obrasca na ovoj stranici – pregledamo podatke, savjetujemo vas o odgovarajućoj vizi i preuzimamo podnošenje zahtjeva za vas.",
        }),
      },
    ],
    linksHeading: localizedFrom({
      de: "Weitere Informationen",
      en: "Further information",
      ar: "مزيد من المعلومات",
      tr: "Daha fazla bilgi",
      bs: "Dodatne informacije",
    }),
    links: [
      {
        id: "link-umrah",
        label: localizedFrom({
          de: "Umrah Gruppenreisen",
          en: "Umrah group trips",
          ar: "رحلات العمرة الجماعية",
          tr: "Umre grup seyahatleri",
          bs: "Umrah grupna putovanja",
        }),
        href: "/umrah-gruppenreisen",
      },
      {
        id: "link-individual",
        label: localizedFrom({
          de: "Individuelle Umrah",
          en: "Individual Umrah",
          ar: "عمرة فردية",
          tr: "Bireysel Umre",
          bs: "Individualna Umrah",
        }),
        href: "/individuelle-umrah",
      },
      {
        id: "link-contact",
        label: localizedFrom({
          de: "Kontakt",
          en: "Contact",
          ar: "اتصل بنا",
          tr: "İletişim",
          bs: "Kontakt",
        }),
        href: "/kontakt",
      },
    ],
  },
};

export function pickLocalized(
  value: LocalizedString | undefined,
  locale: string,
  fallback = "",
): string {
  if (!value) return fallback;
  const loc = locale as Locale;
  return (value[loc] || value.de || fallback).trim();
}

export function createEmptyEntryItem(): VisumCmsEntryItem {
  return {
    id: `entry-${Date.now()}`,
    title: emptyLocalized(),
    body: emptyLocalized(),
  };
}

export function createEmptyFaqItem(): VisumCmsFaqItem {
  return {
    id: `faq-${Date.now()}`,
    question: emptyLocalized(),
    answer: emptyLocalized(),
  };
}

export function createEmptyLink(): VisumCmsInternalLink {
  return {
    id: `link-${Date.now()}`,
    label: emptyLocalized(),
    href: "/",
  };
}
