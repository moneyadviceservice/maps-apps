import {
  paginateItems,
  generatePageRange,
  validatePaginationParams,
} from './paginationUtils';

describe('paginationUtils', () => {
  describe('paginateItems', () => {
    const testItems = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
    }));

    describe('basic functionality', () => {
      it('should paginate items with default parameters', () => {
        const result = paginateItems(testItems);

        expect(result.items).toHaveLength(10);
        expect(result.items[0]).toEqual({ id: 1, name: 'Item 1' });
        expect(result.items[9]).toEqual({ id: 10, name: 'Item 10' });
        expect(result.pagination).toEqual({
          currentPage: 1,
          totalPages: 3,
          totalItems: 25,
          itemsPerPage: 10,
          hasNextPage: true,
          hasPreviousPage: false,
          startIndex: 1,
          endIndex: 10,
        });
      });

      it('should paginate items with custom page and limit', () => {
        const result = paginateItems(testItems, { page: 2, limit: 5 });

        expect(result.items).toHaveLength(5);
        expect(result.items[0]).toEqual({ id: 6, name: 'Item 6' });
        expect(result.items[4]).toEqual({ id: 10, name: 'Item 10' });
        expect(result.pagination).toEqual({
          currentPage: 2,
          totalPages: 5,
          totalItems: 25,
          itemsPerPage: 5,
          hasNextPage: true,
          hasPreviousPage: true,
          startIndex: 6,
          endIndex: 10,
        });
      });
    });

    describe('edge cases', () => {
      it('should handle empty array', () => {
        const result = paginateItems([]);

        expect(result.items).toHaveLength(0);
        expect(result.pagination).toEqual({
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: false,
          startIndex: 1,
          endIndex: 0,
        });
      });

      it('should handle single item array', () => {
        const singleItem = [{ id: 1, name: 'Single Item' }];
        const result = paginateItems(singleItem);

        expect(result.items).toHaveLength(1);
        expect(result.items[0]).toEqual({ id: 1, name: 'Single Item' });
        expect(result.pagination).toEqual({
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: false,
          startIndex: 1,
          endIndex: 1,
        });
      });

      it('should handle page number greater than total pages', () => {
        const result = paginateItems(testItems, { page: 10, limit: 10 });

        expect(result.items).toHaveLength(0);
        expect(result.pagination).toEqual({
          currentPage: 10,
          totalPages: 3,
          totalItems: 25,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: true,
          startIndex: 91,
          endIndex: 25,
        });
      });

      it('should handle large limit that exceeds total items', () => {
        const result = paginateItems(testItems, { page: 1, limit: 100 });

        expect(result.items).toHaveLength(25);
        expect(result.pagination).toEqual({
          currentPage: 1,
          totalPages: 1,
          totalItems: 25,
          itemsPerPage: 100,
          hasNextPage: false,
          hasPreviousPage: false,
          startIndex: 1,
          endIndex: 25,
        });
      });
    });

    describe('input validation', () => {
      it('should handle invalid page numbers by defaulting to 1', () => {
        const negativeResult = paginateItems(testItems, {
          page: -5,
          limit: 10,
        });
        const zeroResult = paginateItems(testItems, { page: 0, limit: 10 });

        expect(negativeResult.pagination.currentPage).toBe(1);
        expect(zeroResult.pagination.currentPage).toBe(1);
        expect(negativeResult.items).toHaveLength(10);
        expect(zeroResult.items).toHaveLength(10);
      });

      it('should handle invalid limit values by defaulting to 1', () => {
        const negativeResult = paginateItems(testItems, { page: 1, limit: -5 });
        const zeroResult = paginateItems(testItems, { page: 1, limit: 0 });

        expect(negativeResult.pagination.itemsPerPage).toBe(1);
        expect(zeroResult.pagination.itemsPerPage).toBe(1);
        expect(negativeResult.items).toHaveLength(1);
        expect(zeroResult.items).toHaveLength(1);
      });

      it('should handle decimal values by flooring them', () => {
        const result = paginateItems(testItems, { page: 2.7, limit: 5.9 });

        expect(result.pagination.currentPage).toBe(2);
        expect(result.pagination.itemsPerPage).toBe(5);
      });
    });

    describe('pagination boundaries', () => {
      it('should handle last page correctly', () => {
        const result = paginateItems(testItems, { page: 3, limit: 10 });

        expect(result.items).toHaveLength(5);
        expect(result.items[0]).toEqual({ id: 21, name: 'Item 21' });
        expect(result.items[4]).toEqual({ id: 25, name: 'Item 25' });
        expect(result.pagination).toEqual({
          currentPage: 3,
          totalPages: 3,
          totalItems: 25,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: true,
          startIndex: 21,
          endIndex: 25,
        });
      });
    });
  });

  describe('generatePageRange', () => {
    describe('when total pages <= maxVisible', () => {
      it('should return all pages regardless of current page', () => {
        expect(generatePageRange(1, 3, 5)).toEqual([1, 2, 3]);
        expect(generatePageRange(2, 3, 5)).toEqual([1, 2, 3]);
        expect(generatePageRange(3, 3, 5)).toEqual([1, 2, 3]);
        expect(generatePageRange(1, 5, 5)).toEqual([1, 2, 3, 4, 5]);
        expect(generatePageRange(5, 5, 5)).toEqual([1, 2, 3, 4, 5]);
      });
    });

    describe('when total pages > maxVisible', () => {
      it('should center range around current page when possible', () => {
        expect(generatePageRange(5, 10, 5)).toEqual([3, 4, 5, 6, 7]);
        expect(generatePageRange(6, 10, 5)).toEqual([4, 5, 6, 7, 8]);
      });

      it('should start from 1 when current page is near beginning', () => {
        expect(generatePageRange(1, 10, 5)).toEqual([1, 2, 3, 4, 5]);
        expect(generatePageRange(2, 10, 5)).toEqual([1, 2, 3, 4, 5]);
        expect(generatePageRange(3, 10, 5)).toEqual([1, 2, 3, 4, 5]);
      });

      it('should end at total pages when current page is near end', () => {
        expect(generatePageRange(8, 10, 5)).toEqual([6, 7, 8, 9, 10]);
        expect(generatePageRange(9, 10, 5)).toEqual([6, 7, 8, 9, 10]);
        expect(generatePageRange(10, 10, 5)).toEqual([6, 7, 8, 9, 10]);
      });
    });

    describe('edge cases', () => {
      it('should handle zero or one total pages', () => {
        expect(generatePageRange(1, 0, 5)).toEqual([]);
        expect(generatePageRange(1, 1, 5)).toEqual([1]);
      });

      it('should handle invalid current page values', () => {
        expect(generatePageRange(-1, 10, 5)).toEqual([1, 2, 3, 4, 5]);
        expect(generatePageRange(0, 10, 5)).toEqual([1, 2, 3, 4, 5]);
        expect(generatePageRange(15, 10, 5)).toEqual([6, 7, 8, 9, 10]);
      });
    });

    describe('custom maxVisible values', () => {
      it('should use default maxVisible of 5', () => {
        expect(generatePageRange(1, 10)).toEqual([1, 2, 3, 4, 5]);
        expect(generatePageRange(5, 10)).toEqual([3, 4, 5, 6, 7]);
        expect(generatePageRange(10, 10)).toEqual([6, 7, 8, 9, 10]);
      });

      it('should handle various maxVisible values', () => {
        expect(generatePageRange(5, 20, 3)).toEqual([4, 5, 6]);
        expect(generatePageRange(5, 20, 7)).toEqual([2, 3, 4, 5, 6, 7, 8]);
        expect(generatePageRange(5, 10, 4)).toEqual([3, 4, 5, 6]);
        expect(generatePageRange(5, 10, 6)).toEqual([2, 3, 4, 5, 6, 7]);
        expect(generatePageRange(5, 10, 20)).toEqual([
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        ]);
      });
    });
  });

  describe('validatePaginationParams', () => {
    describe('default values', () => {
      it('should return default values for empty or undefined params', () => {
        expect(validatePaginationParams({})).toEqual({ page: 1, limit: 10 });
        expect(
          validatePaginationParams({ page: undefined, limit: undefined }),
        ).toEqual({ page: 1, limit: 10 });
        expect(
          validatePaginationParams({ page: null as any, limit: null as any }),
        ).toEqual({ page: 1, limit: 10 });
      });
    });

    describe('valid inputs', () => {
      it('should return valid page and limit values', () => {
        expect(validatePaginationParams({ page: 5, limit: 20 })).toEqual({
          page: 5,
          limit: 20,
        });
        expect(validatePaginationParams({ page: 999999, limit: 10 })).toEqual({
          page: 999999,
          limit: 10,
        });
        expect(
          validatePaginationParams({ page: '5' as any, limit: '20' as any }),
        ).toEqual({ page: 5, limit: 20 });
      });
    });

    describe('invalid page values', () => {
      it('should default invalid page values to 1', () => {
        expect(validatePaginationParams({ page: -5, limit: 10 })).toEqual({
          page: 1,
          limit: 10,
        });
        expect(validatePaginationParams({ page: 0, limit: 10 })).toEqual({
          page: 1,
          limit: 10,
        });
        expect(validatePaginationParams({ page: -2, limit: 50 })).toEqual({
          page: 1,
          limit: 50,
        });
      });
    });

    describe('invalid limit values', () => {
      it('should handle invalid limit values appropriately', () => {
        expect(validatePaginationParams({ page: 1, limit: -5 })).toEqual({
          page: 1,
          limit: 1,
        });
        expect(validatePaginationParams({ page: 1, limit: 0 })).toEqual({
          page: 1,
          limit: 10,
        });
        expect(validatePaginationParams({ page: 1, limit: 150 })).toEqual({
          page: 1,
          limit: 100,
        });
        expect(validatePaginationParams({ page: 1, limit: 999999 })).toEqual({
          page: 1,
          limit: 100,
        });
      });
    });

    describe('type conversion', () => {
      it('should handle decimal values by flooring them', () => {
        expect(validatePaginationParams({ page: 5.7, limit: 20.9 })).toEqual({
          page: 5,
          limit: 20,
        });
      });
    });
  });

  describe('integration tests', () => {
    it('should work correctly with validatePaginationParams and paginateItems', () => {
      const testItems = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
      }));
      const rawParams = { page: 3, limit: 15 };

      const validatedParams = validatePaginationParams(rawParams);
      const result = paginateItems(testItems, validatedParams);

      expect(result.pagination.currentPage).toBe(3);
      expect(result.pagination.itemsPerPage).toBe(15);
      expect(result.pagination.totalPages).toBe(4);
      expect(result.items).toHaveLength(15);
      expect(result.items[0]).toEqual({ id: 31, name: 'Item 31' });
    });

    it('should work correctly with generatePageRange and paginateItems', () => {
      const testItems = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
      }));
      const result = paginateItems(testItems, { page: 5, limit: 10 });
      const pageRange = generatePageRange(
        result.pagination.currentPage,
        result.pagination.totalPages,
        5,
      );

      expect(pageRange).toEqual([3, 4, 5, 6, 7]);
      expect(result.pagination.currentPage).toBe(5);
      expect(result.pagination.totalPages).toBe(10);
    });
  });
});
