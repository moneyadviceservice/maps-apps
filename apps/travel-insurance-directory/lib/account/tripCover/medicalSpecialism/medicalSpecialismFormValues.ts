import {
  MEDICAL_SPECIALISM_COVER_VALUES,
  radioFieldCoversAll,
  radioFieldSpecialism,
} from 'data/pages/account/tripCover/medical-specialism';
import {
  formatYesNoToFormValue,
  parseYesNoFromFormValue,
} from 'lib/account/tripCover/shared/formValues';
import type {
  MedicalSpecialismCover,
  MedicalSpecialisms,
} from 'types/travel-insurance-firm';

export const MEDICAL_SPECIALISM_FORM_FIELD_KEYS = [
  radioFieldCoversAll.key,
  radioFieldSpecialism.key,
] as const;

export type MedicalSpecialismFormFieldKey =
  (typeof MEDICAL_SPECIALISM_FORM_FIELD_KEYS)[number];

export function parseSpecialismFromFormValue(
  raw: string | undefined,
): MedicalSpecialismCover | null {
  const value = (raw ?? '').trim();
  if (
    !MEDICAL_SPECIALISM_COVER_VALUES.includes(value as MedicalSpecialismCover)
  ) {
    return null;
  }

  return value as MedicalSpecialismCover;
}

export function formatMedicalSpecialismToFormValues(
  medicalSpecialisms?: MedicalSpecialisms | null,
): Record<MedicalSpecialismFormFieldKey, string> {
  return {
    [radioFieldCoversAll.key]: formatYesNoToFormValue(
      medicalSpecialisms?.specialised_medical_conditions_covers_all ?? null,
    ),
    [radioFieldSpecialism.key]:
      medicalSpecialisms?.specialised_medical_conditions_cover ?? '',
  };
}

export function parseMedicalSpecialismFields(
  body: Record<string, string | string[] | undefined>,
): {
  medicalSpecialisms: Partial<MedicalSpecialisms> | null;
  fieldErrors: Record<string, { error: 'required' }>;
} {
  const fieldErrors: Record<string, { error: 'required' }> = {};

  const getFieldValue = (key: string): string | undefined => {
    const raw = body[key];
    return Array.isArray(raw) ? raw[0] : raw;
  };

  const coversAll = parseYesNoFromFormValue(
    getFieldValue(radioFieldCoversAll.key),
  );
  if (coversAll == null) {
    fieldErrors[radioFieldCoversAll.key] = { error: 'required' };
  }

  const specialism = parseSpecialismFromFormValue(
    getFieldValue(radioFieldSpecialism.key),
  );
  if (coversAll === false && specialism == null) {
    fieldErrors[radioFieldSpecialism.key] = { error: 'required' };
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { medicalSpecialisms: null, fieldErrors };
  }

  return {
    medicalSpecialisms: {
      specialised_medical_conditions_covers_all: coversAll,
      specialised_medical_conditions_cover: coversAll ? null : specialism,
    },
    fieldErrors,
  };
}

export function buildMedicalSpecialismPatchRecord(
  medicalSpecialisms: Partial<MedicalSpecialisms>,
): Record<string, string | boolean | number | null> {
  const patchRecord: Record<string, string | boolean | number | null> = {};

  for (const [field, value] of Object.entries(medicalSpecialisms)) {
    patchRecord[`medical_specialisms/${field}`] = value ?? null;
  }

  return patchRecord;
}
