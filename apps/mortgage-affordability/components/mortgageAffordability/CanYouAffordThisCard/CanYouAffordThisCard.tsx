import { CanYouAffordThisCopy } from 'data/mortgage-affordability/can-you-afford-this';

import { DataTableCard } from '@maps-react/common/components/DataTableCard';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';

type Props = {
  monthlyIncome: number;
  monthlyPayment: number;
  fixedAndCommittedCosts: number;
  leftOver: number;
};

export const CanYouAffordThisCard = ({
  monthlyIncome,
  monthlyPayment,
  fixedAndCommittedCosts,
  leftOver,
}: Props) => {
  const { z } = useTranslation();
  const d = CanYouAffordThisCopy(z, {
    fLeftOver: formatCurrency(leftOver, 0),
  });

  return (
    <div data-testid="can-you-afford-this">
      <DataTableCard
        data={{
          rows: [
            {
              cells: [
                { data: d.takeHomePay, isHeading: true },
                { data: formatCurrency(monthlyIncome) },
              ],
            },
            {
              cells: [
                { data: d.newMortgagePayment, isHeading: true },
                { data: formatCurrency(monthlyPayment) },
              ],
            },
            {
              cells: [
                { data: d.otherHouseholdCosts, isHeading: true },
                { data: formatCurrency(fixedAndCommittedCosts) },
              ],
            },
            {
              cells: [
                { data: d.leftOver, isHeading: true },
                { data: formatCurrency(leftOver) },
              ],
            },
          ],
        }}
        description={d.description}
        title={d.title}
      />
    </div>
  );
};
