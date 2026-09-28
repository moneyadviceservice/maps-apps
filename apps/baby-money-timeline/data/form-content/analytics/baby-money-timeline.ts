import { useTranslation } from '@maps-react/hooks/useTranslation';
import { formatAnalyticsObject } from '@maps-react/utils/formatAnalyticsObject';
type BabyMoneyTabIndex = keyof typeof stepData;

export const stepData = {
  1: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: '1-to-12-weeks',
    pageTitle: z({
      en: '1 to 12 weeks',
      cy: '1 i 12 wythnos',
    }),
    stepName: '1 to 12 weeks',
  }),
  2: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: '13-to-27-weeks',
    pageTitle: z({
      en: '13 to 27 weeks',
      cy: '13 i 27 wythnos',
    }),
    stepName: '13 to 27 weeks',
  }),
  3: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: '28-to-41-weeks',
    pageTitle: z({
      en: '28 to 41 weeks',
      cy: '28 i 41 wythnos',
    }),
    stepName: '28 to 41 weeks',
  }),
  4: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: '0-to-6-months',
    pageTitle: z({
      en: '0 to 6 months',
      cy: '0 i 6 mis',
    }),
    stepName: '0 to 6 months',
  }),
  5: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: '7-to-12-months',
    pageTitle: z({
      en: '7 to 12 months',
      cy: '7 i 12 mis',
    }),
    stepName: '7 to 12 months',
  }),
  6: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: '1-to-2-years',
    pageTitle: z({
      en: '1 to 2 years',
      cy: '1 i 2 flynedd',
    }),
    stepName: '1 to 2 years',
  }),
  landing: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: '',
    pageTitle: z({
      en: 'Due date',
      cy: 'genedigaeth disgwyliedig',
    }),
    stepName: 'Due Date',
  }),
};

export const babyMoneyTimelineAnalytics = (
  z: ReturnType<typeof useTranslation>['z'],
  currentStep: BabyMoneyTabIndex,
) => {
  const anylticsToolData = {
    tool: 'Baby Money Timeline',
    toolCy: 'Llinell amser arian babi',
    toolStep: `${currentStep === 'landing' ? '1' : '2'}`,
    stepData: stepData[currentStep](z),
    pageToolName: 'baby-money-timeline',
    categoryLevels: ['Family & care', 'Becoming a parent'],
  };

  return formatAnalyticsObject(z, anylticsToolData);
};
