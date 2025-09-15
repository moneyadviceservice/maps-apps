import { Options } from '@maps-react/form/components/Select';

export enum PAGES_NAMES {
  ABOUTYOU = 'about-you',
  RETIREMENT = 'retirement',
  ESSENTIALS = 'essential-outgoings',
  SUMMARY = 'summary',
}

export const FREQUENCY_OPTIONS: Options[] = [
  { text: 'Per day', value: 'day' },
  { text: 'Per week', value: 'week' },
  { text: 'Per 2 weeks', value: 'twoweeks' },
  { text: 'Per 4 weeks', value: 'fourweeks' },
  { text: 'Per month', value: 'month' },
  { text: 'Per quarter', value: 'quarter' },
  { text: 'Per 6 months', value: 'sixmonths' },
  { text: 'Per year', value: 'year' },
];

export const CACHED_DATA_NAME = 'retirement-budget-planner';

export const getPageEnum = (tabName: string): PAGES_NAMES => {
  const match = Object.values(PAGES_NAMES).find((value) => value === tabName);
  return match ?? PAGES_NAMES.ABOUTYOU;
};
