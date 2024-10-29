import { analyticsQuestionPageData } from './transformers';
import { AnalyticsPageData } from 'hooks/useAnalytics';

describe('analyticsQuestionPageData', () => {
  const defaultAnalyticsData: AnalyticsPageData = {
    pageName: 'Test Page',
    pageTitle: 'Page Title',
    toolName: 'Tool Name',
    stepNames: ['Step 1'],
  };

  it('should append currentStep to pageName and add pageTitle when pageTitles is provided', () => {
    const currentStep = 2;
    const pageTitles = {
      2: 'Step 2 Title',
    };

    const result = analyticsQuestionPageData(
      defaultAnalyticsData,
      currentStep,
      pageTitles,
    );

    expect(result).toEqual({
      ...defaultAnalyticsData,
      pageName: 'Test Page--question-2',
      pageTitle: 'Step 2 Title',
    });
  });

  it('should append currentStep to pageName and not add pageTitle when pageTitles does not contain currentStep', () => {
    const currentStep = 3;
    const pageTitles = {
      2: 'Step 2 Title',
    };

    const result = analyticsQuestionPageData(
      defaultAnalyticsData,
      currentStep,
      pageTitles,
    );

    expect(result).toEqual({
      ...defaultAnalyticsData,
      pageName: 'Test Page--question-3',
    });
  });

  it('should append currentStep to pageName and not add pageTitle when pageTitles is not provided', () => {
    const currentStep = 1;

    const result = analyticsQuestionPageData(defaultAnalyticsData, currentStep);

    expect(result).toEqual({
      ...defaultAnalyticsData,
      pageName: 'Test Page--question-1',
    });
  });
});
