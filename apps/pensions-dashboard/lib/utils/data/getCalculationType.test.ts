import { BenefitType, PensionType } from '../../../lib/constants';
import { getCalculationType } from './getCalculationType';

describe('getCalculationType', () => {
  describe('when pension type is not Hybrid', () => {
    it.each([PensionType.DC, PensionType.DB, PensionType.AVC])(
      'should return %s pension type when provided',
      (type) => {
        expect(getCalculationType(type, undefined)).toBe(type);
      },
    );

    it('should ignore illustration when pension type is not Hybrid', () => {
      const result = getCalculationType(PensionType.DB, BenefitType.DC);
      expect(result).toBe(PensionType.DB);
    });
  });

  describe('when pension type is Hybrid', () => {
    it('should return DC when benefit type is DC', () => {
      const result = getCalculationType(PensionType.HYB, BenefitType.DC);
      expect(result).toBe(PensionType.DC);
    });

    it('should return DB when benefit type is DB', () => {
      const result = getCalculationType(PensionType.HYB, BenefitType.DB);
      expect(result).toBe(PensionType.DB);
    });

    it('should return undefined when benefit type is not DC', () => {
      const result = getCalculationType(PensionType.HYB, BenefitType.AVC);
      expect(result).toBeUndefined();
    });

    it('should return undefined when benefit type is undefined', () => {
      const result = getCalculationType(PensionType.HYB, undefined);
      expect(result).toBeUndefined();
    });
  });
});
