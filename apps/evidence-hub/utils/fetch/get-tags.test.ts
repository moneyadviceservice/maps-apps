import {
  mockAemHeadlessClient,
  mockTagListItem,
  setupTestMocks,
} from './__mocks__/testMocks';
import { getTags } from './get-tags';

// Mock the aemHeadlessClient
jest.mock('@maps-react/utils/aemHeadlessClient', () => ({
  aemHeadlessClient: mockAemHeadlessClient,
}));

describe('getTags', () => {
  setupTestMocks();

  describe('successful tag fetching', () => {
    it('should return tag groups when tags are found', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          tagListList: {
            items: [mockTagListItem],
          },
        },
      });

      const result = await getTags('en');

      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        'evidence-hub/get-tag-filters-en',
      );
      expect(result).toEqual(mockTagListItem.tagGroup);
    });

    it('should return the first tag group when multiple tag groups are returned', async () => {
      const secondTagGroup = {
        ...mockTagListItem,
        tagGroup: {
          ...mockTagListItem.tagGroup,
          label: 'Second Tag Group',
        },
      };

      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          tagListList: {
            items: [mockTagListItem, secondTagGroup],
          },
        },
      });

      const result = await getTags('en');

      expect(result).toEqual(mockTagListItem.tagGroup);
      expect(result).not.toEqual(secondTagGroup.tagGroup);
    });

    it('should use hardcoded query name regardless of language parameter', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          tagListList: {
            items: [mockTagListItem],
          },
        },
      });

      await getTags('cy');
      await getTags('fr');
      await getTags('de');

      // All calls should use the same hardcoded query name
      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledTimes(3);
      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenNthCalledWith(
        1,
        'evidence-hub/get-tag-filters-en',
      );
      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenNthCalledWith(
        2,
        'evidence-hub/get-tag-filters-en',
      );
      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenNthCalledWith(
        3,
        'evidence-hub/get-tag-filters-en',
      );
    });
  });

  describe('error handling', () => {
    it('should return error object when no tags are found', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          tagListList: {
            items: [],
          },
        },
      });

      const result = await getTags('en');

      expect(result).toEqual({
        error: true,
      });
    });

    it('should return error object when tagListList is undefined', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          tagListList: undefined,
        },
      });

      const result = await getTags('en');

      expect(result).toEqual({
        error: true,
      });
    });

    it('should return error object when data is undefined', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: undefined,
      });

      const result = await getTags('en');

      expect(result).toEqual({
        error: true,
      });
    });

    it('should return error object when aemHeadlessClient throws an error', async () => {
      const error = new Error('Network error');
      mockAemHeadlessClient.runPersistedQuery.mockRejectedValue(error);

      const result = await getTags('en');

      expect(console.error).toHaveBeenCalledWith(
        'failed to fetch tags ',
        error,
      );
      expect(result).toEqual({
        error: true,
      });
    });

    it('should return error object when aemHeadlessClient throws a non-Error object', async () => {
      const error = 'String error';
      mockAemHeadlessClient.runPersistedQuery.mockRejectedValue(error);

      const result = await getTags('en');

      expect(console.error).toHaveBeenCalledWith(
        'failed to fetch tags ',
        error,
      );
      expect(result).toEqual({
        error: true,
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty string language parameter', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          tagListList: {
            items: [mockTagListItem],
          },
        },
      });

      await getTags('');

      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        'evidence-hub/get-tag-filters-en',
      );
    });

    it('should handle null/undefined language parameter', async () => {
      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          tagListList: {
            items: [mockTagListItem],
          },
        },
      });

      // @ts-expect-error - Testing runtime behavior with invalid parameters
      await getTags(null);
      // @ts-expect-error - Testing runtime behavior with invalid parameters
      await getTags(undefined);

      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledTimes(2);
      expect(mockAemHeadlessClient.runPersistedQuery).toHaveBeenCalledWith(
        'evidence-hub/get-tag-filters-en',
      );
    });

    it('should handle tag group with empty tags array', async () => {
      const emptyTagGroup = {
        ...mockTagListItem,
        tagGroup: {
          ...mockTagListItem.tagGroup,
          tags: [],
        },
      };

      mockAemHeadlessClient.runPersistedQuery.mockResolvedValue({
        data: {
          tagListList: {
            items: [emptyTagGroup],
          },
        },
      });

      const result = await getTags('en');

      expect(result).toEqual(emptyTagGroup.tagGroup);
    });
  });
});
