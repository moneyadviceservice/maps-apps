import { IllustrationType } from '../../constants';
import {
  BenefitIllustrationComponent,
  PensionTotals,
  RecurringIncomeDetails,
} from '../../types';

export const processIllustration = (
  component: BenefitIllustrationComponent,
  totals: PensionTotals,
): void => {
  if (component.illustrationType === IllustrationType.ERI) {
    const payableDetails = component.payableDetails as RecurringIncomeDetails;
    const monthly = payableDetails?.monthlyAmount ?? 0;
    const annual = payableDetails?.annualAmount ?? 0;
    totals.monthlyTotal += monthly;
    totals.annualTotal += annual;
  }
};
