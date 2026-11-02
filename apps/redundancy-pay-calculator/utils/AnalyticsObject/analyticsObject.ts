import { useTranslation } from '@maps-react/hooks/useTranslation';

type AnalyticsStepData = {
  pageName: string;
  pageTitle: string;
  stepName: string;
};

type AnalyticsDemo = {
  emolument?: number;
  bYear?: number;
};

type AnalyticsToolData = {
  tool: string;
  toolCy: string;
  toolStep: string;
  stepData: AnalyticsStepData;
  pageToolName: string;
  categoryLevels: string[];
  demo?: AnalyticsDemo;
};

/**
 * Generates an analytics object containing page, tool, and demo information.
 *
 * @param z - A translation function obtained from `useTranslation` hook, used to localize text.
 * @param analyticsData - An object containing data required to construct the analytics object.
 * @param analyticsData.tool - The name of the tool being used.
 * @param analyticsData.toolStep - The current step of the tool.
 * @param analyticsData.pageToolName - The name of the tool as it appears on the page.
 * @param analyticsData.stepData - An object containing step-specific data.
 * @param analyticsData.stepData.pageName - The name of the page.
 * @param analyticsData.stepData.pageTitle - The title of the page.
 * @param analyticsData.stepData.stepName - The name of the current step.
 * @param analyticsData.categoryLevels - The category levels associated with the tool.
 * @param analyticsData.demo - A flag or data indicating demo mode or related information.
 * @returns An object containing structured analytics data, including page, tool, and demo details.
 */
export const analyticsObject = (
  z: ReturnType<typeof useTranslation>['z'],
  analyticsData: AnalyticsToolData,
) => {
  const { tool, toolStep, pageToolName, stepData, categoryLevels, demo } =
    analyticsData;
  const { pageName, pageTitle, stepName } = stepData;
  const pageNameWithHyphen = `--${pageName}`;

  return {
    page: {
      pageName: `${pageToolName}${pageName ? pageNameWithHyphen : ''}`,
      pageTitle: z({
        en: `Redundancy pay calculator - ${pageTitle}`,
        cy: `Cyfrifiannell tâl dileu swydd - ${pageTitle}`,
      }),
      categoryLevels: categoryLevels,
    },
    tool: {
      toolName: tool,
      toolStep: toolStep,
      stepName: stepName,
    },
    demo: demo,
  };
};
