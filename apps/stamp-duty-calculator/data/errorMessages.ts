import {
  PurchaseDateErrorMessages,
  TranslationFunction,
} from '../utils/validation/types';

/**
 * Default error messages for purchase date validation
 */
export const getPurchaseDateErrorMessages = (
  z: TranslationFunction,
): PurchaseDateErrorMessages => ({
  required: z({
    en: 'Enter a purchase date',
    cy: 'Rhowch ddyddiad prynu',
  }),
  invalid: z({
    en: 'Enter a valid purchase date',
    cy: 'Rhowch ddyddiad prynu dilys',
  }),
  tooEarly: z({
    en: 'The purchase date cannot be before 06/04/2023',
    cy: 'Ni all y dyddiad prynu fod cyn 06/04/2023',
  }),
  missingDay: z({
    en: 'Enter a valid day',
    cy: 'Rhowch ddyddiad dilys',
  }),
  missingMonth: z({
    en: 'Enter a valid month',
    cy: 'Rhowch fis dilys',
  }),
  missingYear: z({
    en: 'Enter a valid year',
    cy: 'Rhowch flwyddyn ddilys',
  }),
  missingDayMonth: z({
    en: 'Enter a valid day and month',
    cy: 'Rhowch ddiwrnod a mis dilys',
  }),
  missingDayYear: z({
    en: 'Enter a valid day and year',
    cy: 'Rhowch ddiwrnod a blwyddyn ddilys',
  }),
  missingMonthYear: z({
    en: 'Enter a valid month and year',
    cy: 'Rhowch fis a blwyddyn ddilys',
  }),
});

/**
 * Error messages for buyer type validation
 */
export const getBuyerTypeErrorMessage = (z: TranslationFunction): string =>
  z({
    en: 'Select the type of property you are buying',
    cy: "Dewiswch y math o eiddo rydych chi'n ei brynu",
  });

/**
 * Error messages for price validation
 */
export const getPriceErrorMessage = (z: TranslationFunction): string =>
  z({
    en: 'Enter a property price, for example £200,000',
    cy: 'Rhowch bris eiddo, er enghraifft £200,000',
  });
