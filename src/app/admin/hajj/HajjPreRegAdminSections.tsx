"use client";

import type { Dispatch, SetStateAction } from "react";
import type { HajjPageContent } from "@/data/hajj-content-defaults";
import type { HajjPreRegBenefit, HajjPreRegBenefitIcon, HajjPreRegSourceOption } from "@/data/hajj-pre-reg-content";
import { HAJJ_SOURCE_OPTION_VALUES, HAJJ_YEAR_PLACEHOLDER } from "@/data/hajj-pre-reg-content";
import { RESIDENCE_COUNTRIES } from "@/lib/residence-countries";

const BENEFIT_ICONS: HajjPreRegBenefitIcon[] = ["shield", "users", "clipboard", "award"];

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
        <textarea className={className} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={className} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-card md:p-6">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

export function HajjPreRegAdminSections({
  content,
  setContent,
  campaignYear,
}: {
  content: HajjPageContent;
  setContent: Dispatch<SetStateAction<HajjPageContent>>;
  campaignYear: number;
}) {
  const yearHint = `Platzhalter ${HAJJ_YEAR_PLACEHOLDER} = Hajj-Jahr (${campaignYear})`;

  return (
    <div className="space-y-6">
      <Section title="Voranmeldung — Hero">
        <p className="md:col-span-2 text-sm text-muted">{yearHint}</p>
        <Field
          label="Badge"
          value={content.preReg.hero.label}
          onChange={(v) => setContent((c) => ({ ...c, preReg: { ...c.preReg, hero: { ...c.preReg.hero, label: v } } }))}
        />
        <Field
          label="Hintergrundbild (URL)"
          value={content.preReg.hero.imageSrc}
          onChange={(v) => setContent((c) => ({ ...c, preReg: { ...c.preReg, hero: { ...c.preReg.hero, imageSrc: v } } }))}
        />
        <div className="md:col-span-2">
          <Field
            label="Titel Zeile 1"
            value={content.preReg.hero.title}
            onChange={(v) => setContent((c) => ({ ...c, preReg: { ...c.preReg, hero: { ...c.preReg.hero, title: v } } }))}
          />
        </div>
        <div className="md:col-span-2">
          <Field
            label="Titel Zeile 2"
            value={content.preReg.hero.titleLine2 ?? ""}
            onChange={(v) =>
              setContent((c) => ({
                ...c,
                preReg: { ...c.preReg, hero: { ...c.preReg.hero, titleLine2: v } },
              }))
            }
          />
        </div>
        <div className="md:col-span-2">
          <Field
            label="Text"
            value={content.preReg.hero.body}
            onChange={(v) => setContent((c) => ({ ...c, preReg: { ...c.preReg, hero: { ...c.preReg.hero, body: v } } }))}
            multiline
          />
        </div>
      </Section>

      <Section title="Voranmeldung — Vorteile">
        {content.preReg.benefits.map((benefit: HajjPreRegBenefit, index: number) => (
          <div key={benefit.id} className="md:col-span-2 rounded-xl border border-line p-4">
            <p className="mb-3 text-xs font-bold text-muted">Vorteil {index + 1}</p>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium">Icon</span>
                <select
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm"
                  value={benefit.icon}
                  onChange={(e) =>
                    setContent((c) => {
                      const benefits = [...c.preReg.benefits];
                      benefits[index] = { ...benefits[index]!, icon: e.target.value as HajjPreRegBenefitIcon };
                      return { ...c, preReg: { ...c.preReg, benefits } };
                    })
                  }
                >
                  {BENEFIT_ICONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                label="Titel"
                value={benefit.title}
                onChange={(v) =>
                  setContent((c) => {
                    const benefits = [...c.preReg.benefits];
                    benefits[index] = { ...benefits[index]!, title: v };
                    return { ...c, preReg: { ...c.preReg, benefits } };
                  })
                }
              />
              <div className="md:col-span-2">
                <Field
                  label="Text"
                  value={benefit.body}
                  onChange={(v) =>
                    setContent((c) => {
                      const benefits = [...c.preReg.benefits];
                      benefits[index] = { ...benefits[index]!, body: v };
                      return { ...c, preReg: { ...c.preReg, benefits } };
                    })
                  }
                  multiline
                />
              </div>
              {benefit.highlight ? (
                <div className="md:col-span-2">
                  <Field
                    label="Hinweis (hervorgehoben)"
                    value={benefit.emphasis ?? ""}
                    onChange={(v) =>
                      setContent((c) => {
                        const benefits = [...c.preReg.benefits];
                        benefits[index] = { ...benefits[index]!, emphasis: v };
                        return { ...c, preReg: { ...c.preReg, benefits } };
                      })
                    }
                    multiline
                  />
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </Section>

      <Section title="Voranmeldung — Formular & Texte">
        <Field
          label="Abschnitt 1 — Titel"
          value={content.preReg.sections.travellerCount.title}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              preReg: { ...c.preReg, sections: { ...c.preReg.sections, travellerCount: { ...c.preReg.sections.travellerCount, title: v } } },
            }))
          }
        />
        <Field
          label="Abschnitt 1 — Hinweis"
          value={content.preReg.sections.travellerCount.hint}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              preReg: { ...c.preReg, sections: { ...c.preReg.sections, travellerCount: { ...c.preReg.sections.travellerCount, hint: v } } },
            }))
          }
        />
        <Field
          label="Abschnitt 2 — Titel"
          value={content.preReg.sections.travellerDetails.title}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              preReg: { ...c.preReg, sections: { ...c.preReg.sections, travellerDetails: { ...c.preReg.sections.travellerDetails, title: v } } },
            }))
          }
        />
        <Field
          label="Abschnitt 2 — Hinweis"
          value={content.preReg.sections.travellerDetails.hint}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              preReg: { ...c.preReg, sections: { ...c.preReg.sections, travellerDetails: { ...c.preReg.sections.travellerDetails, hint: v } } },
            }))
          }
        />
        <Field
          label="Abschnitt 3 — Titel"
          value={content.preReg.sections.contact.title}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              preReg: { ...c.preReg, sections: { ...c.preReg.sections, contact: { ...c.preReg.sections.contact, title: v } } },
            }))
          }
        />
        <Field
          label="Abschnitt 3 — Hinweis"
          value={content.preReg.sections.contact.hint}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              preReg: { ...c.preReg, sections: { ...c.preReg.sections, contact: { ...c.preReg.sections.contact, hint: v } } },
            }))
          }
        />
        <Field
          label="Abschnitt 4 — Titel"
          value={content.preReg.sections.source.title}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              preReg: { ...c.preReg, sections: { ...c.preReg.sections, source: { ...c.preReg.sections.source, title: v } } },
            }))
          }
        />
        <Field
          label="Abschnitt 4 — Hinweis"
          value={content.preReg.sections.source.hint}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              preReg: { ...c.preReg, sections: { ...c.preReg.sections, source: { ...c.preReg.sections.source, hint: v } } },
            }))
          }
        />
      </Section>

      <Section title="Voranmeldung — Quellen">
        <p className="md:col-span-2 text-sm text-muted">
          Feste Werte: {HAJJ_SOURCE_OPTION_VALUES.join(", ")}. Labels pro Sprache anpassbar; deaktivierte Optionen werden ausgeblendet.
        </p>
        {content.preReg.sourceOptions.map((option: HajjPreRegSourceOption, index: number) => (
          <div key={option.value} className="md:col-span-2 flex flex-wrap items-end gap-3 rounded-xl border border-line p-4">
            <div className="min-w-[7rem] text-sm font-semibold text-muted">{option.value}</div>
            <div className="min-w-0 flex-1">
              <Field
                label="Label"
                value={option.label}
                onChange={(v) =>
                  setContent((c) => {
                    const sourceOptions = [...c.preReg.sourceOptions];
                    sourceOptions[index] = { ...sourceOptions[index]!, label: v };
                    return { ...c, preReg: { ...c.preReg, sourceOptions } };
                  })
                }
              />
            </div>
            <label className="flex items-center gap-2 pb-2 text-sm">
              <input
                type="checkbox"
                checked={option.enabled}
                onChange={(e) =>
                  setContent((c) => {
                    const sourceOptions = [...c.preReg.sourceOptions];
                    sourceOptions[index] = { ...sourceOptions[index]!, enabled: e.target.checked };
                    return { ...c, preReg: { ...c.preReg, sourceOptions } };
                  })
                }
              />
              Aktiv
            </label>
          </div>
        ))}
      </Section>

      <Section title="Voranmeldung — Wohnsitzländer">
        <p className="md:col-span-2 text-sm text-muted">
          Verfügbare Länder für Wohnsitz und Telefonvorwahl. Optional eigenes Label pro Sprache (leer = Standard).
        </p>
        {RESIDENCE_COUNTRIES.map((country) => {
          const index = content.preReg.residenceCountries.findIndex((item: { code: string }) => item.code === country.code);
          const config = content.preReg.residenceCountries[index];
          if (!config) return null;
          return (
            <div key={country.code} className="md:col-span-2 flex flex-wrap items-end gap-3 rounded-xl border border-line p-4">
              <div className="min-w-[5rem] text-sm font-semibold">
                {country.flag} {country.code}
              </div>
              <div className="min-w-0 flex-1">
                <Field
                  label="Label (optional)"
                  value={config.label ?? ""}
                  onChange={(v) =>
                    setContent((c) => {
                      const residenceCountries = [...c.preReg.residenceCountries];
                      residenceCountries[index] = { ...residenceCountries[index]!, label: v };
                      return { ...c, preReg: { ...c.preReg, residenceCountries } };
                    })
                  }
                />
              </div>
              <label className="flex items-center gap-2 pb-2 text-sm">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) =>
                    setContent((c) => {
                      const residenceCountries = [...c.preReg.residenceCountries];
                      residenceCountries[index] = { ...residenceCountries[index]!, enabled: e.target.checked };
                      return { ...c, preReg: { ...c.preReg, residenceCountries } };
                    })
                  }
                />
                Aktiv
              </label>
            </div>
          );
        })}
      </Section>

      <Section title="Voranmeldung — Reisepass-Arten">
        <p className="md:col-span-2 text-sm text-muted">IDs (normal, convention, travel, diplomatic) sind fest.</p>
        {content.preReg.passportTypes.map((option: { id: string; label: string }, index: number) => (
          <Field
            key={option.id}
            label={`Option: ${option.id}`}
            hint="Label in der gewählten Sprache"
            value={option.label}
            onChange={(v) =>
              setContent((c) => {
                const passportTypes = [...c.preReg.passportTypes];
                passportTypes[index] = { ...passportTypes[index]!, label: v };
                return { ...c, preReg: { ...c.preReg, passportTypes } };
              })
            }
          />
        ))}
      </Section>

      <Section title="Voranmeldung — Datenschutz, CTA & Erfolg">
        <Field
          label="Datenschutz — Titel"
          value={content.preReg.privacy.title}
          onChange={(v) => setContent((c) => ({ ...c, preReg: { ...c.preReg, privacy: { ...c.preReg.privacy, title: v } } }))}
        />
        <Field
          label="Datenschutz — SSL"
          value={content.preReg.privacy.ssl}
          onChange={(v) => setContent((c) => ({ ...c, preReg: { ...c.preReg, privacy: { ...c.preReg.privacy, ssl: v } } }))}
        />
        <div className="md:col-span-2">
          <Field
            label="Datenschutz — Text"
            value={content.preReg.privacy.body}
            onChange={(v) => setContent((c) => ({ ...c, preReg: { ...c.preReg, privacy: { ...c.preReg.privacy, body: v } } }))}
            multiline
          />
        </div>
        <Field
          label="CTA — Button"
          value={content.preReg.cta.submit}
          onChange={(v) => setContent((c) => ({ ...c, preReg: { ...c.preReg, cta: { ...c.preReg.cta, submit: v } } }))}
        />
        <Field
          label="CTA — Kostenlos-Hinweis"
          value={content.preReg.cta.free}
          onChange={(v) => setContent((c) => ({ ...c, preReg: { ...c.preReg, cta: { ...c.preReg.cta, free: v } } }))}
        />
        <Field
          label="Info — Titel"
          value={content.preReg.cta.infoTitle}
          onChange={(v) => setContent((c) => ({ ...c, preReg: { ...c.preReg, cta: { ...c.preReg.cta, infoTitle: v } } }))}
        />
        <div className="md:col-span-2">
          <Field
            label="Info — Lead"
            value={content.preReg.cta.infoLead}
            onChange={(v) => setContent((c) => ({ ...c, preReg: { ...c.preReg, cta: { ...c.preReg.cta, infoLead: v } } }))}
            multiline
          />
        </div>
        <div className="md:col-span-2">
          <Field
            label="Info — Follow-up"
            value={content.preReg.cta.infoFollowUp}
            onChange={(v) => setContent((c) => ({ ...c, preReg: { ...c.preReg, cta: { ...c.preReg.cta, infoFollowUp: v } } }))}
            multiline
          />
        </div>
        <Field
          label="Erfolg — Titel"
          value={content.preReg.success.title}
          onChange={(v) => setContent((c) => ({ ...c, preReg: { ...c.preReg, success: { ...c.preReg.success, title: v } } }))}
        />
        <Field
          label="Erfolg — Zurück-Link"
          value={content.preReg.success.backToHajj}
          onChange={(v) => setContent((c) => ({ ...c, preReg: { ...c.preReg, success: { ...c.preReg.success, backToHajj: v } } }))}
        />
        <div className="md:col-span-2">
          <Field
            label="Erfolg — Text"
            value={content.preReg.success.body}
            onChange={(v) => setContent((c) => ({ ...c, preReg: { ...c.preReg, success: { ...c.preReg.success, body: v } } }))}
            multiline
          />
        </div>
        {content.preReg.trust.map((item: string, index: number) => (
          <Field
            key={`trust-${index}`}
            label={`Trust-Bar ${index + 1}`}
            value={item}
            onChange={(v) =>
              setContent((c) => {
                const trust = [...c.preReg.trust];
                trust[index] = v;
                return { ...c, preReg: { ...c.preReg, trust } };
              })
            }
          />
        ))}
      </Section>

      <Section title="Voranmeldung — SEO">
        <Field
          label="Meta-Titel"
          value={content.preReg.seo.title}
          onChange={(v) => setContent((c) => ({ ...c, preReg: { ...c.preReg, seo: { ...c.preReg.seo, title: v } } }))}
        />
        <div className="md:col-span-2">
          <Field
            label="Meta-Beschreibung"
            value={content.preReg.seo.description}
            onChange={(v) => setContent((c) => ({ ...c, preReg: { ...c.preReg, seo: { ...c.preReg.seo, description: v } } }))}
            multiline
          />
        </div>
      </Section>
    </div>
  );
}
