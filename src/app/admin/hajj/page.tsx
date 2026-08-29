"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  buildDefaultHajjContent,
  type HajjPageContent,
  type HajjWhyIcon,
} from "@/data/hajj-content-defaults";
import type { Locale } from "@/data/mock";
import { HajjSeoBlockEditor } from "./HajjSeoBlockEditor";

const LOCALES: Locale[] = ["de", "en", "ar", "bs", "tr"];
const WHY_ICONS: HajjWhyIcon[] = [
  "experience",
  "support",
  "religious",
  "group",
  "onsite",
  "languages",
];

function Field({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  type?: string;
  hint?: string;
}) {
  const className = "mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm";
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      {hint ? <span className="mt-0.5 block text-xs text-muted">{hint}</span> : null}
      {multiline ? (
        <textarea
          className={className}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input className={className} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

export default function AdminHajjContentPage() {
  const [locale, setLocale] = useState<Locale>("de");
  const [content, setContent] = useState<HajjPageContent>(() => buildDefaultHajjContent());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/hajj-content?locale=${locale}`, { cache: "no-store" });
        if (!res.ok) throw new Error("fetch_failed");
        const data = (await res.json()) as { content: HajjPageContent };
        if (!cancelled) setContent(data.content);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  async function save() {
    setSaving(true);
    setToast(false);
    try {
      const res = await fetch("/api/admin/hajj-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, content }),
      });
      if (!res.ok) throw new Error("save_failed");
      const data = (await res.json()) as { content: HajjPageContent };
      setContent(data.content);
      setToast(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Hajj 2027 Inhalte</h1>
          <p className="mt-1 text-sm text-muted">
            Landingpage-Inhalte — gespeichert in <code>data/hajj-content.json</code>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="rounded-lg border border-line px-3 py-2 text-sm"
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
          >
            {LOCALES.map((loc) => (
              <option key={loc} value={loc}>
                {loc.toUpperCase()}
              </option>
            ))}
          </select>
          <Link href="/admin/hajj/steps" className="text-sm text-brand-cta">
            Schritte-Übersicht →
          </Link>
        </div>
      </div>

      {toast ? (
        <p className="mb-4 rounded-lg bg-brand-green-soft px-3 py-2 text-sm text-brand-green">
          Hajj-Inhalte gespeichert — die Landingpage aktualisiert sich sofort.
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted">Lade Inhalte …</p>
      ) : (
        <div className="space-y-6">
          <Section title="Hero">
            <Field label="Badge" value={content.hero.label} onChange={(v) => setContent((c) => ({ ...c, hero: { ...c.hero, label: v } }))} />
            <Field label="Titel Zeile 1" value={content.hero.title} onChange={(v) => setContent((c) => ({ ...c, hero: { ...c.hero, title: v } }))} />
            <Field label="Titel Zeile 2" value={content.hero.titleLine2} onChange={(v) => setContent((c) => ({ ...c, hero: { ...c.hero, titleLine2: v } }))} />
            <Field label="Hintergrundbild (URL)" value={content.hero.imageSrc} onChange={(v) => setContent((c) => ({ ...c, hero: { ...c.hero, imageSrc: v } }))} />
            <div className="md:col-span-2">
              <Field label="Einleitung" value={content.hero.body} onChange={(v) => setContent((c) => ({ ...c, hero: { ...c.hero, body: v } }))} multiline />
            </div>
            {content.hero.benefits.map((benefit, index) => (
              <Field
                key={index}
                label={`Vorteil ${index + 1}`}
                value={benefit}
                onChange={(v) =>
                  setContent((c) => {
                    const benefits = [...c.hero.benefits];
                    benefits[index] = v;
                    return { ...c, hero: { ...c.hero, benefits } };
                  })
                }
              />
            ))}
            <Field label="CTA" value={content.hero.cta} onChange={(v) => setContent((c) => ({ ...c, hero: { ...c.hero, cta: v } }))} />
            <Field label="Hinweis 1" value={content.hero.ctaFree} onChange={(v) => setContent((c) => ({ ...c, hero: { ...c.hero, ctaFree: v } }))} />
            <Field label="Hinweis 2" value={content.hero.ctaNoPay} onChange={(v) => setContent((c) => ({ ...c, hero: { ...c.hero, ctaNoPay: v } }))} />
          </Section>

          <Section title="Status-Banner">
            <Field label="Titel" value={content.status.title} onChange={(v) => setContent((c) => ({ ...c, status: { ...c.status, title: v } }))} />
            <Field label="CTA" value={content.status.cta} onChange={(v) => setContent((c) => ({ ...c, status: { ...c.status, cta: v } }))} />
            <div className="md:col-span-2">
              <Field label="Text" value={content.status.body} onChange={(v) => setContent((c) => ({ ...c, status: { ...c.status, body: v } }))} multiline />
            </div>
            <Field label="Kleingedruckt" value={content.status.note} onChange={(v) => setContent((c) => ({ ...c, status: { ...c.status, note: v } }))} />
          </Section>

          <Section title="Warum Mobarak?">
            <Field label="Eyebrow" value={content.why.eyebrow} onChange={(v) => setContent((c) => ({ ...c, why: { ...c.why, eyebrow: v } }))} />
            <Field label="Titel" value={content.why.title} onChange={(v) => setContent((c) => ({ ...c, why: { ...c.why, title: v } }))} />
            <div className="md:col-span-2">
              <Field label="Untertitel" value={content.why.subtitle} onChange={(v) => setContent((c) => ({ ...c, why: { ...c.why, subtitle: v } }))} multiline />
            </div>
            {content.why.cards.map((card, index) => (
              <div key={card.id} className="md:col-span-2 rounded-xl border border-line bg-surface/50 p-4">
                <p className="mb-3 text-xs font-bold text-muted">Karte {index + 1}</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block text-sm">
                    <span className="font-medium">Icon</span>
                    <select
                      className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm"
                      value={card.icon}
                      onChange={(e) =>
                        setContent((c) => {
                          const cards = [...c.why.cards];
                          cards[index] = { ...cards[index]!, icon: e.target.value as HajjWhyIcon };
                          return { ...c, why: { ...c.why, cards } };
                        })
                      }
                    >
                      {WHY_ICONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Field
                    label="Titel"
                    value={card.title}
                    onChange={(v) =>
                      setContent((c) => {
                        const cards = [...c.why.cards];
                        cards[index] = { ...cards[index]!, title: v };
                        return { ...c, why: { ...c.why, cards } };
                      })
                    }
                  />
                  <div className="md:col-span-2">
                    <Field
                      label="Text"
                      value={card.body}
                      onChange={(v) =>
                        setContent((c) => {
                          const cards = [...c.why.cards];
                          cards[index] = { ...cards[index]!, body: v };
                          return { ...c, why: { ...c.why, cards } };
                        })
                      }
                      multiline
                    />
                  </div>
                </div>
              </div>
            ))}
          </Section>

          <Section title="Ablauf (10 Schritte)">
            <div className="md:col-span-2">
              <Field label="Sektionstitel" value={content.process.title} onChange={(v) => setContent((c) => ({ ...c, process: { ...c.process, title: v } }))} />
            </div>
            {content.process.steps.map((step, index) => (
              <div key={step.id} className="md:col-span-2 rounded-xl border border-line p-4">
                <p className="mb-2 text-xs font-bold text-muted">
                  Schritt {step.num} — {step.title}
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field
                    label="Titel"
                    value={step.title}
                    onChange={(v) =>
                      setContent((c) => {
                        const steps = [...c.process.steps];
                        steps[index] = { ...steps[index]!, title: v };
                        return { ...c, process: { ...c.process, steps } };
                      })
                    }
                  />
                  <Field
                    label="Kurztext"
                    value={step.short}
                    onChange={(v) =>
                      setContent((c) => {
                        const steps = [...c.process.steps];
                        steps[index] = { ...steps[index]!, short: v };
                        return { ...c, process: { ...c.process, steps } };
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </Section>

          <Section title="Betreuung vor Ort (Journey)">
            <Field label="Eyebrow" value={content.journey.eyebrow} onChange={(v) => setContent((c) => ({ ...c, journey: { ...c.journey, eyebrow: v } }))} />
            <Field label="Titel" value={content.journey.title} onChange={(v) => setContent((c) => ({ ...c, journey: { ...c.journey, title: v } }))} />
            {content.journey.steps.map((step, index) => (
              <div key={step.id} className="md:col-span-2 rounded-xl border border-line p-4">
                <p className="mb-2 text-xs font-bold text-muted">
                  {step.num} — {step.title}
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field
                    label="Titel"
                    value={step.title}
                    onChange={(v) =>
                      setContent((c) => {
                        const steps = [...c.journey.steps];
                        steps[index] = { ...steps[index]!, title: v };
                        return { ...c, journey: { ...c.journey, steps } };
                      })
                    }
                  />
                  <Field
                    label="Bild (URL)"
                    value={step.imageSrc}
                    onChange={(v) =>
                      setContent((c) => {
                        const steps = [...c.journey.steps];
                        steps[index] = { ...steps[index]!, imageSrc: v };
                        return { ...c, journey: { ...c.journey, steps } };
                      })
                    }
                  />
                  <Field
                    label="Hajj-Tag (optional)"
                    value={step.dayLabel ?? ""}
                    onChange={(v) =>
                      setContent((c) => {
                        const steps = [...c.journey.steps];
                        steps[index] = { ...steps[index]!, dayLabel: v || undefined };
                        return { ...c, journey: { ...c.journey, steps } };
                      })
                    }
                  />
                  <Field
                    label="Modal-Titel (optional)"
                    value={step.modalTitle ?? ""}
                    onChange={(v) =>
                      setContent((c) => {
                        const steps = [...c.journey.steps];
                        steps[index] = { ...steps[index]!, modalTitle: v || undefined };
                        return { ...c, journey: { ...c.journey, steps } };
                      })
                    }
                  />
                  <div className="md:col-span-2">
                    <Field
                      label="Kurztext"
                      value={step.short}
                      onChange={(v) =>
                        setContent((c) => {
                          const steps = [...c.journey.steps];
                          steps[index] = { ...steps[index]!, short: v };
                          return { ...c, journey: { ...c.journey, steps } };
                        })
                      }
                      multiline
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Field
                      label="Modal-Text"
                      value={step.full}
                      onChange={(v) =>
                        setContent((c) => {
                          const steps = [...c.journey.steps];
                          steps[index] = { ...steps[index]!, full: v };
                          return { ...c, journey: { ...c.journey, steps } };
                        })
                      }
                      multiline
                    />
                  </div>
                </div>
              </div>
            ))}
          </Section>

          <Section title="SEO-Text (unter Journey)">
            <HajjSeoBlockEditor
              seo={content.seo}
              faqs={content.faqs}
              onChange={(seo) => setContent((c) => ({ ...c, seo }))}
            />
          </Section>

          <Section title="30+ Jahre Erfahrung">
            <Field
              label="Zahl"
              value={content.experience.stat}
              onChange={(v) =>
                setContent((c) => ({ ...c, experience: { ...c.experience, stat: v } }))
              }
            />
            <Field
              label="Überschrift"
              value={content.experience.heading}
              onChange={(v) =>
                setContent((c) => ({ ...c, experience: { ...c.experience, heading: v } }))
              }
            />
            <div className="md:col-span-2">
              <Field
                label="Text"
                value={content.experience.body}
                onChange={(v) =>
                  setContent((c) => ({ ...c, experience: { ...c.experience, body: v } }))
                }
                multiline
              />
            </div>
            {content.experience.slides.map((slide, index) => (
              <div key={slide.id} className="md:col-span-2 rounded-xl border border-line p-4">
                <p className="mb-2 text-xs font-bold text-muted">Foto {index + 1}</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field
                    label="Beschriftung"
                    value={slide.label}
                    onChange={(v) =>
                      setContent((c) => {
                        const slides = [...c.experience.slides];
                        slides[index] = { ...slides[index]!, label: v };
                        return { ...c, experience: { ...c.experience, slides } };
                      })
                    }
                  />
                  <Field
                    label="Bild (URL)"
                    value={slide.imageSrc}
                    onChange={(v) =>
                      setContent((c) => {
                        const slides = [...c.experience.slides];
                        slides[index] = { ...slides[index]!, imageSrc: v };
                        return { ...c, experience: { ...c.experience, slides } };
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </Section>

          <Section title="FAQ">
            {content.faqs.map((faq, index) => (
              <div key={faq.id} className="md:col-span-2 rounded-xl border border-line p-4">
                <Field
                  label={`Frage ${index + 1}`}
                  value={faq.question}
                  onChange={(v) =>
                    setContent((c) => {
                      const faqs = [...c.faqs];
                      faqs[index] = { ...faqs[index]!, question: v };
                      return { ...c, faqs };
                    })
                  }
                />
                <div className="mt-3">
                  <Field
                    label="Antwort"
                    value={faq.answer}
                    onChange={(v) =>
                      setContent((c) => {
                        const faqs = [...c.faqs];
                        faqs[index] = { ...faqs[index]!, answer: v };
                        return { ...c, faqs };
                      })
                    }
                    multiline
                  />
                </div>
              </div>
            ))}
          </Section>

          <Section title="Abschluss-CTA">
            <Field label="Titel" value={content.finalCta.title} onChange={(v) => setContent((c) => ({ ...c, finalCta: { ...c.finalCta, title: v } }))} />
            <Field label="Hintergrundbild (URL)" value={content.finalCta.imageSrc} onChange={(v) => setContent((c) => ({ ...c, finalCta: { ...c.finalCta, imageSrc: v } }))} />
            <div className="md:col-span-2">
              <Field label="Text" value={content.finalCta.body} onChange={(v) => setContent((c) => ({ ...c, finalCta: { ...c.finalCta, body: v } }))} multiline />
            </div>
            {content.finalCta.features.map((feature, index) => (
              <Field
                key={index}
                label={`Merkmal ${index + 1}`}
                value={feature}
                onChange={(v) =>
                  setContent((c) => {
                    const features = [...c.finalCta.features];
                    features[index] = v;
                    return { ...c, finalCta: { ...c.finalCta, features } };
                  })
                }
              />
            ))}
            <Field label="CTA" value={content.finalCta.cta} onChange={(v) => setContent((c) => ({ ...c, finalCta: { ...c.finalCta, cta: v } }))} />
            <Field label="Hinweis" value={content.finalCta.ctaFree} onChange={(v) => setContent((c) => ({ ...c, finalCta: { ...c.finalCta, ctaFree: v } }))} />
          </Section>

          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="rounded-xl bg-brand-cta px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Speichern …" : "Änderungen speichern"}
          </button>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <h2 className="mb-4 font-bold">{title}</h2>
      <div className="grid gap-3 md:grid-cols-2">{children}</div>
    </section>
  );
}
