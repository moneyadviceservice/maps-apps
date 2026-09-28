import { FREQUENCY_MONTH, FREQUENCY_WEEK, FREQUENCY_YEAR } from './frequency';

import type { Translate } from 'types/translation';

import type { Options } from '@maps-react/form/components/Select';

export const yourIncomeCopy = (z: Translate) => ({
  heading: z({ en: 'Your income', cy: '' }),
  intro: z({
    en: 'These details are used to calculate how much money you might need for a comfortable retirement. We call this your target retirement income.',
    cy: '',
  }),
  grossPayLabel: z({
    en: 'What is your pay from work, before tax and other deductions?',
    cy: '',
  }),
  grossPayHint: z({
    en: 'This is the income you get from an employer or self-employment, before tax, National Insurance or other deductions are taken off.',
    cy: '',
  }),
  otherIncomeLabel: z({
    en: 'Do you have any other income? (optional)',
    cy: '',
  }),
  otherIncomeHint: z({
    en: 'Enter any other income you have, such as from benefits, savings, investments and renting out a property.',
    cy: '',
  }),
  otherIncomeGroupHeading: z({ en: 'Other income', cy: '' }),
  nameLabel: z({ en: 'Name', cy: '' }),
  amountLabel: z({ en: 'Amount', cy: '' }),
  frequencyLabel: z({ en: 'Frequency', cy: '' }),
  namePlaceholderSavings: z({ en: 'For example, Savings', cy: '' }),
  namePlaceholderInvestments: z({ en: 'For example, Investments', cy: '' }),
  addAnotherIncome: z({ en: 'Add another income', cy: '' }),
  remove: z({ en: 'Remove', cy: '' }),
  errorSummaryTitle: z({ en: 'There is a problem', cy: '' }),
});

export const INCOME_ERROR_COPY = {
  grossPayRequired: {
    en: 'Enter details of your income to continue',
    cy: '',
  },
  amountInvalid: {
    en: 'Enter an amount in pounds, like 26900',
    cy: '',
  },
  otherIncomeNameRequired: {
    en: 'Enter a name for this income',
    cy: '',
  },
  otherIncomeAmountRequired: {
    en: 'Enter an amount for this income',
    cy: '',
  },
} as const;

export type IncomeErrorKey = keyof typeof INCOME_ERROR_COPY;

export const getIncomeErrorMessage = (
  key: IncomeErrorKey,
  lang: string,
): string => {
  const copy = INCOME_ERROR_COPY[key];
  if (lang === 'cy' && copy.cy) {
    return copy.cy;
  }
  return copy.en;
};

export const frequencyOptions = (z: Translate): Options[] => [
  {
    text: z({ en: 'Per year', cy: '' }),
    value: FREQUENCY_YEAR,
  },
  {
    text: z({ en: 'Per month', cy: '' }),
    value: FREQUENCY_MONTH,
  },
  {
    text: z({ en: 'Per week', cy: '' }),
    value: FREQUENCY_WEEK,
  },
];
