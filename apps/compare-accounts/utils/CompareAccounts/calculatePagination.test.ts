import calculatePagination from './calculatePagination';

describe('calculatePagination', () => {
  it('should calculate pagination for first page with default page size', () => {
    const result = calculatePagination({
      page: 1,
      totalItems: 25,
    });

    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
    expect(result.totalItems).toBe(25);
    expect(result.totalPages).toBe(3);
    expect(result.startIndex).toBe(0);
    expect(result.endIndex).toBe(10);
    expect(result.nextPage).toBe(2);
    expect(result.previousPage).toBe(0);
    expect(result.previousEnabled).toBe(false);
    expect(result.nextEnabled).toBe(true);
  });

  it('should calculate pagination for middle page', () => {
    const result = calculatePagination({
      page: 2,
      pageSize: 5,
      totalItems: 25,
    });

    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(5);
    expect(result.totalItems).toBe(25);
    expect(result.totalPages).toBe(5);
    expect(result.startIndex).toBe(5);
    expect(result.endIndex).toBe(10);
    expect(result.nextPage).toBe(3);
    expect(result.previousPage).toBe(1);
    expect(result.previousEnabled).toBe(true);
    expect(result.nextEnabled).toBe(true);
  });

  it('should calculate pagination for last page', () => {
    const result = calculatePagination({
      page: 3,
      pageSize: 10,
      totalItems: 25,
    });

    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(10);
    expect(result.totalItems).toBe(25);
    expect(result.totalPages).toBe(3);
    expect(result.startIndex).toBe(20);
    expect(result.endIndex).toBe(30);
    expect(result.nextPage).toBe(4);
    expect(result.previousPage).toBe(2);
    expect(result.previousEnabled).toBe(true);
    expect(result.nextEnabled).toBe(false);
  });

  it('should handle exact division of total items by page size', () => {
    const result = calculatePagination({
      page: 2,
      pageSize: 10,
      totalItems: 20,
    });

    expect(result.totalPages).toBe(2);
    expect(result.startIndex).toBe(10);
    expect(result.endIndex).toBe(20);
    expect(result.nextEnabled).toBe(false);
  });

  it('should handle single page scenario', () => {
    const result = calculatePagination({
      page: 1,
      pageSize: 10,
      totalItems: 5,
    });

    expect(result.totalPages).toBe(1);
    expect(result.startIndex).toBe(0);
    expect(result.endIndex).toBe(10);
    expect(result.previousEnabled).toBe(false);
    expect(result.nextEnabled).toBe(false);
  });

  it('should handle zero total items', () => {
    const result = calculatePagination({
      page: 1,
      pageSize: 10,
      totalItems: 0,
    });

    expect(result.totalPages).toBe(0);
    expect(result.startIndex).toBe(0);
    expect(result.endIndex).toBe(10);
    expect(result.previousEnabled).toBe(false);
    expect(result.nextEnabled).toBe(false);
  });

  it('should use default page size when not provided', () => {
    const result = calculatePagination({
      page: 1,
      totalItems: 100,
    });

    expect(result.pageSize).toBe(10);
    expect(result.totalPages).toBe(10);
  });

  it('should handle large page sizes', () => {
    const result = calculatePagination({
      page: 1,
      pageSize: 100,
      totalItems: 150,
    });

    expect(result.totalPages).toBe(2);
    expect(result.startIndex).toBe(0);
    expect(result.endIndex).toBe(100);
    expect(result.nextEnabled).toBe(true);
  });

  it('should handle small page sizes', () => {
    const result = calculatePagination({
      page: 3,
      pageSize: 1,
      totalItems: 5,
    });

    expect(result.totalPages).toBe(5);
    expect(result.startIndex).toBe(2);
    expect(result.endIndex).toBe(3);
    expect(result.previousEnabled).toBe(true);
    expect(result.nextEnabled).toBe(true);
  });

  it('should calculate correct indices for different page combinations', () => {
    // Page 1 of 3 items with page size 2
    const result1 = calculatePagination({
      page: 1,
      pageSize: 2,
      totalItems: 3,
    });
    expect(result1.startIndex).toBe(0);
    expect(result1.endIndex).toBe(2);

    // Page 2 of 3 items with page size 2
    const result2 = calculatePagination({
      page: 2,
      pageSize: 2,
      totalItems: 3,
    });
    expect(result2.startIndex).toBe(2);
    expect(result2.endIndex).toBe(4);
  });

  it('should handle edge case with page size 0', () => {
    const result = calculatePagination({
      page: 1,
      pageSize: 0,
      totalItems: 10,
    });

    // When pageSize is 0, it should default to 10
    expect(result.pageSize).toBe(10);
    expect(result.totalPages).toBe(1);
  });

  it('should calculate next and previous page numbers correctly', () => {
    const result = calculatePagination({
      page: 5,
      pageSize: 3,
      totalItems: 20,
    });

    expect(result.nextPage).toBe(6);
    expect(result.previousPage).toBe(4);
    expect(result.totalPages).toBe(7);
  });

  it('should handle fractional total pages correctly', () => {
    const result = calculatePagination({
      page: 3,
      pageSize: 5,
      totalItems: 13,
    });

    expect(result.totalPages).toBe(3);
    expect(result.startIndex).toBe(10);
    expect(result.endIndex).toBe(15);
    expect(result.nextEnabled).toBe(false);
  });

  it('should return consistent structure for all scenarios', () => {
    const result = calculatePagination({
      page: 2,
      pageSize: 7,
      totalItems: 50,
    });

    expect(result).toHaveProperty('page');
    expect(result).toHaveProperty('pageSize');
    expect(result).toHaveProperty('totalItems');
    expect(result).toHaveProperty('totalPages');
    expect(result).toHaveProperty('startIndex');
    expect(result).toHaveProperty('endIndex');
    expect(result).toHaveProperty('nextPage');
    expect(result).toHaveProperty('previousPage');
    expect(result).toHaveProperty('previousEnabled');
    expect(result).toHaveProperty('nextEnabled');

    expect(typeof result.page).toBe('number');
    expect(typeof result.pageSize).toBe('number');
    expect(typeof result.totalItems).toBe('number');
    expect(typeof result.totalPages).toBe('number');
    expect(typeof result.startIndex).toBe('number');
    expect(typeof result.endIndex).toBe('number');
    expect(typeof result.nextPage).toBe('number');
    expect(typeof result.previousPage).toBe('number');
    expect(typeof result.previousEnabled).toBe('boolean');
    expect(typeof result.nextEnabled).toBe('boolean');
  });
});
