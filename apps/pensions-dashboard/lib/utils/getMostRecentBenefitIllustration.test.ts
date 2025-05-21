import { mockPensionsData } from '../mocks';
import { BenefitIllustration } from '../types';
import { getMostRecentBenefitIllustration } from './getMostRecentBenefitIllustration';

const mockData = mockPensionsData.pensionPolicies[0].pensionArrangements[0]
  .benefitIllustrations as BenefitIllustration[];

describe('getMostRecentBenefitIllustration', () => {
  it('should return the most recent benefit illustration', () => {
    const mockDataMultiple = [
      {
        illustrationComponents: [
          {
            illustrationType: 'ERI',
            unavailableReason: 'TRN',
            benefitType: 'DC',
          },
        ],
        illustrationDate: '2025-01-09',
      },
      {
        illustrationComponents: [
          {
            illustrationType: 'ERI',
            unavailableReason: 'TRN',
            benefitType: 'DC',
          },
        ],
        illustrationDate: '2024-01-09',
      },
      {
        illustrationComponents: [
          {
            illustrationType: 'ERI',
            unavailableReason: 'TRN',
            benefitType: 'DC',
          },
        ],
        illustrationDate: '2023-01-09',
      },
    ] as BenefitIllustration[];
    const result = getMostRecentBenefitIllustration(mockDataMultiple);
    expect(result?.illustrationDate).toEqual('2025-01-09');
  });

  it('should return null if benefitIllustrations is empty', () => {
    const mockDataNoIllustrations = [] as BenefitIllustration[];
    const result = getMostRecentBenefitIllustration(mockDataNoIllustrations);
    expect(result).toBeNull();
  });

  it('should return null if benefitIllustrations is undefined', () => {
    const result = getMostRecentBenefitIllustration(undefined);
    expect(result).toBeNull();
  });

  it('should handle a single benefit illustration', () => {
    const result = getMostRecentBenefitIllustration(mockData);
    expect(result?.illustrationDate).toEqual('2024-01-01');
  });

  it('should handle multiple benefit illustrations with the same data', () => {
    const mockDataMultiple = [
      {
        illustrationComponents: [
          {
            illustrationType: 'ERI',
            unavailableReason: 'TRN',
            benefitType: 'DC',
          },
        ],
        illustrationDate: '2024-01-09',
      },
      {
        illustrationComponents: [
          {
            illustrationType: 'ERI',
            unavailableReason: 'TRN',
            benefitType: 'DC',
          },
        ],
        illustrationDate: '2024-01-09',
      },
    ] as BenefitIllustration[];
    const result = getMostRecentBenefitIllustration(mockDataMultiple);
    expect(result?.illustrationDate).toEqual('2024-01-09');
  });
});
