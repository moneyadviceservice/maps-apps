import {
  BenefitIllustrationComponent,
  RecurringIncomeDetails,
} from '../../types';
import { currencyAmount } from '../ui/currency';

/**
 * Gets the monthly amount from a BenefitIllustrationComponent
 * @param component
 * @returns the monthly amount as a formatted currency string or undefined
 */
export const getMonthlyAmount = (component?: BenefitIllustrationComponent) =>
  currencyAmount(
    (component?.payableDetails as RecurringIncomeDetails)?.monthlyAmount,
  ) ?? undefined;
