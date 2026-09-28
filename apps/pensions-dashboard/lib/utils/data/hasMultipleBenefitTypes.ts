import { BenefitType } from '../../constants';
import { BenefitIllustration } from '../../types';

/**
 * Determine whether an arrangement has multiple benefit types.
 * @param benefitIllustrations - an array of BenefitIllustration objects
 * @returns a boolean indicating whether the arrangement has multiple benefit types
 * @usage
 * const showBenefitTypeTitle = hasMultipleBenefitTypes(data.benefitIllustrations)
 */

const typeMap: Partial<Record<BenefitType, string>> = {
  CDL: 'CDC',
  CDI: 'CDC',
  CBL: 'CB',
  CBS: 'CB',
};

export const hasMultipleBenefitTypes = (
  benefitIllustrations: BenefitIllustration[] | undefined,
) =>
  benefitIllustrations
    ? new Set(
        benefitIllustrations.flatMap((illustration) =>
          illustration.illustrationComponents
            .map((component) => component.benefitType)
            // if benefitType is CDL or CDI these need to be treated as the same type (CDC)
            // if benefitType is CBL or CBS these need to be treated as the same type (CB)
            .map((type) => typeMap[type] ?? type)
            .filter((type) => type !== undefined),
        ),
      ).size > 1
    : false;
