export type HajjPersonFormData = {
  firstName: string;
  lastName: string;
  nationality: string;
  nationalityCode: string;
  residence: string;
  passportType: string;
};

export type HajjPersonFieldErrors = {
  firstName?: string;
  lastName?: string;
  nationality?: string;
  residence?: string;
  passportType?: string;
};

export type HajjPreRegFormErrors = {
  persons: HajjPersonFieldErrors[];
  source?: string;
  phone?: string;
  email?: string;
};

export type HajjPreRegValidationMessages = {
  firstName: string;
  lastName: string;
  nationality: string;
  residence: string;
  passportType: string;
  source: string;
  phone: string;
  email: string;
};

function isValidEmail(value: string): boolean {
  if (!value.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateHajjPreRegForm(
  locale: string,
  persons: HajjPersonFormData[],
  travellerCount: number,
  source: string,
  phone: string,
  email: string,
  messages: HajjPreRegValidationMessages,
  allowedResidenceCodes?: Set<string>,
): HajjPreRegFormErrors {
  void locale;
  const errors: HajjPreRegFormErrors = { persons: [] };
  let hasError = false;

  persons.slice(0, travellerCount).forEach((person, index) => {
    const personErrors: HajjPersonFieldErrors = {};

    if (!person.firstName.trim()) {
      personErrors.firstName = messages.firstName;
    }
    if (!person.lastName.trim()) {
      personErrors.lastName = messages.lastName;
    }
    // Free-text nationality — no predefined country list
    if (!person.nationality.trim()) {
      personErrors.nationality = messages.nationality;
    }
    if (!person.residence || (allowedResidenceCodes && !allowedResidenceCodes.has(person.residence))) {
      personErrors.residence = messages.residence;
    }
    if (!person.passportType) {
      personErrors.passportType = messages.passportType;
    }

    errors.persons[index] = personErrors;
    if (Object.keys(personErrors).length > 0) hasError = true;
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

  return hasError ? errors : { persons: [] };
}

export function hasHajjPreRegFormErrors(errors: HajjPreRegFormErrors): boolean {
  if (errors.source || errors.phone || errors.email) return true;
  return errors.persons.some((person) => Object.keys(person).length > 0);
}

export function firstHajjPreRegErrorIndex(errors: HajjPreRegFormErrors): number | null {
  const index = errors.persons.findIndex((person) => Object.keys(person).length > 0);
  return index >= 0 ? index : null;
}
