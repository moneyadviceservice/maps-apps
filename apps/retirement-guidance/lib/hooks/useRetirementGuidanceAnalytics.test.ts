import { renderHook } from '@testing-library/react';

import { TOOL_NAME } from '../constants';
import { useRetirementGuidanceAnalytics } from './useRetirementGuidanceAnalytics';

// Mock dependencies
jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/en/landing',
  }),
}));

const mockAddEvent = jest.fn();

jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    addEvent: mockAddEvent,
    addPage: jest.fn(),
    addStepPage: jest.fn(),
    analyticsList: { current: [] },
  }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    locale: 'en',
    t: (key: string) => key,
    z: jest.fn(),
  }),
}));

describe('useRetirementGuidanceAnalytics', () => {
  const defaultProps = {
    pageName: 'get-retirement-guidance--landing',
    pageTitle: 'Get Retirement Guidance -- Landing Page',
    toolStep: '1',
    stepName: 'Landing Page',
  };

  // Helper function to expect pageLoadReact event
  const expectPageLoadEvent = (
    pageName: string,
    pageTitle: string,
    toolStep: string,
    stepName: string,
    locale = 'en',
  ) => {
    expect(mockAddEvent).toHaveBeenCalledWith({
      event: 'pageLoadReact',
      page: {
        pageName,
        pageTitle,
        lang: locale,
        categoryLevels: ['Pensions & retirement', 'pensions explained'],
        site: 'moneyhelper',
        pageType: 'tool page',
      },
      tool: {
        toolName: TOOL_NAME,
        toolCategory: 'Complex Tool',
        toolStep,
        stepName,
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('pageLoadReact event', () => {
    it('should fire pageLoadReact event with correct data', () => {
      renderHook(() => useRetirementGuidanceAnalytics(defaultProps));

      expectPageLoadEvent(
        defaultProps.pageName,
        defaultProps.pageTitle,
        defaultProps.toolStep,
        defaultProps.stepName,
      );
    });

    it('should fire pageLoadReact event for question pages', () => {
      const questionProps = {
        pageName: 'get-retirement-guidance--question-1',
        pageTitle: 'Get Retirement Guidance -- Question 1',
        toolStep: '2',
        stepName: 'Question 1',
      };

      renderHook(() => useRetirementGuidanceAnalytics(questionProps));

      expectPageLoadEvent(
        questionProps.pageName,
        questionProps.pageTitle,
        questionProps.toolStep,
        questionProps.stepName,
      );
    });

    it('should fire pageLoadReact event for results page', () => {
      const resultsProps = {
        pageName: 'get-retirement-guidance--results',
        pageTitle: 'Get Retirement Guidance -- Results',
        toolStep: '14',
        stepName: 'Results',
      };

      renderHook(() => useRetirementGuidanceAnalytics(resultsProps));

      expectPageLoadEvent(
        resultsProps.pageName,
        resultsProps.pageTitle,
        resultsProps.toolStep,
        resultsProps.stepName,
      );
    });
  });

  describe('toolStart event', () => {
    it('should fire toolStart event when fireToolStart is true', () => {
      renderHook(() =>
        useRetirementGuidanceAnalytics({
          ...defaultProps,
          fireToolStart: true,
        }),
      );

      expect(mockAddEvent).toHaveBeenCalledWith({
        event: 'toolStart',
        tool: {
          toolName: TOOL_NAME,
          toolCategory: 'Complex Tool',
          toolStep: defaultProps.toolStep,
          stepName: defaultProps.stepName,
        },
      });
    });

    it('should not fire toolStart event when fireToolStart is false', () => {
      renderHook(() =>
        useRetirementGuidanceAnalytics({
          ...defaultProps,
          fireToolStart: false,
        }),
      );

      expect(mockAddEvent).toHaveBeenCalledTimes(1);
      expect(mockAddEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'pageLoadReact',
        }),
      );
    });

    it('should not fire toolStart event when fireToolStart is undefined', () => {
      renderHook(() => useRetirementGuidanceAnalytics(defaultProps));

      expect(mockAddEvent).toHaveBeenCalledTimes(1);
      expect(mockAddEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'pageLoadReact',
        }),
      );
    });
  });

  describe('toolComplete event', () => {
    it('should fire toolComplete event when fireToolComplete is true', () => {
      renderHook(() =>
        useRetirementGuidanceAnalytics({
          ...defaultProps,
          fireToolComplete: true,
        }),
      );

      expect(mockAddEvent).toHaveBeenCalledWith({
        event: 'toolCompletion',
        tool: {
          toolName: TOOL_NAME,
          toolCategory: 'Complex Tool',
          toolStep: defaultProps.toolStep,
          stepName: defaultProps.stepName,
          completionStatus: 'completed',
        },
      });
    });

    it('should not fire toolComplete event when fireToolComplete is false', () => {
      renderHook(() =>
        useRetirementGuidanceAnalytics({
          ...defaultProps,
          fireToolComplete: false,
        }),
      );

      expect(mockAddEvent).toHaveBeenCalledTimes(1);
      expect(mockAddEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'pageLoadReact',
        }),
      );
    });

    it('should not fire toolComplete event when fireToolComplete is undefined', () => {
      renderHook(() => useRetirementGuidanceAnalytics(defaultProps));

      expect(mockAddEvent).toHaveBeenCalledTimes(1);
      expect(mockAddEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'pageLoadReact',
        }),
      );
    });
  });

  describe('multiple events', () => {
    it('should fire both toolStart and toolComplete when both are true', () => {
      renderHook(() =>
        useRetirementGuidanceAnalytics({
          ...defaultProps,
          fireToolStart: true,
          fireToolComplete: true,
        }),
      );

      expect(mockAddEvent).toHaveBeenCalledTimes(3);
      expect(mockAddEvent).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          event: 'pageLoadReact',
        }),
      );
      expect(mockAddEvent).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          event: 'toolStart',
        }),
      );
      expect(mockAddEvent).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          event: 'toolCompletion',
        }),
      );
    });
  });

  describe('validation error events', () => {
    const errorProps = {
      pageName: 'get-retirement-guidance--question-7',
      pageTitle: 'Get Retirement Guidance -- Question 7',
      toolStep: '8',
      stepName: 'Question 7',
      hasError: true,
      errorMessage: 'Please select an answer.',
    };

    it('should fire pageLoadReact with -error pageName and stepName suffix when hasError is true', () => {
      renderHook(() => useRetirementGuidanceAnalytics(errorProps));

      expect(mockAddEvent).toHaveBeenNthCalledWith(1, {
        event: 'pageLoadReact',
        page: {
          pageName: 'get-retirement-guidance--question-7-error',
          pageTitle: 'Get Retirement Guidance -- Question 7 Error',
          lang: 'en',
          categoryLevels: ['Pensions & retirement', 'pensions explained'],
          site: 'moneyhelper',
          pageType: 'tool page',
        },
        tool: {
          toolName: TOOL_NAME,
          toolCategory: 'Complex Tool',
          toolStep: '8',
          stepName: 'Question 7 Validation Error',
        },
      });
    });

    it('should fire toolError event with errorType and errorMessage when hasError is true', () => {
      renderHook(() => useRetirementGuidanceAnalytics(errorProps));

      expect(mockAddEvent).toHaveBeenNthCalledWith(2, {
        event: 'toolError',
        tool: {
          toolName: TOOL_NAME,
          toolCategory: 'Complex Tool',
          toolStep: '8',
          stepName: 'Question 7',
          errorType: 'Validation Error',
          errorMessage: 'Please select an answer.',
        },
      });
    });

    it('should fire both pageLoadReact and toolError when hasError is true', () => {
      renderHook(() => useRetirementGuidanceAnalytics(errorProps));

      expect(mockAddEvent).toHaveBeenCalledTimes(2);
    });

    it('should fire normal pageLoadReact (no -error suffix) when hasError is false', () => {
      renderHook(() =>
        useRetirementGuidanceAnalytics({ ...errorProps, hasError: false }),
      );

      expect(mockAddEvent).toHaveBeenCalledTimes(1);
      expect(mockAddEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'pageLoadReact',
          page: expect.objectContaining({
            pageName: 'get-retirement-guidance--question-7',
            pageTitle: 'Get Retirement Guidance -- Question 7',
          }),
          tool: expect.objectContaining({
            stepName: 'Question 7',
          }),
        }),
      );
    });

    it('should not fire toolError when hasError is false', () => {
      renderHook(() =>
        useRetirementGuidanceAnalytics({ ...errorProps, hasError: false }),
      );

      expect(mockAddEvent).not.toHaveBeenCalledWith(
        expect.objectContaining({ event: 'toolError' }),
      );
    });

    it('should not fire toolError when hasError is true but errorMessage is undefined', () => {
      renderHook(() =>
        useRetirementGuidanceAnalytics({
          ...errorProps,
          errorMessage: undefined,
        }),
      );

      expect(mockAddEvent).not.toHaveBeenCalledWith(
        expect.objectContaining({ event: 'toolError' }),
      );
    });
  });
});
