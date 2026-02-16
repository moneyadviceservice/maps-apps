import { describe } from '@jest/globals';

import calculateMonthlyRate from './calculateMonthlyRate';

[
  {
    price: 600000,
    deposit: 120000,
    termYears: 30,
    termMonths: 0,
    rate: 4.5,
    results: {
      debt: 480000,
      monthlyRate: 0.0038,
      period: 360,
    },
  },
  {
    price: 450000,
    deposit: 50000,
    termYears: 20,
    termMonths: 0,
    rate: 3.75,
    results: {
      debt: 400000,
      monthlyRate: 0.0032,
      period: 240,
    },
  },
  {
    price: 350000,
    deposit: 20000,
    termYears: 17,
    termMonths: 0,
    rate: 4.25,
    results: {
      debt: 330000,
      monthlyRate: 0.0036,
      period: 204,
    },
  },
  {
    price: 750000,
    deposit: 150000,
    termYears: 15,
    termMonths: 0,
    rate: 3.5,
    results: {
      debt: 600000,
      monthlyRate: 0.003,
      period: 180,
    },
  },
  {
    price: 300000,
    deposit: 0,
    termYears: 10,
    termMonths: 0,
    rate: 5.0,
    results: {
      debt: 300000,
      monthlyRate: 0.0042,
      period: 120,
    },
  },
].forEach((testCase) => {
  it(
    'calculate monthly rate for price ' +
      testCase.price +
      ', deposit ' +
      testCase.deposit +
      ', term ' +
      testCase.termYears +
      ' and interest ' +
      testCase.rate,
    () => {
      expect(
        Math.ceil(calculateMonthlyRate(testCase.rate) * 10000) / 10000,
      ).toEqual(testCase.results.monthlyRate);
    },
  );
});

describe('Calculate monthly rate ', () => {
  it('when rate is ZERO', () => {
    const monthlyRate = calculateMonthlyRate(0);
    expect(monthlyRate).toEqual(0);
  });
});
