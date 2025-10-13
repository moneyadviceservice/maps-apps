import { IllustrationType, LumpSumAmountType } from '../constants';
import {
  BenefitIllustration,
  BenefitIllustrationComponent,
  LumpSumDetails,
  PensionArrangement,
} from '../types';

// Returns a BenefitIllustration that contains a lump sum illustration component
// with the earliest payable date
// If no such illustration exists, returns undefined
export const getLumpSumBenefitIllustration = (
  benefitIllustrations?: BenefitIllustration[],
): BenefitIllustration | undefined => {
  if (!benefitIllustrations?.length) return undefined;

  const getEarliestPayableDate = (illustration: BenefitIllustration): number =>
    Math.min(
      ...illustration.illustrationComponents.map((c) =>
        new Date(c.payableDetails?.payableDate ?? 0).getTime(),
      ),
    );

  // 1. Keep only illustrations that have a lump sum
  // 2. Sort them by earliest payable date and return the earliest one
  const lumpSumIllustration = benefitIllustrations
    .filter((illustration) =>
      illustration.illustrationComponents.some(
        (component) =>
          (component?.payableDetails as LumpSumDetails)?.amountType ===
          LumpSumAmountType.CSH,
      ),
    )
    .toSorted(
      (a, b) => getEarliestPayableDate(a) - getEarliestPayableDate(b),
    )[0];

  if (!lumpSumIllustration) return undefined;

  return lumpSumIllustration;
};

// Returns a BenefitIllustrationComponent that contains a lump sum
// with the earliest payable date of all lump sum illustrations
// that matches the specified type
export const getLumpSumIllustration = (
  type: IllustrationType,
  benefitIllustrations?: BenefitIllustration[],
): BenefitIllustrationComponent | undefined => {
  const illustration = getLumpSumBenefitIllustration(benefitIllustrations);
  if (!illustration) {
    return undefined;
  }

  return illustration.illustrationComponents.filter(
    (c) => c.illustrationType === type,
  )[0];
};

// Returns true if any of the pensions have a tax-free lump sum illustration
export const hasTaxFreeLumpSum = (pensions: PensionArrangement[]): boolean => {
  return pensions.some((pension) => {
    return pension.benefitIllustrations?.some((illustration) => {
      return illustration.illustrationComponents.some((component) => {
        return (
          (component?.payableDetails as LumpSumDetails)?.amountType ===
          LumpSumAmountType.CSH
        );
      });
    });
  });
};
