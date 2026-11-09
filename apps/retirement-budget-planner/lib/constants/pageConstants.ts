import { Options } from '@maps-react/form/components/Select';
import useTranslation from '@maps-react/hooks/useTranslation';

export enum PAGES_NAMES {
  ABOUTYOU = 'about-you',
  INCOME = 'income',
  ESSENTIALS = 'essential-outgoings',
  SUMMARY = 'summary',
}

export enum PAGES_NAMES_EXTRA {
  LANDING = 'landing',
  SAVE = 'save',
  SAVED = 'progress-saved',
  ERROR = 'error-page',
}

export enum TAB_KEYS {
  PREVIOUS_TAB_KEY = 'rbp-previous-tab',
  NAV_TYPE_KEY = 'rbp-nav-type',
}

export enum NAV_TYPES {
  TAB_CLICK = 'tab-click',
  CONTINUE = 'continue',
  BACK = 'back',
}

const MONTHLY_FREQUENCY = 30.416666666666668;
export const DEFAULT_FACTOR = 1;

export enum FREQUENCY_KEYS {
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
    key: FREQUENCY_KEYS.DAY,
    value: MONTHLY_FREQUENCY,
  },
  {
    key: FREQUENCY_KEYS.WEEK,
    value: MONTHLY_FREQUENCY / 7,
  },
  {
    key: FREQUENCY_KEYS.TWO_WEEKS,
    value: MONTHLY_FREQUENCY / 14,
  },
  {
    key: FREQUENCY_KEYS.FOUR_WEEKS,
    value: MONTHLY_FREQUENCY / 28,
  },
  {
    key: FREQUENCY_KEYS.MONTH,
    value: DEFAULT_FACTOR,
  },
  {
    key: FREQUENCY_KEYS.QUARTER,
    value: 1 / 3,
  },
  {
    key: FREQUENCY_KEYS.SIX_MONTHS,
    value: 1 / 6,
  },
  {
    key: FREQUENCY_KEYS.YEAR,
    value: 1 / 12,
  },
];

export const FREQUENCY_FACTOR_TEXT_TRANSLATION_MAPPING = {
  [FREQUENCY_KEYS.DAY]: 'frequency.day',
  [FREQUENCY_KEYS.WEEK]: 'frequency.week',
  [FREQUENCY_KEYS.TWO_WEEKS]: 'frequency.twoweeks',
  [FREQUENCY_KEYS.FOUR_WEEKS]: 'frequency.fourweeks',
  [FREQUENCY_KEYS.MONTH]: 'frequency.month',
  [FREQUENCY_KEYS.QUARTER]: 'frequency.quarter',
  [FREQUENCY_KEYS.SIX_MONTHS]: 'frequency.sixmonths',
  [FREQUENCY_KEYS.YEAR]: 'frequency.year',
};

export const FREQUENCY_FACTOR_MAPPING_WITH_TEXT = (
  t: ReturnType<typeof useTranslation>['t'],
) => {
  return FREQUENCY_FACTOR_MAPPING.map(({ key, value }) => ({
    key,
    value,
    text: t(FREQUENCY_FACTOR_TEXT_TRANSLATION_MAPPING[key]),
  }));
};

export const FREQUENCY_OPTIONS = (
  t: ReturnType<typeof useTranslation>['t'],
): Options[] =>
  FREQUENCY_FACTOR_MAPPING_WITH_TEXT(t).map(({ key, text }) => ({
    text,
    value: key,
  }));

export enum SUMMARY_PROPS {
  INCOME = 'income',
  SPENDING = 'spending',
}

export const isStringPageName = (str: string): str is PAGES_NAMES => {
  return Object.values(PAGES_NAMES).includes(str as PAGES_NAMES);
};

export const getPageEnum = (tabName: string): PAGES_NAMES => {
  const match = Object.values(PAGES_NAMES).find((value) => value === tabName);
  return match ?? PAGES_NAMES.ABOUTYOU;
};

export const allPageNamesArray = Object.keys(PAGES_NAMES).map(
  (key) => PAGES_NAMES[key as keyof typeof PAGES_NAMES],
);
