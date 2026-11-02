import type { AnalyticsData } from '@maps-react/hooks/useAnalytics';

/**
 * Firm-listings Adobe `eventInfo` shapes not declared on shared `AnalyticsData`.
 * Cast happens only here at the `addEvent` boundary so call sites stay strongly typed.
 */
export type FirmListingsAdobeEventInfo = {
  interactionType?: string;
  filter?: {
    category: string;
    value: string;
    selectedFilters: Array<{ category: string; values: string[] }>;
  };
  file?: { name: string; type: string };
  product?: string;
  link?: { url: string; text: string; type: string };
  provider?: string;
};

export function pushFirmListingsAdobeEvent(
  addEvent: (data: AnalyticsData) => void,
  base: AnalyticsData,
  event: string,
  eventInfo: FirmListingsAdobeEventInfo,
): void {
  addEvent({
    ...base,
    event,
    eventInfo: eventInfo as AnalyticsData['eventInfo'],
  });
}
