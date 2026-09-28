import {
  createMockPageResponse,
  mockAemHeadlessClient,
  mockDocumentTemplate,
  setupTestMocks,
} from './__mocks__/testMocks';
import { fetchPage } from './page';

// Mock the aemHeadlessClient
jest.mock('@maps-react/utils/aemHeadlessClient', () => ({
  aemHeadlessClient: mockAemHeadlessClient,
}));

describe('fetchPage', () => {
  setupTestMocks();

  describe('successful page fetching', () => {
    it('should return page data when page is found', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue(
        createMockPageResponse(mockDocumentTemplate),
      );

      const result = await fetchPage('en', 'test-document');

      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        'evidence-hub/get-page-en;slug=test-document',
      );
      expect(result).toEqual(mockDocumentTemplate);
    });

    it('should construct correct query name with different language and slug', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue(
        createMockPageResponse(mockDocumentTemplate),
      );

      await fetchPage('cy', 'welsh-document');

      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        'evidence-hub/get-page-cy;slug=welsh-document',
      );
    });

    it('should return the first page when multiple pages are returned', async () => {
      const secondPage = { ...mockDocumentTemplate, title: 'Second Page' };
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageTemplateList: {
            items: [mockDocumentTemplate, secondPage],
          },
        },
      });

      const result = await fetchPage('en', 'test-document');

      expect(result).toEqual(mockDocumentTemplate);
      expect(result).not.toEqual(secondPage);
    });
  });

  describe('error handling', () => {
    it('should return error object when no pages are found', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageTemplateList: {
            items: [],
          },
        },
      });

      const result = await fetchPage('en', 'non-existent-page');

      expect(result).toEqual({
        error: true,
      });
    });

    it('should return error object when pageTemplateList is undefined', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageTemplateList: undefined,
        },
      });

      const result = await fetchPage('en', 'test-document');

      expect(result).toEqual({
        error: true,
      });
    });

    it('should return error object when data is undefined', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: undefined,
      });

      const result = await fetchPage('en', 'test-document');

      expect(result).toEqual({
        error: true,
      });
    });

    it('should return error object when aemHeadlessClient throws an error', async () => {
      const error = new Error('Network error');
      mockAemHeadlessClient.runPersistedQuery.mockRejectedValue(error);

      const result = await fetchPage('en', 'test-document');

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

      const result = await fetchPage('en', 'test-document');

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
    it('should handle empty string language and slug', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageTemplateList: {
            items: [mockDocumentTemplate],
          },
        },
      });

      await fetchPage('', '');

      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        'evidence-hub/get-page-;slug=',
      );
    });

    it('should handle special characters in slug', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageTemplateList: {
            items: [mockDocumentTemplate],
          },
        },
      });

      await fetchPage('en', 'test-document-with-special-chars-123');

      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        'evidence-hub/get-page-en;slug=test-document-with-special-chars-123',
      );
    });

    it('should handle null/undefined language and slug parameters', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageTemplateList: {
            items: [mockDocumentTemplate],
          },
        },
      });

      // @ts-expect-error - Testing runtime behavior with invalid parameters
      await fetchPage(null, undefined);

      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        'evidence-hub/get-page-null;slug=undefined',
      );
    });
  });

  describe('query construction', () => {
    it('should construct query name correctly for different languages', async () => {
      const testCases = [
        { lang: 'en', expected: 'evidence-hub/get-page-en' },
        { lang: 'cy', expected: 'evidence-hub/get-page-cy' },
        { lang: 'fr', expected: 'evidence-hub/get-page-fr' },
        { lang: 'de', expected: 'evidence-hub/get-page-de' },
      ];

      for (const testCase of testCases) {
        mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
          data: {
            pageTemplateList: {
              items: [mockDocumentTemplate],
            },
          },
        });

        await fetchPage(testCase.lang, 'test-slug');

        expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
          `${testCase.expected};slug=test-slug`,
        );
      }
    });
  });
});
