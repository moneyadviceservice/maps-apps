import { mockPensionsData } from '../mocks';
import { getPensionTotals } from './getPensionTotals';

describe('getPensionTotals', () => {
  const mockData = mockPensionsData.pensionPolicies[0].pensionArrangements[2];

  it.each`
    description                  | data          | expected
    ${'one pension arrangement'} | ${[mockData]} | ${{ monthlyTotal: 958.5, annualTotal: 11502 }}
    ${'no pension arrangements'} | ${[]}         | ${{ monthlyTotal: 0, annualTotal: 0 }}
  `(
    'should calculate totals correctly for $description',
    ({ data, expected }) => {
      const result = getPensionTotals(data);
      expect(result).toEqual(expected);
    },
  );
});
