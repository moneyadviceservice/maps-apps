import { BenefitType, CalculationMethod } from '../../constants';
import { mockPensionsData } from '../../mocks';
import {
  BenefitIllustrationComponent,
  RecurringIncomeDetails,
} from '../../types';
import { getMonthlyAmount } from './getMonthlyAmount';

describe('getMonthlyAmount', () => {
  const component = {
    ...mockPensionsData.pensionPolicies[0].pensionArrangements[2]
      .benefitIllustrations[0].illustrationComponents[0],
    payableDetails: {} as RecurringIncomeDetails,
    benefitType: BenefitType.AVC,
    calculationMethod: CalculationMethod.BS,
  } as BenefitIllustrationComponent;

  it.each`
    description                     | monthlyAmount | expectedAmount
    ${'monthlyAmount is present'}   | ${123.45}     | ${'£123.45'}
    ${'monthlyAmount as 0'}         | ${0}          | ${'£0'}
    ${'monthlyAmount is null'}      | ${null}       | ${undefined}
    ${'monthlyAmount is undefined'} | ${undefined}  | ${undefined}
  `(
    'getMonthlyAmount should return $expectedAmount when $description',
    ({ monthlyAmount, expectedAmount }) => {
      const data = {
        ...component,
        payableDetails: {
          ...component.payableDetails,
          monthlyAmount,
        },
      };
      expect(getMonthlyAmount(data)).toBe(expectedAmount);
    },
  );
});
