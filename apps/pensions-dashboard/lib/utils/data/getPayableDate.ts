import {
  BenefitIllustrationComponent,
  RecurringIncomeDetails,
} from '../../types';
import { formatDate } from '../ui/date';

/**
 * Gets the payable date from a BenefitIllustrationComponent
 * @param component
 * @returns payable date as a formatted string or undefined
 */
export const getPayableDate = (
  component: BenefitIllustrationComponent | undefined,
) => {
  const date = (component?.payableDetails as RecurringIncomeDetails)
    ?.payableDate;

  return date ? formatDate(date) : undefined;
};
