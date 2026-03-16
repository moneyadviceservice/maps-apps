/**
 * Filter options for travel insurance directory.
 * Values match Cosmos Firm schema: TripType, CoverArea, TripCoverAdvance, AgeLimits.
 * Labels are bilingual (en/cy) for use with z().
 */

import type {
  CoverArea,
  TripCoverAdvance,
  TripType,
} from 'types/travel-insurance-firm';

export type BilingualLabel = { en: string; cy: string };

export interface FilterOption {
  id: string;
  label: BilingualLabel;
  value: string;
}

/**
 * Age at time of travel (user's age in years). Matches legacy tad_consumer: dropdown 1–100,
 * filter = firm has at least one product where max_age >= this age.
 */
export const AGE_OPTIONS: FilterOption[] = Array.from(
  { length: 100 },
  (_, i) => {
    const age = i + 1;
    const s = String(age);
    return {
      id: `age-${age}`,
      label: { en: s, cy: s },
      value: s,
    };
  },
);

/** Insurance type – TripCover.trip_type */
export const TRIP_TYPE_OPTIONS: {
  id: string;
  label: BilingualLabel;
  value: TripType;
}[] = [
  {
    id: 'single-trip',
    label: { en: 'Single Trip', cy: 'Taith Sengl' },
    value: 'single_trip',
  },
  {
    id: 'annual-multi-trip',
    label: { en: 'Annual Multi-Trip', cy: 'Aml-daith flynyddol' },
    value: 'annual_multi_trip',
  },
];

/** Length of single trip – display only for now (no Firm field); kept for UI consistency */
export const TRIP_LENGTH_OPTIONS: FilterOption[] = [
  {
    id: 'up-to-1-month',
    label: { en: 'Up to 1 month', cy: 'Hyd at 1 mis' },
    value: 'up_to_1_month',
  },
  {
    id: '1-to-3-months',
    label: { en: '1 - 3 months', cy: '1 - 3 mis' },
    value: '1_to_3_months',
  },
  {
    id: '3-to-6-months',
    label: { en: '3 - 6 months', cy: '3 - 6 mis' },
    value: '3_to_6_months',
  },
  {
    id: 'over-6-months',
    label: { en: 'Over 6 months', cy: 'Dros 6 mis' },
    value: 'over_6_months',
  },
];

/** Length of multi trip – max days per trip */
export const TRIP_LENGTH_MULTI_OPTIONS: FilterOption[] = [
  {
    id: 'no-longer-than-31-days',
    label: { en: 'No longer than 31 days', cy: 'Dim mwy na 31 diwrnod' },
    value: 'no_longer_than_31_days',
  },
  {
    id: 'no-longer-than-45-days',
    label: { en: 'No longer than 45 days', cy: 'Dim mwy na 45 diwrnod' },
    value: 'no_longer_than_45_days',
  },
  {
    id: 'no-longer-than-55-days',
    label: { en: 'No longer than 55 days', cy: 'Dim mwy na 55 diwrnod' },
    value: 'no_longer_than_55_days',
  },
];

/** Destination – TripCover.cover_area */
export const COVER_AREA_OPTIONS: {
  id: string;
  label: BilingualLabel;
  value: CoverArea;
}[] = [
  {
    id: 'uk-europe',
    label: { en: 'UK & Europe', cy: 'DU ac Ewrop' },
    value: 'uk_and_europe',
  },
  {
    id: 'worldwide-excluding',
    label: {
      en: 'Worldwide excluding USA, Canada, Caribbean',
      cy: "Ledled y byd ac eithrio UDA, Canada a'r Caribiaidd",
    },
    value: 'worldwide_excluding_us_canada',
  },
  {
    id: 'worldwide-including',
    label: {
      en: 'Worldwide including USA, Canada, Caribbean',
      cy: "Ledled y byd gan gynnwys UDA, Canada a'r Caribïaidd",
    },
    value: 'worldwide_including_us_canada',
  },
];

/** When are you travelling – ServiceDetails.how_far_in_advance_trip_cover */
export const WHEN_TRAVELLING_OPTIONS: {
  id: string;
  label: BilingualLabel;
  value: TripCoverAdvance;
}[] = [
  {
    id: 'within-1-month',
    label: { en: 'Within 1 month', cy: 'O fewn 1 mis' },
    value: 'up_to_6_month',
  },
  {
    id: '1-to-6-months',
    label: { en: 'Between 1 - 6 months', cy: 'Rhwng 1 - 6 mis' },
    value: 'up_to_6_month',
  },
  {
    id: '6-to-12-months',
    label: { en: 'Between 6 - 12 months', cy: 'Rhwng 6 - 12 mis' },
    value: 'up_to_12_month',
  },
  {
    id: '12-to-18-months',
    label: { en: 'Between 12 - 18 months', cy: 'Rhwng 12 - 18 mis' },
    value: 'up_to_18_month',
  },
  {
    id: '18-to-24-months',
    label: { en: 'Between 18 - 24 months', cy: 'Rhwng 18 - 24 mis' },
    value: 'up_to_24_month',
  },
];

