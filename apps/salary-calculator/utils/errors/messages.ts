import { TranslationGroupString } from '@maps-react/form/types';

export const errorMessages = {
  'income-required': {
    en: 'Enter your gross salary',
    cy: 'no translation',
  },

  'hours-per-week-invalid': {
    en: 'Enter the number of hours a week you work',
    cy: 'no translation',
  },

  'days-per-week-invalid': {
    en: 'Enter the number of days a week you work',
    cy: 'no translation',
  },

  'hours-per-week-range': {
    en: 'Enter the number of weekly hours you worked - between 1 and 168',
    cy: 'no translation',
  },

  'days-per-week-range': {
    en: 'Enter a number between 1 and 7',
    cy: 'no translation',
  },

  'tax-code-invalid': {
    en: 'It looks like your tax code is not correct. Please check and enter it again. Most tax codes have both letters and numbers.',
    cy: 'no translation',
  },

  'pension-percent-range': {
    en: 'Your monthly pension contributions must be less than 100% of your income',
    cy: 'no translation',
  },

  'pension-fixed-range': {
    en: 'Your monthly pension contributions must be less than £XXXXX (your monthly gross income)',
    cy: 'no translation',
  },
} as Record<string, TranslationGroupString>;
