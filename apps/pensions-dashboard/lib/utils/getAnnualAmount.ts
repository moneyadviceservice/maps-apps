import { BenefitIllustrationComponent, RecurringIncomeDetails } from '../types';
import { currencyAmount } from './toCurrency';

export const getAnnualAmount = (component?: BenefitIllustrationComponent) =>
  currencyAmount(
    (component?.payableDetails as RecurringIncomeDetails)?.annualAmount,
  ) ?? undefined;
