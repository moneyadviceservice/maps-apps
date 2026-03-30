import { Tab } from 'lib/types';

export const mockTabs: Tab[] = [
  {
    step: 1,
    tabName: 'about-you',
  },
  {
    step: 2,
    tabName: 'retirement',
  },
  {
    step: 3,
    tabName: 'household-bills',
  },
];

export const mockTabTranslation = {
  z: (obj: { en: string; cy: string }, _vars?: Record<string, unknown>) =>
    obj.en,
  t: (id: string) => {
    return [
      { key: 'pageTitle', value: 'Retirement Budget Planner' },
      { key: 'backButton', value: 'Back' },
      { key: 'continueButton', value: 'Continue' },
      { key: 'saveAndComeBackButton', value: 'Save and come back later' },
      { key: 'tabs.about-us', value: 'About you' },
      { key: 'tabs.income', value: 'Income' },
      { key: 'tabs.essential-outgoings', value: 'Essential Outgoings' },
      { key: 'tabs.summary', value: 'Summary' },
      { key: 'tabs.other', value: 'Other' },
    ].map(({ key, value }) => {
      if (key === id) return value;
    });
  },
  tList: () => [],
  locale: 'en',
};
