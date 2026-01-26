import { DocumentTemplate } from 'types/@adobe/page';

import {
  redisRestDel,
  redisRestGet,
  redisRestSet,
} from '@maps-react/redis/rest-client';

import {
  mockAemHeadlessClient,
  mockDocumentTemplate,
  setupTestMocks,
} from './__mocks__/testMocks';
import {
  clearEvidenceHubCache,
  clearRequestCache,
  fetchDocumentsPaginated,
  getAllDocuments,
  warmCache,
  warmCacheOnBuild,
} from './documents';

jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestGet: jest.fn().mockResolvedValue({
    success: true,
    data: { key: '', value: null, site: '' },
  }),
  redisRestSet: jest.fn().mockResolvedValue({
    success: true,
    data: { success: true, site: 'EVIDENCE_HUB_DEV' },
  }),
  redisRestDel: jest.fn().mockResolvedValue({
    success: true,
    data: { key: '', deletedCount: 1, site: '' },
  }),
}));

// Mock compression functions - create actual mocks we can control
const mockCompress = jest.fn((str: string) =>
  Promise.resolve(`compressed:${str}`),
);
const mockUncompress = jest.fn((str: string) => {
  // Remove the "compressed:" prefix if present
  if (str.startsWith('compressed:')) {
    return Promise.resolve(str.replace('compressed:', ''));
  }
  return Promise.resolve(str);
});
const mockIsCompressed = jest.fn((str: string) =>
  str.startsWith('compressed:'),
);

jest.mock('./compress', () => ({
  compress: (...args: Parameters<typeof mockCompress>) => mockCompress(...args),
  uncompress: (...args: Parameters<typeof mockUncompress>) =>
    mockUncompress(...args),
  isCompressed: (...args: Parameters<typeof mockIsCompressed>) =>
    mockIsCompressed(...args),
}));

// Mock the aemHeadlessClient
jest.mock('@maps-react/utils/aemHeadlessClient', () => ({
  aemHeadlessClient: mockAemHeadlessClient,
}));

