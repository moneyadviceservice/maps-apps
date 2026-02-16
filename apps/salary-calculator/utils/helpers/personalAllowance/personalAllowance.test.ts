import { calculatePersonalAllowance } from './personalAllowance';

describe('calculatePersonalAllowance', () => {
  // No tax code, default allowance + tapering + BPA
  const noTaxCodeCases = [
    { income: 30_000, isBlind: false, expected: 12570 },
    { income: 175_000, isBlind: false, expected: 0 },
    { income: 109_000, isBlind: false, expected: 8070 }, // tapering
    { income: 109_000, isBlind: true, expected: 8070 + 3130 }, // BPA applied
  ];

  for (const { income, isBlind, expected } of noTaxCodeCases) {
    test(`no tax code, income ${income}, blind=${isBlind}`, () => {
      expect(
        calculatePersonalAllowance({
          taxableAnnualIncome: income,
          isBlindPerson: isBlind,
        }),
      ).toEqual(expected);
    });
  }

  // Numeric tax codes override everything (ignore tapering/BPA)
  const numericCodeCases = [
    { taxCode: '1100T', income: 200_000, isBlind: true, expected: 11000 },
    { taxCode: '1257L', income: 50_000, isBlind: true, expected: 12570 },
    { taxCode: '5000M', income: 120_000, isBlind: false, expected: 50000 },
    { taxCode: 'K500', income: 60_000, isBlind: false, expected: -5000 },
    { taxCode: 'S50T', income: 109_000, isBlind: true, expected: 500 },
  ];

  for (const { taxCode, income, isBlind, expected } of numericCodeCases) {
    test(`numeric tax code ${taxCode}, income ${income}, blind=${isBlind}`, () => {
      expect(
        calculatePersonalAllowance({
          taxableAnnualIncome: income,
          taxCode,
          isBlindPerson: isBlind,
        }),
      ).toEqual(expected);
    });
  }

  // Non-numeric tax codes → PA = 0, ignore BPA
  const nonNumericCases = [
    { taxCode: 'BR', income: 50_000, isBlind: false, expected: 0 },
    { taxCode: 'D0', income: 120_000, isBlind: true, expected: 0 },
    { taxCode: 'NT', income: 109_000, isBlind: true, expected: 0 },
    { taxCode: 'SBR', income: 64_500, isBlind: false, expected: 0 },
  ];

  for (const { taxCode, income, isBlind, expected } of nonNumericCases) {
    test(`non-numeric tax code ${taxCode}, income ${income}, blind=${isBlind}`, () => {
      expect(
        calculatePersonalAllowance({
          taxableAnnualIncome: income,
          taxCode,
          isBlindPerson: isBlind,
        }),
      ).toEqual(expected);
    });
  }

  // Edge case: negative income
  test('negative income returns full allowance if no tax code', () => {
    expect(
      calculatePersonalAllowance({
        taxableAnnualIncome: -5000,
      }),
    ).toBe(12570);
  });

  // No tax code + BPA applied
  test('no tax code + BPA applied', () => {
    expect(
      calculatePersonalAllowance({
        taxableAnnualIncome: 30_000,
        isBlindPerson: true,
      }),
    ).toBe(12570 + 3130);
  });

  // Scotland: explicitly set country
  test('Scotland, no tax code, income 64,500', () => {
    expect(
      calculatePersonalAllowance({
        taxableAnnualIncome: 64_500,
        isBlindPerson: true,
        country: 'Scotland',
      }),
    ).toBe(15700); // 12,570 + 3,130 BPA
  });

  test('Scotland, no tax code, tapered allowance', () => {
    expect(
      calculatePersonalAllowance({
        taxableAnnualIncome: 109_000,
        country: 'Scotland',
      }),
    ).toBe(8070); // tapering applies, BPA ignored for test
  });
});
