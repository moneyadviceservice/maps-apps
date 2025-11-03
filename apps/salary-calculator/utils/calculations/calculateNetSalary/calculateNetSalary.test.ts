import { calculateNetSalary } from './calculateNetSalary';

import { convertToAnnualSalary } from '../../helpers/convertToAnnualSalary/convertToAnnualSalary';
import { FrequencyAmount } from '../calculateFrequencyAmount';

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
        monthly: 2535.89, // 2535.9
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
        weekly: 487.44, // 487.45
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
    isBlindPerson: true,
    expected: {
      netSalary: {
        yearly: 84214.9,
        monthly: 7017.91,
        weekly: 1619.52,
        daily: 323.9,
      },
    },
  },
  {
    description:
      "Case 12 (Blind person's) - £134,000 annual gross salary in Scotland",
    grossSalary: 134000,
    country: 'Scotland',
    taxYear: '2025/26',
    isBlindPerson: true,
    expected: {
      netSalary: {
        yearly: 78825.7,
        monthly: 6568.81,
        weekly: 1515.88,
        daily: 303.18,
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
          amount: testCase.grossSalary,
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
});
