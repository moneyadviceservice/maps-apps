import { BenefitIllustrationComponent, RecurringIncomeDetails } from '../types';
import { currencyAmount } from './toCurrency';

export const getMonthlyAmount = (component?: BenefitIllustrationComponent) =>
  currencyAmount(
    (component?.payableDetails as RecurringIncomeDetails)?.monthlyAmount,
  ) ?? undefined;
