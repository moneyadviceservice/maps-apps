import { BenefitType, PensionType } from '../../../lib/constants';
import { BenefitIllustrationComponent } from '../../types';
import { getCalculationType } from './getCalculationType';

const DCillustration = {
  benefitType: BenefitType.DC,
} as BenefitIllustrationComponent;

const DBillustration = {
  benefitType: BenefitType.DB,
} as BenefitIllustrationComponent;

describe('getCalculationType', () => {
  describe('when pension type is not Hybrid', () => {
    it.each([PensionType.DC, PensionType.DB, PensionType.AVC])(
      'should return %s pension type when provided',
      (type) => {
        expect(getCalculationType(type, undefined)).toBe(type);
      },
    );

    it('should ignore illustration when pension type is not Hybrid', () => {
      const result = getCalculationType(PensionType.DB, DCillustration);
      expect(result).toBe(PensionType.DB);
    });
  });

  describe('when pension type is Hybrid', () => {
    it('should return DC when benefit type is DC', () => {
      const result = getCalculationType(PensionType.HYB, DCillustration);
      expect(result).toBe(PensionType.DC);
    });

    it('should return DB when benefit type is DB', () => {
      const result = getCalculationType(PensionType.HYB, DBillustration);
      expect(result).toBe(PensionType.DB);
    });

    it('should return undefined when illustration is undefined', () => {
      const result = getCalculationType(PensionType.HYB, undefined);
      expect(result).toBeUndefined();
    });

    it('should return undefined when benefit type is not DC', () => {
      const result = getCalculationType(PensionType.HYB, {
        ...DCillustration,
        benefitType: BenefitType.AVC,
      });
      expect(result).toBeUndefined();
    });

    it('should return undefined when benefit type is undefined', () => {
      const result = getCalculationType(PensionType.HYB, {
        ...DCillustration,
        benefitType: {} as BenefitType,
      });
      expect(result).toBeUndefined();
    });
  });
});
