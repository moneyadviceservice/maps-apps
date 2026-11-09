import { TagGroup } from 'types/@adobe/page';
import { createFormData } from 'utils/fetch/__mocks__/testUtils';

import { trackFilterClicks, trackSearchButton } from './trackingUtils';

import '@testing-library/jest-dom';

interface AdobeDataLayerEvent {
  event: string;
  eventInfo: {
    elementId: string;
    accordionType?: string;
    accordionOption?: string;
    clickAction?: string;
    value?: string;
    [key: string]: unknown;
  };
}

type WindowWithAdobeDataLayer = Window & {
  adobeDataLayer?: AdobeDataLayerEvent[];
};

describe('trackingUtils', () => {
  describe('trackSearchButton', () => {
    beforeEach(() => {
      if (typeof window !== 'undefined') {
        (window as unknown as WindowWithAdobeDataLayer).adobeDataLayer = [];
      }
    });

    afterEach(() => {
      jest.clearAllMocks();
      if (typeof window !== 'undefined') {
        (window as unknown as WindowWithAdobeDataLayer).adobeDataLayer = [];
      }
    });

    it('should push event to adobeDataLayer with correct parameters', () => {
      const keyword = 'test search query';

      trackSearchButton(keyword);

      const adobeDataLayer = (window as unknown as WindowWithAdobeDataLayer)
        .adobeDataLayer;
      expect(adobeDataLayer).toHaveLength(1);
      expect(adobeDataLayer?.[0]).toEqual({
        event: 'searchButton',
        eventInfo: {
          elementId: 'keywordSearchFilter',
          value: keyword,
          clickAction: 'applyFilter',
        },
      });
    });
  });

  describe('trackFilterClicks', () => {
    const mockTags: TagGroup[] = [
      {
        label: 'Topics',
        key: 'topic',
        slug: 'topics',
        tags: [
          { name: 'Saving', key: 'saving' },
          { name: 'Debt', key: 'debt' },
        ],
      },
      {
        label: 'Client Group',
        key: 'clientGroup',
        slug: 'client-group',
        tags: [
          { name: 'Adult', key: 'adult' },
          { name: 'Children', key: 'children' },
        ],
      },
    ];

    beforeEach(() => {
      if (typeof window !== 'undefined') {
        (window as unknown as WindowWithAdobeDataLayer).adobeDataLayer = [];
      }
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should skip keyword, limit, and order fields', () => {
      const formData = createFormData([
        ['keyword', 'test'],
        ['limit', '20'],
        ['order', 'published'],
        ['topic[]', 'saving'],
      ]);

      trackFilterClicks(formData, mockTags);

      const adobeDataLayer = (window as unknown as WindowWithAdobeDataLayer)
        .adobeDataLayer;
      expect(adobeDataLayer).toHaveLength(1);
      expect(adobeDataLayer?.[0]?.eventInfo.accordionType).toBe('Topics');
    });

    it('should skip fields containing keyword as substring', () => {
      const formData = createFormData([
        ['keywordSearch', 'test'],
        ['someKeywordField', 'value'],
        ['topic[]', 'saving'],
      ]);

      trackFilterClicks(formData, mockTags);

      const adobeDataLayer = (window as unknown as WindowWithAdobeDataLayer)
        .adobeDataLayer;
      expect(adobeDataLayer).toHaveLength(1);
      expect(adobeDataLayer?.[0]?.eventInfo.accordionType).toBe('Topics');
    });

    it('should handle year field with all valid options', () => {
      const yearOptions = [
        { value: 'all', expectedLabel: 'All years' },
        { value: 'last-2', expectedLabel: 'Last 2 years' },
        { value: 'last-5', expectedLabel: 'Last 5 years' },
        { value: 'more-than-5', expectedLabel: 'More than 5 years ago' },
      ];

      yearOptions.forEach(({ value, expectedLabel }) => {
        if (typeof window !== 'undefined') {
          (window as unknown as WindowWithAdobeDataLayer).adobeDataLayer = [];
        }

        const formData = createFormData([['year', value]]);
        trackFilterClicks(formData, mockTags);

        const adobeDataLayer = (window as unknown as WindowWithAdobeDataLayer)
          .adobeDataLayer;
        expect(adobeDataLayer?.[0]?.eventInfo.accordionType).toBe(
          'Year of publication',
        );
        expect(adobeDataLayer?.[0]?.eventInfo.accordionOption).toBe(
          expectedLabel,
        );
      });
    });

    it('should handle year field with unknown value', () => {
      const formData = createFormData([['year', 'unknown-value']]);

      trackFilterClicks(formData, mockTags);

      const adobeDataLayer = (window as unknown as WindowWithAdobeDataLayer)
        .adobeDataLayer;
      expect(adobeDataLayer?.[0]?.eventInfo.accordionType).toBe(
        'Year of publication',
      );
      expect(adobeDataLayer?.[0]?.eventInfo.accordionOption).toBe(
        'unknown-value',
      );
    });

    it('should map TagGroup fields with [] suffix to label and tag name', () => {
      const formData = createFormData([['topic[]', 'saving']]);

      trackFilterClicks(formData, mockTags);

      const adobeDataLayer = (window as unknown as WindowWithAdobeDataLayer)
        .adobeDataLayer;
      expect(adobeDataLayer?.[0]).toEqual({
        event: 'searchFilterClick',
        eventInfo: {
          elementId: 'keywordSearchFilter',
          accordionType: 'Topics',
          accordionOption: 'Saving',
          clickAction: 'applyFilter',
        },
      });
    });

    it('should map TagGroup fields without [] suffix', () => {
      const formData = createFormData([['clientGroup', 'adult']]);

      trackFilterClicks(formData, mockTags);

      const adobeDataLayer = (window as unknown as WindowWithAdobeDataLayer)
        .adobeDataLayer;
      expect(adobeDataLayer?.[0]?.eventInfo.accordionType).toBe('Client Group');
      expect(adobeDataLayer?.[0]?.eventInfo.accordionOption).toBe('Adult');
    });

    it('should fallback when TagGroup not found', () => {
      const formData = createFormData([['unknownField[]', 'someValue']]);

      trackFilterClicks(formData, mockTags);

      const adobeDataLayer = (window as unknown as WindowWithAdobeDataLayer)
        .adobeDataLayer;
      expect(adobeDataLayer?.[0]?.eventInfo.accordionType).toBe(
        'unknownField[]',
      );
      expect(adobeDataLayer?.[0]?.eventInfo.accordionOption).toBe('someValue');
    });

    it('should fallback when Tag not found in TagGroup', () => {
      const formData = createFormData([['topic[]', 'unknown-tag']]);

      trackFilterClicks(formData, mockTags);

      const adobeDataLayer = (window as unknown as WindowWithAdobeDataLayer)
        .adobeDataLayer;
      expect(adobeDataLayer?.[0]?.eventInfo.accordionType).toBe('Topics');
      expect(adobeDataLayer?.[0]?.eventInfo.accordionOption).toBe(
        'unknown-tag',
      );
    });

    it('should initialize adobeDataLayer if not present', () => {
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (window as any).adobeDataLayer;
      }

      const formData = createFormData([['topic[]', 'saving']]);

      trackFilterClicks(formData, mockTags);

      const adobeDataLayer = (window as unknown as WindowWithAdobeDataLayer)
        .adobeDataLayer;
      expect(adobeDataLayer).toBeDefined();
      expect(Array.isArray(adobeDataLayer)).toBe(true);
      expect(adobeDataLayer).toHaveLength(1);
    });

    it('should push events to existing adobeDataLayer', () => {
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).adobeDataLayer = [{ existing: 'event' }];
      }

      const formData = createFormData([['topic[]', 'saving']]);

      trackFilterClicks(formData, mockTags);

      const adobeDataLayer = (window as unknown as WindowWithAdobeDataLayer)
        .adobeDataLayer;
      expect(adobeDataLayer).toHaveLength(2);
      expect(adobeDataLayer?.[0]).toEqual({ existing: 'event' });
      expect(adobeDataLayer?.[1]?.event).toBe('searchFilterClick');
    });

    it('should handle empty formData', () => {
      const formData = createFormData([]);

      trackFilterClicks(formData, mockTags);

      const adobeDataLayer = (window as unknown as WindowWithAdobeDataLayer)
        .adobeDataLayer;
      expect(adobeDataLayer).toHaveLength(0);
    });

    it('should handle multiple filter entries from different tag groups', () => {
      const formData = createFormData([
        ['topic[]', 'saving'],
        ['topic[]', 'debt'],
        ['clientGroup[]', 'children'],
      ]);

      trackFilterClicks(formData, mockTags);

      const adobeDataLayer = (window as unknown as WindowWithAdobeDataLayer)
        .adobeDataLayer;
      expect(adobeDataLayer).toHaveLength(3);
      expect(adobeDataLayer?.[0]?.eventInfo.accordionOption).toBe('Saving');
      expect(adobeDataLayer?.[1]?.eventInfo.accordionOption).toBe('Debt');
      expect(adobeDataLayer?.[2]?.eventInfo.accordionType).toBe('Client Group');
      expect(adobeDataLayer?.[2]?.eventInfo.accordionOption).toBe('Children');
    });
  });
});
