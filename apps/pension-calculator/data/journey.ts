import type { Translate } from 'types/translation';

const JOURNEY_TOTAL_SECTIONS = 8;

export const JOURNEY_PAGES = {
  ABOUT_YOU: 'about-you',
  YOUR_INCOME: 'your-income',
  POTS_OF_MONEY: 'pots-of-money',
  POT_DETAILS: 'pots-of-money/details',
  POT_CONTRIBUTIONS: 'pots-of-money/contributions',
  POT_SUMMARY: 'pots-of-money/summary',
  INCOME_PENSIONS: 'income-pensions',
  SAVE: 'save',
} as const;

export type JourneyPage = (typeof JOURNEY_PAGES)[keyof typeof JOURNEY_PAGES];

export type JourneySectionPage = Exclude<
  JourneyPage,
  | 'save'
  | 'pots-of-money/details'
  | 'pots-of-money/contributions'
  | 'pots-of-money/summary'
  | 'income-pensions'
>;

export const JOURNEY_ACTIONS = ['continue', 'save'] as const;

export type JourneyAction = (typeof JOURNEY_ACTIONS)[number];

const JOURNEY_SECTIONS: Record<JourneySectionPage, number> = {
  [JOURNEY_PAGES.ABOUT_YOU]: 1,
  [JOURNEY_PAGES.YOUR_INCOME]: 2,
  [JOURNEY_PAGES.POTS_OF_MONEY]: 3,
};

export const journeyCopy = (z: Translate) => ({
  back: z({ en: 'Back', cy: 'Yn ôl' }),
  continue: z({ en: 'Continue', cy: '' }),
  saveAndComeBack: z({ en: 'Save and come back later', cy: '' }),
  sectionProgress: (page: JourneySectionPage) =>
    z({
      en: `Section ${JOURNEY_SECTIONS[page]} of ${JOURNEY_TOTAL_SECTIONS}`,
      cy: '',
    }),
});
