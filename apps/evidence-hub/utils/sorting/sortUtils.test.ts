import { DocumentTemplate } from 'types/@adobe/page';
import {
  expectEmptyArrayResult,
  expectNoMutation,
} from 'utils/fetch/__mocks__/testUtils';

import { JsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import {
  applySorting,
  sortByKeywordRelevance,
  sortByLastUpdatedDate,
  sortByPublishDate,
} from './sortUtils';

import '@testing-library/jest-dom';

// Helper to create JsonRichText
const createRichText = (text: string): JsonRichText => ({
  json: [
    {
      nodeType: 'paragraph',
      value: text,
      content: [],
    },
  ],
});

// Helper to create JsonRichText with nested content
const createNestedRichText = (texts: string[]): JsonRichText => ({
  json: [
    {
      nodeType: 'paragraph',
      value: texts[0] || '',
      content: texts.slice(1).map((text) => ({
        nodeType: 'text',
        value: text,
        content: [],
      })),
    },
  ],
});

// Helper to create a document
const createDocument = (
  overrides: Partial<DocumentTemplate>,
): DocumentTemplate => ({
  seoTitle: 'SEO Title',
  seoDescription: 'SEO description',
  title: 'Sample Doc',
  slug: 'sample-doc',
  breadcrumbs: [],
  publishDate: '2023-01-01T00:00:00Z',
  sections: [],
  contactInformation: { json: [] },
  clientGroup: [],
  topic: [],
  countryOfDelivery: [],
  links: [],
  ...overrides,
});

// Helper to test sorting with missing date fields
const testSortingWithMissingDates = (
  sortFn: (docs: DocumentTemplate[]) => DocumentTemplate[],
  dateField: 'publishDate' | 'lastUpdatedDate',
): void => {
  it(`should handle documents without ${dateField}`, () => {
    const documents = [
      createDocument({
        slug: `doc-no-${dateField}`,
        title: `Document No ${dateField}`,
        [dateField]: undefined,
      } as Partial<DocumentTemplate>),
      createDocument({
        slug: `doc-with-${dateField}`,
        title: `Document With ${dateField}`,
        [dateField]:
          dateField === 'publishDate'
            ? '2023-01-01T00:00:00Z'
            : '2024-01-10T00:00:00Z',
      } as Partial<DocumentTemplate>),
    ];

    const result = sortFn(documents);

    const expectedDate =
      dateField === 'publishDate'
        ? '2023-01-01T00:00:00Z'
        : '2024-01-10T00:00:00Z';
    expect(result[0][dateField]).toBe(expectedDate);
    expect(result[1][dateField]).toBeUndefined();
  });
};

// Helper to test that sorting doesn't mutate original array
const testSortingNoMutation = (
  sortFn: (docs: DocumentTemplate[]) => DocumentTemplate[],
  documents: DocumentTemplate[],
): void => {
  it('should not mutate original array', () => {
    const original = [...documents];
    const result = sortFn(documents);

    expectNoMutation(original, result);
  });
};

// Helper to test sorting with empty array
const testSortingEmptyArray = (
  sortFn: (docs: DocumentTemplate[]) => DocumentTemplate[],
): void => {
  it('should handle empty array', () => {
    const result = sortFn([]);

    expectEmptyArrayResult(result);
  });
};

describe('sortUtils', () => {
  describe('sortByPublishDate', () => {
    it('should sort documents by publishDate descending (newest first)', () => {
      const documents = [
        createDocument({
          slug: 'doc-2021',
          title: 'Document 2021',
          publishDate: '2021-12-20T00:00:00Z',
        }),
        createDocument({
          slug: 'doc-2023',
          title: 'Document 2023',
          publishDate: '2023-06-01T00:00:00Z',
        }),
        createDocument({
          slug: 'doc-2022',
          title: 'Document 2022',
          publishDate: '2022-03-15T00:00:00Z',
        }),
      ];

      const result = sortByPublishDate(documents);

      expect(result).toHaveLength(3);
      expect(result[0].publishDate).toBe('2023-06-01T00:00:00Z');
      expect(result[1].publishDate).toBe('2022-03-15T00:00:00Z');
      expect(result[2].publishDate).toBe('2021-12-20T00:00:00Z');
    });

    testSortingWithMissingDates(sortByPublishDate, 'publishDate');

    testSortingNoMutation(sortByPublishDate, [
      createDocument({ slug: 'doc-1', publishDate: '2021-01-01T00:00:00Z' }),
      createDocument({ slug: 'doc-2', publishDate: '2023-01-01T00:00:00Z' }),
    ]);

    testSortingEmptyArray(sortByPublishDate);

    it('should handle single document', () => {
      const documents = [
        createDocument({ slug: 'doc-1', publishDate: '2023-01-01T00:00:00Z' }),
      ];

      const result = sortByPublishDate(documents);

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe('doc-1');
    });
  });

  describe('sortByLastUpdatedDate', () => {
    it('should sort documents by lastUpdatedDate descending (newest first)', () => {
      const documents = [
        createDocument({
          slug: 'doc-2023-08',
          title: 'Document Updated Aug 2023',
          publishDate: '2020-01-01T00:00:00Z',
          lastUpdatedDate: '2023-08-20T00:00:00Z',
        }),
        createDocument({
          slug: 'doc-2024-01',
          title: 'Document Updated Jan 2024',
          publishDate: '2020-01-01T00:00:00Z',
          lastUpdatedDate: '2024-01-10T00:00:00Z',
        }),
        createDocument({
          slug: 'doc-2023-11',
          title: 'Document Updated Nov 2023',
          publishDate: '2020-01-01T00:00:00Z',
          lastUpdatedDate: '2023-11-05T00:00:00Z',
        }),
      ];

      const result = sortByLastUpdatedDate(documents);

      expect(result).toHaveLength(3);
      expect(result[0].lastUpdatedDate).toBe('2024-01-10T00:00:00Z');
      expect(result[1].lastUpdatedDate).toBe('2023-11-05T00:00:00Z');
      expect(result[2].lastUpdatedDate).toBe('2023-08-20T00:00:00Z');
    });

    testSortingWithMissingDates(sortByLastUpdatedDate, 'lastUpdatedDate');

    testSortingNoMutation(sortByLastUpdatedDate, [
      createDocument({
        slug: 'doc-1',
        lastUpdatedDate: '2021-01-01T00:00:00Z',
      }),
      createDocument({
        slug: 'doc-2',
        lastUpdatedDate: '2023-01-01T00:00:00Z',
      }),
    ]);
  });

  describe('sortByKeywordRelevance', () => {
    it('should return documents unchanged when keyword is empty', () => {
      const documents = [
        createDocument({ slug: 'doc-1', title: 'Test Document' }),
        createDocument({ slug: 'doc-2', title: 'Another Document' }),
      ];

      const result = sortByKeywordRelevance(documents, '');

      expect(result).toEqual(documents);
    });

    it('should return documents unchanged when keyword is whitespace-only', () => {
      const documents = [
        createDocument({ slug: 'doc-1', title: 'Test Document' }),
      ];

      const result = sortByKeywordRelevance(documents, '   ');

      expect(result).toEqual(documents);
    });

    it('should prioritize title matches over overview matches', () => {
      const documents = [
        createDocument({
          slug: 'doc-overview',
          title: 'General Document',
          overview: createRichText('This document discusses mental health'),
        }),
        createDocument({
          slug: 'doc-title',
          title: 'Mental Health Report',
          overview: createRichText('This is a general report'),
        }),
      ];

      const result = sortByKeywordRelevance(documents, 'mental');

      expect(result[0].slug).toBe('doc-title');
      expect(result[1].slug).toBe('doc-overview');
    });

    it('should prioritize overview matches over section matches', () => {
      const documents = [
        createDocument({
          slug: 'doc-section',
          title: 'General Document',
          overview: createRichText('This is a general document'),
          sections: [createRichText('Content about mental health research')],
        }),
        createDocument({
          slug: 'doc-overview',
          title: 'General Document',
          overview: createRichText('This document discusses mental health'),
          sections: [createRichText('Content about general topics')],
        }),
      ];

      const result = sortByKeywordRelevance(documents, 'mental');

      expect(result[0].slug).toBe('doc-overview');
      expect(result[1].slug).toBe('doc-section');
    });

    it('should prioritize exact word matches over partial matches', () => {
      const documents = [
        createDocument({
          slug: 'doc-partial',
          title: 'Mentalism Study',
          overview: createRichText('This discusses mentalism'),
        }),
        createDocument({
          slug: 'doc-exact',
          title: 'Mental Health Report',
          overview: createRichText('This discusses mental health'),
        }),
      ];

      const result = sortByKeywordRelevance(documents, 'mental');

      // Both have title matches, but exact should come first
      expect(result[0].slug).toBe('doc-exact');
      expect(result[1].slug).toBe('doc-partial');
    });

    it('should handle nested JsonRichText content', () => {
      const documents = [
        createDocument({
          slug: 'doc-nested',
          title: 'Document',
          overview: createNestedRichText(['Main text', 'nested mental health']),
        }),
      ];

      const result = sortByKeywordRelevance(documents, 'mental');

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe('doc-nested');
    });

    it('should handle documents with multiple sections', () => {
      const documents = [
        createDocument({
          slug: 'doc-multi-section',
          title: 'Document',
          overview: createRichText('General content'),
          sections: [
            createRichText('First section'),
            createRichText('Second section with mental health'),
            createRichText('Third section'),
          ],
        }),
      ];

      const result = sortByKeywordRelevance(documents, 'mental');

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe('doc-multi-section');
    });

    it('should handle empty documents array', () => {
      const result = sortByKeywordRelevance([], 'test');

      expectEmptyArrayResult(result);
    });

    it('should handle case-insensitive matching', () => {
      const documents = [
        createDocument({
          slug: 'doc-upper',
          title: 'MENTAL HEALTH REPORT',
        }),
        createDocument({
          slug: 'doc-lower',
          title: 'mental health report',
        }),
      ];

      const result = sortByKeywordRelevance(documents, 'MENTAL');

      expect(result).toHaveLength(2);
    });

    it('should handle special regex characters in keyword', () => {
      const documents = [
        createDocument({
          slug: 'doc-special',
          title: 'Test (special) characters',
        }),
      ];

      const result = sortByKeywordRelevance(documents, '(special)');

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe('doc-special');
    });

    it('should maintain stable sort for equal priority matches', () => {
      const documents = [
        createDocument({
          slug: 'doc-1',
          title: 'Mental Health Report A',
        }),
        createDocument({
          slug: 'doc-2',
          title: 'Mental Health Report B',
        }),
      ];

      const result = sortByKeywordRelevance(documents, 'mental');

      expect(result[0].slug).toBe('doc-1');
      expect(result[1].slug).toBe('doc-2');
    });

    it('should handle documents without title', () => {
      const documents = [
        createDocument({
          slug: 'doc-no-title',
          title: undefined,
          overview: createRichText('Content about mental health'),
        }),
      ];

      const result = sortByKeywordRelevance(documents, 'mental');

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe('doc-no-title');
    });

    it('should handle documents without overview', () => {
      const documents = [
        createDocument({
          slug: 'doc-no-overview',
          title: 'Mental Health Report',
          overview: undefined,
        }),
      ];

      const result = sortByKeywordRelevance(documents, 'mental');

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe('doc-no-overview');
    });

    it('should handle documents without sections', () => {
      const documents = [
        createDocument({
          slug: 'doc-no-sections',
          title: 'General Document',
          overview: createRichText('General content'),
          sections: undefined,
        }),
      ];

      const result = sortByKeywordRelevance(documents, 'mental');

      expect(result).toHaveLength(1);
    });

    it('should handle empty sections array', () => {
      const documents = [
        createDocument({
          slug: 'doc-empty-sections',
          title: 'General Document',
          overview: createRichText('General content'),
          sections: [],
        }),
      ];

      const result = sortByKeywordRelevance(documents, 'mental');

      expect(result).toHaveLength(1);
    });
  });

  describe('applySorting', () => {
    it('should sort by publishDate when order is published', () => {
      const documents = [
        createDocument({
          slug: 'doc-2021',
          publishDate: '2021-01-01T00:00:00Z',
        }),
        createDocument({
          slug: 'doc-2023',
          publishDate: '2023-01-01T00:00:00Z',
        }),
      ];

      const result = applySorting(documents, 'published', undefined);

      expect(result[0].slug).toBe('doc-2023');
      expect(result[1].slug).toBe('doc-2021');
    });

    it('should sort by lastUpdatedDate when order is updated', () => {
      const documents = [
        createDocument({
          slug: 'doc-2022',
          lastUpdatedDate: '2022-01-01T00:00:00Z',
        }),
        createDocument({
          slug: 'doc-2024',
          lastUpdatedDate: '2024-01-01T00:00:00Z',
        }),
      ];

      const result = applySorting(documents, 'updated', undefined);

      expect(result[0].slug).toBe('doc-2024');
      expect(result[1].slug).toBe('doc-2022');
    });

    it('should sort by relevance when order is relevance and keyword exists', () => {
      const documents = [
        createDocument({
          slug: 'doc-section',
          title: 'Document',
          overview: createRichText('General content'),
          sections: [createRichText('Content about test keyword')],
        }),
        createDocument({
          slug: 'doc-title',
          title: 'Test Keyword Document',
          overview: createRichText('General content'),
        }),
      ];

      const result = applySorting(documents, 'relevance', 'test');

      expect(result[0].slug).toBe('doc-title');
      expect(result[1].slug).toBe('doc-section');
    });

    it('should sort by relevance when order is undefined and keyword exists', () => {
      const documents = [
        createDocument({
          slug: 'doc-section',
          title: 'Document',
          sections: [createRichText('Content about test keyword')],
        }),
        createDocument({
          slug: 'doc-title',
          title: 'Test Keyword Document',
        }),
      ];

      const result = applySorting(documents, undefined, 'test');

      expect(result[0].slug).toBe('doc-title');
      expect(result[1].slug).toBe('doc-section');
    });

    it('should default to publishDate when no order and no keyword', () => {
      const documents = [
        createDocument({
          slug: 'doc-2021',
          publishDate: '2021-01-01T00:00:00Z',
        }),
        createDocument({
          slug: 'doc-2023',
          publishDate: '2023-01-01T00:00:00Z',
        }),
      ];

      const result = applySorting(documents, undefined, undefined);

      expect(result[0].slug).toBe('doc-2023');
      expect(result[1].slug).toBe('doc-2021');
    });

    it('should default to publishDate when order is relevance but no keyword', () => {
      const documents = [
        createDocument({
          slug: 'doc-2021',
          publishDate: '2021-01-01T00:00:00Z',
        }),
        createDocument({
          slug: 'doc-2023',
          publishDate: '2023-01-01T00:00:00Z',
        }),
      ];

      const result = applySorting(documents, 'relevance', undefined);

      expect(result[0].slug).toBe('doc-2023');
      expect(result[1].slug).toBe('doc-2021');
    });

    it('should handle empty documents array', () => {
      const result = applySorting([], 'published', undefined);

      expectEmptyArrayResult(result);
    });

    it('should handle empty keyword string', () => {
      const documents = [
        createDocument({
          slug: 'doc-2021',
          publishDate: '2021-01-01T00:00:00Z',
        }),
        createDocument({
          slug: 'doc-2023',
          publishDate: '2023-01-01T00:00:00Z',
        }),
      ];

      const result = applySorting(documents, 'relevance', '');

      // Should default to publishDate when keyword is empty
      expect(result[0].slug).toBe('doc-2023');
    });
  });
});
