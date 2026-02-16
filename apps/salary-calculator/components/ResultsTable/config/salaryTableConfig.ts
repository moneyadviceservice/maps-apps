import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';

import type { SalaryBreakdownOutput } from '../../../utils/calculations/getSalaryBreakdown/getSalaryBreakdown';
import type {
  FrequencyType,
  ResultsTableColumn,
  ResultsTableRow,
} from '../ResultsTable';

const tableDivider = 'border-b border-white/90';

/**
 * Creates salary breakdown table rows configuration
 * `isBold` toggles bold for single vs comparison
 * `includeTakeHome` adds an optional "Take home pay" row
 */
export const createSalaryTableRows = (
  isBold = true,
  includeTakeHome = false,
  isComparison = false,
): ResultsTableRow[] => {
  const rows: ResultsTableRow[] = [
    {
      key: 'grossIncome',
      label: { en: 'Gross income', cy: 'Incwm gros' },
      getValue: (
        frequency?: FrequencyType,
        breakdown?: SalaryBreakdownOutput,
      ) => (frequency ? breakdown?.grossSalary[frequency] ?? 0 : 0),
      isBold,
      expandableKey: 'grossIncome',
    },
    {
      key: 'personalAllowance',
      label: { en: 'Personal allowance', cy: 'Lwfans personol' },
      labelClassName: 'italic text-gray-800',
      getValue: (
        frequency?: FrequencyType,
        breakdown?: SalaryBreakdownOutput,
      ) => {
        const annual = breakdown?.personalAllowance ?? 0;
        switch (frequency) {
          case 'monthly':
            return annual / 12;
          case 'weekly':
            return annual / 52;
          case 'daily':
            return annual / 365;
          case 'yearly':
            return annual;
          default:
            return 0;
        }
      },
      className: `
        text-gray-800
        ${isComparison ? 'text-[18px]' : 'text-[14px]'}
      `,
      expandableKey: 'personalAllowance',
    },
    {
      key: 'totalDeductions',
      label: { en: 'Deductions', cy: 'Didyniadau' },
      getValue: (
        frequency?: FrequencyType,
        breakdown?: SalaryBreakdownOutput,
      ) => (frequency ? breakdown?.totalDeductions[frequency] ?? 0 : 0),
      className: 'text-gray-800 text-[18px] font-bold',
    },
    {
      key: 'pensionContributions',
      label: { en: 'Pension contributions', cy: 'Cyfraniadau pensiwn' },
      getValue: (
        frequency?: FrequencyType,
        breakdown?: SalaryBreakdownOutput,
      ) =>
        frequency ? breakdown?.employeePensionContributions[frequency] ?? 0 : 0,
      className: `text-gray-800 text-[18px] ${tableDivider}`,
    },
    {
      key: 'studentLoan',
      label: { en: 'Student loan', cy: 'Benthyciad myfyrwyr' },
      getValue: (
        frequency?: FrequencyType,
        breakdown?: SalaryBreakdownOutput,
      ) => (frequency ? breakdown?.studentLoan.total[frequency] ?? 0 : 0),
      className: `text-gray-800 text-[18px] ${tableDivider}`,
    },
    {
      key: 'incomeTax',
      label: { en: 'Tax', cy: 'Treth' },
      getValue: (
        frequency?: FrequencyType,
        breakdown?: SalaryBreakdownOutput,
      ) => (frequency ? breakdown?.incomeTax[frequency] ?? 0 : 0),
      className: `text-gray-800 text-[18px] ${tableDivider}`,
      expandableKey: 'incomeTax',
    },
    {
      key: 'nationalInsurance',
      label: { en: 'National Insurance', cy: 'Yswiriant Gwladol' },
      getValue: (
        frequency?: FrequencyType,
        breakdown?: SalaryBreakdownOutput,
      ) => (frequency ? breakdown?.nationalInsurance[frequency] ?? 0 : 0),
      className: `text-gray-800 text-[18px] ${tableDivider}`,
    },
  ];

  if (includeTakeHome) {
    rows.push({
      key: 'takeHomePay',
      label: { en: 'Take home pay', cy: 'Cyflog i’w gymryd adref' },
      getValue: (
        frequency?: FrequencyType,
        breakdown?: SalaryBreakdownOutput,
      ) => (frequency ? breakdown?.netSalary[frequency] ?? 0 : 0),
      className: 'text-gray-800 text-[18px] font-semibold',
    });
  }

  return rows;
};

/**
 * Creates single salary column configuration
 */
export const createSingleSalaryColumn = (
  breakdown: SalaryBreakdownOutput,
): ResultsTableColumn[] => [
  {
    getValue: (row, freq) => formatCurrency(row.getValue(freq, breakdown)),
  },
];

/**
 * Creates comparison salary columns configuration
 */
export const createComparisonColumns = (
  breakdown1: SalaryBreakdownOutput,
  breakdown2: SalaryBreakdownOutput,
): ResultsTableColumn[] => [
  {
    header: { en: 'Salary 1', cy: 'Cyflog 1' },
    getValue: (row, freq) => formatCurrency(row.getValue(freq, breakdown1)),
    className: `bg-gray-100`,
    headerClassName: `bg-gray-100 ${tableDivider}`, // subtle white bottom border
  },
  {
    header: { en: 'Salary 2', cy: 'Cyflog 2' },
    getValue: (row, freq) => formatCurrency(row.getValue(freq, breakdown2)),
    className: `bg-yellow-100`,
    headerClassName: `bg-yellow-100 ${tableDivider}`, // subtle white bottom border
  },
];
