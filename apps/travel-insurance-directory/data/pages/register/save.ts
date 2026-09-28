import { CopyItem } from './types';

type PageData = {
  heading: string;
  browserTitle: string;
  copy: CopyItem[];
  errors?: Record<string, string>;
  button: {
    label: string;
  };
  buttonRetry?: {
    label: string;
  };
};

type Page = {
  save: PageData;
  saved: PageData;
};

export const page: Page = {
  save: {
    heading: 'Save and come back later',
    browserTitle: 'Register - Save and come back later',
    copy: [
      {
        component: 'paragraph',
        content:
          "We'll send you a link to your registered account email to access your saved progress. Use the link in the email to return to your online progress any time.",
      },
      {
        component: 'paragraph',
        content:
          "We'll only use this email to send you a link to your saved progress.",
      },
      {
        component: 'paragraph',
        style: 'font-bold',
        content: 'Email address',
      },
    ],
    errors: {
      apiError: 'There was a problem sending your email. Try again later.',
    },
    button: {
      label: 'Save and send email',
    },
  },
  saved: {
    heading: 'Progress saved',
    browserTitle: 'Register - Progress saved',
    copy: [
      {
        component: 'paragraph',
        content: 'We have sent an email to {email}.',
        placeholder: {
          ref: '{email}',
          propName: 'email',
          replacementClassName: 'font-bold',
        },
      },
      {
        component: 'paragraph',
        content:
          'The email contains a link you can use to return to your Travel Insurance Directory submission. Check your junk or spam folder if you do not receive the email within a few minutes.',
      },
      {
        component: 'paragraph',
        content: 'You can now close this tab or continue your submission.',
      },
    ],
    button: {
      label: 'Continue',
    },
    buttonRetry: {
      label: 'Resend email',
    },
  },
};
