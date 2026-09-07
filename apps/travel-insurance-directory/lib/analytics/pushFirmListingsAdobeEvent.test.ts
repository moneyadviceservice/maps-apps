import type { AnalyticsData } from '@maps-react/hooks/useAnalytics';

import { pushFirmListingsAdobeEvent } from './pushFirmListingsAdobeEvent';

describe('pushFirmListingsAdobeEvent', () => {
  it('calls addEvent with base, event name, and eventInfo', () => {
    const addEvent = jest.fn();
    const base: AnalyticsData = {
      page: { pageName: 'travel-insurance-directory--firm-listings' },
      tool: { toolName: 'Travel Insurance Directory', toolStep: '3' },
    };

    pushFirmListingsAdobeEvent(addEvent, base, 'filterInteraction', {
      interactionType: 'filterSelect',
      filter: {
        category: 'Destination',
        value: 'uk_and_europe',
        selectedFilters: [
          { category: 'Destination', values: ['uk_and_europe'] },
        ],
      },
    });

    expect(addEvent).toHaveBeenCalledTimes(1);
    const payload = addEvent.mock.calls[0][0] as AnalyticsData;
    expect(payload.event).toBe('filterInteraction');
    expect(payload.page?.pageName).toBe(
      'travel-insurance-directory--firm-listings',
    );
    expect(payload.eventInfo).toMatchObject({
      interactionType: 'filterSelect',
      filter: {
        category: 'Destination',
        value: 'uk_and_europe',
      },
    });
  });
});
