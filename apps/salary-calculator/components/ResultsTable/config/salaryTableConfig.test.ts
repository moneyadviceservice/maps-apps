import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';

import {
  createSalaryTableRows,
  createSingleSalaryColumn,
  createComparisonColumns,
} from './salaryTableConfig';
import type { SalaryBreakdownOutput } from '../../../utils/calculations/getSalaryBreakdown/getSalaryBreakdown';
import { ResultsTableRow } from '../ResultsTable';

jest.mock('@maps-react/pension-tools/utils/formatCurrency', () => ({
  formatCurrency: jest.fn((value?: number) =>
    typeof value === 'number' ? `£${value.toFixed(2)}` : '£0.00',
  ),
}));

describe('salaryTableConfig', () => {
  const mockBreakdown: SalaryBreakdownOutput = {
    grossSalary: {
      yearly: 50000,
      monthly: 4166.67,
      weekly: 961.54,
      daily: 136.99,
    },
    personalAllowance: 12570,
    totalDeductions: {
      yearly: 12114,
      monthly: 1009.5,
      weekly: 233.35,
      daily: 33.19,
    },
    employeePensionContributions: {
      yearly: 2500,
      monthly: 208.33,
      weekly: 48.08,
      daily: 6.85,
    },
    studentLoan: {
      repayments: {
        undergrad: {
          selected: true,
          amount: {
            yearly: 1704,
            monthly: 142,
            weekly: 32.77,
            daily: 4.67,
          },
        },
        postgrad: {
          selected: false,
          amount: {
            yearly: 0,
            monthly: 0,
            weekly: 0,
            daily: 0,
          },
        },
      },
      total: {
        yearly: 1704,
        monthly: 142,
        weekly: 32.77,
        daily: 4.67,
      },
    },
    incomeTax: {
      yearly: 7486,
      monthly: 623.83,
      weekly: 143.96,
      daily: 20.51,
    },
    nationalInsurance: {
      yearly: 4424,
      monthly: 368.67,
      weekly: 85.08,
      daily: 12.12,
    },
    netSalary: {
      yearly: 37886,
      monthly: 3157.17,
      weekly: 727.19,
      daily: 103.8,
    },
  };

  describe('createSalaryTableRows', () => {
    test('creates correct number of rows for single salary', () => {
      const rows = createSalaryTableRows(true);
      expect(rows).toHaveLength(7);
    });

    test('creates correct number of rows for comparison salary with Take home', () => {
      const rows = createSalaryTableRows(false, true);
      expect(rows).toHaveLength(8); // includes Take home
    });

    test('creates gross income row with correct values', () => {
      const rows = createSalaryTableRows(true);
      const grossRow = rows[0];

      expect(grossRow.label).toEqual({ en: 'Gross income', cy: 'Incwm gros' });
      expect(grossRow.getValue('yearly', mockBreakdown)).toBe(50000);
      expect(grossRow.getValue('monthly', mockBreakdown)).toBe(4166.67);
      expect(grossRow.getValue('weekly', mockBreakdown)).toBe(961.54);
      expect(grossRow.getValue('daily', mockBreakdown)).toBe(136.99);
      expect(grossRow.isBold).toBe(true);
    });

    test('calculates personal allowance for all frequencies', () => {
      const rows = createSalaryTableRows(true);
      const paRow = rows[1];

      expect(paRow.label).toEqual({
        en: 'Personal allowance',
        cy: 'Lwfans personol',
      });
      expect(paRow.getValue('yearly', mockBreakdown)).toBe(12570);
      expect(paRow.getValue('monthly', mockBreakdown)).toBeCloseTo(
        12570 / 12,
        2,
      );
      expect(paRow.getValue('weekly', mockBreakdown)).toBeCloseTo(
        12570 / 52,
        2,
      );
      expect(paRow.getValue('daily', mockBreakdown)).toBeCloseTo(
        12570 / 365,
        2,
      );
    });

    test('includes Take home pay row when includeTakeHome is true', () => {
      const rows = createSalaryTableRows(false, true);
      const takeHomeRow = rows.at(-1);

      expect(takeHomeRow?.label).toEqual({
        en: 'Take home pay',
        cy: 'Cyflog i’w gymryd adref',
      });
      expect(takeHomeRow?.getValue('yearly', mockBreakdown)).toBe(
        mockBreakdown.netSalary.yearly,
      );
    });

    test('creates total deductions row', () => {
      const rows = createSalaryTableRows(true);
      const deductionsRow = rows[2];

      expect(deductionsRow.label).toEqual({
        en: 'Deductions',
        cy: 'Didyniadau',
      });
      expect(deductionsRow.getValue('monthly', mockBreakdown)).toBe(1009.5);
    });

    test('creates pension contributions row', () => {
      const rows = createSalaryTableRows(true);
      const pensionRow = rows[3];

      expect(pensionRow.label).toEqual({
        en: 'Pension contributions',
        cy: 'Cyfraniadau pensiwn',
      });
      expect(pensionRow.getValue('monthly', mockBreakdown)).toBe(208.33);
    });

    test('creates student loan row', () => {
      const rows = createSalaryTableRows(true);
      const loanRow = rows[4];

      expect(loanRow.label).toEqual({
        en: 'Student loan',
        cy: 'Benthyciad myfyrwyr',
      });
      expect(loanRow.getValue('monthly', mockBreakdown)).toBe(142);
    });

    test('creates tax row', () => {
      const rows = createSalaryTableRows(true);
      const taxRow = rows[5];

      expect(taxRow.label).toEqual({ en: 'Tax', cy: 'Treth' });
      expect(taxRow.getValue('monthly', mockBreakdown)).toBe(623.83);
    });

    test('creates national insurance row', () => {
      const rows = createSalaryTableRows(true);
      const niRow = rows[6];

      expect(niRow.label).toEqual({
        en: 'National Insurance',
        cy: 'Yswiriant Gwladol',
      });
      expect(niRow.getValue('monthly', mockBreakdown)).toBe(368.67);
    });

    test('returns 0 when breakdown is undefined', () => {
      const rows = createSalaryTableRows(true);

      expect(rows[0].getValue('monthly')).toBe(0); // gross income
      expect(rows[1].getValue('monthly')).toBe(0); // personal allowance
      expect(rows[2].getValue('monthly')).toBe(0); // total deductions
      expect(rows[3].getValue('monthly')).toBe(0); // pension contributions
      expect(rows[4].getValue('monthly')).toBe(0); // student loan
      expect(rows[5].getValue('monthly')).toBe(0); // tax
      expect(rows[6].getValue('monthly')).toBe(0); // national insurance
    });

    test('returns 0 for take home pay when breakdown is undefined', () => {
      const rows = createSalaryTableRows(false, true);
      const takeHomeRow = rows.at(-1);

      expect(takeHomeRow?.getValue('yearly')).toBe(0);
    });
  });

  describe('createSingleSalaryColumn', () => {
    test('creates single column configuration', () => {
      const columns = createSingleSalaryColumn(mockBreakdown);
      expect(columns).toHaveLength(1);
    });

    test('formats currency values correctly', () => {
      const columns = createSingleSalaryColumn(mockBreakdown);
      const mockRow = {
        key: 'test',
        label: { en: 'Test', cy: 'Test' },
        getValue: () => 1234.56,
      };

      const result = columns[0].getValue(mockRow, 'monthly');
      expect(formatCurrency).toHaveBeenCalledWith(1234.56);
      expect(result).toBe('£1234.56');
    });

    test('has no header', () => {
      const columns = createSingleSalaryColumn(mockBreakdown);
      expect(columns[0].header).toBeUndefined();
    });

    test('returns £0.00 for undefined row value', () => {
      const columns = createSingleSalaryColumn(mockBreakdown);
      const mockRow = {
        key: 'test',
        label: { en: 'Test', cy: 'Test' },
        getValue: () => undefined,
      } as unknown as ResultsTableRow;
      (formatCurrency as jest.Mock).mockReturnValueOnce('£0.00');
      const result = columns[0].getValue(mockRow, 'monthly');
      expect(result).toBe('£0.00');
    });
  });

  describe('createComparisonColumns', () => {
    test('creates two column configurations', () => {
      const columns = createComparisonColumns(mockBreakdown, mockBreakdown);
      expect(columns).toHaveLength(2);
    });

    test('has correct headers', () => {
      const columns = createComparisonColumns(mockBreakdown, mockBreakdown);

      expect(columns[0].header).toEqual({ en: 'Salary 1', cy: 'Cyflog 1' });
      expect(columns[1].header).toEqual({ en: 'Salary 2', cy: 'Cyflog 2' });
    });

    test('applies correct CSS classes for comparison columns', () => {
      const columns = createComparisonColumns(mockBreakdown, mockBreakdown);

      expect(columns[0].className).toBe('bg-gray-100');
      expect(columns[0].headerClassName).toBe(
        'bg-gray-100 border-b border-white/90',
      );
      expect(columns[1].className).toBe('bg-yellow-100');
      expect(columns[1].headerClassName).toBe(
        'bg-yellow-100 border-b border-white/90',
      );
    });

    test('formats currency for both columns', () => {
      (formatCurrency as jest.Mock).mockClear();
      const columns = createComparisonColumns(mockBreakdown, mockBreakdown);
      const mockRow = {
        key: 'test',
        label: { en: 'Test', cy: 'Test' },
        getValue: () => undefined,
      } as unknown as ResultsTableRow;

      columns[0].getValue(mockRow, 'yearly');
      columns[1].getValue(mockRow, 'yearly');

      expect(formatCurrency).toHaveBeenCalledTimes(2);
    });
  });
});
