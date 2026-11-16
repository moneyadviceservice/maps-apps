import data from '../__mocks__/budget-planner-test-data.json';
import tabs from '../data/budget-planner';
import calculateBreakdown from './calculateBreakdown';

describe('calculateBreakdown', () => {
  const divisor = 1;
  it('returns empty array if no data is provided', () => {
    const result = tabs.reduce(calculateBreakdown({}, divisor), []);
    expect(result).toEqual([]);
  });
  it('returns the correct breakdown', () => {
    const expected = [
      {
        name: 'income',
        value: 1120.8333333333335,
        colour: '#00788E',
        url: '/api/income',
      },
      {
        name: 'household-bills',
        value: -100,
        colour: '#00788E',
        url: '/api/household-bills',
      },
    ];

    const result = tabs.reduce(calculateBreakdown(data, divisor), []);
    expect(result).toEqual(expected);
  });
});
