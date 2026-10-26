import { CalendarLegendItem, TranslationFn } from './types';

/**
 * Generates the keyboard instructions for navigating the date picker based on the provided translation function.
 * @param z
 * @returns
 */
export const getKeyboardInstructions = (z: TranslationFn) =>
  z({
    en: 'Use arrow keys to move through days. Unavailable dates are skipped. Press Enter to select a date.',
    cy: 'Defnyddiwch y saethau i symud rhwng dyddiau. Mae dyddiadau sydd ddim ar gael yn cael eu hepgor. Pwyswch Enter i ddewis dyddiad.',
  });

export const getCalendarHelpTitle = (z: TranslationFn) =>
  z({
    en: 'Need help understanding the calendar?',
    cy: 'Angen help i ddeall y calendr?',
  });

export const getCalendarLegendItems = (
  z: TranslationFn,
): CalendarLegendItem[] => [
  {
    key: 'unavailable',
    label: z({
      en: 'Unavailable date - shown with a grey square',
      cy: 'Dyddiad ddim ar gael - wedi ei ddangos gyda sgwâr llwyd',
    }),
  },
  {
    key: 'available',
    label: z({
      en: 'Available date – shown with a pink square',
      cy: 'Dyddiad ar gael - wedi ei ddangos gyda sgwâr pinc',
    }),
  },
  {
    key: 'selected',
    label: z({
      en: 'Selected date – shown with a filled pink square',
      cy: 'Dyddiad wedi ei ddewis - wedi ei ddangos gyda sgwâr pinc wedi ei lenwi',
    }),
  },
];
