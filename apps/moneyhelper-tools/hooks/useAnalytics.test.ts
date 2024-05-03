import { renderHook } from '@testing-library/react';
import { useAnalytics, AnalyticsData, AnalyticsPageData } from './useAnalytics';

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/mock-path',
    query: { language: 'en' },
  }),
}));

const mockAdobeDataLayer: AnalyticsData[] = [];
(global.window.adobeDataLayer as unknown as AnalyticsData[]) =
  mockAdobeDataLayer;

describe('useAnalytics', () => {
  it('should add page to analyticsList when addPage is called', () => {
    const { result } = renderHook(() => useAnalytics());

    const testData = [
      {
        event: 'pageview',
        page: {
          pageName: 'Test Page',
          pageTitle: 'Test Page Title',
        },
        tool: {
          toolName: 'Test Tool',
          toolCategory: 'Test Category',
        },
      },
    ];

    result.current.addPage(testData);

    expect(result.current.analyticsList.current).toEqual([
      {
        event: 'pageview',
        page: {
          pageName: 'Test Page',
          pageTitle: 'Test Page Title',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'tool page',
        },
        tool: {
          toolName: 'Test Tool',
          toolCategory: 'Test Category',
          toolStep: '',
          stepName: '',
        },
      },
    ]);

    expect(mockAdobeDataLayer).toEqual([]);
  });

  it('should add event to adobeDataLayer when addEvent is called', () => {
    const { result } = renderHook(() => useAnalytics());

    const testData = {
      event: 'button_click',
      page: {
        pageName: 'Test Page',
      },
      tool: {
        toolName: 'Test Tool',
      },
    };

    result.current.addEvent(testData);

    expect(mockAdobeDataLayer).toEqual([
      {
        page: {
          pageName: 'Test Page',
        },
        tool: {
          toolName: 'Test Tool',
        },
        event: 'button_click',
      },
    ]);
  });

  describe('addStepPage function', () => {
    const analyticsData: AnalyticsPageData = {
      pageName: 'Page Name',
      pageTitle: 'Page Title',
      toolName: 'Tool Name',
      stepNames: ['Step 1', 'Step 2', 'Step 3'],
    };

    it('should add step page with provided stepName', () => {
      const { result } = renderHook(() => useAnalytics());

      const currentStep = 2;
      const stepName = 'Custom Step Name';

      result.current.addStepPage(analyticsData, currentStep, stepName);

      expect(result.current.analyticsList.current).toEqual([
        {
          page: {
            pageName: 'Page Name',
            pageTitle: 'Page Title',
            lang: 'en',
            site: 'moneyhelper',
            pageType: 'tool page',
          },
          tool: {
            toolName: 'Tool Name',
            toolCategory: '',
            toolStep: '2',
            stepName: 'Custom Step Name',
          },
          event: 'pageLoadReact',
        },
      ]);
    });

    it('should add step page with default stepName from analyticsData', () => {
      const { result } = renderHook(() => useAnalytics());

      const currentStep = 3;

      result.current.addStepPage(analyticsData, currentStep);

      expect(result.current.analyticsList.current).toEqual([
        {
          page: {
            pageName: 'Page Name',
            pageTitle: 'Page Title',
            lang: 'en',
            site: 'moneyhelper',
            pageType: 'tool page',
          },
          tool: {
            toolName: 'Tool Name',
            toolCategory: '',
            toolStep: '3',
            stepName: 'Step 3',
          },
          event: 'pageLoadReact',
        },
      ]);
    });

    it('should add step page with empty string when not found', () => {
      const { result } = renderHook(() => useAnalytics());

      const currentStep = 4;

      result.current.addStepPage(analyticsData, currentStep);

      expect(result.current.analyticsList.current).toEqual([
        {
          page: {
            pageName: 'Page Name',
            pageTitle: 'Page Title',
            lang: 'en',
            site: 'moneyhelper',
            pageType: 'tool page',
          },
          tool: {
            toolName: 'Tool Name',
            toolCategory: '',
            toolStep: '4',
            stepName: '',
          },
          event: 'pageLoadReact',
        },
      ]);
    });
  });
});
