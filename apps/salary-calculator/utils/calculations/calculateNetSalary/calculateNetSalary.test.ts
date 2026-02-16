import { calculateNetSalary } from './calculateNetSalary';

import { convertToAnnualSalary } from '../../helpers/convertToAnnualSalary/convertToAnnualSalary';
import { FrequencyAmount } from '../calculateFrequencyAmount';
import { StudentLoanPlanSelection } from 'utils/deductions/studentLoan';

type NetSalaryTestCase = {
  description: string;
  grossSalary: number;
  country: 'England/NI/Wales' | 'Scotland';
  taxYear: '2025/26';
  isBlindPerson?: boolean;
  expected: {
    incomeTax?: number;
    nationalInsurance?: number;
    netSalary: FrequencyAmount;
  };
  convert?: {
    frequency: 'monthly' | 'weekly' | 'daily' | 'hourly';
    daysPerWeek?: number;
    hoursPerWeek?: number;
  };
  employeePensionContributions?: number;
};

const cases: NetSalaryTestCase[] = [
  {
    description: 'Case 1 - £79,000 annual gross salary in England',
    grossSalary: 79000,
    country: 'England/NI/Wales',
    taxYear: '2025/26',
    expected: {
      incomeTax: 19032,
      nationalInsurance: 3590.6,
      netSalary: {
        yearly: 56377.4,
        monthly: 4698.12,
        weekly: 1084.18,
        daily: 216.84,
      },
    },
  },
  {
    description: 'Case 2 - £79,000 annual gross salary in Scotland',
    grossSalary: 79000,
    country: 'Scotland',
    taxYear: '2025/26',
    expected: {
      incomeTax: 21313.8,
      nationalInsurance: 3590.6,
      netSalary: {
        yearly: 54095.6,
        monthly: 4507.97,
        weekly: 1040.3,
        daily: 208.06,
      },
    },
  },
  {
    description: 'Case 3 - £3123 monthly gross salary in England',
    grossSalary: 3123,
    country: 'England/NI/Wales',
    taxYear: '2025/26',
    expected: {
      incomeTax: 4981.2,
      nationalInsurance: 1992.48,
      netSalary: {
        yearly: 30502.32,
        monthly: 2541.86,
        weekly: 586.58,
        daily: 117.32,
      },
    },
    convert: { frequency: 'monthly' },
  },
  {
    description: 'Case 4 - £3123 monthly gross salary in Scotland',
    grossSalary: 3123,
    country: 'Scotland',
    taxYear: '2025/26',
    expected: {
      incomeTax: 5052.78,
      nationalInsurance: 1992.48,
      netSalary: {
        yearly: 30430.74,
        monthly: 2535.9,
        weekly: 585.21,
        daily: 117.04,
      },
    },
    convert: { frequency: 'monthly' },
  },
  {
    description: 'Case 5 - £583 weekly gross salary in England/Wales/NI',
    grossSalary: 583,
    country: 'England/NI/Wales',
    taxYear: '2025/26',
    expected: {
      incomeTax: 3549.2,
      nationalInsurance: 1419.68,
      netSalary: {
        yearly: 25347.12,
        monthly: 2112.26,
        weekly: 487.44,
        daily: 97.49,
      },
    },
    convert: { frequency: 'weekly' },
  },
  {
    description: 'Case 6 - £583 weekly gross salary in Scotland',
    grossSalary: 583,
    country: 'Scotland',
    taxYear: '2025/26',
    expected: {
      incomeTax: 3549.18,
      nationalInsurance: 1419.68,
      netSalary: {
        yearly: 25347.14,
        monthly: 2112.26,
        weekly: 487.45,
        daily: 97.49,
      },
    },
    convert: { frequency: 'weekly' },
  },
  {
    description:
      'Case 7 - £109 daily gross salary in England (5 days per week)',
    grossSalary: 109,
    country: 'England/NI/Wales',
    taxYear: '2025/26',
    expected: {
      incomeTax: 3154,
      nationalInsurance: 1261.6,
      netSalary: {
        yearly: 23924.4,
        monthly: 1993.7,
        weekly: 460.08,
        daily: 92.02,
      },
    },
    convert: { frequency: 'daily', daysPerWeek: 5 },
  },
  {
    description:
      'Case 8 - £109 daily gross salary in Scotland (5 days per week)',
    grossSalary: 109,
    country: 'Scotland',
    taxYear: '2025/26',
    expected: {
      incomeTax: 3134.22,
      nationalInsurance: 1261.6,
      netSalary: {
        yearly: 23944.18,
        monthly: 1995.35,
        weekly: 460.47,
        daily: 92.09,
      },
    },
    convert: { frequency: 'daily', daysPerWeek: 5 },
  },
  {
    description:
      'Case 9 - £119 hourly gross salary in England (35 hours per week)',
    grossSalary: 19,
    country: 'England/NI/Wales',
    taxYear: '2025/26',
    expected: {
      incomeTax: 4402,
      nationalInsurance: 1760.8,
      netSalary: {
        yearly: 28417.2,
        monthly: 2368.1,
        weekly: 546.48,
        daily: 109.3,
      },
    },
    convert: { frequency: 'hourly', hoursPerWeek: 35 },
  },
  {
    description:
      'Case 10 - £119 hourly gross salary in Scotland (35 hours per week)',
    grossSalary: 19,
    country: 'Scotland',
    taxYear: '2025/26',
    expected: {
      incomeTax: 4444.62,
      nationalInsurance: 1760.8,
      netSalary: {
        yearly: 28374.58,
        monthly: 2364.55,
        weekly: 545.67,
        daily: 109.13,
      },
    },
    convert: { frequency: 'hourly', hoursPerWeek: 35 },
  },
  {
    description: 'Case 11 - £134,000 annual gross salary in England',
    grossSalary: 134000,
    country: 'England/NI/Wales',
    taxYear: '2025/26',
    expected: {
      incomeTax: 46503,
      nationalInsurance: 4690.6,
      netSalary: {
        yearly: 82806.4,
        monthly: 6900.53,
        weekly: 1592.43,
        daily: 318.49,
      },
    },
  },
  {
    description: 'Case 12 - £134,000 annual gross salary in Scotland',
    grossSalary: 134000,
    country: 'Scotland',
    taxYear: '2025/26',
    expected: {
      incomeTax: 51986.1,
      nationalInsurance: 4690.6,
      netSalary: {
        yearly: 77323.3,
        monthly: 6443.61,
        weekly: 1486.99,
        daily: 297.4,
      },
    },
  },
  {
    description:
      'Case 13 - £30,000 annual gross salary in England with 5 percent monthly pension contributions',
    grossSalary: 30000,
    country: 'England/NI/Wales',
    taxYear: '2025/26',
    employeePensionContributions: 30000 * 0.05,
    expected: {
      incomeTax: 3186,
      nationalInsurance: 1394.4,
      netSalary: {
        yearly: 23919.6,
        monthly: 1993.3,
        weekly: 459.99,
        daily: 92,
      },
    },
  },
];

