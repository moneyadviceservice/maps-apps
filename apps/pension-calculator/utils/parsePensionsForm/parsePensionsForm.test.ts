import { pots } from 'tests/mocks/pots';
import type { DefinedIncomeData, PotsOfMoneyData } from 'types/pensions';

import {
  ensureIncomePensionsDefaults,
  ensurePensionsDefaults,
  parseIncomePensionForm,
  parsePensionPotsForm,
} from './parsePensionsForm';

jest.mock('data/frequency', () => ({
  parseFrequency: (freq: string) => freq || 'month',
}));

jest.mock('types/pensions', () => ({
  defaultPotsOfMoneyData: jest.fn().mockReturnValue({
    hasPotOfMoneyPension: '',
    pots: [
      {
        name: 'Default Pot',
        currentValue: '0',
        taxFreeCash: '0',
        employeeContribution: {
          mode: 'percentage',
          value: '5',
          frequency: 'month',
        },
        employerContribution: {
          mode: 'percentage',
          value: '3',
          frequency: 'month',
        },
        annualManagementCharge: '0.5',
      },
    ],
  }),
  defaultDefinedIncomeData: jest.fn().mockReturnValue({
    hasIncomePension: '',
    pots: [
      {
        name: 'Default Income Pot',
        estimatedYearlyValue: '0',
        ageItStartsPaying: '65',
        taxFreeCash: '0',
      },
    ],
    annualManagementCharge: '0.5',
  }),
  emptyPot: jest.fn().mockReturnValue({
    name: '',
    currentValue: '',
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
  }),
  emptyIncomePot: jest.fn().mockReturnValue({
    name: '',
    estimatedYearlyValue: '',
    ageItStartsPaying: '',
    taxFreeCash: '',
  }),
}));

jest.mock('utils/formValue', () => ({
  asString: (val: unknown) =>
    typeof val === 'string' ? val : val ? String(val) : '',
}));

jest.mock('utils/pensionFieldIds', () => ({
  POT_COUNT_NAME: 'potCount',
  POT_SCREENING_NAME: 'hasPotOfMoneyPension',
  INCOME_SCREENING_NAME: 'hasIncomePension',
  potNameId: (i: number) => `pot-name-${i}`,
  potCurrentValueId: (i: number) => `pot-current-value-${i}`,
  potTaxFreeCashId: (i: number) => `pot-tax-free-cash-${i}`,
  contributionFieldId: (kind: string, field: string, i?: number) =>
    i !== undefined ? `${kind}-${field}-${i}` : `${kind}-${field}`,
  incomePotFieldId: (i: number, field: string) => `income-pot-${i}-${field}`,
  estimatedYearlyValueId: (i: number) => `income-pot-${i}-yearly-value`,
  potAgeItStartsPayingId: (i: number) => `income-pot-${i}-start-age`,
}));

