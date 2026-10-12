export const FREQUENCY_YEAR = 'year';
export const FREQUENCY_MONTH = 'month';
export const FREQUENCY_WEEK = 'week';

const FREQUENCY_VALUES = [
  FREQUENCY_YEAR,
  FREQUENCY_MONTH,
  FREQUENCY_WEEK,
] as const;

export type FrequencyValue = (typeof FREQUENCY_VALUES)[number];

export const DEFAULT_FREQUENCY: FrequencyValue = FREQUENCY_YEAR;

export const parseFrequency = (value: string | undefined): FrequencyValue =>
  FREQUENCY_VALUES.includes(value as FrequencyValue)
    ? (value as FrequencyValue)
    : DEFAULT_FREQUENCY;
