import { BenefitType, PensionType } from '../../../lib/constants';
import { BenefitIllustrationComponent } from '../../types';

/**
 * Get the calculation type based on pension type or benefit type if Hybrid
 * If a benefitType is not provided for a Hybrid or it is not a DC or DB return undefined.
 * @param pensionType
 * @param illustration
 * @returns a PensionType
 * @usage
 * const calculationType = getCalculationType(pensionType, illustration)
 */

export const getCalculationType = (
  pensionType: PensionType,
  illustration: BenefitIllustrationComponent | undefined,
): PensionType | undefined => {
  if (pensionType !== PensionType.HYB) {
    return pensionType;
  }

  const benefitType = illustration?.benefitType;

  return benefitType === BenefitType.DC
    ? PensionType.DC
    : benefitType === BenefitType.DB
    ? PensionType.DB
    : undefined;
};
