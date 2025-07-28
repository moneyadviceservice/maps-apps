import { mockPensionsData } from '../mocks';
import { BenefitIllustrationComponent } from '../types';
import { getTaxFreeLumpSum } from './getTaxFreeLumpSum';

let component: BenefitIllustrationComponent;

describe('getTaxFreeLumpSum', () => {
  beforeEach(() => {
    //Arrange - default illustration and payableDetails
    component = mockPensionsData.pensionPolicies[0].pensionArrangements[2]
      .benefitIllustrations[0]
      .illustrationComponents[0] as BenefitIllustrationComponent;
  });

  it.each`
    description              | amount       | expectedAmount
    ${'amount is present'}   | ${123.45}    | ${'£123.45'}
    ${'amount as 0'}         | ${0}         | ${'£0'}
    ${'amount is null'}      | ${null}      | ${undefined}
    ${'amount is undefined'} | ${undefined} | ${undefined}
  `(
    'getTaxFreeLumpSum should return $expectedAmount when $description',
    ({ amount, expectedAmount }) => {
      const data = {
        ...component,
        payableDetails: {
          ...component.payableDetails,
          amount,
        },
      };
      expect(getTaxFreeLumpSum(data)).toBe(expectedAmount);
    },
  );
});
