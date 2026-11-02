import { formatAnalyticsObject } from '@maps-react/utils/formatAnalyticsObject';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { pageTitles } from '../pages/[language]/';

export const stepData = {
  1: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-1',
    pageTitle: pageTitles(z)[1],
    stepName: 'Have you been declined for credit in the past six months?',
  }),
  2: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-2',
    pageTitle: pageTitles(z)[2],
    stepName:
      'Have you checked your credit report for errors in the last month?',
  }),
  3: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-3',
    pageTitle: pageTitles(z)[3],
    stepName: 'Do you have any of these accounts in your name?',
  }),
  4: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-4',
    pageTitle: pageTitles(z)[4],
    stepName: 'Do any of the accounts in your name use old details?',
  }),
  5: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-5',
    pageTitle: pageTitles(z)[5],
    stepName: 'Are you paying back any borrowing?',
  }),
  6: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-6',
    pageTitle: pageTitles(z)[6],
    stepName: 'Do you always pay your bills on time?',
  }),
  7: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-7',
    pageTitle: pageTitles(z)[7],
    stepName: 'Have you registered to vote at your current address?',
  }),
  8: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-8',
    pageTitle: pageTitles(z)[8],
    stepName: 'Do you have joint finances with someone?',
  }),
};

export const creditRejectionAnalytics = (
  z: ReturnType<typeof useTranslation>['z'],
  currentStep: number,
) => {
  const analyticsToolData = {
    tool: 'Credit Rejection',
    toolCy: 'Gwrthodiad Credyd',
    toolStep: `${currentStep}`,
    stepData: stepData[currentStep as keyof typeof stepData](z),
    pageToolName: 'credit-rejection',
    categoryLevels: ['Everyday money', 'Credit'],
  };

  return formatAnalyticsObject(z, analyticsToolData, true);
};
