import { IllustrationType } from '../constants';
import { BenefitIllustrationComponent, PensionArrangement } from '../types';
import { getMostRecentBenefitIllustration } from './getMostRecentBenefitIllustration';

export const getLatestIllustration = (
  type: IllustrationType,
  pension: PensionArrangement,
): BenefitIllustrationComponent | undefined => {
  const latest = getMostRecentBenefitIllustration(pension.benefitIllustrations);

  return latest?.illustrationComponents
    .filter((c) => c.illustrationType === type && c.payableDetails)
    .toSorted((a, b) => {
      return (
        new Date(a.payableDetails?.payableDate ?? 0).getTime() -
        new Date(b.payableDetails?.payableDate ?? 0).getTime()
      );
    })[0];
};
