import {
  BenefitType,
  CalculationMethod,
  IllustrationType,
} from '../../constants';
import { mockPensionsData } from '../../mocks';
import {
  BenefitIllustrationComponent,
  RecurringIncomeDetails,
} from '../../types';
import { processIllustration } from './processIllustration';

let totals: { monthlyTotal: number; annualTotal: number };
let component: BenefitIllustrationComponent;
let payableDetails: RecurringIncomeDetails;

describe('processIllustration', () => {
  beforeEach(() => {
    //Arrange - default illustration and payableDetails
    component = mockPensionsData.pensionPolicies[0].pensionArrangements[2]
      .benefitIllustrations[0]
      .illustrationComponents[0] as BenefitIllustrationComponent;
    payableDetails = component.payableDetails as RecurringIncomeDetails;
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
});
