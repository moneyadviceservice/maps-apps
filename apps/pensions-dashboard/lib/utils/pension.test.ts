import {
  getPensionTotals,
  getMonthlyAmount,
  getAnnualAmount,
  getBenefitType,
} from './pension';
import {
  PensionArrangement,
  BenefitIllustrationComponent,
  RecurringIncomeDetails,
} from '../types';
import { BenefitType, CalculationMethod, IllustrationType } from '../constants';
import { mockPensionsData } from '../mocks';

let totals: { monthlyTotal: number; annualTotal: number };
let data;
let illustration: BenefitIllustrationComponent;
let payableDetails: RecurringIncomeDetails;
let amount: string;

describe('Pension module', () => {
  beforeEach(() => {
    //Arrange - default illustration and payableDetails
    illustration = mockPensionsData.pensionPolicies[0].pensionArrangements[2]
      .benefitIllustrations[0]
      .illustrationComponents[0] as BenefitIllustrationComponent;
    payableDetails = illustration.payableDetails as RecurringIncomeDetails;
  });

  test('getPensionTotals should calculate totals correctly', () => {
    // Arrange & Act - test with default payableDetails
    data = [mockPensionsData.pensionPolicies[0].pensionArrangements[2]];
    totals = getPensionTotals(data as PensionArrangement[]);

    const payableDetails = (
      data[0].benefitIllustrations[0]
        .illustrationComponents[0] as BenefitIllustrationComponent
    ).payableDetails as RecurringIncomeDetails;

    // Assert
    expect(totals.monthlyTotal).toBe(payableDetails.monthlyAmount);
    expect(totals.annualTotal).toBe(payableDetails.annualAmount);

    // Arrange & Act - test with empty payableDetails
    data = [
      {
        ...mockPensionsData.pensionPolicies[0].pensionArrangements[2],
        benefitIllustrations: [
          {
            illustrationComponents: [
              {
                illustrationType: IllustrationType.ERI,
                payableDetails: {} as object,
                benefitType: BenefitType.AVC,
                calculationMethod: CalculationMethod.BS,
              },
            ],
          },
        ],
      },
    ];
    totals = getPensionTotals(data as PensionArrangement[]);

    // Assert
    expect(totals.monthlyTotal).toBe(0);
    expect(totals.annualTotal).toBe(0);
  });

  test('getMonthlyAmount should return formatted monthly amount', () => {
    // Act - test with default payableDetails
    amount = getMonthlyAmount(illustration);

    // Assert
    expect(amount).toBe(`£${payableDetails.monthlyAmount.toFixed(2)}`);

    // Arrange & Act - test with empty payableDetails
    illustration = {
      ...illustration,
      payableDetails: {} as RecurringIncomeDetails,
      benefitType: BenefitType.AVC,
      calculationMethod: CalculationMethod.BS,
    };
    amount = getMonthlyAmount(illustration);

    // Assert
    expect(amount).toBe('£0');
  });
  test('getAnnualAmount should return formatted annual amount', () => {
    // Act - test with default payableDetails
    amount = getAnnualAmount(illustration);

    // Assert
    expect(amount).toBe(
      `£${payableDetails.annualAmount.toLocaleString('en-GB')}`,
    );

    // Arrange & Act - test with empty payableDetails
    illustration = {
      illustrationType: IllustrationType.ERI,
      payableDetails: {} as RecurringIncomeDetails,
      benefitType: BenefitType.AVC,
      calculationMethod: CalculationMethod.BS,
    };
    amount = getAnnualAmount(illustration);

    // Assert
    expect(amount).toBe('£0');
  });

  test('getBenefitType should return correct benefit type description', () => {
    expect(getBenefitType[BenefitType.AVC]).toBe(
      'Additional voluntary contribution',
    );
    expect(getBenefitType[BenefitType.DB]).toBe('Defined Benefit');
    expect(getBenefitType[BenefitType.SP]).toBe('State Pension');
  });
});
