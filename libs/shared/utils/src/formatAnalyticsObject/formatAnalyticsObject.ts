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
  userId?: string;
};

export const formatAnalyticsObject = (
  z: ReturnType<typeof useTranslation>['z'],
  analyticsData: AnalyticsToolData,
) => {
  const {
    tool,
    toolStep,
    toolCy,
    pageToolName,
    stepData,
    categoryLevels,
    userId,
  } = analyticsData;
  const { pageName, pageTitle, stepName } = stepData;
  const pageNameWithHyphen = `--${pageName}`;

  return {
    page: {
      pageName: `${pageToolName}${pageName ? pageNameWithHyphen : ''}`,
      pageTitle: z({
        en: `${tool}: ${pageTitle} - MoneyHelper Tools`,
        cy: `${toolCy}: ${pageTitle} - Teclynnau HelpwrArian`,
      }),
      categoryLevels: categoryLevels,
    },
    tool: {
      toolName: tool,
      toolStep: toolStep,
      stepName: stepName,
    },
    user: {
      loggedIn: !!userId,
      userId: userId,
    },
  };
};
