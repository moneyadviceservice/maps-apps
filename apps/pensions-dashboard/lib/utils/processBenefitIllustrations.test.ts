import { processBenefitIllustrations } from './processBenefitIllustrations';
import { IllustrationType } from '../constants';
import {
  BenefitIllustration,
  RecurringIncomeDetails,
  BenefitIllustrationComponent,
} from '../types';
import * as utils from './getUnavailableCode'; // Import the module to spy on
import * as currencyUtils from './toCurrency'; // Import the module to spy on
import { mockPensionsData } from '../mocks';

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
    const result = processBenefitIllustrations(mockBenefitIllustrations);

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
    const result = processBenefitIllustrations(mockBenefitIllustrations);

    // Assert
    expect(result).toEqual({
      monthlyAmount: '£',
      unavailableCode: undefined,
    });

    expect(getUnavailableCodeSpy).toHaveBeenCalled();
  });

  it('should return default values when no benefit illustrations are provided', () => {
    // Act
    const result = processBenefitIllustrations(undefined);

    // Assert
    expect(result).toEqual({
      monthlyAmount: '£',
      unavailableCode: undefined,
    });
  });
});
