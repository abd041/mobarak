import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatEuro(amount: number, locale = "de-AT") {
  if (locale.startsWith("de")) {
    const amountLabel = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(amount);
    return `${amountLabel} €`;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Price reduction (e.g. child with bed: −100 € off the adult rate, not a negative total). */
export function formatEuroReduction(amount: number, locale = "de-AT") {
  return `−${formatEuro(Math.abs(amount), locale)}`;
}
