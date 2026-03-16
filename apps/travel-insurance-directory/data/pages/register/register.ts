import { CreateUserObject, FieldType } from 'types/register';

interface CreateAccountInput {
  label: string;
  key: keyof CreateUserObject;
  type: FieldType;
}

export const page = {
  fcaPage: {
    heading: 'What is your FCA Firm Reference Number?',
    browserTitle: 'Register - What is your FCA Firm Reference Number?',
    inputs: {
      frn: [
        {
          label: 'FCA Firm Reference Number (FRN)',
          key: 'fcaNumber',
          type: 'text',
          regex: '[0-9]+',
          title: 'Please enter a valid FCA reference number (numbers only)',
          errors: {
            required: 'Enter your FCA Firm Reference Number',
            invalid: 'Enter a valid FCA Firm Reference Number',
            notFound:
              'The FCA Firm Reference Number you entered could not be found. Check that you have entered it correctly.',
            apiError:
              'There was a problem checking your FCA Firm Reference Number. Try again later.',
            unknown: 'An unknown error occurred',
          },
        },
      ],
    },
    info: {
      body: 'You can enter details for one firm. This can be the main authorised firm OR one trading name registered to the FCA Firm Reference Number (FRN) above.',
    },
    submitButton: { label: 'Continue' },
  },
  createAccountPage: {
    heading: 'Create your account',
    browserTitle: 'Register - Create your account',
    inputs: [
      { label: 'First name', key: 'givenName', type: 'text' },
      { label: 'Last name', key: 'surname', type: 'text' },
      {
        label: 'Individual Reference Number (IRN)',
        key: 'individualReferenceNumber',
        type: 'text',
      },
      { label: 'Job title', key: 'jobTitle', type: 'text' },
      { label: 'Email address', key: 'mail', type: 'email' },
      { label: 'Telephone number', key: 'phone', type: 'phone' },
      { label: 'Confirmation', key: 'confirmation', type: 'checkbox' },
    ] as CreateAccountInput[],
    otpInput: {
      info: 'Please enter the One-Time passcode which has been sent to:',
      label: 'One-time passcode',
      key: 'otp',
      type: 'text',
    },
    confirmCopy: {
      part1: `The Money & Pension Service ("MaPS") is operating this Directory pursuant to rules set out in the Financial Conduct Authority ("FCA") Handbook and anagreement with the FCA. MaPS reserves the right to obtainand maintain complete and continuous verification (including time-to-time at MaPS' discretion) any information provided in whole or in part in connection with a firm's application to be in the Directory. Such verification shall include MaPS seeking corroboration as to such evidence from the applicable firm, the FCA and/or anyother third party.`,
      part2:
        "MaPS also reserves the right to pass to the FCA any information from or about a firm that has applied to be in the Directory, including as to whether a firm has failed for any reason to provide complete and accurate information relevant to such application and the firm's appearance in the Directory. [No firm will be considered for the Directory without the electronic signature of a senior manager of the firm on the application. Such signature will constitute (i) the firm's agreement to the terms for being in the Directory, and (ii) the personal warranty of the signatory of their authority to bind the applicable firm to such terms.]and that you have the signatory of their authority to bind the applicable firm to such terms.",
    },
    submitButton: { label: 'Confirm' },
    nextButton: { label: 'Next' },
  },

  backLink: {
    label: 'Back',
  },
};