const casesBlindPerson: NetSalaryTestCase[] = [
  {
    description:
      "Case 1 (Blind person's) - £79,000 annual gross salary in England",
    grossSalary: 79000,
    country: 'England/NI/Wales',
    taxYear: '2025/26',
    isBlindPerson: true,
    expected: {
      netSalary: {
        yearly: 57629.4,
        monthly: 4802.45,
        weekly: 1108.26,
        daily: 221.65,
      },
    },
  },
  {
    description:
      "Case 2 (Blind person's) - £79,000 annual gross salary in Scotland",
    grossSalary: 79000,
    country: 'Scotland',
    taxYear: '2025/26',
    isBlindPerson: true,
    expected: {
      netSalary: {
        yearly: 55504.1,
        monthly: 4625.34,
        weekly: 1067.39,
        daily: 213.48,
      },
    },
  },
  {
    description:
      "Case 3 (Blind person's) - £3123 monthly gross salary in England",
    grossSalary: 3123,
    country: 'England/NI/Wales',
    taxYear: '2025/26',
    isBlindPerson: true,
    expected: {
      netSalary: {
        yearly: 31128.32,
        monthly: 2594.03,
        weekly: 598.62,
        daily: 119.72,
      },
    },
    convert: { frequency: 'monthly' },
  },
  {
    description:
      "Case 4 (Blind person's) - £3123 monthly gross salary in Scotland",
    grossSalary: 3123,
    country: 'Scotland',
    taxYear: '2025/26',
    isBlindPerson: true,
    expected: {
      netSalary: {
        yearly: 31088.04,
        monthly: 2590.67, // 2535.9
        weekly: 597.85,
        daily: 119.57,
      },
    },
    convert: { frequency: 'monthly' },
  },
  {
    description:
      "Case 5 (Blind person's) - £583 weekly gross salary in England/Wales/NI",
    grossSalary: 583,
    country: 'England/NI/Wales',
    taxYear: '2025/26',
    isBlindPerson: true,
    expected: {
      netSalary: {
        yearly: 25973.12,
        monthly: 2164.43,
        weekly: 499.48,
        daily: 99.9,
      },
    },
    convert: { frequency: 'weekly' },
  },
  {
    description:
      "Case 6 (Blind person's) - £583 weekly gross salary in Scotland",
    grossSalary: 583,
    country: 'Scotland',
    taxYear: '2025/26',
    isBlindPerson: true,
    expected: {
      netSalary: {
        yearly: 26001.39,
        monthly: 2166.78,
        weekly: 500.03,
        daily: 100.01,
      },
    },
    convert: { frequency: 'weekly' },
  },
  {
    description:
      "Case 7 (Blind person's) - £109 daily gross salary in England (5 days per week)",
    grossSalary: 109,
    country: 'England/NI/Wales',
    taxYear: '2025/26',
    isBlindPerson: true,
    expected: {
      netSalary: {
        yearly: 24550.4,
        monthly: 2045.87,
        weekly: 472.12,
        daily: 94.42,
      },
    },
    convert: { frequency: 'daily', daysPerWeek: 5 },
  },
  {
    description:
      "Case 8 (Blind person's) - £109 daily gross salary in Scotland (5 days per week)",
    grossSalary: 109,
    country: 'Scotland',
    taxYear: '2025/26',
    isBlindPerson: true,
    expected: {
      netSalary: {
        yearly: 24578.67,
        monthly: 2048.22,
        weekly: 472.67,
        daily: 94.53,
      },
    },
    convert: { frequency: 'daily', daysPerWeek: 5 },
  },
  {
    description:
      "Case 9 (Blind person's) - £119 hourly gross salary in England (35 hours per week)",
    grossSalary: 19,
    country: 'England/NI/Wales',
    taxYear: '2025/26',
    isBlindPerson: true,
    expected: {
      netSalary: {
        yearly: 29043.2,
        monthly: 2420.27,
        weekly: 558.52,
        daily: 111.7,
      },
    },
    convert: { frequency: 'hourly', hoursPerWeek: 35 },
  },
  {
    description:
      "Case 10 (Blind person's) - £119 hourly gross salary in Scotland (35 hours per week)",
    grossSalary: 19,
    country: 'Scotland',
    taxYear: '2025/26',
    isBlindPerson: true,
    expected: {
      netSalary: {
        yearly: 29031.88,
        monthly: 2419.32,
        weekly: 558.31,
        daily: 111.66,
      },
    },
    convert: { frequency: 'hourly', hoursPerWeek: 35 },
  },
  {
    description:
      "Case 11 (Blind person's) - £134,000 annual gross salary in England",
    grossSalary: 134000,
    country: 'England/NI/Wales',
    taxYear: '2025/26',
    isBlindPerson: false,
    expected: {
      netSalary: {
        yearly: 82806.4,
        monthly: 6900.53,
        weekly: 1592.43,
        daily: 318.49,
      },
    },
  },
  {
    description:
      "Case 12 (Blind person's) - £134,000 annual gross salary in Scotland",
    grossSalary: 134000,
    country: 'Scotland',
    taxYear: '2025/26',
    isBlindPerson: false,
    expected: {
      netSalary: {
        yearly: 77323.3,
        monthly: 6443.61,
        weekly: 1486.99,
        daily: 297.4,
      },
    },
  },
];

