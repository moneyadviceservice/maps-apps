import { BenefitType, IllustrationType } from '../constants';
import {
  BenefitIllustration,
  BenefitIllustrationComponent,
  PensionArrangement,
  RecurringIncomeDetails,
} from '../types';
import { currencyAmount } from './toCurrency';

export type Totals = { monthlyTotal: number; annualTotal: number };

/**
 * Function to process each illustration and get totals
 */
export const processIllustration = (
  component: BenefitIllustrationComponent,
  totals: Totals,
): void => {
  if (component.illustrationType === IllustrationType.ERI) {
    const payableDetails = component.payableDetails as RecurringIncomeDetails;
    const monthly = payableDetails?.monthlyAmount ?? 0;
    const annual = payableDetails?.annualAmount ?? 0;
    totals.monthlyTotal += monthly;
    totals.annualTotal += annual;
  }
};

/**
 * Function to process each benefit and get totals
 */
const processBenefit = (benefit: BenefitIllustration, totals: Totals): void => {
  benefit.illustrationComponents.forEach((component) => {
    processIllustration(component, totals);
  });
};

/**
 * Main function to get totals from benefits illustrations
 */
export const getPensionTotals = (data: PensionArrangement[]): Totals => {
  const totals = { monthlyTotal: 0, annualTotal: 0 };
  data.forEach(({ benefitIllustrations }) => {
    benefitIllustrations?.forEach((benefit) => {
      processBenefit(benefit, totals);
    });
  });
  return totals;
};

// Function to get monthly amount from benifitIllustrationComponent payable details
export const getMonthlyAmount = (
  component: BenefitIllustrationComponent | undefined,
) => {
  const monthlyAmount = (component?.payableDetails as RecurringIncomeDetails)
    ?.monthlyAmount;
  return monthlyAmount !== undefined && monthlyAmount !== null
    ? currencyAmount(monthlyAmount)
    : undefined;
};

export const getAnnualAmount = (
  component: BenefitIllustrationComponent | undefined,
) => {
  const annualAmount = (component?.payableDetails as RecurringIncomeDetails)
    ?.annualAmount;
  return annualAmount !== undefined && annualAmount !== null
    ? currencyAmount(annualAmount)
    : undefined;
};

// Function to get benefit type
export const getBenefitType: Record<BenefitType, string> = {
  [BenefitType.AVC]: 'Additional voluntary contribution',
  [BenefitType.CBL]: 'Cash balance expressed as a lump sum',
  [BenefitType.CBS]: 'Cash balance',
  [BenefitType.CDI]:
    'Collective direct contribution benefits expressed as regular income',
  [BenefitType.CDL]:
    'Collective direct contribution benefits expressed as a lump sum',
  [BenefitType.DB]: 'Defined Benefit',
  [BenefitType.DBL]: 'Defined benefit with separately accrued lump sum',
  [BenefitType.DC]: 'Defined Contribution',
  [BenefitType.SP]: 'State Pension',
};
