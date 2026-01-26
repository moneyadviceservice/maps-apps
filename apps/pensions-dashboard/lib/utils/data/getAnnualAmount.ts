import {
  BenefitIllustrationComponent,
  RecurringIncomeDetails,
} from '../../types';
import { currencyAmount } from '../ui/currency';

/**
 * Gets the annual amount from a BenefitIllustrationComponent
 * @param component
 * @returns the annual amount as a formatted currency string or undefined
 */
export const getAnnualAmount = (component?: BenefitIllustrationComponent) =>
  currencyAmount(
    (component?.payableDetails as RecurringIncomeDetails)?.annualAmount,
  ) ?? undefined;
