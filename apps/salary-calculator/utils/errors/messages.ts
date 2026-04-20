import { TranslationGroupString } from '@maps-react/form/types';

export const errorMessages: Record<string, TranslationGroupString> = {
  'income-required': {
    en: 'Enter your gross salary{salary2Suffix}',
    cy: 'Rhowch eich cyflog gros{salary2Suffix}',
  },

  'days-per-week-invalid': {
    en: 'Enter the number of days a week you work{salary2}',
    cy: 'Rhowch nifer y dyddiau’r wythnos rydych chi’n gweithio{salary2}',
  },

  'hours-per-week-invalid': {
    en: 'Enter the number of hours a week you work{salary2}',
    cy: 'Rhowch nifer yr oriau’r wythnos rydych chi’n gweithio {salary2}',
  },

  'days-per-week-range': {
    en: 'Enter a number{salary2} between 1 and 7',
    cy: 'Rhowch rif{salary2} rhwng 1 a 7',
  },

  'hours-per-week-range': {
    en: 'Enter the number of weekly hours you worked{salary2} - between 1 and 168',
    cy: 'Rhowch nifer yr oriau wythnosol y gwnaethoch weithio{salary2} - rhwng 1 a 168',
  },

  'tax-code-invalid': {
    en: 'It looks like your tax code{salary2For} is not correct. Please check and enter it again. Most tax codes have both letters and numbers',
    cy: 'Mae’n ymddangos nad yw’ch cod treth{salary2For} yn gywir. Gwiriwch ef a’i roi eto. Mae gan y rhan fwyaf o godau treth lythrennau a rhifau',
  },

  'pension-percent-range': {
    en: 'Your monthly pension contributions{salary2For} must be less than 100% of your income',
    cy: 'Rhaid i’ch cyfraniadau pensiwn misol{salary2For} fod yn llai na 100% o’ch incwm',
  },

  'pension-fixed-invalid': {
    en: 'Your monthly pension contributions{salary2For} must be less than',
    cy: 'Rhaid i’ch cyfraniadau pensiwn misol{salary2For} fod yn llai na',
  },
};

export const salary2Text: TranslationGroupString = {
  en: ' for salary 2',
  cy: ' am gyflog 2',
};

export const salary2ForText: TranslationGroupString = {
  en: ' for salary 2',
  cy: ' ar gyfer cyflog 2',
};
