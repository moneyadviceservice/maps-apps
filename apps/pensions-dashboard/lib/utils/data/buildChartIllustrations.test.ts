import {
  BenefitType,
  CalculationMethod,
  IllustrationType,
  MatchType,
  PayableDetailsType,
  PensionType,
  RecurringAmountType,
} from '../../constants';
import { BenefitIllustrationComponent, PensionArrangement } from '../../types';
import { buildChartIllustrations } from './buildChartIllustrations';

describe('buildChartIllustrations', () => {
  const mockBenefitIllustrationComponent = (
    overrides = {},
  ): BenefitIllustrationComponent => ({
    illustrationType: IllustrationType.ERI,
    benefitType: BenefitType.DB,
    calculationMethod: CalculationMethod.SMPI,
    payableDetails: {
      payableDate: '2025-01-01',
      monthlyAmount: 1000,
      annualAmount: 12000,
      amountType: RecurringAmountType.INC,
      increasing: true,
    },
    survivorBenefit: false,
    safeguardedBenefit: false,
    illustrationWarnings: [],
    ...overrides,
  });

  const mockPensionArrangement = (overrides = {}): PensionArrangement => ({
    pensionType: PensionType.DB,
    schemeName: 'Test Scheme',
    externalPensionPolicyId: '12345',
    externalAssetId: '67890',
    contributionsFromMultipleEmployers: false,
    pensionAdministrator: {
      name: 'sdasdasdasdasdasd',
      contactMethods: [
        {
          preferred: true,
          contactMethodDetails: {
            email: 'test@example.com',
          },
        },
      ],
    },
    matchType: MatchType.DEFN,
    benefitIllustrations: [
      {
        illustrationDate: '2025-01-01',
        payableDetailsType: PayableDetailsType.RECURRING,
        illustrationComponents: [
          mockBenefitIllustrationComponent({
            illustrationType: IllustrationType.ERI,
          }),
          mockBenefitIllustrationComponent({
            illustrationType: IllustrationType.AP,
          }),
        ],
      },
    ],
    detailData: {
      warnings: [],
      retirementDate: '2025-06-01',
    },
    ...overrides,
  });

  it('should return an empty array when no benefit illustrations exist', () => {
    const data = mockPensionArrangement({
      benefitIllustrations: undefined,
    });

    const result = buildChartIllustrations(data);

    expect(result).toHaveLength(1);
    expect(result[0].bar?.eri?.annualAmount).toBe(0);
    expect(result[0].bar?.ap?.annualAmount).toBe(0);
  });

  it('should build chart illustrations with recurring income data', () => {
    const data = mockPensionArrangement();

    const result = buildChartIllustrations(data);

    expect(result).toHaveLength(1);
    expect(result[0].bar).toBeDefined();
    expect(result[0].bar?.eri?.monthlyAmount).toBe(1000);
    expect(result[0].bar?.eri?.annualAmount).toBe(12000);
    expect(result[0].bar?.ap?.monthlyAmount).toBe(1000);
  });

  it('should handle lump sum payable details type', () => {
    const data = mockPensionArrangement({
      benefitIllustrations: [
        {
          illustrationDate: '2025-01-01',
          payableDetailsType: PayableDetailsType.LUMPSUM,
          illustrationComponents: [
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.ERI,
              payableDetails: {
                payableDate: '2025-01-01',
                amount: 50000,
                amountType: 'LUMPSUM' as const,
              },
            }),
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.AP,
              payableDetails: {
                payableDate: '2025-01-01',
                amount: 30000,
                amountType: 'LUMPSUM' as const,
              },
            }),
          ],
        },
      ],
    });

    const result = buildChartIllustrations(data);

    expect(result[0].bar).toBeUndefined();
    expect(result[0].donut).toBeDefined();
    expect(result[0].donut?.eri?.amount).toBe(50000);
    expect(result[0].donut?.ap?.amount).toBe(30000);
  });

  it('should handle defined contribution pension type', () => {
    const data = mockPensionArrangement({
      pensionType: PensionType.DC,
      benefitIllustrations: [
        {
          illustrationDate: '2025-01-01',
          payableDetailsType: PayableDetailsType.RECURRING,
          illustrationComponents: [
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.ERI,
              dcPot: 100000,
            }),
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.AP,
              dcPot: 80000,
            }),
          ],
        },
      ],
    });

    const result = buildChartIllustrations(data);

    expect(result[0].donut).toBeDefined();
    expect(result[0].donut?.eri?.amount).toBe(100000);
    expect(result[0].donut?.ap?.amount).toBe(80000);
  });

  it('should extract payable year from payable date', () => {
    const data = mockPensionArrangement({
      benefitIllustrations: [
        {
          illustrationDate: '2025-01-01',
          payableDetailsType: PayableDetailsType.RECURRING,
          illustrationComponents: [
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.ERI,
              payableDetails: {
                payableDate: '2030-06-15',
                monthlyAmount: 1000,
                annualAmount: 12000,
              },
            }),
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.AP,
            }),
          ],
        },
      ],
    });

    const result = buildChartIllustrations(data);

    expect(result[0].payableYear).toBe(2030);
  });

  it('should handle survivor and safeguarded benefits', () => {
    const data = mockPensionArrangement({
      benefitIllustrations: [
        {
          illustrationDate: '2025-01-01',
          payableDetailsType: PayableDetailsType.RECURRING,
          illustrationComponents: [
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.ERI,
              survivorBenefit: true,
              safeguardedBenefit: true,
            }),
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.AP,
            }),
          ],
        },
      ],
    });

    const result = buildChartIllustrations(data);

    expect(result[0].bar?.eri?.survivorBenefit).toBe(true);
    expect(result[0].bar?.eri?.safeguardedBenefit).toBe(true);
  });

  it('should handle illustration warnings', () => {
    const warnings = ['WARNING_1', 'WARNING_2'];
    const data = mockPensionArrangement({
      benefitIllustrations: [
        {
          illustrationDate: '2025-01-01',
          payableDetailsType: PayableDetailsType.RECURRING,
          illustrationComponents: [
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.ERI,
              illustrationWarnings: warnings,
            }),
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.AP,
            }),
          ],
        },
      ],
    });

    const result = buildChartIllustrations(data);

    expect(result[0].bar?.eri?.warnings).toEqual(warnings);
  });

  it('should handle increasing recurring income', () => {
    const data = mockPensionArrangement({
      benefitIllustrations: [
        {
          illustrationDate: '2025-01-01',
          payableDetailsType: PayableDetailsType.RECURRING,
          illustrationComponents: [
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.ERI,
              payableDetails: {
                payableDate: '2025-01-01',
                monthlyAmount: 1000,
                annualAmount: 12000,
                increasing: true,
              },
            }),
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.AP,
            }),
          ],
        },
      ],
    });

    const result = buildChartIllustrations(data);

    expect(result[0].bar?.eri?.increasing).toBe(true);
  });

  it('should handle last payment date for recurring income', () => {
    const lastPaymentDate = '2035-12-31';
    const data = mockPensionArrangement({
      benefitIllustrations: [
        {
          illustrationDate: '2025-01-01',
          payableDetailsType: PayableDetailsType.RECURRING,
          illustrationComponents: [
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.ERI,
              payableDetails: {
                payableDate: '2025-01-01',
                monthlyAmount: 1000,
                annualAmount: 12000,
                lastPaymentDate,
              },
            }),
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.AP,
            }),
          ],
        },
      ],
    });

    const result = buildChartIllustrations(data);

    expect(result[0].bar?.eri?.lastPaymentDate).toBe(lastPaymentDate);
  });

  it('should return multiple built illustrations for multiple benefit illustrations', () => {
    const data = mockPensionArrangement({
      benefitIllustrations: [
        {
          illustrationDate: '2025-01-01',
          payableDetailsType: PayableDetailsType.RECURRING,
          illustrationComponents: [
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.ERI,
              payableDetails: {
                payableDate: '2025-01-01',
                monthlyAmount: 1000,
                annualAmount: 12000,
              },
            }),
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.AP,
            }),
          ],
        },
        {
          illustrationDate: '2026-01-01',
          payableDetailsType: PayableDetailsType.RECURRING,
          illustrationComponents: [
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.ERI,
              payableDetails: {
                payableDate: '2026-01-01',
                monthlyAmount: 1200,
                annualAmount: 14400,
              },
            }),
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.AP,
            }),
          ],
        },
      ],
    });

    const result = buildChartIllustrations(data);

    expect(result).toHaveLength(2);
    expect(result[0].bar?.eri?.monthlyAmount).toBe(1000);
    expect(result[1].bar?.eri?.monthlyAmount).toBe(1200);
  });

  it('should use 99999 as fallback if no payable year', () => {
    const data = mockPensionArrangement({
      retirementDate: '2028-03-15',
      benefitIllustrations: [],
    });

    const result = buildChartIllustrations(data);

    expect(result[0].payableYear).toBe(99999);
  });

  it('should set payable year to 99999 when no date is available', () => {
    const data = mockPensionArrangement({
      detailData: {},
      benefitIllustrations: [],
    });

    const result = buildChartIllustrations(data);

    expect(result[0].payableYear).toBe(99999);
  });

  it('should handle undefined benefit illustrations array', () => {
    const data = mockPensionArrangement({
      benefitIllustrations: undefined,
    });

    const result = buildChartIllustrations(data);

    expect(result).toHaveLength(1);
    expect(result[0].bar?.eri?.annualAmount).toBe(0);
    expect(result[0].bar?.ap?.annualAmount).toBe(0);
  });

  it('should handle empty benefit illustrations array', () => {
    const data = mockPensionArrangement({
      benefitIllustrations: [],
    });

    const result = buildChartIllustrations(data);

    expect(result).toHaveLength(1);
    expect(result[0].bar).toBeDefined();
  });

  it('should populate eriBar and apBar correctly for recurring income', () => {
    const data = mockPensionArrangement();

    const result = buildChartIllustrations(data);

    expect(result[0].eriBar).toBeDefined();
    expect(result[0].eriBar?.annualAmount).toBe(12000);
    expect(result[0].apBar).toBeDefined();
    expect(result[0].apBar?.annualAmount).toBe(12000);
  });

  it('should populate eriDonut and apDonut correctly for lump sum', () => {
    const data = mockPensionArrangement({
      benefitIllustrations: [
        {
          illustrationDate: '2025-01-01',
          payableDetailsType: PayableDetailsType.LUMPSUM,
          illustrationComponents: [
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.ERI,
              payableDetails: {
                payableDate: '2025-01-01',
                amount: 50000,
              },
            }),
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.AP,
              payableDetails: {
                payableDate: '2025-01-01',
                amount: 30000,
              },
            }),
          ],
        },
      ],
    });

    const result = buildChartIllustrations(data);

    expect(result[0].eriDonut).toBeDefined();
    expect(result[0].eriDonut?.amount).toBe(50000);
    expect(result[0].apDonut).toBeDefined();
    expect(result[0].apDonut?.amount).toBe(30000);
  });

  it('should not include donut for DB pension type without lump sum', () => {
    const data = mockPensionArrangement({
      pensionType: PensionType.DB,
      benefitIllustrations: [
        {
          illustrationDate: '2025-01-01',
          payableDetailsType: PayableDetailsType.RECURRING,
          illustrationComponents: [
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.ERI,
            }),
            mockBenefitIllustrationComponent({
              illustrationType: IllustrationType.AP,
            }),
          ],
        },
      ],
    });

    const result = buildChartIllustrations(data);

    expect(result[0].donut).toBeUndefined();
    expect(result[0].eriDonut).toBeUndefined();
    expect(result[0].apDonut).toBeUndefined();
  });
});
