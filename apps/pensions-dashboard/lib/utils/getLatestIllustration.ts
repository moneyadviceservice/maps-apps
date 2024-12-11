import { IllustrationType } from '../constants';
import { BenefitIllustrationComponent, PensionArrangement } from '../types';

export const getLatestIllustration = (
  type: IllustrationType,
  pension: PensionArrangement,
): BenefitIllustrationComponent | null => {
  let latestIllustrationDate: Date | null = null;
  let earliestPayableDate: Date | null = null;
  let latestComponent: BenefitIllustrationComponent | null = null;

  if (pension.benefitIllustrations) {
    pension.benefitIllustrations.forEach((illustration) => {
      const illustrationDate = new Date(illustration.illustrationDate);

      // Check if this is the latest illustration date
      if (
        latestIllustrationDate === null ||
        illustrationDate > latestIllustrationDate
      ) {
        latestIllustrationDate = illustrationDate;
        earliestPayableDate = null; // Reset payable date for the new latest illustration
      }

      // Only continue if this is the latest illustration date
      if (illustrationDate.getTime() === latestIllustrationDate.getTime()) {
        illustration.illustrationComponents.forEach((component) => {
          if (component.illustrationType === type) {
            if (component.payableDetails) {
              const payableDate = new Date(
                component.payableDetails.payableDate,
              );

              // Check if this is the earliest payable date
              if (
                earliestPayableDate === null ||
                payableDate < earliestPayableDate
              ) {
                earliestPayableDate = payableDate;
                latestComponent = component;
              }
            }
          }
        });
      }
    });
  }

  return latestComponent;
};