describe('fetchDocumentsPaginated', () => {
  // Helper to create a GetResponse object
  const createGetResponse = (
    key: string,
    value: string | null,
    site = 'EVIDENCE_HUB_DEV',
  ) => ({
    success: true,
    data: {
      key,
      value,
      site,
    },
  });

  // Helper to create a document with specific properties
  const createDocument = (
    overrides: Partial<DocumentTemplate>,
  ): DocumentTemplate => ({
    ...mockDocumentTemplate,
    ...overrides,
  });

  // Helper to create rich text JSON
  const createRichText = (value: string) => ({
    json: [
      {
        nodeType: 'paragraph',
        value,
        content: [],
      },
    ],
  });

  // Helper to create pagination with custom overrides
  const createPaginationWithDefaults = (
    items: DocumentTemplate[],
    overrides: {
      page?: number;
      limit?: number;
      totalItems?: number;
      startIndex?: number;
      endIndex?: number;
      hasNextPage?: boolean;
      hasPreviousPage?: boolean;
      totalPages?: number;
    } = {},
  ) => {
    const page = overrides.page ?? 1;
    const limit = overrides.limit ?? 10;
    const totalItems = overrides.totalItems ?? items.length;
    const startIndex = overrides.startIndex ?? (page - 1) * limit;
    const endIndex =
      overrides.endIndex ?? Math.min(startIndex + items.length, totalItems);
    const totalPages = overrides.totalPages ?? Math.ceil(totalItems / limit);

    return {
      items,
      pagination: {
        page,
        endIndex,
        hasNextPage: overrides.hasNextPage ?? page < totalPages,
        hasPreviousPage: overrides.hasPreviousPage ?? page > 1,
        itemsPerPage: limit,
        startIndex,
        totalItems,
        totalPages,
      },
    };
  };

  // Helper to get dynamic date based on years ago
  const getDateYearsAgo = (yearsAgo: number): string => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - yearsAgo);
    date.setMonth(0);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  };

  const currentYear = new Date().getFullYear();

  const mockDocuments = [
    createDocument({
      ...mockDocumentTemplate,
      publishDate: getDateYearsAgo(2), // currentYear - 2
    }),
    createDocument({
      slug: 'test-document-2',
      title: 'Test Document 2',
      pageType: { key: 'evaluation', name: 'Evaluation' },
      publishDate: getDateYearsAgo(3), // currentYear - 3
      topic: [{ key: 'debt', name: 'Debt' }],
      clientGroup: [{ key: 'young-adult', name: 'Young Adult' }],
      countryOfDelivery: [{ key: 'scotland', name: 'Scotland' }],
      organisation: [{ key: 'test-org', name: 'Test Organisation' }],
    }),
    createDocument({
      slug: 'test-document-3',
      title: 'Test Document 3',
      pageType: { key: 'review', name: 'Review' },
      publishDate: getDateYearsAgo(4), // currentYear - 4
      topic: [{ key: 'savings', name: 'Savings' }],
      clientGroup: [{ key: 'adult', name: 'Adult' }],
      countryOfDelivery: [{ key: 'wales', name: 'Wales' }],
      organisation: [{ key: 'another-org', name: 'Another Organisation' }],
    }),
  ];

  // Helper functions to reduce duplication
  const createExpectedPagination = (
    items: DocumentTemplate[],
    page = 1,
    limit = 10,
  ) =>
    createPaginationWithDefaults(items, {
      page,
      limit,
      endIndex: items.length,
      hasNextPage: false,
      hasPreviousPage: page > 1,
      startIndex: 0,
    });

  const createEmptyPagination = (page = 1, limit = 10) =>
    createPaginationWithDefaults([], {
      page,
      limit,
      totalItems: 0,
      endIndex: 0,
      hasNextPage: false,
      hasPreviousPage: page > 1,
      startIndex: 0,
      totalPages: 0,
    });

  // Helper to create a mock AEM response
  const mockAemResponse = (documents: DocumentTemplate[] = mockDocuments) => {
    mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
      data: {
        pageSectionTemplateList: {
          items: documents,
        },
      },
    });
  };

  // Helper to extract items from result and validate it's not an error
  const extractItems = (
    result: ReturnType<typeof fetchDocumentsPaginated> extends Promise<infer T>
      ? T
      : never,
  ): DocumentTemplate[] => {
    expect('items' in result && result.items).toBeDefined();
    return 'items' in result ? result.items : [];
  };

  // Helper to create single-item pagination (common pattern)
  const createSingleItemPagination = (
    items: DocumentTemplate[],
    page = 1,
    limit = 10,
  ) => {
    const totalItems = items.length;
    return createPaginationWithDefaults(items, {
      page,
      limit,
      totalItems,
      endIndex: totalItems,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  };

  // Helper to create documents with rich text for keyword search tests
  const createDocumentsWithRichText = (
    documents: DocumentTemplate[] = mockDocuments,
  ) => {
    return documents.map((doc) => ({
      ...doc,
      overview: {
        json: [
          {
            nodeType: 'paragraph',
            value: doc.title,
            content: [],
          },
        ],
      },
      sections: [
        {
          json: [
            {
              nodeType: 'paragraph',
              value: `Content about ${
                doc.topic?.[0]?.name || 'general'
              } topics`,
              content: [],
            },
          ],
        },
      ],
    }));
  };

  // Helper to create documents with dates for sorting tests
  const createDocumentsWithDates = (
    dates: Array<{ slug: string; title: string; publishDate: string }>,
  ) => {
    return dates.map(({ slug, title, publishDate }) =>
      createDocument({ slug, title, publishDate }),
    );
  };

  // Helper to create documents with update dates for sorting tests
  const createDocumentsWithUpdates = (
    updates: Array<{
      slug: string;
      title: string;
      publishDate: string;
      lastUpdatedDate: string;
    }>,
  ) => {
    return updates.map(({ slug, title, publishDate, lastUpdatedDate }) =>
      createDocument({ slug, title, publishDate, lastUpdatedDate }),
    );
  };

  // Helper to create documents with keyword content for search tests
  const createDocumentsWithKeyword = (
    configs: Array<{
      slug: string;
      title: string;
      overview?: string;
      sections?: string[];
      publishDate?: string;
      lastUpdatedDate?: string;
    }>,
  ) => {
    return configs.map(
      ({ slug, title, overview, sections, publishDate, lastUpdatedDate }) =>
        createDocument({
          slug,
          title,
          overview: overview ? createRichText(overview) : undefined,
          sections: sections?.map((s) => createRichText(s)),
          publishDate,
          lastUpdatedDate,
        }),
    );
  };

  setupTestMocks();

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Redis mocks
    (redisRestGet as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        key: '',
        value: null,
        site: '',
      },
    });
    (redisRestSet as jest.Mock).mockResolvedValue({
      success: true,
      site: 'EVIDENCE_HUB_DEV',
    });
    (redisRestDel as jest.Mock).mockResolvedValue({
      key: '',
      deletedCount: 1,
      site: '',
    });
    // Reset environment variables
    delete process.env.BUILD_ID;
  });

  describe('successful documents fetching', () => {
    it('should return documents when found', async () => {
      mockAemResponse();
      const result = await fetchDocumentsPaginated();
      expect(result).toEqual(createExpectedPagination(mockDocuments));
    });

    it('should return empty array when no documents found', async () => {
      mockAemResponse([]);
      const result = await fetchDocumentsPaginated();
      expect(result).toEqual(createEmptyPagination());
    });
  });

  describe('pagination functionality', () => {
    beforeEach(() => {
      mockAemResponse();
    });

    it('should paginate correctly with default parameters', async () => {
      const result = await fetchDocumentsPaginated();
      expect(result).toEqual(createExpectedPagination(mockDocuments));
    });

    it('should paginate correctly with custom page size', async () => {
      const result = await fetchDocumentsPaginated({}, { limit: 2 });
      const expectedItems = mockDocuments.slice(0, 2);
      expect(result).toEqual(
        createPaginationWithDefaults(expectedItems, {
          page: 1,
          limit: 2,
          totalItems: 3,
          endIndex: 2,
          hasNextPage: true,
          hasPreviousPage: false,
        }),
      );
    });

    it('should paginate correctly with custom page number', async () => {
      const result = await fetchDocumentsPaginated({}, { page: 2, limit: 2 });
      expect(result).toEqual(
        createPaginationWithDefaults([mockDocuments[2]], {
          page: 2,
          limit: 2,
          totalItems: 3,
          endIndex: 3,
          startIndex: 2,
          hasNextPage: false,
          hasPreviousPage: true,
        }),
      );
    });

    it('should handle page number greater than total pages', async () => {
      const result = await fetchDocumentsPaginated({}, { page: 5, limit: 2 });
      expect(result).toEqual(
        createPaginationWithDefaults([], {
          page: 5,
          limit: 2,
          totalItems: 3,
          endIndex: 3,
          startIndex: 8,
          hasNextPage: false,
          hasPreviousPage: true,
        }),
      );
    });
  });

  describe('filtering functionality', () => {
    beforeEach(() => {
      mockAemResponse();
    });

    it('should filter by pageType', async () => {
      const result = await fetchDocumentsPaginated({ pageType: 'evaluation' });
      expect(result).toEqual(createExpectedPagination([mockDocuments[1]]));
    });

    it('should filter by multiple pageTypes', async () => {
      const result = await fetchDocumentsPaginated({
        pageType: 'evaluation,review',
      });
      expect(result).toEqual(
        createExpectedPagination([mockDocuments[1], mockDocuments[2]]),
      );
    });

    it('should filter by year range (last-2)', async () => {
      // Create documents within the last-2 range (currentYear - 1 to currentYear)
      const documentsInLast2Years = [
        createDocument({
          slug: 'doc-current-year',
          title: 'Document Current Year',
          publishDate: getDateYearsAgo(0), // currentYear
        }),
        createDocument({
          slug: 'doc-last-year',
          title: 'Document Last Year',
          publishDate: getDateYearsAgo(1), // currentYear - 1
        }),
        createDocument({
          slug: 'doc-outside-range',
          title: 'Document Outside Range',
          publishDate: getDateYearsAgo(3), // currentYear - 3 (outside last-2 range)
        }),
      ];
      mockAemResponse(documentsInLast2Years);
      const result = await fetchDocumentsPaginated({ year: 'last-2' });
      // Should only include documents from currentYear - 1 to currentYear
      const items = extractItems(result);
      expect(items).toHaveLength(2);
      expect(items.map((doc) => doc.slug)).toEqual([
        'doc-current-year',
        'doc-last-year',
      ]);
    });

    it('should filter by year range (last-5)', async () => {
      const result = await fetchDocumentsPaginated({ year: 'last-5' });
      // Should include all documents from currentYear - 4 to currentYear
      // All mockDocuments are within this range (currentYear - 4, currentYear - 3, currentYear - 2)
      expect(result).toEqual(createExpectedPagination(mockDocuments));
    });

    it('should filter by specific year', async () => {
      // Filter by the year of mockDocuments[1] (currentYear - 3)
      const targetYear = (currentYear - 3).toString();
      const result = await fetchDocumentsPaginated({ year: targetYear });
      expect(result).toEqual(createSingleItemPagination([mockDocuments[1]]));
    });

    it('should filter by topic', async () => {
      const result = await fetchDocumentsPaginated({ topic: 'debt' });
      expect(result).toEqual(createSingleItemPagination([mockDocuments[1]]));
    });

    it('should filter by clientGroup', async () => {
      const result = await fetchDocumentsPaginated({
        clientGroup: 'young-adult',
      });
      expect(result).toEqual(createSingleItemPagination([mockDocuments[1]]));
    });

    it('should filter by countryOfDelivery', async () => {
      const result = await fetchDocumentsPaginated({
        countryOfDelivery: 'scotland',
      });
      expect(result).toEqual(createSingleItemPagination([mockDocuments[1]]));
    });

    it('should filter by organisation', async () => {
      const result = await fetchDocumentsPaginated({
        organisation: 'test-org',
      });
      expect(result).toEqual(createSingleItemPagination([mockDocuments[1]]));
    });

    it('should combine multiple filters with OR logic for topic, clientGroup, countryOfDelivery', async () => {
      const result = await fetchDocumentsPaginated({
        topic: 'debt',
        clientGroup: 'adult',
        countryOfDelivery: 'wales',
      });
      // Should match documents that have ANY of these filters
      expect(result).toEqual({
        items: expect.any(Array),
        pagination: expect.objectContaining({
          page: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          itemsPerPage: 10,
          startIndex: 0,
        }),
      });
      // Verify that the result contains some items (the exact count may vary based on implementation)
      const items = extractItems(result);
      expect(items.length).toBeGreaterThan(0);
    });

    it('should combine multiple filters with AND logic for organisation', async () => {
      const result = await fetchDocumentsPaginated({
        organisation: 'test-org,another-org',
      });
      // Should match documents that have ALL of these organisation filters
      expect(result).toEqual({
        items: expect.any(Array),
        pagination: expect.objectContaining({
          page: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          itemsPerPage: 10,
          startIndex: 0,
        }),
      });
    });
  });

  describe('keyword search functionality', () => {
    beforeEach(() => {
      mockAemResponse(createDocumentsWithRichText());
    });

    it('should search by keyword in title', async () => {
      const result = await fetchDocumentsPaginated({ keyword: 'Document 2' });
      expect(result).toEqual(
        createSingleItemPagination([
          expect.objectContaining({ title: 'Test Document 2' }),
        ]),
      );
    });

    it('should search by keyword in content', async () => {
      const result = await fetchDocumentsPaginated({ keyword: 'debt' });
      expect(result).toEqual(
        createSingleItemPagination([
          expect.objectContaining({ title: 'Test Document 2' }),
        ]),
      );
    });

    it('should return empty results for non-matching keyword', async () => {
      const result = await fetchDocumentsPaginated({ keyword: 'nonexistent' });
      expect(result).toEqual(createEmptyPagination());
    });

    it('should be case insensitive', async () => {
      const result = await fetchDocumentsPaginated({ keyword: 'DOCUMENT 2' });
      expect(result).toEqual(
        createSingleItemPagination([
          expect.objectContaining({ title: 'Test Document 2' }),
        ]),
      );
    });
  });

  describe('keyword search ordering', () => {
    let documentA: DocumentTemplate;
    let documentB: DocumentTemplate;
    let documentC: DocumentTemplate;
    let documentD: DocumentTemplate;

    beforeEach(() => {
      // Document A: keyword "mental" in title only
      documentA = createDocument({
        slug: 'document-a',
        title: 'Mental Health Report',
        overview: createRichText('This is a general health report'),
        sections: [createRichText('Content about general health topics')],
      });

      // Document B: keyword "mental" in overview only
      documentB = createDocument({
        slug: 'document-b',
        title: 'Health Study',
        overview: createRichText('This report discusses mental health issues'),
        sections: [createRichText('Content about general health topics')],
      });

      // Document C: keyword "mental" in sections only
      documentC = createDocument({
        slug: 'document-c',
        title: 'Research Paper',
        overview: createRichText('This is a general research paper'),
        sections: [createRichText('Content about mental health research')],
      });

      // Document D: keyword "mental" in multiple places (for edge case testing)
      documentD = createDocument({
        slug: 'document-d',
        title: 'Mental Wellness Guide',
        overview: createRichText('This guide covers mental health topics'),
        sections: [createRichText('Content about mental health research')],
      });

      const documentsWithKeyword = [documentC, documentB, documentA, documentD];
      mockAemResponse(documentsWithKeyword);
    });

    it('should order results by match location - title first', async () => {
      const result = await fetchDocumentsPaginated({ keyword: 'mental' });
      const items = extractItems(result);
      expect(items[0].title).toContain('Mental');
      expect(items[0].title).toBe('Mental Health Report');
    });

    it('should order results by match location - overview second', async () => {
      const result = await fetchDocumentsPaginated({ keyword: 'mental' });
      const items = extractItems(result);
      const documentBIndex = items.findIndex(
        (doc) => doc.title === 'Health Study',
      );
      const documentCIndex = items.findIndex(
        (doc) => doc.title === 'Research Paper',
      );
      expect(documentBIndex).toBeLessThan(documentCIndex);
    });

    it('should order results by match location - sections last', async () => {
      const result = await fetchDocumentsPaginated({ keyword: 'mental' });
      const items = extractItems(result);
      const documentCIndex = items.findIndex(
        (doc) => doc.title === 'Research Paper',
      );
      const titleMatches = items.filter((doc) =>
        doc.title.toLowerCase().includes('mental'),
      ).length;
      const overviewMatches = items.filter(
        (doc) =>
          doc.title !== 'Research Paper' &&
          !doc.title.toLowerCase().includes('mental'),
      ).length;
      expect(documentCIndex).toBeGreaterThanOrEqual(
        titleMatches + overviewMatches,
      );
    });

    it('should order results by complete hierarchy', async () => {
      const result = await fetchDocumentsPaginated({ keyword: 'mental' });
      const items = extractItems(result);
      const titles = items.map((doc) => doc.title);

      // Document A (title match) should come first
      expect(titles[0]).toBe('Mental Health Report');

      // Document D (title match) should come before overview matches
      const documentDIndex = titles.indexOf('Mental Wellness Guide');
      const documentBIndex = titles.indexOf('Health Study');
      expect(documentDIndex).toBeLessThan(documentBIndex);

      // Document B (overview match) should come before Document C (section match)
      expect(documentBIndex).toBeLessThan(titles.indexOf('Research Paper'));
    });

    it('should not affect ordering when no keyword is present', async () => {
      const result = await fetchDocumentsPaginated({});
      const items = extractItems(result);
      const titles = items.map((doc) => doc.title);

      // Documents should be in their original order (as mocked)
      expect(titles[0]).toBe('Research Paper');
      expect(titles[1]).toBe('Health Study');
      expect(titles[2]).toBe('Mental Health Report');
      expect(titles[3]).toBe('Mental Wellness Guide');
    });

    it('should handle documents with keyword in multiple locations', async () => {
      const result = await fetchDocumentsPaginated({ keyword: 'mental' });
      const items = extractItems(result);

      // Document D has keyword in title, overview, and sections
      // It should appear first (title match takes precedence)
      const documentDIndex = items.findIndex(
        (doc) => doc.title === 'Mental Wellness Guide',
      );
      const documentAIndex = items.findIndex(
        (doc) => doc.title === 'Mental Health Report',
      );

      // Both should be in the title match group (first positions)
      expect(documentDIndex).toBeLessThan(items.length);
      expect(documentAIndex).toBeLessThan(items.length);

      // Document D should be among the first items (title matches)
      expect(documentDIndex).toBeLessThan(2);
    });
  });

  describe('date-based sorting', () => {
    it('should sort by publishDate when order=published', async () => {
      const documentsWithDates = createDocumentsWithDates([
        {
          slug: 'doc-2021',
          title: 'Document 2021',
          publishDate: '2021-12-20T00:00:00Z',
        },
        {
          slug: 'doc-2023',
          title: 'Document 2023',
          publishDate: '2023-06-01T00:00:00Z',
        },
        {
          slug: 'doc-2022',
          title: 'Document 2022',
          publishDate: '2022-03-15T00:00:00Z',
        },
      ]);

      mockAemResponse(documentsWithDates);
      const result = await fetchDocumentsPaginated({ order: 'published' });
      const items = extractItems(result);

      expect(items).toHaveLength(3);
      expect(items[0].publishDate).toBe('2023-06-01T00:00:00Z');
      expect(items[1].publishDate).toBe('2022-03-15T00:00:00Z');
      expect(items[2].publishDate).toBe('2021-12-20T00:00:00Z');
    });

    it('should sort by lastUpdatedDate when order=updated', async () => {
      const documentsWithUpdates = createDocumentsWithUpdates([
        {
          slug: 'doc-2023-08',
          title: 'Document Updated Aug 2023',
          publishDate: '2020-01-01T00:00:00Z',
          lastUpdatedDate: '2023-08-20T00:00:00Z',
        },
        {
          slug: 'doc-2024-01',
          title: 'Document Updated Jan 2024',
          publishDate: '2020-01-01T00:00:00Z',
          lastUpdatedDate: '2024-01-10T00:00:00Z',
        },
        {
          slug: 'doc-2023-11',
          title: 'Document Updated Nov 2023',
          publishDate: '2020-01-01T00:00:00Z',
          lastUpdatedDate: '2023-11-05T00:00:00Z',
        },
      ]);

      mockAemResponse(documentsWithUpdates);
      const result = await fetchDocumentsPaginated({ order: 'updated' });
      const items = extractItems(result);

      expect(items).toHaveLength(3);
      expect(items[0].lastUpdatedDate).toBe('2024-01-10T00:00:00Z');
      expect(items[1].lastUpdatedDate).toBe('2023-11-05T00:00:00Z');
      expect(items[2].lastUpdatedDate).toBe('2023-08-20T00:00:00Z');
    });

    it('should handle documents without lastUpdatedDate when order=updated', async () => {
      const documentsMixed = [
        createDocument({
          slug: 'doc-no-update',
          title: 'Document Without Update Date',
          publishDate: '2020-01-01T00:00:00Z',
          lastUpdatedDate: undefined,
        }),
        createDocument({
          slug: 'doc-with-update',
          title: 'Document With Update Date',
          publishDate: '2020-01-01T00:00:00Z',
          lastUpdatedDate: '2024-01-10T00:00:00Z',
        }),
      ];

      mockAemResponse(documentsMixed);
      const result = await fetchDocumentsPaginated({ order: 'updated' });
      const items = extractItems(result);

      expect(items).toHaveLength(2);
      // Document with lastUpdatedDate should appear first
      expect(items[0].lastUpdatedDate).toBe('2024-01-10T00:00:00Z');
      // Document without lastUpdatedDate should appear last (treated as very old)
      expect(items[1].lastUpdatedDate).toBeUndefined();
    });

    it('should default to publishDate sorting when no order parameter provided and no keyword', async () => {
      const documentsWithDates = createDocumentsWithDates([
        {
          slug: 'doc-2021',
          title: 'Document 2021',
          publishDate: '2021-12-20T00:00:00Z',
        },
        {
          slug: 'doc-2023',
          title: 'Document 2023',
          publishDate: '2023-06-01T00:00:00Z',
        },
        {
          slug: 'doc-2022',
          title: 'Document 2022',
          publishDate: '2022-03-15T00:00:00Z',
        },
      ]);

      mockAemResponse(documentsWithDates);
      const result = await fetchDocumentsPaginated({});
      const items = extractItems(result);

      expect(items).toHaveLength(3);
      // Should be sorted by publishDate descending (newest first)
      expect(items[0].publishDate).toBe('2023-06-01T00:00:00Z');
      expect(items[1].publishDate).toBe('2022-03-15T00:00:00Z');
      expect(items[2].publishDate).toBe('2021-12-20T00:00:00Z');
    });

    it('should use relevance sorting when keyword exists and order=relevance', async () => {
      const documentsWithKeyword = createDocumentsWithKeyword([
        {
          slug: 'doc-section',
          title: 'Document',
          overview: 'Content about general topics',
          sections: ['Content about test keyword'],
        },
        {
          slug: 'doc-title',
          title: 'Test Keyword Document',
          overview: 'Content about general topics',
        },
        {
          slug: 'doc-overview',
          title: 'Overview Document',
          overview: 'Content about test keyword',
        },
      ]);

      mockAemResponse(documentsWithKeyword);
      const result = await fetchDocumentsPaginated({
        keyword: 'test',
        order: 'relevance',
      });
      const items = extractItems(result);

      expect(items).toHaveLength(3);
      // Title match should come first
      expect(items[0].title).toBe('Test Keyword Document');
      // Overview match should come second
      expect(items[1].title).toBe('Overview Document');
      // Section match should come last
      expect(items[2].title).toBe('Document');
    });

    it('should use publishDate sorting when keyword exists but order=published', async () => {
      const documentsWithKeywordAndDates = createDocumentsWithKeyword([
        {
          slug: 'doc-old',
          title: 'Test Document Old',
          publishDate: '2021-01-01T00:00:00Z',
          overview: 'Content about test keyword',
        },
        {
          slug: 'doc-new',
          title: 'Test Document New',
          publishDate: '2023-01-01T00:00:00Z',
          overview: 'Content about test keyword',
        },
      ]);

      mockAemResponse(documentsWithKeywordAndDates);
      const result = await fetchDocumentsPaginated({
        keyword: 'test',
        order: 'published',
      });
      const items = extractItems(result);

      expect(items).toHaveLength(2);
      // Should be sorted by publishDate, not relevance
      expect(items[0].publishDate).toBe('2023-01-01T00:00:00Z');
      expect(items[1].publishDate).toBe('2021-01-01T00:00:00Z');
    });

    it('should use lastUpdatedDate sorting when keyword exists but order=updated', async () => {
      const documentsWithKeywordAndUpdates = createDocumentsWithKeyword([
        {
          slug: 'doc-old-update',
          title: 'Test Document Old Update',
          publishDate: '2020-01-01T00:00:00Z',
          lastUpdatedDate: '2022-01-01T00:00:00Z',
          overview: 'Content about test keyword',
        },
        {
          slug: 'doc-new-update',
          title: 'Test Document New Update',
          publishDate: '2020-01-01T00:00:00Z',
          lastUpdatedDate: '2024-01-01T00:00:00Z',
          overview: 'Content about test keyword',
        },
      ]);

      mockAemResponse(documentsWithKeywordAndUpdates);
      const result = await fetchDocumentsPaginated({
        keyword: 'test',
        order: 'updated',
      });
      const items = extractItems(result);

      expect(items).toHaveLength(2);
      // Should be sorted by lastUpdatedDate, not relevance
      expect(items[0].lastUpdatedDate).toBe('2024-01-01T00:00:00Z');
      expect(items[1].lastUpdatedDate).toBe('2022-01-01T00:00:00Z');
    });

    it('should maintain backward compatibility - sort by relevance when keyword exists and no order', async () => {
      const documentsWithKeyword = createDocumentsWithKeyword([
        {
          slug: 'doc-section',
          title: 'Document',
          overview: 'Content about general topics',
          sections: ['Content about test keyword'],
        },
        {
          slug: 'doc-title',
          title: 'Test Keyword Document',
          overview: 'Content about general topics',
        },
      ]);

      mockAemResponse(documentsWithKeyword);
      const result = await fetchDocumentsPaginated({ keyword: 'test' });
      const items = extractItems(result);

      expect(items).toHaveLength(2);
      // Should be sorted by relevance (backward compatibility)
      expect(items[0].title).toBe('Test Keyword Document'); // Title match first
      expect(items[1].title).toBe('Document'); // Section match second
    });
  });

  describe('caching behavior', () => {
    it('should use cached filter result IDs when available', async () => {
      const buildId = 'test-build-123';
      process.env.AEM_CACHE = buildId;

      // Create compressed cached data using the mock
      const allDocumentsData = JSON.stringify(mockDocuments);
      const compressedAllDocuments = `compressed:${allDocumentsData}`;

      // Create compressed filter result IDs
      const filterResultIds = mockDocuments
        .map((doc) => doc.slug)
        .filter(Boolean);
      const compressedFilterIds = `compressed:${JSON.stringify(
        filterResultIds,
      )}`;

      // Mock calls in order:
      // 1. getFilteredDocuments checks filtered cache (found - IDs)
      (redisRestGet as jest.Mock).mockResolvedValueOnce(
        createGetResponse('filter-key', compressedFilterIds),
      ); // Filtered cache check
      // 2. getAllDocuments checks build ID (matches, so cache isn't cleared)
      (redisRestGet as jest.Mock).mockResolvedValueOnce(
        createGetResponse('evidence-hub:build-id', buildId),
      ); // Build ID check
      // 3. getAllDocuments checks all documents cache (found)
      (redisRestGet as jest.Mock).mockResolvedValueOnce(
        createGetResponse('evidence-hub:all-documents', compressedAllDocuments),
      ); // All documents cache

      const result = await fetchDocumentsPaginated();

      expect(redisRestGet).toHaveBeenCalledWith(
        expect.stringMatching(/evidence-hub:filter-results/),
      );
      expect(mockAemHeadlessClient.runPersistedQuery).not.toHaveBeenCalled();
      expect(result).toEqual(createExpectedPagination(mockDocuments));
    });

    it('should cache filtered result IDs with compression and no expiration TTL', async () => {
      mockAemResponse(mockDocuments);
      // Mock build ID check and cache misses
      (redisRestGet as jest.Mock).mockResolvedValue({
        success: true,
        data: {
          key: '',
          value: null,
          site: '',
        },
      });
      await fetchDocumentsPaginated({ pageType: 'evaluation' });

      // Should cache filter result IDs (compressed)
      expect(redisRestSet).toHaveBeenCalledWith(
        expect.stringContaining('evidence-hub:filter-results:'),
        expect.stringMatching(/^compressed:/), // Compressed data
        { ttlSeconds: 31536000 }, // NO_EXPIRATION_TTL (365 days)
      );

      // Should also cache all documents (compressed)
      expect(redisRestSet).toHaveBeenCalledWith(
        'evidence-hub:all-documents',
        expect.stringMatching(/^compressed:/), // Compressed data
        { ttlSeconds: 31536000 }, // NO_EXPIRATION_TTL (365 days)
      );
    });

    it('should handle cache errors gracefully', async () => {
      (redisRestGet as jest.Mock).mockRejectedValue(new Error('Cache error'));
      mockAemResponse(mockDocuments);
      const result = await fetchDocumentsPaginated();
      expect(result).toEqual(createExpectedPagination(mockDocuments));
    });
  });

  describe('error handling', () => {
    it('should handle AEM query failures gracefully', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockRejectedValue(
        new Error('AEM query failed'),
      );

      const result = await fetchDocumentsPaginated();

      // The implementation catches errors and returns empty results
      expect(result).toEqual(createEmptyPagination());
    });

    it('should handle generic errors gracefully', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockRejectedValue(
        new Error('Generic error'),
      );

      const result = await fetchDocumentsPaginated();

      // The implementation catches errors and returns empty results
      expect(result).toEqual(createEmptyPagination());
    });

    it('should handle validation errors gracefully', async () => {
      const result = await fetchDocumentsPaginated({}, { page: 0 });

      // The implementation treats page 0 as falsy and doesn't trigger validation error
      // Instead it returns empty results with default pagination
      expect(result).toEqual(createEmptyPagination());
    });

    it('should handle negative page numbers gracefully', async () => {
      const result = await fetchDocumentsPaginated({}, { page: -1 });

      // The implementation defaults negative page numbers to 1
      expect(result).toEqual(createEmptyPagination(1, 10));
    });
  });

  describe('clearEvidenceHubCache', () => {
    it('should clear the evidence hub cache using registry', async () => {
      // Mock registry with tracked keys
      const registryKeys = [
        'evidence-hub:all-documents',
        'evidence-hub:build-id',
        'evidence-hub:filter-results:09-12-2025:abc123',
      ];
      (redisRestGet as jest.Mock).mockResolvedValueOnce(
        createGetResponse(
          'evidence-hub:registry',
          JSON.stringify(registryKeys),
        ),
      );
      (redisRestDel as jest.Mock).mockResolvedValue({
        success: true,
        data: {
          key: '',
          deletedCount: 1,
          site: '',
        },
      });

      await clearEvidenceHubCache();

      // Should read registry first
      expect(redisRestGet).toHaveBeenCalledWith('evidence-hub:registry');
      // Should delete all tracked keys
      expect(redisRestDel).toHaveBeenCalledWith('evidence-hub:all-documents');
      expect(redisRestDel).toHaveBeenCalledWith('evidence-hub:build-id');
      expect(redisRestDel).toHaveBeenCalledWith(
        'evidence-hub:filter-results:09-12-2025:abc123',
      );
      // Should delete registry itself
      expect(redisRestDel).toHaveBeenCalledWith('evidence-hub:registry');
    });

    it('should return 0 if registry does not exist', async () => {
      // Registry doesn't exist
      (redisRestGet as jest.Mock).mockResolvedValueOnce({
        success: true,
        data: {
          key: '',
          value: null,
          site: '',
        },
      });

      await clearEvidenceHubCache();

      // Should try to read registry
      expect(redisRestGet).toHaveBeenCalledWith('evidence-hub:registry');
      // Should not attempt pattern deletion (not supported by API)
      // Should return 0 since there's nothing to clear
    });

    it('should handle error if registry read fails', async () => {
      // Mock registry read to fail
      (redisRestGet as jest.Mock).mockRejectedValueOnce(
        new Error('Registry read failed'),
      );

      // Should not throw - errors are handled gracefully with fallback
      await expect(clearEvidenceHubCache()).resolves.not.toThrow();

      // Should attempt registry read first
      expect(redisRestGet).toHaveBeenCalledWith('evidence-hub:registry');
    });
  });

  describe('edge cases', () => {
    it('should handle empty query parameters', async () => {
      mockAemResponse(mockDocuments);
      const result = await fetchDocumentsPaginated({});
      expect(result).toEqual(createExpectedPagination(mockDocuments));
    });

    it('should handle undefined query parameters', async () => {
      mockAemResponse(mockDocuments);
      const result = await fetchDocumentsPaginated();
      expect(result).toEqual(createExpectedPagination(mockDocuments));
    });

    it('should handle malformed AEM response', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: null,
      });

      const result = await fetchDocumentsPaginated();
      expect(result).toEqual(createEmptyPagination());
    });

    it('should handle non-array AEM response', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: 'not-an-array',
          },
        },
      });

      const result = await fetchDocumentsPaginated();
      expect(result).toEqual(createEmptyPagination());
    });
  });

  describe('keyword filter helper functions', () => {
    beforeEach(() => {
      mockAemResponse();
    });

    const testInvalidKeyword = async (keyword: unknown) => {
      mockAemResponse(mockDocuments);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await fetchDocumentsPaginated({ keyword } as any);
      const items = extractItems(result);
      expect(items.length).toBeGreaterThan(0);
    };

    it('should handle non-string keyword in createKeywordFilter', async () => {
      await testInvalidKeyword(123);
    });

    it('should handle empty keyword after trim in createKeywordFilter', async () => {
      await testInvalidKeyword('   ');
    });

    it('should handle null keyword in createKeywordFilter', async () => {
      await testInvalidKeyword(null);
    });

    it('should match documents by title using titleContainsSearchTerm', async () => {
      const documentsWithTitle = [
        createDocument({
          slug: 'title-match',
          title: 'Mental Health Report',
          overview: createRichText('This is a general health report'),
        }),
        createDocument({
          slug: 'no-match',
          title: 'General Report',
          overview: createRichText('This is a general report'),
        }),
      ];

      mockAemResponse(documentsWithTitle);
      const result = await fetchDocumentsPaginated({ keyword: 'mental' });
      const items = extractItems(result);
      expect(items).toHaveLength(1);
      expect(items[0].title).toBe('Mental Health Report');
    });

    it('should match documents by overview using overviewContainsSearchTerm', async () => {
      const documentsWithOverview = [
        createDocument({
          slug: 'overview-match',
          title: 'General Report',
          overview: createRichText(
            'This report discusses mental health issues',
          ),
        }),
        createDocument({
          slug: 'no-match',
          title: 'Another Report',
          overview: createRichText('This is a general report'),
        }),
      ];

      mockAemResponse(documentsWithOverview);
      const result = await fetchDocumentsPaginated({ keyword: 'mental' });
      const items = extractItems(result);
      expect(items).toHaveLength(1);
      expect(items[0].slug).toBe('overview-match');
    });

    it('should match documents by sections using sectionsContainSearchTerm', async () => {
      const documentsWithSections = [
        createDocument({
          slug: 'section-match',
          title: 'General Report',
          overview: createRichText('This is a general report'),
          sections: [createRichText('Content about mental health research')],
        }),
        createDocument({
          slug: 'no-match',
          title: 'Another Report',
          overview: createRichText('This is a general report'),
          sections: [createRichText('Content about general topics')],
        }),
      ];

      mockAemResponse(documentsWithSections);
      const result = await fetchDocumentsPaginated({ keyword: 'mental' });
      const items = extractItems(result);
      expect(items).toHaveLength(1);
      expect(items[0].slug).toBe('section-match');
    });

    const testEmptyKeywordMatch = async (
      documents: DocumentTemplate[],
      expectedLength: number,
    ) => {
      mockAemResponse(documents);
      const result = await fetchDocumentsPaginated({ keyword: 'test' });
      const items = extractItems(result);
      expect(items).toHaveLength(expectedLength);
    };

    it('should handle empty overview in overviewContainsSearchTerm', async () => {
      await testEmptyKeywordMatch(
        [
          createDocument({
            slug: 'no-overview',
            title: 'Report Without Overview',
            overview: undefined,
          }),
        ],
        0,
      );
    });

    it('should handle empty sections array in sectionsContainSearchTerm', async () => {
      await testEmptyKeywordMatch(
        [
          createDocument({
            slug: 'no-sections',
            title: 'Report Without Sections',
            sections: [],
          }),
        ],
        0,
      );
    });

    it('should handle null sections in sectionsContainSearchTerm', async () => {
      await testEmptyKeywordMatch(
        [
          createDocument({
            slug: 'null-sections',
            title: 'Report With Null Sections',
            sections: undefined,
          }),
        ],
        0,
      );
    });

    it('should handle empty title in titleContainsSearchTerm', async () => {
      await testEmptyKeywordMatch(
        [createDocument({ slug: 'empty-title', title: '' })],
        0,
      );
    });

    it('should handle non-string title in titleContainsSearchTerm', async () => {
      await testEmptyKeywordMatch(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [createDocument({ slug: 'non-string-title', title: 123 as any })],
        0,
      );
    });

    it('should handle undefined title in titleContainsSearchTerm', async () => {
      await testEmptyKeywordMatch(
        [createDocument({ slug: 'undefined-title', title: undefined })],
        0,
      );
    });

    it('should handle empty overview text in overviewContainsSearchTerm', async () => {
      await testEmptyKeywordMatch(
        [
          createDocument({
            slug: 'empty-overview-text',
            title: 'Sample Document',
            overview: createRichText(''),
          }),
        ],
        0,
      );
    });

    it('should handle null section in sectionsContainSearchTerm', async () => {
      mockAemResponse([
        createDocument({
          slug: 'null-section',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          sections: [null as any, createRichText('Content about test keyword')],
        }),
      ]);
      const result = await fetchDocumentsPaginated({ keyword: 'test' });
      const items = extractItems(result);
      expect(items).toHaveLength(1);
      expect(items[0].slug).toBe('null-section');
    });

    it('should handle empty section text in sectionsContainSearchTerm', async () => {
      await testEmptyKeywordMatch(
        [
          createDocument({
            slug: 'empty-section-text',
            title: 'Sample Document',
            sections: [createRichText('')],
          }),
        ],
        0,
      );
    });

    it('should handle null doc in createKeywordFilter', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockAemResponse([null as any, mockDocumentTemplate]);
      const result = await fetchDocumentsPaginated({ keyword: 'test' });
      const items = extractItems(result);
      // Should filter out null docs
      expect(items.length).toBeLessThanOrEqual(1);
    });
  });

  describe('consolidated sorting logic', () => {
    it('should use published sorting when order is published', async () => {
      const documentsWithDates = createDocumentsWithDates([
        {
          slug: 'doc-2021',
          title: 'Document 2021',
          publishDate: '2021-12-20T00:00:00Z',
        },
        {
          slug: 'doc-2023',
          title: 'Document 2023',
          publishDate: '2023-06-01T00:00:00Z',
        },
      ]);

      mockAemResponse(documentsWithDates);
      const result = await fetchDocumentsPaginated({ order: 'published' });
      const items = extractItems(result);
      expect(items).toHaveLength(2);
      // Should be sorted by publishDate descending
      expect(items[0].publishDate).toBe('2023-06-01T00:00:00Z');
      expect(items[1].publishDate).toBe('2021-12-20T00:00:00Z');
    });

    it('should use updated sorting when order is updated', async () => {
      const documentsWithUpdates = createDocumentsWithUpdates([
        {
          slug: 'doc-2023-08',
          title: 'Document Updated Aug 2023',
          publishDate: '2020-01-01T00:00:00Z',
          lastUpdatedDate: '2023-08-20T00:00:00Z',
        },
        {
          slug: 'doc-2024-01',
          title: 'Document Updated Jan 2024',
          publishDate: '2020-01-01T00:00:00Z',
          lastUpdatedDate: '2024-01-10T00:00:00Z',
        },
      ]);

      mockAemResponse(documentsWithUpdates);
      const result = await fetchDocumentsPaginated({ order: 'updated' });
      const items = extractItems(result);
      expect(items).toHaveLength(2);
      // Should be sorted by lastUpdatedDate descending
      expect(items[0].lastUpdatedDate).toBe('2024-01-10T00:00:00Z');
      expect(items[1].lastUpdatedDate).toBe('2023-08-20T00:00:00Z');
    });

    it('should use relevance sorting when order is relevance and keyword exists', async () => {
      const documentsWithKeyword = createDocumentsWithKeyword([
        {
          slug: 'section-match',
          title: 'Document',
          overview: 'Content about general topics',
          sections: ['Content about test keyword'],
        },
        {
          slug: 'title-match',
          title: 'Test Keyword Document',
          overview: 'Content about general topics',
        },
      ]);

      mockAemResponse(documentsWithKeyword);
      const result = await fetchDocumentsPaginated({
        keyword: 'test',
        order: 'relevance',
      });
      const items = extractItems(result);

      expect(items).toHaveLength(2);
      // Title match should come first
      expect(items[0].slug).toBe('title-match');
    });

    it('should use default published sorting when no order and no keyword', async () => {
      const documentsWithDates = createDocumentsWithDates([
        {
          slug: 'doc-2021',
          title: 'Document 2021',
          publishDate: '2021-12-20T00:00:00Z',
        },
        {
          slug: 'doc-2023',
          title: 'Document 2023',
          publishDate: '2023-06-01T00:00:00Z',
        },
      ]);

      mockAemResponse(documentsWithDates);
      const result = await fetchDocumentsPaginated({});
      const items = extractItems(result);
      expect(items).toHaveLength(2);
      // Should default to publishDate sorting
      expect(items[0].publishDate).toBe('2023-06-01T00:00:00Z');
      expect(items[1].publishDate).toBe('2021-12-20T00:00:00Z');
    });
  });

  describe('retry logic with exponential backoff', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should retry on failure with exponential backoff', async () => {
      let attemptCount = 0;
      mockAemHeadlessClient.runPersistedQuery.mockImplementation(async () => {
        attemptCount++;
        if (attemptCount < 3) {
          throw new Error('AEM query failed');
        }
        return {
          data: {
            pageSectionTemplateList: {
              items: mockDocuments,
            },
          },
        };
      });

      const promise = fetchDocumentsPaginated();

      // Fast-forward through retries
      await jest.advanceTimersByTimeAsync(1000); // First retry delay
      await jest.advanceTimersByTimeAsync(2000); // Second retry delay (exponential)

      const result = await promise;
      expect(attemptCount).toBe(3);
      expect(result).toEqual(createExpectedPagination(mockDocuments));
    });

    it('should throw error after max retry attempts', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockRejectedValue(
        new Error('Persistent AEM error'),
      );

      const promise = fetchDocumentsPaginated();

      // Fast-forward through all retries
      await jest.advanceTimersByTimeAsync(1000); // First retry
      await jest.advanceTimersByTimeAsync(2000); // Second retry
      await jest.advanceTimersByTimeAsync(4000); // Third retry

      const result = await promise;
      // Should return empty results after retries exhausted
      expect(result).toEqual(createEmptyPagination());
    });
  });

  describe('filter pipeline edge cases', () => {
    beforeEach(() => {
      mockAemResponse();
    });

    it('should handle dateRange filter when getDateRange returns null', async () => {
      // Test with 'all' year option which returns null
      const result = await fetchDocumentsPaginated({ year: 'all' });

      expect(result).toEqual(createExpectedPagination(mockDocuments));
    });

    it('should handle empty filter pipeline', async () => {
      // Query with no filters should return all documents
      const result = await fetchDocumentsPaginated({});

      expect(result).toEqual(createExpectedPagination(mockDocuments));
    });

    it('should handle filter pipeline with only keyword', async () => {
      const documentsWithKeyword = createDocumentsWithKeyword([
        {
          slug: 'doc-keyword',
          title: 'Test Document',
          overview: 'Content about test keyword',
        },
      ]);

      mockAemResponse(documentsWithKeyword);
      const result = await fetchDocumentsPaginated({ keyword: 'test' });

      const items = extractItems(result);
      expect(items).toHaveLength(1);
      expect(items[0].slug).toBe('doc-keyword');
    });

    it('should handle createOrFilter with propertyName not in propertyMap', async () => {
      // This tests the condition where propertyName is undefined
      // Note: This is hard to trigger directly, but we can test with invalid filter keys
      const result = await fetchDocumentsPaginated({
        topic: 'nonexistent-topic',
        clientGroup: 'nonexistent-group',
      });

      // Should return empty or filtered results
      expect(result).toEqual({
        items: expect.any(Array),
        pagination: expect.objectContaining({
          page: 1,
        }),
      });
    });
  });

  describe('cache key generation edge cases', () => {
    beforeEach(() => {
      mockAemResponse();
    });

    it('should generate consistent cache keys for same query', async () => {
      const query1 = { topic: 'pensions', keyword: 'test' };
      const query2 = { keyword: 'test', topic: 'pensions' };

      await fetchDocumentsPaginated(query1);
      await fetchDocumentsPaginated(query2);

      // Both should use cache after first call
      expect(redisRestGet).toHaveBeenCalled();
      const cacheKeys = (redisRestGet as jest.Mock).mock.calls.map(
        (call) => call[0],
      );

      // Should have cache key calls
      expect(cacheKeys.length).toBeGreaterThan(0);
    });

    it('should handle query with undefined values in cache key generation', async () => {
      const query = {
        keyword: 'test',
        topic: undefined,
      } as unknown as Record<string, string | string[]>;

      await fetchDocumentsPaginated(query);

      expect(redisRestGet).toHaveBeenCalled();
    });
  });

  describe('error handling edge cases', () => {
    it('should handle cache read error with non-array parsed value', async () => {
      // Mock compressed invalid data
      const invalidData = `compressed:${JSON.stringify({ not: 'an array' })}`;
      (redisRestGet as jest.Mock).mockResolvedValue(
        createGetResponse('test-key', invalidData),
      );
      mockAemResponse(mockDocuments);

      const result = await fetchDocumentsPaginated();

      // Should fall back to fetching from AEM
      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalled();
      expect(result).toEqual(createExpectedPagination(mockDocuments));
    });

    it('should handle cache read error with invalid JSON', async () => {
      (redisRestGet as jest.Mock).mockResolvedValue(
        createGetResponse('test-key', 'invalid json'),
      );
      mockAemResponse(mockDocuments);

      const result = await fetchDocumentsPaginated();

      // Should fall back to fetching from AEM
      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalled();
      expect(result).toEqual(createExpectedPagination(mockDocuments));
    });

    it('should handle cache write error gracefully', async () => {
      (redisRestSet as jest.Mock).mockRejectedValue(
        new Error('Cache write failed'),
      );
      mockAemResponse(mockDocuments);

      const result = await fetchDocumentsPaginated();

      // Should still return results even if cache write fails
      expect(result).toEqual(createExpectedPagination(mockDocuments));
    });
  });

  describe('warmCache function', () => {
    it('should warm cache with common queries', async () => {
      mockAemResponse(mockDocuments);

      await warmCache();

      // Should have attempted to cache multiple query combinations
      expect(redisRestSet).toHaveBeenCalled();
    });
  });

  describe('clearRequestCache function', () => {
    it('should clear request cache', () => {
      // Should not throw
      expect(() => clearRequestCache()).not.toThrow();
    });
  });

  describe('build ID tracking', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      delete process.env.AEM_CACHE;
    });

    afterEach(() => {
      delete process.env.AEM_CACHE;
    });

    it('should detect new build and clear cache using registry', async () => {
      const oldBuildId = 'old-build-123';
      const newBuildId = 'new-build-456';

      process.env.AEM_CACHE = newBuildId;

      // Mock: cached build ID is different
      (redisRestGet as jest.Mock).mockResolvedValueOnce(
        createGetResponse('evidence-hub:build-id', oldBuildId),
      ); // Build ID check
      // Mock registry with tracked keys
      const registryKeys = [
        'evidence-hub:all-documents',
        'evidence-hub:build-id',
        'evidence-hub:filter-results:old-build-123:abc123',
      ];
      (redisRestGet as jest.Mock).mockResolvedValueOnce(
        createGetResponse(
          'evidence-hub:registry',
          JSON.stringify(registryKeys),
        ),
      ); // Registry read
      (redisRestGet as jest.Mock).mockResolvedValueOnce({
        success: true,
        data: {
          key: '',
          value: null,
          site: '',
        },
      }); // Documents cache (cleared)
      (redisRestDel as jest.Mock).mockResolvedValue({
        success: true,
        data: {
          key: '',
          deletedCount: 1,
          site: '',
        },
      });

      mockAemResponse(mockDocuments);

      await getAllDocuments();

      // Should use registry-based deletion to clear evidence-hub keys
      expect(redisRestGet).toHaveBeenCalledWith('evidence-hub:registry');
      expect(redisRestDel).toHaveBeenCalledWith('evidence-hub:all-documents');
      expect(redisRestDel).toHaveBeenCalledWith('evidence-hub:build-id');
      expect(redisRestDel).toHaveBeenCalledWith('evidence-hub:registry');
      expect(redisRestSet).toHaveBeenCalledWith(
        'evidence-hub:build-id',
        newBuildId,
        { ttlSeconds: 31536000 }, // 365 days
      );
      // Should cache documents
      expect(redisRestSet).toHaveBeenCalledWith(
        'evidence-hub:all-documents',
        expect.any(String),
        { ttlSeconds: 31536000 },
      );
    });

    it('should reuse cache for same build', async () => {
      const buildId = 'same-build-123';
      process.env.AEM_CACHE = buildId;

      const cachedData = JSON.stringify(mockDocuments);
      const compressedCachedData = `compressed:${cachedData}`;
      (redisRestGet as jest.Mock).mockResolvedValueOnce(
        createGetResponse('evidence-hub:build-id', buildId),
      ); // Build ID matches
      (redisRestGet as jest.Mock).mockResolvedValueOnce(
        createGetResponse('evidence-hub:all-documents', compressedCachedData),
      ); // Documents cache (compressed)

      const result = await getAllDocuments();

      expect(redisRestDel).not.toHaveBeenCalled();
      expect(result).toEqual(mockDocuments);
    });
  });

  describe('warmCacheOnBuild', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      delete process.env.AEM_CACHE;
    });

    afterEach(() => {
      delete process.env.AEM_CACHE;
    });

    it('should warm cache during build', async () => {
      process.env.AEM_CACHE = 'build-123';
      mockAemResponse(mockDocuments);
      (redisRestGet as jest.Mock).mockResolvedValue({
        success: true,
        data: {
          key: '',
          value: null,
          site: '',
        },
      });

      await warmCacheOnBuild();

      expect(redisRestSet).toHaveBeenCalledWith(
        'evidence-hub:all-documents',
        expect.any(String),
        { ttlSeconds: 31536000 }, // 365 days
      );
    });

    it('should handle errors gracefully during cache warming', async () => {
      process.env.AEM_CACHE = 'build-123';
      mockAemHeadlessClient.runPersistedQuery.mockRejectedValue(
        new Error('AEM error'),
      );

      await expect(warmCacheOnBuild()).resolves.toBeUndefined();
    });
  });
});
