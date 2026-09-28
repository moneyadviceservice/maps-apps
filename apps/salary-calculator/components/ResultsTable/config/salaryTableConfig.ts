import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';

import type { SalaryBreakdownOutput } from '../../../utils/calculations/getSalaryBreakdown/getSalaryBreakdown';
import type {
  FrequencyType,
  ResultsTableColumn,
  ResultsTableRow,
} from '../ResultsTable';

const tableDivider = 'border-b border-white/90';

const personalAllowanceDivisors: Record<FrequencyType, number> = {
  yearly: 1,
  monthly: 12,
  weekly: 52,
  daily: 365,
};

/**
 * Creates salary breakdown table rows configuration
 * `isBold` toggles bold for single vs comparison
 * `includeTakeHome` adds an optional "Take home pay" row
 */
export const createSalaryTableRows = (
  isBold = true,
  includeTakeHome = false,
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
      key: 'totalDeductions',
      label: { en: 'Deductions', cy: 'Didyniadau' },
      isBold: true,
      getValue: (
        frequency?: FrequencyType,
        breakdown?: SalaryBreakdownOutput,
      ) => {
        if (!frequency || !breakdown) return 0;

        const pension =
          Math.round(
            (breakdown.employeePensionContributions[frequency] ?? 0) * 100,
          ) / 100;
        const tax =
          Math.round((breakdown.incomeTax[frequency] ?? 0) * 100) / 100;
        const ni =
          Math.round((breakdown.nationalInsurance[frequency] ?? 0) * 100) / 100;
        const studentLoan =
          Math.round((breakdown.studentLoan.total[frequency] ?? 0) * 100) / 100;

        return pension + tax + ni + studentLoan;
      },
      className: 'text-gray-800 text-[18px] font-bold',
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
    {
      key: 'pensionContributions',
      label: { en: 'Pension contributions', cy: 'Cyfraniadau pensiwn' },
      getValue: (
        frequency?: FrequencyType,
        breakdown?: SalaryBreakdownOutput,
      ) =>
        frequency ? breakdown?.employeePensionContributions[frequency] ?? 0 : 0,
      className: `text-gray-800 text-[18px] ${tableDivider}`,
      expandableKey: 'pensionSummary',
      expandableTitle: { en: 'Pension summary', cy: 'Crynodeb Pensiwn' },
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
    breakdown,
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
    breakdown: breakdown1,
    getValue: (row, freq) => formatCurrency(row.getValue(freq, breakdown1)),
    className: `bg-gray-100`,
    headerClassName: `bg-gray-100 ${tableDivider}`, // subtle white bottom border
  },
  {
    header: { en: 'Salary 2', cy: 'Cyflog 2' },
    breakdown: breakdown2,
    getValue: (row, freq) => formatCurrency(row.getValue(freq, breakdown2)),
    className: `bg-yellow-100`,
    headerClassName: `bg-yellow-100 ${tableDivider}`, // subtle white bottom border
  },
];

/**
 * Formats the personal allowance for the selected frequency
 */
export const formatPersonalAllowance = (
  frequency: FrequencyType,
  breakdown: SalaryBreakdownOutput,
) =>
  formatCurrency(
    breakdown.personalAllowance / personalAllowanceDivisors[frequency],
  );
