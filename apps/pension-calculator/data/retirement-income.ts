import type { Translate } from 'types/translation';

export const retirementIncomeCopy = (z: Translate) => ({
  heading: z({ en: 'Your retirement income needs', cy: '' }),
  intro: z({
    en: 'To see if you’re on track for the retirement lifestyle you’d like, we’ll compare your total pension income to how much you’re likely to need – called your target retirement income.',
    cy: '',
  }),
  resultBefore: z({
    en: 'We’ve set your target retirement income as',
    cy: '',
  }),
  frequencyLabel: z({
    en: 'Show the target retirement income',
    cy: '',
  }),
  apply: z({ en: 'Apply', cy: '' }),
  calculated: z({
    en: 'It’s calculated based on government research into retirement income needs.',
    cy: '',
  }),
  changeLater: z({
    en: 'You can change your target retirement income on the results page.',
    cy: '',
  }),
  howCalculated: z({
    en: 'How your target retirement income is calculated',
    cy: '',
  }),
  howCalculatedText: z({
    en: 'These figures come from research by the Department for Work and Pensions into the income people need in retirement. The percentage is the share of your current salary you might need for a similar standard of living.',
    cy: '',
  }),
  salaryHeading: z({ en: 'Annual salary', cy: '' }),
  percentageHeading: z({ en: 'Percentage', cy: '' }),
  upTo: z({ en: 'Up to', cy: '' }),
  to: z({ en: 'to', cy: '' }),
  andAbove: z({ en: 'and above', cy: '' }),
  livingCosts: z({
    en: 'Why living costs often reduce in retirement',
    cy: '',
  }),
  livingCostsText: z({
    en: 'Many people’s costs go down after they retire. For example, you might spend less if:',
    cy: '',
  }),
  livingCostsMortgage: z({ en: 'You’ve paid off your mortgage', cy: '' }),
  livingCostsTravel: z({ en: 'You no longer pay to travel to work', cy: '' }),
  livingCostsContributions: z({
    en: 'You’re no longer making pension contributions',
    cy: '',
  }),
});
