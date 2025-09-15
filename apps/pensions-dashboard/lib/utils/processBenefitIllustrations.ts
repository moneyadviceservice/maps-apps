import { IllustrationType, NO_DATA } from '../constants';
import { BenefitIllustration, RecurringIncomeDetails } from '../types';
import { getMostRecentBenefitIllustration } from './getMostRecentBenefitIllustration';
import { getUnavailableCode } from './getUnavailableCode';
import { currencyAmount } from './toCurrency';

/**
 * *Processes the benefit illustrations to get the amount and the unavailable code
 * @param benefitIllustrations
 * @returns
 */
export const processBenefitIllustrations = (
  benefitIllustrations: BenefitIllustration[] | undefined,
) => {
  let amount = 0;
  let unavailableCode: string | undefined;

  const latestBenefitIllustration =
    getMostRecentBenefitIllustration(benefitIllustrations);

  if (latestBenefitIllustration) {
    for (const illustration of latestBenefitIllustration.illustrationComponents) {
      if (illustration.illustrationType === IllustrationType.ERI) {
        const payableDetails =
          illustration.payableDetails as RecurringIncomeDetails;
        amount = payableDetails?.monthlyAmount ?? 0;
      }
      unavailableCode = getUnavailableCode(illustration);
    }
  }

  const monthlyAmount = amount === 0 ? NO_DATA : currencyAmount(amount);
  return { monthlyAmount, unavailableCode };
};
