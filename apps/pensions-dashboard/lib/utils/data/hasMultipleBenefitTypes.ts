import { BenefitIllustration } from '../../types';

/**
 * Determine whether an arrangement has multiple benefit types.
 * @param benefitIllustrations - an array of BenefitIllustration objects
 * @returns a boolean indicating whether the arrangement has multiple benefit types
 * @usage
 * const showBenefitTypeTitle = hasMultipleBenefitTypes(data.benefitIllustrations)
 */

export const hasMultipleBenefitTypes = (
  benefitIllustrations: BenefitIllustration[] | undefined,
) =>
  benefitIllustrations
    ? new Set(
        benefitIllustrations.flatMap((illustration) =>
          illustration.illustrationComponents
            .map((component) => component.benefitType)
            .filter((type) => type !== undefined),
        ),
      ).size > 1
    : false;
