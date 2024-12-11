import { PensionTypeSteps } from 'pages/[language]/pension-type';
import { analyticsObject } from 'utils/AnalyticsObject';

import { useTranslation } from '@maps-react/hooks/useTranslation';

export const stepData = {
  1: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-1',
    pageTitle: z({
      en: 'Was your pension set up by your employer?',
      cy: 'Ydy eich pensiwn wedi cael ei sefydlu gan eich cyflogwr?',
    }),
    stepName: 'Was your pension set up by your employer?',
  }),
  2: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-2',
    pageTitle: z({
      en: 'Did your pension come from working for one of the following:',
      cy: "Ydy eich pensiwn o ganlyniad i weithio i un o'r canlynol:",
    }),
    stepName: 'Did your pension come from working for one of the following:',
  }),
  3: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-3',
    pageTitle: z({
      en: 'Is your pension provider one of the following:',
      cy: "A yw eich darparwr pensiwn yn un o'r canlynol:",
    }),
    stepName: 'Is your pension provider one of the following:',
  }),
  4: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'question-4',
    pageTitle: z({
      en: 'When did you start this pension?',
      cy: "Pryd wnaethoch chi ddechrau'r pensiwn hwn?",
    }),
    stepName: 'When did you start this pension?',
  }),
  5: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'change-options',
    pageTitle: z({
      en: 'Check your answers',
      cy: 'Edrychwch dros eich atebion',
    }),
    stepName: 'Check your answers',
  }),
  6: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'results',
    pageTitle: z({
      en: 'Personalised action plan',
      cy: 'Cynllun gweithredu personol',
    }),
    stepName: 'Personalised action plan',
  }),
  error: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: '',
    pageTitle: z({
      en: 'Error, please review your answer',
      cy: 'Gwall, adolygwch eich ateb os gwelwch yn dda',
    }),
    stepName: 'error-message',
  }),
  landing: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: '',
    pageTitle: z({
      en: 'Find out your pension type',
      cy: 'Darganfod eich math o bensiwn',
    }),
    stepName: 'Find out your pension type',
  }),
};

export const pensionTypeAnalytics = (
  z: ReturnType<typeof useTranslation>['z'],
  currentStep: PensionTypeSteps,
) => {
  const anylticsToolData = {
    tool: 'Pension Type',
    toolCy: 'Math o Bensiwn',
    toolStep: `${currentStep}`,
    stepData: stepData[currentStep](z),
    pageToolName: 'pension-type',
    categoryLevels: ['Pensions & retirement', 'Pension Wise'],
  };

  return analyticsObject(z, anylticsToolData);
};
