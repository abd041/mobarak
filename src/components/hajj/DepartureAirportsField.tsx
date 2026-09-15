"use client";

import { useId, useRef, useState } from "react";
import { Plane, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAVY = "#0B2A55";
const CTA_BLUE = "#1264F5";

type DepartureAirportsFieldProps = {
  label: string;
  placeholder: string;
  addLabel: string;
  value: string[];
  onChange: (airports: string[]) => void;
  className?: string;
  inputClassName?: string;
};

function normalizeAirport(raw: string) {
  return raw.trim().replace(/\s+/g, " ");
}

export function DepartureAirportsField({
  label,
  placeholder,
  addLabel,
  value,
  onChange,
  className,
  inputClassName,
}: DepartureAirportsFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");

  function addAirport(raw: string = draft) {
    const next = normalizeAirport(raw);
    if (!next) return false;
    const exists = value.some((item) => item.toLowerCase() === next.toLowerCase());
    if (exists) {
      setDraft("");
      return false;
    }
    onChange([...value, next]);
    setDraft("");
    return true;
  }

  function removeAirport(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className={cn("block", className)}>
      <label htmlFor={inputId} className="mb-2 block text-[13px] font-semibold" style={{ color: NAVY }}>
        {label}
      </label>

      {value.length > 0 ? (
        <ul className="mb-2.5 flex flex-wrap gap-2" aria-label={label}>
          {value.map((airport, index) => (
            <li key={`${airport}-${index}`}>
              <span
                className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#D7E4F7] bg-[#F3F8FF] py-1.5 ps-3 pe-1.5 text-[13px] font-medium"
                style={{ color: NAVY }}
              >
                <span className="min-w-0 truncate">{airport}</span>
                <button
                  type="button"
                  onClick={() => removeAirport(index)}
                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#6B829E] transition hover:bg-white hover:text-[#1264F5]"
                  aria-label={`Remove ${airport}`}
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="relative">
        <Plane
          className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
          style={{ color: CTA_BLUE }}
          strokeWidth={1.8}
          aria-hidden
        />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addAirport();
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            "w-full rounded-[10px] border border-[#DDE3EC] bg-white py-[0.8rem] pe-3.5 ps-10 text-[14px] text-navy outline-none transition placeholder:text-[#98A6B8] focus:border-[#1264F5] focus:ring-2 focus:ring-[#1264F5]/12",
            inputClassName,
          )}
        />
      </div>

      <button
        type="button"
        onClick={() => {
          if (draft.trim()) {
            addAirport();
          }
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
        className="mt-2.5 inline-flex items-center gap-1 text-[13px] font-semibold transition hover:opacity-80"
        style={{ color: CTA_BLUE }}
      >
        {addLabel.startsWith("+") ? addLabel : `+ ${addLabel}`}
      </button>
    </div>
  );
}
