import { DOTS } from './CONSTANTS';
import { getPaginationRange } from './getPaginationRange';
import { range } from './range';

jest.mock('./range', () => ({
  range: jest.fn((start: number, end: number) => {
    const res = [];
    for (let i = start; i <= end; i++) res.push(i);
    return res;
  }),
}));

describe('getPaginationRange', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a simple range from 1 to totalPages when total pages fit within limits', () => {
    const result = getPaginationRange(1, 5, 1);

    expect(range).toHaveBeenCalledWith(1, 5);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  describe('when totalPages exceeds the range limits', () => {
    it.each([
      {
        page: 2,
        total: 10,
        rangeVal: 1,
        expected: [1, 2, 3, 4, 5, DOTS, 10],
        expectedRange: [1, 5],
        description:
          'display DOTS on the right side only when active page is close to the start',
      },
      {
        page: 9,
        total: 10,
        rangeVal: 1,
        expected: [1, DOTS, 6, 7, 8, 9, 10],
        expectedRange: [6, 10],
        description:
          'display DOTS on the left side only when active page is close to the end',
      },
      {
        page: 5,
        total: 10,
        rangeVal: 1,
        expected: [1, DOTS, 4, 5, 6, DOTS, 10],
        expectedRange: [4, 6],
        description:
          'display DOTS on both sides when active page is exactly in the middle',
      },
      {
        page: 6,
        total: 12,
        rangeVal: 2,
        expected: [1, DOTS, 4, 5, 6, 7, 8, DOTS, 12],
        expectedRange: [4, 8],
        description:
          'respect custom pageRange inputs for wider sibling spacing boundaries',
      },
    ])(
      'should $description',
      ({ page, total, rangeVal, expected, expectedRange }) => {
        const result = getPaginationRange(page, total, rangeVal);

        expect(range).toHaveBeenCalledWith(expectedRange[0], expectedRange[1]);
        expect(result).toEqual(expected);
      },
    );
  });

  it('should gracefully return an empty array if fallback branch is ever reached', () => {
    const result = getPaginationRange(0, 0, -5);
    expect(result).toEqual([]);
  });
});
