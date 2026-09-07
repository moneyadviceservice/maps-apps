import { formatAnalyticsObject } from '@maps-react/utils/formatAnalyticsObject';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { pageTitles } from '../../../pages/[language]/';

export const stepData = {
  1: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-1',
    pageTitle: pageTitles(z)[1],
    stepName: 'How old are you?',
  }),
  2: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-2',
    pageTitle: pageTitles(z)[2],
    stepName: 'Where do you live?',
  }),
  3: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-3',
    pageTitle: pageTitles(z)[3],
    stepName: 'How well are you keeping up with bills and credit repayments?',
  }),
  4: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-4',
    pageTitle: pageTitles(z)[4],
    stepName: "What's your approach to budgeting?",
  }),
  5: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-5',
    pageTitle: pageTitles(z)[5],
    stepName: 'Have you considered these ways to increase your income?',
  }),
  6: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-6',
    pageTitle: pageTitles(z)[6],
    stepName:
      'Have you thought about ways to reduce the cost of these household bills?',
  }),
  7: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-7',
    pageTitle: pageTitles(z)[7],
    stepName:
      'What will happen to your money and property if you get seriously ill or die?',
  }),
  8: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-8',
    pageTitle: pageTitles(z)[8],
    stepName:
      'Do you have money set aside in case you lose your job or source of income?',
  }),
  9: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-9',
    pageTitle: pageTitles(z)[9],
    stepName: 'Do you have insurance to protect your income if...',
  }),
  10: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-10',
    pageTitle: pageTitles(z)[10],
    stepName:
      "Which of these items could you get insurance for, but haven't already?",
  }),
  11: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-11',
    pageTitle: pageTitles(z)[11],
    stepName: 'Do you have or will you be entitled to any of these pensions?',
  }),
  12: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-12',
    pageTitle: pageTitles(z)[12],
    stepName: 'What type of workplace pension do you pay into?',
  }),
  13: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-13',
    pageTitle: pageTitles(z)[13],
    stepName: 'How well are you managing your pension?',
  }),
  14: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-14',
    pageTitle: pageTitles(z)[14],
    stepName: 'How are you planning for retirement?',
  }),
  15: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-15',
    pageTitle: pageTitles(z)[15],
    stepName: 'Where do you plan to live when you retire?',
  }),
  16: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-16',
    pageTitle: pageTitles(z)[16],
    stepName: 'Do you have savings goals?',
  }),
  17: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-17',
    pageTitle: pageTitles(z)[17],
    stepName: 'Do you have any non-emergency savings or investments?',
  }),
  18: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-18',
    pageTitle: pageTitles(z)[18],
    stepName:
      'Which of the following statements about keeping your money safe apply to you?',
  }),
};

export const midLifeMotAnalytics = (
  z: ReturnType<typeof useTranslation>['z'],
  currentStep: number,
) => {
  const analyticsToolData = {
    tool: 'Midlife MOT',
    toolCy: 'MOT Canol Oes Arian',
    toolStep: `${currentStep}`,
    stepData: stepData[currentStep as keyof typeof stepData](z),
    pageToolName: 'midlife-mot',
    categoryLevels: [],
  };

  return formatAnalyticsObject(z, analyticsToolData, true);
};
