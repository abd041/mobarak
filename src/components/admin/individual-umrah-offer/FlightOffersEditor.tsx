"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Luggage } from "lucide-react";
import {
  AIRLINES_CATALOG_EVENT,
  listActiveAirlines,
  type CatalogAirline,
} from "@/lib/airlines-store";
import type { IndividualUmrahInquiry } from "@/lib/individual-umrah-inquiry";
import { inquiryBaggagePreferenceLabel } from "@/lib/individual-umrah-inquiry-summary";
import type {
  OfferFlightConnection,
  OfferFlightLeg,
  OfferFlightOption,
  OfferFlightSegment,
} from "@/lib/individual-umrah-offer";
import {
  addFlightConnection,
  airportCityLabel,
  emptyFlightConnection,
  emptyFlightLeg,
  emptyFlightOption,
  emptyFlightSegment,
  removeLastFlightConnection,
} from "@/lib/individual-umrah-offer-defaults";
import { formatFlightBaggageLines } from "@/lib/individual-umrah-offer-pricing";
import { moveHotelOption } from "@/components/admin/individual-umrah-offer/HotelCityOfferEditor";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand-cta";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-navy">{label}</span>
      {children}
    </label>
  );
}

function FlightLegEditor({
  title,
  leg,
  onChange,
}: {
  title: string;
  leg: OfferFlightLeg;
  onChange: (leg: OfferFlightLeg) => void;
}) {
  function setLeg(next: OfferFlightLeg) {
    onChange(emptyFlightLeg(next));
  }

  function updateSegment(index: number, patch: Partial<OfferFlightSegment>) {
    const segments = leg.segments.map((s, i) =>
      i === index ? emptyFlightSegment({ ...s, ...patch }) : s,
    );
    setLeg({ ...leg, segments });
  }

  function updateConnection(index: number, patch: Partial<OfferFlightConnection>) {
    const connections = leg.connections.map((c, i) => {
      if (i !== index) return c;
      const next = emptyFlightConnection({ ...c, ...patch });
      if (patch.airportCode !== undefined && !patch.cityLabel) {
        next.cityLabel = airportCityLabel(next.airportCode);
      }
      return next;
    });
    setLeg({ ...leg, connections });
  }

  return (
    <div className="rounded-lg bg-surface p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase text-muted">{title}</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="text-xs font-semibold text-brand-cta"
            onClick={() => setLeg(addFlightConnection(leg, "IST"))}
          >
            + Zwischenstopp hinzufügen
          </button>
          <button
            type="button"
            className="text-xs font-semibold text-red-600 disabled:opacity-40"
            disabled={leg.segments.length <= 1}
            onClick={() => setLeg(removeLastFlightConnection(leg))}
          >
            Letzten Zwischenstopp entfernen
          </button>
        </div>
      </div>

      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <Field label="Datum">
          <input
            className={inputClass}
            value={leg.dateLabel}
            onChange={(e) => setLeg({ ...leg, dateLabel: e.target.value })}
            placeholder="12.10.2026"
          />
        </Field>
        <Field label="Gesamtreisedauer">
          <input
            className={inputClass}
            value={leg.duration}
            onChange={(e) => setLeg({ ...leg, duration: e.target.value })}
            placeholder="9h 00m"
          />
        </Field>
      </div>

      <p className="mb-2 text-[11px] text-muted">
        {leg.segments.length <= 1
          ? "Direktflug (1 Segment). Zwischenstopp hinzufügen für Strecken wie VIE → IST → MED."
          : `${leg.segments.length} Segmente · ${leg.connections.length} Zwischenstopp(s)`}
      </p>

      <div className="space-y-3">
        {leg.segments.map((seg, i) => (
          <div key={i} className="rounded-lg border border-line bg-white p-3">
            <p className="mb-2 text-xs font-semibold text-navy">
              Segment {i + 1}
              {leg.segments.length === 1 ? " (direkt)" : ""}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Abflughafen">
                <input
                  className={inputClass}
                  value={seg.fromCode}
                  onChange={(e) => updateSegment(i, { fromCode: e.target.value })}
                  placeholder="VIE"
                />
              </Field>
              <Field label="Abflugzeit">
                <input
                  className={inputClass}
                  value={seg.departTime}
                  onChange={(e) => updateSegment(i, { departTime: e.target.value })}
                  placeholder="10:30"
                />
              </Field>
              <Field label="Ankunftsflughafen">
                <input
                  className={inputClass}
                  value={seg.toCode}
                  onChange={(e) => updateSegment(i, { toCode: e.target.value })}
                  placeholder="IST"
                />
              </Field>
              <Field label="Ankunftszeit">
                <input
                  className={inputClass}
                  value={seg.arriveTime}
                  onChange={(e) => updateSegment(i, { arriveTime: e.target.value })}
                  placeholder="14:05"
                />
              </Field>
            </div>

            {leg.connections[i] ? (
              <div className="mt-3 rounded-lg border border-dashed border-brand-cta/30 bg-[#EEF5FB] p-3">
                <p className="mb-2 text-xs font-semibold text-brand-cta">
                  Zwischenstopp nach Segment {i + 1}
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <Field label="Flughafencode">
                    <input
                      className={inputClass}
                      value={leg.connections[i]!.airportCode}
                      onChange={(e) =>
                        updateConnection(i, { airportCode: e.target.value.toUpperCase() })
                      }
                      placeholder="IST"
                    />
                  </Field>
                  <Field label="Stadt / Bezeichnung">
                    <input
                      className={inputClass}
                      value={leg.connections[i]!.cityLabel}
                      onChange={(e) => updateConnection(i, { cityLabel: e.target.value })}
                      placeholder="Istanbul"
                    />
                  </Field>
                  <Field label="Aufenthaltsdauer">
                    <input
                      className={inputClass}
                      value={leg.connections[i]!.duration}
                      onChange={(e) => updateConnection(i, { duration: e.target.value })}
                      placeholder="2h 10m"
                    />
                  </Field>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FlightOffersEditor({
  inquiry,
  flights,
  onChange,
}: {
  inquiry: IndividualUmrahInquiry;
  flights: OfferFlightOption[];
  onChange: (flights: OfferFlightOption[]) => void;
}) {
  const baggagePreference = inquiryBaggagePreferenceLabel(inquiry);
  const needsEnoughBaggage =
    inquiry.offer_prefs?.travel_priorities?.includes("enough_baggage") ?? false;
  const [airlines, setAirlines] = useState<CatalogAirline[]>([]);

  useEffect(() => {
    setAirlines(listActiveAirlines());
    const onUpdate = () => setAirlines(listActiveAirlines());
    window.addEventListener(AIRLINES_CATALOG_EVENT, onUpdate);
    return () => window.removeEventListener(AIRLINES_CATALOG_EVENT, onUpdate);
  }, []);

  function updateFlight(index: number, patch: Partial<OfferFlightOption>) {
    onChange(flights.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  function addAirline(airlineId: string) {
    onChange([...flights, emptyFlightOption({ inquiry, airlineId })]);
  }

  const quickAdd = airlines.slice(0, 4);

  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-navy">1. Flugangebote</h2>
        <p className="mt-1 text-sm text-muted">
          Flugoptionen und Preise werden <strong>pro Anfrage manuell</strong> erfasst. Airline aus
          dem globalen Katalog wählen (Name + Logo); aktuellen Preis (€ / Person) hier eintragen.
        </p>
        <p className="mt-1 text-xs text-muted">
          Airlines verwalten unter{" "}
          <a href="/admin/airlines" className="font-semibold text-brand-cta">
            Admin → Airlines
          </a>
          . Mehrere Flüge = <strong>Alternativen</strong> (Kunde wählt eine) — nicht mit Hotels zu
          einem Paketpreis addieren. <strong>Gepäck</strong> und <strong>Preis pro Person</strong>{" "}
          sind zentrale PDF-Spalten.
        </p>
      </div>

      {baggagePreference ? (
        <div
          className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 ${
            needsEnoughBaggage
              ? "border-amber-300 bg-amber-50"
              : "border-line bg-surface/60"
          }`}
        >
          <Luggage
            className={`mt-0.5 h-5 w-5 shrink-0 ${
              needsEnoughBaggage ? "text-amber-700" : "text-muted"
            }`}
            strokeWidth={2}
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Gepäckwunsch des Kunden
            </p>
            <p className="mt-0.5 text-sm font-semibold text-navy">{baggagePreference}</p>
            <p className="mt-1 text-xs text-muted">
              Freigepäck (+ Handgepäck) klar pro Airline eintragen — erscheint in der PDF-Spalte{" "}
              <strong>Gepäck</strong>.
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-line bg-surface/40 px-4 py-3">
          <Luggage className="mt-0.5 h-5 w-5 shrink-0 text-muted" strokeWidth={2} />
          <p className="text-xs text-muted">
            Kein Gepäck-Schwerpunkt in der Anfrage. Trotzdem <strong>Gepäck</strong> für jeden
            Flug ausfüllen — feste PDF-Spalten: Airline · Hinflug · Rückflug · Gepäck ·
            Gesamtdauer · Preis pro Person.
          </p>
        </div>
      )}

      <div className="mb-5 rounded-xl border border-dashed border-line bg-surface/40 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Flugangebot hinzufügen
        </p>
        <div className="flex flex-wrap gap-2">
          {quickAdd.map((airline) => {
            const already = flights.some((f) => f.airlineId === airline.id);
            return (
              <button
                key={airline.id}
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-navy hover:border-brand-cta/50"
                onClick={() => addAirline(airline.id)}
              >
                {airline.logo ? (
                  <span className="relative h-5 w-8 shrink-0">
                    <Image
                      src={airline.logo}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="32px"
                      unoptimized={airline.logo.startsWith("http")}
                    />
                  </span>
                ) : null}
                {airline.name}
                {already ? " +" : ""}
              </button>
            );
          })}
          <button
            type="button"
            className="rounded-lg bg-brand-cta px-3 py-2 text-sm font-semibold text-white"
            onClick={() => addAirline("")}
          >
            Leeres Flugangebot
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {flights.length === 0 ? (
          <p className="rounded-xl border border-line bg-surface/30 px-4 py-6 text-center text-sm text-muted">
            Noch keine Flugangebote. Airline aus dem Katalog wählen.
          </p>
        ) : null}

        {flights.map((flight, index) => {
          const baggageLines = formatFlightBaggageLines(flight);
          const baggageSummary =
            baggageLines[0] === "—" ? null : baggageLines.join(" · ");

          return (
            <div key={flight.id} className="rounded-xl border border-line p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm font-semibold text-navy">
                      {flight.airlineName || `Flugoption ${index + 1}`}
                      <span className="ms-2 font-normal text-muted">· PDF-Zeile {index + 1}</span>
                    </p>
                  </div>
                  {baggageSummary ? (
                    <p className="ms-9 mt-1 flex items-center gap-1.5 text-xs font-medium text-navy">
                      <Luggage className="h-3.5 w-3.5 shrink-0 text-muted" strokeWidth={2} />
                      {baggageSummary}
                    </p>
                  ) : (
                    <p className="ms-9 mt-1 text-xs font-medium text-amber-700">
                      Gepäck fehlt — für den PDF-Vergleich erforderlich
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-2 rounded-xl border border-brand-green/30 bg-brand-green-soft px-3 py-2">
                    <span className="text-xs font-semibold text-brand-green">
                      Preis / Person € (manuell)
                    </span>
                    <input
                      type="number"
                      min={0}
                      className="w-24 rounded-lg border border-line bg-white px-2 py-1.5 text-sm font-bold text-navy outline-none focus:border-brand-cta"
                      value={flight.pricePerPerson}
                      onChange={(e) =>
                        updateFlight(index, { pricePerPerson: Number(e.target.value) || 0 })
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="rounded-lg border border-line px-2 py-1.5 text-xs font-semibold text-navy disabled:opacity-40"
                    disabled={index === 0}
                    onClick={() => onChange(moveHotelOption(flights, index, index - 1))}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-line px-2 py-1.5 text-xs font-semibold text-navy disabled:opacity-40"
                    disabled={index >= flights.length - 1}
                    onClick={() => onChange(moveHotelOption(flights, index, index + 1))}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => onChange(flights.filter((_, i) => i !== index))}
                  >
                    Entfernen
                  </button>
                </div>
              </div>

              <div className="mb-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <Field label="Airline (Katalog)">
                  <select
                    className={inputClass}
                    value={flight.airlineId}
                    onChange={(e) => {
                      const id = e.target.value;
                      const airline = airlines.find((a) => a.id === id);
                      updateFlight(index, {
                        airlineId: id || "",
                        airlineName: airline?.name ?? flight.airlineName,
                        logo: airline?.logo ?? (id ? "" : flight.logo),
                      });
                    }}
                  >
                    <option value="">— Manuell / ohne Katalog —</option>
                    {airlines.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Anzeigename (PDF)">
                  <input
                    className={inputClass}
                    value={flight.airlineName}
                    onChange={(e) => updateFlight(index, { airlineName: e.target.value })}
                  />
                </Field>
                <Field label="Logo (aus Katalog)">
                  <input
                    className={inputClass}
                    value={flight.logo}
                    readOnly={Boolean(flight.airlineId)}
                    onChange={(e) => updateFlight(index, { logo: e.target.value })}
                    placeholder="Wird aus Airlines übernommen"
                  />
                </Field>
                <Field label="Gesamtdauer (PDF)">
                  <input
                    className={inputClass}
                    value={flight.totalDuration}
                    onChange={(e) => updateFlight(index, { totalDuration: e.target.value })}
                  />
                </Field>
              </div>

              <div className="mb-4 rounded-xl border border-navy/15 bg-[#F7F9FB] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Luggage className="h-4 w-4 text-navy" strokeWidth={2} />
                  <p className="text-sm font-bold text-navy">Gepäck (PDF-Spalte)</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Freigepäck">
                    <input
                      className={inputClass}
                      value={flight.checkedBaggage}
                      onChange={(e) => {
                        const checkedBaggage = e.target.value;
                        updateFlight(index, {
                          checkedBaggage,
                          checkedBaggageSpec: (() => {
                            const piecesMatch = checkedBaggage.match(
                              /(\d+)\s*[×xX]\s*(\d+)\s*kg/i,
                            );
                            if (piecesMatch) {
                              return {
                                kind: "checked" as const,
                                pieces: Number(piecesMatch[1]) || 1,
                                kg: Number(piecesMatch[2]) || 0,
                              };
                            }
                            const kg = checkedBaggage.match(/(\d+)\s*kg/i);
                            return kg
                              ? {
                                  kind: "checked" as const,
                                  pieces: 1,
                                  kg: Number(kg[1]) || 0,
                                }
                              : flight.checkedBaggageSpec;
                          })(),
                        });
                      }}
                      placeholder="2 × 23 kg Freigepäck"
                    />
                  </Field>
                  <Field label="Handgepäck">
                    <input
                      className={inputClass}
                      value={flight.handBaggage}
                      onChange={(e) => {
                        const handBaggage = e.target.value;
                        const kg = handBaggage.match(/(\d+)\s*kg/i);
                        updateFlight(index, {
                          handBaggage,
                          handBaggageSpec: kg
                            ? {
                                kind: "hand",
                                pieces: 1,
                                kg: Number(kg[1]) || 0,
                              }
                            : flight.handBaggageSpec,
                        });
                      }}
                      placeholder="7 kg Handgepäck"
                    />
                  </Field>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(
                    [
                      ["2 × 23 kg Freigepäck", "7 kg Handgepäck"],
                      ["2 × 20 kg Freigepäck", "7 kg Handgepäck"],
                      ["1 × 23 kg Freigepäck", "7 kg Handgepäck"],
                    ] as const
                  ).map(([checked, hand]) => (
                    <button
                      key={checked}
                      type="button"
                      className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-semibold text-navy hover:border-brand-cta/50"
                      onClick={() =>
                        updateFlight(index, {
                          checkedBaggage: checked,
                          handBaggage: hand,
                          checkedBaggageSpec: {
                            kind: "checked",
                            pieces: Number(checked.match(/^(\d+)/)?.[1] ?? 2),
                            kg: Number(checked.match(/×\s*(\d+)/)?.[1] ?? 23),
                          },
                          handBaggageSpec: {
                            kind: "hand",
                            pieces: 1,
                            kg: Number(hand.match(/(\d+)/)?.[1] ?? 7),
                          },
                        })
                      }
                    >
                      {checked}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <FlightLegEditor
                  title="Hinflug"
                  leg={flight.outbound}
                  onChange={(outbound) => updateFlight(index, { outbound })}
                />
                <FlightLegEditor
                  title="Rückflug"
                  leg={flight.inbound}
                  onChange={(inbound) => updateFlight(index, { inbound })}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
