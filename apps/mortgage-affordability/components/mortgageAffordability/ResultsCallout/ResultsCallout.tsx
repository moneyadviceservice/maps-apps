import { AFFORDABILITY_EXPENSE_FIELDS } from 'data/mortgage-affordability/CONSTANTS';
import { resultsCalloutCopy } from 'data/mortgage-affordability/results';
import {
  IncomeFieldKeys,
  OtherFieldKeys,
} from 'data/mortgage-affordability/step';
import {
  calculateLeftOver,
  calculateMonthlyPayment,
  calculateRiskLevel,
  calculateRiskPercentage,
  calculateTotalFormValues,
} from 'utils/MortgageAffordabilityCalculator/calculateResultValues';

import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';

type CalloutRiskLevel = 'success' | 'warning';

type Props = {
  borrowAmount: number;
  interest: number;
  term: number;
  monthlyIncome: number;
  fixedAndCommittedCosts: number;
  livingCosts: number;
  formData: Record<string, string>;
};

export const ResultsCallout = ({
  borrowAmount,
  interest,
  term,
  monthlyIncome,
  fixedAndCommittedCosts,
  livingCosts,
  formData,
}: Props) => {
  const { z } = useTranslation();

  const incomeFields = [IncomeFieldKeys.TAKE_HOME];
  if (formData[OtherFieldKeys.SECOND_APPLICANT] === 'yes') {
    incomeFields.push(IncomeFieldKeys.SEC_TAKE_HOME);
  }

  const monthlyPayment = calculateMonthlyPayment(borrowAmount, interest, term);
  const interestIncreased = interest + 3;
  const monthlyPaymentWithRise = calculateMonthlyPayment(
    borrowAmount,
    interestIncreased,
    term,
  );

  const leftOverWithRise = calculateLeftOver(
    monthlyIncome,
    fixedAndCommittedCosts,
    livingCosts,
    monthlyPaymentWithRise,
  );

  const riskPercentage = calculateRiskPercentage(
    AFFORDABILITY_EXPENSE_FIELDS,
    incomeFields,
    monthlyPayment,
    formData,
  );
  const displayPercentage = Math.min(100, riskPercentage);

  const monthlyOutgoings = calculateTotalFormValues(
    AFFORDABILITY_EXPENSE_FIELDS,
    formData,
  );
  const monthlyTakeHome = calculateTotalFormValues(incomeFields, formData);
  const essentialMonthlyCosts = monthlyOutgoings + monthlyPayment;
  const payLeftOverAfterCosts = monthlyTakeHome - essentialMonthlyCosts;

  const d = resultsCalloutCopy(z, {
    percentage: `${Math.round(displayPercentage)}`,
    leftOver: formatCurrency(payLeftOverAfterCosts),
    leftOverIncreased: formatCurrency(leftOverWithRise),
  });

  // The rating shown here is only ever green or amber; percentages are clamped
  // at 100 and budgets beyond that are covered by the overstretched notice page.
  const riskLevel = calculateRiskLevel(displayPercentage);
  const calloutLevel: CalloutRiskLevel =
    riskLevel === 'success' ? 'success' : 'warning';
  const tcopy = d.teaserInfo[calloutLevel];

  const getVariant = (riskLevel: CalloutRiskLevel) => {
    switch (riskLevel) {
      case 'success':
        return CalloutVariant.POSITIVE;
      case 'warning':
        return CalloutVariant.WARNING;
    }
  };

  return (
    <Callout
      variant={getVariant(calloutLevel)}
      className="mb-8 p-[40px] pt-6"
      testId="ResultsCallout"
    >
      <Paragraph className="md:text-[38px] leading-tight pb-4 font-semibold">
        {tcopy.heading}
      </Paragraph>
      <div>{tcopy.text}</div>
    </Callout>
  );
};
