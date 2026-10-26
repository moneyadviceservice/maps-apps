import { pots } from 'tests/mocks/pots';
import type { DefinedIncomeData, PotsOfMoneyData } from 'types/pensions';

import {
  hasPensionErrors,
  validateIncomeScreening,
  validatePotDetails,
  validatePotScreening,
} from './pensions';

jest.mock('data/pensions', () => ({
  getPensionErrorMessage: jest.fn((key: string) => `Error: ${key}`),
}));

jest.mock('utils/pensionFieldIds', () => ({
  POT_SCREENING_ID: 'has-pot-of-money-pension-0',
  INCOME_SCREENING_ID: 'has-income-pension-0',
  potCurrentValueId: (index: number) => `pension-pot-${index}-currentValue`,
  potTaxFreeCashId: (index: number) => `pension-pot-${index}-taxFreeCash`,
  contributionFieldId: (kind: string, field: string, index?: number) =>
    index !== undefined
      ? `${kind}-contribution-${field}-${index}`
      : `${kind}-contribution-${field}`,
  annualManagementChargeId: (index: number) =>
    `pension-pot-${index}-annualManagementCharge`,
}));

const createPotsData = (
  overrides: Partial<PotsOfMoneyData> = {},
): PotsOfMoneyData =>
  ({
    hasPotOfMoneyPension: 'yes',
    pots: [
      {
        name: 'Pot 1',
        currentValue: '1000',
        taxFreeCash: '',
        employeeContribution: {
          mode: 'percentage',
          value: '',
          frequency: 'month',
        },
        employerContribution: {
          mode: 'percentage',
          value: '',
          frequency: 'month',
        },
        annualManagementCharge: '',
      },
    ],
    ...overrides,
  } as PotsOfMoneyData);

const createIncomeData = (
  overrides: Partial<DefinedIncomeData> = {},
): DefinedIncomeData =>
  ({
    hasIncomePension: 'yes',
    ...overrides,
  } as DefinedIncomeData);

describe('Pension Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validatePotScreening', () => {
    it('returns error when screening answer is missing', () => {
      const data = createPotsData({ hasPotOfMoneyPension: undefined });
      expect(validatePotScreening(data)).toEqual({
        'has-pot-of-money-pension-0': ['Error: screeningRequired'],
      });
    });

    it.each(['yes', 'no'] as const)(
      'returns no errors when screening answer is %s',
      (answer) => {
        const data = createPotsData({ hasPotOfMoneyPension: answer });
        expect(validatePotScreening(data)).toEqual({});
      },
    );
  });

  describe('validateIncomeScreening', () => {
    it('returns error when screening answer is missing', () => {
      const data = createIncomeData({ hasIncomePension: undefined });
      expect(validateIncomeScreening(data)).toEqual({
        'has-income-pension-0': ['Error: screeningRequired'],
      });
    });

    it.each(['yes', 'no'] as const)(
      'returns no errors when income screening answer is %s',
      (answer) => {
        const data = createIncomeData({ hasIncomePension: answer });
        expect(validateIncomeScreening(data)).toEqual({});
      },
    );
  });

  describe('validatePotDetails', () => {
    it('returns required error when current value is empty', () => {
      const data = createPotsData({
        pots: [{ ...createPotsData().pots[0], currentValue: '' }],
      });
      expect(validatePotDetails(data)).toEqual({
        'pension-pot-0-currentValue': ['Error: currentValueRequired'],
      });
    });

    it('returns invalid amount error when current value format is invalid', () => {
      const data = createPotsData({
        pots: [{ ...createPotsData().pots[0], currentValue: 'invalid-amount' }],
      });
      expect(validatePotDetails(data)).toEqual({
        'pension-pot-0-currentValue': ['Error: amountInvalid'],
      });
    });

    it('validates optional tax-free cash format', () => {
      const data = createPotsData({
        pots: [{ ...createPotsData().pots[0], taxFreeCash: 'abc' }],
      });
      expect(validatePotDetails(data)).toEqual({
        'pension-pot-0-taxFreeCash': ['Error: amountInvalid'],
      });
    });

    describe('contributions validation', () => {
      const kinds: Array<'employee' | 'employer'> = ['employee', 'employer'];

      test.each(kinds)(
        'returns percentageInvalid error when %s percentage contribution is out of bounds or invalid',
        (kind) => {
          const data = createPotsData({
            pots: [
              {
                ...createPotsData().pots[0],
                [`${kind}Contribution`]: {
                  mode: 'percentage',
                  value: '150',
                  frequency: 'month',
                },
              },
            ],
          });

          expect(validatePotDetails(data)).toEqual({
            [`${kind}-contribution-value-0`]: ['Error: percentageInvalid'],
          });
        },
      );

      test.each(kinds)(
        'returns amountInvalid error when %s fixed contribution format is invalid',
        (kind) => {
          const data = createPotsData({
            pots: [
              {
                ...createPotsData().pots[0],
                [`${kind}Contribution`]: {
                  mode: 'fixed',
                  value: 'abc',
                  frequency: 'month',
                },
              },
            ],
          });

          expect(validatePotDetails(data)).toEqual({
            [`${kind}-contribution-value-0`]: ['Error: amountInvalid'],
          });
        },
      );
    });

    describe('annual management charge validation', () => {
      it('returns amountInvalid error when annual management charge format is invalid', () => {
        const data = createPotsData({
          pots: [
            {
              ...createPotsData().pots[0],
              annualManagementCharge: 'invalid-charge',
            },
          ],
        });

        expect(validatePotDetails(data)).toEqual({
          'pension-pot-0-annualManagementCharge': ['Error: amountInvalid'],
        });
      });
    });

    it('validates multiple pots and routes errors to correct pot indices', () => {
      const data: PotsOfMoneyData = {
        hasPotOfMoneyPension: 'yes',
        pots: [
          { ...pots[0], taxFreeCash: '' },
          {
            ...pots[1],
            currentValue: '',
            taxFreeCash: 'abc',
            employeeContribution: {
              mode: 'percentage',
              value: '105',
              frequency: 'month',
            },
            employerContribution: {
              mode: 'fixed',
              value: 'xyz',
              frequency: 'month',
            },
            annualManagementCharge: 'bad-val',
          },
        ],
      } as PotsOfMoneyData;

      expect(validatePotDetails(data)).toEqual({
        'pension-pot-1-currentValue': ['Error: currentValueRequired'],
        'pension-pot-1-taxFreeCash': ['Error: amountInvalid'],
        'employee-contribution-value-1': ['Error: percentageInvalid'],
        'employer-contribution-value-1': ['Error: amountInvalid'],
        'pension-pot-1-annualManagementCharge': ['Error: amountInvalid'],
      });
    });

    it('returns no errors when all pot fields and contributions are valid', () => {
      const data = createPotsData({
        pots: [
          {
            name: 'Pot 1',
            currentValue: '26,900',
            taxFreeCash: '5,000.50',
            employeeContribution: {
              mode: 'percentage',
              value: '5',
              frequency: 'month',
            },
            employerContribution: {
              mode: 'fixed',
              value: '250',
              frequency: 'month',
            },
            annualManagementCharge: '0.75',
          },
        ],
      });
      expect(validatePotDetails(data)).toEqual({});
    });
  });

  describe('hasPensionErrors', () => {
    it('returns false when error object is empty', () => {
      expect(hasPensionErrors({})).toBe(false);
    });

    it('returns true when error object has keys', () => {
      expect(hasPensionErrors({ field: ['Error message'] })).toBe(true);
    });
  });
});
