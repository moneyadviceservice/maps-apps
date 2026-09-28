import { RadioInput } from 'components/form/RadioQuestion';
import { SelectInput } from 'components/form/SelectQuestion';
import { InputField } from 'types/register';

export const serviceDetailsPage = {
  description: '',
  title: 'Service details',
  formKey: 'service-details',
  backLink: '/account',
  submitApi: '/api/account/trip-cover/service-details',
};

export const yesNoOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

export const radioFieldTel: RadioInput & InputField = {
  key: 'offers_telephone_quote',
  title:
    'Please confirm that you are able to offer a telephone quote service as a minimum (i.e. that your service is not online only).',
  heading: 'Do you offer a telephone quote service?',
  type: 'radio',
  layout: 'row',
  options: yesNoOptions,
  dataPath: 'service_details',
};

export const radioFieldSpec: RadioInput & InputField = {
  key: 'will_cover_specialist_equipment',
  title: 'Will you offer cover for specialist medical equipment?',
  heading: 'Do you offer cover for specialist medical equipment?',
  type: 'radio',
  layout: 'row',
  options: yesNoOptions,
  dataPath: 'service_details',
};

export const selectFieldMed: SelectInput & InputField = {
  key: 'medical_screening_company',
  title: 'Which medical screening company do you use?',
  heading: 'Your medical screening provider',
  type: 'select',
  options: [
    { text: 'Verisk (formerly Healix Risk Rating)', value: 'verisk' },
    { text: 'Travel and Medical Insurance Services', value: 'tamis' },
    { text: 'Protectif', value: 'protectif' },
    { text: 'Medical screening undertaken in-house', value: 'inhouse' },
  ],
  dataPath: 'service_details',
};

export const selectFieldAdvance: SelectInput & InputField = {
  key: 'how_far_in_advance_trip_cover',
  title: 'How far in advance can cover be bought?',
  heading: 'How far in advance do you provide cover?',
  type: 'select',
  options: [
    { text: 'Up to 18 months', value: 'up-to-18-months' },
    { text: 'Up to 2 years', value: 'up-to-24-months' },
    { text: 'More than 2 years', value: 'over-24-months' },
  ],
  dataPath: 'service_details',
};

const SERVICE_DETAILS_FIELDS = [
  radioFieldTel,
  radioFieldSpec,
  selectFieldMed,
  selectFieldAdvance,
] as const;

export { SERVICE_DETAILS_FIELDS };

export const SERVICE_DETAILS_FIELD_LABELS: Record<string, string> =
  Object.fromEntries(
    SERVICE_DETAILS_FIELDS.map((field) => [field.key, field.heading!]),
  );

export const SERVICE_DETAILS_REQUIRED_MESSAGES: Record<string, string> = {
  offers_telephone_quote: 'Select whether you offer a telephone quote service',
  will_cover_specialist_equipment:
    'Select whether you offer cover for specialist medical equipment',
  medical_screening_company: 'Select your medical screening provider',
  how_far_in_advance_trip_cover: 'Select how far in advance you provide cover',
};
