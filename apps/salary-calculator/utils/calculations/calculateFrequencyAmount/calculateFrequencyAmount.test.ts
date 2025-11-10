import { calculateFrequencyAmount } from './calculateFrequencyAmount';

describe('calculateFrequencyAmount', () => {
  it('returns the frequency amounts for the given yearly amount', () => {
    expect(calculateFrequencyAmount({ yearlyAmount: 23944.18 })).toStrictEqual({
      yearly: 23944.18,
      monthly: 1995.35,
      weekly: 460.47,
      daily: 92.09,
    });
  });
});
