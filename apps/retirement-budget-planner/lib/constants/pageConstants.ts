import { Options } from '@maps-react/form/components/Select';

export enum PAGES_NAMES {
  ABOUTYOU = 'about-you',
  INCOME = 'income',
  ESSENTIALS = 'essential-outgoings',
  SUMMARY = 'summary',
}

const MONTHLY_FREQUENCY = 30.416666666666668;
export const DEFAULT_FACTOR = 1;

export const FREQUENCY_FACTOR_MAPPING = [
  {
    text: 'Per day',
    label: 'day',
    value: MONTHLY_FREQUENCY,
  },
  {
    text: 'Per week',
    label: 'week',
    value: MONTHLY_FREQUENCY / 7,
  },
  {
    text: 'Per 2 weeks',
    label: 'twoweeks',
    value: MONTHLY_FREQUENCY / 14,
  },
  {
    text: 'Per 4 weeks',
    label: 'fourweeks',
    value: MONTHLY_FREQUENCY / 28,
  },
  {
    text: 'Per month',
    label: 'month',
    value: DEFAULT_FACTOR,
  },
  {
    text: 'Per quarter',
    label: 'quarter',
    value: 1 / 3,
  },
  {
    text: 'Per 6 months',
    label: 'sixmonths',
    value: 1 / 6,
  },
  {
    text: 'Per year',
    label: 'year',
    value: 1 / 12,
  },
];

export const FREQUENCY_OPTIONS: Options[] = FREQUENCY_FACTOR_MAPPING.map(
  (f) => ({ text: f.text, value: f.label }),
);

export enum SUMMARY_PROPS {
  INCOME = 'income',
  SPENDING = 'spending',
}

export const getPageEnum = (tabName: string): PAGES_NAMES => {
  const match = Object.values(PAGES_NAMES).find((value) => value === tabName);
  return match ?? PAGES_NAMES.ABOUTYOU;
};
