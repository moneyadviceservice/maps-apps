import { act, renderHook } from '@testing-library/react';

import { useFirmListingsPageAnalytics } from './useFirmListingsPageAnalytics';

const mockAddEvent = jest.fn();

jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: () => ({ addEvent: mockAddEvent }),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { language: 'en' },
    asPath: '/en/listings',
  }),
}));

describe('useFirmListingsPageAnalytics', () => {
  beforeEach(() => {
    mockAddEvent.mockClear();
  });

  it('returns firmListingsPageData with firm listings page and tool', () => {
    const { result } = renderHook(() => useFirmListingsPageAnalytics());

    expect(result.current.firmListingsPageData.page?.pageName).toBe(
      'travel-insurance-directory--firm-listings',
    );
    expect(result.current.firmListingsPageData.tool?.toolStep).toBe('3');
    expect(result.current.addEvent).toBe(mockAddEvent);
  });

  it('trackFirmListingsEvent merges base payload and calls addEvent', () => {
    const { result } = renderHook(() => useFirmListingsPageAnalytics());

    act(() => {
      result.current.trackFirmListingsEvent({
        event: 'filterInteraction',
        eventInfo: {
          interactionType: 'filterSelect',
          filter: {
            category: 'Age at time of travel',
            value: '0-16',
            selectedFilters: [
              { category: 'Age at time of travel', values: ['0-16'] },
            ],
          },
        },
      });
    });

    expect(mockAddEvent).toHaveBeenCalledTimes(1);
    const payload = mockAddEvent.mock.calls[0][0];
    expect(payload.event).toBe('filterInteraction');
    expect(payload.page?.pageName).toBe(
      'travel-insurance-directory--firm-listings',
    );
    expect(payload.tool?.toolName).toBe('Travel Insurance Directory');
    expect(payload.eventInfo).toMatchObject({
      interactionType: 'filterSelect',
      filter: expect.objectContaining({
        category: 'Age at time of travel',
        value: '0-16',
      }),
    });
  });
});