interface StudentLoanRepaymentTestCase {
  description: string;
  grossSalary: number;
  selectedPlans: StudentLoanPlanSelection;
  expected: {
    repayment: FrequencyAmount;
    netSalary?: FrequencyAmount;
  };
}

const casesStudentLoanRepaymentTest: StudentLoanRepaymentTestCase[] = [
  {
    description: 'Case 1 - £25,000 annual gross salary with Plan 1 selected',
    grossSalary: 25_000,
    selectedPlans: [true, false, false, false, false],
    expected: {
      repayment: {
        yearly: 0,
        monthly: 0,
        weekly: 0,
        daily: 0,
      },
      netSalary: {
        yearly: 21519.6,
        monthly: 1793.3,
        weekly: 413.84,
        daily: 82.77,
      },
    },
  },
  {
    description: 'Case 2 - £30,000 annual gross salary with Plan 1 selected',
    grossSalary: 30_000,
    selectedPlans: [true, false, false, false, false],
    expected: {
      repayment: {
        yearly: 354,
        monthly: 29,
        weekly: 6,
        daily: 1,
      },
      netSalary: {
        yearly: 24765.6,
        monthly: 2064.3,
        weekly: 477.07,
        daily: 95.61,
      },
    },
  },
  {
    description: 'Case 3 - £55,000 annual gross salary with Plan 1 selected',
    grossSalary: 55_000,
    selectedPlans: [true, false, false, false, false],
    expected: {
      repayment: {
        yearly: 2604,
        monthly: 217,
        weekly: 50,
        daily: 10,
      },
    },
  },
  {
    description: 'Case 4 - £26,000 annual gross salary with Plan 2 selected',
    grossSalary: 26_000,
    selectedPlans: [false, true, false, false, false],
    expected: {
      repayment: {
        yearly: 0,
        monthly: 0,
        weekly: 0,
        daily: 0,
      },
    },
  },
  {
    description: 'Case 5 - £32,000 annual gross salary with Plan 2 selected',
    grossSalary: 32_000,
    selectedPlans: [false, true, false, false, false],
    expected: {
      repayment: {
        yearly: 317,
        monthly: 26,
        weekly: 6,
        daily: 1,
      },
    },
  },
  {
    description: 'Case 6 - £65,000 annual gross salary with Plan 2 selected',
    grossSalary: 65_000,
    selectedPlans: [false, true, false, false, false],
    expected: {
      repayment: {
        yearly: 3287,
        monthly: 273,
        weekly: 63,
        daily: 12,
      },
    },
  },
  {
    description: 'Case 7 - £31,000 annual gross salary with Plan 4 selected',
    grossSalary: 31_000,
    selectedPlans: [false, false, true, false, false],
    expected: {
      repayment: {
        yearly: 0,
        monthly: 0,
        weekly: 0,
        daily: 0,
      },
    },
  },
  {
    description: 'Case 8 - £35,000 annual gross salary with Plan 4 selected',
    grossSalary: 35_000,
    selectedPlans: [false, false, true, false, false],
    expected: {
      repayment: {
        yearly: 202,
        monthly: 16,
        weekly: 3,
        daily: 0,
      },
    },
  },
  {
    description: 'Case 9 - £70,000 annual gross salary with Plan 4 selected',
    grossSalary: 70_000,
    selectedPlans: [false, false, true, false, false],
    expected: {
      repayment: {
        yearly: 3352,
        monthly: 279,
        weekly: 64,
        daily: 12,
      },
    },
  },
  {
    description: 'Case 10 - £24,000 annual gross salary with Plan 5 selected',
    grossSalary: 24_000,
    selectedPlans: [false, false, false, true, false],
    expected: {
      repayment: {
        yearly: 0,
        monthly: 0,
        weekly: 0,
        daily: 0,
      },
    },
  },
  {
    description: 'Case 11 - £28,000 annual gross salary with Plan 5 selected',
    grossSalary: 28_000,
    selectedPlans: [false, false, false, true, false],
    expected: {
      repayment: {
        yearly: 270,
        monthly: 22,
        weekly: 5,
        daily: 1,
      },
    },
  },
  {
    description: 'Case 12 - £55,000 annual gross salary with Plan 5 selected',
    grossSalary: 55_000,
    selectedPlans: [false, false, false, true, false],
    expected: {
      repayment: {
        yearly: 2700,
        monthly: 225,
        weekly: 51,
        daily: 10,
      },
    },
  },
  {
    description:
      'Case 13 - £20,000 annual gross salary with Postgrad plan selected',
    grossSalary: 20_000,
    selectedPlans: [false, false, false, false, true],
    expected: {
      repayment: {
        yearly: 0,
        monthly: 0,
        weekly: 0,
        daily: 0,
      },
    },
  },
  {
    description:
      'Case 14 - £30,000 annual gross salary with Postgrad plan selected',
    grossSalary: 30_000,
    selectedPlans: [false, false, false, false, true],
    expected: {
      repayment: {
        yearly: 540,
        monthly: 45,
        weekly: 10,
        daily: 2,
      },
    },
  },
  {
    description:
      'Case 15 - £65,000 annual gross salary with Postgrad plan selected',
    grossSalary: 65_000,
    selectedPlans: [false, false, false, false, true],
    expected: {
      repayment: {
        yearly: 2640,
        monthly: 220,
        weekly: 50,
        daily: 10,
      },
    },
  },
  {
    description: 'Case 16 - £134,000 annual gross salary with Plan 1 selected',
    grossSalary: 134_000,
    selectedPlans: [true, false, false, false, false],
    expected: {
      repayment: {
        yearly: 9714,
        monthly: 809,
        weekly: 186,
        daily: 37,
      },
    },
  },
];

