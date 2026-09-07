import calculateDebt from './calculateDebt';
[
  {
    price: 750000,
    deposit: 150000,
    termYears: 30,
    termMonths: 0,
    rate: 4.5,
    results: {
      debt: 600000,
      monthlyRate: 0.00375,
      period: 360,
    },
  },
  {
    price: 625000,
    deposit: 0,
    termYears: 30,
    termMonths: 0,
    rate: 4.75,
    results: {
      debt: 625000,
      monthlyRate: 0.00396,
      period: 360,
    },
  },
  {
    price: 420000,
    deposit: 35000,
    termYears: 20,
    termMonths: 6,
    rate: 3.75,
    results: {
      debt: 385000,
      monthlyRate: 0.00313,
      period: 246,
    },
  },
  {
    price: 680000,
    deposit: -20000,
    termYears: 30,
    termMonths: 0,
    rate: 4.25,
    results: {
      debt: 700000,
    },
  },
  {
    price: 0,
    deposit: 125000,
    termYears: 20,
    termMonths: 0,
    rate: 4.8,
    results: {
      debt: -125000,
    },
  },
  {
    price: -450000,
    deposit: 75000,
    termYears: 15,
    termMonths: 0,
    rate: 3.95,
    results: {
      debt: -525000,
    },
  },
].forEach((testCase) => {
  it(
    'calculate remaining debt for price ' +
      testCase.price +
      ', deposit ' +
      testCase.deposit +
      ', term ' +
      testCase.termYears +
      ' and interest ' +
      testCase.rate,
    () => {
      const d = calculateDebt(testCase.price, testCase.deposit);
      expect(d).toEqual(testCase.results.debt);
    },
  );
});
