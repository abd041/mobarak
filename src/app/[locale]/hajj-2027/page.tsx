import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { HajjStickyCta } from "@/components/hajj/HajjStickyCta";
import { HajjModalsSection } from "@/components/hajj/HajjModalsSection";
import { IMG, reviews } from "@/data/mock";
import { hajjProcess, hajjJourney, hajjFaqs } from "@/data/hajj";

export default async function HajjLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hajj");

  const benefits = [
    t("benefit1"),
    t("benefit2"),
    t("benefit3"),
    t("benefit4"),
    t("benefit5"),
    t("benefit6"),
  ];

  const why = [
    { title: "30+ Jahre Erfahrung", body: "Seit über drei Jahrzehnten begleiten wir Pilger beim Hajj." },
    { title: "Persönliche Unterstützung", body: "Wir begleiten dich bereits vor der Reise." },
    { title: "Religiöse Begleitung", body: "Erfahrene Reiseleiter und religiöse Begleiter." },
    { title: "Gemeinsam als Gruppe", body: "Organisiert als Gruppe an den entscheidenden Stationen." },
    { title: "Betreuung vor Ort", body: "Während des Hajj in Saudi-Arabien für dich da." },
    { title: "Mehrsprachige Betreuung", body: "Deutsch · Arabisch · Bosnisch · Türkisch – je nach Gruppe." },
  ];

  return (
    <HajjStickyCta>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Container className="grid items-center gap-8 py-10 md:grid-cols-2 md:py-16">
          <div>
            <span className="mb-3 inline-block rounded-full bg-brand-orange-soft px-3 py-1 text-xs font-bold tracking-wide text-brand-orange">
              {t("label")}
            </span>
            <h1 className="mb-2 text-3xl font-bold text-navy md:text-5xl">
              {t("heroTitle")}
              <br />
              {t("heroTitleLine2")}
            </h1>
            <p className="mb-6 text-muted md:text-lg">{t("heroBody")}</p>
            <ul className="mb-6 space-y-2">
              {benefits.map((b) => (
                <li key={b} className="flex gap-2 text-sm text-navy">
                  <Check className="h-4 w-4 shrink-0 text-brand-orange" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="hidden md:block">
              <Link
                href="/hajj-2027/vormerkung"
                className="inline-flex rounded-xl bg-brand-cta px-6 py-3.5 text-sm font-semibold text-white"
              >
                {t("cta")} →
              </Link>
              <div className="mt-2 space-y-1 text-xs text-muted">
                <p>✓ {t("ctaFree")}</p>
                <p>✓ {t("ctaNoPay")}</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image src={IMG.kaaba} alt="" fill className="object-cover" priority sizes="50vw" />
          </div>
        </Container>
      </section>

      <ReviewsSection reviews={reviews} />

      {/* Status */}
      <section className="py-10">
        <Container>
          <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange-soft/40 p-6 md:p-8">
            <h2 className="mb-3 text-xl font-bold text-navy">{t("statusTitle")}</h2>
            <p className="mb-4 max-w-3xl text-navy/80">{t("statusBody")}</p>
            <Link
              href="/hajj-2027/vormerkung"
              className="hidden rounded-xl bg-brand-cta px-5 py-3 text-sm font-semibold text-white md:inline-flex"
            >
              {t("statusCta")} →
            </Link>
          </div>
        </Container>
      </section>

      {/* Why */}
      <section id="warum-mobarak" className="bg-surface py-14">
        <Container>
          <p className="mb-2 text-sm font-bold tracking-wide text-brand-orange">{t("whyEyebrow")}</p>
          <h2 className="mb-2 text-3xl font-bold text-navy">{t("whyTitle")}</h2>
          <p className="mb-8 text-muted">{t("whySubtitle")}</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {why.map((card) => (
              <article key={card.title} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                <h3 className="mb-2 font-bold text-navy">{card.title}</h3>
                <p className="text-sm text-muted">{card.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <HajjModalsSection
        processTitle={t("processTitle")}
        journeyEyebrow={t("journeyEyebrow")}
        journeyTitle={t("journeyTitle")}
        learnMore={t("learnMore")}
        process={hajjProcess}
        journey={hajjJourney}
      />

      {/* SEO */}
      <section className="py-12">
        <Container>
          <article className="prose max-w-none rounded-2xl border border-line bg-white p-6 md:p-10">
            <h2 className="text-2xl font-bold text-navy">{t("seoTitle")}</h2>
            <p className="mt-4 leading-relaxed text-navy/80">{t("seoBody")}</p>
          </article>
        </Container>
      </section>

      {/* 30+ years */}
      <section className="bg-navy py-14 text-white">
        <Container className="text-center">
          <p className="text-6xl font-bold text-brand-gold">30+</p>
          <h2 className="mt-2 text-2xl font-bold">{t("yearsTitle")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/75">{t("yearsBody")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {["1990er", "2000er", "2010er", "Heute"].map((era) => (
              <div
                key={era}
                className="flex h-28 w-40 items-end rounded-xl bg-white/10 p-3 text-sm font-semibold"
              >
                {era}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-14">
        <Container>
          <h2 className="mb-6 text-2xl font-bold text-navy">{t("faqTitle")}</h2>
          <div className="space-y-3">
            {hajjFaqs.map((faq) => (
              <details
                key={faq.q}
                className="rounded-xl border border-line bg-white p-4 open:shadow-sm"
              >
                <summary className="cursor-pointer font-semibold text-navy">{faq.q}</summary>
                <p className="mt-2 text-sm text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* Final CTA desktop */}
      <section className="pb-24 md:pb-16">
        <Container>
          <div className="rounded-2xl bg-surface p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold text-navy md:text-3xl">{t("finalTitle")}</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">{t("finalBody")}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-navy">
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 text-brand-gold" /> 30+ Jahre
              </span>
              <span>Persönliche Betreuung</span>
              <span>Religiöse Begleitung</span>
              <span>Gemeinsam als Gruppe</span>
            </div>
            <Link
              href="/hajj-2027/vormerkung"
              className="mt-6 hidden rounded-xl bg-brand-cta px-6 py-3.5 text-sm font-semibold text-white md:inline-flex"
            >
              {t("cta")} →
            </Link>
            <p className="mt-2 hidden text-xs text-muted md:block">{t("ctaFree")}</p>
          </div>
        </Container>
      </section>
    </HajjStickyCta>
  );
}