const casesMultipleStudentLoanRepaymentTest: StudentLoanRepaymentTestCase[] = [
  {
    description:
      'Case 1 - £40,000 annual gross salary with Plan 2 and Postgrad plan selected',
    grossSalary: 40_000,
    selectedPlans: [false, true, false, false, true],
    expected: {
      repayment: {
        yearly: 2177,
        monthly: 181,
        weekly: 40,
        daily: 7,
      },
    },
  },
  {
    description:
      'Case 2 - £45,000 annual gross salary with Plan 1 and Postgrad plan selected',
    grossSalary: 45_000,
    selectedPlans: [true, false, false, false, true],
    expected: {
      repayment: {
        yearly: 3144,
        monthly: 262,
        weekly: 59,
        daily: 11,
      },
    },
  },
  {
    description:
      'Case 3 - £60,000 annual gross salary with Plan 2 and Postgrad plan selected',
    grossSalary: 60_000,
    selectedPlans: [false, true, false, false, true],
    expected: {
      repayment: {
        yearly: 5177,
        monthly: 431,
        weekly: 99,
        daily: 19,
      },
    },
  },
  {
    description:
      'Case 4 - £50,000 annual gross salary with Plan 4 and Postgrad plan selected',
    grossSalary: 50_000,
    selectedPlans: [false, false, true, false, true],
    expected: {
      repayment: {
        yearly: 3292,
        monthly: 274,
        weekly: 62,
        daily: 11,
      },
    },
  },
  {
    description:
      'Case 5 - £70,000 annual gross salary with Plan 5 and Postgrad plan selected',
    grossSalary: 70_000,
    selectedPlans: [false, false, false, true, true],
    expected: {
      repayment: {
        yearly: 6990,
        monthly: 582,
        weekly: 133,
        daily: 26,
      },
    },
  },
  {
    description:
      'Case 6 - £55,000 annual gross salary with Plan 1 and Plan 4 selected',
    grossSalary: 55_000,
    selectedPlans: [true, false, true, false, false],
    expected: {
      repayment: {
        yearly: 2604,
        monthly: 217,
        weekly: 50,
        daily: 10,
      },
    },
  },
  {
    description:
      'Case 7 - £38,400 annual gross salary with Plan 1 and Plan 2 selected',
    grossSalary: 38_400,
    selectedPlans: [true, true, false, false, false],
    expected: {
      repayment: {
        yearly: 1110,
        monthly: 92,
        weekly: 21,
        daily: 4,
      },
    },
  },
  {
    description:
      'Case 8 - £45,000 annual gross salary with Plan 4 and Plan 5 selected',
    grossSalary: 45_000,
    selectedPlans: [false, false, true, true, false],
    expected: {
      repayment: {
        yearly: 1800,
        monthly: 150,
        weekly: 34,
        daily: 6,
      },
    },
  },
  {
    description:
      'Case 9 - £42,000 annual gross salary with Plan 1, Plan 2 and Postgrad selected',
    grossSalary: 42_000,
    selectedPlans: [true, true, false, false, true],
    expected: {
      repayment: {
        yearly: 2694,
        monthly: 224,
        weekly: 51,
        daily: 9,
      },
    },
  },
  {
    description:
      'Case 10 - £65,000 annual gross salary with Plan 1, Plan 2, Plan 4 and Postgrad selected',
    grossSalary: 65_000,
    selectedPlans: [true, true, true, false, true],
    expected: {
      repayment: {
        yearly: 6144,
        monthly: 512,
        weekly: 117,
        daily: 23,
      },
    },
  },
  {
    description:
      'Case 11 - £70,000 annual gross salary with Plan 1, Plan 2, Plan 4, Plan 5 and Postgrad selected',
    grossSalary: 70_000,
    selectedPlans: [true, true, true, true, true],
    expected: {
      repayment: {
        yearly: 6990,
        monthly: 582,
        weekly: 133,
        daily: 26,
      },
    },
  },
  {
    description:
      'Case 12 - £21,000 annual gross salary with Plan 1, Plan 2, Plan 4, Plan 5 and Postgrad selected',
    grossSalary: 21_000,
    selectedPlans: [true, true, true, true, true],
    expected: {
      repayment: {
        yearly: 0,
        monthly: 0,
        weekly: 0,
        daily: 0,
      },
    },
  },
];

