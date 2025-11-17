import {
  BenefitIllustrationComponent,
  RecurringIncomeDetails,
} from '../../types';
import { currencyAmount } from '../ui/currency';

export const getAnnualAmount = (component?: BenefitIllustrationComponent) =>
  currencyAmount(
    (component?.payableDetails as RecurringIncomeDetails)?.annualAmount,
  ) ?? undefined;
