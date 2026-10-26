import { DOTS } from './CONSTANTS';
import { getMobilePaginationRange } from './getMobilePaginationRange';
import { range } from './range';

jest.mock('./range', () => ({
  range: jest.fn((start: number, end: number) => {
    const res = [];
    for (let i = start; i <= end; i++) res.push(i);
    return res;
  }),
}));

describe('getMobilePaginationRange', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a full sequence without DOTS when totalPages is 3 or less', () => {
    const result = getMobilePaginationRange(1, 3);
    expect(range).toHaveBeenCalledWith(1, 3);
    expect(result).toEqual([1, 2, 3]);
  });

  describe('when totalPages is greater than 3', () => {
    it.each([
      {
        page: 1,
        total: 5,
        expected: [1, DOTS, 5],
        description: 'active on page 1',
      },
      {
        page: 5,
        total: 5,
        expected: [1, DOTS, 5],
        description: 'active on the last page',
      },
      {
        page: 2,
        total: 5,
        expected: [1, 2, DOTS, 5],
        description: 'active immediately after page 1 (no leading dots)',
      },
      {
        page: 4,
        total: 5,
        expected: [1, DOTS, 4, 5],
        description: 'active immediately before last page (no trailing dots)',
      },
      {
        page: 4,
        total: 7,
        expected: [1, DOTS, 4, DOTS, 7],
        description: 'active away from boundaries (dots on both sides)',
      },
    ])(
      'should format correctly when $description',
      ({ page, total, expected }) => {
        expect(getMobilePaginationRange(page, total)).toEqual(expected);
      },
    );
  });
});
