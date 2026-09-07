import { TRIP_TYPE_OPTIONS } from 'data/components/filterOptions/filterConstants';
import type { AgeLimitMode } from 'lib/firms/firmDocument';
import type {
  CoverArea,
  TripDurationBucket,
  TripType,
} from 'types/travel-insurance-firm';

export const TRIP_COVER_REGION_FIELD_NAME = 'cover_area';

export const REGIONS_COVERED_HEADING = 'Which regions do you offer cover for?';

export const REGIONS_COVERED_FIELD_LABELS: Record<string, string> = {
  [TRIP_COVER_REGION_FIELD_NAME]: REGIONS_COVERED_HEADING,
};

export const REGIONS_COVERED_REQUIRED_MESSAGE =
  'At least one region must be selected before continuing';

export const REGIONS_COVERED_REQUIRED_MESSAGES: Record<string, string> = {
  [TRIP_COVER_REGION_FIELD_NAME]: REGIONS_COVERED_REQUIRED_MESSAGE,
};

export const NO_AGE_RESTRICTION_VALUE = 1000;
export const NOT_OFFERED_VALUE = -1;

export const TRIP_COVER_REGION_OPTIONS: {
  label: string;
  value: CoverArea;
}[] = [
  { label: 'Europe', value: 'uk_and_europe' },
  {
    label: 'Worldwide excluding USA',
    value: 'worldwide_excluding_us_canada',
  },
  { label: 'Worldwide', value: 'worldwide_including_us_canada' },
];

export const SUMMARY_REGION_LABELS: Record<CoverArea, string> = {
  uk_and_europe: 'Europe',
  worldwide_excluding_us_canada: 'Worldwide Excl. USA',
  worldwide_including_us_canada: 'Worldwide Incl. USA',
};

export const SUMMARY_COLUMN_LABELS = {
  ageLimitRegions: 'Age limit regions',
  serviceDetailsQuestions: 'Service details questions',
  selection: 'Selection',
} as const;

export const TRIP_COVER_TRIP_TYPES = TRIP_TYPE_OPTIONS.map((opt) => opt.value);

const TRIP_TYPE_HEADING_LABELS: Record<TripType, string> = {
  single_trip: 'single trip',
  annual_multi_trip: 'annual multi-trip',
};

export const TRIP_COVER_DURATION_SECTIONS: {
  bucket: TripDurationBucket;
  label: string;
}[] = [
  { bucket: 'up_to_30_days', label: 'Up to 30 days' },
  { bucket: 'up_to_90_days', label: 'Up to 90 days' },
  { bucket: 'over_90_days', label: 'Up to 90+ days' },
];

export const TRIP_COVER_AGE_MODES: {
  mode: AgeLimitMode;
  label: string;
}[] = [
  { mode: 'land', label: 'Maximum age for non-cruise trips' },
  { mode: 'cruise', label: 'Maximum age for cruise trips' },
];

const AGE_LIMIT_DURATION_ERROR_PHRASES: Record<TripDurationBucket, string> = {
  up_to_30_days: 'up to 30 days',
  up_to_90_days: 'up to 90 days',
  over_90_days: 'over 90 days',
};

const AGE_LIMIT_MODE_ERROR_PHRASES: Record<AgeLimitMode, string> = {
  land: 'non-cruise trips',
  cruise: 'cruise trips',
};

const NUMERIC_AGE_LIMIT_VALUES = Array.from(
  { length: 36 },
  (_, index) => 65 + index,
);

export const TRIP_COVER_AGE_LIMIT_OPTIONS: { text: string; value: string }[] = [
  { text: 'No age restriction', value: String(NO_AGE_RESTRICTION_VALUE) },
  { text: 'Not offered', value: String(NOT_OFFERED_VALUE) },
  ...NUMERIC_AGE_LIMIT_VALUES.map((age) => ({
    text: String(age),
    value: String(age),
  })),
];

export function getRegionLabel(coverArea: CoverArea): string {
  return (
    TRIP_COVER_REGION_OPTIONS.find((option) => option.value === coverArea)
      ?.label ?? coverArea
  );
}

export function getAgePageHeading(
  coverArea: CoverArea,
  tripType: TripType,
): string {
  return `Set age for ${getRegionLabel(coverArea)} ${
    TRIP_TYPE_HEADING_LABELS[tripType]
  }`;
}

export function getAgeLimitFieldLabels(): Record<string, string> {
  const labels: Record<string, string> = {};

  for (const { bucket, label: durationLabel } of TRIP_COVER_DURATION_SECTIONS) {
    for (const { mode, label: modeLabel } of TRIP_COVER_AGE_MODES) {
      labels[`${bucket}_${mode}`] = `${durationLabel} - ${modeLabel}`;
    }
  }

  return labels;
}

export function getAgeLimitRequiredMessages(): Record<string, string> {
  const messages: Record<string, string> = {};

  for (const { bucket } of TRIP_COVER_DURATION_SECTIONS) {
    for (const { mode } of TRIP_COVER_AGE_MODES) {
      const key = `${bucket}_${mode}`;
      messages[key] =
        `Select a maximum age for ${AGE_LIMIT_MODE_ERROR_PHRASES[mode]} ` +
        `${AGE_LIMIT_DURATION_ERROR_PHRASES[bucket]}`;
    }
  }

  return messages;
}
