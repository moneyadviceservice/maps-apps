import {
  mockAemHeadlessClient,
  mockDocumentTemplate,
  mockPageQuery,
  setupTestMocks,
} from './__mocks__/testMocks';
import { fetchDocument } from './document';

// Mock the aemHeadlessClient
jest.mock('@maps-react/utils/aemHeadlessClient', () => ({
  aemHeadlessClient: mockAemHeadlessClient,
}));

describe('fetchDocument', () => {
  setupTestMocks();

  describe('successful document fetching', () => {
    it('should return document data when document is found', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: [mockDocumentTemplate],
          },
        },
      });

      const result = await fetchDocument('en', mockPageQuery);

      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        'evidence-hub/get-document-en',
        mockPageQuery,
      );
      expect(result).toEqual(mockDocumentTemplate);
    });

    it('should construct correct query name with different language', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: [mockDocumentTemplate],
          },
        },
      });

      await fetchDocument('cy', mockPageQuery);

      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        'evidence-hub/get-document-cy',
        mockPageQuery,
      );
    });

    it('should pass query parameters correctly', async () => {
      const customQuery = {
        pageType: 'evaluation',
        slug: 'custom-document',
      };

      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: [mockDocumentTemplate],
          },
        },
      });

      await fetchDocument('en', customQuery);

      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        'evidence-hub/get-document-en',
        customQuery,
      );
    });

    it('should return the first document when multiple documents are returned', async () => {
      const secondDocument = {
        ...mockDocumentTemplate,
        title: 'Second Document',
      };
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: [mockDocumentTemplate, secondDocument],
          },
        },
      });

      const result = await fetchDocument('en', mockPageQuery);

      expect(result).toEqual(mockDocumentTemplate);
      expect(result).not.toEqual(secondDocument);
    });
  });

  describe('error handling', () => {
    it('should return error object when no documents are found', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: [],
          },
        },
      });

      const result = await fetchDocument('en', mockPageQuery);

      expect(result).toEqual({
        error: true,
      });
    });

    it('should return error object when pageSectionTemplateList is undefined', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: undefined,
        },
      });

      const result = await fetchDocument('en', mockPageQuery);

      expect(result).toEqual({
        error: true,
      });
    });

    it('should return error object when data is undefined', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: undefined,
      });

      const result = await fetchDocument('en', mockPageQuery);

      expect(result).toEqual({
        error: true,
      });
    });

    it('should return error object when aemHeadlessClient throws an error', async () => {
      const error = new Error('Network error');
      mockAemHeadlessClient.runPersistedQuery.mockRejectedValue(error);

      const result = await fetchDocument('en', mockPageQuery);

      expect(console.error).toHaveBeenCalledWith(
        'failed to fetch page ',
        error,
      );
      expect(result).toEqual({
        error: true,
      });
    });

    it('should return error object when aemHeadlessClient throws a non-Error object', async () => {
      const error = 'String error';
      mockAemHeadlessClient.runPersistedQuery.mockRejectedValue(error);

      const result = await fetchDocument('en', mockPageQuery);

      expect(console.error).toHaveBeenCalledWith(
        'failed to fetch page ',
        error,
      );
      expect(result).toEqual({
        error: true,
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty string language and query parameters', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: [mockDocumentTemplate],
          },
        },
      });

      const emptyQuery = { pageType: '', slug: '' };
      await fetchDocument('', emptyQuery);

      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        'evidence-hub/get-document-',
        emptyQuery,
      );
    });

    it('should handle special characters in query parameters', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: [mockDocumentTemplate],
          },
        },
      });

      const specialQuery = {
        pageType: 'evaluation-report',
        slug: 'test-document-with-special-chars-123',
      };

      await fetchDocument('en', specialQuery);

      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        'evidence-hub/get-document-en',
        specialQuery,
      );
    });

    it('should handle null/undefined language parameter', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: [mockDocumentTemplate],
          },
        },
      });

      // @ts-expect-error - Testing runtime behavior with invalid parameters
      await fetchDocument(null, mockPageQuery);
      // @ts-expect-error - Testing runtime behavior with invalid parameters
      await fetchDocument(undefined, mockPageQuery);

      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledTimes(2);
      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenNthCalledWith(
        1,
        'evidence-hub/get-document-null',
        mockPageQuery,
      );
      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenNthCalledWith(
        2,
        'evidence-hub/get-document-undefined',
        mockPageQuery,
      );
    });

    it('should handle query with missing properties', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: [mockDocumentTemplate],
          },
        },
      });

      const incompleteQuery = { pageType: 'report' } as unknown as {
        pageType: string;
        slug: string;
      };
      await fetchDocument('en', incompleteQuery);

      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        'evidence-hub/get-document-en',
        incompleteQuery,
      );
    });
  });

  describe('query construction', () => {
    it('should construct query name correctly for different languages', async () => {
      const testCases = [
        { lang: 'en', expected: 'evidence-hub/get-document-en' },
        { lang: 'cy', expected: 'evidence-hub/get-document-cy' },
        { lang: 'fr', expected: 'evidence-hub/get-document-fr' },
        { lang: 'de', expected: 'evidence-hub/get-document-de' },
      ];

      for (const testCase of testCases) {
        mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
          data: {
            pageSectionTemplateList: {
              items: [mockDocumentTemplate],
            },
          },
        });

        await fetchDocument(testCase.lang, mockPageQuery);

        expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
          testCase.expected,
          mockPageQuery,
        );
      }
    });
  });
});
