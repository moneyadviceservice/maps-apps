import { IllustrationType } from '../constants';
import { BenefitIllustration, BenefitIllustrationComponent } from '../types';
import { currencyAmount } from './toCurrency';

/**
 * Utility function to get the pot value from the benefit illustration data
 * @param data
 * @param iType
 * @returns £100,000 or undefined if the data is not available
 * @usage
 * const potValue = getPotValue(data.benefitIllustrations, IllustrationType.AP)
 */
export const getPotValue = (
  data: BenefitIllustration | null,
  iType: IllustrationType,
): string | undefined => {
  if (!data) {
    return undefined;
  }

  const component = data.illustrationComponents.find(
    ({ illustrationType }) => illustrationType === iType,
  ) as BenefitIllustrationComponent;

  return component?.dcPot !== undefined
    ? currencyAmount(component.dcPot)
    : undefined;
};
