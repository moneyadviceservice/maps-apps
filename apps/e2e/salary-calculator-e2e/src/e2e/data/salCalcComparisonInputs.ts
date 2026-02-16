/**
 * SALARY CALCULATOR - COMPARISON MODE TEST DATA
 *
 * Tax Year: 2025-26
 * Last Updated: December 2025
 * Last Verified: December 2025
 * Next Review: April 2026
 *
 * ANNUAL MAINTENANCE REQUIRED:
 * UK tax rates change every April. When this happens, tests will fail.
 *
 * Update Process:
 * 1. Confirm developers updated calculation logic (apps/salary-calculator/utils/rates/)
 * 2. Verify each test against HMRC calculator: https://www.tax.service.gov.uk/estimate-paye-take-home-pay/your-pay
 * 3. Update expectedComparison values with HMRC results
 * 4. Update tax year header above
 * 5. Run tests: npx nx run salary-calculator-e2e:e2e (expect 16 passing)
 * 6. Create PR with HMRC verification screenshots
 *
 * Do not update values without HMRC verification.
 * See README-MAINTENANCE.md for detailed instructions.
 */

// Define the salary input type for each side of the comparison
interface SalaryInput {
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
}

// Define the ComparisonTestCase type
interface ComparisonTestCase {
  description: string;
  salary1: SalaryInput;
  salary2: SalaryInput;
  expectedBreakdown?: {
    salary1?: Record<string, Record<string, string>>;
    salary2?: Record<string, Record<string, string>>;
  };
  expectedComparison?: {
    salary1?: Record<string, string>;
    salary2?: Record<string, string>;
  };
}

