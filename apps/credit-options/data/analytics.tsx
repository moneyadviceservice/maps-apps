import { formatAnalyticsObject } from '@maps-react/utils/formatAnalyticsObject';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { pageTitles } from '../pages/[language]/';

export const stepData = {
  1: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-1',
    pageTitle: pageTitles(z)[1],
    stepName: 'How much do you need to borrow?',
  }),
  2: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-2',
    pageTitle: pageTitles(z)[2],
    stepName: 'What do you need the money for?',
  }),
  3: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-3',
    pageTitle: pageTitles(z)[3],
    stepName: 'How long could you wait for the money?',
  }),
  4: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-4',
    pageTitle: pageTitles(z)[4],
    stepName: 'How quickly could you repay the money?',
  }),
  5: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-5',
    pageTitle: pageTitles(z)[5],
    stepName: 'Have you ever been refused credit?',
  }),
  6: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-6',
    pageTitle: pageTitles(z)[6],
    stepName: 'How good is your credit score?',
  }),
};

export const creditOptionsAnalytics = (
  z: ReturnType<typeof useTranslation>['z'],
  currentStep: number,
) => {
  const analyticsToolData = {
    tool: 'Credit Options',
    toolCy: 'Opsiynau Credyd',
    toolStep: `${currentStep}`,
    stepData: stepData[currentStep as keyof typeof stepData](z),
    pageToolName: 'credit-options',
    categoryLevels: ['Everyday money', 'Credit'],
  };

  return formatAnalyticsObject(z, analyticsToolData, true);
};
