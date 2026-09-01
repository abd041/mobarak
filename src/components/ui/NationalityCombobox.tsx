"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  hideLabel?: boolean;
  ariaLabel?: string;
  inputClassName?: string;
  required?: boolean;
};

type ListPosition = {
  top: number;
  left: number;
  width: number;
};

const fieldClassBase =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-[14px] text-navy placeholder:text-muted outline-none transition focus:ring-2";

/**
 * §11 — searchable nationality autocomplete.
 * Customer types a country (e.g. "Öst…") and picks from filtered suggestions —
 * never a full country `<select>` dropdown.
 */
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
  hideLabel = false,
  ariaLabel,
  inputClassName,
  required,
}: NationalityComboboxProps) {
  const listId = useId();
  const errorId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [position, setPosition] = useState<ListPosition | null>(null);
  const [mounted, setMounted] = useState(false);

  const results = useMemo(() => filterCountries(locale, query, 8), [locale, query]);

  const inputValue = open ? query : (value?.name ?? "");
  const hasVisibleError = Boolean(showError && error);
  const showList = open && query.trim().length >= 1 && results.length > 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setHighlighted(0);
  }, [results]);

  useLayoutEffect(() => {
    if (!showList) {
      setPosition(null);
      return;
    }

    function updatePosition() {
      const input = inputRef.current;
      if (!input) return;
      const rect = input.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [showList, results.length, query]);

  useEffect(() => {
    if (!showList) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        const list = document.getElementById(listId);
        if (list?.contains(e.target as Node)) return;
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [showList, listId]);

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

  function closeList() {
    setOpen(false);
    setQuery("");
  }

  function handleBlur() {
    // Delay so list item mousedown/click can commit first
    window.setTimeout(() => {
      closeList();
      onBlur?.();
    }, 120);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      closeList();
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

  const listbox =
    mounted && showList && position
      ? createPortal(
          <ul
            id={listId}
            role="listbox"
            aria-label={label}
            className="fixed z-[100] max-h-52 overflow-y-auto rounded-lg border border-line bg-white py-1 shadow-[0_8px_24px_rgba(9,36,92,0.12)]"
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
            }}
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
          </ul>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className="relative">
      <label className="block">
        {hideLabel ? (
          <span className="sr-only">{ariaLabel ?? label}</span>
        ) : (
          <span className="mb-1.5 block text-[13px] font-semibold text-navy">{label}</span>
        )}
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-invalid={hasVisibleError || undefined}
          aria-describedby={hasVisibleError ? errorId : undefined}
          aria-label={hideLabel ? (ariaLabel ?? label) : undefined}
          aria-required={required || undefined}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={inputValue}
          placeholder={placeholder}
          data-invalid={hasVisibleError ? "true" : undefined}
          className={cn(
            inputClassName ?? fieldClassBase,
            !inputClassName &&
              (hasVisibleError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                : "border-line focus:border-brand-cta focus:ring-brand-cta/15"),
            inputClassName &&
              hasVisibleError &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/15",
          )}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={() => {
            // Keep typing-to-search: never dump the full country list on focus
            if (value) {
              setQuery(value.name);
            }
          }}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
        />
        <input
          type="hidden"
          name={fieldId ? `nationality_code_${fieldId}` : "nationality_code"}
          value={value?.code ?? ""}
          required={required}
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

      {listbox}
    </div>
  );
}
