import { range } from './range';

describe('range utility', () => {
  it('should generate an array of numbers from a positive start to a positive end', () => {
    const result = range(1, 5);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should return a single item array if start and end values are identical', () => {
    const result = range(4, 4);
    expect(result).toEqual([4]);
  });

  it('should correctly handle negative numbers and bridge across zero', () => {
    const result = range(-2, 2);
    expect(result).toEqual([-2, -1, 0, 1, 2]);
  });

  it('should return an empty array if the start index is greater than the end index', () => {
    // The loop condition (i <= end) is false on the first iteration
    const result = range(5, 1);
    expect(result).toEqual([]);
  });

  it('should handle large ranges efficiently without skipping values', () => {
    const result = range(100, 105);
    expect(result).toEqual([100, 101, 102, 103, 104, 105]);
  });
});
