import { IllustrationType, LumpSumAmountType } from '../constants';
import { mockPensionDetails, mockPensionDetailsDBRecurring } from '../mocks';
import { BenefitIllustration, PensionArrangement } from '../types';
import {
  getLumpSumBenefitIllustration,
  getLumpSumIllustration,
  hasTaxFreeLumpSum,
} from './getTaxFreeLumpSum';

const mockData = mockPensionDetailsDBRecurring as PensionArrangement;
const mockDataNoLumpSum = mockPensionDetails as PensionArrangement;

describe('getTaxFreeLumpSum', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLumpSumBenefitIllustration', () => {
    it('should return illustration with lump sum when one exists', () => {
      const result = getLumpSumBenefitIllustration(
        mockData.benefitIllustrations,
      );
      expect(result).toEqual(mockData?.benefitIllustrations?.[1]);
    });

    it('should return undefined when benefitIllustrations is undefined', () => {
      const result = getLumpSumBenefitIllustration();
      expect(result).toBeUndefined();
    });

    it('should return undefined when no illustrations contain lump sum', () => {
      const result = getLumpSumBenefitIllustration(
        mockDataNoLumpSum.benefitIllustrations,
      );
      expect(result).toBeUndefined();
    });

    it('should return illustration with earliest payable date when multiple lump sums exist', () => {
      const earlierIllustration: BenefitIllustration = {
        illustrationComponents: [
          {
            illustrationType: IllustrationType.ERI,
            payableDetails: {
              payableDate: '2024-01-01',
              amountType: LumpSumAmountType.CSH,
              amount: 1000,
            },
          },
        ],
      } as BenefitIllustration;

      const laterIllustration: BenefitIllustration = {
        illustrationComponents: [
          {
            illustrationType: IllustrationType.ERI,
            payableDetails: {
              payableDate: '2024-06-01',
              amountType: LumpSumAmountType.CSH,
              amount: 1000,
            },
          },
        ],
      } as BenefitIllustration;

      const mockIllustrations = [laterIllustration, earlierIllustration];
      const result = getLumpSumBenefitIllustration(mockIllustrations);
      expect(result).toEqual(earlierIllustration);
    });
  });

  describe('getLumpSumIllustration', () => {
    it('should return matching lump sum illustration component of ERI type', () => {
      const result = getLumpSumIllustration(
        IllustrationType.ERI,
        mockData?.benefitIllustrations,
      );
      expect(result).toEqual(
        mockData?.benefitIllustrations?.[1].illustrationComponents[0],
      );
    });

    it('should return matching lump sum illustration component of AP type', () => {
      const result = getLumpSumIllustration(
        IllustrationType.AP,
        mockData?.benefitIllustrations,
      );
      expect(result).toEqual(
        mockData?.benefitIllustrations?.[1].illustrationComponents[1],
      );
    });

    it('should return undefined when no lump sum benefit illustration exists', () => {
      const result = getLumpSumIllustration(
        IllustrationType.ERI,
        mockDataNoLumpSum.benefitIllustrations,
      );
      expect(result).toBeUndefined();
    });

    it('should handle undefined benefitIllustrations', () => {
      const result = getLumpSumIllustration(IllustrationType.ERI);
      expect(result).toBeUndefined();
    });

    it('should return undefined when lump sum exists but not of specified type', () => {
      const mockIllustrations: BenefitIllustration[] = [
        {
          illustrationComponents: [
            {
              illustrationType: IllustrationType.AP,
              payableDetails: {
                payableDate: '2024-01-01',
                amountType: LumpSumAmountType.CSH,
              },
            },
          ],
        } as BenefitIllustration,
      ];

      const result = getLumpSumIllustration(
        IllustrationType.ERI,
        mockIllustrations,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('hasTaxFreeLumpSum', () => {
    it('should return true when a tax-free lump sum illustration exists', () => {
      const result = hasTaxFreeLumpSum([mockData]);
      expect(result).toBe(true);
    });

    it('should return false when no tax-free lump sum illustration exists', () => {
      const result = hasTaxFreeLumpSum([mockDataNoLumpSum]);
      expect(result).toBe(false);
    });
  });
});
