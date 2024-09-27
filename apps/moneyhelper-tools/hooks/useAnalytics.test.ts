import { useAnalytics } from './useAnalytics';
import { act, renderHook } from '@testing-library/react';
import React from 'react';

const useRouter = jest.spyOn(require('next/router'), 'useRouter');

const mockPageData = {
  pageName: 'page-name-test',
  pageTitle: 'page-title-test',
  pageType: 'tool',
  site: 'moneyhelper',
};

const categoryLevels = { categoryLevels: ['Category 1', 'Category 2'] };

const mockToolData = {
  stepName: 'step-name-test',
  toolCategory: 'tool-category-test',
  toolName: 'tool-name-test',
  toolStep: 1,
};

describe('Test hook Analytics', () => {
  beforeEach(() => {
    window.adobeDataLayer = [];
  });

  it('should fire analytics event', () => {
    ['cy', 'en'].forEach((lang, index) => {
      useRouter.mockReturnValue({
        query: {
          language: lang,
        },
      });
      const { result } = renderHook(() => useAnalytics());
      act(() => {
        result.current.addEvent({
          page: { ...mockPageData, ...categoryLevels },
          tool: mockToolData,
          event: 'test',
        });
      });

      const pageData = window.adobeDataLayer[index].page as Record<
        string,
        Object
      >;
      const toolData = window.adobeDataLayer[index].tool as Record<
        string,
        Object
      >;

      expect(pageData.pageName).toEqual('page-name-test');
      expect(pageData.pageTitle).toEqual('page-title-test');
      expect(pageData.categoryL1).toEqual('Category 1');
      expect(pageData.categoryL2).toEqual('Category 2');
      expect(pageData.lang).toEqual(lang);
      expect(pageData.site).toEqual('moneyhelper');
      expect(pageData.pageType).toEqual('tool page');
      expect(toolData.toolName).toEqual('tool-name-test');
      expect(toolData.toolStep).toEqual(1);
      expect(toolData.stepName).toEqual('step-name-test');
      expect(toolData.toolCategory).toEqual('tool-category-test');
      expect(window.adobeDataLayer[index].event).toEqual('test');
    });
  });

  it('should fire analytics event without category levels', () => {
    ['cy', 'en'].forEach((lang, index) => {
      useRouter.mockReturnValue({
        query: {
          language: lang,
        },
      });
      const { result } = renderHook(() => useAnalytics());
      act(() => {
        result.current.addEvent({
          page: mockPageData,
          tool: mockToolData,
          event: 'test',
        });
      });

      const pageEventData = window.adobeDataLayer[index].page as Record<
        string,
        Object
      >;
      const toolEventData = window.adobeDataLayer[index].tool as Record<
        string,
        Object
      >;

      expect(pageEventData.pageName).toEqual('page-name-test');
      expect(pageEventData.pageTitle).toEqual('page-title-test');
      expect(pageEventData.categoryL1).not.toBeDefined();
      expect(pageEventData.categoryL2).not.toBeDefined();
      expect(pageEventData.lang).toEqual(lang);
      expect(pageEventData.site).toEqual('moneyhelper');
      expect(pageEventData.pageType).toEqual('tool page');
      expect(toolEventData.toolName).toEqual('tool-name-test');
      expect(toolEventData.toolStep).toEqual(1);
      expect(toolEventData.stepName).toEqual('step-name-test');
      expect(toolEventData.toolCategory).toEqual('tool-category-test');
      expect(window.adobeDataLayer[index].event).toEqual('test');
    });
  });

  it('should return empty array when no values are entered', () => {
    ['cy', 'en'].forEach((lang) => {
      useRouter.mockReturnValue({
        query: {
          language: lang,
        },
      });
      const { result } = renderHook(() => useAnalytics());
      act(() => {
        result.current.addPage([
          {
            page: {},
            tool: {},
            event: 'test',
          },
        ]);
      });

      const pageDataToolPage = result.current.analyticsList.current[0].page;
      const toolDataToolPage = result.current.analyticsList.current[0].tool;

      expect(pageDataToolPage.pageName).toEqual('');
      expect(pageDataToolPage.pageTitle).toEqual('');
      expect(pageDataToolPage.lang).toEqual(lang);
      expect(pageDataToolPage.site).toEqual('moneyhelper');
      expect(pageDataToolPage.pageType).toEqual('tool page');
      expect(toolDataToolPage.toolName).toEqual('');
      expect(toolDataToolPage.toolStep).toEqual('');
      expect(toolDataToolPage.stepName).toEqual('');
      expect(toolDataToolPage.toolCategory).toEqual('');
    });
  });

  it('should update analytics list when adding page', () => {
    ['cy', 'en'].forEach((lang, index) => {
      useRouter.mockReturnValue({
        query: {
          language: lang,
        },
        asPath: '/test-2',
      });

      const { result } = renderHook(() => useAnalytics());

      act(() => {
        result.current.addPage([
          {
            page: mockPageData,
            tool: mockToolData,
            event: 'test',
          },
        ]);
      });

      const dataResult = result.current.analyticsList.current;

      expect(dataResult[0].page.pageName).toEqual('page-name-test');
      expect(dataResult[0].page.pageTitle).toEqual('page-title-test');
      expect(dataResult[0].page.categoryLevels).toEqual([]);
      expect(dataResult[0].page.lang).toEqual(lang);
      expect(dataResult[0].page.site).toEqual('moneyhelper');
      expect(dataResult[0].page.pageType).toEqual('tool page');
      expect(dataResult[0].tool.toolName).toEqual('tool-name-test');
      expect(dataResult[0].tool.toolStep).toEqual(1);
      expect(dataResult[0].tool.stepName).toEqual('step-name-test');
      expect(dataResult[0].tool.toolCategory).toEqual('tool-category-test');
    });
  });

  it('should update analytics list when adding step page', () => {
    ['cy', 'en'].forEach((lang, index) => {
      useRouter.mockReturnValue({
        query: {
          language: lang,
        },
      });
      const { result } = renderHook(() => useAnalytics());
      act(() => {
        result.current.addStepPage(
          {
            pageName: 'page-name-test',
            pageTitle: 'page-title-test',
            toolName: 'tool-name-test',
            stepNames: [
              'step-name-test-1',
              'step-name-test-2',
              'step-name-test-3',
            ],
          },
          1,
          'tool-category-test',
        );
      });

      const dataCategory = result.current.analyticsList.current;

      expect(dataCategory[0].page.pageName).toEqual('page-name-test');
      expect(dataCategory[0].page.pageTitle).toEqual('page-title-test');
      expect(dataCategory[0].page.categoryLevels).toEqual([]);
      expect(dataCategory[0].page.lang).toEqual(lang);
      expect(dataCategory[0].page.site).toEqual('moneyhelper');
      expect(dataCategory[0].page.pageType).toEqual('tool page');
      expect(dataCategory[0].tool.toolName).toEqual('tool-name-test');
      expect(dataCategory[0].tool.toolStep).toEqual(1);
      expect(dataCategory[0].tool.stepName).toEqual('tool-category-test');
    });
  });

  it('should update analytics list when adding step page wihout define step', () => {
    ['cy', 'en'].forEach((lang) => {
      useRouter.mockReturnValue({
        query: {
          language: lang,
        },
      });
      const { result } = renderHook(() => useAnalytics());
      act(() => {
        result.current.addStepPage(
          {
            pageName: 'page-name-test',
            pageTitle: 'page-title-test',
            toolName: 'tool-name-test',
            stepNames: [
              'step-name-test-1',
              'step-name-test-2',
              'step-name-test-3',
            ],
          },
          1,
        );
      });

      const dataStepNames = result.current.analyticsList.current;

      expect(dataStepNames[0].page.pageName).toEqual('page-name-test');
      expect(dataStepNames[0].page.pageTitle).toEqual('page-title-test');
      expect(dataStepNames[0].page.categoryLevels).toEqual([]);
      expect(dataStepNames[0].page.lang).toEqual(lang);
      expect(dataStepNames[0].page.site).toEqual('moneyhelper');
      expect(dataStepNames[0].page.pageType).toEqual('tool page');
      expect(dataStepNames[0].tool.toolName).toEqual('tool-name-test');
      expect(dataStepNames[0].tool.toolStep).toEqual(1);
      expect(dataStepNames[0].tool.stepName).toEqual('step-name-test-1');
    });
  });

  it('should update analytics list when adding step page with ctaegories', () => {
    ['cy', 'en'].forEach((lang) => {
      useRouter.mockReturnValue({
        query: {
          language: lang,
        },
      });
      const { result } = renderHook(() => useAnalytics());
      act(() => {
        result.current.addStepPage(
          {
            pageName: 'page-name-test',
            pageTitle: 'page-title-test',
            categoryLevels: ['Category 1', 'Category 2'],
            toolName: 'tool-name-test',
            stepNames: ['step-name-test'],
          },
          1,
          'tool-category-test',
        );
      });

      const data = result.current.analyticsList.current;

      expect(data[0].page.pageName).toEqual('page-name-test');
      expect(data[0].page.pageTitle).toEqual('page-title-test');
      expect(data[0].page.categoryLevels).toEqual(['Category 1', 'Category 2']);
      expect(data[0].page.lang).toEqual(lang);
      expect(data[0].page.site).toEqual('moneyhelper');
      expect(data[0].page.pageType).toEqual('tool page');
      expect(data[0].tool.toolName).toEqual('tool-name-test');
      expect(data[0].tool.toolStep).toEqual(1);
      expect(data[0].tool.stepName).toEqual('tool-category-test');
    });
  });

  it('should update adobeDataLayer when router changes', () => {
    useRouter.mockReturnValue({
      query: {
        language: 'en',
      },
      asPath: 'test',
    });
    jest.spyOn(React, 'useRef').mockReturnValueOnce({
      current: [
        {
          page: mockPageData,
          tool: mockToolData,
          event: 'test',
        },
      ],
    });

    renderHook(() => useAnalytics());

    const pageData = window.adobeDataLayer[0].page as Record<string, Object>;

    expect(pageData.pageName).toEqual('page-name-test');
    expect(pageData.pageTitle).toEqual('page-title-test');
  });

  it('should update adobeDataLayer with empty string if no page title passed in', () => {
    useRouter.mockReturnValue({
      query: {
        language: 'en',
      },
    });
    jest.spyOn(React, 'useRef').mockReturnValueOnce({
      current: [
        {
          page: {
            ...mockPageData,
            pageName: '',
            pageTitle: '',
            categoryLevels: undefined,
          },
          tool: {
            toolName: '',
            toolCategory: '',
            toolStep: '',
            stepName: '',
          },
          event: 'test',
        },
      ],
    });

    renderHook(() => useAnalytics());

    const pageDataEmptyString = window.adobeDataLayer[0].page as Record<
      string,
      Object
    >;

    expect(pageDataEmptyString.pageName).toEqual('');
    expect(pageDataEmptyString.pageTitle).toEqual('');
    expect(pageDataEmptyString.pageTitle).toEqual('');
  });

  it('should update adobeDataLayer error event', () => {
    useRouter.mockReturnValue({
      query: {
        language: 'en',
      },
    });
    const eInfo = {
      toolName: 'toolName',
      toolStep: 'toolStep',
      stepName: 'stepName',
      errorDetails: [],
    };
    jest.spyOn(React, 'useRef').mockReturnValueOnce({
      current: [
        {
          eventInfo: eInfo,
          event: 'errorMessage',
        },
      ],
    });

    renderHook(() => useAnalytics());

    const event = window.adobeDataLayer[0] as Record<string, Object>;

    expect(event.event).toEqual('errorMessage');
    expect(event.eventInfo).toEqual(eInfo);
  });
});
