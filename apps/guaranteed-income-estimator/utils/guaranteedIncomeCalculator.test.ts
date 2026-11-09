import { guaranteedIncomeCalculator } from './guaranteedIncomeCalculator';

const AGE_55_INCOME = 9400;
const AGE_62_INCOME = 7600;
const AGE_67_INCOME = 22400;
const AGE_72_INCOME = 29900;
const AGE_85_INCOME = 34500;

describe('guaranteedIncomeCalculator', () => {
  it('should calculate the guaranteed income and tax-free if age is 55 pot is £200,000', () => {
    const result = guaranteedIncomeCalculator(200000, 55);

    expect(result).toStrictEqual({
      income: AGE_55_INCOME,
      taxFreeLumpSum: 50000,
    });
  });

  it('should calculate the guaranteed income and tax-free if age is 62 pot is £150,000', () => {
    const result = guaranteedIncomeCalculator(150000, 62);

    expect(result).toStrictEqual({
      income: AGE_62_INCOME,
      taxFreeLumpSum: 37500,
    });
  });

  it('should calculate the guaranteed income and tax-free if age is 67 pot is £400,000', () => {
    const result = guaranteedIncomeCalculator(400000, 67);

    expect(result).toStrictEqual({
      income: AGE_67_INCOME,
      taxFreeLumpSum: 100000,
    });
  });

  it('should calculate the guaranteed income and tax-free if age is 72 pot is £480,000', () => {
    const result = guaranteedIncomeCalculator(480000, 72);

    expect(result).toStrictEqual({
      income: AGE_72_INCOME,
      taxFreeLumpSum: 120000,
    });
  });

  it('should calculate the guaranteed income and tax-free if age is 85 pot is £480,000', () => {
    const result = guaranteedIncomeCalculator(480000, 85);

    expect(result).toStrictEqual({
      income: AGE_85_INCOME,
      taxFreeLumpSum: 120000,
    });
  });
});