/** Yes/No for radio filters */
export const YES_NO_OPTIONS: {
  id: string;
  label: BilingualLabel;
  value: string;
}[] = [
  { id: 'yes', label: { en: 'Yes', cy: 'Ydy' }, value: 'true' },
  { id: 'no', label: { en: 'No', cy: 'Na' }, value: 'false' },
];

export interface NumberInputConfig {
  min: number;
  max: number;
  placeholder?: { en: string; cy: string };
}

export interface FilterSectionConfig {
  paramKey: string;
  name: string;
  control?: 'radio' | 'number';
  options: { id: string; label: BilingualLabel; value: string }[];
  numberInput?: NumberInputConfig;
  wrapperClassName?: string;
  placeholderCopy?: { en: string; cy: string };
  title: { en: string; cy: string };
  moreInfoTitle?: { en: string; cy: string };
  moreInfo: { en: string; cy: string };
  testId: string;
  emptyItemText?: { en: string; cy: string };
}

export const FILTER_SECTIONS: FilterSectionConfig[] = [
  {
    paramKey: 'age',
    name: 'age',
    control: 'number',
    options: [],
    numberInput: {
      min: 1,
      max: 100,
      placeholder: { en: 'Enter age', cy: 'Oedran adeg teithio' },
    },
    title: { en: 'Age at time of travel', cy: 'Oedran adeg teithio' },
    moreInfo: {
      en: 'Select the maximum age you will be when you travel. Providers may have different age limits for land and cruise trips.',
      cy: 'Dewiswch yr oed uchaf fyddwch chi pan fyddwch yn teithio.',
    },
    testId: 'age-at-travel-more-info',
  },
  {
    paramKey: 'trip_type',
    name: 'trip_type',
    options: TRIP_TYPE_OPTIONS,
    title: {
      en: 'Filter by insurance type',
      cy: 'Hidlo yn ôl math o yswiriant',
    },
    moreInfoTitle: {
      en: 'Single or Annual Trip:',
      cy: 'Taith Sengl neu Flynyddol:',
    },
    moreInfo: {
      en: 'Depending on what medical conditions(s) you have, where you are going and for how long – sometimes a Single Trip policy might be cheaper than an Annual Multi-trip policy. Also if you have been declined for a Multi-trip policy, you might still get offered insurance if you choose a Single Trip policy.\n\nBut if you are planning to travel several times during a 12-month period, try for an Annual Multi-trip policy first.',
      cy: 'Yn dibynnu ar ba gyflwr/gyflyrau meddygol sydd gennych, ble rydych yn mynd ac am ba hyd - weithiau gallai polisi Taith Sengl fod yn rhatach na pholisi Aml-daith Flynyddol. Hefyd os cawsoch eich gwrthod am bolisi Aml-daith, efallai y cewch gynnig yswiriant os dewiswch bolisi Trip Sengl.\n\nOnd os ydych yn bwriadu teithio sawl gwaith yn ystod cyfnod o 12 mis, ceisiwch yn gyntaf am bolisi Aml-daith Flynyddol.',
    },
    testId: 'insurance-type-more-info',
  },
  {
    paramKey: '_length_placeholder',
    name: '_length_placeholder',
    options: [],
    wrapperClassName: 'length-placeholder',
    placeholderCopy: {
      en: 'Please select the type of insurance first.',
      cy: 'Dewiswch y math o yswiriant yn gyntaf.',
    },
    title: { en: 'Length of trip', cy: 'Hyd y daith' },
    moreInfo: { en: '', cy: '' },
    testId: 'length-placeholder',
  },
  {
    paramKey: 'trip_length',
    name: 'trip_length',
    options: TRIP_LENGTH_OPTIONS,
    wrapperClassName: 'single',
    title: { en: 'Length of Single Trip', cy: 'Hyd y daith sengl' },
    moreInfo: {
      en: 'Choose the option that fits your length of trip best. Some providers won’t offer cover for longer trips.',
      cy: `Dewiswch yr opsiwn sy'n gweddu orau i hyd eich taith. Nid yw rhai darparwyr yn cynnig yswiriant ar gyfer teithiau hirach.`,
    },
    testId: 'length-of-single-trip-more-info',
  },
  {
    paramKey: 'trip_length',
    name: 'trip_length',
    options: TRIP_LENGTH_MULTI_OPTIONS,
    wrapperClassName: 'multi',
    title: { en: 'Length of Multi Trip', cy: 'Hyd y lluos-daith' },
    moreInfo: {
      en: 'Choose the maximum length of each trip. Coverage limits vary by provider.',
      cy: 'Dewiswch hyd uchaf pob taith. Mae terfynau yswiriant yn amrywio yn ôl darparwr.',
    },
    testId: 'length-of-multi-trip-more-info',
  },
  {
    paramKey: 'cover_area',
    name: 'cover_area',
    options: COVER_AREA_OPTIONS,
    title: { en: 'Destination', cy: 'Cyrchfan' },
    moreInfo: {
      en: 'The cost of medical treatment can be more in some countries than others, so where you are going will have an effect on whether a provider will offer you cover. These three destinations are the most common categories used by most travel insurance providers.',
      cy: "Gall cost triniaeth feddygol fod yn fwy mewn rhai gwledydd nag eraill, felly bydd ble rydych yn mynd yn cael effaith ar a fydd darparwr yn cynnig yswiriant i chi. Y tri chyrchfan hyn yw'r categorïau mwyaf cyffredin a ddefnyddir gan y mwyafrif o ddarparwyr yswiriant teithio.",
    },
    testId: 'destination-more-info',
  },
  {
    paramKey: 'is_cruise',
    name: 'is_cruise',
    options: [...YES_NO_OPTIONS],
    title: { en: 'Is your trip a cruise?', cy: 'A yw eich taith yn fordaith?' },
    moreInfo: {
      en: 'Not all providers offer insurance cover for cruises and those that do may have a different age limit for cruises.',
      cy: 'Nid yw pob darparwr yn cynnig yswiriant ar gyfer mordeithiau, ac efallai bod gan y rhai sydd yn cynnig â therfyn oedran gwahanol ar gyfer mordeithiau.',
    },
    testId: 'is-cruise-more-info',
  },
  {
    paramKey: 'when_travelling',
    name: 'when_travelling',
    options: WHEN_TRAVELLING_OPTIONS,
    title: { en: 'When are you travelling?', cy: 'Pryd ydych yn teithio?' },
    moreInfo: {
      en: 'Not all providers will let you take out a policy in advance of when you are travelling because of the possibility of cancellation. For example you can usually only take out an Annual Multi-trip policy up to 31 days in advance. Always check the terms and conditions regarding cancellation carefully before buying travel insurance.',
      cy: 'Ni fydd pob darparwr yn gadael i chi drefnu polisi ymlaen llaw i bryd y byddwch yn teithio, oherwydd y posibilrwydd o ganslo. Er enghraifft, fel arfer dim ond hyd at 31 diwrnod ymlaen llaw y gallwch drefnu polisi Aml-deithiau Blynyddol. Gwiriwch y telerau ac amodau ynghylch canslo yn ofalus bob amser cyn prynu yswiriant teithio.',
    },
    testId: 'when-travelling-more-info',
  },
  {
    paramKey: 'undergoing_treatment',
    name: 'undergoing_treatment',
    options: [...YES_NO_OPTIONS],
    title: {
      en: 'Are you undergoing treatment?',
      cy: "Ydych chi'n cael triniaeth?",
    },
    moreInfo: {
      en: 'Not all providers offer cover if you are receiving treatment, but many will.',
      cy: 'Nid yw pob darparwr yn cynnig yswiriant os ydych yn derbyn triniaeth, ond bydd llawer yn.',
    },
    testId: 'undergoing-treatment-more-info',
  },
  {
    paramKey: 'terminal_prognosis',
    name: 'terminal_prognosis',
    options: [...YES_NO_OPTIONS],
    title: {
      en: 'My doctor has given me a terminal prognosis',
      cy: 'Mae fy meddyg wedi rhoi prognosis terfynol i mi',
    },
    moreInfo: {
      en: 'Typically, this means a medical professional has diagnosed you with a life-threatening condition and confirmed you have 12 months or less to live.',
      cy: 'Yn gyffredinol, mae hyn yn golygu bod gweithiwr meddygol proffesiynol wedi gwneud diagnosis o gyflwr sy’n bygwth bywyd ac wedi cadarnhau bod gennych 12 mis neu lai i fyw.',
    },
    testId: 'terminal-prognosis-more-info',
  },
  {
    paramKey: 'medical_equipment',
    name: 'medical_equipment',
    options: [...YES_NO_OPTIONS],
    title: {
      en: 'Do you require cover for medical equipment?',
      cy: 'A oes angen yswiriant arnoch ar gyfer offer meddygol?',
    },
    moreInfo: {
      en: 'If you need to take expensive specialist medical equipment with you on your trip, make sure you can get it covered for loss or damage.',
      cy: 'Os oes angen i chi fynd ag offer meddygol arbenigol drud gyda chi ar eich taith, gwnewch yn siŵr eich bod yn gallu gael yswiriant am golled neu ddifrod.',
    },
    testId: 'medical-equipment-more-info',
  },
];
