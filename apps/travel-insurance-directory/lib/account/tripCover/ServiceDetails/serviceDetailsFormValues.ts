import {
  radioFieldSpec,
  radioFieldTel,
  selectFieldAdvance,
  selectFieldMed,
} from 'data/pages/account/tripCover/service-details';
import type {
  ServiceDetails,
  TripCoverAdvance,
} from 'types/travel-insurance-firm';

const FORM_ADVANCE_TO_COSMOS: Record<string, TripCoverAdvance> = {
  'up-to-18-months': 'up_to_18_month',
  'up-to-24-months': 'up_to_24_month',
  'over-24-months': 'over_24_months',
};

const COSMOS_ADVANCE_TO_FORM: Record<TripCoverAdvance, string> = {
  up_to_6_month: '',
  up_to_12_month: '',
  up_to_18_month: 'up-to-18-months',
  up_to_24_month: 'up-to-24-months',
  over_24_months: 'over-24-months',
};

export const SERVICE_DETAILS_FORM_FIELD_KEYS = [
  radioFieldTel.key,
  radioFieldSpec.key,
  selectFieldMed.key,
  selectFieldAdvance.key,
] as const;

export type ServiceDetailsFormFieldKey =
  (typeof SERVICE_DETAILS_FORM_FIELD_KEYS)[number];

export function formatYesNoToFormValue(
  stored: boolean | string | null,
): string {
  if (stored == null) {
    return '';
  }

  if (typeof stored === 'boolean') {
    return stored ? 'yes' : 'no';
  }

  const value = stored.trim().toLowerCase();
  if (value === 'yes' || value === 'no') {
    return value;
  }

  return '';
}

export function parseYesNoFromFormValue(
  raw: string | undefined,
): boolean | null {
  const value = (raw ?? '').trim().toLowerCase();
  if (value === 'yes') {
    return true;
  }
  if (value === 'no') {
    return false;
  }
  return null;
}

export function formatAdvanceToFormValue(
  stored: TripCoverAdvance | null,
): string {
  if (stored == null) {
    return '';
  }

  if (stored in COSMOS_ADVANCE_TO_FORM) {
    return COSMOS_ADVANCE_TO_FORM[stored];
  }

  return '';
}

export function parseAdvanceFromFormValue(
  raw: string | undefined,
): TripCoverAdvance | null {
  const value = (raw ?? '').trim();
  if (!value || !(value in FORM_ADVANCE_TO_COSMOS)) {
    return null;
  }

  return FORM_ADVANCE_TO_COSMOS[value];
}

export function formatServiceDetailsToFormValues(
  serviceDetails: ServiceDetails,
): Record<ServiceDetailsFormFieldKey, string> {
  return {
    [radioFieldTel.key]: formatYesNoToFormValue(
      serviceDetails?.offers_telephone_quote,
    ),
    [radioFieldSpec.key]: formatYesNoToFormValue(
      serviceDetails?.will_cover_specialist_equipment,
    ),
    [selectFieldMed.key]: serviceDetails?.medical_screening_company ?? '',
    [selectFieldAdvance.key]: formatAdvanceToFormValue(
      serviceDetails?.how_far_in_advance_trip_cover,
    ),
  };
}

export function parseServiceDetailsFields(
  body: Record<string, string | string[] | undefined>,
): {
  serviceDetails: Partial<ServiceDetails> | null;
  fieldErrors: Record<string, { error: 'required' }>;
} {
  const fieldErrors: Record<string, { error: 'required' }> = {};

  const getFieldValue = (key: string): string | undefined => {
    const raw = body[key];
    return Array.isArray(raw) ? raw[0] : raw;
  };

  const offersTelephoneQuote = parseYesNoFromFormValue(
    getFieldValue(radioFieldTel.key),
  );
  if (offersTelephoneQuote == null) {
    fieldErrors[radioFieldTel.key] = { error: 'required' };
  }

  const willCoverSpecialistEquipment = parseYesNoFromFormValue(
    getFieldValue(radioFieldSpec.key),
  );
  if (willCoverSpecialistEquipment == null) {
    fieldErrors[radioFieldSpec.key] = { error: 'required' };
  }

  const medicalScreeningCompany = (
    getFieldValue(selectFieldMed.key) ?? ''
  ).trim();
  if (!medicalScreeningCompany) {
    fieldErrors[selectFieldMed.key] = { error: 'required' };
  }

  const howFarInAdvance = parseAdvanceFromFormValue(
    getFieldValue(selectFieldAdvance.key),
  );
  if (howFarInAdvance == null) {
    fieldErrors[selectFieldAdvance.key] = { error: 'required' };
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { serviceDetails: null, fieldErrors };
  }

  return {
    serviceDetails: {
      offers_telephone_quote: offersTelephoneQuote,
      will_cover_specialist_equipment: willCoverSpecialistEquipment,
      medical_screening_company: medicalScreeningCompany,
      how_far_in_advance_trip_cover: howFarInAdvance,
    },
    fieldErrors,
  };
}

export function buildServiceDetailsPatchRecord(
  serviceDetails: Partial<ServiceDetails>,
): Record<string, string | boolean | number | null> {
  const patchRecord: Record<string, string | boolean | number | null> = {};

  for (const [field, value] of Object.entries(serviceDetails)) {
    patchRecord[`service_details/${field}`] = value ?? null;
  }

  return patchRecord;
}
