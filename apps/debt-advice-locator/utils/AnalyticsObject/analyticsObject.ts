import { useTranslation } from '@maps-react/hooks/useTranslation';

type AnlyticsStepData = {
  pageName: string;
  pageTitle: string;
  stepName: string;
};

type AnalyticsToolData = {
  tool: string;
  toolCy: string;
  toolStep: string;
  stepData: AnlyticsStepData;
  pageToolName: string;
  categoryLevels: string[];
};

export const analyticsObject = (
  z: ReturnType<typeof useTranslation>['z'],
  analyticsData: AnalyticsToolData,
) => {
  const { tool, toolStep, pageToolName, stepData, categoryLevels } =
    analyticsData;
  const { pageName, pageTitle, stepName } = stepData;
  const pageNameWithHyphen = `--${pageName}`;

  return {
    page: {
      pageName: `${pageToolName}${pageName ? pageNameWithHyphen : ''}`,
      pageTitle: z({
        en: `Find free debt advice - ${pageTitle} - MoneyHelper Tools`,
        cy: `Dod o hyd i gyngor ar ddyledion am ddim - ${pageTitle} - Teclynnau HelpwrArian`,
      }),
      categoryLevels: categoryLevels,
    },
    tool: {
      toolName: tool,
      toolStep: toolStep,
      stepName: stepName,
    },
  };
};
