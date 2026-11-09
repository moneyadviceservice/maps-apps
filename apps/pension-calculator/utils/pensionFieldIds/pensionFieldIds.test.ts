import {
  ADD_PENSION_ID,
  contributionFieldId,
  estimatedYearlyValueId,
  INCOME_SCREENING_ID,
  INCOME_SCREENING_NAME,
  incomePotFieldId,
  POT_COUNT_NAME,
  POT_LIST_ID,
  POT_SCREENING_ID,
  POT_SCREENING_NAME,
  potAgeItStartsPayingId,
  potCurrentValueId,
  potFieldId,
  potNameId,
  potRemoveId,
  potTaxFreeCashId,
} from './pensionFieldIds';

describe('Pension Field IDs Utilities', () => {
  describe('Constants', () => {
    test.each([
      ['POT_SCREENING_ID', POT_SCREENING_ID, 'has-pot-of-money-pension-0'],
      ['POT_SCREENING_NAME', POT_SCREENING_NAME, 'hasPotOfMoneyPension'],
      ['POT_COUNT_NAME', POT_COUNT_NAME, 'potCount'],
      ['POT_LIST_ID', POT_LIST_ID, 'pension-pots'],
      ['ADD_PENSION_ID', ADD_PENSION_ID, 'add-another-pension'],
      ['INCOME_SCREENING_ID', INCOME_SCREENING_ID, 'has-income-pension-0'],
      ['INCOME_SCREENING_NAME', INCOME_SCREENING_NAME, 'hasIncomePension'],
    ])('exports correct constant value for %s', (_, actual, expected) => {
      expect(actual).toBe(expected);
    });
  });

  describe('Pots of Money Field Generators', () => {
    test.each([
      [0, 'name', 'pension-pot-0-name'],
      [1, 'currentValue', 'pension-pot-1-currentValue'],
      [2, 'taxFreeCash', 'pension-pot-2-taxFreeCash'],
    ] as const)(
      'potFieldId(%i, "%s") returns "%s"',
      (index, field, expected) => {
        expect(potFieldId(index, field)).toBe(expected);
      },
    );

    test.each([
      [
        0,
        'pension-pot-0-name',
        'pension-pot-0-currentValue',
        'pension-pot-0-taxFreeCash',
        'pension-pot-0-remove',
      ],
      [
        1,
        'pension-pot-1-name',
        'pension-pot-1-currentValue',
        'pension-pot-1-taxFreeCash',
        'pension-pot-1-remove',
      ],
    ])(
      'returns correct derived pot IDs for index %i',
      (
        index,
        expectedName,
        expectedCurrentValue,
        expectedTaxFreeCash,
        expectedRemove,
      ) => {
        expect(potNameId(index)).toBe(expectedName);
        expect(potCurrentValueId(index)).toBe(expectedCurrentValue);
        expect(potTaxFreeCashId(index)).toBe(expectedTaxFreeCash);
        expect(potRemoveId(index)).toBe(expectedRemove);
      },
    );

    test.each([
      ['employee', 'mode', 'employee-contribution-mode'],
      ['employee', 'value', 'employee-contribution-value'],
      ['employee', 'frequency', 'employee-contribution-frequency'],
      ['employer', 'mode', 'employer-contribution-mode'],
      ['employer', 'value', 'employer-contribution-value'],
      ['employer', 'frequency', 'employer-contribution-frequency'],
    ] as const)(
      'contributionFieldId("%s", "%s") returns "%s"',
      (kind, field, expected) => {
        expect(contributionFieldId(kind, field)).toBe(expected);
      },
    );
  });

  describe('Income Pensions Field Generators', () => {
    test.each([
      [0, 'name', 'income-pension-pot-0-name'],
      [1, 'estimatedYearlyValue', 'income-pension-pot-1-estimatedYearlyValue'],
      [2, 'ageItStartsPaying', 'income-pension-pot-2-ageItStartsPaying'],
      [3, 'taxFreeCash', 'income-pension-pot-3-taxFreeCash'],
    ] as const)(
      'incomePotFieldId(%i, "%s") returns "%s"',
      (index, field, expected) => {
        expect(incomePotFieldId(index, field)).toBe(expected);
      },
    );

    test.each([
      [
        0,
        'income-pension-pot-0-estimatedYearlyValue',
        'income-pension-pot-0-ageItStartsPaying',
      ],
      [
        1,
        'income-pension-pot-1-estimatedYearlyValue',
        'income-pension-pot-1-ageItStartsPaying',
      ],
    ])(
      'returns correct derived income pot IDs for index %i',
      (index, expectedYearlyValue, expectedAgeItStartsPaying) => {
        expect(estimatedYearlyValueId(index)).toBe(expectedYearlyValue);
        expect(potAgeItStartsPayingId(index)).toBe(expectedAgeItStartsPaying);
      },
    );
  });
});
