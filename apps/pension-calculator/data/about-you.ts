import type { Translate } from 'types/translation';

export const aboutYouCopy = (z: Translate) => ({
  heading: z({ en: 'About you', cy: '' }),
  intro: z({
    en: 'We need these details to work out the earliest you can claim the State Pension and the age you’d like to retire.',
    cy: '',
  }),
  dobLabel: z({ en: 'What is your date of birth?', cy: '' }),
  dobHint: z({ en: 'For example, 27 03 1960.', cy: '' }),
  sexLabel: z({ en: 'What is your sex?', cy: '' }),
  sexMale: z({ en: 'Male', cy: '' }),
  sexFemale: z({ en: 'Female', cy: '' }),
  retireAgeLabel: z({
    en: 'What age would you like to retire at?',
    cy: '',
  }),
  retireAgeHint: z({
    en: 'Many pensions are designed to start paying out at age 65 or later. The earliest you can usually take your private pension is age 55 (57 from April 2028).',
    cy: '',
  }),
  retireAgeSuffix: z({ en: 'years old', cy: '' }),
  accordionTitle: z({ en: 'Why do we need this information?', cy: '' }),
  errorSummaryTitle: z({ en: 'There is a problem', cy: '' }),
});

const ABOUT_YOU_ERROR_COPY = {
  dobFormat: {
    en: 'Enter your date of birth as DD:MM:YYYY. For example, 27 03 1960.',
    cy: '',
  },
  dobAgeRange: {
    en: 'Your age must be between 18 and 74.',
    cy: '',
  },
  sexRequired: {
    en: 'Select male or female.',
    cy: '',
  },
  retireAgeInvalid: {
    en: 'Enter the age you’d like to retire, from 55 to 99. This can be your current age or older.',
    cy: '',
  },
} as const;

export type AboutYouErrorKey = keyof typeof ABOUT_YOU_ERROR_COPY;

export const getAboutYouErrorMessage = (
  key: AboutYouErrorKey,
  lang: string,
): string => {
  const copy = ABOUT_YOU_ERROR_COPY[key];
  if (lang === 'cy' && copy.cy) {
    return copy.cy;
  }
  return copy.en;
};
