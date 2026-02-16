import { Options } from '@maps-react/form/components/Select';

export enum PAGES_NAMES {
  ABOUTYOU = 'about-you',
  INCOME = 'income',
  ESSENTIALS = 'essential-outgoings',
  SUMMARY = 'summary',
}

const MONTHLY_FREQUENCY = 30.416666666666668;
export const DEFAULT_FACTOR = 1;

export enum FREQUNCY_KEYS {
  DAY = 'day',
  WEEK = 'week',
  TWO_WEEKS = 'twoweeks',
  FOUR_WEEKS = 'fourweeks',
  MONTH = 'month',
  QUARTER = 'quarter',
  SIX_MONTHS = 'sixmonths',
  YEAR = 'year',
}

export const FREQUENCY_FACTOR_MAPPING = [
  {
    text: 'Per day',
    key: FREQUNCY_KEYS.DAY,
    value: MONTHLY_FREQUENCY,
  },
  {
    text: 'Per week',
    key: FREQUNCY_KEYS.WEEK,
    value: MONTHLY_FREQUENCY / 7,
  },
  {
    text: 'Per 2 weeks',
    key: FREQUNCY_KEYS.TWO_WEEKS,
    value: MONTHLY_FREQUENCY / 14,
  },
  {
    text: 'Per 4 weeks',
    key: FREQUNCY_KEYS.FOUR_WEEKS,
    value: MONTHLY_FREQUENCY / 28,
  },
  {
    text: 'Per month',
    key: FREQUNCY_KEYS.MONTH,
    value: DEFAULT_FACTOR,
  },
  {
    text: 'Per quarter',
    key: FREQUNCY_KEYS.QUARTER,
    value: 1 / 3,
  },
  {
    text: 'Per 6 months',
    key: FREQUNCY_KEYS.SIX_MONTHS,
    value: 1 / 6,
  },
  {
    text: 'Per year',
    key: FREQUNCY_KEYS.YEAR,
    value: 1 / 12,
  },
];

export const FREQUENCY_OPTIONS: Options[] = FREQUENCY_FACTOR_MAPPING.map(
  (f) => ({ text: f.text, value: f.key }),
);

export enum SUMMARY_PROPS {
  INCOME = 'income',
  SPENDING = 'spending',
}

export const getPageEnum = (tabName: string): PAGES_NAMES => {
  const match = Object.values(PAGES_NAMES).find((value) => value === tabName);
  return match ?? PAGES_NAMES.ABOUTYOU;
};
