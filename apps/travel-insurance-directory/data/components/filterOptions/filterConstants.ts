/**
 * Filter options for travel insurance directory.
 * Values match Cosmos Firm schema: TripType, CoverArea, AgeLimits.
 * Labels are bilingual (en/cy) for use with z().
 * All filters use multi-select checkboxes following the BIBA directory pattern.
 */

import type { CoverArea, TripType } from 'types/travel-insurance-firm';

export type BilingualLabel = { en: string; cy: string };

export interface FilterOption {
  id: string;
  label: BilingualLabel;
  value: string;
}

/** Age at time of travel – checkbox ranges aligned with BIBA directory */
export const AGE_RANGE_OPTIONS: FilterOption[] = [
  { id: 'age-0-16', label: { en: '0 - 16', cy: '0 - 16' }, value: '0-16' },
  {
    id: 'age-17-69',
    label: { en: '17 - 69', cy: '17 - 69' },
    value: '17-69',
  },
  {
    id: 'age-70-74',
    label: { en: '70 - 74', cy: '70 - 74' },
    value: '70-74',
  },
  {
    id: 'age-75-85',
    label: { en: '75 - 85', cy: '75 - 85' },
    value: '75-85',
  },
  { id: 'age-86-plus', label: { en: '86 +', cy: '86 +' }, value: '86+' },
];

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

/** Length of trip – unified options independent of insurance type */
export const TRIP_LENGTH_OPTIONS: FilterOption[] = [
  {
    id: 'up-to-30-days',
    label: { en: 'Up to 30 days', cy: 'Hyd at 30 diwrnod' },
    value: 'up_to_30_days',
  },
  {
    id: 'up-to-90-days',
    label: { en: 'Up to 90 days', cy: 'Hyd at 90 diwrnod' },
    value: 'up_to_90_days',
  },
  {
    id: '90-days-plus',
    label: { en: '90+ days', cy: '90+ diwrnod' },
    value: '90_days_plus',
  },
];

/** Destination – TripCover.cover_area, labels aligned with BIBA directory */
export const COVER_AREA_OPTIONS: {
  id: string;
  label: BilingualLabel;
  value: CoverArea;
}[] = [
  {
    id: 'europe',
    label: { en: 'Europe', cy: 'Ewrop' },
    value: 'uk_and_europe',
  },
  {
    id: 'worldwide',
    label: { en: 'Worldwide', cy: 'Byd-eang' },
    value: 'worldwide_including_us_canada',
  },
  {
    id: 'worldwide-excluding',
    label: {
      en: 'Worldwide excluding USA, Canada and Caribbean',
      cy: 'Ledled y byd ac eithrio UDA, Canada, Caribïaidd',
    },
    value: 'worldwide_excluding_us_canada',
  },
];

/** Land based or cruise options */
export const CRUISE_OPTIONS: FilterOption[] = [
  {
    id: 'land-based',
    label: { en: 'Land based', cy: 'Taith ar dir' },
    value: 'false',
  },
  {
    id: 'cruise',
    label: { en: 'Cruise', cy: 'Mordaith' },
    value: 'true',
  },
];

export interface FilterSectionConfig {
  paramKey: string;
  name: string;
  control?: 'radio' | 'checkbox';
  options: { id: string; label: BilingualLabel; value: string }[];
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
    control: 'checkbox',
    options: AGE_RANGE_OPTIONS,
    title: { en: 'Age at time of travel', cy: 'Oedran adeg teithio' },
    moreInfo: {
      en: 'Select the age range you will be when you travel. Providers may have different age limits for land and cruise trips.',
      cy: 'Dewiswch yr ystod oedran fyddwch chi pan fyddwch yn teithio.',
    },
    testId: 'age-at-travel-more-info',
  },
  {
    paramKey: 'trip_type',
    name: 'trip_type',
    control: 'checkbox',
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
    paramKey: 'trip_length',
    name: 'trip_length',
    control: 'checkbox',
    options: TRIP_LENGTH_OPTIONS,
    title: { en: 'Length of trip', cy: 'Hyd y daith' },
    moreInfo: {
      en: "Choose the option that fits your length of trip best. Some providers won't offer cover for longer trips.",
      cy: "Dewiswch yr opsiwn sy'n gweddu orau i hyd eich taith. Nid yw rhai darparwyr yn cynnig yswiriant ar gyfer teithiau hirach.",
    },
    testId: 'length-of-trip-more-info',
  },
  {
    paramKey: 'is_cruise',
    name: 'is_cruise',
    control: 'checkbox',
    options: CRUISE_OPTIONS,
    title: {
      en: 'Land based or cruise?',
      cy: 'Taith ar dir neu fordaith?',
    },
    moreInfo: {
      en: 'Not all providers offer insurance cover for cruises and those that do may have a different age limit for cruises.',
      cy: 'Nid yw pob darparwr yn cynnig yswiriant ar gyfer mordeithiau, ac efallai bod gan y rhai sydd yn cynnig â therfyn oedran gwahanol ar gyfer mordeithiau.',
    },
    testId: 'is-cruise-more-info',
  },
  {
    paramKey: 'cover_area',
    name: 'cover_area',
    control: 'checkbox',
    options: COVER_AREA_OPTIONS,
    title: { en: 'Destination', cy: 'Cyrchfan' },
    moreInfo: {
      en: 'The cost of medical treatment can be more in some countries than others, so where you are going will have an effect on whether a provider will offer you cover. These three destinations are the most common categories used by most travel insurance providers.',
      cy: "Gall cost triniaeth feddygol fod yn fwy mewn rhai gwledydd nag eraill, felly bydd ble rydych yn mynd yn cael effaith ar a fydd darparwr yn cynnig yswiriant i chi. Y tri chyrchfan hyn yw'r categorïau mwyaf cyffredin a ddefnyddir gan y mwyafrif o ddarparwyr yswiriant teithio.",
    },
    testId: 'destination-more-info',
  },
];
