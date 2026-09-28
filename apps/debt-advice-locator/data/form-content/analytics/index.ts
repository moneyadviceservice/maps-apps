import { getPageTitle } from 'data/pageTitles';
import { DebtAdviceLocatorIndex } from 'pages/[language]';
import { analyticsObject } from 'utils/AnalyticsObject';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { debtAdviceLocatorQuestions } from '../questions';

export const stepData = {
  1: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'calculator--country',
    toolStep: '1',
    pageTitle: debtAdviceLocatorQuestions(z)[0].title,
    stepName: 'Where do you live?',
  }),
  2: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'self-employed',
    toolStep: '2',
    pageTitle: debtAdviceLocatorQuestions(z)[1].title,
    stepName: 'Are you a small business owner or self-employed?',
  }),
  3: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'select-debt-advice',
    toolStep: '3',
    pageTitle: debtAdviceLocatorQuestions(z)[2].title,
    stepName: 'How would you like to get debt advice?',
  }),
  4: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'what-is-your-location',
    toolStep: '5',
    pageTitle: debtAdviceLocatorQuestions(z)[3].title,
    stepName: 'What is your location?',
  }),
  online: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'advice-providers-online',
    toolStep: '4',
    pageTitle: getPageTitle(z)['online'],
    stepName: 'Where to get free debt advice online',
  }),
  telephone: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'advice-providers-telephone',
    toolStep: '4',
    pageTitle: getPageTitle(z)['telephone'],
    stepName: 'Where to get free debt advice by telephone',
  }),
  business: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'advice-providers-business',
    toolStep: '3',
    pageTitle: getPageTitle(z)['business'],
    stepName: 'Advice providers for small business owners or self-employed',
  }),
  face: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'advice-providers-face-to-face',
    toolStep: '6',
    pageTitle: getPageTitle(z)['face'],
    stepName: 'Where to get local debt advice',
  }),
};

export const debtAdviceLocatorAnalytics = (
  z: ReturnType<typeof useTranslation>['z'],
  currentStep: DebtAdviceLocatorIndex,
) => {
  const { pageName, pageTitle, stepName, toolStep } = stepData[currentStep](z);

  const anylticsToolData = {
    tool: 'Debt Advice Locator Tool',
    toolCy: 'Llinell amser arian babi',
    toolStep: `${toolStep}`,
    stepData: {
      pageName,
      pageTitle,
      stepName,
    },
    pageToolName: 'DALT',
    categoryLevels: [
      'Money Trouble',
      'Dealing with Debt',
      'Debt advice locator',
    ],
  };

  return analyticsObject(z, anylticsToolData);
};
