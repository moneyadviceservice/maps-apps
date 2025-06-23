import { IllustrationType } from '../constants';
import { mockPensionsData } from '../mocks';
import { BenefitIllustration } from '../types';
import { getPotValue } from './getPotValue';

const mockData = mockPensionsData.pensionPolicies[0].pensionArrangements[0]
  .benefitIllustrations[0] as BenefitIllustration;

const mockZeroPotValue = {
  ...mockData,
  illustrationComponents: mockData.illustrationComponents.map((component) =>
    component.illustrationType === 'AP'
      ? { ...component, dcPot: 0 }
      : component,
  ),
};

describe('getPotValue', () => {
  it.each`
    description                        | data                | expected
    ${'pot value amount is present'}   | ${mockData}         | ${'£540,500'}
    ${'pot value amount is 0'}         | ${mockZeroPotValue} | ${'£0'}
    ${'pot value amount is null'}      | ${null}             | ${undefined}
    ${'pot value amount is undefined'} | ${undefined}        | ${undefined}
  `(
    'getPotValue should return $expected when $description',
    ({ data, expected }) => {
      const result = getPotValue(data, IllustrationType.AP);
      expect(result).toBe(expected);
    },
  );
});
