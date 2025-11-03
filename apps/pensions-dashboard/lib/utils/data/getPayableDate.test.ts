import { BenefitType, CalculationMethod } from '../../constants';
import { mockPensionsData } from '../../mocks';
import {
  BenefitIllustrationComponent,
  RecurringIncomeDetails,
} from '../../types';
import { getPayableDate } from './getPayableDate';

describe('getPayableDate', () => {
  const component = {
    ...mockPensionsData.pensionPolicies[0].pensionArrangements[2]
      .benefitIllustrations[0].illustrationComponents[0],
    payableDetails: {} as RecurringIncomeDetails,
    benefitType: BenefitType.AVC,
    calculationMethod: CalculationMethod.BS,
  } as BenefitIllustrationComponent;

  it.each`
    description                   | payableDate     | expectedDate
    ${'payableDate is present'}   | ${'01/01/1970'} | ${'1 January 1970'}
    ${'payableDate is null'}      | ${null}         | ${undefined}
    ${'payableDate is undefined'} | ${undefined}    | ${undefined}
  `(
    'should return $expectedDate when $description',
    ({ payableDate, expectedDate }) => {
      const data = {
        ...component,
        payableDetails: {
          ...component.payableDetails,
          payableDate,
        },
      };
      expect(getPayableDate(data)).toBe(expectedDate);
    },
  );
});
