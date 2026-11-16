import { mockTranslationDataEn } from 'lib/mocks/mockUseTranslations';
import { renderHook } from '@testing-library/react';

import { useRbpAnalytics } from './useRbpAnalytics';
import { PAGES_NAMES } from 'lib/constants/pageConstants';

const mockAddEvent = jest.fn();

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {
      language: 'en',
    },
  }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => {
  return {
    __esModule: true,
    default: (localeOverride?: string) => ({
      t: (key: string, _data?: Record<string, string>, fallback = key) =>
        mockTranslationDataEn[key] ?? fallback,
      locale: localeOverride ?? 'en',
    }),
  };
});

jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    addEvent: mockAddEvent,
  }),
}));

describe('test useRbpAnalytics functionality', () => {
  it('should return correct analyticsData structure', () => {
    const { result } = renderHook(() => useRbpAnalytics(PAGES_NAMES.ABOUTYOU));

    expect(result.current.analyticsData).toEqual(
      expect.objectContaining({
        page: expect.objectContaining({
          pageName: 'retirement-budget-planner--about-you',
          pageTitle: 'Retirement budget planner -- About you',
          categoryLevels: ['Pensions & retirement', 'pensions explained'],
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'tool page',
        }),
        tool: expect.objectContaining({
          toolName: 'Retirement Budget Planner',
          toolCategory: 'Complex Tool',
          toolStep: 1,
          stepName: 'Retirement budget planner -- About you',
        }),
      }),
    );
  });

  it('should return correct lastStep value', () => {
    const { result } = renderHook(() => useRbpAnalytics(PAGES_NAMES.ABOUTYOU));

    expect(result.current.lastStep).toEqual(4);
  });

  it('should return addEvent from useAnalytics', () => {
    const { result } = renderHook(() => useRbpAnalytics(PAGES_NAMES.ABOUTYOU));

    result.current.addEvent({ event: 'test-event' });

    expect(result.current.addEvent).toBe(mockAddEvent);
    expect(mockAddEvent).toHaveBeenCalledWith({ event: 'test-event' });
  });

  it('should use correct fallbacks for non-existent tabName', () => {
    // @ts-expect-error - testing invalid input
    const { result } = renderHook(() => useRbpAnalytics('mock-page'));

    expect(result.current.analyticsData).toEqual(
      expect.objectContaining({
        page: expect.objectContaining({
          pageName: 'retirement-budget-planner--mock-page',
          pageTitle: 'Retirement budget planner -- mock-page',
          categoryLevels: ['Pensions & retirement', 'pensions explained'],
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'tool page',
        }),
        tool: expect.objectContaining({
          toolName: 'Retirement Budget Planner',
          toolCategory: 'Complex Tool',
          toolStep: '',
          stepName: 'Retirement budget planner -- mock-page',
        }),
      }),
    );
  });
});
