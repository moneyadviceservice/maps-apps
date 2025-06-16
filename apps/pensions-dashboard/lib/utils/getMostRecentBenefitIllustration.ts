import { BenefitIllustration } from '../types';

/**
 * Get the most recent benefit illustration based on the illustration date
 * @param benefitIllustrations
 * @returns the most recent benefit illustration or null if there are no benefit illustrations
 * @usage
 * const latest = getMostRecentBenefitIllustration(data.benefitIllustrations)
 */
export const getMostRecentBenefitIllustration = (
  benefitIllustrations: BenefitIllustration[] | undefined,
): BenefitIllustration | null => {
  if (!benefitIllustrations?.length) {
    return null;
  }

  return benefitIllustrations.toSorted(
    (a, b) =>
      new Date(b.illustrationDate).getTime() -
      new Date(a.illustrationDate).getTime(),
  )[0];
};
