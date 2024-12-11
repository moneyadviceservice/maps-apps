import { BenefitType, CalculationMethod, IllustrationType } from '../constants';
import { mockPensionsData } from '../mocks';
import {
  BenefitIllustrationComponent,
  PensionArrangement,
  RecurringIncomeDetails,
} from '../types';
import {
  getAnnualAmount,
  getBenefitType,
  getMonthlyAmount,
  getPensionTotals,
  processIllustration,
} from './pension';

let totals: { monthlyTotal: number; annualTotal: number };
let data;
let component: BenefitIllustrationComponent;
let payableDetails: RecurringIncomeDetails;
let amount: string | undefined;

describe('Pension module', () => {
  beforeEach(() => {
    //Arrange - default illustration and payableDetails
    component = mockPensionsData.pensionPolicies[0].pensionArrangements[2]
      .benefitIllustrations[0]
      .illustrationComponents[0] as BenefitIllustrationComponent;
    payableDetails = component.payableDetails as RecurringIncomeDetails;
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

  test('processIllustration should calculate totals correctly when payableDetails object is empty or undefined', () => {
    // Arrange & Act - test with default payableDetails
    totals = { monthlyTotal: 0, annualTotal: 0 };
    processIllustration(component, totals);

    // Assert
    expect(totals.monthlyTotal).toBe(payableDetails.monthlyAmount);
    expect(totals.annualTotal).toBe(payableDetails.annualAmount);

    // Arrange & Act - test with empty payableDetails
    component = {
      illustrationType: IllustrationType.ERI,
      payableDetails: {} as RecurringIncomeDetails,
      benefitType: BenefitType.AVC,
      calculationMethod: CalculationMethod.BS,
    };
    totals = { monthlyTotal: 0, annualTotal: 0 };
    processIllustration(component, totals);

    // Assert
    expect(totals.monthlyTotal).toBe(0);
    expect(totals.annualTotal).toBe(0);

    // Arrange & Act - test with undefined payableDetails
    component = {
      illustrationType: IllustrationType.ERI,
      benefitType: BenefitType.AVC,
      calculationMethod: CalculationMethod.BS,
    } as BenefitIllustrationComponent;
    totals = { monthlyTotal: 0, annualTotal: 0 };
    processIllustration(component, totals);

    // Assert
    expect(totals.monthlyTotal).toBe(0);
    expect(totals.annualTotal).toBe(0);
  });

  test('getMonthlyAmount should return formatted monthly amount', () => {
    // Act - test with default payableDetails
    amount = getMonthlyAmount(component);

    // Assert
    expect(amount).toBe(`£${payableDetails.monthlyAmount.toFixed(2)}`);

    // Arrange & Act - test with empty payableDetails
    component = {
      ...component,
      payableDetails: {} as RecurringIncomeDetails,
      benefitType: BenefitType.AVC,
      calculationMethod: CalculationMethod.BS,
    };
    amount = getMonthlyAmount(component);

    // Assert
    expect(amount).toBe(undefined);

    // Arrange & Act - test with undefined component
    amount = getMonthlyAmount(undefined);

    // Assert
    expect(amount).toBe(undefined);
  });
  test('getAnnualAmount should return formatted annual amount', () => {
    // Act - test with default payableDetails
    amount = getAnnualAmount(component);

    // Assert
    expect(amount).toBe(
      `£${payableDetails.annualAmount.toLocaleString('en-GB')}`,
    );

    // Arrange & Act - test with empty payableDetails
    component = {
      illustrationType: IllustrationType.ERI,
      payableDetails: {} as RecurringIncomeDetails,
      benefitType: BenefitType.AVC,
      calculationMethod: CalculationMethod.BS,
    };
    amount = getAnnualAmount(component);

    // Assert
    expect(amount).toBe(undefined);

    // Arrange & Act - test with undefined component
    amount = getAnnualAmount(undefined);

    // Assert
    expect(amount).toBe(undefined);
  });

  test('getBenefitType should return correct benefit type description', () => {
    expect(getBenefitType[BenefitType.AVC]).toBe(
      'Additional voluntary contribution',
    );
    expect(getBenefitType[BenefitType.DB]).toBe('Defined Benefit');
    expect(getBenefitType[BenefitType.SP]).toBe('State Pension');
  });
});
