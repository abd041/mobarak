import { findCountryByCode } from "@/lib/countries";

export type PaxFormData = {
  type: "adult" | "child" | "infant";
  firstName: string;
  lastName: string;
  nationality: string;
  nationalityCode: string;
  passportType: "" | "normal" | "convention" | "travel" | "diplomatic";
  needsBed?: "" | "yes" | "no";
};

export type PaxFieldErrors = {
  firstName?: string;
  lastName?: string;
  nationality?: string;
  passportType?: string;
  needsBed?: string;
};

export type InquiryFormErrors = {
  pax: PaxFieldErrors[];
  source?: string;
  phone?: string;
  email?: string;
};

export type InquiryValidationMessages = {
  firstName: string;
  lastName: string;
  nationality: string;
  passportType: string;
  childBed: string;
  source: string;
  phone: string;
  email: string;
};

function isValidNationality(locale: string, code: string, name: string): boolean {
  if (!code || !name.trim()) return false;
  const country = findCountryByCode(locale, code);
  return Boolean(country && country.name === name);
}

function isValidEmail(value: string): boolean {
  if (!value.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateInquiryForm(
  locale: string,
  paxData: PaxFormData[],
  source: string,
  phone: string,
  email: string,
  messages: InquiryValidationMessages,
): InquiryFormErrors {
  const errors: InquiryFormErrors = { pax: [] };
  let hasError = false;

  paxData.forEach((p, index) => {
    const paxErrors: PaxFieldErrors = {};

    if (!p.firstName.trim()) {
      paxErrors.firstName = messages.firstName;
    }
    if (!p.lastName.trim()) {
      paxErrors.lastName = messages.lastName;
    }
    if (!isValidNationality(locale, p.nationalityCode, p.nationality)) {
      paxErrors.nationality = messages.nationality;
    }
    if (!p.passportType) {
      paxErrors.passportType = messages.passportType;
    }
    if (p.type === "child" && p.needsBed !== "yes" && p.needsBed !== "no") {
      paxErrors.needsBed = messages.childBed;
    }

    errors.pax[index] = paxErrors;
    if (Object.keys(paxErrors).length > 0) hasError = true;
  });

  if (!source) {
    errors.source = messages.source;
    hasError = true;
  }

  if (!phone.trim()) {
    errors.phone = messages.phone;
    hasError = true;
  }

  if (!isValidEmail(email)) {
    errors.email = messages.email;
    hasError = true;
  }

  return hasError ? errors : { pax: [] };
}

export function hasInquiryFormErrors(errors: InquiryFormErrors): boolean {
  if (errors.source || errors.phone || errors.email) return true;
  return errors.pax.some((p) => Object.keys(p).length > 0);
}
