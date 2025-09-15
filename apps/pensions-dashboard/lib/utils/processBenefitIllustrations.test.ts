import { IllustrationType } from '../constants';
import { BenefitIllustrationComponent, RecurringIncomeDetails } from '../types';
import { processIllustration } from './processIllustration';

describe('processIllustration', () => {
  let totals: { monthlyTotal: number; annualTotal: number };
  let component: BenefitIllustrationComponent;

  beforeEach(() => {
    totals = { monthlyTotal: 0, annualTotal: 0 };
  });

  it.each`
    monthlyAmount | annualAmount | expectedMonthlyTotal | expectedAnnualTotal
    ${100}        | ${1200}      | ${100}               | ${1200}
    ${undefined}  | ${undefined} | ${0}                 | ${0}
  `(
    'should process illustration correctly with monthlyAmount: $monthlyAmount, annualAmount: $annualAmount',
    ({
      monthlyAmount,
      annualAmount,
      expectedMonthlyTotal,
      expectedAnnualTotal,
    }) => {
      component = {
        illustrationType: IllustrationType.ERI,
        payableDetails: {
          monthlyAmount,
          annualAmount,
        } as RecurringIncomeDetails,
      } as BenefitIllustrationComponent;

      processIllustration(component, totals);
      expect(totals.monthlyTotal).toBe(expectedMonthlyTotal);
      expect(totals.annualTotal).toBe(expectedAnnualTotal);
    },
  );
});
