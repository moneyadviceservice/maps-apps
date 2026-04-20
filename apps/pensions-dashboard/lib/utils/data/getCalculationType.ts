import { BenefitType, PensionType } from '../../../lib/constants';

/**
 * Get the calculation type based on pension type or benefit type
 * If the pension type is DC or AVC, the calculation type will be the same as the pension type.
 * If the pension type is not DC or AVC, the calculation type will be determined by the benefit type.
 * If a benefit type is not provided, the function will fallback to the pension type.
 * @param pensionType
 * @param benefitType
 * @returns a PensionType
 * @usage
 * const calculationType = getCalculationType(pensionType, benefitType)
 */

const benefitTypeToPensionType: Record<BenefitType, PensionType> = {
  AVC: PensionType.AVC,
  CBL: PensionType.CB,
  CBS: PensionType.CB,
  CDI: PensionType.CDC,
  CDL: PensionType.CDC,
  DB: PensionType.DB,
  DBL: PensionType.DB,
  DC: PensionType.DC,
};

export const getCalculationType = (
  pensionType: PensionType,
  benefitType?: BenefitType,
): PensionType => {
  if (pensionType === PensionType.DC || pensionType === PensionType.AVC) {
    return pensionType;
  }

  return benefitType ? benefitTypeToPensionType[benefitType] : pensionType;
};
