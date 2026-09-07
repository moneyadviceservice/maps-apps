import { WhatIfInterestRatesRiseCopy } from 'data/mortgage-affordability/what-if-interest-rates-rise';
import {
  calculateLeftOver,
  calculateMonthlyPayment,
} from 'utils/MortgageAffordabilityCalculator/calculateResultValues';

import { DataTableCard } from '@maps-react/common/components/DataTableCard';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';

export type Props = {
  borrowAmount: number;
  interest: number;
  term: number;
  monthlyIncome: number;
  fixedAndCommittedCosts: number;
  livingCosts: number;
};

export const WhatIfInterestRatesRiseCard = ({
  borrowAmount,
  interest,
  term,
  monthlyIncome,
  fixedAndCommittedCosts,
  livingCosts,
}: Props) => {
  const rows = [];

  for (let idx = 0; idx < 3; idx++) {
    const increasedInterest = interest + 3 + idx;
    const monthlyPaymentWithRise = calculateMonthlyPayment(
      borrowAmount,
      increasedInterest,
      term,
    );
    const leftOverWithRise = calculateLeftOver(
      monthlyIncome,
      fixedAndCommittedCosts,
      livingCosts,
      monthlyPaymentWithRise,
    );
    rows.push({
      cells: [
        { data: `${increasedInterest}%`, className: 'font-bold' },
        {
          data: formatCurrency(monthlyPaymentWithRise),
          className: 'font-bold',
        },
        { data: formatCurrency(leftOverWithRise), className: 'font-bold' },
      ],
    });
  }

  const { z } = useTranslation();
  const d = WhatIfInterestRatesRiseCopy(z, {
    rateIncreaseValue: rows[0].cells,
  });

  return (
    <div data-testid="what-if-interest-rates-rise">
      <DataTableCard
        title={d.title}
        description={d.description}
        tableLayout={'fixed'}
        columnHeadings={[
          d.tableHeadings.rate,
          d.tableHeadings.newPayment,
          d.tableHeadings.moneyLeft,
        ]}
        data={{
          rows,
        }}
      />
    </div>
  );
};
