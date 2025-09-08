import { calculateInterestonly } from './calculateInterestonly';

[
  {
    price: 500000,
    deposit: 100000,
    termYears: 25,
    termMonths: 0,
    rate: 5,
    results: {
      debt: 400000,
      monhtlyPayment: 1666.67,
      changedPayment: 2666.67,
      totalAmount: 900000,
      capitalSplit: 400000,
      interestSplit: 500000,
      balance: 400000,
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
      monhtlyPayment: 1666.67,
      changedPayment: 2916.67,
      totalAmount: 1000000,
      capitalSplit: 500000,
      interestSplit: 500000,
      balance: 500000,
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
      monhtlyPayment: 1706.25,
      changedPayment: 2493.75,
      totalAmount: 560700,
      capitalSplit: 315000,
      interestSplit: 245700,
      balance: 315000,
    },
  },
].forEach((testCase) => {
  it(
    'calculates interest only debt for price ' +
      testCase.price +
      ', deposit ' +
      testCase.deposit +
      ', term ' +
      testCase.termYears +
      ' and interest ' +
      testCase.rate,
    () => {
      const results = calculateInterestonly(
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
    'calculates interest only monthly payment for price ' +
      testCase.price +
      ', deposit ' +
      testCase.deposit +
      ', term ' +
      testCase.termYears +
      ' and interest ' +
      testCase.rate,
    () => {
      const results = calculateInterestonly(
        testCase.price,
        testCase.deposit,
        testCase.termYears,
        testCase.termMonths,
        testCase.rate,
      );

      expect(Math.ceil(results.monthlyPayment * 100) / 100).toEqual(
        testCase.results.monhtlyPayment,
      );
    },
  );

  it(
    'calculates interest only monthly price when interest is risen by 3 for price ' +
      testCase.price +
      ', deposit ' +
      testCase.deposit +
      ', term ' +
      testCase.termYears +
      ' and interest ' +
      testCase.rate,
    () => {
      const results = calculateInterestonly(
        testCase.price,
        testCase.deposit,
        testCase.termYears,
        testCase.termMonths,
        testCase.rate,
      );

      expect(Math.ceil(results.changedPayment * 100) / 100).toEqual(
        testCase.results.changedPayment,
      );
    },
  );

  it(
    'calculate interest only total payable amount for price ' +
      testCase.price +
      ', deposit ' +
      testCase.deposit +
      ', term ' +
      testCase.termYears +
      ' and interest ' +
      testCase.rate,
    () => {
      const results = calculateInterestonly(
        testCase.price,
        testCase.deposit,
        testCase.termYears,
        testCase.termMonths,
        testCase.rate,
      );

      expect(results.totalAmount).toEqual(testCase.results.totalAmount);
    },
  );

  it(
    'calculate interest only capital split for price ' +
      testCase.price +
      ', deposit ' +
      testCase.deposit +
      ', term ' +
      testCase.termYears +
      ' and interest ' +
      testCase.rate,
    () => {
      const results = calculateInterestonly(
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
    'calculate interest only interest split for price ' +
      testCase.price +
      ', deposit ' +
      testCase.deposit +
      ', term ' +
      testCase.termYears +
      ' and interest ' +
      testCase.rate,
    () => {
      const results = calculateInterestonly(
        testCase.price,
        testCase.deposit,
        testCase.termYears,
        testCase.termMonths,
        testCase.rate,
      );

      expect(results.interestSplit).toEqual(testCase.results.interestSplit);
    },
  );

  it(
    'calculate interest only balance breakdown for price ' +
      testCase.price +
      ', deposit ' +
      testCase.deposit +
      ', term ' +
      testCase.termYears +
      ' and interest ' +
      testCase.rate,
    () => {
      const results = calculateInterestonly(
        testCase.price,
        testCase.deposit,
        testCase.termYears,
        testCase.termMonths,
        testCase.rate,
      );

      expect(results.balanceBreakdown[0].presentValue).toEqual(
        testCase.results.balance,
      );
    },
  );
});
