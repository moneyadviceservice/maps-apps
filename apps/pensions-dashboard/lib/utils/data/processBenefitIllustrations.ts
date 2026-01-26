import { IllustrationType, NO_DATA } from '../../constants';
import {
  BenefitIllustration,
  BenefitIllustrationComponent,
  RecurringIncomeDetails,
} from '../../types';
import { currencyAmount } from '../ui/currency';
import { getMostRecentBenefitIllustration } from './getMostRecentBenefitIllustration';
import { getUnavailableCode } from './getUnavailableCode';

/**
 * Processes the benefit illustrations to get the amount, the unavailable code, payable details, and the illustration to use.
 * Assumes there will only be one illustration of each illustration type.
 * @param benefitIllustrations
 * @returns an object containing the monthly amount, unavailable code, payable details, and the illustration used
 * @usage
 * const { monthlyAmount, unavailableCode } = processBenefitIllustrations(benefitIllustrations)
 */
export const processBenefitIllustrations = (
  benefitIllustrations: BenefitIllustration[] | undefined,
) => {
  let amount = 0;
  let unavailableCode: string | undefined;
  let eriUnavailableCode: string | undefined;
  let payableDetails = {} as RecurringIncomeDetails;
  let apPayableDetails = {} as RecurringIncomeDetails;
  let illustrationToUse = {} as BenefitIllustrationComponent;
  let apIllustration = {} as BenefitIllustrationComponent;
  let apAmount = 0;

  const latestBenefitIllustration =
    getMostRecentBenefitIllustration(benefitIllustrations);

  if (latestBenefitIllustration) {
    for (const illustration of latestBenefitIllustration.illustrationComponents) {
      if (illustration.illustrationType === IllustrationType.ERI) {
        const eriPayableDetails =
          illustration.payableDetails as RecurringIncomeDetails;
        amount = eriPayableDetails?.monthlyAmount ?? 0;
        eriUnavailableCode = getUnavailableCode(illustration);
        payableDetails = eriPayableDetails;
        illustrationToUse = illustration;
      }

      if (illustration.illustrationType === IllustrationType.AP) {
        const payableDetails =
          illustration.payableDetails as RecurringIncomeDetails;
        apAmount = payableDetails?.monthlyAmount ?? 0;
        apPayableDetails = payableDetails;
        apIllustration = illustration;
      }

      unavailableCode = getUnavailableCode(illustration);
    }
  }

  // If ERI is unavailable with code "DB" and AP amount is available, use AP amount and AP details
  if (eriUnavailableCode === 'DB' && apAmount > 0) {
    amount = apAmount;
    payableDetails = apPayableDetails;
    illustrationToUse = apIllustration;
  }

  // Use ERI unavailable code if it exists, otherwise use the last unavailable code found
  const finalUnavailableCode = eriUnavailableCode ?? unavailableCode;

  const monthlyAmount = amount === 0 ? NO_DATA : currencyAmount(amount);
  return {
    monthlyAmount,
    unavailableCode: finalUnavailableCode,
    payableDetails,
    illustration: illustrationToUse,
  };
};
