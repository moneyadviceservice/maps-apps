import {
  BenefitIllustration,
  PensionArrangement,
  PensionTotals,
} from '../types';
import { processIllustration } from './processIllustration';

export type Totals = { monthlyTotal: number; annualTotal: number };

const processBenefit = (
  benefit: BenefitIllustration,
  totals: PensionTotals,
): void => {
  benefit.illustrationComponents.forEach((component) => {
    processIllustration(component, totals);
  });
};

export const getPensionTotals = (data: PensionArrangement[]): Totals => {
  const totals = { monthlyTotal: 0, annualTotal: 0 };
  data.forEach(({ benefitIllustrations }) => {
    benefitIllustrations?.forEach((benefit) => {
      processBenefit(benefit, totals);
    });
  });
  return totals;
};
