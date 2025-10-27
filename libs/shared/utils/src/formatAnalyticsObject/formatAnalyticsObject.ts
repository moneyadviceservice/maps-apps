import { useTranslation } from '@maps-react/hooks/useTranslation';

type AnlyticsStepData = {
  pageName: string;
  pageTitle: string;
  stepName: string;
};

type AnalyticsDemoData = {
  emolument?: number;
  emolumentMerged?: number;
  bYear?: number;
  isRent?: boolean;
  isChildCarer?: boolean;
  isSoleChildCarer?: boolean;
  isHealth?: boolean;
  isMHealth?: boolean;
};

export type AnalyticsToolData = {
  tool: string;
  toolCy: string;
  toolStep: string;
  stepData: AnlyticsStepData;
  pageToolName: string;
  categoryLevels: string[];
  userId?: string;
  demo?: AnalyticsDemoData;
  url?: string;
};

export const formatAnalyticsObject = (
  z: ReturnType<typeof useTranslation>['z'],
  analyticsData: AnalyticsToolData,
  useSimplePageTitle = false,
) => {
  const {
    tool,
    toolStep,
    toolCy,
    pageToolName,
    stepData,
    categoryLevels,
    userId,
    demo,
    url,
  } = analyticsData;
  const { pageName, pageTitle, stepName } = stepData;
  const pageNameWithHyphen = `--${pageName}`;

  if (demo) {
    // Round to the nearest 1000s
    if (undefined !== demo.emolument)
      demo.emolument = Math.round(demo.emolument / 1000);
    if (undefined !== demo.emolumentMerged)
      demo.emolumentMerged = Math.round(demo.emolumentMerged / 1000);
  }

  const formattedPageTitle = useSimplePageTitle
    ? pageTitle
    : z({
        en: `${tool}: ${pageTitle} - MoneyHelper Tools`,
        cy: `${toolCy}: ${pageTitle} - Teclynnau HelpwrArian`,
      });

  return {
    page: {
      pageName: `${pageToolName}${pageName ? pageNameWithHyphen : ''}`,
      pageTitle: formattedPageTitle,
      categoryLevels: categoryLevels,
      url,
    },
    tool: {
      toolName: tool,
      toolStep: toolStep,
      stepName: stepName,
    },
    ...(demo && { demo }),
    user: {
      loggedIn: !!userId,
      userId: userId,
    },
  };
};
