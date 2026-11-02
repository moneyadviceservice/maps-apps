import { RadioInput } from 'components/form/RadioQuestion';
import { InputField } from 'types/register';
import type { MedicalSpecialismCover } from 'types/travel-insurance-firm';

import { yesNoOptions } from './service-details';

export const medicalSpecialismPage = {
  description: '',
  title: 'Medical Specialism',
  formKey: 'medical-specialism',
  backLink: '/account',
  submitApi: '/api/account/trip-cover/medical-specialism',
};

export const MEDICAL_SPECIALISM_OPTIONS: {
  label: string;
  value: MedicalSpecialismCover;
}[] = [
  { label: 'Cancer', value: 'cancer' },
  { label: 'Heart conditions', value: 'heart_conditions' },
  {
    label: 'Strokes or central nervous system disorders',
    value: 'strokes_or_cns_disorders',
  },
  { label: 'Respiratory problems', value: 'respiratory_problems' },
  {
    label: 'Psychological or mental health problems',
    value: 'psychological_or_mental_health_problems',
  },
];

export const MEDICAL_SPECIALISM_COVER_VALUES: MedicalSpecialismCover[] =
  MEDICAL_SPECIALISM_OPTIONS.map((option) => option.value);

export function getMedicalSpecialismLabel(
  value: string | null | undefined,
): string {
  if (!value) {
    return '';
  }

  const match = MEDICAL_SPECIALISM_OPTIONS.find(
    (option) => option.value === value,
  );
  return match?.label ?? value;
}

export const radioFieldCoversAll: RadioInput & InputField = {
  key: 'specialised_medical_conditions_covers_all',
  title:
    'Will you offer travel insurance that covers any/most types of serious medical conditions?',
  heading:
    'Do you offer travel insurance that will cover any/most types of serious medical conditions?',
  type: 'radio',
  layout: 'row',
  options: yesNoOptions,
  dataPath: 'medical_specialisms',
};

export const radioFieldSpecialism: RadioInput & InputField = {
  key: 'specialised_medical_conditions_cover',
  title:
    'Your firm specialises in offering travel insurance for one of the following medical conditions',
  heading: 'Which medical condition does your firm specialise in?',
  type: 'radio',
  layout: 'column',
  options: MEDICAL_SPECIALISM_OPTIONS,
  dataPath: 'medical_specialisms',
};

const MEDICAL_SPECIALISM_FIELDS = [
  radioFieldCoversAll,
  radioFieldSpecialism,
] as const;

export { MEDICAL_SPECIALISM_FIELDS };

export const MEDICAL_SPECIALISM_FIELD_LABELS: Record<string, string> =
  Object.fromEntries(
    MEDICAL_SPECIALISM_FIELDS.map((field) => [field.key, field.heading!]),
  );

export const MEDICAL_SPECIALISM_REQUIRED_MESSAGES: Record<string, string> = {
  specialised_medical_conditions_covers_all:
    'Select whether you cover any/most types of serious medical conditions',
  specialised_medical_conditions_cover:
    'Select the medical condition your firm specialises in',
};