describe('calculateNetSalary', () => {
  test.each(([] as NetSalaryTestCase[]).concat(cases, casesBlindPerson))(
    '$description',
    (testCase) => {
      let grossSalary = testCase.grossSalary;
      if (testCase.convert) {
        grossSalary = convertToAnnualSalary({
          grossIncome: testCase.grossSalary,
          frequency: testCase.convert.frequency,
          daysPerWeek: testCase.convert.daysPerWeek!,
          hoursPerWeek: testCase.convert.hoursPerWeek,
        });
      }
      const result = calculateNetSalary({
        grossSalary,
        country: testCase.country,
        taxYear: testCase.taxYear,
        isOverStatePensionAge: false,
        daysPerWeek: testCase.convert?.daysPerWeek ?? 5, // Default to 5 days
        isBlindPerson: testCase.isBlindPerson ?? false, // Default to false
        employeePensionContributions:
          testCase.employeePensionContributions ?? 0,
      });
      if (testCase.expected.incomeTax)
        expect(result.incomeTax.yearly).toBe(testCase.expected.incomeTax);
      if (testCase.expected.nationalInsurance)
        expect(result.nationalInsurance.yearly).toBe(
          testCase.expected.nationalInsurance,
        );
      expect(result.netSalary).toStrictEqual(testCase.expected.netSalary);
    },
  );

  test.each(
    ([] as StudentLoanRepaymentTestCase[]).concat(
      casesStudentLoanRepaymentTest,
      casesMultipleStudentLoanRepaymentTest,
    ),
  )('$description', (testCase) => {
    const result = calculateNetSalary({
      grossSalary: testCase.grossSalary,
      country: 'England/NI/Wales',
      taxYear: '2025/26',
      isOverStatePensionAge: false,
      daysPerWeek: 5,
      isBlindPerson: false,
      selectedStudentLoanPlans: testCase.selectedPlans,
    });

    testCase.selectedPlans.map((selected, i) => {
      if (selected) {
        expect(result.studentLoan.total).toStrictEqual(
          testCase.expected.repayment,
        );
      }
      if (testCase.expected.netSalary) {
        expect(result.netSalary).toStrictEqual(testCase.expected.netSalary);
      }
    });
  });

  it('returns 0 NI and correct net salary if isOverStatePensionAge is true', () => {
    const grossSalary = 79000;
    const result = calculateNetSalary({
      grossSalary,
      country: 'England/NI/Wales',
      taxYear: '2025/26',
      isOverStatePensionAge: true,
      daysPerWeek: 5,
      isBlindPerson: false,
    });
    expect(result.nationalInsurance.yearly).toBe(0);
    // Net salary should be gross minus income tax only
    expect(result.netSalary.yearly).toBe(grossSalary - result.incomeTax.yearly);
  });

  it('returns 0 for zero gross salary', () => {
    const result = calculateNetSalary({
      grossSalary: 0,
      country: 'England/NI/Wales',
      taxYear: '2025/26',
      isOverStatePensionAge: false,
      daysPerWeek: 5,
      isBlindPerson: false,
    });
    expect(result.netSalary.yearly).toBe(0);
  });

  it('handles unknown tax code gracefully', () => {
    const result = calculateNetSalary({
      grossSalary: 30000,
      country: 'England/NI/Wales',
      taxYear: '2025/26',
      taxCode: 'XYZ',
      isOverStatePensionAge: false,
      daysPerWeek: 5,
      isBlindPerson: false,
    });
    expect(result.netSalary.yearly).toBeGreaterThan(0); // Should fallback to default allowance
  });

  it('handles NT code (no tax)', () => {
    const grossSalary = 109000;
    const result = calculateNetSalary({
      grossSalary,
      country: 'England/NI/Wales',
      taxYear: '2025/26',
      taxCode: 'NT',
      isOverStatePensionAge: false,
      daysPerWeek: 5,
      isBlindPerson: false,
    });

    // Income tax must be 0
    expect(result.incomeTax.yearly).toBe(0);

    // Net salary = gross - NI (since no income tax)
    expect(result.netSalary.yearly).toBeCloseTo(
      grossSalary - result.nationalInsurance.yearly,
      2,
    );
  });
});
