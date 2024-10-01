import { guaranteedIncomeCalculator } from './guaranteedIncomeCalculator';

describe('guaranteedIncomeCalculator', () => {
  it('should calculate the guaranteed income and tax-free if age is 55 pot is £200,000', () => {
    const result = guaranteedIncomeCalculator(200000, 55);

    expect(result).toStrictEqual({
      income: 9100,
      taxFreeLumpSum: 50000,
    });
  });

  it('should calculate the guaranteed income and tax-free if age is 62 pot is £150,000', () => {
    const result = guaranteedIncomeCalculator(150000, 62);

    expect(result).toStrictEqual({
      income: 7300,
      taxFreeLumpSum: 37500,
    });
  });

  it('should calculate the guaranteed income and tax-free if age is 67 pot is £400,000', () => {
    const result = guaranteedIncomeCalculator(400000, 67);

    expect(result).toStrictEqual({
      income: 21600,
      taxFreeLumpSum: 100000,
    });
  });

  it('should calculate the guaranteed income and tax-free if age is 72 pot is £480,000', () => {
    const result = guaranteedIncomeCalculator(480000, 72);

    expect(result).toStrictEqual({
      income: 29000,
      taxFreeLumpSum: 120000,
    });
  });

  it('should calculate the guaranteed income and tax-free if age is 85 pot is £480,000', () => {
    const result = guaranteedIncomeCalculator(480000, 85);

    expect(result).toStrictEqual({
      income: 33800,
      taxFreeLumpSum: 120000,
    });
  });
});
