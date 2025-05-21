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
        title: { en: 'Income', cy: 'Incwm' },
        name: 'income',
        value: 1131.5476190476193,
        colour: '#00788E',
        url: '/api/budget-planner/income',
      },
      {
        title: { en: 'Household bills', cy: "Biliau'r cartref" },
        name: 'household-bills',
        value: -100,
        colour: '#00788E',
        url: '/api/budget-planner/household-bills',
      },
    ];

    const result = tabs.reduce(calculateBreakdown(data, divisor), []);
    expect(result).toEqual(expected);
  });
});
