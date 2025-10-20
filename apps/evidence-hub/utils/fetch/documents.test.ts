import { buildFilterObject } from '../filter';
import {
  mockAemHeadlessClient,
  mockDocumentTemplate,
  setupTestMocks,
} from './__mocks__/testMocks';
import { fetchDocuments } from './documents';

// Mock the aemHeadlessClient
jest.mock('@maps-react/utils/aemHeadlessClient', () => ({
  aemHeadlessClient: mockAemHeadlessClient,
}));

// Mock the buildFilterObject function
jest.mock('../filter', () => ({
  buildFilterObject: jest.fn(),
}));

const mockBuildFilterObject = buildFilterObject as jest.MockedFunction<
  typeof buildFilterObject
>;

describe('fetchDocuments', () => {
  const mockDocuments = [mockDocumentTemplate];

  setupTestMocks();

  describe('successful documents fetching', () => {
    it('should return documents when found', async () => {
      const mockFilterObject = {
        searchKeywords: {
          _expressions: { value: 'test', _operator: 'CONTAINS' },
        },
      };
      mockBuildFilterObject.mockReturnValue(mockFilterObject);
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: mockDocuments,
          },
        },
      });

      const query = { keyword: 'test' };
      const result = await fetchDocuments(query);

      expect(mockBuildFilterObject).toHaveBeenCalledWith(query);
      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        `evidence-hub/filter;filter=${encodeURIComponent(
          JSON.stringify(mockFilterObject),
        )}`,
      );
      expect(result).toEqual(mockDocuments);
    });

    it('should return documents with empty query object', async () => {
      const mockFilterObject = {};
      mockBuildFilterObject.mockReturnValue(mockFilterObject);
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: mockDocuments,
          },
        },
      });

      const result = await fetchDocuments();

      expect(mockBuildFilterObject).toHaveBeenCalledWith({});
      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        `evidence-hub/filter;filter=${encodeURIComponent(
          JSON.stringify(mockFilterObject),
        )}`,
      );
      expect(result).toEqual(mockDocuments);
    });

    it('should return empty array when no documents are found', async () => {
      const mockFilterObject = {};
      mockBuildFilterObject.mockReturnValue(mockFilterObject);
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: [],
          },
        },
      });

      const result = await fetchDocuments();

      expect(result).toEqual([]);
    });

    it('should handle complex filter objects correctly', async () => {
      const complexFilterObject = {
        searchKeywords: {
          _expressions: { value: 'financial education', _operator: 'CONTAINS' },
        },
        publishDate: {
          _logOp: 'AND',
          _expressions: [
            { value: '2022-01-01', _operator: 'AT_OR_AFTER' },
            { value: '2024-01-01', _operator: 'AT_OR_BEFORE' },
          ],
        },
        pageType: {
          key: {
            _logOp: 'OR',
            _expressions: [
              { value: 'evaluation', _operator: 'EQUALS' },
              { value: 'review', _operator: 'EQUALS' },
            ],
          },
        },
      };

      mockBuildFilterObject.mockReturnValue(complexFilterObject);
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: mockDocuments,
          },
        },
      });

      const query = {
        keyword: 'financial education',
        year: 'last-2',
        'evidence type': 'evaluation,review',
      };

      const result = await fetchDocuments(query);

      expect(mockBuildFilterObject).toHaveBeenCalledWith(query);
      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        `evidence-hub/filter;filter=${encodeURIComponent(
          JSON.stringify(complexFilterObject),
        )}`,
      );
      expect(result).toEqual(mockDocuments);
    });
  });

  describe('error handling', () => {
    it('should return error object when pageSectionTemplateList is undefined', async () => {
      const mockFilterObject = {};
      mockBuildFilterObject.mockReturnValue(mockFilterObject);
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: undefined,
        },
      });

      const result = await fetchDocuments();

      expect(result).toEqual({
        error: true,
      });
    });

    it('should return error object when data is undefined', async () => {
      const mockFilterObject = {};
      mockBuildFilterObject.mockReturnValue(mockFilterObject);
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: undefined,
      });

      const result = await fetchDocuments();

      expect(result).toEqual({
        error: true,
      });
    });

    it('should return error object when aemHeadlessClient throws an error', async () => {
      const mockFilterObject = {};
      mockBuildFilterObject.mockReturnValue(mockFilterObject);
      const error = new Error('Network error');
      mockAemHeadlessClient.runPersistedQuery.mockRejectedValue(error);

      const result = await fetchDocuments();

      expect(console.error).toHaveBeenCalledWith(
        'failed to fetch fetchDocuments ',
        error,
      );
      expect(result).toEqual({
        error: true,
      });
    });

    it('should return error object when aemHeadlessClient throws a non-Error object', async () => {
      const mockFilterObject = {};
      mockBuildFilterObject.mockReturnValue(mockFilterObject);
      const error = 'String error';
      mockAemHeadlessClient.runPersistedQuery.mockRejectedValue(error);

      const result = await fetchDocuments();

      expect(console.error).toHaveBeenCalledWith(
        'failed to fetch fetchDocuments ',
        error,
      );
      expect(result).toEqual({
        error: true,
      });
    });

    it('should return error object when buildFilterObject throws an error', async () => {
      const error = new Error('Filter building error');
      mockBuildFilterObject.mockImplementation(() => {
        throw error;
      });

      const result = await fetchDocuments({ keyword: 'test' });

      expect(result).toEqual({
        error: true,
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty query object', async () => {
      const mockFilterObject = {};
      mockBuildFilterObject.mockReturnValue(mockFilterObject);
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: mockDocuments,
          },
        },
      });

      const result = await fetchDocuments({});

      expect(mockBuildFilterObject).toHaveBeenCalledWith({});
      expect(result).toEqual(mockDocuments);
    });

    it('should handle query with undefined values', async () => {
      const mockFilterObject = {};
      mockBuildFilterObject.mockReturnValue(mockFilterObject);
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: mockDocuments,
          },
        },
      });

      const query = {
        keyword: undefined,
        year: undefined,
        'evidence type': undefined,
      };

      const result = await fetchDocuments(query);

      expect(mockBuildFilterObject).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockDocuments);
    });

    it('should handle query with mixed data types', async () => {
      const mockFilterObject = {};
      mockBuildFilterObject.mockReturnValue(mockFilterObject);
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: mockDocuments,
          },
        },
      });

      const query = {
        keyword: 'test',
        'topics[]': ['saving', 'debt'],
        year: 'last-2',
        'client group': 'adult',
      };

      const result = await fetchDocuments(query);

      expect(mockBuildFilterObject).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockDocuments);
    });

    it('should handle special characters in query parameters', async () => {
      const mockFilterObject = {};
      mockBuildFilterObject.mockReturnValue(mockFilterObject);
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: mockDocuments,
          },
        },
      });

      const query = {
        keyword: 'test with special chars: @#$%^&*()',
        'evidence type': 'evaluation-report',
      };

      const result = await fetchDocuments(query);

      expect(mockBuildFilterObject).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockDocuments);
    });
  });

  describe('filter object encoding', () => {
    it('should properly encode filter object in query name', async () => {
      const mockFilterObject = {
        searchKeywords: {
          _expressions: { value: 'test search', _operator: 'CONTAINS' },
        },
        pageType: {
          key: {
            _logOp: 'OR',
            _expressions: [{ value: 'report', _operator: 'EQUALS' }],
          },
        },
      };

      mockBuildFilterObject.mockReturnValue(mockFilterObject);
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: mockDocuments,
          },
        },
      });

      await fetchDocuments({
        keyword: 'test search',
        'evidence type': 'report',
      });

      const expectedEncodedFilter = encodeURIComponent(
        JSON.stringify(mockFilterObject),
      );
      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        `evidence-hub/filter;filter=${expectedEncodedFilter}`,
      );
    });

    it('should handle empty filter object', async () => {
      const mockFilterObject = {};
      mockBuildFilterObject.mockReturnValue(mockFilterObject);
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          pageSectionTemplateList: {
            items: mockDocuments,
          },
        },
      });

      await fetchDocuments();

      const expectedEncodedFilter = encodeURIComponent(
        JSON.stringify(mockFilterObject),
      );
      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        `evidence-hub/filter;filter=${expectedEncodedFilter}`,
      );
    });
  });
});
