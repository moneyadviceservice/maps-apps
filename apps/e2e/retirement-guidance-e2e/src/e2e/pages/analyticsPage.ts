import { Page } from '@playwright/test';

export type AnalyticsEvent = {
  event?: string;
  page?: Record<string, unknown>;
  tool?: Record<string, unknown>;
};

export type ToolInteractionFields = {
  interactionType: string;
  fieldName: string;
  fieldValue: string;
};

interface AnalyticsPage {
  getEvents(page: Page): Promise<AnalyticsEvent[]>;
  getEventsByName(page: Page, eventName: string): Promise<AnalyticsEvent[]>;
  getToolInteractionEvent(
    page: Page,
    fields: ToolInteractionFields,
  ): Promise<AnalyticsEvent | undefined>;
}

const readAdobeDataLayerEvents = async (
  page: Page,
): Promise<AnalyticsEvent[]> => {
  return page.evaluate(() => {
    type BrowserEvent = {
      event?: string;
      page?: Record<string, unknown>;
      tool?: Record<string, unknown>;
    };

    const dataLayer = (window as unknown as { adobeDataLayer?: unknown })
      .adobeDataLayer;

    if (Array.isArray(dataLayer)) {
      return dataLayer as BrowserEvent[];
    }

    if (
      !dataLayer ||
      typeof dataLayer !== 'object' ||
      !('getHistory' in dataLayer)
    ) {
      return [];
    }

    const getHistory = dataLayer.getHistory;
    if (typeof getHistory !== 'function') {
      return [];
    }

    const history = getHistory.call(dataLayer);
    return Array.isArray(history) ? (history as BrowserEvent[]) : [];
  });
};

const analyticsPage: AnalyticsPage = {
  getEvents: readAdobeDataLayerEvents,

  async getEventsByName(page, eventName) {
    const events = await readAdobeDataLayerEvents(page);
    return events.filter(({ event }) => event === eventName);
  },

  async getToolInteractionEvent(page, fields) {
    const events = await readAdobeDataLayerEvents(page);
    return events.find(
      ({ event, tool }) =>
        event === 'toolInteraction' &&
        tool?.interactionType === fields.interactionType &&
        tool?.fieldName === fields.fieldName &&
        tool?.fieldValue === fields.fieldValue,
    );
  },
};

export default analyticsPage;
