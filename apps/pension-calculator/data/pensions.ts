import type { Translate } from 'types/translation';

export const pensionsCopy = (z: Translate) => ({
  screeningHeading: z({ en: 'Pensions that build up a pot of money', cy: '' }),
  screeningQuestion: z({
    en: 'Do you have a pension that builds up a pot of money?',
    cy: '',
  }),
  yes: z({ en: 'Yes', cy: '' }),
  no: z({ en: 'No', cy: '' }),
  screeningGuidanceTitle: z({
    en: 'What is a pension that provides an income?',
    cy: '',
  }),
  screeningGuidance: z({
    en: 'Defined Contribution pensions build up a pot of money. They can include workplace schemes and personal pensions.',
    cy: '',
  }),
  screeningSignpost: z({
    en: 'If you only have pensions that pay a guaranteed regular income, choose No.',
    cy: '',
  }),
  detailsHeading: z({
    en: 'Pensions that build up a pot of money - Your pension details',
    cy: '',
  }),
  detailsIntro: z({
    en: 'Enter details of any pensions that build up a pot of money.',
    cy: '',
  }),
  pension: z({ en: 'Pension', cy: '' }),
  pensionName: z({ en: 'Pension name (optional)', cy: '' }),
  pensionNamePlaceholder: z({
    en: 'For example, provider or employer name',
    cy: '',
  }),
  currentValue: z({ en: 'What is the current value of your pension?', cy: '' }),
  findValue: z({ en: 'How do I find this?', cy: '' }),
  findValueGuidance: z({
    en: 'You can usually find this in your pension provider online account or your latest annual statement.',
    cy: '',
  }),
  taxFreeCash: z({
    en: 'What is your tax-free cash entitlement? (optional)',
    cy: '',
  }),
  taxFreeCashCallout: z({
    en: 'Tax-free cash rules for pension(s) that build a pension pot',
    cy: '',
  }),
  taxFreeCashGuidance: z({
    en: 'You can usually take up to 25% of a pension pot as tax-free cash. Your provider can confirm what applies to you.',
    cy: '',
  }),
  addPension: z({ en: 'Add another pension', cy: '' }),
  removePension: z({ en: 'Remove pension', cy: '' }),
  contributionsHeading: z({
    en: 'Pensions that build up a pot of money - Your contributions',
    cy: '',
  }),
  employeeContribution: z({
    en: 'How much do you pay into your pot of money pension(s) each month? (Optional)',
    cy: '',
  }),
  employerContribution: z({
    en: 'How much does your employer pay into your pot of money pension(s) each month? (Optional)',
    cy: '',
  }),
  percentage: z({ en: 'Percentage of salary', cy: '' }),
  fixed: z({ en: 'Fixed amount', cy: '' }),
  percentageHint: z({ en: 'Enter a percentage from 0 to 100', cy: '' }),
  frequency: z({ en: 'Frequency', cy: '' }),
  annualManagementCharge: z({ en: 'Annual management charge / fee', cy: '' }),
  feeGuidanceTitle: z({ en: 'What is this?', cy: '' }),
  feeGuidance: z({
    en: 'This is the yearly charge your pension provider takes for managing your pension.',
    cy: '',
  }),
  errorSummaryTitle: z({ en: 'There is a problem', cy: '' }),
});

const ERROR_COPY = {
  screeningRequired:
    'Select yes if you have a pension that builds up a pot of money.',
  currentValueRequired: 'Enter the current value of your pension.',
  amountInvalid: 'Enter an amount in pounds, like 26900',
  percentageInvalid: 'Enter a percentage between 0 and 100',
} as const;

export type PensionErrorKey = keyof typeof ERROR_COPY;
export const getPensionErrorMessage = (key: PensionErrorKey) => ERROR_COPY[key];
