import {
  PensionArrangement,
  BenefitIllustration,
  BenefitIllustrationComponent,
  RecurringIncomeDetails,
  AdditionalDataSource,
} from '../types';
import { BenefitType, IllustrationType, InformationType } from '../constants';
import { currencyAmount } from './toCurrency';

export type Totals = { monthlyTotal: number; annualTotal: number };

// Function to process each illustration and get totals
const processIllustration = (
  illustration: BenefitIllustrationComponent,
  totals: Totals,
) => {
  if (illustration.illustrationType === IllustrationType.ERI) {
    const payableDetails =
      illustration.payableDetails as RecurringIncomeDetails;
    const monthly = payableDetails.monthlyAmount ?? 0;
    const annual = payableDetails.annualAmount ?? 0;
    totals.monthlyTotal += monthly;
    totals.annualTotal += annual;
  }
};

// Function to process each benefit and handle illustrations
const processBenefit = (benefit: BenefitIllustration, totals: Totals) => {
  benefit.illustrationComponents.forEach((illustration) => {
    processIllustration(illustration, totals);
  });
};

// Main function to get totals from benefits illustrations
export const getPensionTotals = (data: PensionArrangement[]) => {
  const totals = { monthlyTotal: 0, annualTotal: 0 };
  data.forEach(({ benefitIllustrations }) => {
    benefitIllustrations?.forEach((benefit) => {
      processBenefit(benefit, totals);
    });
  });
  return totals;
};

// Function to get monthly amount from illustration payable details
export const getMonthlyAmount = (
  illustration: BenefitIllustrationComponent,
) => {
  const payableDetails = illustration.payableDetails as RecurringIncomeDetails;
  return currencyAmount(payableDetails.monthlyAmount ?? 0);
};

export const getAnnualAmount = (illustration: BenefitIllustrationComponent) => {
  const payableDetails = illustration.payableDetails as RecurringIncomeDetails;
  return currencyAmount(payableDetails.annualAmount ?? 0);
};

// Function to get more info message based on the additional data information type
export const getMoreInfoMessage = (additonalData: AdditionalDataSource) => {
  switch (additonalData.informationType) {
    case InformationType.C_AND_C:
      return `For more information about costs and charges, go to `;
    case InformationType.SP:
      return `For more information about your State Pension, go to `;
    default:
      return '';
  }
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
