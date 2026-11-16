import type { Translate } from 'types/translation';

export const pensionPotsCopy = (z: Translate) => ({
  heading: z({
    en: 'Defined contribution pensions\n(Or any other type that builds up a pot of money)',
    cy: '',
  }),
  summaryHeading: z({
    en: 'Summary',
    cy: '',
  }),
  summarySubmitButton: z({
    en: 'Confirm',
    cy: '',
  }),
  pensionCard: {
    pensionLabel: z({
      en: 'Pension',
      cy: '',
    }),
    currentValueLabel: z({
      en: 'Current value',
      cy: '',
    }),
    yourContributionLabel: z({
      en: 'Your contribution',
      cy: '',
    }),
    employerContributionLabel: z({
      en: 'Employer contribution',
      cy: '',
    }),
    monthlyFrequencyLabel: z({
      en: 'per month',
      cy: 'y mis',
    }),
    removeButtonLabel: z({
      en: 'Remove pension',
      cy: '',
    }),
    editDetailsLinkLabel: z({
      en: 'Edit details',
      cy: '',
    }),
  },
});
