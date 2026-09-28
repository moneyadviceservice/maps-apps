import { DocumentTemplate, TagListItem } from 'types/@adobe/page';

// Mock the aemHeadlessClient
export const mockAemHeadlessClient = {
  runPersistedQuery: jest.fn(),
};

// Common mock data
export const mockDocumentTemplate: DocumentTemplate = {
  seoTitle: 'Test SEO Title',
  seoDescription: 'Test SEO Description',
  title: 'Test Document Title',
  slug: 'test-document',
  publishDate: '2024-01-01T00:00:00Z',
  lastUpdatedDate: '2024-01-05T00:00:00Z',
  pageType: { key: 'report', name: 'Report' },
  dataTypes: [{ key: 'json', name: 'JSON' }],
  tags: [{ key: 'test', name: 'Test' }],
  breadcrumbs: [],
  sections: [],
  contactInformation: { json: [] },
  clientGroup: [{ key: 'adult', name: 'Adult' }],
  topic: [{ key: 'saving', name: 'Saving' }],
  countryOfDelivery: [{ key: 'uk', name: 'UK' }],
  links: [],
  overview: { json: [] },
};

export const mockTagListItem: TagListItem = {
  tagGroup: {
    label: 'Test Tag Group',
    slug: 'test-tag-group',
    key: 'test-tag-group',
    tags: [
      { key: 'tag1', name: 'Tag 1' },
      { key: 'tag2', name: 'Tag 2' },
      { key: 'tag3', name: 'Tag 3' },
    ],
  },
};

// Common test setup functions
export const setupTestMocks = () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error to avoid noise in test output
    jest.spyOn(console, 'error').mockImplementation(() => {
      // Mock implementation to suppress console.error in tests
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
};

// Common mock responses
export const createMockPageResponse = (data: DocumentTemplate) => ({
  data: {
    pageTemplateList: {
      items: [data],
    },
  },
});

export const createMockDocumentsResponse = (data: DocumentTemplate[]) => ({
  data: {
    documentListList: {
      items: data,
    },
  },
});

export const createMockTagsResponse = (data: TagListItem[]) => ({
  data: {
    tagListList: {
      items: data,
    },
  },
});

// Common error responses
export const createMockErrorResponse = (message = 'Test error') => ({
  data: null,
  errors: [
    {
      message,
      locations: [{ line: 1, column: 1 }],
      path: ['test'],
    },
  ],
});

// Common query mocks
export const mockPageQuery = {
  pageType: 'report',
  slug: 'test-document',
};

export const mockDocumentsQuery = {
  pageType: 'report',
  limit: 10,
  offset: 0,
};
