import { BenefitIllustration } from '../../types';
import { hasMultipleBenefitTypes } from './hasMultipleBenefitTypes';

const dbTypes: BenefitIllustration = {
  illustrationComponents: [{ benefitType: 'DB' }, { benefitType: 'DB' }],
} as BenefitIllustration;

const dcTypes: BenefitIllustration = {
  illustrationComponents: [{ benefitType: 'DC' }, { benefitType: 'DC' }],
} as BenefitIllustration;

describe('hasMultipleBenefitTypes', () => {
  it('should return false when benefitIllustrations is undefined', () => {
    expect(hasMultipleBenefitTypes(undefined)).toBe(false);
  });

  it('should return false when benefitIllustrations is an empty array', () => {
    expect(hasMultipleBenefitTypes([])).toBe(false);
  });

  it('should return false when all benefit types are the same', () => {
    const illustrations: BenefitIllustration[] = [dbTypes, dbTypes];

    expect(hasMultipleBenefitTypes(illustrations)).toBe(false);
  });

  it('should return true when there are multiple benefit types', () => {
    const illustrations: BenefitIllustration[] = [dbTypes, dcTypes];

    expect(hasMultipleBenefitTypes(illustrations)).toBe(true);
  });
});
