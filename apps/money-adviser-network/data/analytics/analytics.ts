import { FLOW } from 'utils/getQuestions';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { formatAnalyticsObject } from '@maps-react/utils/formatAnalyticsObject';

export const startStepData = {
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

type StepData = {
  pageName: string;
  pageTitle: string;
  stepName: string;
};

export const MANAnalytics = (
  z: ReturnType<typeof useTranslation>['z'],
  currentStep: number,
  stepData: StepData,
  currentFlow?: FLOW,
  userId?: string,
) => {
  const anylticsToolData = {
    tool: 'Money Adviser Network',
    toolCy: 'Rhwydwaith Cynghorwyr Arian',
    toolStep: `${currentStep}`,
    stepData: stepData,
    pageToolName: 'money-adviser-network',
    categoryLevels: [],
    userId,
  };

  const analyticObj = formatAnalyticsObject(z, anylticsToolData);

  let flowLabel;
  switch (currentFlow) {
    case FLOW.ONLINE:
      flowLabel = 'Online';
      break;
    case FLOW.TELEPHONE:
      flowLabel = 'Phone';
      break;
    case FLOW.FACE:
      flowLabel = 'In Person';
      break;
    default:
      flowLabel = '';
  }

  if (flowLabel !== '') {
    return {
      ...analyticObj,
      ...{
        tool: {
          ...analyticObj.tool,
          toolName: `${analyticObj.tool.toolName}: ${flowLabel}`,
        },
      },
    };
  }

  return analyticObj;
};
