import { useTranslation } from '@maps-react/hooks/useTranslation';

type Z = ReturnType<typeof useTranslation>['z'];

export const page = {
  heading: (z: Z) =>
    z({
      en: 'What is your FCA Firm Reference Number?',
      cy: '',
    }),

  browserTitle: (z: Z) =>
    z({
      en: 'Register - What is your FCA Firm Reference Number?',
      cy: '',
    }),

  inputs: (z: Z) => ({
    frn: {
      label: z({
        en: 'FCA Firm Reference Number',
        cy: '',
      }),
      errors: {
        required: z({
          en: 'Enter your FCA Firm Reference Number',
          cy: '',
        }),
        invalid: z({
          en: 'Enter a valid FCA Firm Reference Number',
          cy: '',
        }),
        notFound: z({
          en: 'The FCA Firm Reference Number you entered could not be found. Check that you have entered it correctly.',
          cy: '',
        }),
        apiError: z({
          en: 'There was a problem checking your FCA Firm Reference Number. Try again later.',
          cy: '',
        }),
        unknown: z({
          en: 'An unknown error occurred',
          cy: '',
        }),
      },
    },
  }),

  info: (z: Z) => ({
    body: z({
      en: 'You can enter details for one firm. This can be the main authorised firm OR one trading name registered to the FCA Firm Reference Number (FRN) above.',
      cy: '',
    }),
  }),

  buttonLabel: (z: Z) =>
    z({
      en: 'Continue',
      cy: '',
    }),

  singles: {
    back: (z: Z) =>
      z({
        en: 'Back',
        cy: 'Yn ôl',
      }),
  },
};
