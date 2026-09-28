import { addEvent, trackFilterEvent, trackSearchEvent } from './trackEvents';

describe('Analytics trackEvents', () => {
  let mockDataLayer: Array<Record<string, unknown>>;

  beforeEach(() => {
    // Setup mock adobeDataLayer
    mockDataLayer = [];
    Object.defineProperty(window, 'adobeDataLayer', {
      value: mockDataLayer,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Cleanup
    delete (window as unknown as Record<string, unknown>).adobeDataLayer;
  });

  describe('trackSearchEvent', () => {
    it('should add a search event to the data layer', () => {
      const searchTerm = 'budget planner';

      trackSearchEvent(searchTerm);

      expect(mockDataLayer).toHaveLength(1);
      expect(mockDataLayer[0]).toEqual({
        event: 'searchButton',
        eventInfo: {
          elementId: 'keywordSearch',
          elementText: searchTerm,
          clickOption: 'search',
          clickAction: 'searchButton',
        },
      });
    });

    it('should handle empty search term', () => {
      trackSearchEvent('');

      expect(mockDataLayer).toHaveLength(1);
      expect(mockDataLayer[0].eventInfo).toMatchObject({
        elementText: '',
      });
    });

    it('should handle special characters in search term', () => {
      const specialTerm = 'pension & retirement?!';

      trackSearchEvent(specialTerm);

      expect(mockDataLayer[0].eventInfo).toMatchObject({
        elementText: specialTerm,
      });
    });

    it('should support multiple search events', () => {
      trackSearchEvent('first search');
      trackSearchEvent('second search');

      expect(mockDataLayer).toHaveLength(2);
      expect(mockDataLayer[0].eventInfo).toMatchObject({
        elementText: 'first search',
      });
      expect(mockDataLayer[1].eventInfo).toMatchObject({
        elementText: 'second search',
      });
    });
  });

  describe('trackFilterEvent', () => {
    it('should add a filter event to the data layer', () => {
      const type = 'ageGroup';
      const filter = '18-25';

      trackFilterEvent(type, filter);

      expect(mockDataLayer).toHaveLength(1);
      expect(mockDataLayer[0]).toEqual({
        event: 'searchFilterClick',
        eventInfo: {
          elementId: 'keywordSearchFilter',
          accordionType: type,
          accordionOption: filter,
          clickAction: 'applyFilter',
        },
      });
    });

    it('should handle filter with multiple words', () => {
      trackFilterEvent('employment status', 'self employed');

      expect(mockDataLayer[0].eventInfo).toMatchObject({
        accordionType: 'employment status',
        accordionOption: 'self employed',
      });
    });

    it('should handle special characters in filter values', () => {
      trackFilterEvent('type', 'ISA & Bonds');

      expect(mockDataLayer[0].eventInfo).toMatchObject({
        accordionOption: 'ISA & Bonds',
      });
    });

    it('should support multiple filter events', () => {
      trackFilterEvent('type', 'Savings');
      trackFilterEvent('term', '1-5 years');

      expect(mockDataLayer).toHaveLength(2);
      expect(mockDataLayer[0].eventInfo).toMatchObject({
        accordionType: 'type',
      });
      expect(mockDataLayer[1].eventInfo).toMatchObject({
        accordionType: 'term',
      });
    });
  });

  describe('addEvent', () => {
    it('should add a custom event to the data layer', () => {
      const customEvent = {
        event: 'customEvent',
        data: { key: 'value' },
      };

      addEvent(customEvent);

      expect(mockDataLayer).toHaveLength(1);
      expect(mockDataLayer[0]).toEqual(customEvent);
    });

    it('should not add event when adobeDataLayer is undefined', () => {
      delete (window as unknown as Record<string, unknown>).adobeDataLayer;

      addEvent({ event: 'test' });

      expect(
        (window as unknown as Record<string, unknown>).adobeDataLayer,
      ).toBeUndefined();
    });

    it('should preserve all previous events', () => {
      addEvent({ event: 'event1' });
      addEvent({ event: 'event2' });
      addEvent({ event: 'event3' });

      expect(mockDataLayer).toHaveLength(3);
      expect(mockDataLayer[0]).toEqual({ event: 'event1' });
      expect(mockDataLayer[1]).toEqual({ event: 'event2' });
      expect(mockDataLayer[2]).toEqual({ event: 'event3' });
    });
  });

  describe('integration tests', () => {
    it('should track search and filter events together', () => {
      trackSearchEvent('mortgage');
      trackFilterEvent('type', 'Fixed Rate');

      expect(mockDataLayer).toHaveLength(2);
      expect(mockDataLayer[0].event).toBe('searchButton');
      expect(mockDataLayer[1].event).toBe('searchFilterClick');
    });

    it('should handle multiple interactions in sequence', () => {
      trackSearchEvent('pension');
      trackFilterEvent('age', '55-59');
      trackFilterEvent('status', 'Employed');
      trackSearchEvent('retirement');

      expect(mockDataLayer).toHaveLength(4);
      expect(mockDataLayer[0].event).toBe('searchButton');
      expect(mockDataLayer[1].event).toBe('searchFilterClick');
      expect(mockDataLayer[2].event).toBe('searchFilterClick');
      expect(mockDataLayer[3].event).toBe('searchButton');
    });
  });
});
