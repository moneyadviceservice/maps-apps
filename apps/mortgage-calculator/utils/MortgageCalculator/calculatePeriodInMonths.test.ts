import calculatePeriodInMonths from './calculatePeriodInMonths';
[
  {
    price: 425000,
    deposit: 85000,
    termYears: 25,
    termMonths: 6,
    rate: 3.9,
    results: {
      debt: 340000,
      monthlyRate: 0.00325,
      period: 306,
    },
  },
  {
    price: 680000,
    deposit: 136000,
    termYears: 15,
    termMonths: 3,
    rate: 4.2,
    results: {
      debt: 544000,
      monthlyRate: 0.0035,
      period: 183,
    },
  },
  {
    price: 295000,
    deposit: 73750,
    termYears: 12,
    termMonths: 9,
    rate: 3.6,
    results: {
      debt: 221250,
      monthlyRate: 0.003,
      period: 153,
    },
  },
  {
    price: 950000,
    deposit: 285000,
    termYears: 22,
    termMonths: 4,
    rate: 4.7,
    results: {
      debt: 665000,
      monthlyRate: 0.00392,
      period: 268,
    },
  },
  {
    price: 375000,
    deposit: 112500,
    termYears: 18,
    termMonths: 0,
    rate: 3.25,
    results: {
      debt: 262500,
      monthlyRate: 0.00271,
      period: 216,
    },
  },
].forEach((testCase) => {
  it(
    'calculate period in months for price ' +
      testCase.price +
      ', deposit ' +
      testCase.deposit +
      ', term ' +
      testCase.termYears +
      ' and interest ' +
      testCase.rate,
    () => {
      expect(
        calculatePeriodInMonths(testCase.termYears, testCase.termMonths),
      ).toEqual(testCase.results.period);
    },
  );
});
