import { IllustrationType } from '../constants';
import { mockPensionsData } from '../mocks';
import {
  BenefitIllustration,
  BenefitIllustrationComponent,
  RecurringIncomeDetails,
} from '../types';
import * as utils from './getUnavailableCode'; // Import the module to spy on
import { processBenefitIllustrations } from './processBenefitIllustrations';
import * as currencyUtils from './toCurrency'; // Import the module to spy on

// mock the translation hook
const t = (key: string) => key;

let getUnavailableCodeSpy: jest.SpyInstance;
let currencyAmountSpy: jest.SpyInstance;

describe('processBenefitIllustrations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getUnavailableCodeSpy = jest.spyOn(utils, 'getUnavailableCode');
    currencyAmountSpy = jest.spyOn(currencyUtils, 'currencyAmount');
  });

  it('should return the formatted amount only when IllustrationType is ERI', () => {
    // Arrange
    const mockBenefitIllustrations: BenefitIllustration[] = [
      {
        illustrationComponents: [
          mockPensionsData.pensionPolicies[0].pensionArrangements[2]
            .benefitIllustrations[0].illustrationComponents[0],
          mockPensionsData.pensionPolicies[0].pensionArrangements[2]
            .benefitIllustrations[1].illustrationComponents[0],
        ],
      },
    ] as BenefitIllustration[];

    // Act
    const result = processBenefitIllustrations(mockBenefitIllustrations, t);

    // Assert
    expect(result).toEqual({
      monthlyAmount: '£958.50',
      unavailableCode: undefined,
    });

    expect(currencyAmountSpy).toHaveBeenCalledWith(958.5);
  });

  it('should return default value when monthlyAmount is not provided', () => {
    // Arrange
    const mockBenefitIllustrations: BenefitIllustration[] = [
      {
        illustrationComponents: [
          {
            illustrationType: IllustrationType.ERI,
            payableDetails: {} as RecurringIncomeDetails,
          } as BenefitIllustrationComponent,
        ],
      },
    ] as BenefitIllustration[];

    // Act
    const result = processBenefitIllustrations(mockBenefitIllustrations, t);

    // Assert
    expect(result).toEqual({
      monthlyAmount: 'common.amount-unavailable',
      unavailableCode: undefined,
    });

    expect(getUnavailableCodeSpy).toHaveBeenCalled();
  });

  it('should return default values when no benefit illustrations are provided', () => {
    // Act
    const result = processBenefitIllustrations(undefined, t);

    // Assert
    expect(result).toEqual({
      monthlyAmount: 'common.amount-unavailable',
      unavailableCode: undefined,
    });
  });
});
