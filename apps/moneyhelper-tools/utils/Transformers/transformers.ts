import { AnalyticsPageData } from 'hooks/useAnalytics';

export const analyticsQuestionPageData = (
  analyticsData: AnalyticsPageData,
  currentStep: number,
  pageTitles?: Record<string, string>,
) => {
  const { pageName } = analyticsData;

  const transformedData = {
    ...analyticsData,
    pageName: `${pageName}--question-${currentStep}`,
  };

  if (pageTitles?.[currentStep]) {
    transformedData.pageTitle = pageTitles[currentStep];
  }

  return transformedData;
};
