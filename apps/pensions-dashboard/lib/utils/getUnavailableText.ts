import { AmountNotProvidedReason, UnavailableReason } from '../constants';
import {
  AmountNotProvidedDetails,
  BenefitIllustration,
  BenefitIllustrationComponent,
} from '../types';

const reasonMessages: Record<
  UnavailableReason | AmountNotProvidedReason,
  string
> = {
  [UnavailableReason.ANO]: 'ANO',
  [UnavailableReason.DB]: 'DB',
  [UnavailableReason.DBC]:
    'Your provider needs more time to calculate an estimated income. It can take ten days. Check back again soon.',
  [UnavailableReason.DCC]: 'DCC',
  [UnavailableReason.DCHA]: 'DCHA',
  [UnavailableReason.DCHP]: 'DCHP',
  [UnavailableReason.DCSM]: 'DCSM',
  [UnavailableReason.MEM]: 'MEM',
  [UnavailableReason.NEW]:
    'This pension is less than three months old, so your provider cannot provide any information yet. Check back again soon.',
  [UnavailableReason.NET]: 'NET',
  [UnavailableReason.PPF]: 'PPF',
  [UnavailableReason.TRN]: 'TRN',
  [UnavailableReason.WU]: 'WU',
  [AmountNotProvidedReason.SML]: 'SML',
};

// Checks two different values to get the reason message - unavailableReason and reason
const getReasonFromIllustration = (
  illustration: BenefitIllustrationComponent,
): string | undefined => {
  if (
    illustration.unavailableReason &&
    reasonMessages[illustration.unavailableReason]
  ) {
    return reasonMessages[illustration.unavailableReason];
  }
  const payableDetails =
    illustration.payableDetails as AmountNotProvidedDetails;

  if (payableDetails.reason && reasonMessages[payableDetails.reason]) {
    return reasonMessages[payableDetails.reason];
  }
};

// Get the unavailable reason from the benefit illustrations
export const getUnavailableText = (
  benefitIllustrations: BenefitIllustration[] | undefined,
): string | undefined => {
  if (!benefitIllustrations) {
    return undefined;
  }
  for (const benefit of benefitIllustrations) {
    for (const illustration of benefit.illustrationComponents) {
      const unavailableText = getReasonFromIllustration(illustration);
      if (unavailableText) {
        return unavailableText;
      }
    }
  }
};
