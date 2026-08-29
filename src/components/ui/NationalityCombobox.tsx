"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { filterCountries, type Country } from "@/lib/countries";
import { cn } from "@/lib/utils";

export type NationalityValue = {
  code: string;
  name: string;
} | null;

type NationalityComboboxProps = {
  label: string;
  placeholder: string;
  locale: string;
  value: NationalityValue;
  onChange: (value: NationalityValue) => void;
  onBlur?: () => void;
  error?: string;
  showError?: boolean;
  /** Suffix for hidden form fields, e.g. `pax-0` → `nationality_code_pax-0` */
  fieldId?: string;
};

const fieldClassBase =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-[14px] text-navy placeholder:text-muted outline-none transition focus:ring-2";

export function NationalityCombobox({
  label,
  placeholder,
  locale,
  value,
  onChange,
  onBlur,
  error,
  showError,
  fieldId,
}: NationalityComboboxProps) {
  const listId = useId();
  const errorId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);

  const results = useMemo(
    () => filterCountries(locale, query, 8),
    [locale, query],
  );

  const inputValue = open ? query : (value?.name ?? "");
  const hasVisibleError = Boolean(showError && error);

  useEffect(() => {
    setHighlighted(0);
  }, [results]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  function selectCountry(country: Country) {
    onChange({ code: country.code, name: country.name });
    setQuery("");
    setOpen(false);
  }

  function onInputChange(next: string) {
    setQuery(next);
    setOpen(next.trim().length >= 1);
    if (value && next !== value.name) {
      onChange(null);
    }
  }

  function handleBlur() {
    setOpen(false);
    setQuery("");
    onBlur?.();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
      return;
    }

    if (!open || results.length === 0) {
      if (e.key === "ArrowDown" && query.trim().length >= 1) {
        setOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => Math.min(i + 1, results.length - 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const pick = results[highlighted];
      if (pick) selectCountry(pick);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-bold text-navy">{label}</span>
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-invalid={hasVisibleError || undefined}
          aria-describedby={hasVisibleError ? errorId : undefined}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={inputValue}
          placeholder={placeholder}
          data-invalid={hasVisibleError ? "true" : undefined}
          className={cn(
            fieldClassBase,
            hasVisibleError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
              : "border-line focus:border-brand-cta focus:ring-brand-cta/15",
          )}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={() => {
            if (value) {
              setQuery(value.name);
              setOpen(true);
            }
          }}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
        />
        <input
          type="hidden"
          name={fieldId ? `nationality_code_${fieldId}` : "nationality_code"}
          value={value?.code ?? ""}
          tabIndex={-1}
          aria-hidden
          readOnly
        />
        <input
          type="hidden"
          name={fieldId ? `nationality_name_${fieldId}` : "nationality_name"}
          value={value?.name ?? ""}
          tabIndex={-1}
          aria-hidden
          readOnly
        />
      </label>

      {hasVisibleError && (
        <p id={errorId} className="mt-1.5 text-[12px] text-red-600" role="alert">
          {error}
        </p>
      )}

      {open && query.trim().length >= 1 && results.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-line bg-white py-1 shadow-[0_8px_24px_rgba(9,36,92,0.12)]"
        >
          {results.map((country, index) => (
            <li
              key={country.code}
              role="option"
              aria-selected={index === highlighted}
              className={cn(
                "cursor-pointer px-3 py-2.5 text-[14px] text-navy transition",
                index === highlighted && "bg-brand-cta/10",
              )}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setHighlighted(index)}
              onClick={() => selectCountry(country)}
            >
              {country.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
