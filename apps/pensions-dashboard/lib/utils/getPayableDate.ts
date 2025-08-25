import { BenefitIllustrationComponent, RecurringIncomeDetails } from '../types';
import { formatDate } from './formatDate';

export const getPayableDate = (
  component: BenefitIllustrationComponent | undefined,
) => {
  const date = (component?.payableDetails as RecurringIncomeDetails)
    ?.payableDate;

  return date ? formatDate(date) : undefined;
};
