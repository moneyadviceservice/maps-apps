import { BenefitType, CalculationMethod } from '../constants';
import { mockPensionsData } from '../mocks';
import { BenefitIllustrationComponent, RecurringIncomeDetails } from '../types';
import { getAnnualAmount } from './getAnnualAmount';

describe('getAnnualAmount', () => {
  const component = {
    ...mockPensionsData.pensionPolicies[0].pensionArrangements[2]
      .benefitIllustrations[0].illustrationComponents[0],
    payableDetails: {} as RecurringIncomeDetails,
    benefitType: BenefitType.AVC,
    calculationMethod: CalculationMethod.BS,
  } as BenefitIllustrationComponent;

  it.each`
    description                    | annualAmount | expectedAmount
    ${'annualAmount is present'}   | ${123.45}    | ${'£123.45'}
    ${'annualAmount as 0'}         | ${0}         | ${'£0'}
    ${'annualAmount is null'}      | ${null}      | ${undefined}
    ${'annualAmount is undefined'} | ${undefined} | ${undefined}
  `(
    'getAnnualAmount should return $expectedAmount when $description',
    ({ annualAmount, expectedAmount }) => {
      const data = {
        ...component,
        payableDetails: {
          ...component.payableDetails,
          annualAmount,
        },
      };
      expect(getAnnualAmount(data)).toBe(expectedAmount);
    },
  );
});
