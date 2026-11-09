import type { Translate } from 'types/translation';

export const SAVE_EMAIL_ID = 'email';
export const SAVE_EMAIL_ERROR = 'email';
export const SAVE_SEND_ERROR = 'send';

export const saveCopy = (z: Translate) => ({
  heading: z({ en: 'Save and come back later', cy: '' }),
  intro: z({
    en: 'Save your pension calculator progress and get a link by email to return to it at any time.',
    cy: '',
  }),
  emailLabel: z({ en: 'Enter your email address', cy: '' }),
  emailHint: z({
    en: 'Your email address will not be used for any other purpose.',
    cy: '',
  }),
  button: z({ en: 'Save and send email', cy: '' }),
  errorSummaryTitle: z({ en: 'There is a problem', cy: '' }),
  emailInvalid: z({
    en: 'Enter an email address in the correct format',
    cy: '',
  }),
  sendFailed: z({
    en: 'There was a problem sending the email, please try again.',
    cy: '',
  }),
  savedHeading: z({ en: 'Your progress has been saved', cy: '' }),
  savedSubheading: z({ en: 'We’ve sent your link by email', cy: '' }),
  savedSent: z({
    en: 'The link to return to your saved pension calculator progress has been sent to the email address you gave us. It’ll come from moneyhelper.pensions@notifications.service.gov.uk.',
    cy: '',
  }),
  savedSpam: z({
    en: 'If you haven’t received it, check your spam folder or select resend email.',
    cy: '',
  }),
  returnToProgress: z({ en: 'Return to your saved progress', cy: '' }),
  resend: z({ en: 'Resend email', cy: '' }),
});
