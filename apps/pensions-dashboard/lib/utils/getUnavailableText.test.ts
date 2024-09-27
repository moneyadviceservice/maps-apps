import {
  AmountNotProvidedReason,
  BenefitType,
  CalculationMethod,
  IllustrationType,
  UnavailableReason,
} from '../constants';
import { getUnavailableText } from './getUnavailableText';
import { BenefitIllustration, BenefitIllustrationComponent } from '../types';

describe('getUnavailableText', () => {
  it('should return undefined if there is no reason message', () => {
    expect(getUnavailableText(mockData[0])).toBeUndefined();
  });
  it('should return the unavailable message from unavailableReason', () => {
    expect(getUnavailableText(mockData[1])).toBe(
      'Your provider needs more time to calculate an estimated income. It can take ten days. Check back again soon.',
    );
  });
  it('should return the reason message from reason', () => {
    expect(getUnavailableText(mockData[2])).toBe(AmountNotProvidedReason.SML);
  });
  it('should return undefined if there are no benefit illustrations', () => {
    expect(getUnavailableText(mockData[3])).toBeUndefined();
  });
});

const mockData = [
  [] as BenefitIllustration[],
  [
    {
      illustrationComponents: [
        {
          illustrationType: 'SomeValidIllustrationType' as IllustrationType,
          unavailableReason: UnavailableReason.DBC,
          benefitType: BenefitType.DB,
          calculationMethod: CalculationMethod.BS,
          payableDetails: {} as BenefitIllustrationComponent['payableDetails'],
        },
      ],
      illustrationDate: '2022-01-01',
    },
  ] as BenefitIllustration[],
  [
    {
      illustrationComponents: [
        {
          payableDetails: {
            reason: AmountNotProvidedReason.SML,
          } as BenefitIllustrationComponent['payableDetails'],
        },
      ] as BenefitIllustrationComponent[],
      illustrationDate: '2022-01-01',
    },
  ] as BenefitIllustration[],
];
