/** ISO 3166-1 alpha-2 codes (incl. commonly used territories). */
export const ISO3166_ALPHA2 = [
  "AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ",
  "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BQ", "BA", "BW", "BV", "BR",
  "IO", "BN", "BG", "BF", "BI", "CV", "KH", "CM", "CA", "KY", "CF", "TD", "CL", "CN", "CX", "CC",
  "CO", "KM", "CG", "CD", "CK", "CR", "CI", "HR", "CU", "CW", "CY", "CZ", "DK", "DJ", "DM", "DO",
  "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF",
  "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY",
  "HT", "HM", "VA", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "JM",
  "JP", "JE", "JO", "KZ", "KE", "KI", "KP", "KR", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY",
  "LI", "LT", "LU", "MO", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX",
  "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NC", "NZ", "NI",
  "NE", "NG", "NU", "NF", "MK", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH",
  "PN", "PL", "PT", "PR", "QA", "RE", "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "VC",
  "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS",
  "SS", "ES", "LK", "SD", "SR", "SJ", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK",
  "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "UM", "UY", "UZ", "VU",
  "VE", "VN", "VG", "VI", "WF", "EH", "YE", "ZM", "ZW", "XK",
] as const;

export type Country = {
  code: string;
  name: string;
};

const NAME_OVERRIDES: Record<string, Partial<Record<string, string>>> = {
  de: { XK: "Kosovo" },
  en: { XK: "Kosovo" },
  bs: { XK: "Kosovo" },
  ar: { XK: "كوسوفو" },
};

const countriesCache = new Map<string, Country[]>();

function localeToTag(locale: string): string {
  if (locale === "de") return "de-AT";
  if (locale === "bs") return "bs-BA";
  if (locale === "ar") return "ar";
  return "en-GB";
}

/** Normalize for case-insensitive search; supports German umlauts (ä→a, ö→o, ü→u, ß→ss). */
export function normalizeCountrySearch(value: string): string {
  return value
    .toLowerCase()
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function getCountries(locale: string): Country[] {
  const cached = countriesCache.get(locale);
  if (cached) return cached;

  const tag = localeToTag(locale);
  const display = new Intl.DisplayNames([tag], { type: "region" });
  const overrides = NAME_OVERRIDES[locale] ?? {};

  const list = ISO3166_ALPHA2.map((code) => ({
    code,
    name: overrides[code] ?? display.of(code) ?? code,
  })).sort((a, b) => a.name.localeCompare(b.name, tag));

  countriesCache.set(locale, list);
  return list;
}

export function filterCountries(locale: string, query: string, limit = 8): Country[] {
  const trimmed = query.trim();
  if (trimmed.length < 1) return [];

  const q = normalizeCountrySearch(trimmed);
  const matches = getCountries(locale).filter(
    (c) =>
      normalizeCountrySearch(c.name).includes(q) ||
      normalizeCountrySearch(c.code).includes(q),
  );

  // Prefer prefix matches so "Öst" → Österreich, "Tür" → Türkei rise to the top
  matches.sort((a, b) => {
    const an = normalizeCountrySearch(a.name);
    const bn = normalizeCountrySearch(b.name);
    const aPrefix = an.startsWith(q) || normalizeCountrySearch(a.code).startsWith(q) ? 0 : 1;
    const bPrefix = bn.startsWith(q) || normalizeCountrySearch(b.code).startsWith(q) ? 0 : 1;
    if (aPrefix !== bPrefix) return aPrefix - bPrefix;
    return an.localeCompare(bn);
  });

  return matches.slice(0, limit);
}

export function findCountryByCode(locale: string, code: string): Country | undefined {
  if (!code) return undefined;
  return getCountries(locale).find((c) => c.code === code);
}
