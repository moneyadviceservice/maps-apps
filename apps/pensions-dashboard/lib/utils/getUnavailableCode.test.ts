import {
  AmountNotProvidedReason,
  BenefitType,
  CalculationMethod,
  IllustrationType,
  UnavailableReason,
} from '../constants';
import {
  AmountNotProvidedDetails,
  BenefitIllustration,
  BenefitIllustrationComponent,
  LumpSumDetails,
  RecurringIncomeDetails,
} from '../types';
import { getUnavailableCode } from './getUnavailableCode';

let result;

describe('getUnavailableCode', () => {
  it('should return unavailable reason code from illustration.unavailableReason', () => {
    // Act & Arrange
    result = getUnavailableCode(mockData[1][0].illustrationComponents[0]);
    // Assert
    expect(result).toBe('SML');
  });

  it('should return the unavailable reason from payableDetails.reason', () => {
    // Act & Arrange
    result = getUnavailableCode(mockData[0][0].illustrationComponents[0]);

    // Assert
    expect(result).toBe('DBC');
  });

  it('should return undefined if there is no reason message', () => {
    // Act & Arrange
    result = getUnavailableCode(mockData[2][0].illustrationComponents[0]);

    // Assert
    expect(result).toBe(undefined);

    result = getUnavailableCode(mockData[3][0].illustrationComponents[0]);

    expect(result).toBe(undefined);
  });
});

// Can't use mockData from /mocks as various unavailableReason are not defined
const mockData = [
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
          } as AmountNotProvidedDetails,
        } as BenefitIllustrationComponent,
      ] as BenefitIllustrationComponent[],
      illustrationDate: '2022-01-01',
    },
  ] as BenefitIllustration[],
  [
    {
      illustrationComponents: [
        {
          payableDetails: {} as RecurringIncomeDetails,
        } as BenefitIllustrationComponent,
      ] as BenefitIllustrationComponent[],
      illustrationDate: '2022-01-01',
    },
  ] as BenefitIllustration[],
  [
    {
      illustrationComponents: [
        {
          payableDetails: {} as LumpSumDetails,
        } as BenefitIllustrationComponent,
      ] as BenefitIllustrationComponent[],
      illustrationDate: '2022-01-01',
    },
  ] as BenefitIllustration[],
];
