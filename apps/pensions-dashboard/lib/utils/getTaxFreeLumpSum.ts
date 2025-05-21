import { BenefitIllustrationComponent, LumpSumDetails } from '../types';
import { currencyAmount } from './toCurrency';

export const getTaxFreeLumpSum = (
  illustration?: BenefitIllustrationComponent,
) => currencyAmount((illustration?.payableDetails as LumpSumDetails)?.amount);
