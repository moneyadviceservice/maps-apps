import { BenefitType, PensionType } from '../../../lib/constants';

/**
 * Get the calculation type based on pension type or benefit type if Hybrid
 * If a benefitType is not provided for a Hybrid or it is not a DC or DB return undefined.
 * @param pensionType
 * @param benefitType
 * @returns a PensionType
 * @usage
 * const calculationType = getCalculationType(pensionType, benefitType)
 */

export const getCalculationType = (
  pensionType: PensionType,
  benefitType: BenefitType | undefined,
): PensionType | undefined => {
  if (pensionType !== PensionType.HYB) {
    return pensionType;
  }

  return benefitType === BenefitType.DC
    ? PensionType.DC
    : benefitType === BenefitType.DB
    ? PensionType.DB
    : undefined;
};