describe('Pensions Form Parser Utilities', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parsePensionPotsForm', () => {
    test.each([
      ['yes', 'yes'],
      ['no', 'no'],
      ['invalid', ''],
      ['', ''],
    ])('parses screening value "%s" into "%s"', (input, expected) => {
      const result = parsePensionPotsForm({ hasPotOfMoneyPension: input });
      expect(result.hasPotOfMoneyPension).toBe(expected);
    });

    test('parses pots from structured body.pots array if present', () => {
      const body = {
        pots: pots,
      };

      const result = parsePensionPotsForm(body);

      expect(result.pots).toEqual(pots);
    });

    test('parses pots from indexed form fields when structured pots are absent', () => {
      const body: Record<string, unknown> = {
        potCount: '2',
        'pot-name-0': 'Indexed Pot 1',
        'pot-current-value-0': '2000',
        'pot-tax-free-cash-0': '500',
        'employee-mode-0': 'fixed',
        'employee-value-0': '100',
        'employee-frequency-0': 'month',
        'employer-mode-0': 'percentage',
        'employer-value-0': '5',
        'employer-frequency-0': 'month',
        'pot-name-1': 'Indexed Pot 2',
        'pot-current-value-1': '4000',
        'pot-tax-free-cash-1': '1000',
        'employee-mode-1': 'percentage',
        'employee-value-1': '10',
        'employee-frequency-1': 'month',
        'employer-mode-1': 'fixed',
        'employer-value-1': '200',
        'employer-frequency-1': 'annual',
        annualManagementCharge: '0.5',
      };

      const result = parsePensionPotsForm(body);

      expect(result.pots).toHaveLength(2);
      expect(result.pots[0]).toEqual({
        name: 'Indexed Pot 1',
        currentValue: '2000',
        taxFreeCash: '500',
        employeeContribution: {
          mode: 'fixed',
          value: '100',
          frequency: 'month',
        },
        employerContribution: {
          mode: 'percentage',
          value: '5',
          frequency: 'month',
        },
        annualManagementCharge: '0.5',
      });
      expect(result.pots[1]).toEqual({
        name: 'Indexed Pot 2',
        currentValue: '4000',
        taxFreeCash: '1000',
        employeeContribution: {
          mode: 'percentage',
          value: '10',
          frequency: 'month',
        },
        employerContribution: {
          mode: 'fixed',
          value: '200',
          frequency: 'annual',
        },
        annualManagementCharge: '0.5',
      });
    });

    test.each([
      ['employee', 'percentage', 'percentage'],
      ['employer', 'percentage', 'percentage'],
      ['employee', 'fixed', 'fixed'],
      ['employer', 'fixed', 'fixed'],
    ])(
      'parses contribution mode correctly for %s (input mode: %s)',
      (kind, inputMode, expectedMode) => {
        const body = {
          [`${kind}-mode-0`]: inputMode,
          [`${kind}-value-0`]: '100',
          [`${kind}-frequency-0`]: 'annual',
        };

        const result = parsePensionPotsForm(body);
        const contribution =
          kind === 'employee'
            ? result.pots[0].employeeContribution
            : result.pots[0].employerContribution;

        expect(contribution.mode).toBe(expectedMode);
        expect(contribution.value).toBe('100');
        expect(contribution.frequency).toBe('annual');
      },
    );

    test('parses nested contribution objects in structured pots array when provided', () => {
      const body = {
        pots: [
          {
            employeeContribution: {
              mode: 'fixed',
              value: '150',
              frequency: 'month',
            },
          },
        ],
      };

      const result = parsePensionPotsForm(body);

      expect(result.pots[0].employeeContribution).toEqual({
        mode: 'fixed',
        value: '150',
        frequency: 'month',
      });
    });
  });

  describe('parseIncomePensionForm', () => {
    test.each([
      ['yes', 'yes'],
      ['no', 'no'],
      ['invalid', ''],
      ['', ''],
    ])('parses income screening value "%s" into "%s"', (input, expected) => {
      const result = parseIncomePensionForm({ hasIncomePension: input });
      expect(result.hasIncomePension).toBe(expected);
    });

    test('parses income pots from structured body.pots array if present', () => {
      const body = {
        pots: [
          {
            name: 'Income Pot 1',
            currentValue: '3000',
            ageItStartsPaying: '60',
            taxFreeCash: '0',
          },
        ],
      };

      const result = parseIncomePensionForm(body);

      expect(result.pots).toEqual([
        {
          name: 'Income Pot 1',
          estimatedYearlyValue: '3000',
          ageItStartsPaying: '60',
          taxFreeCash: '0',
        },
      ]);
    });

    test('parses income pots from indexed form fields when structured pots are absent', () => {
      const body: Record<string, unknown> = {
        potCount: '1',
        'income-pot-0-name': 'Defined Benefit Pension',
        'income-pot-0-yearly-value': '5000',
        'income-pot-0-start-age': '65',
        'pot-tax-free-cash-0': '1000',
      };

      const result = parseIncomePensionForm(body);

      expect(result.pots).toEqual([
        {
          name: 'Defined Benefit Pension',
          estimatedYearlyValue: '5000',
          ageItStartsPaying: '65',
          taxFreeCash: '1000',
        },
      ]);
    });
  });

  describe('ensurePensionsDefaults', () => {
    test.each([
      ['null', null],
      ['undefined', undefined],
    ])('returns defaultPotsOfMoneyData when input is %s', (_, input) => {
      const result = ensurePensionsDefaults(input);

      expect(result).toEqual({
        hasPotOfMoneyPension: '',
        pots: [
          {
            name: 'Default Pot',
            currentValue: '0',
            taxFreeCash: '0',
            employeeContribution: {
              mode: 'percentage',
              value: '5',
              frequency: 'month',
            },
            employerContribution: {
              mode: 'percentage',
              value: '3',
              frequency: 'month',
            },
            annualManagementCharge: '0.5',
          },
        ],
      });
    });

    test('merges partial pots data with defaults accurately', () => {
      const partialData: Partial<PotsOfMoneyData> = {
        hasPotOfMoneyPension: 'yes',
        pots: [
          {
            name: 'Custom Pot',
            currentValue: '',
            taxFreeCash: '',
            employeeContribution: {
              mode: 'fixed',
              value: '200',
              frequency: 'month',
            },
            employerContribution: {
              mode: 'percentage',
              value: '3',
              frequency: 'month',
            },
            annualManagementCharge: '0.5',
          },
        ],
      };

      const result = ensurePensionsDefaults(partialData);

      expect(result.hasPotOfMoneyPension).toBe('yes');
      expect(result.pots[0]).toEqual({
        name: 'Custom Pot',
        currentValue: '',
        taxFreeCash: '',
        employeeContribution: {
          mode: 'fixed',
          value: '200',
          frequency: 'month',
        },
        employerContribution: {
          mode: 'percentage',
          value: '3',
          frequency: 'month',
        },
        annualManagementCharge: '0.5',
      });
    });
  });

  describe('ensureIncomePensionsDefaults', () => {
    test.each([
      ['null', null],
      ['undefined', undefined],
    ])('returns defaultDefinedIncomeData when input is %s', (_, input) => {
      const result = ensureIncomePensionsDefaults(input);

      expect(result).toEqual({
        hasIncomePension: '',
        pots: [
          {
            name: 'Default Income Pot',
            estimatedYearlyValue: '0',
            ageItStartsPaying: '65',
            taxFreeCash: '0',
          },
        ],
        annualManagementCharge: '0.5',
      });
    });

    test('merges partial income pensions data with defaults accurately', () => {
      const partialData: Partial<DefinedIncomeData> = {
        hasIncomePension: 'yes',
        pots: [
          {
            name: 'Custom Income Pot',
            estimatedYearlyValue: '2500',
            ageItStartsPaying: '62',
            taxFreeCash: '0',
          },
        ],
      };

      const result = ensureIncomePensionsDefaults(partialData);

      expect(result.hasIncomePension).toBe('yes');
      expect(result.pots[0]).toEqual({
        name: 'Custom Income Pot',
        estimatedYearlyValue: '2500',
        ageItStartsPaying: '62',
        taxFreeCash: '0',
      });
    });
  });
});
