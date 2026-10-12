import type { PotsOfMoneyData } from 'types/pensions';

import { ensurePensionsDefaults, parsePensionsForm } from './parsePensionsForm';

jest.mock('data/frequency', () => ({
  parseFrequency: (freq: string) => freq || 'monthly',
}));

jest.mock('types/pensions', () => ({
  defaultPotsOfMoneyData: jest.fn().mockReturnValue({
    hasPotOfMoneyPension: '',
    pots: [{ name: 'Default Pot', currentValue: '0', taxFreeCash: '0' }],
    employeeContribution: {
      mode: 'percentage',
      value: '5',
      frequency: 'monthly',
    },
    employerContribution: {
      mode: 'percentage',
      value: '3',
      frequency: 'monthly',
    },
    annualManagementCharge: '0.5',
  }),
  emptyPot: jest
    .fn()
    .mockReturnValue({ name: '', currentValue: '', taxFreeCash: '' }),
}));

jest.mock('utils/formValue', () => ({
  asString: (val: unknown) =>
    typeof val === 'string' ? val : val ? String(val) : '',
}));

jest.mock('utils/pensionFieldIds', () => ({
  POT_COUNT_NAME: 'potCount',
  POT_SCREENING_NAME: 'hasPotOfMoneyPension',
  potNameId: (i: number) => `pot-name-${i}`,
  potCurrentValueId: (i: number) => `pot-current-value-${i}`,
  potTaxFreeCashId: (i: number) => `pot-tax-free-cash-${i}`,
  contributionFieldId: (kind: string, field: string) => `${kind}-${field}`,
}));

describe('Pensions Form Parser Utilities', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parsePensionsForm', () => {
    test.each([
      ['yes', 'yes'],
      ['no', 'no'],
      ['invalid', ''],
      ['', ''],
    ])('parses screening value "%s" into "%s"', (input, expected) => {
      const result = parsePensionsForm({ hasPotOfMoneyPension: input });
      expect(result.hasPotOfMoneyPension).toBe(expected);
    });

    test('parses pots from structured body.pots array if present', () => {
      const body = {
        pots: [
          { name: 'Pot 1', currentValue: '1000', taxFreeCash: '250' },
          { name: 'Pot 2', currentValue: '5000', taxFreeCash: '1250' },
        ],
      };

      const result = parsePensionsForm(body);

      expect(result.pots).toEqual([
        { name: 'Pot 1', currentValue: '1000', taxFreeCash: '250' },
        { name: 'Pot 2', currentValue: '5000', taxFreeCash: '1250' },
      ]);
    });

    test('parses pots from indexed form fields when structured pots are absent', () => {
      const body: Record<string, unknown> = {
        potCount: '2',
        'pot-name-0': 'Indexed Pot 1',
        'pot-current-value-0': '2000',
        'pot-tax-free-cash-0': '500',
        'pot-name-1': 'Indexed Pot 2',
        'pot-current-value-1': '4000',
        'pot-tax-free-cash-1': '1000',
      };

      const result = parsePensionsForm(body);

      expect(result.pots).toHaveLength(2);
      expect(result.pots[0]).toEqual({
        name: 'Indexed Pot 1',
        currentValue: '2000',
        taxFreeCash: '500',
      });
      expect(result.pots[1]).toEqual({
        name: 'Indexed Pot 2',
        currentValue: '4000',
        taxFreeCash: '1000',
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
          [`${kind}-mode`]: inputMode,
          [`${kind}-value`]: '100',
          [`${kind}-frequency`]: 'annual',
        };

        const result = parsePensionsForm(body);
        const contribution =
          kind === 'employee'
            ? result.employeeContribution
            : result.employerContribution;

        expect(contribution.mode).toBe(expectedMode);
        expect(contribution.value).toBe('100');
        expect(contribution.frequency).toBe('annual');
      },
    );

    test('parses nested contribution objects when direct flat keys are omitted', () => {
      const body = {
        employeeContribution: {
          mode: 'fixed',
          value: '150',
          frequency: 'monthly',
        },
      };

      const result = parsePensionsForm(body);

      expect(result.employeeContribution).toEqual({
        mode: 'fixed',
        value: '150',
        frequency: 'monthly',
      });
    });

    test('parses annualManagementCharge correctly', () => {
      const result = parsePensionsForm({ annualManagementCharge: '0.75' });
      expect(result.annualManagementCharge).toBe('0.75');
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
        pots: [{ name: 'Default Pot', currentValue: '0', taxFreeCash: '0' }],
        employeeContribution: {
          mode: 'percentage',
          value: '5',
          frequency: 'monthly',
        },
        employerContribution: {
          mode: 'percentage',
          value: '3',
          frequency: 'monthly',
        },
        annualManagementCharge: '0.5',
      });
    });

    test('merges partial data with defaults accurately', () => {
      const partialData: Partial<PotsOfMoneyData> = {
        hasPotOfMoneyPension: 'yes',
        pots: [{ name: 'Custom Pot', currentValue: '', taxFreeCash: '' }],
        employeeContribution: {
          mode: 'fixed',
          value: '200',
          frequency: 'month',
        },
      };

      const result = ensurePensionsDefaults(partialData);

      expect(result.hasPotOfMoneyPension).toBe('yes');
      expect(result.pots[0]).toEqual({
        name: 'Custom Pot',
        currentValue: '',
        taxFreeCash: '',
      });
      expect(result.employeeContribution).toEqual({
        mode: 'fixed',
        value: '200',
        frequency: 'month',
      });
      expect(result.employerContribution).toEqual({
        mode: 'percentage',
        value: '3',
        frequency: 'monthly',
      });
    });
  });
});
