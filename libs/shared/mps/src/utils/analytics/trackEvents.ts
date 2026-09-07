/**
 * Add searchButton event to window.adobeDatalayer
 * @param term - search term
 * @returns
 */
export const trackSearchEvent = (term: string) =>
  addEvent({
    event: 'searchButton',
    eventInfo: {
      elementId: 'keywordSearch',
      elementText: term,
      clickOption: 'search',
      clickAction: 'searchButton',
    },
  });

/**
 * Add searchFilterClick event to window.adobeDatalayer
 * @param type  - accordionType
 * @param filter - accordionOption
 * @returns
 */
export const trackFilterEvent = (type: string, filter: string) =>
  addEvent({
    event: 'searchFilterClick',
    eventInfo: {
      elementId: 'keywordSearchFilter',
      accordionType: type,
      accordionOption: filter,
      clickAction: 'applyFilter',
    },
  });

const getAdobeDataLayer = (): Array<Record<string, unknown>> | undefined => {
  if (typeof window === 'undefined') return undefined;
  return (
    window as Window & { adobeDataLayer?: Array<Record<string, unknown>> }
  ).adobeDataLayer;
};

export const addEvent = (event: Record<string, unknown>) => {
  const dataLayer = getAdobeDataLayer();
  if (dataLayer) {
    dataLayer.push(event);
  }
};
