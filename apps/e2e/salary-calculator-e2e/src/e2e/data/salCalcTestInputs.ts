/**
 * SALARY CALCULATOR - SINGLE CALCULATION MODE TEST DATA
 *
 * Tax Year: 2025-26
 * Last Updated: December 2025
 * Last Verified: December 2025
 * Next Review: April 2026
 *
 * ANNUAL MAINTENANCE REQUIRED:
 * Follow the same update process as salCalcComparisonInputs.ts
 * See README-MAINTENANCE.md for detailed instructions
 */

// Define the TestCase type
interface TestCase {
  grossIncome: string;
  frequency: 'annual' | 'monthly' | 'weekly' | 'daily' | 'hourly';
  taxCode: string;
  country: 'England/NI/Wales' | 'Scotland';
  scotland: boolean;
  daysPerWeek?: number; // only for daily
  hoursPerWeek?: number; // only for hourly
  pensionPercent?: string;
  pensionFixed?: string;
  studentLoanPlans?: string[];
  statePension?: 'yes' | 'no';
  blindPerson?: 'yes' | 'no';
  expectedBreakdown: Record<string, Record<string, string>>;
  //expectedComparison: Record<string, Record<string, string>>;
}

// Export test cases
export const testCases: TestCase[] = [
  // Frequency: Annual
  {
    grossIncome: '35,000',
    frequency: 'annual',
    taxCode: '1257L',
    country: 'England/NI/Wales',
    scotland: false,
    pensionPercent: '5',
    studentLoanPlans: ['checkbox-plan1'],
    statePension: 'yes',
    blindPerson: 'yes',
    expectedBreakdown: {
      'Example Calculation': {
        'Annual salary': '£35,000',
        Country: 'England/NI/Wales',
        'Tax Code': '1257L',
      },
      'Annual Breakdown': {
        'Income tax': '£4,136.00',
        'National insurance': '£0.00',
        'Pension contributions': '£1,750.00',
        'Student loan repayment': '£804.00',
        'Net salary': '£28,310.00',
      },
      'Monthly Breakdown': {
        'Income tax': '£344.67',
        'National insurance': '£0.00',
        'Pension contributions': '£145.83',
        'Student loan repayment': '£67.00',
        'Net salary': '£2,359.17',
      },
      'Weekly Breakdown': {
        'Income tax': '£79.54',
        'National insurance': '£0.00',
        'Pension contributions': '£33.65',
        'Student loan repayment': '£15.00',
        'Net salary': '£544.88',
      },
      'Daily Breakdown': {
        'Income tax': '£15.91',
        'National insurance': '£0.00',
        'Pension contributions': '£6.73',
        'Student loan repayment': '£3.00',
        'Net salary': '£108.98',
      },
    },
  },

  // Frequency: Monthly
  {
    grossIncome: '5,000',
    frequency: 'monthly',
    taxCode: '1257L',
    country: 'England/NI/Wales',
    scotland: false,
    pensionFixed: '200',
    expectedBreakdown: {
      'Example Calculation': {
        'Annual salary': '£60,000',
        'Personal allowance': '£12,570.00',
        Country: 'England/NI/Wales',
        'Tax Code': '1257L',
      },
      'Annual Breakdown': {
        'Income tax': '£10,472.00',
        'National insurance': '£3,210.60',
        'Pension contributions': '£2,400.00',
        'Student loan repayment': '£0.00',
        'Net salary': '£43,917.40',
      },
      'Monthly Breakdown': {
        'Income tax': '£872.67',
        'National insurance': '£267.55',
        'Pension contributions': '£200.00',
        'Student loan repayment': '£0.00',
        'Net salary': '£3,659.78',
      },
      'Weekly Breakdown': {
        'Income tax': '£201.38',
        'National insurance': '£61.74',
        'Pension contributions': '£46.15',
        'Student loan repayment': '£0.00',
        'Net salary': '£844.57',
      },
      'Daily Breakdown': {
        'Income tax': '£40.28',
        'National insurance': '£12.35',
        'Pension contributions': '£9.23',
        'Student loan repayment': '£0.00',
        'Net salary': '£168.91',
      },
    },
  },

  // Frequency: Weekly
  {
    grossIncome: '890',
    frequency: 'weekly',
    taxCode: 'S1257L',
    country: 'Scotland',
    scotland: true,
    expectedBreakdown: {
      'Example Calculation': {
        'Annual salary': '£46,280',
        'Personal allowance': '£12,570.00',
        Country: 'Scotland',
        'Tax Code': 'S1257L',
      },
      'Annual Breakdown': {
        'Income tax': '£7,451.40',
        'National insurance': '£2,696.80',
        'Pension contributions': '£0.00',
        'Student loan repayment': '£0.00',
        'Net salary': '£36,131.80',
      },
      'Monthly Breakdown': {
        'Income tax': '£620.95',
        'National insurance': '£224.73',
        'Pension contributions': '£0.00',
        'Student loan repayment': '£0.00',
        'Net salary': '£3,010.98',
      },
      'Weekly Breakdown': {
        'Income tax': '£143.30',
        'National insurance': '£51.86',
        'Pension contributions': '£0.00',
        'Student loan repayment': '£0.00',
        'Net salary': '£694.84',
      },
      'Daily Breakdown': {
        'Income tax': '£28.66',
        'National insurance': '£10.37',
        'Pension contributions': '£0.00',
        'Student loan repayment': '£0.00',
        'Net salary': '£138.97',
      },
    },
  },

  // Frequency: Daily
  {
    grossIncome: '123',
    frequency: 'daily',
    daysPerWeek: 5,
    taxCode: 'S1257L',
    country: 'Scotland',
    scotland: true,
    expectedBreakdown: {
      'Example Calculation': {
        'Annual salary': '£31,980',
        'Personal allowance': '£12,570.00',
        Country: 'Scotland',
        'Tax Code': 'S1257L',
      },
      'Annual Breakdown': {
        'Income tax': '£3,898.62',
        'National insurance': '£1,552.80',
        'Pension contributions': '£0.00',
        'Student loan repayment': '£0.00',
        'Net salary': '£26,528.58',
      },
      'Monthly Breakdown': {
        'Income tax': '£324.89',
        'National insurance': '£129.40',
        'Pension contributions': '£0.00',
        'Student loan repayment': '£0.00',
        'Net salary': '£2,210.72',
      },
      'Weekly Breakdown': {
        'Income tax': '£74.97',
        'National insurance': '£29.86',
        'Pension contributions': '£0.00',
        'Student loan repayment': '£0.00',
        'Net salary': '£510.17',
      },
      'Daily Breakdown': {
        'Income tax': '£14.99',
        'National insurance': '£5.97',
        'Pension contributions': '£0.00',
        'Student loan repayment': '£0.00',
        'Net salary': '£102.03',
      },
    },
  },

  // Frequency: Hourly
  {
    grossIncome: '25',
    frequency: 'hourly',
    hoursPerWeek: 35,
    taxCode: 'S1257L',
    country: 'Scotland',
    scotland: true,
    expectedBreakdown: {
      'Example Calculation': {
        'Annual salary': '£45,500',
        'Personal allowance': '£12,570.00',
        Country: 'Scotland',
        'Tax Code': 'S1257L',
      },
      'Annual Breakdown': {
        'Income tax': '£7,123.80',
        'National insurance': '£2,634.40',
        'Pension contributions': '£0.00',
        'Student loan repayment': '£0.00',
        'Net salary': '£35,741.80',
      },
      'Monthly Breakdown': {
        'Income tax': '£593.65',
        'National insurance': '£219.53',
        'Pension contributions': '£0.00',
        'Student loan repayment': '£0.00',
        'Net salary': '£2,978.48',
      },
      'Weekly Breakdown': {
        'Income tax': '£137.00',
        'National insurance': '£50.66',
        'Pension contributions': '£0.00',
        'Student loan repayment': '£0.00',
        'Net salary': '£687.34',
      },
      'Daily Breakdown': {
        'Income tax': '£27.40',
        'National insurance': '£10.13',
        'Pension contributions': '£0.00',
        'Student loan repayment': '£0.00',
        'Net salary': '£137.47',
      },
    },
  },

  // State Pension Age - No National Insurance
  {
    grossIncome: '28,000',
    frequency: 'annual',
    taxCode: '1257L',
    country: 'England/NI/Wales',
    scotland: false,
    statePension: 'yes',
    expectedBreakdown: {
      'Example Calculation': {
        'Annual salary': '£28,000',
        Country: 'England/NI/Wales',
        'Tax Code': '1257L',
      },
      'Annual Breakdown': {
        'Income tax': '£3,086.00',
        'National insurance': '£0.00',
        'Pension contributions': '£0.00',
        'Student loan repayment': '£0.00',
        'Net salary': '£24,914.00',
      },
      'Monthly Breakdown': {
        'Income tax': '£257.17',
        'National insurance': '£0.00',
        'Pension contributions': '£0.00',
        'Student loan repayment': '£0.00',
        'Net salary': '£2,076.17',
      },
      'Weekly Breakdown': {
        'Income tax': '£59.35',
        'National insurance': '£0.00',
        'Pension contributions': '£0.00',
        'Student loan repayment': '£0.00',
        'Net salary': '£479.12',
      },
      'Daily Breakdown': {
        'Income tax': '£11.87',
        'National insurance': '£0.00',
        'Pension contributions': '£0.00',
        'Student loan repayment': '£0.00',
        'Net salary': '£95.82',
      },
    },
  },
];
