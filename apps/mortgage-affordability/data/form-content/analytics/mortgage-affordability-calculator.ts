import { formatAnalyticsObject } from '@maps-react/utils/formatAnalyticsObject';
import { MacSteps } from 'pages/[language]/';

import { useTranslation } from '@maps-react/hooks/useTranslation';

export const stepData = {
  landing: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: '',
    pageTitle: z({
      en: 'How much can you afford to borrow for a mortgage',
      cy: 'Faint allwch chi fforddio ei fenthyg am forgais',
    }),
    stepName: 'How much can you afford to borrow for a mortgage',
  }),
  1: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'how-much-can-you-borrow',
    pageTitle: z({
      en: 'How much can you borrow?',
      cy: 'Faint allwch chi ei fenthyg?',
    }),
    stepName: 'How much can you borrow',
  }),
  2: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'monthly-household-costs',
    pageTitle: z({
      en: 'Monthly household costs',
      cy: 'Costau misol y cartref',
    }),
    stepName: 'Monthly household costs',
  }),
  notice: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'it-appears-your-budget-is-overstretched',
    pageTitle: z({
      en: 'It appears your budget is overstretched',
      cy: 'Fe ymddengys fod eich cyllideb wedi ei gorymestyn',
    }),
    stepName: 'It appears your budget is overstretched',
  }),
  3: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'your-results',
    pageTitle: z({
      en: 'Your results',
      cy: 'Eich canlyniadau',
    }),
    stepName: 'Your results',
  }),
  4: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'next-steps',
    pageTitle: z({
      en: 'Next steps',
      cy: 'Y camau nesaf',
    }),
    stepName: 'Next steps',
  }),
};

export const macAnalyticsData = (
  z: ReturnType<typeof useTranslation>['z'],
  currentStep: MacSteps,
) => {
  const anylticsToolData = {
    tool: 'Mortgage Affordability Calculator',
    toolCy: 'Cyfrifiannell fforddiadwyedd morgais',
    toolStep: `${currentStep}`,
    stepData: stepData[currentStep](z),
    pageToolName: 'mortgage-affordability-calculator',
    categoryLevels: ['Homes', 'Buying a home'],
  };

  return formatAnalyticsObject(z, anylticsToolData);
};
