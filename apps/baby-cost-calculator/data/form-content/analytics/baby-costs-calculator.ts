import { formatAnalyticsObject } from '@maps-react/utils/formatAnalyticsObject';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { BabyCostTabIndex } from 'types';

export const stepData = {
  1: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'baby-due-date',
    pageTitle: z({
      en: 'Baby Due Date',
      cy: 'Dyddiad Disgwyl geni babi',
    }),
    stepName: 'Baby Due Date',
  }),
  2: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'essential-items',
    pageTitle: z({
      en: 'Essential Items',
      cy: 'Eitemau hanfodol',
    }),
    stepName: 'Essential Items',
  }),
  3: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'non-essential-items',
    pageTitle: z({
      en: 'Non-Essential Items',
      cy: 'Eitemau nad ydynt yn hanfodol',
    }),
    stepName: 'Non-Essential Items',
  }),
  4: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'your-budget',
    pageTitle: z({
      en: 'Your Budget',
      cy: 'Eich cyllideb',
    }),
    stepName: 'Your Budget',
  }),
  5: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'your-results',
    pageTitle: z({
      en: 'Your Results',
      cy: 'Eich canlyniadau',
    }),
    stepName: 'Your Results',
  }),
  save: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'save-and-come-back-later',
    pageTitle: z({
      en: 'Save and come back later',
      cy: 'Arbedwch a dewch yn ôl yn ddiweddarach',
    }),
    stepName: '',
  }),
  saved: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'save-and-come-back-later--content-saved',
    pageTitle: z({
      en: 'Save and come back later',
      cy: 'Arbedwch a dewch yn ôl yn ddiweddarach',
    }),
    stepName: '',
  }),
  landing: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: '',
    pageTitle: z({
      en: 'Work out your baby budget',
      cy: 'Cyfrifiannell costau babi',
    }),
    stepName: 'Cyfrifiannell costau babi',
  }),
};

export const bccAnalyticsData = (
  z: ReturnType<typeof useTranslation>['z'],
  currentStep: BabyCostTabIndex | 'save' | 'saved' | 'landing',
) => {
  const anylticsToolData = {
    tool: 'Baby Costs Calculator',
    toolCy: 'Cyfrifiannell costau babi',
    toolStep: `${currentStep}`,
    stepData: stepData[currentStep](z),
    pageToolName: 'baby-costs-calculator',
    categoryLevels: ['Family & care', 'Becoming a parent'],
  };

  return formatAnalyticsObject(z, anylticsToolData);
};
