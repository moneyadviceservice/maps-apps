import { IllustrationType } from '../constants';
import { BenefitIllustration, RecurringIncomeDetails } from '../types';
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

  if (benefitIllustrations) {
    for (const benefit of benefitIllustrations) {
      for (const illustration of benefit.illustrationComponents) {
        if (illustration.illustrationType === IllustrationType.ERI) {
          const payableDetails =
            illustration.payableDetails as RecurringIncomeDetails;
          amount = payableDetails?.monthlyAmount ?? 0;
        }
        unavailableCode = getUnavailableCode(illustration);
      }
    }
  }

  const monthlyAmount = amount === 0 ? '£' : currencyAmount(amount);
  return { monthlyAmount, unavailableCode };
};
