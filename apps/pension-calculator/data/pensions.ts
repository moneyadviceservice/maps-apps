import type { Translate } from 'types/translation';

export const pensionPotsCopy = (z: Translate) => ({
  screeningHeading: z({
    en: 'Pensions that build up a pot of money',
    cy: '',
  }),
  screeningQuestion: z({
    en: 'Do you have a defined contribution pension or any other type that builds up a pot of money?',
    cy: '',
  }),
  yes: z({ en: 'Yes', cy: '' }),
  no: z({ en: 'No', cy: '' }),
  screeningGuidanceTitle: z({
    en: 'Not sure?',
    cy: '',
  }),
  screeningGuidance: z({
    en: 'This includes:',
    cy: '',
  }),
  screeningGuidanceList: z({
    en: [
      'defined contribution (DC) pensions',
      'cash balance schemes',
      'some additional voluntary contribution (AVC) schemes',
      'a pension pot in a hybrid pension scheme.',
    ],
    cy: [''],
  }),
  screeningSignpostParagraphs: z({
    en: [
      'Most pensions set up since 2000 build up a pot of money, unless you work in the public sector - like the NHS, Civil Service or the Armed Forces.',
      'Your provider can confirm the type you have.',
    ],
    cy: [''],
  }),
  screeningDifferentPensionType: z({
    en: 'Find out more in our guide about',
    cy: '',
  }),
  screeningDifferentPensionTypeLinkTitle: z({
    en: 'different pension types',
    cy: '',
  }),
  screeningDifferentPensionTypeLinkHref: z({
    en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/types-of-pension-and-how-they-work',
    cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/types-of-pension-and-how-they-work',
  }),
  detailsHeading: z({
    en: 'Defined contribution pensions (Or any other type that builds up a pot of money)',
    cy: '',
  }),
  detailsIntro: z({
    en: 'Enter details of any pension(s) that build up a pot of money.',
    cy: '',
  }),
  pension: z({ en: 'Pension', cy: '' }),
  pensionName: z({ en: 'Pension name', cy: '' }),
  pensionNameHint: z({
    en: 'For example, you could use your employer, pension provider or scheme name.',
    cy: '',
  }),
  currentValue: z({ en: 'What is the current value of your pension?', cy: '' }),
  currentValueHint: z({ en: 'For example, £20,000.', cy: '' }),
  findValue: z({ en: 'How do I find this?', cy: '' }),
  findValueGuidance: z({
    en: "To find out the value of your pension you can usually log in to your provider's online account, use the last annual statement you received or speak to your provider.",
    cy: '',
  }),
  taxFreeCash: z({
    en: 'What is your tax-free cash entitlement? (optional)',
    cy: '',
  }),
  taxFreeCashCallout: z({
    en: 'How much tax-free cash do you plan to take as a lump sum? ',
    cy: '',
  }),
  taxFreeCashGuidance: z({
    en: 'You might be able to take up to 25% of your pension as a tax-free lump sum when it starts to pay you a regular income.',
    cy: '',
  }),
  taxFreeCashGuidanceListTitle: z({
    en: 'Depending on your scheme, this will either mean your guaranteed income will:',
    cy: '',
  }),
  taxFreeCashGuidanceBulletOne: z({
    en: "stay the same - if you've built up a separate amount for a lump sum.",
    cy: '',
  }),
  taxFreeCashGuidanceBulletTwo: z({
    en: "reduce - as you're converting future income into a lump sum to take now.",
    cy: '',
  }),
  taxFreeCashScheme: z({
    en: 'Your scheme will be able to explain the rules that apply to you.',
    cy: '',
  }),
  addPension: z({ en: 'Add another pension', cy: '' }),
  removePension: z({ en: 'Remove pension', cy: '' }),
  contributionsHeading: z({
    en: 'Pensions that build up a pot of money - Your contributions',
    cy: '',
  }),
  employeeContribution: z({
    en: 'How much do you pay in each month? (optional)',
    cy: '',
  }),
  employeeContributionHint: z({
    en: 'For example, £100 or 5% of your salary.',
    cy: '',
  }),
  employerContribution: z({
    en: 'How much does your employer pay in each month? (optional)',
    cy: '',
  }),
  percentage: z({ en: 'Percentage of salary', cy: '' }),
  percentageInputLabel: z({ en: 'Percentage', cy: '' }),
  fixed: z({ en: 'Fixed amount', cy: '' }),
  fixedInputLabel: z({ en: 'Fixed amount', cy: '' }),
  contributionHintLabel: z({
    en: 'Help if your pension contribution changes each month',
    cy: '',
  }),
  contributionHint: z({
    en: 'Divide your usual or estimated yearly amount by 12.',
    cy: '',
  }),
  frequency: z({ en: 'Frequency', cy: '' }),
  annualManagementCharge: z({ en: 'Annual management charge / fee', cy: '' }),
  feeGuidanceTitle: z({ en: 'What is this?', cy: '' }),
  feeGuidance: z({
    en: 'This is the yearly charge your pension provider takes for managing your pension.',
    cy: '',
  }),
  errorSummaryTitle: z({ en: 'There is a problem', cy: '' }),
});

export type PensionPotsCopy = ReturnType<typeof pensionPotsCopy>;

export const incomePensionsCopy = (z: Translate) => ({
  screeningHeading: z({ en: 'Your pensions', cy: '' }),
  screeningQuestion: z({
    en: 'Do you have a defined benefit pension or any other type that will automatically pay you a regular retirement income?',
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
    en: '',
    cy: '',
  }),
  detailsIntro: z({
    en: '',
    cy: '',
  }),
  pension: z({ en: '', cy: '' }),
  pensionName: z({ en: '', cy: '' }),
  pensionNameHint: z({ en: '', cy: '' }),
  currentValue: z({ en: '', cy: '' }),
  currentValueHint: z({ en: '', cy: '' }),
  findValue: z({ en: '', cy: '' }),
  findValueGuidance: z({
    en: '',
    cy: '',
  }),
  taxFreeCash: z({
    en: '',
    cy: '',
  }),
  taxFreeCashCallout: z({
    en: '',
    cy: '',
  }),
  taxFreeCashGuidance: z({
    en: '',
    cy: '',
  }),
  taxFreeCashGuidanceListTitle: z({
    en: '',
    cy: '',
  }),
  taxFreeCashGuidanceBulletOne: z({
    en: '',
    cy: '',
  }),
  taxFreeCashGuidanceBulletTwo: z({
    en: '',
    cy: '',
  }),
  taxFreeCashScheme: z({
    en: '',
    cy: '',
  }),
  addPension: z({ en: '', cy: '' }),
  removePension: z({ en: '', cy: '' }),
  contributionsHeading: z({
    en: '',
    cy: '',
  }),
  employeeContribution: z({
    en: '',
    cy: '',
  }),
  employerContribution: z({
    en: '',
    cy: '',
  }),
  percentage: z({ en: '', cy: '' }),
  percentageInputLabel: z({ en: '', cy: '' }),
  fixed: z({ en: '', cy: '' }),
  fixedInputLabel: z({ en: '', cy: '' }),
  contributionHintLabel: z({
    en: '',
    cy: '',
  }),
  contributionHint: z({ en: '', cy: '' }),
  frequency: z({ en: '', cy: '' }),
  annualManagementCharge: z({ en: '', cy: '' }),
  feeGuidanceTitle: z({ en: '', cy: '' }),
  feeGuidance: z({
    en: '',
    cy: '',
  }),
  errorSummaryTitle: z({ en: '', cy: '' }),
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
