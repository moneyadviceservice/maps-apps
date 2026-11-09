import { DetailsPagesListModel } from 'lib/types/site.type';
import { DocSearchEntry } from '@maps-react/mps/utils/search';
import { mockPageDetails } from 'lib/mocks/mockPageDetails';
import { prepareSearchData } from './search';

describe('prepareSearchData', () => {
  it('should return a Map with correct size', () => {
    const data = prepareSearchData(mockPageDetails.items);
    expect(data).toBeInstanceOf(Map);
    expect(data.size).toBe(mockPageDetails.items.length);
  });

  it('should use slug as the Map key', () => {
    const data = prepareSearchData(mockPageDetails.items);
    mockPageDetails.items.forEach((item) => {
      expect(data.has(item.slug)).toBe(true);
    });
  });

  it('should create DocSearchEntry with lowercased titleText', () => {
    const data = prepareSearchData(mockPageDetails.items);
    const firstItem = mockPageDetails.items[0];
    const entry = data.get(firstItem.slug);

    expect(entry?.titleText).toBe(firstItem.pageTitle.toLocaleLowerCase());
    expect(entry?.titleText).not.toMatch(/[A-Z]/);
  });

  it('should handle plaintext overview correctly', () => {
    const data = prepareSearchData(mockPageDetails.items);
    const firstItem = mockPageDetails.items[0];
    const entry = data.get(firstItem.slug);

    expect(entry?.overviewText).toBe(
      firstItem.overview?.plaintext?.toLocaleLowerCase() ?? '',
    );
  });

  it('should handle missing overview gracefully', () => {
    const itemWithoutOverview: DetailsPagesListModel = {
      ...mockPageDetails.items[0],
      overview: { json: [], plaintext: undefined },
    };

    const data = prepareSearchData([itemWithoutOverview]);
    const entry = data.get(itemWithoutOverview.slug);

    expect(entry?.overviewText).toBe('');
  });

  it('should combine sections text from multiple fields', () => {
    const itemWithAllSections: DetailsPagesListModel = {
      ...mockPageDetails.items[0],
      preRequisiteSection: { plaintext: 'Prerequisites Here' },
      individualCertification: { plaintext: 'Certification Content' },
      outcomeTitle: 'Outcomes Title',
      outcomesSection: { plaintext: 'Outcomes Here' },
    };

    const data = prepareSearchData([itemWithAllSections]);
    const entry = data.get(itemWithAllSections.slug);

    const expectedSectionsText = [
      itemWithAllSections.description?.plaintext ?? '',
      'Prerequisites Here',
      'Certification Content',
      'Outcomes Title',
      'Outcomes Here',
    ]
      .join(' ')
      .toLocaleLowerCase();

    expect(entry?.sectionsText).toBe(expectedSectionsText);
  });

  it('should create combined text from title, overview, and sections', () => {
    const data = prepareSearchData(mockPageDetails.items);
    const firstItem = mockPageDetails.items[0];
    const entry = data.get(firstItem.slug);

    const expectedCombinedText = [
      firstItem.pageTitle.toLocaleLowerCase(),
      firstItem.overview?.plaintext?.toLocaleLowerCase() ?? '',
      [
        firstItem.description?.plaintext ?? '',
        firstItem.preRequisiteSection?.plaintext ?? '',
        firstItem.individualCertification?.plaintext ?? '',
        firstItem.outcomeTitle,
        firstItem.outcomesSection?.plaintext ?? '',
      ]
        .join(' ')
        .toLocaleLowerCase(),
    ].join(' ');

    expect(entry?.combinedText).toBe(expectedCombinedText);
  });

  it('should have all required DocSearchEntry properties', () => {
    const data = prepareSearchData(mockPageDetails.items);

    data.forEach((entry) => {
      expect(entry).toHaveProperty('titleText');
      expect(entry).toHaveProperty('overviewText');
      expect(entry).toHaveProperty('sectionsText');
      expect(entry).toHaveProperty('combinedText');

      expect(typeof entry.titleText).toBe('string');
      expect(typeof entry.overviewText).toBe('string');
      expect(typeof entry.sectionsText).toBe('string');
      expect(typeof entry.combinedText).toBe('string');
    });
  });

  it('should handle empty card array', () => {
    const data = prepareSearchData([]);
    expect(data).toBeInstanceOf(Map);
    expect(data.size).toBe(0);
  });
});
