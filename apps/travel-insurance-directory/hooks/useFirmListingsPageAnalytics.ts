import { useCallback, useMemo } from 'react';

import { buildPageAnalyticsData } from 'lib/analytics/pageAnalytics';
import {
  type FirmListingsAdobeEventInfo,
  pushFirmListingsAdobeEvent,
} from 'lib/analytics/pushFirmListingsAdobeEvent';

import { useAnalytics } from '@maps-react/hooks/useAnalytics';

export type TrackFirmListingsEventArgs = {
  event: string;
  eventInfo: FirmListingsAdobeEventInfo;
};

/**
 * Memoised firm-listings page/tool payload plus `trackFirmListingsEvent` for Adobe Data Layer
 * events that need travel-insurance-specific `eventInfo` (typed via {@link pushFirmListingsAdobeEvent}).
 */
export function useFirmListingsPageAnalytics() {
  const { addEvent } = useAnalytics();
  const firmListingsPageData = useMemo(
    () => buildPageAnalyticsData('firmListings'),
    [],
  );

  const trackFirmListingsEvent = useCallback(
    ({ event, eventInfo }: TrackFirmListingsEventArgs) => {
      pushFirmListingsAdobeEvent(
        addEvent,
        firmListingsPageData,
        event,
        eventInfo,
      );
    },
    [addEvent, firmListingsPageData],
  );

  return { trackFirmListingsEvent, addEvent, firmListingsPageData };
}