// Export comparison test cases
export const comparisonTestCases: ComparisonTestCase[] = [
  // Compare two annual salaries: England vs Scotland
  {
    description: 'Compare £35,000 England vs £35,000 Scotland',
    salary1: {
      grossIncome: '35000',
      frequency: 'annual',
      taxCode: '1257L',
      country: 'England/NI/Wales',
      scotland: false,
    },
    salary2: {
      grossIncome: '35000',
      frequency: 'annual',
      taxCode: 'S1257L',
      country: 'Scotland',
      scotland: true,
    },
    expectedComparison: {
      salary1: { 'Monthly net salary': '£2,393.30' },
      salary2: { 'Monthly net salary': '£2,389.40' },
    },
  },

  // Compare different salary amounts with pension contributions
  {
    description: 'Compare £40,000 (5% pension) vs £50,000 (10% pension)',
    salary1: {
      grossIncome: '40000',
      frequency: 'annual',
      taxCode: '1257L',
      country: 'England/NI/Wales',
      scotland: false,
      pensionPercent: '5',
    },
    salary2: {
      grossIncome: '50000',
      frequency: 'annual',
      taxCode: '1257L',
      country: 'England/NI/Wales',
      scotland: false,
      pensionPercent: '10',
    },
    expectedComparison: {
      salary1: {
        'Monthly net salary': '£2,559.97',
      },
      salary2: {
        'Monthly net salary': '£2,959.97',
      },
    },
  },

  // Compare annual vs monthly frequency
  {
    description: 'Compare £30,000 annual vs £2,500 monthly',
    salary1: {
      grossIncome: '30000',
      frequency: 'annual',
      taxCode: '1257L',
      country: 'England/NI/Wales',
      scotland: false,
    },
    salary2: {
      grossIncome: '2500',
      frequency: 'monthly',
      taxCode: '1257L',
      country: 'England/NI/Wales',
      scotland: false,
    },
    expectedComparison: {
      salary1: {
        'Monthly net salary': '£2,093.30',
      },
      salary2: {
        'Monthly net salary': '£2,093.30',
      },
    },
  },

  // Compare with student loans
  {
    description: 'Compare £45,000 (Plan 1) vs £45,000 (Plan 2)',
    salary1: {
      grossIncome: '45000',
      frequency: 'annual',
      taxCode: '1257L',
      country: 'England/NI/Wales',
      scotland: false,
      studentLoanPlans: ['checkbox-plan1'],
    },
    salary2: {
      grossIncome: '45000',
      frequency: 'annual',
      taxCode: '1257L',
      country: 'England/NI/Wales',
      scotland: false,
      studentLoanPlans: ['checkbox-plan2'],
    },
    expectedComparison: {
      salary1: {
        'Monthly net salary': '£2,851.30',
      },
      salary2: {
        'Monthly net salary': '£2,870.30',
      },
    },
  },

  // Compare hourly vs annual with various options
  {
    description: 'Compare £25/hour (35hrs) Scotland vs £46,000 annual England',
    salary1: {
      grossIncome: '25',
      frequency: 'hourly',
      hoursPerWeek: 35,
      taxCode: 'S1257L',
      country: 'Scotland',
      scotland: true,
      pensionPercent: '5',
      studentLoanPlans: ['checkbox-plan1'],
    },
    salary2: {
      grossIncome: '46000',
      frequency: 'annual',
      taxCode: '1257L',
      country: 'England/NI/Wales',
      scotland: false,
      pensionFixed: '200',
      statePension: 'yes',
    },
    expectedComparison: {
      salary1: {
        'Monthly net salary': '£2,715.88',
      },
      salary2: {
        'Monthly net salary': '£3,116.17',
      },
    },
  },

  // Compare different pension percentages
  {
    description: 'Compare £32,000 (no pension) vs £32,000 (8% pension)',
    salary1: {
      grossIncome: '32000',
      frequency: 'annual',
      taxCode: '1257L',
      country: 'England/NI/Wales',
      scotland: false,
    },
    salary2: {
      grossIncome: '32000',
      frequency: 'annual',
      taxCode: '1257L',
      country: 'England/NI/Wales',
      scotland: false,
      pensionPercent: '8',
    },
    expectedComparison: {
      salary1: {
        'Monthly net salary': '£2,213.30',
      },
      salary2: {
        'Monthly net salary': '£2,042.63',
      },
    },
  },

  // Compare weekly vs daily salaries
  {
    description: 'Compare £800 weekly vs £160 daily (5 days)',
    salary1: {
      grossIncome: '800',
      frequency: 'weekly',
      taxCode: 'S1257L',
      country: 'Scotland',
      scotland: true,
    },
    salary2: {
      grossIncome: '160',
      frequency: 'daily',
      daysPerWeek: 5,
      taxCode: 'S1257L',
      country: 'Scotland',
      scotland: true,
    },
    expectedComparison: {
      salary1: {
        'Monthly net salary': '£2,779.90',
      },
      salary2: {
        'Monthly net salary': '£2,779.90',
      },
    },
  },

  // Compare same salary with different tax codes
  {
    description: 'Compare £38,000 with 1257L vs BR tax code',
    salary1: {
      grossIncome: '38000',
      frequency: 'annual',
      taxCode: '1257L',
      country: 'England/NI/Wales',
      scotland: false,
    },
    salary2: {
      grossIncome: '38000',
      frequency: 'annual',
      taxCode: 'BR',
      country: 'England/NI/Wales',
      scotland: false,
    },
    expectedComparison: {
      salary1: {
        'Monthly net salary': '£2,573.30',
      },
      salary2: {
        'Monthly net salary': '£2,363.80',
      },
    },
  },

  // Compare multiple student loan plans (manual calculation verified)
  {
    description: 'Compare £45,000 (Plan 1 + PG) vs £45,000 (Plan 4 + Plan 5)',
    salary1: {
      grossIncome: '45000',
      frequency: 'annual',
      taxCode: '1257L',
      country: 'England/NI/Wales',
      scotland: false,
      studentLoanPlans: ['checkbox-plan1', 'checkbox-plan-post-grad'],
    },
    salary2: {
      grossIncome: '45000',
      frequency: 'annual',
      taxCode: '1257L',
      country: 'England/NI/Wales',
      scotland: false,
      studentLoanPlans: ['checkbox-plan4', 'checkbox-plan5'],
    },
    expectedComparison: {
      salary1: {
        'Monthly net salary': '£2,731.30',
      },
      salary2: {
        'Monthly net salary': '£2,843.30',
      },
    },
  },

  // Compare over 66 + blind person's allowance (manual calculation verified)
  {
    description:
      'Compare £105,000 vs £155,000 (both over 66 with blind allowance)',
    salary1: {
      grossIncome: '105000',
      frequency: 'annual',
      taxCode: '1257L',
      country: 'England/NI/Wales',
      scotland: false,
      statePension: 'yes',
      blindPerson: 'yes',
    },
    salary2: {
      grossIncome: '155000',
      frequency: 'annual',
      taxCode: '1257L',
      country: 'England/NI/Wales',
      scotland: false,
      statePension: 'yes',
      blindPerson: 'yes',
    },
    expectedComparison: {
      salary1: {
        'Monthly net salary': '£6,297.33',
      },
      salary2: {
        'Monthly net salary': '£8,725.29',
      },
    },
  },
];
