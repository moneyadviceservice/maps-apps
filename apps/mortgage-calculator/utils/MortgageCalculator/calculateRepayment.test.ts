import { calculateRepayment } from './calculateRepayment';

[
  {
    price: 450000,
    deposit: 40000,
    termYears: 20,
    termMonths: 0,
    rate: 5,
    results: {
      debt: 410000,
      monhtlyPayment: 2705.82,
      changedPayment: 3429.4,
      totalAmount: 649396.45,
      capitalSplit: 410000,
      interestSplit: 239396.45,
      balancebreakdown: [
        {
          year: 1,
          presentValue: 397752.02,
        },
        {
          year: 7,
          presentValue: 309923.65,
        },
        {
          year: 19,
          presentValue: 31607.27,
        },
      ],
    },
  },
  {
    price: 500000,
    deposit: 0,
    termYears: 25,
    termMonths: 0,
    rate: 4,
    results: {
      debt: 500000,
      monhtlyPayment: 2639.18,
      changedPayment: 3533.9,
      totalAmount: 791755.26,
      capitalSplit: 500000,
      interestSplit: 291755.26,
      balancebreakdown: [
        {
          year: 6,
          presentValue: 421009.63,
        },
        {
          year: 12,
          presentValue: 320633.26,
        },
        {
          year: 19,
          presentValue: 168689.89,
        },
      ],
    },
  },
  {
    price: 350000,
    deposit: 35000,
    termYears: 12,
    termMonths: 0,
    rate: 6.5,
    results: {
      debt: 315000,
      monhtlyPayment: 3156.05,
      changedPayment: 3674.08,
      totalAmount: 454471.41,
      capitalSplit: 315000,
      interestSplit: 139471.41,
      balancebreakdown: [
        {
          year: 2,
          presentValue: 277948.71,
        },
        {
          year: 5,
          presentValue: 212536.78,
        },
        {
          year: 8,
          presentValue: 133082.76,
        },
      ],
    },
  },
].forEach((testCase) => {
  it(
    'calculates repayment debt for price ' +
      testCase.price +
      ', deposit ' +
      testCase.deposit +
      ', term ' +
      testCase.termYears +
      ' and interest ' +
      testCase.rate,
    () => {
      const results = calculateRepayment(
        testCase.price,
        testCase.deposit,
        testCase.termYears,
        testCase.termMonths,
        testCase.rate,
      );

      expect(results.debt).toEqual(testCase.results.debt);
    },
  );

  it(
    'calculates repayment monthly payment for price ' +
      testCase.price +
      ', deposit ' +
      testCase.deposit +
      ', term ' +
      testCase.termYears +
      ' and interest ' +
      testCase.rate,
    () => {
      const results = calculateRepayment(
        testCase.price,
        testCase.deposit,
        testCase.termYears,
        testCase.termMonths,
        testCase.rate,
      );

      expect(Math.round(results.monthlyPayment * 100) / 100).toEqual(
        testCase.results.monhtlyPayment,
      );
    },
  );

  it(
    'calculates repayment monthly price when interest is risen by 3 for price ' +
      testCase.price +
      ', deposit ' +
      testCase.deposit +
      ', term ' +
      testCase.termYears +
      ' and interest ' +
      testCase.rate,
    () => {
      const results = calculateRepayment(
        testCase.price,
        testCase.deposit,
        testCase.termYears,
        testCase.termMonths,
        testCase.rate,
      );

      expect(Math.round(results.changedPayment * 100) / 100).toEqual(
        testCase.results.changedPayment,
      );
    },
  );

  it(
    'calculate repayment total payable amount for price ' +
      testCase.price +
      ', deposit ' +
      testCase.deposit +
      ', term ' +
      testCase.termYears +
      ' and interest ' +
      testCase.rate,
    () => {
      const results = calculateRepayment(
        testCase.price,
        testCase.deposit,
        testCase.termYears,
        testCase.termMonths,
        testCase.rate,
      );

      expect(Math.round(results.totalAmount * 100) / 100).toEqual(
        testCase.results.totalAmount,
      );
    },
  );

  it(
    'calculate repayment capital split for price ' +
      testCase.price +
      ', deposit ' +
      testCase.deposit +
      ', term ' +
      testCase.termYears +
      ' and interest ' +
      testCase.rate,
    () => {
      const results = calculateRepayment(
        testCase.price,
        testCase.deposit,
        testCase.termYears,
        testCase.termMonths,
        testCase.rate,
      );

      expect(results.capitalSplit).toEqual(testCase.results.capitalSplit);
    },
  );

  it(
    'calculate repayment interest split for price ' +
      testCase.price +
      ', deposit ' +
      testCase.deposit +
      ', term ' +
      testCase.termYears +
      ' and interest ' +
      testCase.rate,
    () => {
      const results = calculateRepayment(
        testCase.price,
        testCase.deposit,
        testCase.termYears,
        testCase.termMonths,
        testCase.rate,
      );

      expect(Math.round(results.interestSplit * 100) / 100).toEqual(
        testCase.results.interestSplit,
      );
    },
  );

  it(
    'calculate repayment balance breakdown for price ' +
      testCase.price +
      ', deposit ' +
      testCase.deposit +
      ', term ' +
      testCase.termYears +
      ' and interest ' +
      testCase.rate,
    () => {
      const results = calculateRepayment(
        testCase.price,
        testCase.deposit,
        testCase.termYears,
        testCase.termMonths,
        testCase.rate,
      );

      testCase.results.balancebreakdown.forEach((result) => {
        expect(results.balanceBreakdown[result.year].presentValue).toEqual(
          result.presentValue,
        );
      });
    },
  );
});

describe('calculate Repayment', () => {
  it('with zero interest rate', () => {
    const result = calculateRepayment(700000, 10000, 10, 10, 0);
    expect(result.totalAmount).toBe(690000);
    expect(result.balanceBreakdown[0].presentValue).toBe(690000);
    expect(result.balanceBreakdown[1].presentValue).toBe(626307.69);
    expect(
      result.balanceBreakdown[result.balanceBreakdown.length - 1].presentValue,
    ).toBe(53076.92);
  });
});
